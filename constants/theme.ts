export const COLORS = {
  // Backgrounds
  dark:       '#0D0F1A',
  navy:       '#141728',
  card:       '#1E2440',
  cardBorder: '#2D3A5C',

  // Brand
  purple:     '#6C3FC5',
  violet:     '#8B5CF6',
  teal:       '#0EA5E9',
  mint:       '#10B981',
  gold:       '#F59E0B',
  coral:      '#D85A30',

  // Text
  white:      '#FFFFFF',
  muted:      '#94A3B8',
  subtle:     '#CBD5E0',

  // Host colours
  host1:      '#6C3FC5',
  host2:      '#0EA5E9',
} as const;

export const FONTS = {
  display:  { fontSize: 28, fontWeight: '800' as const },
  heading:  { fontSize: 20, fontWeight: '600' as const },
  body:     { fontSize: 15, fontWeight: '400' as const },
  caption:  { fontSize: 12, fontWeight: '400' as const },
  mono:     { fontSize: 13, fontFamily: 'Courier' },
} as const;