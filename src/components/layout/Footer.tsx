import { Link } from 'react-router-dom'
import { brand } from '../../data/catalog'

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-20">
        <div>
          <p className="font-display text-3xl tracking-[0.06em]">Bloom & Co.</p>
          <p className="mt-3 max-w-xs text-sm italic leading-relaxed text-muted">{brand.tagline}</p>
          <div className="mt-6 h-px w-10 bg-gold" />
          <p className="mt-6 text-sm leading-relaxed text-muted">
            A boutique floral studio arranging blooms for birthdays, anniversaries, and the quieter days in between.
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
          <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Studio</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Pinterest</li>
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-muted">{brand.sameDayNote}.</p>
          <Link to="/admin" className="mt-6 inline-block text-[11px] uppercase tracking-[0.16em] text-muted/80 hover:text-ink">
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
