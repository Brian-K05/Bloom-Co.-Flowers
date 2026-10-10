import { conceptHeroes } from './visuals'

export type ConceptId =
  | 'elegant-minimal'
  | 'dark-luxury'
  | 'bright-playful'
  | 'rustic-warm'
  | 'modern-bold'
  | 'romantic-editorial'
  | 'artistic-photographic'
  | 'scandinavian-nature'
  | 'interactive-immersive'
  | 'local-boutique'

export type CursorStyle = 'dot-ring' | 'gold-glow' | 'playful' | 'warm' | 'contrast' | 'rose' | 'view' | 'sage' | 'neon' | 'warm-accent'

export type ConceptMeta = {
  id: ConceptId
  number: string
  slug: string
  name: string
  brand: string
  tagline: string
  mood: string
  description: string
  fonts: string
  heroImage: string
  previewImage: string
  cursor: CursorStyle
  cursorLabel?: string
  route: string
}

export const concepts: ConceptMeta[] = [
  {
    id: 'elegant-minimal',
    number: '01',
    slug: '01-elegant-minimal',
    name: 'Elegant Minimal',
    brand: 'Petal & Bloom',
    tagline: 'Quiet luxury, arranged simply',
    mood: 'Clean · Premium',
    description: 'Airy ivory spaces, serif headlines, and restrained motion — flowers first.',
    fonts: 'Cormorant Garamond + Outfit',
    heroImage: conceptHeroes['elegant-minimal'],
    previewImage: conceptHeroes['elegant-minimal'],
    cursor: 'dot-ring',
    cursorLabel: 'View',
    route: '/concepts/01-elegant-minimal',
  },
  {
    id: 'dark-luxury',
    number: '02',
    slug: '02-dark-luxury',
    name: 'Dark Luxury',
    brand: 'Fleur Noir',
    tagline: 'Cinematic blooms after dark',
    mood: 'Moody · Cinematic',
    description: 'Near-black surfaces, muted gold, and dramatic rose photography.',
    fonts: 'Playfair Display + Manrope',
    heroImage: conceptHeroes['dark-luxury'],
    previewImage: conceptHeroes['dark-luxury'],
    cursor: 'gold-glow',
    route: '/concepts/02-dark-luxury',
  },
  {
    id: 'bright-playful',
    number: '03',
    slug: '03-bright-playful',
    name: 'Bright & Playful',
    brand: 'Bloomy',
    tagline: 'Happy flowers, easy gifting',
    mood: 'Fun · Youthful',
    description: 'Coral, cream, and bounce — cheerful shopping without the clutter.',
    fonts: 'Nunito + Quicksand',
    heroImage: conceptHeroes['bright-playful'],
    previewImage: conceptHeroes['bright-playful'],
    cursor: 'playful',
    route: '/concepts/03-bright-playful',
  },
  {
    id: 'rustic-warm',
    number: '04',
    slug: '04-rustic-warm',
    name: 'Rustic & Warm',
    brand: 'Willow & Fern',
    tagline: 'Handcrafted, rooted, real',
    mood: 'Natural · Handmade',
    description: 'Parchment tones, olive accents, and artisan storytelling.',
    fonts: 'Libre Baskerville + Source Sans 3',
    heroImage: conceptHeroes['rustic-warm'],
    previewImage: conceptHeroes['rustic-warm'],
    cursor: 'warm',
    route: '/concepts/04-rustic-warm',
  },
  {
    id: 'modern-bold',
    number: '05',
    slug: '05-modern-bold',
    name: 'Modern Bold',
    brand: 'PETAL',
    tagline: 'Bigger. Bolder. Blooms.',
    mood: 'Striking · Contemporary',
    description: 'Black, white, electric pink — fashion-forward floral retail.',
    fonts: 'Syne + Space Grotesk',
    heroImage: conceptHeroes['modern-bold'],
    previewImage: conceptHeroes['modern-bold'],
    cursor: 'contrast',
    cursorLabel: 'Explore',
    route: '/concepts/05-modern-bold',
  },
  {
    id: 'romantic-editorial',
    number: '06',
    slug: '06-romantic-editorial',
    name: 'Romantic Editorial',
    brand: 'Le Fleur',
    tagline: 'Soft stories in bloom',
    mood: 'Soft · Emotional',
    description: 'Blush gradients, italic serifs, and occasion-led storytelling.',
    fonts: 'Bodoni Moda + Karla',
    heroImage: conceptHeroes['romantic-editorial'],
    previewImage: conceptHeroes['romantic-editorial'],
    cursor: 'rose',
    route: '/concepts/06-romantic-editorial',
  },
  {
    id: 'artistic-photographic',
    number: '07',
    slug: '07-artistic-photographic',
    name: 'Artistic & Photographic',
    brand: 'FLORA',
    tagline: 'A gallery of living color',
    mood: 'Visual · Boutique',
    description: 'Macro photography, asymmetric grids, and sparse captions.',
    fonts: 'Newsreader + Figtree',
    heroImage: conceptHeroes['artistic-photographic'],
    previewImage: conceptHeroes['artistic-photographic'],
    cursor: 'view',
    cursorLabel: 'View',
    route: '/concepts/07-artistic-photographic',
  },
  {
    id: 'scandinavian-nature',
    number: '08',
    slug: '08-scandinavian-nature',
    name: 'Scandinavian Nature',
    brand: 'VERDANT',
    tagline: 'Calm arrangements, clear choices',
    mood: 'Calm · Organic',
    description: 'Sage, stone, and generous whitespace — effortless to shop.',
    fonts: 'Source Serif 4 + Sora',
    heroImage: conceptHeroes['scandinavian-nature'],
    previewImage: conceptHeroes['scandinavian-nature'],
    cursor: 'sage',
    route: '/concepts/08-scandinavian-nature',
  },
  {
    id: 'interactive-immersive',
    number: '09',
    slug: '09-interactive-immersive',
    name: 'Interactive & Immersive',
    brand: 'NOVA BLOOMS',
    tagline: 'Discover your perfect bouquet',
    mood: 'Dynamic · Digital',
    description: 'Midnight tones and a mood-based bouquet finder that actually filters.',
    fonts: 'Exo 2 + Manrope',
    heroImage: conceptHeroes['interactive-immersive'],
    previewImage: conceptHeroes['interactive-immersive'],
    cursor: 'neon',
    route: '/concepts/09-interactive-immersive',
  },
  {
    id: 'local-boutique',
    number: '10',
    slug: '10-local-boutique',
    name: 'Filipino Local Boutique',
    brand: 'Sariwa Blooms',
    tagline: 'Fresh flowers, from our studio to you',
    mood: 'Authentic · Welcoming',
    description: 'Warm cream, tropical green, PHP pricing, and clear Metro Manila delivery notes.',
    fonts: 'Zilla Slab + Nunito Sans',
    heroImage: conceptHeroes['local-boutique'],
    previewImage: conceptHeroes['local-boutique'],
    cursor: 'warm-accent',
    route: '/concepts/10-local-boutique',
  },
]

export const DEFAULT_CONCEPT: ConceptId = 'elegant-minimal'

export function getConcept(id: ConceptId | string | null | undefined): ConceptMeta {
  return concepts.find((c) => c.id === id || c.slug === id) ?? concepts[0]
}

export function isConceptId(value: string | null | undefined): value is ConceptId {
  return concepts.some((c) => c.id === value)
}

export function isConceptSlug(value: string | null | undefined): boolean {
  return concepts.some((c) => c.slug === value)
}
