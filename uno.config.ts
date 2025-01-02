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
            // mono: ["IBM Plex Mono", "DM Mono"],
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
    // rules: [
    //   ["font-serif", { "font-family": "CMU Serif" }],
    // ],
    preflights: [
      {
        // define local fonts
        getCSS: () => ``,
      },
    ],
})