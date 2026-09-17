const ATTRIBUTION_STORAGE_KEY = 'crbz.campaignAttribution';

const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type CampaignAttribution = Partial<Record<UtmKey, string>> & {
  landingPath: string;
  capturedAt: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

function readQueryAttribution(): Partial<Record<UtmKey, string>> {
  const params = new URLSearchParams(window.location.search);
  const attribution: Partial<Record<UtmKey, string>> = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) {
      attribution[key] = value;
    }
  }

  return attribution;
}

function hasAttribution(attribution: Partial<Record<UtmKey, string>>) {
  return Object.keys(attribution).length > 0;
}

function persistAttribution(attribution: CampaignAttribution) {
  try {
    sessionStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch (error) {
    console.error('No se pudo guardar la atribución de campaña', error);
  }
}

function readStoredAttribution(): CampaignAttribution | null {
  try {
    const raw = sessionStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as CampaignAttribution;
  } catch (error) {
    console.error('No se pudo leer la atribución de campaña', error);
    return null;
  }
}

function pushToDataLayer(payload: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

/**
 * Captura UTM/fbclid de la URL (p. ej. Instagram link in bio),
 * los guarda en session y los envía a GTM vía dataLayer.
 */
export function trackCampaignAttribution() {
  const fromQuery = readQueryAttribution();
  const stored = readStoredAttribution();

  const attribution: CampaignAttribution = hasAttribution(fromQuery)
    ? {
        ...fromQuery,
        landingPath: `${window.location.pathname}${window.location.search}`,
        capturedAt: new Date().toISOString(),
      }
    : stored ?? {
        landingPath: window.location.pathname,
        capturedAt: new Date().toISOString(),
      };

  if (hasAttribution(fromQuery)) {
    persistAttribution(attribution);
  }

  pushToDataLayer({
    event: 'campaign_attribution',
    ...attribution,
  });
}
