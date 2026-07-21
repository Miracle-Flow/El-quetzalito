import { format } from "date-fns";

export interface ReceiptModifier {
  label: string;
  priceDeltaCents: number;
}

export interface ReceiptLineItem {
  name: string;
  quantity: number;
  unitCents: number;
  lineTotalCents: number;
  modifiers: ReceiptModifier[];
}

export interface ReceiptPayment {
  brand: string | null;
  last4: string | null;
  reference: string | null;
  authCode: string | null;
}

export interface ReceiptInput {
  merchantName: string;
  merchantPhone?: string | null;
  merchantAddress?: string | null;
  orderNumber: string;
  createdAt: Date;
  pickupMode: string;
  pickupSlot?: Date | null;
  currency: string;
  subtotalCents: number;
  discountCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
  promotionCode?: string | null;
  items: ReceiptLineItem[];
  payment: ReceiptPayment | null;
}

const DEFAULT_WIDTH = 36;

export function renderReceipt(input: ReceiptInput, width = DEFAULT_WIDTH): string[] {
  const money = makeMoneyFormatter(input.currency);

  const header = [
    center(input.merchantName, width),
    ...(input.merchantAddress ? [center(input.merchantAddress, width)] : []),
    ...(input.merchantPhone ? [center(input.merchantPhone, width)] : []),
    rule(width),
  ];

  const meta = [
    row("Order", input.orderNumber, width),
    row("Date", format(input.createdAt, "MMM d, yyyy h:mm a"), width),
    row("Type", describePickup(input.pickupMode, input.pickupSlot), width),
    ...(input.promotionCode ? [row("Promo", input.promotionCode, width)] : []),
    rule(width),
  ];

  const itemLines = input.items.flatMap((item) => {
    const prefix = item.quantity > 1 ? `${item.quantity}x ` : "";
    return [
      row(`${prefix}${item.name}`, money(item.lineTotalCents), width),
      ...item.modifiers.map((modifier) => {
        const detail = modifier.priceDeltaCents
          ? `+ ${modifier.label} ${money(modifier.priceDeltaCents)}`
          : `+ ${modifier.label}`;
        return row(`   ${detail}`, "", width).trimEnd();
      }),
    ];
  });

  const totals = [
    row("Subtotal", money(input.subtotalCents), width),
    ...(input.discountCents ? [row("Discount", money(-input.discountCents), width)] : []),
    ...(input.taxCents ? [row("Tax", money(input.taxCents), width)] : []),
    ...(input.tipCents ? [row("Tip", money(input.tipCents), width)] : []),
    row("TOTAL", money(input.totalCents), width),
    rule(width),
  ];

  return [
    ...header,
    ...meta,
    ...itemLines,
    ...totals,
    ...(input.payment ? paymentLines(input.payment, width) : []),
    "",
    center("Thank you!", width),
    center("El Quetzalito", width),
  ];
}

function paymentLines(payment: ReceiptPayment, width: number): string[] {
  const brand = payment.brand ? payment.brand.toUpperCase() : "CARD";
  const last4 = payment.last4 ? `****${payment.last4}` : "****";
  return [
    row(brand, last4, width),
    ...(payment.authCode ? [row("Auth", payment.authCode, width)] : []),
    ...(payment.reference ? [row("Ref", payment.reference.slice(0, width - 6), width)] : []),
    "",
  ];
}

function makeMoneyFormatter(currency: string): (cents: number) => string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });
  return (cents: number) => formatter.format(cents / 100);
}

function describePickup(mode: string, slot?: Date | null): string {
  if (mode === "delivery") return "Delivery";
  if (!slot) return "Pickup ASAP";
  return `Pickup ${format(slot, "MMM d, h:mm a")}`;
}

function row(left: string, right: string, width: number): string {
  const gap = width - left.length - right.length;
  if (gap <= 0) {
    const trimmed = left.slice(0, Math.max(0, width - right.length - 1));
    return `${trimmed} ${right}`.trimEnd();
  }
  return `${left}${" ".repeat(gap)}${right}`;
}

function center(text: string, width: number): string {
  if (text.length >= width) return text.slice(0, width);
  const pad = Math.floor((width - text.length) / 2);
  return `${" ".repeat(pad)}${text}`;
}

function rule(width: number): string {
  return "-".repeat(width);
}
