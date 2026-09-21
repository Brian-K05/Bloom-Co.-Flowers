import { brand } from '../data/catalog'
import {
  formatDate,
  formatDateTime,
  formatPHP,
  orderStatusLabel,
  paymentLabel,
  paymentStatusLabel,
} from './format'
import type { Order } from '../types'

export function orderSummaryHtml(order: Order) {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #e4dcd0;">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e4dcd0;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e4dcd0;text-align:right;">${formatPHP(item.price)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #e4dcd0;text-align:right;">${formatPHP(item.price * item.quantity)}</td>
      </tr>`,
    )
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Order Summary ${order.id} — ${brand.name}</title>
</head>
<body style="margin:0;background:#f6f1e8;color:#2a2724;font-family:Georgia,'Times New Roman',serif;">
  <main style="max-width:720px;margin:32px auto;padding:40px 44px;background:#fffcf8;border:1px solid #e4dcd0;">
    <p style="margin:0;letter-spacing:.28em;text-transform:uppercase;font-size:11px;font-family:Arial,sans-serif;color:#7a3e48;">Order Summary / Customer Receipt</p>
    <h1 style="margin:12px 0 4px;font-weight:500;font-size:36px;">${brand.name}</h1>
    <p style="margin:0 0 28px;font-style:italic;color:#6b645c;">${brand.tagline}</p>
    <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:13px;"><strong>Order number:</strong> ${order.id}</p>
    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:13px;"><strong>Date:</strong> ${formatDateTime(order.createdAt)}</p>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;">
      <tr>
        <td style="vertical-align:top;padding:0 16px 20px 0;width:50%;">
          <p style="letter-spacing:.18em;text-transform:uppercase;font-size:10px;color:#7a3e48;margin:0 0 8px;">Customer</p>
          <p style="margin:0 0 4px;">${order.customer.name}</p>
          <p style="margin:0 0 4px;color:#6b645c;">${order.customer.email}</p>
          <p style="margin:0;color:#6b645c;">${order.customer.phone}</p>
        </td>
        <td style="vertical-align:top;padding:0 0 20px;width:50%;">
          <p style="letter-spacing:.18em;text-transform:uppercase;font-size:10px;color:#7a3e48;margin:0 0 8px;">Recipient</p>
          <p style="margin:0 0 4px;">${order.recipient.name || '—'}</p>
          <p style="margin:0 0 4px;color:#6b645c;">${order.recipient.phone || '—'}</p>
          <p style="margin:0;color:#6b645c;">${order.fulfillment === 'delivery' ? order.recipient.address : 'Store pickup — ' + brand.address}</p>
        </td>
      </tr>
    </table>
    <table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:13px;margin-top:8px;">
      <thead>
        <tr>
          <th style="text-align:left;padding:8px 0;border-bottom:1px solid #2a2724;">Product</th>
          <th style="text-align:center;padding:8px 0;border-bottom:1px solid #2a2724;">Qty</th>
          <th style="text-align:right;padding:8px 0;border-bottom:1px solid #2a2724;">Price</th>
          <th style="text-align:right;padding:8px 0;border-bottom:1px solid #2a2724;">Subtotal</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="text-align:right;font-family:Arial,sans-serif;margin:18px 0 0;font-size:16px;"><strong>Total ${formatPHP(order.total)}</strong></p>
    <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e4dcd0;font-family:Arial,sans-serif;font-size:13px;line-height:1.7;">
      <p style="margin:0;"><strong>Fulfillment:</strong> ${order.fulfillment === 'delivery' ? 'Delivery' : 'Store Pickup'}</p>
      <p style="margin:0;"><strong>${order.fulfillment === 'delivery' ? 'Delivery date' : 'Pickup date'}:</strong> ${formatDate(order.scheduleDate)}</p>
      <p style="margin:0;"><strong>Payment method:</strong> ${paymentLabel(order.paymentMethod)}</p>
      <p style="margin:0;"><strong>Payment status:</strong> ${paymentStatusLabel(order.paymentStatus)}</p>
      <p style="margin:0;"><strong>Order status:</strong> ${orderStatusLabel(order.orderStatus, order.fulfillment)}</p>
      ${order.personalizedMessage ? `<p style="margin:12px 0 0;"><strong>Personalized message:</strong><br/>${order.personalizedMessage}</p>` : ''}
      ${order.notes ? `<p style="margin:12px 0 0;"><strong>Notes:</strong><br/>${order.notes}</p>` : ''}
    </div>
    <p style="margin:36px 0 0;font-family:Arial,sans-serif;font-size:11px;color:#6b645c;letter-spacing:.02em;">
      This is an order summary / customer receipt for demonstration purposes. It is not an official tax receipt.
      Demo Prototype — Products, branding, pricing, and business information are for demonstration purposes.
    </p>
  </main>
</body>
</html>`
}

export function downloadOrderSummary(order: Order) {
  const blob = new Blob([orderSummaryHtml(order)], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `Bloom-and-Co-Order-${order.id}.html`
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export function printOrderSummary(order: Order) {
  const frame = window.open('', '_blank')
  if (!frame) {
    downloadOrderSummary(order)
    return
  }
  frame.document.write(orderSummaryHtml(order))
  frame.document.close()
  frame.focus()
  frame.print()
}
