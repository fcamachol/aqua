/**
 * Tariff Calculator — SUPRA Water 2026 Billing Engine
 *
 * Implements the block tariff calculation (tarifa escalonada) from SUPRA spec section 4.3.
 * Handles: water consumption tiers, alcantarillado, saneamiento, social discount, IVA.
 */

// ─── Types ──────────────────────────────────────────────────────

export interface TariffBlock {
  from_m3: number;
  to_m3: number | null;
  price_per_m3: number;
  fixed_charge?: number;
}

export interface AdditionalConcept {
  code: string;          // 'alcantarillado', 'saneamiento', 'cuota_fija', etc.
  name: string;
  type: 'percentage' | 'fixed';
  value: number;         // Percentage (0.25 = 25%) or fixed amount in MXN
  base?: string;         // For percentage type: which concept to base on ('agua')
}

export interface TariffSchedule {
  id: string;
  category: string;      // 'domestica', 'comercial', 'industrial', 'gobierno'
  billingPeriod: string;  // 'mensual', 'bimestral'
  blocks: TariffBlock[];
  additionalConcepts: AdditionalConcept[];
  ivaApplicable: boolean;
  socialDiscountPct: number | null;  // e.g. 20 = 20% discount
}

export interface BlockDetail {
  from: number;
  to: number | null;
  m3: number;
  rate: number;
  fixed: number;
  charge: number;
}

export interface WaterChargeResult {
  quantity: number;
  unitPrice: number;
  subtotal: number;
  detail: BlockDetail[];
}

export interface InvoiceLineItem {
  conceptCode: string;
  conceptName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  ivaRate: number;         // 0 for exempt, 0.16 for 16%
  ivaAmount: number;
  total: number;
  claveProdServ: string;   // SAT product/service key
  claveUnidad: string;     // SAT unit key
  tariffDetail?: BlockDetail[] | Record<string, unknown>;
  sortOrder: number;
}

export interface TariffCalculationResult {
  lines: InvoiceLineItem[];
  subtotal: number;
  ivaTotal: number;
  grandTotal: number;
  consumptionM3: number;
}

// ─── SAT Catalog Mappings ───────────────────────────────────────

const SAT_PRODUCT_KEYS: Record<string, string> = {
  agua: '10171500',
  alcantarillado: '72151802',
  saneamiento: '72151801',
  reconexion: '72151800',
  cuota_fija: '10171500',
};

const SAT_UNIT_KEYS: Record<string, string> = {
  m3: 'MTQ',
  servicio: 'E48',
  pieza: 'H87',
};

// ─── Block Tariff Calculation (from SUPRA spec 4.3) ─────────────

/**
 * Calculate water consumption charge using tiered blocks (tarifa escalonada).
 * Direct implementation of the SUPRA spec calculateBlockTariff function.
 */
export function calculateBlockTariff(
  consumptionM3: number,
  blocks: TariffBlock[],
): WaterChargeResult {
  let total = 0;
  const detail: BlockDetail[] = [];

  for (const block of blocks) {
    const blockMax = block.to_m3 ?? Infinity;
    const blockConsumption = Math.min(
      Math.max(consumptionM3 - block.from_m3, 0),
      blockMax - block.from_m3,
    );

    if (blockConsumption > 0) {
      const blockCharge =
        (block.fixed_charge || 0) + blockConsumption * block.price_per_m3;
      total += blockCharge;
      detail.push({
        from: block.from_m3,
        to: block.to_m3,
        m3: blockConsumption,
        rate: block.price_per_m3,
        fixed: block.fixed_charge || 0,
        charge: round2(blockCharge),
      });
    }
  }

  return {
    quantity: consumptionM3,
    unitPrice: consumptionM3 > 0 ? round2(total / consumptionM3) : 0,
    subtotal: round2(total),
    detail,
  };
}

// ─── Alcantarillado Calculation ─────────────────────────────────

function calculateAlcantarillado(
  waterSubtotal: number,
  concept: AdditionalConcept,
): { subtotal: number } {
  if (concept.type === 'percentage') {
    return { subtotal: round2(waterSubtotal * concept.value) };
  }
  return { subtotal: round2(concept.value) };
}

// ─── Full Tariff Calculation ────────────────────────────────────

/**
 * Calculate all invoice line items for a given consumption and tariff schedule.
 *
 * Steps (per SUPRA spec 4.3):
 * 1. Water consumption charge (tarifa escalonada)
 * 2. Alcantarillado (% of water charge)
 * 3. Saneamiento (fixed or percentage)
 * 4. Cuota fija (if applicable)
 * 5. Social tariff discount (if eligible)
 * 6. IVA rules: domestic water = exempt (0%), commercial = 16%
 */
export function calculateTariff(
  consumptionM3: number,
  tariff: TariffSchedule,
  options?: {
    socialTariffEligible?: boolean;
    specialCharges?: Array<{
      code: string;
      name: string;
      amount: number;
    }>;
  },
): TariffCalculationResult {
  const lines: InvoiceLineItem[] = [];
  let sortOrder = 0;

  // IVA rate: domestic water is exempt, commercial/industrial = 16%
  const ivaRate = tariff.ivaApplicable ? 0.16 : 0;

  // 1. Water consumption (tarifa escalonada)
  const waterCharge = calculateBlockTariff(consumptionM3, tariff.blocks);
  const waterIva = round2(waterCharge.subtotal * ivaRate);

  lines.push({
    conceptCode: 'agua',
    conceptName: 'Servicio de Agua Potable',
    quantity: waterCharge.quantity,
    unitPrice: waterCharge.unitPrice,
    subtotal: waterCharge.subtotal,
    ivaRate,
    ivaAmount: waterIva,
    total: round2(waterCharge.subtotal + waterIva),
    claveProdServ: SAT_PRODUCT_KEYS.agua,
    claveUnidad: SAT_UNIT_KEYS.m3,
    tariffDetail: waterCharge.detail,
    sortOrder: sortOrder++,
  });

  // 2-4. Additional concepts (alcantarillado, saneamiento, cuota_fija, etc.)
  for (const concept of tariff.additionalConcepts) {
    let subtotal: number;

    if (concept.type === 'percentage' && concept.base === 'agua') {
      subtotal = calculateAlcantarillado(waterCharge.subtotal, concept).subtotal;
    } else if (concept.type === 'percentage') {
      // Percentage of total so far
      const currentSubtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
      subtotal = round2(currentSubtotal * concept.value);
    } else {
      subtotal = round2(concept.value);
    }

    const conceptIva = round2(subtotal * ivaRate);

    lines.push({
      conceptCode: concept.code,
      conceptName: concept.name,
      quantity: 1,
      unitPrice: subtotal,
      subtotal,
      ivaRate,
      ivaAmount: conceptIva,
      total: round2(subtotal + conceptIva),
      claveProdServ: SAT_PRODUCT_KEYS[concept.code] ?? SAT_PRODUCT_KEYS.agua,
      claveUnidad: SAT_UNIT_KEYS.servicio,
      tariffDetail: { type: concept.type, value: concept.value, base: concept.base },
      sortOrder: sortOrder++,
    });
  }

  // 5. Special charges (reconexion surcharge, etc.)
  if (options?.specialCharges) {
    for (const charge of options.specialCharges) {
      const chargeIva = round2(charge.amount * ivaRate);
      lines.push({
        conceptCode: charge.code,
        conceptName: charge.name,
        quantity: 1,
        unitPrice: charge.amount,
        subtotal: charge.amount,
        ivaRate,
        ivaAmount: chargeIva,
        total: round2(charge.amount + chargeIva),
        claveProdServ: SAT_PRODUCT_KEYS[charge.code] ?? SAT_PRODUCT_KEYS.reconexion,
        claveUnidad: SAT_UNIT_KEYS.servicio,
        sortOrder: sortOrder++,
      });
    }
  }

  // 6. Social tariff discount (if eligible)
  if (
    options?.socialTariffEligible &&
    tariff.socialDiscountPct != null &&
    tariff.socialDiscountPct > 0
  ) {
    const discountableSubtotal = lines.reduce((sum, l) => sum + l.subtotal, 0);
    const discountAmount = round2(discountableSubtotal * (tariff.socialDiscountPct / 100));
    const discountIva = round2(discountAmount * ivaRate);

    lines.push({
      conceptCode: 'descuento_social',
      conceptName: 'Descuento Tarifa Social',
      quantity: 1,
      unitPrice: -discountAmount,
      subtotal: -discountAmount,
      ivaRate,
      ivaAmount: -discountIva,
      total: round2(-discountAmount - discountIva),
      claveProdServ: SAT_PRODUCT_KEYS.agua,
      claveUnidad: SAT_UNIT_KEYS.servicio,
      sortOrder: sortOrder++,
    });
  }

  // Calculate totals
  const subtotal = round2(lines.reduce((sum, l) => sum + l.subtotal, 0));
  const ivaTotal = round2(lines.reduce((sum, l) => sum + l.ivaAmount, 0));
  const grandTotal = round2(subtotal + ivaTotal);

  return {
    lines,
    subtotal,
    ivaTotal,
    grandTotal,
    consumptionM3,
  };
}

// ─── Helpers ────────────────────────────────────────────────────

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
