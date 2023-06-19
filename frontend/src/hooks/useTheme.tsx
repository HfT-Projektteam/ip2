import { ThemeContext, type ThemeContextValue } from '@context/ThemeProvider'
import { useContext } from 'react'

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext)
}
