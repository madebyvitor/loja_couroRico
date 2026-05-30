import type { CartItem } from '@/store/useStore'

/** Número do WhatsApp da Couro Rico (DDI + DDD + número) */
const WHATSAPP_NUMBER = '5583993104113'

/**
 * Gera o link completo para abrir o WhatsApp com um resumo
 * formatado do pedido do cliente.
 */
export function generateWhatsAppLink(
  cartItems: CartItem[],
  totalValue: number
): string {
  const header = `*Pedido — COURO RICO* 🛍️\n\nOlá, equipe Couro Rico! Gostaria de finalizar o pedido da minha seleção exclusiva:\n\n`

  const body = cartItems
    .map(
      (item) =>
        `▪ ${item.quantity}x *${item.name}*\n   R$ ${item.price.toFixed(2)} cada → Subtotal: *R$ ${(item.price * item.quantity).toFixed(2)}*`
    )
    .join('\n\n')

  const footer = `\n\n━━━━━━━━━━━━━━━━━━\n*Total estimado: R$ ${totalValue.toFixed(2)}*\n\nAguardo confirmação para prosseguir com os dados de pagamento e entrega. 🤎`

  const message = encodeURIComponent(header + body + footer)

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`
}
