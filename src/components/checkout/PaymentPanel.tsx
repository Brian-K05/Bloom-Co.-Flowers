import { Download } from 'lucide-react'
import { demoPayments } from '../../data/catalog'

function qrSrc() {
  const data = encodeURIComponent('BLOOM & CO. DEMO PAYMENT — DO NOT SEND FUNDS. Prototype only.')
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=8&bgcolor=FFFC F8&color=2A2724&data=${data}`.replace(
    / /g,
    '',
  )
}

export function PaymentPanel({ method }: { method: 'gcash' | 'maya' | 'bank' }) {
  const title = method === 'gcash' ? 'GCash' : method === 'maya' ? 'Maya' : 'Bank Transfer'

  async function downloadQr() {
    const response = await fetch(qrSrc())
    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'bloom-co-demo-payment-qr.png'
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="border border-line bg-paper p-5 sm:p-6">
      <p className="text-[11px] uppercase tracking-[0.22em] text-rose">Demo payment — {title}</p>
      <p className="mt-3 text-sm text-muted">
        Use the fictional details below. No real payment is processed. Payment will be manually verified by the shop.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-[200px_1fr] md:items-start">
        <div className="border border-line bg-cream p-3 text-center">
          <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-rose">Demo Payment QR</p>
          <img src={qrSrc()} alt="Demo payment QR code" className="mx-auto h-44 w-44 bg-paper object-contain" />
          <button
            type="button"
            onClick={() => void downloadQr()}
            className="mt-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-ink hover:text-rose"
          >
            <Download size={14} />
            Save QR
          </button>
        </div>
        <div className="space-y-2 text-sm">
          {method === 'bank' ? (
            <>
              <p><span className="text-muted">Bank:</span> {demoPayments.bankName}</p>
              <p><span className="text-muted">Account name:</span> {demoPayments.accountName}</p>
              <p><span className="text-muted">Account number:</span> {demoPayments.accountNumber}</p>
            </>
          ) : (
            <p>
              <span className="text-muted">{title} number:</span>{' '}
              {method === 'gcash' ? demoPayments.gcash : demoPayments.maya}
            </p>
          )}
          <p className="pt-2 text-muted">Send the order total, then upload a screenshot and enter the reference number.</p>
        </div>
      </div>
    </div>
  )
}
