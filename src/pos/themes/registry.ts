import type { PosThemeId } from '../types'

export type PosThemeMeta = {
  id: PosThemeId
  number: string
  name: string
  mood: string
  description: string
  layout: 'rail' | 'kanban' | 'soft' | 'night' | 'split'
  pitch: string
}

export const posThemes: PosThemeMeta[] = [
  {
    id: 'counter-clear',
    number: '01',
    name: 'Counter Clear',
    mood: 'Calm · Dense workbench',
    description: 'Light stone + sage. Slim left icon rail and a dense desk — New Order always one click.',
    layout: 'rail',
    pitch: 'Recommended presentation default.',
  },
  {
    id: 'peak-board',
    number: '02',
    name: 'Peak Board',
    mood: 'Urgent · War room',
    description: 'Black / white / coral. Top status strip + kanban columns for Valentine’s-level days.',
    layout: 'kanban',
    pitch: 'Lead with this for peak-day story.',
  },
  {
    id: 'bloom-ledger',
    number: '03',
    name: 'Bloom Ledger',
    mood: 'Warm · Touch',
    description: 'Paper + rose. Soft sidebar, large touch targets for phone use behind the counter.',
    layout: 'soft',
    pitch: 'Best for phone-first staff.',
  },
  {
    id: 'night-shift',
    number: '04',
    name: 'Night Shift',
    mood: 'Dark · Focus',
    description: 'Charcoal + mint. Week strip first, monospace IDs, low-glare evening prep.',
    layout: 'night',
    pitch: 'After-hours encoding.',
  },
  {
    id: 'studio-grid',
    number: '05',
    name: 'Studio Grid',
    mood: 'Editorial · Split',
    description: 'Olive + ink. Stock grid left, live order form right — studio prep energy.',
    layout: 'split',
    pitch: 'Inventory-led encoding.',
  },
]

export const DEFAULT_POS_THEME: PosThemeId = 'counter-clear'

export function getPosTheme(id: string | null | undefined): PosThemeMeta {
  return posThemes.find((t) => t.id === id) ?? posThemes[0]
}
