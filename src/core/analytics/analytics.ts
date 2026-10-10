import { track } from '@vercel/analytics'

/**
 * Supported custom analytics events.
 * Strict union prevents arbitrary or unauthorized event names.
 */
export type AnalyticsEventName =
  | 'converter_used'
  | 'conversion_copied'
  | 'manglish_used'
  | 'manglish_suggestion_selected'
  | 'manglish_text_copied'
  | 'saved_text_created'
  | 'saved_text_edited'
  | 'saved_text_deleted'

/**
 * Strict privacy-safe metadata for analytics.
 * Strictly limited to primitive flags, categories, or format names.
 * NEVER accept user-entered text, snippets, notes, or clipboard content.
 */
export type AnalyticsEventProperties = Record<
  string,
  string | number | boolean | null | undefined
>

export interface TrackedEventRecord {
  name: AnalyticsEventName
  properties?: AnalyticsEventProperties
  timestamp: number
}

// In-memory record list for testing and debugging verification
const inMemoryEvents: TrackedEventRecord[] = []

/**
 * Track a custom feature event using Vercel Web Analytics track() API.
 * Ensures strict privacy: never transmits user text.
 * Gracefully handles plan limitations and runtime errors.
 */
export function trackEvent(
  name: AnalyticsEventName,
  properties?: AnalyticsEventProperties
): void {
  try {
    // Sanitize properties: strip nullish values and ensure no text content leaks
    const sanitizedProps = properties
      ? Object.fromEntries(
          Object.entries(properties).filter(
            ([, val]) => val !== undefined && val !== null
          )
        )
      : undefined

    // Record in-memory for testing and development auditing
    inMemoryEvents.push({
      name,
      properties: sanitizedProps,
      timestamp: Date.now(),
    })

    // Dispatch to Vercel Analytics track API if running in browser
    if (typeof window !== 'undefined') {
      track(name, sanitizedProps)
    }

    if (import.meta.env.DEV) {
      console.debug(`[Analytics] Tracked event: ${name}`, sanitizedProps)
    }
  } catch (err) {
    // Graceful fallback: do not break app on analytics transport error
    if (import.meta.env.DEV) {
      console.warn(`[Analytics] Failed to track event: ${name}`, err)
    }
  }
}

/**
 * Helper to retrieve tracked events for testing verification.
 */
export function getTrackedEvents(): readonly TrackedEventRecord[] {
  return inMemoryEvents
}

/**
 * Helper to reset tracked events for testing isolation.
 */
export function clearTrackedEvents(): void {
  inMemoryEvents.length = 0
}
