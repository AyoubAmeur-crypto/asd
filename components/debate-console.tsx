'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Clock3,
  Maximize2,
  Minimize2,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  ShieldAlert,
  Volume2,
} from 'lucide-react';
import { OFFICIAL_LOGOS } from '@/lib/gallery';
import {
  adjustTimerInMap,
  createDefaultTimer,
  formatOvertimeDelta,
  formatTenths,
  formatTime,
  getEffectiveElapsed,
  getLimitMs,
  initialSections,
  isOvertime,
  isWarning,
  LANGUAGES,
  pauseAllTimersInMap,
  resetTimerInMap,
  sanitizeStoredSections,
  sanitizeStoredTimers,
  SpeechMode,
  STEP_MS,
  STORAGE_KEY,
  toggleTimerInMap,
  type DebateSection,
  type Debater,
  type LanguageId,
  type TimerState,
} from '@/lib/debate';

function attachDialogLightDismissFallback(dialog: HTMLDialogElement | null) {
  if (!dialog) return () => {};
  if ('closedBy' in HTMLDialogElement.prototype) return () => {};

  const handleClick = (event: MouseEvent) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    const isDialogContent =
      rect.top <= event.clientY &&
      event.clientY <= rect.top + rect.height &&
      rect.left <= event.clientX &&
      event.clientX <= rect.left + rect.width;
    if (isDialogContent) return;
    dialog.close('cancel');
  };

  dialog.addEventListener('click', handleClick);
  return () => dialog.removeEventListener('click', handleClick);
}

interface ChronographDialProps {
  ms: number;
  running: boolean;
  over: boolean;
  warning: boolean;
  mode: SpeechMode;
  size?: 'card' | 'stage';
  isPoiActive?: boolean;
  poiRemainingMs?: number;
  onDialClick?: () => void;
}

function ChronographDial({
  ms,
  running,
  over,
  warning,
  mode,
  size = 'card',
  isPoiActive = false,
  poiRemainingMs = 0,
  onDialClick,
}: ChronographDialProps) {
  const outerRadius = 92;
  const outerCircumference = 2 * Math.PI * outerRadius;

  // The 45s POI chronometer behaves identically to the 8 min timer:
  // Smooth clockwise progress tracking elapsed seconds from 0 to limitMs!
  const limitMs = isPoiActive ? 45000 : getLimitMs(mode);
  const effectiveMs = isPoiActive
    ? Math.max(0, 45000 - poiRemainingMs)
    : ms;

  const progressRatio = Math.min(1, Math.max(0, effectiveMs / limitMs));
  const strokeDashoffset = outerCircumference * (1 - progressRatio);

  const dialStateClass = isPoiActive
    ? 'is-poi-active'
    : over
      ? 'is-over'
      : warning
        ? 'is-warning'
        : running
          ? 'is-running'
          : '';

  return (
    <div
      className={`chrono-dial ${size === 'stage' ? 'chrono-dial--stage' : ''} ${dialStateClass}`}
      onClick={isPoiActive ? onDialClick : undefined}
      style={isPoiActive ? { cursor: 'pointer' } : undefined}
      title={isPoiActive ? 'Point of Information active · Click to end POI and resume speech' : undefined}
    >
      <svg className="chrono-svg" viewBox="0 0 220 220" aria-hidden="true">
        {/* Outer bezel frame */}
        <circle cx="110" cy="110" r="106" className="chrono-bezel-outer" />
        <circle cx="110" cy="110" r="99" className="chrono-bezel-inner" />

        {/* Outer track & clean progress ring */}
        <circle
          cx="110"
          cy="110"
          r={outerRadius}
          className="chrono-track-outer"
        />
        <circle
          cx="110"
          cy="110"
          r={outerRadius}
          className="chrono-progress-outer"
          style={{
            strokeDasharray: outerCircumference,
            strokeDashoffset,
          }}
        />
      </svg>

      <div
        className="chrono-readout"
        role="timer"
        aria-label={`${formatTime(effectiveMs)} elapsed`}
      >
        <div className="chrono-sub-top">
          <span>{isPoiActive ? 'POI // 45S' : mode === 'reply' ? 'REPLY // 04M' : 'SPEECH // 08M'}</span>
          <span>{Math.min(100, Math.floor((effectiveMs / limitMs) * 100))}%</span>
        </div>

        <div className="chrono-digits-row">
          <span className="chrono-digits">{formatTime(effectiveMs)}</span>
          <span className="chrono-tenths">.{formatTenths(effectiveMs)}</span>
        </div>

        <div className="chrono-sub-bottom">
          <span>LIMIT {isPoiActive ? '00:45' : mode === 'reply' ? '04:00' : '08:00'}</span>
        </div>
      </div>
    </div>
  );
}

export interface DebateConsoleProps {
  isStandalonePage?: boolean;
}

export function DebateConsole({ isStandalonePage = false }: DebateConsoleProps) {
  const [sections, setSections] = useState<DebateSection[]>(initialSections);
  const [timers, setTimers] = useState<Record<string, TimerState>>({});
  const [active, setActive] = useState<LanguageId>('english');
  const [exclusiveMode, setExclusiveMode] = useState<boolean>(false);
  const [now, setNow] = useState<number>(0);
  const [ready, setReady] = useState<boolean>(false);

  // WSD Point of Information (POI - 45s maximum) state
  const [poiState, setPoiState] = useState<{ debaterId: string; endAt: number } | null>(null);

  // Dialog states: Reset confirmation & Stage Projection Focus modal
  const [pendingResetId, setPendingResetId] = useState<string | null>(null);
  const [focusedSpeakerId, setFocusedSpeakerId] = useState<string | null>(null);

  const resetDialogRef = useRef<HTMLDialogElement | null>(null);
  const stageDialogRef = useRef<HTMLDialogElement | null>(null);
  const tabRefs = useRef<Record<LanguageId, HTMLButtonElement | null>>({
    english: null,
    french: null,
    arabic: null,
  });

  const baseId = useId();

  // Load saved state on mount
  useEffect(() => {
    const initialNow = Date.now();
    setNow(initialNow);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Record<string, unknown>;
        setSections(sanitizeStoredSections(parsed.sections));
        setTimers(sanitizeStoredTimers(parsed.timers));
        if (typeof parsed.exclusiveMode === 'boolean') {
          setExclusiveMode(parsed.exclusiveMode);
        }
        if (
          parsed.activeTab === 'english' ||
          parsed.activeTab === 'french' ||
          parsed.activeTab === 'arabic'
        ) {
          setActive(parsed.activeTab);
        }
      }
    } catch {
      // Ignore malformed storage
    }
    setReady(true);
  }, []);

  // High-precision ticker + visibilitychange resync
  useEffect(() => {
    if (!ready) return;
    const syncClock = () => setNow(Date.now());
    const intervalId = window.setInterval(syncClock, 100);

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        syncClock();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', syncClock);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', syncClock);
    };
  }, [ready]);

  // Persist state in localStorage
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          sections,
          timers,
          exclusiveMode,
          activeTab: active,
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [sections, timers, exclusiveMode, active, ready]);

  // Light-dismiss fallback for native dialogs
  useEffect(() => {
    const cleanupReset = attachDialogLightDismissFallback(resetDialogRef.current);
    const cleanupStage = attachDialogLightDismissFallback(stageDialogRef.current);
    return () => {
      cleanupReset();
      cleanupStage();
    };
  }, []);

  function findDebaterMeta(debaterId: string | null): {
    debater: Debater;
    section: DebateSection;
    langMeta: (typeof LANGUAGES)[number];
  } | null {
    if (!debaterId) return null;
    for (const sec of sections) {
      const debater = sec.debaters.find((d) => d.id === debaterId);
      if (debater) {
        const langMeta = LANGUAGES.find((l) => l.id === sec.id)!;
        return { debater, section: sec, langMeta };
      }
    }
    return null;
  }

  function handleToggle(id: string) {
    const timestamp = Date.now();
    setNow(timestamp);
    // If starting or toggling this speaker and a POI was active for them, clear POI
    if (poiState?.debaterId === id) {
      setPoiState(null);
    }
    setTimers((prev) => toggleTimerInMap(prev, id, timestamp, exclusiveMode));
  }

  function handleStartPoi(id: string) {
    const timestamp = Date.now();
    setNow(timestamp);
    // According to WSD rules, accepting a POI pauses the main speech clock!
    setTimers((prev) => {
      const current = prev[id];
      if (current?.running) {
        return {
          ...prev,
          [id]: {
            elapsed: getEffectiveElapsed(current, timestamp),
            startedAt: null,
            running: false,
          },
        };
      }
      return prev;
    });
    // Start official 45-second POI countdown
    setPoiState({
      debaterId: id,
      endAt: timestamp + 45000,
    });
  }

  function handleStopPoi(resumeMain: boolean = true) {
    const timestamp = Date.now();
    setNow(timestamp);
    if (resumeMain && poiState) {
      const id = poiState.debaterId;
      setTimers((prev) => {
        const current = prev[id];
        if (current && !current.running) {
          return {
            ...prev,
            [id]: {
              ...current,
              startedAt: timestamp,
              running: true,
            },
          };
        }
        return prev;
      });
    }
    setPoiState(null);
  }

  // Auto-resume main speech timer when 45-second POI window concludes
  useEffect(() => {
    if (!poiState) return;
    if (now >= poiState.endAt) {
      handleStopPoi(true);
    }
  }, [now, poiState]);

  function handleAdjust(id: string, deltaMs: number) {
    const timestamp = Date.now();
    setNow(timestamp);
    setTimers((prev) => adjustTimerInMap(prev, id, deltaMs, timestamp));
  }

  function requestReset(id: string) {
    const dialog = resetDialogRef.current;
    if (dialog && typeof dialog.showModal === 'function') {
      setPendingResetId(id);
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (window.confirm('Reset this speaker timer to 00:00?')) {
        const timestamp = Date.now();
        setNow(timestamp);
        if (poiState?.debaterId === id) setPoiState(null);
        setTimers((prev) => resetTimerInMap(prev, id));
      }
    }
  }

  function confirmReset() {
    if (pendingResetId) {
      const timestamp = Date.now();
      setNow(timestamp);
      if (poiState?.debaterId === pendingResetId) setPoiState(null);
      setTimers((prev) => resetTimerInMap(prev, pendingResetId));
    }
    setPendingResetId(null);
    resetDialogRef.current?.close('confirm');
  }

  function cancelReset() {
    setPendingResetId(null);
    resetDialogRef.current?.close('cancel');
  }

  function handlePauseAll() {
    const timestamp = Date.now();
    setNow(timestamp);
    setPoiState(null);
    setTimers((prev) => pauseAllTimersInMap(prev, timestamp));
  }

  function handleRename(sectionId: LanguageId, debaterId: string, name: string) {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              debaters: sec.debaters.map((d) =>
                d.id === debaterId ? { ...d, name } : d
              ),
            }
          : sec
      )
    );
  }

  function handleToggleSpeechMode(sectionId: LanguageId, debaterId: string) {
    setSections((prev) =>
      prev.map((sec) =>
        sec.id === sectionId
          ? {
              ...sec,
              debaters: sec.debaters.map((d) =>
                d.id === debaterId
                  ? {
                      ...d,
                      speechMode: d.speechMode === 'reply' ? 'standard' : 'reply',
                    }
                  : d
              ),
            }
          : sec
      )
    );
  }

  function openStageProjection(debaterId?: string) {
    const fallbackId =
      debaterId ??
      sections
        .find((s) => s.id === active)
        ?.debaters.find((d) => timers[d.id]?.running)?.id ??
      `${active}-gov-1`;

    setFocusedSpeakerId(fallbackId);
    const dialog = stageDialogRef.current;
    if (dialog && typeof dialog.showModal === 'function' && !dialog.open) {
      dialog.showModal();
    }
  }

  function closeStageProjection() {
    stageDialogRef.current?.close('close');
    setFocusedSpeakerId(null);
  }

  // Complete background scroll lock when Stage Projection modal is active
  useEffect(() => {
    if (!focusedSpeakerId) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevBodyTouchAction = document.body.style.touchAction;
    const prevBodyOverscroll = document.body.style.overscrollBehavior;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlTouchAction = document.documentElement.style.touchAction;
    const prevHtmlOverscroll = document.documentElement.style.overscrollBehavior;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
    document.body.style.overscrollBehavior = 'none';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.touchAction = 'none';
    document.documentElement.style.overscrollBehavior = 'none';

    // Prevent touch scrolling bleed on mobile / iOS
    const preventScrollBleed = (e: TouchEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest('.stage-modal-inner')) {
        e.preventDefault();
      }
    };

    window.addEventListener('touchmove', preventScrollBleed, { passive: false });

    return () => {
      document.body.style.overflow = prevBodyOverflow;
      document.body.style.touchAction = prevBodyTouchAction;
      document.body.style.overscrollBehavior = prevBodyOverscroll;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.touchAction = prevHtmlTouchAction;
      document.documentElement.style.overscrollBehavior = prevHtmlOverscroll;
      window.removeEventListener('touchmove', preventScrollBleed);
    };
  }, [focusedSpeakerId]);

  const selectedSection = sections.find((s) => s.id === active) ?? sections[0];
  const selectedLangMeta = LANGUAGES.find((l) => l.id === active) ?? LANGUAGES[0];

  // Global telemetry
  const allDebaters = sections.flatMap((s) => s.debaters);
  const runningCount = allDebaters.filter((d) => timers[d.id]?.running).length;
  const overtimeCount = allDebaters.filter((d) =>
    isOvertime(getEffectiveElapsed(timers[d.id], now), d.speechMode)
  ).length;

  const pendingResetMeta = findDebaterMeta(pendingResetId);
  const focusedMeta = findDebaterMeta(focusedSpeakerId);
  const focusedTimer = focusedMeta
    ? timers[focusedMeta.debater.id] ?? createDefaultTimer()
    : createDefaultTimer();
  const focusedMs = getEffectiveElapsed(focusedTimer, now);
  const focusedOver = focusedMeta
    ? isOvertime(focusedMs, focusedMeta.debater.speechMode)
    : false;
  const focusedWarning = focusedMeta
    ? !focusedOver && isWarning(focusedMs, focusedMeta.debater.speechMode)
    : false;

  const activePoiRemainingSeconds = poiState
    ? Math.max(0, (poiState.endAt - now) / 1000)
    : null;
  const activePoiRemainingMs = poiState
    ? Math.max(0, poiState.endAt - now)
    : 0;

  return (
    <section id="timer" className={`console-section ${isStandalonePage ? 'console-section--standalone' : ''}`}>
      <div className="wrap">
        {/* Top Kicker & Live Status Strip */}
        <div className="console-kicker-bar">
          <div className="kicker">
            <Clock3 size={16} aria-hidden="true" />
            <span>02 // LIVE DEBATE CHRONOGRAPH CONSOLE</span>
          </div>
          <div className="console-telemetry-pills" aria-live="polite">
            <span className="telemetry-pill">
              <b>18</b> DEBATERS
            </span>
            <span className={`telemetry-pill ${runningCount > 0 ? 'is-running' : ''}`}>
              <b>{String(runningCount).padStart(2, '0')}</b> ACTIVE
            </span>
            {poiState && activePoiRemainingSeconds !== null && (
              <span className="telemetry-pill is-poi">
                <b>{Math.ceil(activePoiRemainingSeconds)}s</b> POI ACTIVE
              </span>
            )}
            <span className={`telemetry-pill ${overtimeCount > 0 ? 'is-overtime' : ''}`}>
              <b>{String(overtimeCount).padStart(2, '0')}</b> OVERTIME
            </span>
          </div>
        </div>

        {/* Section Header */}
        <div className="console-head">
          <div>
            <h2>
              THE FLOOR
              <br />
              <em>IS YOURS.</em>
            </h2>
          </div>
          <div className="console-head-right">
            {/* Organizer Utility Bar */}
            <div className="console-toolbar" role="group" aria-label="Organizer console controls">
              <button
                type="button"
                className="toolbar-btn"
                onClick={() => openStageProjection()}
              >
                <Maximize2 size={15} aria-hidden="true" />
                <span>STAGE PROJECTION</span>
              </button>

              <button
                type="button"
                className="toolbar-btn"
                disabled={runningCount === 0}
                onClick={handlePauseAll}
              >
                <Pause size={15} aria-hidden="true" />
                <span>PAUSE ALL</span>
              </button>

              {!isStandalonePage && (
                <Link href="/timer" className="toolbar-btn toolbar-btn--highlight">
                  <span>EXPAND TIMER</span>
                  <ArrowRight size={14} aria-hidden="true" />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 3 Language Section Tabs */}
        <div
          className="tabs"
          role="tablist"
          aria-label="Debate language sections"
        >
          {LANGUAGES.map((lang) => {
            const isSelected = active === lang.id;
            const sec = sections.find((s) => s.id === lang.id)!;
            const secRunning = sec.debaters.filter(
              (d) => timers[d.id]?.running
            ).length;
            const secOvertime = sec.debaters.filter((d) =>
              isOvertime(getEffectiveElapsed(timers[d.id], now), d.speechMode)
            ).length;

            return (
              <button
                key={lang.id}
                ref={(el) => {
                  tabRefs.current[lang.id] = el;
                }}
                id={`${baseId}-tab-${lang.id}`}
                role="tab"
                aria-selected={isSelected}
                aria-controls={`${baseId}-panel-${lang.id}`}
                tabIndex={isSelected ? 0 : -1}
                className={`tab-btn ${isSelected ? 'is-active' : ''}`}
                onClick={() => setActive(lang.id)}
              >
                <div className="tab-top-row">
                  <span className="tab-order">{lang.order} // ARENA</span>
                  <div className="tab-badges">
                    {secRunning > 0 && (
                      <span className="tab-badge tab-badge--live">
                        {secRunning} LIVE
                      </span>
                    )}
                    {secOvertime > 0 && (
                      <span className="tab-badge tab-badge--over">
                        {secOvertime} OVER
                      </span>
                    )}
                  </div>
                </div>
                <div className="tab-main-row">
                  <strong>{lang.label.toUpperCase()}</strong>
                  <span
                    className="tab-native"
                    lang={lang.id === 'arabic' ? 'ar' : lang.id === 'french' ? 'fr' : 'en'}
                  >
                    {lang.native}
                  </span>
                </div>
                <span className="tab-meta">{lang.seatsLabel} · WSD 8M / 4M</span>
              </button>
            );
          })}
        </div>

        {/* Active Language Tab Panel */}
        <div
          id={`${baseId}-panel-${selectedLangMeta.id}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${selectedLangMeta.id}`}
          className="sides"
        >
          {(['for', 'against'] as const).map((side) => {
            const sideDebaters = selectedSection.debaters.filter(
              (d) => d.side === side
            );
            const sideTitle =
              side === 'for'
                ? selectedLangMeta.id === 'arabic'
                  ? 'الموالاة (GOVERNMENT)'
                  : 'GOVERNMENT (PROPOSITION)'
                : selectedLangMeta.id === 'arabic'
                  ? 'المعارضة (OPPOSITION)'
                  : 'OPPOSITION';

            const sideSub =
              side === 'for'
                ? 'IN FAVOR // PROPOSITION'
                : 'AGAINST // OPPOSITION';

            return (
              <div key={side} className={`side side--${side}`}>
                <div className="side-label">
                  <span className="side-icon" aria-hidden="true">
                    {side === 'for' ? '+' : '−'}
                  </span>
                  <div className="side-heading-group">
                    <h3>{sideTitle}</h3>
                    <span className="side-sub">{sideSub}</span>
                  </div>
                  <span className="side-count">03 SPEAKERS</span>
                </div>

                <div className="speakers-list">
                  {sideDebaters.map((debater) => {
                    const t = timers[debater.id] ?? createDefaultTimer();
                    const ms = getEffectiveElapsed(t, now);
                    const over = isOvertime(ms, debater.speechMode);
                    const warning = !over && isWarning(ms, debater.speechMode);
                    const hasStarted = ms > 0;
                    const inputId = `${baseId}-input-${debater.id}`;
                    const isPoiThisDebater = poiState?.debaterId === debater.id;

                    const primaryActionLabel = t.running
                      ? 'Pause'
                      : hasStarted
                        ? 'Resume'
                        : 'Start';

                    // Removed text "5M WARNING" as requested by user
                    const statusText = over
                      ? 'OVERTIME'
                      : isPoiThisDebater
                        ? `POI (${activePoiRemainingSeconds ? activePoiRemainingSeconds.toFixed(0) : '45'}s)`
                        : t.running
                          ? 'LIVE'
                          : hasStarted
                            ? 'PAUSED'
                            : 'READY';

                    return (
                      <article
                        key={debater.id}
                        data-testid={`speaker-card-${debater.id}`}
                        className={`speaker ${over ? 'over' : warning ? 'warning' : ''} ${t.running ? 'running' : ''}`}
                      >
                        {/* Top Bar */}
                        <div className="speaker-top">
                          <span className="num" aria-hidden="true">
                            0{debater.position}
                          </span>
                          <div className="speaker-input-wrap">
                            <div className="speaker-meta-line">
                              <label htmlFor={inputId} className="speaker-label">
                                {debater.roleLabel || `SPEAKER 0${debater.position}`}
                              </label>
                              <button
                                type="button"
                                className={`mode-toggle-pill ${debater.speechMode === 'reply' ? 'is-reply' : ''}`}
                                title="Toggle between 8-minute Standard speech and 4-minute Reply speech"
                                onClick={() => handleToggleSpeechMode(active, debater.id)}
                              >
                                {debater.speechMode === 'reply' ? 'REPLY (4M)' : 'STANDARD (8M)'}
                              </button>
                            </div>
                            <input
                              id={inputId}
                              type="text"
                              aria-label={`Confirmed name for ${debater.roleLabel}`}
                              placeholder="Enter confirmed debater name..."
                              value={debater.name}
                              onChange={(e) =>
                                handleRename(active, debater.id, e.target.value)
                              }
                            />
                          </div>
                          <div className="speaker-status-group">
                            <span
                              className={`timer-status ${t.running ? 'running' : ''} ${over ? 'over' : isPoiThisDebater ? 'poi-live' : ''}`}
                            >
                              {statusText}
                            </span>
                            <button
                              type="button"
                              className="focus-icon-btn"
                              aria-label={`Open stage projection for ${debater.name || `Speaker ${debater.position}`}`}
                              onClick={() => openStageProjection(debater.id)}
                            >
                              <Maximize2 size={14} aria-hidden="true" />
                            </button>
                          </div>
                        </div>

                        {/* Single Big Chronograph Dial (Directly morphs into 45s POI countdown when active) */}
                        <div className="chrono-dial-stage-wrap">
                          <ChronographDial
                            ms={ms}
                            running={t.running}
                            over={over}
                            warning={warning}
                            mode={debater.speechMode}
                            isPoiActive={isPoiThisDebater}
                            poiRemainingMs={activePoiRemainingMs}
                            onDialClick={() => handleStopPoi(true)}
                          />
                        </div>

                        {/* Tactile Physical Controls + WSD POI Button */}
                        <div className="controls">
                          <button
                            type="button"
                            className={`primary ${t.running ? 'is-running' : ''}`}
                            aria-pressed={t.running}
                            aria-label={`${isPoiThisDebater ? 'End POI and resume speech' : primaryActionLabel} timer for ${debater.name || `Speaker ${debater.position}`}`}
                            onClick={() => {
                              if (isPoiThisDebater) {
                                handleStopPoi(true);
                              } else {
                                handleToggle(debater.id);
                              }
                            }}
                          >
                            {isPoiThisDebater ? (
                              <Pause size={17} aria-hidden="true" />
                            ) : t.running ? (
                              <Pause size={17} aria-hidden="true" />
                            ) : (
                              <Play size={17} aria-hidden="true" />
                            )}
                            <span className="btn-label-text">
                              {isPoiThisDebater ? 'END POI' : primaryActionLabel.toUpperCase()}
                            </span>
                          </button>

                          {/* Official WSD 45s Point of Information button */}
                          <button
                            type="button"
                            className={`poi-btn ${isPoiThisDebater ? 'is-active' : ''}`}
                            title={isPoiThisDebater ? 'Conclude POI buffer and resume podium clock' : 'Accept 45s Point of Information'}
                            onClick={() => {
                              if (isPoiThisDebater) {
                                handleStopPoi(true);
                              } else {
                                handleStartPoi(debater.id);
                              }
                            }}
                          >
                            <span>{isPoiThisDebater ? 'END POI' : 'POI'}</span>
                            <span className="btn-label-text"> (45s)</span>
                          </button>

                          <button
                            type="button"
                            className="step-btn"
                            aria-label={`Subtract 10 seconds for ${debater.name || `Speaker ${debater.position}`}`}
                            onClick={() => handleAdjust(debater.id, -STEP_MS)}
                          >
                            <Minus size={14} aria-hidden="true" />
                            <span className="btn-label-text">10s</span>
                          </button>

                          <button
                            type="button"
                            className="step-btn"
                            aria-label={`Add 10 seconds for ${debater.name || `Speaker ${debater.position}`}`}
                            onClick={() => handleAdjust(debater.id, STEP_MS)}
                          >
                            <Plus size={14} aria-hidden="true" />
                            <span className="btn-label-text">10s</span>
                          </button>

                          <button
                            type="button"
                            className="reset-btn"
                            aria-label={`Reset timer for ${debater.name || `Speaker ${debater.position}`}`}
                            onClick={() => requestReset(debater.id)}
                          >
                            <RotateCcw size={16} aria-hidden="true" />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Native Modal Dialog 1: Reset Confirmation */}
      <dialog
        ref={resetDialogRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby={`${baseId}-reset-title`}
        className="asd-dialog asd-dialog--confirm"
        onClose={() => setPendingResetId(null)}
      >
        <div className="asd-dialog-inner">
          <div className="asd-dialog-kicker">
            <ShieldAlert size={16} aria-hidden="true" />
            <span>CONFIRM CHRONOGRAPH RESET</span>
          </div>
          <h3 id={`${baseId}-reset-title`}>RESET SPEAKER CLOCK TO 00:00?</h3>
          <p>
            You are about to reset elapsed time for{' '}
            <strong>
              {pendingResetMeta?.debater.name
                ? pendingResetMeta.debater.name
                : `${pendingResetMeta?.langMeta.label ?? ''} Speaker #${pendingResetMeta?.debater.position ?? ''}`}
            </strong>{' '}
            ({formatTime(getEffectiveElapsed(pendingResetId ? timers[pendingResetId] : undefined, now))}).
            This action clears the current speech lap.
          </p>
          <div className="asd-dialog-actions">
            <button
              type="button"
              className="dialog-btn dialog-btn--ghost"
              onClick={cancelReset}
            >
              KEEP TIME
            </button>
            <button
              type="button"
              className="dialog-btn dialog-btn--danger"
              onClick={confirmReset}
            >
              CONFIRM RESET
            </button>
          </div>
        </div>
      </dialog>

      {/* Native Modal Dialog 2: Stage Projection / Focus Screen */}
      <dialog
        ref={stageDialogRef}
        {...({ closedby: 'any' } as React.DialogHTMLAttributes<HTMLDialogElement>)}
        aria-labelledby={`${baseId}-stage-title`}
        className={`asd-dialog asd-dialog--stage ${focusedOver ? 'is-overtime' : focusedWarning ? 'is-warning' : ''}`}
        onClose={() => setFocusedSpeakerId(null)}
        onCancel={() => setFocusedSpeakerId(null)}
        onClick={(e) => {
          if (e.target === stageDialogRef.current) {
            closeStageProjection();
          }
        }}
      >
        {focusedMeta && (
          <div className="stage-modal-inner">
            <div className="stage-modal-header">
              <div className="stage-modal-meta">
                <span className="stage-pill">
                  {focusedMeta.langMeta.order} // {focusedMeta.langMeta.label.toUpperCase()} ({focusedMeta.langMeta.native})
                </span>
                <span className="stage-pill stage-pill--side">
                  {focusedMeta.debater.side === 'for'
                    ? '+ GOVERNMENT'
                    : '− OPPOSITION'}{' '}
                  · SPEAKER 0{focusedMeta.debater.position} ({focusedMeta.debater.speechMode.toUpperCase()})
                </span>
              </div>
              <button
                type="button"
                className="stage-close-btn"
                onClick={closeStageProjection}
              >
                <Minimize2 size={16} aria-hidden="true" />
                <span>EXIT (ESC)</span>
              </button>
            </div>

            <div className="stage-modal-body">
              <div className="stage-speaker-info">
                <span className="stage-kicker">ACTIVE PODIUM CHRONOGRAPH</span>
                <h3 id={`${baseId}-stage-title`}>
                  {focusedMeta.debater.name ||
                    `${focusedMeta.debater.side === 'for' ? 'GOVERNMENT' : 'OPPOSITION'} SPEAKER 0${focusedMeta.debater.position}`}
                </h3>
                <p className="stage-motion-preview">
                  {focusedMeta.debater.roleLabel} · WSD Limit:{' '}
                  {focusedMeta.debater.speechMode === 'reply' ? '04:00' : '08:00'}
                </p>

                <div className="stage-switcher" role="group" aria-label="Switch speaker in section">
                  <div className="stage-switcher-row stage-switcher-row--gov">
                    {focusedMeta.section.debaters
                      .filter((d) => d.side === 'for')
                      .map((d) => {
                        const dTimer = timers[d.id] ?? createDefaultTimer();
                        const dMs = getEffectiveElapsed(dTimer, now);
                        const dOver = isOvertime(dMs, d.speechMode);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            className={`stage-switch-pill ${d.id === focusedMeta.debater.id ? 'is-current' : ''} ${dTimer.running ? 'is-running' : ''} ${dOver ? 'is-over' : ''}`}
                            onClick={() => setFocusedSpeakerId(d.id)}
                            aria-label={`${d.name || `Government Speaker 0${d.position}`} timer: ${formatTime(dMs)}`}
                          >
                            <span className="pill-pos">GOV 0{d.position}</span>
                            <b className="pill-time">{formatTime(dMs)}</b>
                          </button>
                        );
                      })}
                  </div>
                  <div className="stage-switcher-row stage-switcher-row--opp">
                    {focusedMeta.section.debaters
                      .filter((d) => d.side === 'against')
                      .map((d) => {
                        const dTimer = timers[d.id] ?? createDefaultTimer();
                        const dMs = getEffectiveElapsed(dTimer, now);
                        const dOver = isOvertime(dMs, d.speechMode);
                        return (
                          <button
                            key={d.id}
                            type="button"
                            className={`stage-switch-pill ${d.id === focusedMeta.debater.id ? 'is-current' : ''} ${dTimer.running ? 'is-running' : ''} ${dOver ? 'is-over' : ''}`}
                            onClick={() => setFocusedSpeakerId(d.id)}
                            aria-label={`${d.name || `Opposition Speaker 0${d.position}`} timer: ${formatTime(dMs)}`}
                          >
                            <span className="pill-pos">OPP 0{d.position}</span>
                            <b className="pill-time">{formatTime(dMs)}</b>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              <div className="stage-dial-wrap">
                <ChronographDial
                  ms={focusedMs}
                  running={focusedTimer.running}
                  over={focusedOver}
                  warning={focusedWarning}
                  mode={focusedMeta.debater.speechMode}
                  size="stage"
                  isPoiActive={poiState?.debaterId === focusedMeta.debater.id}
                  poiRemainingMs={activePoiRemainingMs}
                  onDialClick={() => handleStopPoi(true)}
                />
              </div>
            </div>

            <div className="stage-modal-controls">
              <button
                type="button"
                className={`stage-ctrl-primary ${focusedTimer.running ? 'is-running' : ''}`}
                onClick={() => {
                  if (poiState?.debaterId === focusedMeta.debater.id) {
                    handleStopPoi(true);
                  } else {
                    handleToggle(focusedMeta.debater.id);
                  }
                }}
              >
                {poiState?.debaterId === focusedMeta.debater.id ? (
                  <Pause size={20} aria-hidden="true" />
                ) : focusedTimer.running ? (
                  <Pause size={20} aria-hidden="true" />
                ) : (
                  <Play size={20} aria-hidden="true" />
                )}
                <span className="btn-label-text">
                  {poiState?.debaterId === focusedMeta.debater.id
                    ? 'END POI'
                    : focusedTimer.running
                      ? 'PAUSE PODIUM CLOCK'
                      : focusedMs > 0
                        ? 'RESUME PODIUM CLOCK'
                        : 'START PODIUM CLOCK'}
                </span>
              </button>

              <button
                type="button"
                className={`stage-ctrl-btn stage-ctrl-btn--poi ${poiState?.debaterId === focusedMeta.debater.id ? 'is-active' : ''}`}
                onClick={() => {
                  if (poiState?.debaterId === focusedMeta.debater.id) {
                    handleStopPoi(true);
                  } else {
                    handleStartPoi(focusedMeta.debater.id);
                  }
                }}
              >
                <span>{poiState?.debaterId === focusedMeta.debater.id ? 'END POI' : 'POI'}</span>
                <span className="btn-label-text"> (45s)</span>
              </button>

              <button
                type="button"
                className="stage-ctrl-btn"
                onClick={() => handleAdjust(focusedMeta.debater.id, -STEP_MS)}
              >
                <Minus size={18} aria-hidden="true" />
                <span className="btn-label-text">10 SEC</span>
              </button>
              <button
                type="button"
                className="stage-ctrl-btn"
                onClick={() => handleAdjust(focusedMeta.debater.id, STEP_MS)}
              >
                <Plus size={18} aria-hidden="true" />
                <span className="btn-label-text">10 SEC</span>
              </button>
              <button
                type="button"
                className="stage-ctrl-btn stage-ctrl-btn--reset"
                onClick={() => requestReset(focusedMeta.debater.id)}
              >
                <RotateCcw size={18} aria-hidden="true" />
                <span className="btn-label-text">RESET</span>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </section>
  );
}
