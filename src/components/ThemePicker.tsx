import { usePreferences, useSavePreferences } from '../hooks/usePreferences'
import type { Preferences } from '../lib/db'

type ThemeName = Preferences['theme']

interface ThemeOption {
  name: ThemeName
  label: string
  preview: string
  accent: string
}

const THEMES: ThemeOption[] = [
  { name: 'default', label: 'Classic', preview: 'bg-slate-200', accent: 'ring-slate-400' },
  { name: 'ocean', label: 'Ocean', preview: 'bg-sky-200', accent: 'ring-sky-400' },
  { name: 'forest', label: 'Forest', preview: 'bg-emerald-200', accent: 'ring-emerald-400' },
  { name: 'sunset', label: 'Sunset', preview: 'bg-orange-200', accent: 'ring-orange-400' },
  { name: 'candy', label: 'Candy', preview: 'bg-pink-200', accent: 'ring-pink-400' },
]

interface ThemePickerProps {
  onClose: () => void
}

export function ThemePicker({ onClose }: ThemePickerProps) {
  const { data: prefs } = usePreferences()
  const savePrefs = useSavePreferences()
  const currentTheme = prefs?.theme || 'default'

  const handleSelect = async (theme: ThemeName) => {
    await savePrefs.mutateAsync({ theme })
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800">Choose a Theme</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
            aria-label="Close theme picker"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {THEMES.map((theme) => (
            <button
              key={theme.name}
              onClick={() => handleSelect(theme.name)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                currentTheme === theme.name
                  ? `ring-2 ${theme.accent} bg-slate-50 scale-105`
                  : 'hover:bg-slate-50'
              }`}
              aria-label={`${theme.label} theme`}
              aria-pressed={currentTheme === theme.name}
            >
              <div className={`w-10 h-10 rounded-full ${theme.preview} shadow-inner`} />
              <span className="text-[10px] font-medium text-slate-700">{theme.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
