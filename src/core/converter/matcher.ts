export interface MatchResult {
  key: string
  value: string
  length: number
}

class TrieNode {
  children: Map<string, TrieNode> = new Map()
  value: string | undefined = undefined
  key: string | undefined = undefined
}

/**
 * Longest-Match-First Prefix Tree (Trie)
 * Guarantees that when converting sequences like ണ, ണ്, ണ്ട, ണ്ടു,
 * the longest matching multi-character sequence is always preferred.
 */
export class SequenceMatcher {
  private root: TrieNode = new TrieNode()
  private maxKeyLength: number = 0

  constructor(mappings?: Record<string, string> | [string, string][]) {
    if (mappings) {
      this.load(mappings)
    }
  }

  /**
   * Insert a sequence into the matcher
   */
  public insert(key: string, value: string): void {
    if (!key) return
    let current = this.root
    for (const char of key) {
      let next = current.children.get(char)
      if (!next) {
        next = new TrieNode()
        current.children.set(char, next)
      }
      current = next
    }
    current.value = value
    current.key = key
    if (key.length > this.maxKeyLength) {
      this.maxKeyLength = key.length
    }
  }

  /**
   * Load mapping dataset
   */
  public load(mappings: Record<string, string> | [string, string][]): void {
    if (Array.isArray(mappings)) {
      for (const [k, v] of mappings) {
        this.insert(k, v)
      }
    } else {
      for (const [k, v] of Object.entries(mappings)) {
        this.insert(k, v)
      }
    }
  }

  /**
   * Finds the longest matching mapping starting at `startIndex` in `text`.
   */
  public findLongestMatch(text: string, startIndex: number = 0): MatchResult | null {
    if (startIndex >= text.length) return null

    let current = this.root
    let longestMatch: MatchResult | null = null

    for (let i = startIndex; i < text.length; i++) {
      const char = text[i]
      const next = current.children.get(char)
      if (!next) {
        break
      }
      current = next
      if (current.value !== undefined && current.key !== undefined) {
        longestMatch = {
          key: current.key,
          value: current.value,
          length: i - startIndex + 1,
        }
      }
    }

    return longestMatch
  }

  /**
   * Get maximum key length registered
   */
  public getMaxKeyLength(): number {
    return this.maxKeyLength
  }
}
