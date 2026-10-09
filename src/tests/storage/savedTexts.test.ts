import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearAllSavedTexts,
  deleteSavedText,
  getSavedTexts,
  saveText,
} from '../../core/storage/savedTexts'

describe('savedTexts storage layer', () => {
  beforeEach(() => {
    clearAllSavedTexts()
  })

  it('saves new text with id, timestamps and retrieves it', () => {
    const item = saveText('നമസ്കാരം സുഹൃത്തേ')
    expect(item).not.toBeNull()
    expect(item?.text).toBe('നമസ്കാരം സുഹൃത്തേ')
    expect(item?.id).toBeDefined()
    expect(item?.createdAt).toBeGreaterThan(0)
    expect(item?.updatedAt).toBeGreaterThan(0)

    const list = getSavedTexts()
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(item?.id)
    expect(list[0].text).toBe('നമസ്കാരം സുഹൃത്തേ')
  })

  it('updates an existing item in place without creating duplicates', () => {
    const item1 = saveText('ആദ്യ വാചകം')
    expect(item1).not.toBeNull()

    // Update item1
    const updated = saveText('മാറ്റിയ വാചകം', item1?.id)
    expect(updated).not.toBeNull()
    expect(updated?.id).toBe(item1?.id)
    expect(updated?.text).toBe('മാറ്റിയ വാചകം')

    const list = getSavedTexts()
    expect(list.length).toBe(1)
    expect(list[0].id).toBe(item1?.id)
    expect(list[0].text).toBe('മാറ്റിയ വാചകം')
  })

  it('deletes an item by ID', () => {
    const item1 = saveText('ടെക്സ്റ്റ് 1')
    const item2 = saveText('ടെക്സ്റ്റ് 2')

    expect(getSavedTexts().length).toBe(2)

    const deleted = deleteSavedText(item1!.id)
    expect(deleted).toBe(true)

    const remaining = getSavedTexts()
    expect(remaining.length).toBe(1)
    expect(remaining[0].id).toBe(item2!.id)
  })

  it('ignores empty or whitespace-only texts', () => {
    const res1 = saveText('')
    const res2 = saveText('   ')
    expect(res1).toBeNull()
    expect(res2).toBeNull()
    expect(getSavedTexts().length).toBe(0)
  })

  it('moves updated item to the top of the list', () => {
    const item1 = saveText('ആദ്യ ഇനം')
    const item2 = saveText('രണ്ടാമത്തെ ഇനം')

    // item2 should be first initially
    let list = getSavedTexts()
    expect(list[0].id).toBe(item2!.id)

    // Updating item1 makes it the most recent
    saveText('ആദ്യ ഇനം പരിഷ്കരിച്ചു', item1!.id)
    list = getSavedTexts()
    expect(list[0].id).toBe(item1!.id)
    expect(list[0].text).toBe('ആദ്യ ഇനം പരിഷ്കരിച്ചു')
    expect(list[1].id).toBe(item2!.id)
  })
})
