'use client';

export type DemoMode = 'React' | 'Next' | 'Any';

export type TelemetryEntry = {
  id: string;
  label: string;
  route: string;
  ms: number;
  mode: DemoMode;
  timestamp: number;
  method?: string;
  status?: number;
};

export type TelemetryPayload = Omit<TelemetryEntry, 'id' | 'timestamp'>;

const DEMO_EVENT = 'why-next-demo-telemetry';

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function emitTelemetry(payload: TelemetryPayload) {
  const entry: TelemetryEntry = {
    id: generateId(),
    timestamp: Date.now(),
    ...payload
  };

  if (typeof window === 'undefined') {
    return entry;
  }

  const event = new CustomEvent<TelemetryEntry>(DEMO_EVENT, { detail: entry });
  window.dispatchEvent(event);
  return entry;
}

export function subscribeTelemetry(callback: (entry: TelemetryEntry) => void) {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<TelemetryEntry>;
    callback(customEvent.detail);
  };

  window.addEventListener(DEMO_EVENT, handler);
  return () => window.removeEventListener(DEMO_EVENT, handler);
}
