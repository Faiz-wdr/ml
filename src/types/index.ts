import type { ReactNode } from 'react'

export type NavTabId = 'font' | 'manglish' | 'settings'

export interface NavItem {
  id: NavTabId
  label: string
  iconName: 'font' | 'manglish' | 'settings'
  disabled?: boolean
  badge?: string
}

export interface FontFormat {
  id: string
  name: string
  category: 'Legacy ASCII' | 'Unicode' | 'Custom'
  description: string
  sampleFonts: string[]
  isPopular?: boolean
  badge?: string
}

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'icon' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface TextEditorProps {
  id?: string
  value: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  formatTag?: string
  readOnly?: boolean
  minHeight?: string
  showCount?: boolean
  showClear?: boolean
  showCopy?: boolean
  showBottomBar?: boolean
  onClear?: () => void
  onCopy?: () => void
  extraHeaderContent?: ReactNode
  footerActions?: ReactNode
  ariaLabel?: string
  fontFamily?: 'sans' | 'malayalam' | 'mono'
  className?: string
  showTopCopy?: boolean
}
