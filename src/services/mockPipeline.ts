import * as FileSystem from 'expo-file-system/legacy';

export interface PipelineCallbacks {
  onStageChange: (stage: number, label: string) => void;
  onTurn: (speaker: 'HOST1' | 'HOST2', text: string) => void;
  onComplete: (episodeId: string) => void;
  onError: (message: string) => void;
}

const MOCK_SCRIPT: Array<{ speaker: 'HOST1' | 'HOST2'; text: string }> = [
  { speaker: 'HOST1', text: "Welcome back to Private Podcast! Today we're diving into something I find absolutely fascinating." },
  { speaker: 'HOST2', text: "Thanks for having me. I've been looking forward to this conversation all week." },
  { speaker: 'HOST1', text: "So let's get right into it — can you give our listeners a quick overview of what we're covering today?" },
  { speaker: 'HOST2', text: "Absolutely. We're going to break down the key ideas, explore what makes this topic so relevant right now, and I'll share some insights that might surprise you." },
  { speaker: 'HOST1', text: "Wait, surprising insights? Now I'm even more excited. [laughs]" },
  { speaker: 'HOST2', text: "I thought that would get your attention. [laughs] So let's start with the basics." },
  { speaker: 'HOST1', text: "Perfect. Walk me through it like I've never heard of this before." },
  { speaker: 'HOST2', text: "Great way to approach it. At its core, this is about how information transforms the way we think and act in the world." },
  { speaker: 'HOST1', text: "That's a really interesting framing. So it's less about the technology itself and more about the impact?" },
  { speaker: 'HOST2', text: "Exactly. The technology is just the vehicle. The real story is what happens to people and communities when knowledge becomes more accessible." },
  { speaker: 'HOST1', text: "I love that perspective. Can you give us a concrete example?" },
  { speaker: 'HOST2', text: "Sure. Think about how a doctor in a rural area can now access the same research as someone at a top university. That gap used to be enormous." },
  { speaker: 'HOST1', text: "And that gap closing — that's the real revolution you're talking about." },
  { speaker: 'HOST2', text: "Precisely. And it's happening faster than most people realise. [pauses] The implications are profound." },
  { speaker: 'HOST1', text: "This has been such an eye-opening conversation. What's your one key takeaway for our listeners?" },
  { speaker: 'HOST2', text: "The tools are here. The question is whether we choose to use them to level the playing field. That choice is ours to make." },
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

export async function runMockPipeline(
  topic: string,
  callbacks: PipelineCallbacks
): Promise<void> {
  try {
    // Stage 0: Reading document
    callbacks.onStageChange(0, 'Reading document...');
    await sleep(1500);

    // Stage 1: Writing script
    callbacks.onStageChange(1, 'Writing script...');
    for (const turn of MOCK_SCRIPT) {
      await sleep(400);
      callbacks.onTurn(turn.speaker, turn.text);
    }
    await sleep(500);

    // Stage 2: Synthesising voices
    callbacks.onStageChange(2, 'Synthesising voices...');
    await sleep(2000);

    // Stage 3: Assembling audio
    callbacks.onStageChange(3, 'Assembling audio...');
    await sleep(1500);

    // Create a silent mock MP3 file
    const episodeId = generateId();
    const dir = (FileSystem.documentDirectory ?? '') + 'podcasts/';
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    const mp3Path = dir + episodeId + '.mp3';

    // Write a tiny placeholder file
    await FileSystem.writeAsStringAsync(mp3Path, 'MOCK_AUDIO', {
      encoding: FileSystem.EncodingType.UTF8,
    });

    callbacks.onComplete(episodeId);

  } catch (e: any) {
    callbacks.onError(e?.message ?? 'Pipeline failed');
  }
}
