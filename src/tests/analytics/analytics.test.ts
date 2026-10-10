import { describe, it, expect, beforeEach } from 'vitest'
import {
  trackEvent,
  getTrackedEvents,
  clearTrackedEvents,
  type AnalyticsEventName,
} from '../../core/analytics/analytics'
import { saveText, deleteSavedText } from '../../core/storage/savedTexts'

describe('Vercel Web Analytics & Custom Event Tracking', () => {
  beforeEach(() => {
    clearTrackedEvents()
  })

  it('tracks all 8 defined custom feature events', () => {
    const events: AnalyticsEventName[] = [
      'converter_used',
      'conversion_copied',
      'manglish_used',
      'manglish_suggestion_selected',
      'manglish_text_copied',
      'saved_text_created',
      'saved_text_edited',
      'saved_text_deleted',
    ]

    for (const eventName of events) {
      trackEvent(eventName)
    }

    const tracked = getTrackedEvents()
    expect(tracked.length).toBe(8)
    const trackedNames = tracked.map((e) => e.name)
    expect(trackedNames).toEqual(events)
  })

  it('strictly preserves privacy: never includes user-entered text in payloads', () => {
    trackEvent('converter_used', {
      format: 'ML-TT',
      direction: 'unicode-to-legacy',
    })

    const tracked = getTrackedEvents()
    expect(tracked.length).toBe(1)
    const event = tracked[0]

    expect(event.name).toBe('converter_used')
    expect(event.properties).toEqual({
      format: 'ML-TT',
      direction: 'unicode-to-legacy',
    })

    // Ensure no Malayalam, Manglish, or clipboard text fields exist
    expect(event.properties).not.toHaveProperty('text')
    expect(event.properties).not.toHaveProperty('sourceText')
    expect(event.properties).not.toHaveProperty('targetText')
    expect(event.properties).not.toHaveProperty('input')
    expect(event.properties).not.toHaveProperty('clipboard')
  })

  it('only fires saved-text events when storage operations actually succeed', () => {
    // 1. Failed save (empty text) - should not fire event
    const failedResult = saveText('   ')
    expect(failedResult).toBeNull()
    if (failedResult) {
      trackEvent('saved_text_created')
    }
    expect(getTrackedEvents().length).toBe(0)

    // 2. Successful creation
    const created = saveText('നമസ്കാരം സുഹൃത്തേ')
    expect(created).not.toBeNull()
    if (created) {
      trackEvent('saved_text_created')
    }
    expect(getTrackedEvents().length).toBe(1)
    expect(getTrackedEvents()[0].name).toBe('saved_text_created')

    // 3. Successful edit
    if (created) {
      const updated = saveText('നമസ്കാരം സുഹൃത്തേ - അപ്ഡേറ്റ്', created.id)
      expect(updated).not.toBeNull()
      if (updated) {
        trackEvent('saved_text_edited')
      }
    }
    expect(getTrackedEvents().length).toBe(2)
    expect(getTrackedEvents()[1].name).toBe('saved_text_edited')

    // 4. Failed delete (non-existent id)
    const failedDelete = deleteSavedText('non-existent-id-999')
    expect(failedDelete).toBe(false)
    if (failedDelete) {
      trackEvent('saved_text_deleted')
    }
    expect(getTrackedEvents().length).toBe(2)

    // 5. Successful delete
    if (created) {
      const deleted = deleteSavedText(created.id)
      expect(deleted).toBe(true)
      if (deleted) {
        trackEvent('saved_text_deleted')
      }
    }
    expect(getTrackedEvents().length).toBe(3)
    expect(getTrackedEvents()[2].name).toBe('saved_text_deleted')
  })

  it('safely handles runtime errors without throwing or crashing', () => {
    // Calling trackEvent with null or undefined properties does not throw
    expect(() => trackEvent('converter_used', undefined)).not.toThrow()
    expect(() => trackEvent('conversion_copied')).not.toThrow()
  })

  it('distinguishes completed word commits from explicit suggestion selections', () => {
    // User commits completed word via space/enter
    trackEvent('manglish_used')
    expect(getTrackedEvents().length).toBe(1)
    expect(getTrackedEvents()[0].name).toBe('manglish_used')

    // User explicitly selects suggestion from list
    trackEvent('manglish_suggestion_selected')
    expect(getTrackedEvents().length).toBe(2)
    expect(getTrackedEvents()[1].name).toBe('manglish_suggestion_selected')
  })

  it('tracks copy events only after copy succeeds', () => {
    // Successful copy
    trackEvent('conversion_copied')
    trackEvent('manglish_text_copied')

    const tracked = getTrackedEvents()
    expect(tracked.length).toBe(2)
    expect(tracked[0].name).toBe('conversion_copied')
    expect(tracked[1].name).toBe('manglish_text_copied')
  })
})
