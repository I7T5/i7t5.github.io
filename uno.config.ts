import presetUno from '@unocss/preset-uno'
import { defineConfig, presetIcons, presetTypography, presetWebFonts } from 'unocss'

export default defineConfig({
    presets: [
      presetUno(),
      presetIcons({
        extraProperties: {
          'display': 'inline-block',
          'vertical-align': 'middle',
        },
      }),
      presetTypography({
        cssExtend: {
          'h1, h2, h3, h4, h5, h6': {
            // TODO: color: text-base
            'font-family': 'Nunito', 
            'font-weight': 'normal',
            'text-wrap': 'balance',
            'margin-top': '1em',
            'margin-bottom': 0,
            // 'font-size': '1.75em'
          },
          'p': {
            margin: '0 0 1em 0', 
          },
          'a': {
            color: '#0d59f2',  // text-blue
            'text-decoration': 'none',
            // class='transition'
            'transition-property': 'color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter',
            'transition-timing-function': 'cubic-bezier(0.4, 0, 0.2, 1)',
            'transition-duration': '150ms',
          },
          'a:hover': {
            color: '#0d59f2c0', // text-blue-light 
          },
          'a:visited': {
            color: '#0a47c2',   // text-blue-dark
          },
          '.post-references' : {
            color: '#9ca3af',  // text-secondary
            'margin-top': '2em',
          },
          '.post-references ul' : {
            'margin-top': '.25em',  
          },
          'img': {
            'padding': '0 4em 0 2em',
          }, 
          '#footnote-label': {
            'font-size': '1rem',
            'font-style': 'italic',
          },
          '.prose .katex': {
            // color: 'text-foreground',
            'font-size': '1rem',
          },
          '.prose .callout': {
            'background-color': 'rgb(from var(--rc-color-light, var(--rc-color-default)) r g b / 0.1)',
          },
          '.prose .callout[open] summary': {
            'padding-bottom': '1em',
          },
          '.prose .callout[open] .callout-content p:last-child': {
            'margin-bottom': '0.5em',
          },
          // // callout animations
          // '.prose .callout .callout-content': {
          //   'overflow': 'hidden',
          //   'transition': 'opacity 0.7s ease, max-height 1s ease',
          // }, 
          // '.callout:not([open]) .callout-content': {
          //   'max-height': 0,
          //   'opacity': 0,
          // },
          // '.callout[open] .callout-content': {
          //   'max-height': '1000px',  // large enough to fit content
          //   'opacity': 1,
          //   'padding-bottom': '1em',
          // },
        },
      }), 
      presetWebFonts({
        provider: "google", 
          fonts: {
            sans: [{
              name: "Karla", 
              weights: ['400', '500', '600', '700'],
              italic: false,  // italic shrinks width...
            }],
            // serif: ["Spectral"],
            mono: ["IBM Plex Mono"], 
            display: ["Nunito"],
          }
      })
    ],
    theme: {
      colors: {
        // primary: '',
        secondary: '#9ca3af',  // text-gray-400
        tertiary: '#e5e7eb',   // text-gray-200
        blue: {
          dark: '#0a47c2',
          DEFAULT: '#0000ff', 
          light: '#0d59f2c0',
          lightest: '#0d59f280',
        },
        purple: '#7126d9',
        red: '#fb5151',
      },
    },
    rules: [
      // custom utility classes
      // ['oblique', { 'font-style': 'oblique' }],
      // ["font-serif", { "font-family": "CMU Serif" }],
    ],
    preflights: [
      {
        // define local fonts
        getCSS: () => ``,
      },
    ],
})