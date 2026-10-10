import { Link } from 'react-router-dom'
import { useConcept } from '../../concepts/ConceptProvider'
import { concepts, type ConceptId } from '../../concepts/registry'
import { brand } from '../../data/catalog'

const darkConcepts: ConceptId[] = ['dark-luxury', 'artistic-photographic', 'interactive-immersive']

export function Footer() {
  const { concept, conceptId, setConcept } = useConcept()
  const dark = darkConcepts.includes(conceptId)

  return (
    <footer
      className={`border-t ${
        dark ? 'border-white/10 bg-black text-paper' : 'border-line bg-cream text-ink'
      }`}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-20">
        <div>
          <p className="font-display text-3xl tracking-[0.06em]">{concept.brand}</p>
          <p className={`mt-3 max-w-xs text-sm italic leading-relaxed ${dark ? 'text-paper/65' : 'text-muted'}`}>
            {concept.tagline}
          </p>
          <div className="mt-6 h-px w-10 bg-gold" />
          <p className={`mt-6 text-sm leading-relaxed ${dark ? 'text-paper/65' : 'text-muted'}`}>
            {concept.description}
          </p>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Navigate</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/shop" className="hover:text-rose">Shop</Link></li>
            <li><Link to="/occasions" className="hover:text-rose">Occasions</Link></li>
            <li><Link to="/about" className="hover:text-rose">About</Link></li>
            <li><Link to="/contact" className="hover:text-rose">Contact</Link></li>
            <li><Link to="/account" className="hover:text-rose">Account</Link></li>
            <li><Link to="/concepts" className="hover:text-rose">Design concepts</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Visit</p>
          <p className="mt-4 text-sm leading-relaxed text-muted">{brand.address}</p>
          <p className="mt-3 text-sm text-muted">{brand.phone}</p>
          <p className="text-sm text-muted">{brand.email}</p>
          <div className="mt-5 space-y-1 text-sm text-muted">
            {brand.hours.map((item) => (
              <p key={item.days}>
                {item.days}: {item.time}
              </p>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Concept</p>
          <p className="mt-4 text-sm text-muted">
            {concept.number} · {concept.name}
          </p>
          <div className="mt-4 grid grid-cols-5 gap-2 sm:flex sm:flex-wrap">
            {concepts.map((item) => (
              <Link
                key={item.id}
                to={item.route}
                onClick={() => setConcept(item.id as ConceptId)}
                title={item.name}
                aria-current={conceptId === item.id ? 'page' : undefined}
                className={`border px-2 py-2 text-center text-[10px] uppercase tracking-[0.1em] sm:py-1 ${
                  conceptId === item.id
                    ? 'border-rose text-rose'
                    : dark
                      ? 'border-white/20 text-paper/70 hover:text-paper'
                      : 'border-line text-muted hover:text-ink'
                }`}
              >
                {item.number}
              </Link>
            ))}
          </div>
          <Link to="/concepts" className="mt-4 inline-block text-[11px] uppercase tracking-[0.16em] text-muted hover:text-ink">
            Open gallery
          </Link>
          <Link to="/admin" className="mt-3 block text-[11px] uppercase tracking-[0.16em] text-muted/80 hover:text-ink">
            Admin demo
          </Link>
        </div>
      </div>
      <div className="border-t border-line px-5 py-5 text-center text-[11px] leading-relaxed tracking-[0.03em] text-muted lg:px-8">
        Demo Prototype — Products, branding, pricing, and business information are for demonstration purposes.
        This is not a live store and does not process real payments.
      </div>
    </footer>
  )
}
