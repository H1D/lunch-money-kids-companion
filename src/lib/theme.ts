/**
 * OKLCH-based color palette generator.
 * Uses neutral grays for UI elements with a single accent color.
 * All buckets share the same accent color for a cohesive look.
 */

export interface ThemePreset {
  name: string
  label: string
  seedHue: number
  emoji: string
}

// More distinct theme presets with well-separated hues
export const THEME_PRESETS: ThemePreset[] = [
  { name: 'blue', label: 'Blue', seedHue: 230, emoji: '💙' },
  { name: 'green', label: 'Green', seedHue: 145, emoji: '💚' },
  { name: 'orange', label: 'Orange', seedHue: 30, emoji: '🧡' },
  { name: 'rose', label: 'Rose', seedHue: 350, emoji: '💗' },
  { name: 'purple', label: 'Purple', seedHue: 280, emoji: '💜' },
  { name: 'teal', label: 'Teal', seedHue: 180, emoji: '🩵' },
  { name: 'amber', label: 'Amber', seedHue: 45, emoji: '💛' },
]

function oklch(l: number, c: number, h: number): string {
  return `oklch(${l}% ${c} ${h})`
}

/**
 * Generate CSS variable palette from a seed hue.
 * Page/text colors are neutral (low chroma).
 * Accent and bucket colors use the seed hue.
 */
export function generatePalette(seedHue: number): Record<string, string> {
  return {
    // Page - neutral grays (near-zero chroma for clean look)
    '--color-bg': oklch(98, 0.005, seedHue),
    '--color-bg-card': oklch(100, 0, 0),
    '--color-surface': oklch(96, 0.008, seedHue),
    '--color-border': oklch(90, 0.01, seedHue),

    // Text - neutral grays
    '--color-text': oklch(15, 0.01, seedHue),
    '--color-text-muted': oklch(40, 0.01, seedHue),
    '--color-text-subtle': oklch(55, 0.01, seedHue),

    // Accent (the main theme color)
    '--color-accent': oklch(50, 0.2, seedHue),
    '--color-accent-hover': oklch(43, 0.22, seedHue),
    '--color-accent-light': oklch(94, 0.04, seedHue),
    '--color-accent-text': oklch(40, 0.15, seedHue),

    // All buckets use the same accent-based colors
    // Vault
    '--color-vault-bg': oklch(96, 0.025, seedHue),
    '--color-vault-border': oklch(88, 0.05, seedHue),
    '--color-vault-icon': oklch(92, 0.04, seedHue),
    '--color-vault-text': oklch(25, 0.08, seedHue),
    '--color-vault-subtitle': oklch(40, 0.06, seedHue),

    // Goals (same as vault)
    '--color-goals-bg': oklch(96, 0.025, seedHue),
    '--color-goals-border': oklch(88, 0.05, seedHue),
    '--color-goals-icon': oklch(92, 0.04, seedHue),
    '--color-goals-text': oklch(25, 0.08, seedHue),
    '--color-goals-subtitle': oklch(40, 0.06, seedHue),

    // Spending (same as vault)
    '--color-spending-bg': oklch(96, 0.025, seedHue),
    '--color-spending-border': oklch(88, 0.05, seedHue),
    '--color-spending-icon': oklch(92, 0.04, seedHue),
    '--color-spending-text': oklch(25, 0.08, seedHue),
    '--color-spending-subtitle': oklch(40, 0.06, seedHue),

    // Status colors - fixed hues for semantic meaning
    '--color-danger': oklch(55, 0.22, 25),
    '--color-danger-light': oklch(95, 0.03, 25),
    '--color-success': oklch(45, 0.18, 145),
    '--color-success-light': oklch(95, 0.03, 145),
  }
}

/**
 * Find a preset by name. Falls back to first preset.
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
  return oklch(50, 0.2, seedHue)
}
