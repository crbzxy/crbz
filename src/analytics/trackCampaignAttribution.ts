const ATTRIBUTION_STORAGE_KEY = 'crbz.campaignAttribution';
const GA_MEASUREMENT_ID = 'G-5R1L0BY554';

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
  landingUrl: string;
  referrer: string;
  channel: string;
  capturedAt: string;
};

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown> | IArguments>;
    gtag?: (...args: unknown[]) => void;
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

function resolveChannel(attribution: Partial<Record<UtmKey, string>>) {
  const source = attribution.utm_source?.toLowerCase();
  const medium = attribution.utm_medium?.toLowerCase();
  const content = attribution.utm_content?.toLowerCase();

  if (source === 'ig' || source === 'instagram') {
    return content === 'link_in_bio' ? 'instagram_link_in_bio' : 'instagram';
  }
  if (medium === 'social') {
    return 'social';
  }
  if (attribution.fbclid) {
    return 'meta_paid_or_social';
  }
  return 'direct_or_unknown';
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

function sendGtagAttribution(attribution: CampaignAttribution, isFreshCapture: boolean) {
  if (typeof window.gtag !== 'function') {
    return;
  }

  if (isFreshCapture && attribution.utm_source) {
    window.gtag('set', {
      campaign_source: attribution.utm_source,
      campaign_medium: attribution.utm_medium,
      campaign_name: attribution.utm_campaign,
      campaign_content: attribution.utm_content,
      campaign_term: attribution.utm_term,
    });
  }

  window.gtag('event', 'campaign_attribution', {
    send_to: GA_MEASUREMENT_ID,
    channel: attribution.channel,
    source: attribution.utm_source,
    medium: attribution.utm_medium,
    campaign: attribution.utm_campaign,
    content: attribution.utm_content,
    term: attribution.utm_term,
    fbclid: attribution.fbclid,
    landing_path: attribution.landingPath,
    landing_url: attribution.landingUrl,
  });

  if (attribution.channel === 'instagram_link_in_bio' && isFreshCapture) {
    window.gtag('event', 'ig_link_in_bio', {
      send_to: GA_MEASUREMENT_ID,
      source: attribution.utm_source,
      medium: attribution.utm_medium,
      content: attribution.utm_content,
      fbclid: attribution.fbclid,
      landing_url: attribution.landingUrl,
    });
  }
}

/**
 * Captura UTM/fbclid de URLs tipo Instagram link in bio:
 * ?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=...
 */
export function trackCampaignAttribution() {
  const fromQuery = readQueryAttribution();
  const stored = readStoredAttribution();
  const isFreshCapture = hasAttribution(fromQuery);

  const attribution: CampaignAttribution = isFreshCapture
    ? {
        ...fromQuery,
        landingPath: `${window.location.pathname}${window.location.search}`,
        landingUrl: window.location.href,
        referrer: document.referrer || '(direct)',
        channel: resolveChannel(fromQuery),
        capturedAt: new Date().toISOString(),
      }
    : stored ?? {
        landingPath: window.location.pathname,
        landingUrl: window.location.href,
        referrer: document.referrer || '(direct)',
        channel: 'direct_or_unknown',
        capturedAt: new Date().toISOString(),
      };

  if (isFreshCapture) {
    persistAttribution(attribution);
  }

  pushToDataLayer({
    event: 'campaign_attribution',
    channel: attribution.channel,
    utm_source: attribution.utm_source,
    utm_medium: attribution.utm_medium,
    utm_campaign: attribution.utm_campaign,
    utm_content: attribution.utm_content,
    utm_term: attribution.utm_term,
    fbclid: attribution.fbclid,
    landing_path: attribution.landingPath,
    landing_url: attribution.landingUrl,
    referrer: attribution.referrer,
  });

  sendGtagAttribution(attribution, isFreshCapture);
}
