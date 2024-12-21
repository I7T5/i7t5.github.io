import presetUno from '@unocss/preset-uno'
import { defineConfig, presetIcons } from 'unocss'

export default defineConfig({
    presets: [
        presetUno(),
        presetIcons({
            extraProperties: {
                'display': 'inline-block',
                'vertical-align': 'middle',
                // ...
              },
        }),
      ],
})