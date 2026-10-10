import { images } from '../../lib/images'

export const moments = [
  {
    title: 'Say I Love You',
    body: 'Roses and quiet romantics for the person you want to keep.',
    href: '/shop?occasion=valentines',
    image: images.valentines,
  },
  {
    title: 'Make Their Birthday Special',
    body: 'Bright, gift-ready arrangements that arrive looking like a celebration.',
    href: '/shop?occasion=birthday',
    image: images.birthday,
  },
  {
    title: 'Celebrate an Anniversary',
    body: 'Garden roses and peonies for the milestones that deserve more than a last-minute gesture.',
    href: '/shop?occasion=anniversary',
    image: images.anniversary,
  },
  {
    title: 'Just Because',
    body: 'The most important orders often have no occasion at all.',
    href: '/shop?occasion=just-because',
    image: images.justBecause,
  },
]

export const benefits = [
  {
    title: 'Freshly Arranged',
    body: 'Composed the morning it leaves the studio — never waiting days in a cooler.',
  },
  {
    title: 'Easy Ordering',
    body: 'Choose your flowers, add a note, and set delivery or pickup in a few minutes.',
  },
  {
    title: 'Thoughtful Delivery',
    body: 'Timed Metro Manila delivery, with same-day options for selected areas.',
  },
]

export const steps = [
  { n: '01', title: 'Choose Your Flowers', body: 'Browse the collection or start with an occasion.' },
  { n: '02', title: 'Add Delivery Details', body: 'Tell us where — and when — it should arrive.' },
  { n: '03', title: 'Choose Payment', body: 'Cash on delivery, or GCash, Maya, or bank transfer.' },
  { n: '04', title: 'Receive Your Order', body: 'We prepare, confirm, and place it in the right hands.' },
]

export const categoryChips = [
  { label: 'Roses', href: '/shop?category=roses' },
  { label: 'Bouquets', href: '/shop?category=bouquets' },
  { label: 'Flower Boxes', href: '/shop?category=boxes' },
  { label: 'Birthday', href: '/shop?occasion=birthday' },
  { label: 'Anniversary', href: '/shop?occasion=anniversary' },
  { label: 'Valentine’s', href: '/shop?occasion=valentines' },
]
