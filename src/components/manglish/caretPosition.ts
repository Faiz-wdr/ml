/**
 * Utility to calculate caret (x, y) coordinates within a textarea
 * Based on the textarea mirror technique.
 */

const PROPERTIES = [
  'direction',
  'boxSizing',
  'width',
  'height',
  'overflowX',
  'overflowY',
  'borderTopWidth',
  'borderRightWidth',
  'borderBottomWidth',
  'borderLeftWidth',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'fontStyle',
  'fontVariant',
  'fontWeight',
  'fontStretch',
  'fontSize',
  'fontSizeAdjust',
  'lineHeight',
  'fontFamily',
  'textAlign',
  'textTransform',
  'textIndent',
  'textDecoration',
  'letterSpacing',
  'wordSpacing',
  'tabSize',
  'MozTabSize',
] as const

export function getCaretCoordinates(
  element: HTMLTextAreaElement,
  position: number
): { top: number; left: number; height: number } {
  // Create or reuse mirror div
  let div = document.getElementById('textarea-caret-position-mirror') as HTMLDivElement
  if (!div) {
    div = document.createElement('div')
    div.id = 'textarea-caret-position-mirror'
    document.body.appendChild(div)
  }

  const style = div.style
  const computed = window.getComputedStyle(element)

  style.whiteSpace = 'pre-wrap'
  style.wordBreak = 'break-word'
  style.position = 'absolute'
  style.visibility = 'hidden'
  style.pointerEvents = 'none'
  style.top = '0'
  style.left = '0'

  PROPERTIES.forEach((prop) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style[prop as any] = computed[prop as any]
  })

  // Firefox needs explicitly specified width
  style.width = `${element.clientWidth}px`

  // Text up to cursor
  const textBefore = element.value.substring(0, position)
  div.textContent = textBefore

  const span = document.createElement('span')
  span.textContent = element.value.substring(position) || '.'
  div.appendChild(span)

  const coordinates = {
    top: span.offsetTop + parseInt(computed.borderTopWidth || '0', 10) - element.scrollTop,
    left: span.offsetLeft + parseInt(computed.borderLeftWidth || '0', 10) - element.scrollLeft,
    height: parseInt(computed.lineHeight || '24', 10) || 24,
  }

  return coordinates
}
