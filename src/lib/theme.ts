/**
 * OKLCH-based color palette generator.
 * A single seed hue algorithmically generates ~30 CSS variables.
 */

export interface ThemePreset {
  name: string
  label: string
  seedHue: number
  emoji: string
}

export const THEME_PRESETS: ThemePreset[] = [
  { name: 'classic', label: 'Classic', seedHue: 220, emoji: '🎨' },
  { name: 'ocean', label: 'Ocean', seedHue: 210, emoji: '🌊' },
  { name: 'forest', label: 'Forest', seedHue: 145, emoji: '🌲' },
  { name: 'sunset', label: 'Sunset', seedHue: 25, emoji: '🌅' },
  { name: 'candy', label: 'Candy', seedHue: 330, emoji: '🍬' },
  { name: 'lavender', label: 'Lavender', seedHue: 275, emoji: '💜' },
  { name: 'lemon', label: 'Lemon', seedHue: 65, emoji: '🍋' },
]

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l}% ${c} ${h})`
}

/**
 * Generate ~30 CSS variable key-value pairs from a seed hue.
 * Bucket colors are derived from the seed hue with offsets.
 */
export function generatePalette(seedHue: number): Record<string, string> {
  // Derive bucket hues from seed with offsets for visual variety
  const vaultHue = (seedHue + 240) % 360   // Complementary-ish
  const goalsHue = (seedHue + 60) % 360    // Analogous warm
  const spendingHue = (seedHue + 150) % 360 // Split complementary

  // Status hues also derived
  const dangerHue = (seedHue + 30) % 360   // Warm warning
  const successHue = (seedHue + 120) % 360 // Triadic success

  return {
    // Page - increased chroma for more visible theme changes
    '--color-bg': oklch(97, 0.025, seedHue),
    '--color-bg-card': oklch(99, 0.015, seedHue),
    '--color-surface': oklch(94, 0.03, seedHue),
    '--color-border': oklch(88, 0.04, seedHue),

    // Text
    '--color-text': oklch(20, 0.03, seedHue),
    '--color-text-muted': oklch(45, 0.04, seedHue),
    '--color-text-subtle': oklch(60, 0.03, seedHue),

    // Accent (seed-hue driven) - L45% for 4.5:1 contrast with white
    '--color-accent': oklch(45, 0.18, seedHue),
    '--color-accent-hover': oklch(38, 0.18, seedHue),
    '--color-accent-light': oklch(92, 0.06, seedHue),
    '--color-accent-text': oklch(35, 0.12, seedHue),

    // Vault bucket (derived from seed)
    '--color-vault-bg': oklch(94, 0.05, vaultHue),
    '--color-vault-border': oklch(85, 0.08, vaultHue),
    '--color-vault-icon': oklch(89, 0.08, vaultHue),
    '--color-vault-text': oklch(25, 0.1, vaultHue),
    '--color-vault-subtitle': oklch(40, 0.1, vaultHue),

    // Goals bucket (derived from seed)
    '--color-goals-bg': oklch(94, 0.06, goalsHue),
    '--color-goals-border': oklch(85, 0.1, goalsHue),
    '--color-goals-icon': oklch(89, 0.09, goalsHue),
    '--color-goals-text': oklch(25, 0.08, goalsHue),
    '--color-goals-subtitle': oklch(40, 0.09, goalsHue),

    // Spending bucket (derived from seed)
    '--color-spending-bg': oklch(94, 0.06, spendingHue),
    '--color-spending-border': oklch(85, 0.09, spendingHue),
    '--color-spending-icon': oklch(89, 0.08, spendingHue),
    '--color-spending-text': oklch(25, 0.08, spendingHue),
    '--color-spending-subtitle': oklch(40, 0.09, spendingHue),

    // Status: danger (warm)
    '--color-danger': oklch(50, 0.2, dangerHue),
    '--color-danger-light': oklch(93, 0.05, dangerHue),

    // Status: success - L38% for contrast
    '--color-success': oklch(38, 0.15, successHue),
    '--color-success-light': oklch(93, 0.05, successHue),
  }
}

/**
 * Find a preset by name. Falls back to first preset ('classic')
 * for unknown names (backward compat with 'default').
 */
export function getPreset(name: string): ThemePreset {
  return THEME_PRESETS.find((p) => p.name === name) ?? THEME_PRESETS[0]
}

/**
 * Apply a theme by hue value (0-360) by setting all CSS variables on :root.
 */
export function applyThemeByHue(hue: number): void {
  const palette = generatePalette(hue)
  const style = document.documentElement.style

  for (const [key, value] of Object.entries(palette)) {
    style.setProperty(key, value)
  }
}

/**
 * Apply a theme preset by name.
 */
export function applyTheme(presetName: string): void {
  const preset = getPreset(presetName)
  applyThemeByHue(preset.seedHue)
}

/**
 * Return a single oklch accent color string for swatch previews.
 */
export function getAccentColor(seedHue: number): string {
  return oklch(45, 0.18, seedHue)
}
