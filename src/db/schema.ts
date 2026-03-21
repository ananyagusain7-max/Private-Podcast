import * as SQLite from 'expo-sqlite';

import type { Episode, SourceType, Speaker, SpeakerTurn } from '../types';

const DB_NAME = 'private_podcast.db';

type Migration = {
  id: number;
  name: string;
  sql: string[];
};

type DbEpisodeRow = {
  id: string;
  title: string;
  topic: string | null;
  source_name: string | null;
  source_type: SourceType | null;
  mp3_path: string;
  duration_seconds: number | null;
  turns: number | null;
  model_used: string | null;
  created_at: number;
  script_json: string | null;
};

type MigrationRow = {
  id: number;
};

const migrations: Migration[] = [
  {
    id: 1,
    name: 'create_core_tables',
    sql: [
      `CREATE TABLE episodes (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        topic TEXT,
        source_name TEXT,
        source_type TEXT,
        mp3_path TEXT NOT NULL,
        duration_seconds INTEGER,
        turns INTEGER,
        model_used TEXT,
        created_at INTEGER,
        script_json TEXT
      );`,
      `CREATE TABLE settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );`,
    ],
  },
];

let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

function getDb(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync(DB_NAME);
  }
  return dbPromise;
}

function safeParseScript(scriptJson: string | null): SpeakerTurn[] {
  if (!scriptJson) {
    return [];
  }

  try {
    const parsed = JSON.parse(scriptJson);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.flatMap((item): SpeakerTurn[] => {
      if (!item || typeof item !== 'object') {
        return [];
      }

      const candidate = item as {
        speaker?: unknown;
        text?: unknown;
        emotions?: unknown;
      };

      if (candidate.speaker !== 'HOST1' && candidate.speaker !== 'HOST2') {
        return [];
      }
      if (typeof candidate.text !== 'string') {
        return [];
      }
      if (!Array.isArray(candidate.emotions) || !candidate.emotions.every((e) => typeof e === 'string')) {
        return [];
      }

      return [
        {
          speaker: candidate.speaker as Speaker,
          text: candidate.text,
          emotions: candidate.emotions,
        },
      ];
    });
  } catch {
    return [];
  }
}

function safeStringifyScript(script: SpeakerTurn[]): string {
  try {
    return JSON.stringify(script);
  } catch {
    return '[]';
  }
}

function mapRowToEpisode(row: DbEpisodeRow): Episode {
  return {
    id: row.id,
    title: row.title,
    topic: row.topic,
    sourceName: row.source_name,
    sourceType: row.source_type,
    mp3Path: row.mp3_path,
    durationSeconds: row.duration_seconds,
    turns: row.turns,
    modelUsed: row.model_used,
    createdAt: row.created_at,
    script: safeParseScript(row.script_json),
  };
}

export async function initDb(): Promise<void> {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS migrations (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      applied_at INTEGER NOT NULL
    );
  `);

  const applied = await db.getAllAsync<MigrationRow>('SELECT id FROM migrations ORDER BY id ASC;');
  const appliedIds = new Set(applied.map((migration) => migration.id));

  for (const migration of migrations) {
    if (appliedIds.has(migration.id)) {
      continue;
    }

    await db.withTransactionAsync(async () => {
      for (const statement of migration.sql) {
        await db.execAsync(statement);
      }

      await db.runAsync(
        'INSERT INTO migrations (id, name, applied_at) VALUES (?, ?, ?);',
        migration.id,
        migration.name,
        Date.now(),
      );
    });
  }
}

export async function getAllEpisodes(): Promise<Episode[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<DbEpisodeRow>('SELECT * FROM episodes ORDER BY created_at DESC;');
  return rows.map(mapRowToEpisode);
}

export async function insertEpisode(episode: Episode): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT OR REPLACE INTO episodes (
      id,
      title,
      topic,
      source_name,
      source_type,
      mp3_path,
      duration_seconds,
      turns,
      model_used,
      created_at,
      script_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    episode.id,
    episode.title,
    episode.topic ?? null,
    episode.sourceName ?? null,
    episode.sourceType ?? null,
    episode.mp3Path,
    episode.durationSeconds ?? null,
    episode.turns ?? null,
    episode.modelUsed ?? null,
    episode.createdAt,
    safeStringifyScript(episode.script),
  );
}

export async function deleteEpisode(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM episodes WHERE id = ?;', id);
}

export async function clearEpisodes(): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM episodes;');
}

export async function getSetting(key: string): Promise<string | null> {
  const db = await getDb();
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM settings WHERE key = ?;', key);
  return row?.value ?? null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO settings (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    key,
    value,
  );
}
