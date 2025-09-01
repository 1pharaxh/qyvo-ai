export type ThemeMode = 'dark' | 'light' | 'system'

declare global {
  interface Window {
    themeMode: {
      current: () => Promise<ThemeMode>
      dark: () => Promise<void>
      light: () => Promise<void>
      system: () => Promise<boolean>
      toggle: () => Promise<boolean>
    }
  }
}

const THEME_KEY = 'theme'

export interface ThemePreferences {
  system: ThemeMode
  local: ThemeMode | null
}

export async function getCurrentTheme(): Promise<ThemePreferences> {
  const currentTheme = await window.themeMode.current()
  const localTheme = localStorage.getItem(THEME_KEY) as ThemeMode | null

  return {
    system: currentTheme,
    local: localTheme
  }
}

export async function setTheme(newTheme: ThemeMode): Promise<void> {
  switch (newTheme) {
    case 'dark':
      await window.themeMode.dark()
      updateDocumentTheme(true)
      break
    case 'light':
      await window.themeMode.light()
      updateDocumentTheme(false)
      break
    case 'system': {
      const isDarkMode = await window.themeMode.system()
      updateDocumentTheme(isDarkMode)
      break
    }
  }

  localStorage.setItem(THEME_KEY, newTheme)
}

export async function toggleTheme(): Promise<void> {
  const isDarkMode = await window.themeMode.toggle()
  const newTheme = isDarkMode ? 'dark' : 'light'

  updateDocumentTheme(isDarkMode)
  localStorage.setItem(THEME_KEY, newTheme)
}

export async function syncThemeWithLocal(): Promise<void> {
  const { local } = await getCurrentTheme()
  if (!local) {
    setTheme('system')
    return
  }

  await setTheme(local)
}

function updateDocumentTheme(isDarkMode: boolean): void {
  if (!isDarkMode) {
    document.documentElement.classList.remove('dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}
