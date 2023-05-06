import { theme as antdTheme } from 'antd'
import defaultTheme from '@data/Style'

const { colors } = defaultTheme

export const configThemeDefault = {
  token: {
    colorPrimary: colors.mutedKhakiColorPalette.khakiDark,
  },
  algorithm: antdTheme.defaultAlgorithm,
  components: {
    Button: {
      colorPrimary: colors.mutedKhakiColorPalette.green,
    },
  },
}

export const configThemeDark = {
  token: {
    colorPrimary: colors.mutedKhakiColorPalette.khakiDark,
  },
  algorithm: antdTheme.darkAlgorithm,
  components: {
    Button: {
      colorPrimary: colors.mutedKhakiColorPalette.red,
    },
  },
}
