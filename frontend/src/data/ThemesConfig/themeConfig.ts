import { type ThemeConfig, theme as antdTheme } from 'antd'
import defaultTheme from '@data/Style'
export interface ThemeConfigCollection {
  configThemeDefault: ThemeConfig
  configThemeDark: ThemeConfig
}

const { colors } = defaultTheme

const configThemeDefault: ThemeConfig = {
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

const configThemeDark: ThemeConfig = {
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

const themesConfig: ThemeConfigCollection = {
  configThemeDefault,
  configThemeDark,
}

export default themesConfig
