// ─── Mexican RFC Validation ─────────────────────────────────────
//
// RFC (Registro Federal de Contribuyentes) format:
//   Persona Física: 4 letters + 6 digits (birth date) + 3 alphanumeric (homoclave)  = 13 chars
//   Persona Moral:  3 letters + 6 digits (constitution date) + 3 alphanumeric       = 12 chars
//
// The last character is a check digit computed by the SAT algorithm.

const RFC_PATTERN_FISICA = /^[A-ZÑ&]{4}\d{6}[A-Z0-9]{3}$/;
const RFC_PATTERN_MORAL = /^[A-ZÑ&]{3}\d{6}[A-Z0-9]{3}$/;
const RFC_PATTERN_ANY = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

// SAT character-to-value mapping for check digit calculation
const CHAR_VALUES: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15, 'G': 16, 'H': 17, 'I': 18,
  'J': 19, 'K': 20, 'L': 21, 'M': 22, 'N': 23, '&': 24, 'Ñ': 25, 'O': 26, 'P': 27,
  'Q': 28, 'R': 29, 'S': 30, 'T': 31, 'U': 32, 'V': 33, 'W': 34, 'X': 35, 'Y': 36,
  'Z': 37, ' ': 38,
};

const CHECK_DIGITS = '0123456789A';

/**
 * Validate the RFC check digit using the SAT algorithm.
 * Returns true if the check digit matches.
 */
function validateCheckDigit(rfc: string): boolean {
  // Pad persona moral RFC to 13 chars for uniform processing
  const padded = rfc.length === 12 ? ' ' + rfc : rfc;

  // Take first 12 chars (before check digit)
  const body = padded.slice(0, 12);
  const expectedCheck = padded[12];

  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const char = body[i];
    const value = CHAR_VALUES[char];
    if (value === undefined) return false;
    sum += value * (13 - i);
  }

  const remainder = sum % 11;
  const computedCheck = remainder === 0 ? '0' : CHECK_DIGITS[11 - remainder];

  return computedCheck === expectedCheck;
}

/**
 * Validate the 6-digit date portion of an RFC (YYMMDD).
 */
function validateRfcDate(rfc: string): boolean {
  const dateStart = rfc.length === 13 ? 4 : 3;
  const yy = parseInt(rfc.slice(dateStart, dateStart + 2), 10);
  const mm = parseInt(rfc.slice(dateStart + 2, dateStart + 4), 10);
  const dd = parseInt(rfc.slice(dateStart + 4, dateStart + 6), 10);

  if (mm < 1 || mm > 12) return false;
  if (dd < 1 || dd > 31) return false;

  return true;
}

export interface RfcValidationResult {
  valid: boolean;
  type?: 'fisica' | 'moral';
  errors: string[];
}

/**
 * Fully validate a Mexican RFC string.
 */
export function validateRfc(rfc: string): RfcValidationResult {
  const errors: string[] = [];
  const upper = rfc.toUpperCase().trim();

  if (!RFC_PATTERN_ANY.test(upper)) {
    errors.push('RFC format invalid: must be 12 (moral) or 13 (fisica) chars matching [A-ZÑ&]{3,4}YYMMDD[A-Z0-9]{3}');
    return { valid: false, errors };
  }

  const type = upper.length === 13 ? 'fisica' : 'moral';

  if (!validateRfcDate(upper)) {
    errors.push('RFC date portion (YYMMDD) contains an invalid date');
  }

  if (!validateCheckDigit(upper)) {
    errors.push('RFC check digit (homoclave) does not match');
  }

  return {
    valid: errors.length === 0,
    type,
    errors,
  };
}

/**
 * Quick pattern-only check (no checksum). Useful for search filters.
 */
export function isRfcFormat(value: string): boolean {
  return RFC_PATTERN_ANY.test(value.toUpperCase().trim());
}
