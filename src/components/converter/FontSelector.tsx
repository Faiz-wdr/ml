import React from 'react'
import { TARGET_FONT_FORMATS } from '../../constants/fonts'
import { Dropdown } from '../ui/Dropdown'

export interface FontSelectorProps {
  selectedFormatId: string
  onSelectFormat: (formatId: string) => void
  className?: string
  direction?: 'up' | 'down' | 'auto'
  align?: 'left' | 'right'
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedFormatId,
  onSelectFormat,
  className = '',
  direction = 'down',
  align = 'right',
}) => {
  const dropdownItems = TARGET_FONT_FORMATS.map((font) => ({
    id: font.id,
    label: font.name,
  }))

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <Dropdown
        items={dropdownItems}
        selectedId={selectedFormatId}
        onSelect={onSelectFormat}
        align={align}
        direction={direction}
        variant="badge"
      />
    </div>
  )
}
