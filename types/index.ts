// ═══════════════ CAPDUCTION TYPES ═══════════════
// API request/response shapes + database row types

// ─── Studio modes ─────────────────────────────────────────────────────────────
export type StudioMode = 'script' | 'caption' | 'combo';

export const TONES = ['Friendly', 'Professional', 'Luxury', 'Viral', 'Persuasive', 'Minimal'] as const;
export type Tone = (typeof TONES)[number];

export const PLATFORMS = ['TikTok', 'Instagram', 'Facebook', 'Shopee', 'Lazada', 'LINE', 'YouTube', 'General'] as const;
export type Platform = (typeof PLATFORMS)[number];

export const DURATIONS = ['15s', '30s', '60s', '90s', 'long'] as const;
export type Duration = (typeof DURATIONS)[number];

// ═══════════════ CAPTION STUDIO ═══════════════════
export interface CaptionRequest {
  productName: string;
  category?: string;
  targetCustomer?: string;
  tone: Tone;
  platform: Platform;
  details?: string;
  brandVoiceId?: string;
}

export interface CaptionContent {
  captions: string[];      // 5 variants
  hooks: string[];          // 5
  hashtags: string[];       // 10
  cta: string[];            // 5
  angles: string[];         // 4
  contentIdeas: string[];   // 4
}

// ═══════════════ SCRIPT STUDIO ═══════════════════
export interface ScriptRequest {
  productName: string;
  category?: string;
  targetCustomer?: string;
  tone: Tone;
  platform: Platform;
  duration: Duration;
  details?: string;
  brandVoiceId?: string;
}

export interface ScriptBeat {
  /** Timecode like "00:00", "00:05" */
  timecode: string;
  /** Role label: HOOK / BODY / PROOF / CTA / etc */
  role: string;
  /** Spoken line (Thai) */
  spoken: string;
  /** Optional B-roll cue / shot description */
  broll?: string;
  /** Optional on-screen text overlay */
  onScreenText?: string;
}

export interface ScriptContent {
  beats: ScriptBeat[];
  /** Total estimated duration in seconds */
  totalSeconds: number;
  /** Optional thumbnail copy suggestion */
  thumbnailCopy?: string;
  /** Posting checklist (3-5 items) */
  postingChecklist: string[];
}

// ═══════════════ COMBO MODE ════════════════════════
export interface ComboRequest extends ScriptRequest {
  /** Combo always returns both */
}

export interface ComboContent {
  /** Shared hook used by both script and caption */
  sharedHook: string;
  script: ScriptContent;
  caption: CaptionContent;
}

// ═══════════════ Universal API response ═══════════
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
  creditsRemaining?: number;
}

// ═══════════════ DATABASE ROW TYPES ═══════════════
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: 'free' | 'studio' | 'agency';
  credits_remaining: number;
  subscription_status: 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing';
  billing_customer_id: string | null;
  stripe_price_id: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface BillingEvent {
  id: string;
  user_id: string;
  event_type: string;
  stripe_event_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export const PLAN_CREDITS: Record<string, number> = {
  free: 10,
  studio: 500,
  agency: 99999,
};

/** Universal Generation row — holds all studio types */
export interface Generation {
  id: string;
  user_id: string;
  project_id: string | null;
  studio: StudioMode;
  product_name: string;
  category: string | null;
  target_customer: string | null;
  tone: Tone;
  platform: Platform;
  duration: Duration | null;       // only for script/combo
  additional_details: string | null;
  /** JSON payload — shape depends on `studio` field */
  payload: ScriptContent | CaptionContent | ComboContent;
  created_at: string;
}

export interface UsageEvent {
  id: string;
  user_id: string;
  event_type: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface UserSettings {
  id: string;
  user_id: string;
  default_tone: Tone | null;
  default_platform: Platform | null;
  default_duration: Duration | null;
  company_name: string | null;
  brand_voice: string | null;       // freeform brand description
  created_at: string;
  updated_at: string;
}

export interface BrandVoice {
  id: string;
  user_id: string;
  name: string;
  description: string;
  /** Up to 3 sample posts user provides for training */
  sample_posts: string[];
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  cover_color: string | null;       // hex for project chip color
  created_at: string;
  updated_at: string;
}

// ─── Analytics derived ────────────────────────────────────────────────────────
export interface AnalyticsOverview {
  totalGenerations: number;
  generationsThisWeek: number;
  scriptCount: number;
  captionCount: number;
  comboCount: number;
  favoritePlatform: Platform | null;
  favoriteTone: Tone | null;
  creditsRemaining: number;
}
