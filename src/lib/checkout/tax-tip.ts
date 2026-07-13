/**
 * Tax is calculated on the discounted (taxable) subtotal.
 * Tip is added after tax, so the total is:
 *   taxable + tax + tip
 * where taxable = max(0, subtotal - discount).
 */
export interface TaxTipInput {
  subtotalCents: number;
  discountCents: number;
  tipCents: number;
  taxRate: number;
}

export interface TaxTipResult {
  taxableCents: number;
  taxCents: number;
  tipCents: number;
  totalCents: number;
}

export function computeTaxAndTip({
  subtotalCents,
  discountCents,
  tipCents,
  taxRate,
}: TaxTipInput): TaxTipResult {
  const taxableCents = Math.max(0, subtotalCents - discountCents);
  const taxCents = Math.max(0, Math.round(taxableCents * taxRate));
  const totalCents = taxableCents + taxCents + tipCents;

  return {
    taxableCents,
    taxCents,
    tipCents,
    totalCents,
  };
}
