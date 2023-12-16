import type {Declaration, PropertyId} from 'lightningcss-wasm';

export const invalidIdent = new Set(['auto', 'inherit']);

export const validProperties = [
  'background-color',
  'opacity',
  'color',
  'display',
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
  'block-size',
  'inline-size',
  'min-block-size',
  'min-inline-size',
  'max-block-size',
  'max-inline-size',
  'overflow',
  'position',
  'top',
  'bottom',
  'left',
  'right',
  'box-shadow',
  'inset-block-start',
  'inset-block-end',
  'inset-inline-start',
  'inset-inline-end',
  'inset-block',
  'inset-inline',
  'inset',
  'border-top-color',
  'border-bottom-color',
  'border-left-color',
  'border-right-color',
  'border-block-start-color',
  'border-block-end-color',
  'border-inline-start-color',
  'border-inline-end-color',
  'border-top-width',
  'border-bottom-width',
  'border-left-width',
  'border-right-width',
  'border-block-start-width',
  'border-block-end-width',
  'border-inline-start-width',
  'border-inline-end-width',
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-left-radius',
  'border-bottom-right-radius',
  'border-start-start-radius',
  'border-start-end-radius',
  'border-end-start-radius',
  'border-end-end-radius',
  'border-radius',
  'border-color',
  'border-style',
  'border-width',
  'border-block-color',
  'border-block-width',
  'border-inline-color',
  'border-inline-width',
  'border',
  'border-top',
  'border-bottom',
  'border-left',
  'border-right',
  'border-block',
  'border-block-start',
  'border-block-end',
  'border-inline',
  'border-inline-start',
  'border-inline-end',
  'flex-direction',
  'flex-wrap',
  'flex-flow',
  'flex-grow',
  'flex-shrink',
  'flex-basis',
  'flex',
  'align-content',
  'justify-content',
  'align-self',
  'align-items',
  'row-gap',
  'column-gap',
  'gap',
  'margin-top',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-block-start',
  'margin-block-end',
  'margin-inline-start',
  'margin-inline-end',
  'margin-block',
  'margin-inline',
  'margin',
  'padding-top',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-block-start',
  'padding-block-end',
  'padding-inline-start',
  'padding-inline-end',
  'padding-block',
  'padding-inline',
  'padding',
  'font-weight',
  'font-size',
  'font-family',
  'font-style',
  'font-variant-caps',
  'line-height',
  'font',
  'vertical-align',
  'transition-property',
  'transition-duration',
  'transition-delay',
  'transition-timing-function',
  'transition',
  'aspect-ratio',
  'animation-duration',
  'animation-timing-function',
  'animation-iteration-count',
  'animation-direction',
  'animation-play-state',
  'animation-delay',
  'animation-fill-mode',
  'animation-name',
  'animation',
  'transform',
  'translate',
  'rotate',
  'scale',
  'text-transform',
  'letter-spacing',
  'text-decoration-line',
  'text-decoration-color',
  'text-decoration',
  'text-shadow',
  'z-index',
  'container-type',
  'text-decoration-style',
  'container-name',
  'container',
  'text-align',
] as const;

export const validPropertiesLoose = new Set<string>(validProperties);

export function isValid<T extends Declaration | PropertyId>(
  declaration: T,
): declaration is Extract<T, {property: (typeof validProperties)[number]}> {
  return validPropertiesLoose.has(declaration.property);
}
