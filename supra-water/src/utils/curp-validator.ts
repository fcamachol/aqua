// ─── Mexican CURP Validation ────────────────────────────────────
//
// CURP (Clave Unica de Registro de Poblacion) = 18 characters
// Format: AAAA YYMMDD H SS CCC NN V
//   [1-4]   4 letters: first surname vowel pattern + first name initial
//   [5-10]  6 digits: birth date YYMMDD
//   [11]    1 letter: sex (H=hombre, M=mujer, X=no binario)
//   [12-13] 2 letters: state code (AS, BC, BS, CC, CL, CM, CS, CH, DF, DG,
//                       GT, GR, HG, JC, MC, MN, MS, NT, NL, OC, PL, QT,
//                       QR, SP, SL, SR, TC, TS, TL, VZ, YN, ZS, NE)
//   [14-16] 3 consonants: internal disambiguation
//   [17]    1 alphanumeric: century digit (0-9 or A)
//   [18]    1 alphanumeric: check digit

const CURP_PATTERN = /^[A-Z]{4}\d{6}[HMX][A-Z]{2}[A-Z]{3}[A-Z0-9]\d$/;

const VALID_STATES = new Set([
  'AS', 'BC', 'BS', 'CC', 'CL', 'CM', 'CS', 'CH', 'DF', 'DG',
  'GT', 'GR', 'HG', 'JC', 'MC', 'MN', 'MS', 'NT', 'NL', 'OC',
  'PL', 'QT', 'QR', 'SP', 'SL', 'SR', 'TC', 'TS', 'TL', 'VZ',
  'YN', 'ZS', 'NE',
]);

// Character-to-value mapping for CURP check digit
const CURP_CHAR_VALUES: Record<string, number> = {};
'0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('').forEach((ch, i) => {
  CURP_CHAR_VALUES[ch] = i;
});

/**
 * Compute the CURP check digit (position 18).
 */
function computeCheckDigit(curp17: string): number {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const val = CURP_CHAR_VALUES[curp17[i]];
    if (val === undefined) return -1;
    sum += val * (18 - i);
  }
  const remainder = sum % 10;
  return remainder === 0 ? 0 : 10 - remainder;
}

/**
 * Validate the 6-digit date portion (YYMMDD).
 */
function validateCurpDate(curp: string): boolean {
  const mm = parseInt(curp.slice(6, 8), 10);
  const dd = parseInt(curp.slice(8, 10), 10);
  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;
  return true;
}

export interface CurpValidationResult {
  valid: boolean;
  sex?: 'H' | 'M' | 'X';
  stateCode?: string;
  errors: string[];
}

/**
 * Fully validate a Mexican CURP string.
 */
export function validateCurp(curp: string): CurpValidationResult {
  const errors: string[] = [];
  const upper = curp.toUpperCase().trim();

  if (upper.length !== 18) {
    errors.push('CURP must be exactly 18 characters');
    return { valid: false, errors };
  }

  if (!CURP_PATTERN.test(upper)) {
    errors.push('CURP format invalid');
    return { valid: false, errors };
  }

  if (!validateCurpDate(upper)) {
    errors.push('CURP date portion (YYMMDD) contains an invalid date');
  }

  const stateCode = upper.slice(11, 13);
  if (!VALID_STATES.has(stateCode)) {
    errors.push(`Invalid state code: ${stateCode}`);
  }

  const expectedCheck = computeCheckDigit(upper.slice(0, 17));
  const actualCheck = parseInt(upper[17], 10);
  if (expectedCheck !== actualCheck) {
    errors.push('CURP check digit does not match');
  }

  const sex = upper[10] as 'H' | 'M' | 'X';

  return {
    valid: errors.length === 0,
    sex,
    stateCode,
    errors,
  };
}

/**
 * Quick pattern-only check (no checksum).
 */
export function isCurpFormat(value: string): boolean {
  return CURP_PATTERN.test(value.toUpperCase().trim());
}
