import type { PosThemeId } from '../types'

export type PosThemeMeta = {
  id: PosThemeId
  number: string
  name: string
  mood: string
  description: string
  layout: 'rail' | 'kanban' | 'soft' | 'night' | 'split'
}

export const posThemes: PosThemeMeta[] = [
  {
    id: 'counter-clear',
    number: '01',
    name: 'Counter Clear',
    mood: 'Calm · Dense',
    description: 'Left icon rail and a dense workbench — New Order always one click away.',
    layout: 'rail',
  },
  {
    id: 'peak-board',
    number: '02',
    name: 'Peak Board',
    mood: 'Urgent · Ops',
    description: 'War-room board with status columns for peak days like Valentine’s.',
    layout: 'kanban',
  },
  {
    id: 'bloom-ledger',
    number: '03',
    name: 'Bloom Ledger',
    mood: 'Warm · Touch',
    description: 'Soft boutique desk with large touch targets for phone use in the shop.',
    layout: 'soft',
  },
  {
    id: 'night-shift',
    number: '04',
    name: 'Night Shift',
    mood: 'Dark · Focus',
    description: 'Low-glare cockpit with monospace IDs and a week-first calendar strip.',
    layout: 'night',
  },
  {
    id: 'studio-grid',
    number: '05',
    name: 'Studio Grid',
    mood: 'Editorial · Split',
    description: 'Inventory grid beside a live order form — studio prep energy.',
    layout: 'split',
  },
]

export const DEFAULT_POS_THEME: PosThemeId = 'counter-clear'

export function getPosTheme(id: string | null | undefined): PosThemeMeta {
  return posThemes.find((t) => t.id === id) ?? posThemes[0]
}
