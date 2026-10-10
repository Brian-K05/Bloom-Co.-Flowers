/** Concept-matched hero photography (local generated assets + curated stock). */

export const conceptHeroes = {
  'elegant-minimal': '/concepts/heroes/hero-elegant-minimal.jpg',
  'dark-luxury': '/concepts/heroes/hero-dark-luxury.jpg',
  'bright-playful': '/concepts/heroes/hero-bright-playful.jpg',
  'rustic-warm': '/concepts/heroes/hero-rustic-warm.jpg',
  'modern-bold': '/concepts/heroes/hero-modern-bold.jpg',
  'romantic-editorial': '/concepts/heroes/hero-romantic-editorial.jpg',
  'artistic-photographic': '/concepts/heroes/hero-artistic-macro.jpg',
  'scandinavian-nature': '/concepts/heroes/hero-scandinavian.jpg',
  'interactive-immersive': '/concepts/heroes/hero-immersive-nova.jpg',
  'local-boutique': '/concepts/heroes/hero-local-boutique.jpg',
} as const

export type ConceptHeroId = keyof typeof conceptHeroes
