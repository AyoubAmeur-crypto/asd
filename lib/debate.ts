import asdData from '@/content/asd-iv.json';

export const LANGUAGES = [
  {
    id: 'english',
    code: 'EN',
    order: '01',
    label: 'English',
    native: 'English',
    dir: 'ltr' as const,
    stageTitle: 'ENGLISH ARENA',
    tagline: 'Policy architecture, comparative weighing & cross-examination impact.',
    seatsLabel: '03 GOVERNMENT VS 03 OPPOSITION',
  },
  {
    id: 'french',
    code: 'FR',
    order: '02',
    label: 'Français',
    native: 'Français',
    dir: 'ltr' as const,
    stageTitle: 'ARÈNE FRANÇAISE',
    tagline: 'Rigueur dialectique, cadrage conceptuel & force de conviction.',
    seatsLabel: '03 GOUVERNEMENT VS 03 OPPOSITION',
  },
  {
    id: 'arabic',
    code: 'AR',
    order: '03',
    label: 'العربية',
    native: 'العربية',
    dir: 'rtl' as const,
    stageTitle: 'الحلبة العربية',
    tagline: 'فصاحة البيان، دقة المحاجة وفن الإقناع البرلماني الرصين.',
    seatsLabel: '03 الموالاة ضد 03 المعارضة',
  },
] as const;

export type LanguageId = (typeof LANGUAGES)[number]['id'];
export type Side = 'for' | 'against';
export type SpeechMode = 'standard' | 'reply';

export type Debater = {
  id: string;
  name: string;
  side: Side;
  position: number;
  speechMode: SpeechMode;
  roleLabel: string;
};

export type DebateSection = {
  id: LanguageId;
  title: string;
  debaters: Debater[];
};

export type TimerState = {
  elapsed: number;
  startedAt: number | null;
  running: boolean;
};

export const STORAGE_KEY = 'asd-iv-console-v2';

/**
 * Official WSD Speech Timing:
 * - Standard speech: 8 minutes (480,000 ms)
 * - Reply speech: 4 minutes (240,000 ms)
 * - Visual warning threshold: 5 minutes (300,000 ms) for standard speech
 */
export const LIMIT_STANDARD_MS = 8 * 60 * 1000; // 08:00
export const LIMIT_REPLY_MS = 4 * 60 * 1000; // 04:00
export const WARNING_STANDARD_MS = 5 * 60 * 1000; // 05:00 warning
export const WARNING_REPLY_MS = 3 * 60 * 1000; // 03:00 warning for reply

export const STEP_MS = 10 * 1000;

export const OFFICIAL_LINKS = {
  instagram: 'https://www.instagram.com/allstardebate',
  instagramClub: 'https://www.instagram.com/tgd_ensaf/',
  youtube: 'https://www.youtube.com/@TheGreatDebatersENSAF',
} as const;

/**
 * Builds the initial default roster from the authoritative confirmed roster in asd-iv.json.
 */
export const initialSections: DebateSection[] = asdData.sections.map((sec) => {
  const langId = sec.id as LanguageId;
  const govMembers = sec.teams.government.members.map((m) => ({
    id: `${langId}-gov-${m.order}`,
    name: m.name,
    side: 'for' as Side,
    position: m.order,
    speechMode: (m.order === 3 ? 'reply' : 'standard') as SpeechMode,
    roleLabel: m.role,
  }));
  const oppMembers = sec.teams.opposition.members.map((m) => ({
    id: `${langId}-opp-${m.order}`,
    name: m.name,
    side: 'against' as Side,
    position: m.order,
    speechMode: (m.order === 3 ? 'reply' : 'standard') as SpeechMode,
    roleLabel: m.role,
  }));

  return {
    id: langId,
    title: sec.language,
    debaters: [...govMembers, ...oppMembers],
  };
});

export function createDefaultTimer(): TimerState {
  return { elapsed: 0, startedAt: null, running: false };
}

/**
 * Computes effective elapsed milliseconds using wall-clock delta.
 * Never returns a negative value even if system clock drifts.
 */
export function getEffectiveElapsed(timer: TimerState | undefined, now: number): number {
  if (!timer) return 0;
  const base = Math.max(0, Number.isFinite(timer.elapsed) ? timer.elapsed : 0);
  if (timer.running && timer.startedAt !== null && Number.isFinite(timer.startedAt)) {
    const delta = Math.max(0, now - timer.startedAt);
    return base + delta;
  }
  return base;
}

export function getLimitMs(mode: SpeechMode = 'standard'): number {
  return mode === 'reply' ? LIMIT_REPLY_MS : LIMIT_STANDARD_MS;
}

export function getWarningMs(mode: SpeechMode = 'standard'): number {
  return mode === 'reply' ? WARNING_REPLY_MS : WARNING_STANDARD_MS;
}

/**
 * Warning triggers:
 * For standard speeches: at strictly >= 5 minutes (300,000 ms).
 * For reply speeches: at strictly >= 3 minutes (180,000 ms).
 */
export function isWarning(elapsedMs: number, mode: SpeechMode = 'standard'): boolean {
  return elapsedMs >= getWarningMs(mode);
}

/**
 * Official Overtime is strictly > official limit:
 * For standard speeches: strictly > 8 minutes (480,000 ms).
 * For reply speeches: strictly > 4 minutes (240,000 ms).
 */
export function isOvertime(elapsedMs: number, mode: SpeechMode = 'standard'): boolean {
  return elapsedMs > getLimitMs(mode);
}

/**
 * Formats milliseconds into MM:SS (or HH:MM:SS when elapsed >= 1 hour).
 * Always counts upward and never clamps.
 */
export function formatTime(ms: number): string {
  const clamped = Math.max(0, Math.floor(ms));
  const totalSeconds = Math.floor(clamped / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function formatTenths(ms: number): string {
  const clamped = Math.max(0, Math.floor(ms));
  return String(Math.floor((clamped % 1000) / 100));
}

export function formatOvertimeDelta(ms: number, mode: SpeechMode = 'standard'): string {
  const limit = getLimitMs(mode);
  if (ms <= limit) return '+00:00';
  return `+${formatTime(ms - limit)}`;
}

export function toggleTimerInMap(
  timers: Record<string, TimerState>,
  targetId: string,
  now: number,
  exclusiveMode = false
): Record<string, TimerState> {
  const current = timers[targetId] ?? createDefaultTimer();
  const nextRunning = !current.running;
  const next: Record<string, TimerState> = { ...timers };

  if (nextRunning && exclusiveMode) {
    for (const [id, t] of Object.entries(next)) {
      if (id !== targetId && t.running) {
        next[id] = {
          elapsed: getEffectiveElapsed(t, now),
          startedAt: null,
          running: false,
        };
      }
    }
  }

  next[targetId] = current.running
    ? {
        elapsed: getEffectiveElapsed(current, now),
        startedAt: null,
        running: false,
      }
    : {
        elapsed: Math.max(0, current.elapsed),
        startedAt: now,
        running: true,
      };

  return next;
}

export function adjustTimerInMap(
  timers: Record<string, TimerState>,
  targetId: string,
  deltaMs: number,
  now: number
): Record<string, TimerState> {
  const current = timers[targetId] ?? createDefaultTimer();
  const nextElapsed = Math.max(0, getEffectiveElapsed(current, now) + deltaMs);
  return {
    ...timers,
    [targetId]: {
      elapsed: nextElapsed,
      startedAt: current.running ? now : null,
      running: current.running,
    },
  };
}

export function resetTimerInMap(
  timers: Record<string, TimerState>,
  targetId: string
): Record<string, TimerState> {
  return {
    ...timers,
    [targetId]: createDefaultTimer(),
  };
}

export function pauseAllTimersInMap(
  timers: Record<string, TimerState>,
  now: number
): Record<string, TimerState> {
  const next: Record<string, TimerState> = {};
  for (const [id, t] of Object.entries(timers)) {
    next[id] = t.running
      ? { elapsed: getEffectiveElapsed(t, now), startedAt: null, running: false }
      : t;
  }
  return next;
}

export function sanitizeStoredSections(raw: unknown): DebateSection[] {
  if (!Array.isArray(raw)) return initialSections;
  return initialSections.map((defaultSection) => {
    const foundSection = raw.find(
      (s): s is Record<string, unknown> =>
        typeof s === 'object' && s !== null && (s as Record<string, unknown>).id === defaultSection.id
    );
    if (!foundSection || !Array.isArray(foundSection.debaters)) {
      return defaultSection;
    }
    const rawDebaters = foundSection.debaters as unknown[];
    return {
      ...defaultSection,
      debaters: defaultSection.debaters.map((defaultDebater) => {
        const foundDebater = rawDebaters.find(
          (d: unknown): d is Record<string, unknown> =>
            typeof d === 'object' && d !== null && (d as Record<string, unknown>).id === defaultDebater.id
        );
        return {
          ...defaultDebater,
          name:
            foundDebater && typeof foundDebater.name === 'string' && foundDebater.name.trim().length > 0
              ? foundDebater.name.slice(0, 80)
              : defaultDebater.name,
          speechMode:
            foundDebater && (foundDebater.speechMode === 'reply' || foundDebater.speechMode === 'standard')
              ? (foundDebater.speechMode as SpeechMode)
              : defaultDebater.speechMode,
        };
      }),
    };
  });
}

export function sanitizeStoredTimers(raw: unknown): Record<string, TimerState> {
  if (typeof raw !== 'object' || raw === null) return {};
  const validIds = new Set(initialSections.flatMap((s) => s.debaters.map((d) => d.id)));
  const result: Record<string, TimerState> = {};
  for (const [id, val] of Object.entries(raw as Record<string, unknown>)) {
    if (!validIds.has(id) || typeof val !== 'object' || val === null) continue;
    const t = val as Record<string, unknown>;
    const elapsed = typeof t.elapsed === 'number' && Number.isFinite(t.elapsed) ? Math.max(0, t.elapsed) : 0;
    const running = Boolean(t.running);
    const startedAt =
      running && typeof t.startedAt === 'number' && Number.isFinite(t.startedAt)
        ? t.startedAt
        : null;
    result[id] = {
      elapsed,
      startedAt,
      running: running && startedAt !== null,
    };
  }
  return result;
}
