import { images } from '../lib/images'
import { todayISODate } from '../lib/format'
import type { PosArticle, PosOrder, PosProduct } from './types'

export const POS_LOCATIONS = [
  'Makati – Poblacion',
  'San Jose',
  'Quezon City',
  'Pasig',
  'Mandaluyong',
  'Studio Pickup',
]

export const RIBBON_OPTIONS = ['Pink', 'Yellow', 'Red', 'Ivory', 'Sage', 'Gold']
export const WRAPPER_OPTIONS = ['Kraft', 'Ivory tissue', 'Blush wrap', 'Clear cellophane', 'Black matte']

export const seedProducts: PosProduct[] = [
  {
    id: 'classic-red-roses',
    name: 'Classic Red Roses',
    price: 1500,
    category: 'Roses',
    stockQty: 40,
    available: true,
    image: images.redRoses,
  },
  {
    id: 'blush-romance',
    name: 'Blush Romance',
    price: 1800,
    category: 'Roses',
    stockQty: 28,
    available: true,
    image: images.blush,
  },
  {
    id: 'white-elegance',
    name: 'White Elegance',
    price: 2000,
    category: 'Bouquets',
    stockQty: 18,
    available: true,
    image: images.white,
  },
  {
    id: 'pastel-dreams',
    name: 'Pastel Dreams',
    price: 1650,
    category: 'Bouquets',
    stockQty: 22,
    available: true,
    image: images.pastel,
  },
  {
    id: 'imported-tulips',
    name: 'Dutch Tulip Bundle',
    price: 2800,
    category: 'Imported',
    stockQty: 8,
    available: true,
    image: images.botanical,
    isImported: true,
  },
  {
    id: 'sweet-birthday',
    name: 'Sweet Birthday Bloom',
    price: 1450,
    category: 'Bouquets',
    stockQty: 30,
    available: true,
    image: images.birthday,
  },
  {
    id: 'love-grace',
    name: 'Love & Grace',
    price: 2200,
    category: 'Boxes',
    stockQty: 12,
    available: true,
    image: images.loveGrace,
  },
  {
    id: 'orchid-accent',
    name: 'Orchid Accent',
    price: 3200,
    category: 'Imported',
    stockQty: 0,
    available: false,
    image: images.lilac,
    isImported: true,
  },
]

function isoOffset(days: number) {
  const d = new Date()
  d.setDate(d.getDate() + days)
  const offset = d.getTimezoneOffset()
  return new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 10)
}

export const seedOrders: PosOrder[] = [
  {
    id: 'POS-1001',
    createdAt: new Date().toISOString(),
    source: 'messenger',
    status: 'confirmed',
    customerName: 'Isabelle Cruz',
    customerPhone: '+63 917 555 1024',
    recipientName: 'Marco Cruz',
    recipientPhone: '+63 918 555 2200',
    location: 'Makati – Poblacion',
    fulfillment: 'delivery',
    scheduleDate: todayISODate(),
    items: [
      { productId: 'classic-red-roses', name: 'Classic Red Roses', price: 1500, quantity: 1 },
    ],
    customization: {
      ribbon: 'Pink',
      wrapper: 'Ivory tissue',
      cardMessage: 'Happy anniversary — forever yours.',
      addOns: '',
      notes: 'From Messenger chat this morning',
    },
    isPreorder: false,
    supplierNote: '',
    reminderDue: null,
    reminderDone: false,
    history: [
      { at: new Date().toISOString(), by: 'Ana (staff)', text: 'Order encoded from Messenger' },
      { at: new Date().toISOString(), by: 'Ana (staff)', text: 'Status → Confirmed (stock deducted)' },
    ],
    subtotal: 1500,
    total: 1500,
    stockApplied: true,
  },
  {
    id: 'POS-1002',
    createdAt: new Date().toISOString(),
    source: 'messenger',
    status: 'pending',
    customerName: 'Lara Mendoza',
    customerPhone: '+63 927 111 8899',
    recipientName: 'Lara Mendoza',
    recipientPhone: '+63 927 111 8899',
    location: 'Studio Pickup',
    fulfillment: 'pickup',
    scheduleDate: isoOffset(1),
    items: [
      { productId: 'imported-tulips', name: 'Dutch Tulip Bundle', price: 2800, quantity: 1 },
    ],
    customization: {
      ribbon: 'Sage',
      wrapper: 'Kraft',
      cardMessage: '',
      addOns: 'Baby’s breath',
      notes: 'Customer asked about tulip meaning',
    },
    isPreorder: true,
    supplierNote: 'Need to confirm tulip shipment with importer',
    reminderDue: isoOffset(1),
    reminderDone: false,
    history: [
      { at: new Date().toISOString(), by: 'Owner', text: 'Pre-order logged from Messenger' },
    ],
    subtotal: 2800,
    total: 2800,
    stockApplied: false,
  },
  {
    id: 'POS-1003',
    createdAt: new Date().toISOString(),
    source: 'walk-in',
    status: 'preparing',
    customerName: 'Walk-in Guest',
    customerPhone: '+63 900 000 0000',
    recipientName: 'Sofia Reyes',
    recipientPhone: '+63 916 222 3344',
    location: 'San Jose',
    fulfillment: 'delivery',
    scheduleDate: todayISODate(),
    items: [
      { productId: 'pastel-dreams', name: 'Pastel Dreams', price: 1650, quantity: 1 },
      { productId: 'sweet-birthday', name: 'Sweet Birthday Bloom', price: 1450, quantity: 1 },
    ],
    customization: {
      ribbon: 'Yellow',
      wrapper: 'Blush wrap',
      cardMessage: 'Happy Birthday!',
      addOns: '',
      notes: '',
    },
    isPreorder: false,
    supplierNote: '',
    reminderDue: null,
    reminderDone: false,
    history: [
      { at: new Date().toISOString(), by: 'Ana (staff)', text: 'Walk-in order created' },
      { at: new Date().toISOString(), by: 'Ana (staff)', text: 'Status → Confirmed' },
      { at: new Date().toISOString(), by: 'Ana (staff)', text: 'Status → Preparing' },
    ],
    subtotal: 3100,
    total: 3100,
    stockApplied: true,
  },
]

export const seedArticles: PosArticle[] = [
  {
    id: 'rose-red',
    title: 'Red roses',
    category: 'flower',
    body: 'Classic symbol of deep romantic love and passion. Best for anniversaries, Valentine’s, and serious gestures.',
  },
  {
    id: 'tulip',
    title: 'Tulips',
    category: 'flower',
    body: 'Tulips suggest perfect love and elegant simplicity. Imported stems often need advance sourcing — use pre-order.',
  },
  {
    id: 'color-pink',
    title: 'Pink',
    category: 'color',
    body: 'Grace, admiration, and gentle affection. Safer choice when the relationship is new or friendly.',
  },
  {
    id: 'color-yellow',
    title: 'Yellow',
    category: 'color',
    body: 'Friendship, cheer, and celebration. Ideal for birthdays and “just because” gifts.',
  },
  {
    id: 'tip-messenger',
    title: 'Encoding a Messenger order',
    category: 'tip',
    body: 'Confirm product, date, location, ribbon/wrapper, and card message in chat, then create the POS order immediately so stock and calendar stay accurate.',
  },
]
