import { createContext, useContext } from 'react'

type Theme = 'light' | 'dark'

const themeStorageKey = 'engineering-docs-theme'

export const themeContext = createContext<Theme>('light')

export function useTheme(): Theme {
  return useContext(themeContext)
}

export function readStoredTheme(): Theme {
  const storedTheme = window.localStorage.getItem(themeStorageKey)
  if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function storeTheme(theme: Theme): void {
  window.localStorage.setItem(themeStorageKey, theme)
}
