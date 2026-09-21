import { useState, type FormEvent } from 'react'
import { BloomImage } from '../components/ui/BloomImage'
import { Button } from '../components/ui/Button'
import { useToast } from '../context/ToastContext'
import { brand } from '../data/catalog'
import { images } from '../lib/images'
import { isEmail } from '../lib/format'

export function ContactPage() {
  const { notify } = useToast()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  function submit(event: FormEvent) {
    event.preventDefault()
    const next: Record<string, string> = {}
    if (!name.trim()) next.name = 'Please tell us your name.'
    if (!isEmail(email)) next.email = 'Please enter a valid email.'
    if (!message.trim()) next.message = 'A short message helps us reply.'
    setErrors(next)
    if (Object.keys(next).length) return
    setSent(true)
    notify('Thank you. This is a demo — your message was not sent.')
  }

  return (
    <div className="grid lg:grid-cols-2">
      <BloomImage src={images.contact} alt="Botanical still life" className="min-h-[320px] lg:min-h-full" eager />
      <div className="px-6 py-14 sm:px-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-rose">Correspondence</p>
        <h1 className="mt-3 font-display text-5xl">Contact</h1>
        <p className="mt-4 max-w-md text-muted">
          For a real studio this form would reach the shop. Here, it only demonstrates the conversation.
        </p>

        <div className="mt-8 space-y-1 text-sm text-muted">
          <p>{brand.address}</p>
          <p>{brand.phone}</p>
          <p>{brand.email}</p>
        </div>

        {sent ? (
          <div className="mt-10 border border-line bg-paper p-6">
            <h2 className="font-display text-3xl">Message received</h2>
            <p className="mt-3 text-muted">
              In production, the shop would reply by email. This prototype does not send mail or store enquiries.
            </p>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-10 max-w-lg space-y-4">
            <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
              Name
              <input
                className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name ? <span className="mt-1 block text-xs tracking-normal text-rose">{errors.name}</span> : null}
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
              Email
              <input
                className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email ? <span className="mt-1 block text-xs tracking-normal text-rose">{errors.email}</span> : null}
            </label>
            <label className="block text-[11px] uppercase tracking-[0.16em] text-muted">
              Message
              <textarea
                rows={5}
                className="mt-2 w-full border border-line bg-paper px-3 py-2.5 text-sm tracking-normal text-ink"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {errors.message ? (
                <span className="mt-1 block text-xs tracking-normal text-rose">{errors.message}</span>
              ) : null}
            </label>
            <Button type="submit">Send message</Button>
          </form>
        )}
      </div>
    </div>
  )
}
