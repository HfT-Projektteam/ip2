import themesConfig from '@data/ThemesConfig/themeConfig'
import { type ThemeConfig } from 'antd'
import { useState, createContext } from 'react'

export interface ThemeContextValue {
  theme: ThemeConfig
  changeTheme: () => void
  isDarkmode: boolean
}

const initValue: ThemeContextValue = {
  theme: themesConfig.configThemeDefault,
  changeTheme: (): void => {
    throw new Error('Function not implemented.')
  },
  isDarkmode: false,
}

export const ThemeContext = createContext<ThemeContextValue>(initValue)

export default function ThemeProvider({ children }: any): JSX.Element {
  const { configThemeDefault, configThemeDark } = themesConfig
  const [theme, setTheme] = useState(themesConfig.configThemeDefault)
  const [isDarkmode, setIsDarkmode] = useState(theme === configThemeDark)

  const changeTheme = (): void => {
    theme === configThemeDefault
      ? setTheme(configThemeDark)
      : setTheme(configThemeDefault)

    setIsDarkmode(theme === configThemeDark)
  }

  const value: ThemeContextValue = {
    theme,
    changeTheme,
    isDarkmode,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
