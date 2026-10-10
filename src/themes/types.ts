export type ThemeId = 'atelier' | 'garden' | 'noir'

export type ThemeMeta = {
  id: ThemeId
  name: string
  tagline: string
  mockup: string
}

export const themes: ThemeMeta[] = [
  {
    id: 'atelier',
    name: 'Atelier Soft',
    tagline: 'Warm boutique · romantic · soft luxury',
    mockup: '/themes/theme-a-atelier-soft-home.jpg',
  },
  {
    id: 'garden',
    name: 'Garden Modern',
    tagline: 'Fresh · bright · contemporary retail',
    mockup: '/themes/theme-b-garden-modern-home.jpg',
  },
  {
    id: 'noir',
    name: 'Noir Bloom',
    tagline: 'Dramatic · editorial · high contrast',
    mockup: '/themes/theme-c-noir-bloom-home.jpg',
  },
]

export const DEFAULT_THEME: ThemeId = 'atelier'

export function isThemeId(value: string | null | undefined): value is ThemeId {
  return value === 'atelier' || value === 'garden' || value === 'noir'
}
