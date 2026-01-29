import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePreferences, useSavePreferences } from '../hooks/usePreferences'
import { THEME_PRESETS, applyThemeByHue, getAccentColor } from '../lib/theme'
import { SUPPORTED_LOCALES, LOCALE_INFO, type Locale } from '../i18n'

interface SettingsPanelProps {
  isOpen: boolean
}

export function SettingsPanel({ isOpen }: SettingsPanelProps) {
  const { t, i18n } = useTranslation()
  const { data: prefs } = usePreferences()
  const savePrefs = useSavePreferences()
  // Local state for slider drag - initialized from prefs, kept in sync
  const [localHue, setLocalHue] = useState<number | null>(null)

  // Use localHue when dragging (non-null), otherwise use prefs
  const currentHue = localHue ?? prefs?.themeHue ?? 230

  const handleSliderChange = (hue: number) => {
    setLocalHue(hue)
    applyThemeByHue(hue)
  }

  const handleSliderCommit = () => {
    if (localHue !== null) {
      savePrefs.mutate({ themeHue: localHue })
      setLocalHue(null) // Reset to follow prefs again
    }
  }

  const handlePresetClick = (hue: number) => {
    setLocalHue(null) // Clear local override
    applyThemeByHue(hue)
    savePrefs.mutate({ themeHue: hue })
  }

  const handleLocaleChange = (locale: Locale) => {
    i18n.changeLanguage(locale)
    savePrefs.mutate({ locale })
  }

  const currentLocale = (i18n.language?.split('-')[0] || 'en') as Locale

  // Check if current hue matches a preset (within 5 degrees)
  const isPresetActive = (presetHue: number) => Math.abs(currentHue - presetHue) < 5

  if (!isOpen) {
    return null
  }

  return (
    <div className="animate-slide-up py-4 px-3 bg-surface rounded-2xl mt-2 shadow-sm">
      {/* Language Section */}
      <div className="mb-4">
        <p className="text-xs text-text-muted font-medium mb-2">{t('settings.language')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          {SUPPORTED_LOCALES.map((locale) => (
            <button
              key={locale}
              onClick={() => handleLocaleChange(locale)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                currentLocale === locale
                  ? 'bg-accent text-white scale-105 shadow-md'
                  : 'bg-bg hover:bg-border text-text'
              }`}
              title={LOCALE_INFO[locale].native}
            >
              <span className="mr-1">{LOCALE_INFO[locale].flag}</span>
              <span className="hidden sm:inline">{LOCALE_INFO[locale].native}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Section */}
      <div>
        <p className="text-xs text-text-muted font-medium mb-2">{t('settings.theme')}</p>

        {/* Preset buttons */}
        <div
          role="radiogroup"
          aria-label={t('a11y.themePresets')}
          className="flex justify-center gap-2 mb-3"
        >
          {THEME_PRESETS.map((preset) => (
            <button
              key={preset.name}
              role="radio"
              aria-checked={isPresetActive(preset.seedHue)}
              aria-label={t('a11y.themeOption', { name: preset.label })}
              onClick={() => handlePresetClick(preset.seedHue)}
              className={`w-7 h-7 rounded-full border-2 transition-all ${
                isPresetActive(preset.seedHue)
                  ? 'scale-125 border-white shadow-lg ring-2 ring-black/20'
                  : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: getAccentColor(preset.seedHue) }}
              title={preset.label}
            />
          ))}
        </div>

        {/* Hue slider */}
        <div className="flex items-center gap-3 px-2">
          <input
            type="range"
            min="0"
            max="360"
            value={currentHue}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            onMouseUp={handleSliderCommit}
            onTouchEnd={handleSliderCommit}
            aria-label={t('a11y.customHue')}
            className="flex-1 h-3 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right,
                hsl(0, 70%, 50%),
                hsl(60, 70%, 50%),
                hsl(120, 70%, 50%),
                hsl(180, 70%, 50%),
                hsl(240, 70%, 50%),
                hsl(300, 70%, 50%),
                hsl(360, 70%, 50%)
              )`,
            }}
          />
          <div
            className="w-8 h-8 rounded-full border-2 border-white shadow-md flex-shrink-0"
            style={{ backgroundColor: getAccentColor(currentHue) }}
            aria-hidden="true"
          />
        </div>
        <p className="text-center text-xs text-text-muted mt-2">
          {t('settings.dragToPickColor')}
        </p>
      </div>
    </div>
  )
}
