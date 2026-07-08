const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

const formatPrice = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const getStorePhone = () => {
  const digits = WHATSAPP_NUMBER.replace(/\D/g, '')

  if (digits.length === 10) {
    return `91${digits}`
  }

  return digits
}

const buildWhatsAppUrl = (message) => {
  const phone = getStorePhone()
  const baseUrl = phone ? `https://wa.me/${phone}` : 'https://wa.me/'
  return `${baseUrl}?text=${encodeURIComponent(message)}`
}

const getProductLink = (productId) => {
  if (typeof window === 'undefined' || !productId) {
    return ''
  }

  return `${window.location.origin}/product/${productId}`
}

export const buildProductWhatsAppUrl = ({
  product,
  selectedSize = '',
  selectedColor = '',
  quantity = 1,
  price
}) => {
  const activePrice = price ?? product?.price ?? 0
  const productLink = getProductLink(product?.id)
  const lines = [
    'Hello LimeStreet, I want to buy this product:',
    '',
    `Product: ${product?.name || 'Product'}`,
    product?.category ? `Category: ${product.category}` : '',
    selectedSize ? `Size: ${selectedSize}` : '',
    selectedColor ? `Color: ${selectedColor}` : '',
    `Quantity: ${quantity}`,
    `Price: ${formatPrice(activePrice)}`,
    productLink ? `Product link: ${productLink}` : '',
    '',
    'Please confirm availability and next steps.'
  ].filter(Boolean)

  return buildWhatsAppUrl(lines.join('\n'))
}

export const buildOrderWhatsAppUrl = ({
  items = [],
  addressForm = {},
  subtotal = 0,
  deliveryCharge = 0,
  platformFee = 0,
  totalAmount = 0
}) => {
  const addressLines = [
    addressForm.customerName ? `Name: ${addressForm.customerName}` : '',
    addressForm.contactNumber ? `Mobile: ${addressForm.contactNumber}` : '',
    addressForm.addressLine1 ? `Address: ${addressForm.addressLine1}` : '',
    addressForm.addressLine2 || '',
    [addressForm.city, addressForm.state, addressForm.postalCode].filter(Boolean).join(', '),
    addressForm.country || ''
  ].filter(Boolean)

  const itemLines = items.map((item, index) => {
    const variant = [
      item.selectedSize ? `Size ${item.selectedSize}` : '',
      item.selectedColor || ''
    ].filter(Boolean).join(', ')

    return [
      `${index + 1}. ${item.productName}`,
      variant ? `   ${variant}` : '',
      `   Qty: ${item.quantity || 1}`,
      `   Amount: ${formatPrice(item.totalPrice)}`
    ].filter(Boolean).join('\n')
  })

  const lines = [
    'Hello LimeStreet, I want to place this order:',
    '',
    'Items:',
    ...itemLines,
    '',
    'Delivery details:',
    ...addressLines,
    '',
    `Subtotal: ${formatPrice(subtotal)}`,
    `Delivery: ${deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}`,
    `Platform fee: ${formatPrice(platformFee)}`,
    `Total: ${formatPrice(totalAmount)}`,
    '',
    'Please confirm availability and payment details.'
  ]

  return buildWhatsAppUrl(lines.join('\n'))
}
