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
    Button: { colorPrimary: colors.mutedKhakiColorPalette.green },
    Switch: {
      colorTextTertiary: colors.mutedKhakiColorPalette.red,
      colorTextQuaternary: colors.mutedKhakiColorPalette.green,
    },
    Typography: {
      colorLink: colors.typography.primaryBlack,
      colorLinkHover: colors.typography.primaryBlack,
    },
  },
}

const configThemeDark: ThemeConfig = {
  token: {
    colorPrimary: colors.mutedKhakiColorPalette.khakiDark,
  },
  algorithm: antdTheme.darkAlgorithm,
  components: {
    Button: { colorPrimary: colors.mutedKhakiColorPalette.red },
    Switch: {
      colorPrimary: colors.mutedKhakiColorPalette.red,
      colorPrimaryHover: colors.mutedKhakiColorPalette.green,
    },
    Typography: {
      colorLink: colors.mutedKhakiColorPalette.red,
      colorLinkHover: colors.mutedKhakiColorPalette.khakiDark,
    },
  },
}

const themesConfig: ThemeConfigCollection = {
  configThemeDefault,
  configThemeDark,
}

export default themesConfig
