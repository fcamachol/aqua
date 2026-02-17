---
name: cfdi-validate
description: Validate CFDI 4.0 compliance for Mexican electronic invoicing in SUPRA Water
---

# CFDI 4.0 Compliance Validation

When this skill is invoked, walk through each of the following validation checks against the target invoice data or code. Ask the user to provide the invoice data, file path, or TypeScript interface to validate. Then execute each check in order and produce a final compliance report.

## Step 1: Validate RFC Format

Check that the RFC (Registro Federal de Contribuyentes) follows SAT format rules:

- **Persona Fisica** (individual): 4 letters + 6 digits + 3 alphanumeric = **13 characters total**
  - Pattern: `^[A-Z&Ñ]{4}[0-9]{6}[A-Z0-9]{3}$`
  - The first 4 letters come from the name (paternal surname, maternal surname, first name)
  - The 6 digits are the birth date in YYMMDD format
  - The last 3 characters are the homoclave assigned by SAT

- **Persona Moral** (company/entity): 3 letters + 6 digits + 3 alphanumeric = **12 characters total**
  - Pattern: `^[A-Z&Ñ]{3}[0-9]{6}[A-Z0-9]{3}$`
  - The first 3 letters come from the company name
  - The 6 digits are the incorporation date in YYMMDD format
  - The last 3 characters are the homoclave assigned by SAT

- **Publico en General** (generic consumer): RFC must be `XAXX010101000`

Flag any RFC that does not match these patterns. Determine the persona type from the RFC length for use in subsequent checks.

## Step 2: Validate c_RegimenFiscal (Fiscal Regime)

Verify that the `c_RegimenFiscal` code is compatible with the persona type determined in Step 1.

**Persona Moral only (12-char RFC):**
- `601` - General de Ley Personas Morales
- `603` - Personas Morales con Fines no Lucrativos
- `607` - Regimen de Enajenacion o Adquisicion de Bienes
- `609` - Consolidacion
- `620` - Sociedades Cooperativas de Produccion
- `622` - Actividades Agricolas, Ganaderas, Silvicolas y Pesqueras
- `623` - Opcional para Grupos de Sociedades
- `624` - Coordinados

**Persona Fisica only (13-char RFC):**
- `605` - Sueldos y Salarios e Ingresos Asimilados a Salarios
- `606` - Arrendamiento
- `608` - Demas ingresos
- `610` - Residentes en el Extranjero sin Establecimiento Permanente en Mexico
- `611` - Ingresos por Dividendos
- `612` - Personas Fisicas con Actividades Empresariales y Profesionales
- `614` - Ingresos por intereses
- `615` - Regimen de los ingresos por obtencion de premios
- `616` - Sin obligaciones fiscales
- `621` - Incorporacion Fiscal
- `625` - Regimen de las Actividades Empresariales con ingresos a traves de Plataformas Tecnologicas
- `626` - Regimen Simplificado de Confianza (RESICO)

**Both persona types:**
- `630` - Sin obligaciones fiscales (publico en general with RFC XAXX010101000)

Flag if the regime does not match the persona type.

## Step 3: Validate c_UsoCFDI (CFDI Usage)

Verify that `c_UsoCFDI` is compatible with the persona type and regime. Common valid values for water utility billing:

- `G01` - Adquisicion de mercancias (both persona types)
- `G03` - Gastos en general (both persona types)
- `I01` - Construcciones (both persona types)
- `D01` - Honorarios medicos, dentales y gastos hospitalarios (persona fisica only)
- `P01` - Por definir (both persona types, used for publico en general)
- `S01` - Sin efectos fiscales (both persona types, CFDI 4.0)
- `CP01` - Pagos (used in complemento de pago)

For publico en general invoices (RFC `XAXX010101000`), the uso must be `S01` or `P01`.

Flag if the uso is not compatible with the persona type.

## Step 4: Validate c_FormaPago (Payment Method)

Check that the `c_FormaPago` code is a valid SAT catalog value. Common values for water utility:

- `01` - Efectivo (cash)
- `02` - Cheque nominativo (check)
- `03` - Transferencia electronica de fondos (wire transfer)
- `04` - Tarjeta de credito (credit card)
- `28` - Tarjeta de debito (debit card)
- `99` - Por definir (to be defined, used with PPD method)

Rules:
- If `c_MetodoPago` is `PPD`, then `c_FormaPago` must be `99`
- If `c_MetodoPago` is `PUE`, then `c_FormaPago` must NOT be `99`

## Step 5: Validate c_MetodoPago (Payment Timing)

Check the payment method timing:

- `PUE` - Pago en Una Exhibicion (single payment, paid at time of invoicing)
- `PPD` - Pago en Parcialidades o Diferido (installment or deferred payment)

Rules:
- For `PPD` invoices, a complemento de pago (payment complement CFDI) must be issued when payment is received
- Water utility convenios de pago (payment plans) should use `PPD`
- Standard single-period bills paid at the counter use `PUE`

## Step 6: Validate Monetary Amounts and SAT Rounding Rules

Check that all monetary values follow SAT precision requirements:

- **ValorUnitario** (unit price): up to **6 decimal places**
- **Importe** (line item amount = quantity x unit price): up to **6 decimal places**
- **Descuento** (discount): up to **6 decimal places**
- **SubTotal** (sum of importes): **2 decimal places**
- **Total** (subtotal - discount + taxes): **2 decimal places**
- **Tax amounts** (IVA trasladado, IVA retenido): **2 decimal places**
- **TasaOCuota** (tax rate): **6 decimal places** (e.g., 0.160000 for 16% IVA)

Rounding rule: Use banker's rounding (round half to even) for final totals. Verify that:
- `SubTotal` = sum of all `Concepto.Importe` values, rounded to 2 decimals
- `Total` = `SubTotal` - `Descuento` + `TotalImpuestosTrasladados` - `TotalImpuestosRetenidos`
- No negative `Total` values are allowed

## Step 7: Validate Fiscal Address ZIP Code

Check that `LugarExpedicion` (ZIP code) matches the emisor's fiscal address:

- Must be a valid 5-digit Mexican ZIP code from the SAT `c_CodigoPostal` catalog
- Must match the registered fiscal address of the emisor in SAT records
- For the receptor, `DomicilioFiscalReceptor` must also be a valid SAT ZIP code
- Both ZIP codes must exist in the SAT catalog for the current CFDI version

For SUPRA Water, the emisor ZIP code should match the water utility's registered address.

## Step 8: Generate Compliance Report

Produce a structured report with the following format:

```
CFDI 4.0 COMPLIANCE REPORT
===========================
Date: {current date}
Invoice Reference: {identifier}

CHECK                          | STATUS | DETAILS
-------------------------------|--------|---------------------------
1. RFC Format                  | PASS/FAIL | {details}
2. Regimen Fiscal              | PASS/FAIL | {details}
3. Uso CFDI                    | PASS/FAIL | {details}
4. Forma de Pago               | PASS/FAIL | {details}
5. Metodo de Pago              | PASS/FAIL | {details}
6. Monetary Rounding           | PASS/FAIL | {details}
7. Codigo Postal               | PASS/FAIL | {details}

OVERALL: {COMPLIANT / NON-COMPLIANT}
ISSUES FOUND: {count}
```

If any check fails, provide specific remediation steps explaining what value to change and why.
