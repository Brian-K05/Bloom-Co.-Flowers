import { images } from '../../lib/images'

export const occasionLinks = [
  { title: 'Love', href: '/shop?occasion=valentines', image: images.valentines },
  { title: 'Birthday', href: '/shop?occasion=birthday', image: images.birthday },
  { title: 'Anniversary', href: '/shop?occasion=anniversary', image: images.anniversary },
  { title: 'Just Because', href: '/shop?occasion=just-because', image: images.justBecause },
]

export const usps = [
  { title: 'Freshly arranged', body: 'Composed the morning it leaves the studio.' },
  { title: 'Easy ordering', body: 'Choose flowers, add a note, pick delivery or pickup.' },
  { title: 'Thoughtful delivery', body: 'Metro Manila options with clear timing notes.' },
]

export const moodFilters = [
  { id: 'romantic', label: 'Romantic', occasion: 'valentines' },
  { id: 'joyful', label: 'Joyful', occasion: 'birthday' },
  { id: 'elegant', label: 'Elegant', occasion: 'anniversary' },
  { id: 'trendy', label: 'Trendy', occasion: 'just-because' },
] as const
