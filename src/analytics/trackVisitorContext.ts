const SESSION_STORAGE_KEY = 'crbz.visitorSession';
const GA_MEASUREMENT_ID = 'G-5R1L0BY554';

export type VisitorSession = {
  sessionId: string;
  startedAt: string;
  lastSeenAt: string;
  hitCount: number;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
  }
}

function createSessionId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function readSession(): VisitorSession {
  const now = new Date().toISOString();

  try {
    const raw = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      const stored = JSON.parse(raw) as VisitorSession;
      const nextSession: VisitorSession = {
        ...stored,
        lastSeenAt: now,
        hitCount: (stored.hitCount ?? 0) + 1,
      };
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
      return nextSession;
    }
  } catch (error) {
    console.error('No se pudo leer la sesión del visitante', error);
  }

  const session: VisitorSession = {
    sessionId: createSessionId(),
    startedAt: now,
    lastSeenAt: now,
    hitCount: 1,
  };

  try {
    sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error('No se pudo guardar la sesión del visitante', error);
  }

  return session;
}

function pushToDataLayer(payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

function sendGtagVisitorContext(payload: Record<string, unknown>) {
  if (typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'visitor_context', {
    send_to: GA_MEASUREMENT_ID,
    ...payload,
  });
}

/**
 * Sesión + contexto del navegador → solo Google Analytics / GTM.
 */
export function trackVisitorContext() {
  const session = readSession();
  const timezone =
    typeof Intl !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : null;
  const locale =
    typeof navigator !== 'undefined' ? navigator.language || null : null;

  const eventPayload = {
    session_id: session.sessionId,
    session_started_at: session.startedAt,
    session_hit_count: session.hitCount,
    locale,
    timezone,
  };

  pushToDataLayer({
    event: 'visitor_context',
    ...eventPayload,
  });

  sendGtagVisitorContext(eventPayload);

  return { session, locale, timezone };
}
