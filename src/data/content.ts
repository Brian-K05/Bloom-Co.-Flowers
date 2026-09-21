import type { Category, OccasionSlug } from '../types'
import { images } from '../lib/images'

export const categories: { id: 'all' | Category; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'roses', label: 'Roses' },
  { id: 'bouquets', label: 'Bouquets' },
  { id: 'boxes', label: 'Flower Boxes' },
]

export const occasions: {
  slug: OccasionSlug
  label: string
  eyebrow: string
  description: string
  image: string
}[] = [
  {
    slug: 'birthday',
    label: 'Birthdays',
    eyebrow: 'Celebrate',
    description:
      'Bright, gift-ready arrangements for the people who make ordinary days feel like occasions.',
    image: images.birthday,
  },
  {
    slug: 'anniversary',
    label: 'Anniversaries',
    eyebrow: 'Remember',
    description:
      'Garden roses, peonies, and quiet luxury for the milestones you never want to underplay.',
    image: images.anniversary,
  },
  {
    slug: 'valentines',
    label: "Valentine's Day",
    eyebrow: 'Seasonal',
    description:
      'Classic reds, blush romantics, and statement boxes — composed for February, and for every day after.',
    image: images.valentines,
  },
  {
    slug: 'mothers-day',
    label: "Mother's Day",
    eyebrow: 'Thank you',
    description:
      'Soft palettes and familiar favorites, arranged with the care the day deserves.',
    image: images.mothers,
  },
  {
    slug: 'graduation',
    label: 'Graduation',
    eyebrow: 'Begin',
    description:
      'Cheerful, photogenic blooms for the walk across the stage — and the dinner that follows.',
    image: images.graduation,
  },
  {
    slug: 'christmas',
    label: 'Christmas',
    eyebrow: 'Gather',
    description:
      'Ivory, ruby, and evergreen notes for hostess gifts, tables, and the last week of the year.',
    image: images.christmas,
  },
  {
    slug: 'just-because',
    label: 'Just Because',
    eyebrow: 'Whenever',
    description:
      'The most important orders are often the ones with no occasion at all. Send something beautiful anyway.',
    image: images.justBecause,
  },
]

export const shopOccasions = [
  { id: 'all' as const, label: 'All occasions' },
  ...occasions.map((item) => ({ id: item.slug, label: item.label })),
]
