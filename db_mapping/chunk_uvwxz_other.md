# Database Map - Tables U*, V*, W*, X*, Z* + Other Schemas

## Schema: cf_quere_pro

### ultimoscript

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | usid | character varying | 20 | NO | NULL |
| 2 | usordscript | numeric | 10,0 | NO | NULL |

---

### uniprotdat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | updid | numeric | 5,0 | NO | NULL |
| 2 | updrcuid | numeric | 5,0 | NO | NULL |
| 4 | upddescorta | character varying | 10 | NO | NULL |
| 5 | upddescritxtid | numeric | 10,0 | NO | '0'::numeric |

---

### urlimgpto

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | imgid | numeric |  | NO | NULL |
| 2 | imgpto | numeric |  | NO | NULL |
| 3 | imgurl | character varying | 500 | NO | NULL |
| 4 | imghsthora | timestamp without time zone |  | YES | NULL |
| 5 | imglote | character | 12 | YES | NULL |
| 6 | imgcontratis | numeric |  | YES | NULL |
| 7 | imgoperario | numeric |  | YES | NULL |
| 8 | imghstusu | character varying | 10 | YES | NULL |

---

### userexit

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | usexid | numeric | 5,0 | NO | NULL |
| 2 | usextueid | numeric | 5,0 | NO | NULL |
| 3 | usexclase | character varying | 100 | NO | NULL |
| 4 | usexdesc | character varying | 100 | YES | NULL |
| 5 | usexconfig | character varying | 2000 | YES | NULL |

---

### usoexext

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ueeuso | numeric | 5,0 | NO | NULL |
| 2 | ueesnverconcvig | character | 1 | NO | 'N'::bpchar |
| 3 | ueesnvernifayu | character | 1 | NO | 'N'::bpchar |
| 4 | ueecodexen | numeric | 5,0 | NO | 999 |

---

### usosaytozgz

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | uszgzid | numeric | 5,0 | NO | NULL |
| 2 | uszgzvaluso | character varying | 2 | YES | NULL |
| 3 | uszgzptostpsid | numeric | 5,0 | NO | NULL |
| 4 | uszgzactivid | numeric | 5,0 | YES | NULL |

---

### usoserv

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | usocod | numeric | 5,0 | NO | NULL |
| 2 | usotxtid | numeric | 10,0 | NO | NULL |
| 3 | usotipo | numeric | 5,0 | NO | NULL |
| 4 | usoindblk | numeric | 5,0 | NO | NULL |
| 5 | usomultiusuario | character | 1 | NO | 'N'::bpchar |
| 6 | usoporivaant | numeric | 5,4 | YES | NULL |

---

### usotao

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ustexpid | numeric | 5,0 | NO | NULL |
| 2 | ustuso | numeric | 5,0 | NO | NULL |
| 3 | ustusotao | numeric | 5,0 | NO | NULL |

---

### usuario

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | usuid | character varying | 10 | NO | NULL |
| 2 | usudptid | numeric | 5,0 | NO | NULL |
| 3 | usudesc | character varying | 40 | NO | NULL |
| 4 | usuvent | numeric | 5,0 | YES | NULL |
| 5 | usuactivo | character | 1 | NO | 'S'::bpchar |
| 6 | usuemail | character varying | 100 | YES | NULL |
| 7 | usuidioma | character | 2 | NO | 'es'::bpchar |
| 8 | ususnprmof | character | 1 | NO | 'N'::bpchar |
| 9 | usulogin | character varying | 30 | NO | ''::character varying |
| 10 | usutipo | numeric | 5,0 | NO | NULL |
| 11 | usubloqueado | character | 1 | NO | 'N'::bpchar |
| 12 | usuhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 13 | usuhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 14 | usunumempl | character varying | 20 | YES | NULL |
| 15 | usupuesto | character varying | 40 | YES | NULL |
| 16 | usutipohojacalculo | numeric | 5,0 | NO | '1'::numeric |
| 17 | usudobleauten | character | 1 | NO | 'N'::bpchar |
| 18 | usuemailauten | character varying | 100 | YES | NULL |
| 19 | usufecauten | date |  | YES | NULL |

---

### usuarioov

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | uovprsid | numeric | 10,0 | NO | NULL |
| 2 | uovsocprsid | numeric | 10,0 | NO | NULL |
| 3 | uovrol | numeric | 5,0 | NO | NULL |
| 4 | uovusuario | character varying | 40 | NO | NULL |
| 5 | uovemail | numeric | 10,0 | NO | NULL |
| 6 | uovfalta | date |  | NO | NULL |
| 7 | uovfbaja | date |  | YES | NULL |
| 8 | uoventorno | character | 2 | NO | NULL |
| 9 | uovtiptramite | character | 2 | NO | NULL |
| 10 | uovcodsocov | numeric | 10,0 | YES | NULL |

---

### usuariows

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | uswsid | numeric | 10,0 | NO | NULL |
| 2 | uswslogin | character varying | 50 | NO | NULL |
| 3 | uswspwd | character varying | 75 | NO | NULL |
| 4 | uswsnombre | character varying | 90 | YES | NULL |
| 5 | uswsusuid | character varying | 10 | YES | NULL |

---

### usuexplo

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | uexusuid | character varying | 10 | NO | NULL |
| 2 | uexexpid | numeric | 5,0 | NO | NULL |
| 3 | uexhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 4 | uexhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

---

### usufallado

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | usufip | character varying | 15 | NO | NULL |
| 2 | usuflogin | character varying | 30 | NO | NULL |
| 3 | usufecha | timestamp without time zone |  | NO | NULL |
| 4 | usufintentos | numeric | 5,0 | NO | NULL |
| 5 | usufcaptcha | character varying | 5 | YES | NULL |

---

### usuoficina

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | uofiusuid | character varying | 10 | NO | NULL |
| 2 | uofiofiid | numeric | 5,0 | NO | NULL |
| 3 | uofihstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 4 | uofihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

---

### usuperfil

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | uperusuid | character varying | 10 | NO | NULL |
| 2 | uperperfid | numeric | 5,0 | NO | NULL |
| 3 | uperhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 4 | uperhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

---

### usupermiso

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | uspusuid | character varying | 10 | NO | NULL |
| 2 | uspfuncod | character varying | 50 | NO | NULL |
| 3 | usptipoper | numeric | 5,0 | NO | NULL |
| 4 | usphstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 5 | usphsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

---

### ususociedad

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ususuid | character varying | 10 | NO | NULL |
| 2 | ussocid | numeric | 10,0 | NO | NULL |
| 3 | ushstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 4 | ushsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

---

### varbonifpvasco

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vbpvporcbonif | numeric | 5,0 | NO | NULL |

---

### varfactaca

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vfaid | numeric | 5,0 | NO | NULL |
| 2 | vfatpid | numeric | 5,0 | NO | NULL |
| 3 | vfatpvid | numeric | 5,0 | NO | NULL |
| 4 | vfatiptid | numeric | 5,0 | YES | NULL |

---

### variable

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | varid | numeric | 10,0 | NO | NULL |
| 2 | vartpvid | numeric | 5,0 | NO | NULL |
| 3 | varcnttnum | numeric | 10,0 | YES | NULL |
| 4 | varpocid | numeric | 10,0 | YES | NULL |
| 5 | varptosid | numeric | 10,0 | YES | NULL |
| 6 | varvalnum | numeric | 24,6 | YES | NULL |
| 7 | varvalchar | character | 20 | YES | NULL |
| 8 | varvalfec | date |  | YES | NULL |
| 9 | varvalbool | character | 1 | YES | NULL |
| 10 | varhstusu | character varying | 10 | NO | NULL |
| 11 | varhsthora | timestamp without time zone |  | NO | NULL |
| 12 | varfecini | date |  | YES | NULL |
| 13 | varfecfin | date |  | YES | NULL |

---

### varimprcontr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vicpccid | numeric | 10,0 | NO | NULL |
| 2 | vicvarid | numeric | 10,0 | NO | NULL |
| 3 | vicvalor | character varying | 20 | NO | NULL |
| 4 | vichstusu | character varying | 10 | NO | NULL |
| 5 | vichsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

---

### varinfara

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | viaid | numeric | 5,0 | NO | NULL |
| 2 | viatpvidexe | numeric | 5,0 | NO | NULL |
| 3 | viatpviddom | numeric | 5,0 | NO | NULL |

---

### varliqand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vlaid | numeric | 5,0 | NO | NULL |
| 2 | vlacont | numeric | 5,0 | NO | NULL |
| 3 | vlamiem | numeric | 5,0 | NO | NULL |
| 4 | vlasinabst | numeric | 5,0 | YES | NULL |

---

### varliqpvasco

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vlpvtipobonif | numeric | 5,0 | NO | NULL |
| 2 | vlpvtipoexenc | numeric | 5,0 | NO | NULL |
| 3 | vlpvfecini | numeric | 5,0 | NO | NULL |
| 4 | vlpvfecfin | numeric | 5,0 | NO | NULL |

---

### varnodomtmtr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vndtpvid | numeric | 5,0 | NO | NULL |
| 2 | vndcodigo | character | 3 | NO | NULL |

---

### varsaytozgz

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vzgznomvar | character varying | 50 | NO | NULL |
| 2 | vzgztpvid | numeric | 5,0 | NO | NULL |
| 3 | vzgzformato | character varying | 20 | YES | NULL |
| 4 | vzgznivel | numeric | 5,0 | YES | NULL |
| 5 | vzgzvaldef | character varying | 20 | NO | NULL |

---

### vbnfnomina

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | prsnif | character varying | 15 | YES | NULL |
| 2 | facid | numeric |  | YES | NULL |
| 3 | numfactura | character varying |  | YES | NULL |
| 4 | abonificar | numeric |  | YES | NULL |
| 5 | acobrar | numeric |  | YES | NULL |
| 6 | cantidad | numeric | 5,0 | YES | NULL |
| 7 | origen | text |  | YES | NULL |
| 8 | nombre | text |  | YES | NULL |
| 9 | anno | numeric | 5,0 | YES | NULL |
| 10 | periodo | numeric | 5,0 | YES | NULL |
| 11 | opcion | text |  | YES | NULL |

---

### vcontrato

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contrato | numeric | 10,0 | YES | NULL |
| 2 | apellido1 | text |  | YES | NULL |
| 3 | apellido2 | text |  | YES | NULL |
| 4 | nombre | text |  | YES | NULL |
| 5 | calle | text |  | YES | NULL |
| 6 | numero | numeric | 10,0 | YES | NULL |
| 7 | bloque | text |  | YES | NULL |
| 8 | escalera | text |  | YES | NULL |
| 9 | planta | text |  | YES | NULL |
| 10 | puerta | text |  | YES | NULL |
| 11 | localidad | text |  | YES | NULL |
| 12 | poblacion | text |  | YES | NULL |
| 13 | codpostal | character varying | 10 | YES | NULL |
| 14 | telefono1 | character varying | 16 | YES | NULL |
| 15 | telefono2 | character varying | 16 | YES | NULL |
| 16 | telefono3 | character varying | 16 | YES | NULL |
| 17 | idioma_cli | text |  | YES | NULL |
| 18 | tipo_cli | text |  | YES | NULL |
| 19 | actividad | text |  | YES | NULL |

---

### velpaggradoinsolv

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vpgicnttnum | numeric | 10,0 | NO | NULL |
| 2 | vpgiexpid | numeric | 5,0 | NO | NULL |
| 3 | vpgipaso | numeric | 5,0 | NO | NULL |
| 4 | vpgifecfact | date |  | YES | NULL |
| 5 | vpginfactimp | numeric | 5,0 | YES | NULL |
| 6 | vpgivelpago | numeric | 16,6 | YES | NULL |
| 7 | vpgifecvelpago | timestamp without time zone |  | YES | NULL |

---

### vercontad

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vcoverid | numeric | 10,0 | NO | NULL |
| 2 | vconumcont | character varying | 12 | NO | NULL |
| 3 | vcomarcid | numeric | 5,0 | NO | NULL |
| 4 | vcomodid | numeric | 5,0 | NO | NULL |
| 5 | vcocalimm | numeric | 5,0 | NO | NULL |
| 6 | vcocapaci | numeric | 5,0 | NO | NULL |
| 7 | vcolitrosp | numeric | 5,0 | NO | NULL |
| 8 | vcoerror | numeric | 5,0 | NO | NULL |
| 9 | vcosescrea | numeric | 10,0 | NO | NULL |
| 10 | vcosesemi | numeric | 10,0 | YES | NULL |
| 11 | vcoexpid | numeric | 5,0 | NO | NULL |

---

### veriflect

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vlveriid | numeric | 5,0 | NO | NULL |
| 2 | vltxtid | numeric | 10,0 | NO | NULL |
| 3 | vlacccod | character | 2 | YES | NULL |
| 4 | vlasexp | character | 1 | NO | 'S'::bpchar |

---

### version

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | verid | character varying | 20 | NO | NULL |
| 2 | verordscript | numeric | 10,0 | NO | NULL |
| 3 | vernomscript | character varying | 40 | NO | NULL |
| 4 | verobservac | character varying | 200 | YES | NULL |
| 5 | verhstshora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

---

### vertidos

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cvi | character varying | 10 | YES | NULL |
| 2 | cif_tit_iae | character varying | 20 | YES | NULL |
| 3 | nom_tit_iae | character varying | 50 | YES | NULL |
| 4 | nom_cliente | character varying | 150 | YES | NULL |
| 5 | pto_sum | character varying | 150 | YES | NULL |
| 6 | cif_cliente | character varying | 150 | YES | NULL |
| 7 | poligono | character varying | 35 | YES | NULL |
| 8 | rpc_iae_aplic | character varying | 10 | YES | NULL |
| 9 | contrato | numeric | 10,0 | YES | NULL |
| 10 | iaes_pers | character varying | 250 | YES | NULL |
| 11 | grupo_actv | character varying | 10 | YES | NULL |
| 12 | iae_declarado | character varying | 10 | YES | NULL |
| 13 | obs_equipo | character varying | 250 | YES | NULL |
| 14 | iae_asignado | character varying | 20 | YES | NULL |
| 15 | descripcion | character varying | 250 | YES | NULL |

---

### vgis_abonadosacometida

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contrato | numeric | 10,0 | YES | NULL |
| 2 | nombre | character varying | 40 | YES | NULL |
| 3 | apellido1 | character varying | 120 | YES | NULL |
| 4 | domicilio | character varying | 150 | YES | NULL |
| 5 | escalera | character | 4 | YES | NULL |
| 6 | planta | character | 4 | YES | NULL |
| 7 | puerta | character | 4 | YES | NULL |
| 8 | nif | character varying | 15 | YES | NULL |
| 9 | tlfno | character | 1 | YES | NULL |
| 10 | acometida | numeric | 10,0 | YES | NULL |

---

### vgis_aboncierre

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aboncount | bigint | 64,0 | YES | NULL |
| 2 | acometida | numeric | 10,0 | YES | NULL |

---

### vgis_acometidas

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | numeric | 10,0 | YES | NULL |
| 2 | direccion | text |  | YES | NULL |
| 3 | poblacion | text |  | YES | NULL |
| 4 | htrab | numeric | 10,0 | YES | NULL |
| 5 | acopep | character varying | 15 | YES | NULL |
| 6 | acopepreno | character varying | 15 | YES | NULL |
| 7 | fecha_instal | date |  | YES | NULL |
| 8 | calibre | numeric | 5,0 | YES | NULL |
| 9 | longitud | double precision | 53 | YES | NULL |
| 10 | material | text |  | YES | NULL |
| 11 | tipo_valv | numeric | 10,0 | YES | NULL |
| 12 | estado | text |  | YES | NULL |
| 13 | num_suministros | bigint | 64,0 | YES | NULL |

---

### vgis_acometidas2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | numeric | 10,0 | YES | NULL |
| 2 | direccion | text |  | YES | NULL |
| 3 | poblacion | text |  | YES | NULL |
| 4 | htrab | numeric | 10,0 | YES | NULL |
| 5 | acopep | character varying | 15 | YES | NULL |
| 6 | acopepreno | character varying | 15 | YES | NULL |
| 7 | fecha_instal | date |  | YES | NULL |
| 8 | calibre | numeric | 5,0 | YES | NULL |
| 9 | longitud | double precision | 53 | YES | NULL |
| 10 | material | text |  | YES | NULL |
| 11 | tipo_valv | numeric | 10,0 | YES | NULL |
| 12 | estado | numeric | 5,0 | YES | NULL |
| 13 | num_suministros | bigint | 64,0 | YES | NULL |

---

### vgis_acometidas_calle

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_acometida | numeric | 10,0 | YES | NULL |
| 2 | id_calle | numeric | 10,0 | YES | NULL |
| 3 | num_finca | numeric | 10,0 | YES | NULL |

---

### vgis_acometidas_tecnica

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | numeric | 10,0 | YES | NULL |
| 2 | direccion | text |  | YES | NULL |
| 3 | poblacion | text |  | YES | NULL |
| 4 | htrab | numeric | 10,0 | YES | NULL |
| 5 | acopep | character varying | 15 | YES | NULL |
| 6 | acopepreno | character varying | 15 | YES | NULL |
| 7 | fecha_instal | date |  | YES | NULL |
| 8 | calibre | numeric | 5,0 | YES | NULL |
| 9 | longitud | double precision | 53 | YES | NULL |
| 10 | material | text |  | YES | NULL |
| 11 | tipo_valv | numeric | 10,0 | YES | NULL |
| 12 | estado | text |  | YES | NULL |
| 13 | num_suministros | bigint | 64,0 | YES | NULL |

---

### vgis_callejero

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_calle | numeric | 10,0 | YES | NULL |
| 2 | calle | text |  | YES | NULL |
| 3 | id_poblacion | numeric | 10,0 | YES | NULL |
| 4 | poblacion | text |  | YES | NULL |
| 5 | id_localidad | numeric | 10,0 | YES | NULL |
| 6 | localidad | text |  | YES | NULL |

---

### vgis_callespoblacion

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | calle | text |  | YES | NULL |
| 2 | tipovia | numeric | 5,0 | YES | NULL |
| 3 | codine_poblacion | numeric | 10,0 | YES | NULL |

---

### vgis_consumoabonado

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | numeric | 10,0 | YES | NULL |
| 2 | contrato | numeric | 10,0 | YES | NULL |
| 3 | nombre | character varying | 40 | YES | NULL |
| 4 | apellido1 | character varying | 120 | YES | NULL |
| 5 | apellido2 | character varying | 40 | YES | NULL |
| 6 | anno | numeric | 5,0 | YES | NULL |
| 7 | periodo | numeric | 5,0 | YES | NULL |
| 8 | consumo | numeric |  | YES | NULL |

---

### vgis_consumoacometida

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | numeric | 10,0 | YES | NULL |
| 2 | anno | numeric | 5,0 | YES | NULL |
| 3 | periodo | numeric | 5,0 | YES | NULL |
| 4 | consumo | numeric |  | YES | NULL |
| 5 | caannoperf | numeric |  | YES | NULL |

---

### vgis_consumopunto

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | numeric | 10,0 | YES | NULL |
| 2 | punto_servicio | numeric | 10,0 | YES | NULL |
| 3 | direccion | text |  | YES | NULL |
| 4 | localidad | text |  | YES | NULL |
| 5 | emplazamiento | text |  | YES | NULL |
| 6 | estado | text |  | YES | NULL |
| 7 | forma_sum | text |  | YES | NULL |
| 8 | marca_cont | text |  | YES | NULL |
| 9 | modelo_cont | text |  | YES | NULL |
| 10 | calibre | numeric | 5,0 | YES | NULL |
| 11 | fecha_inst | date |  | YES | NULL |
| 12 | periodicidad | text |  | YES | NULL |
| 13 | anno | numeric | 5,0 | YES | NULL |
| 14 | periodo | numeric | 5,0 | YES | NULL |
| 15 | consumo | numeric |  | YES | NULL |

---

### vgis_nomcalle

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | calle | text |  | YES | NULL |
| 2 | tipovia | numeric | 5,0 | YES | NULL |

---

### vgis_ptoservacometida

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | numeric | 10,0 | YES | NULL |
| 2 | punto | numeric | 10,0 | YES | NULL |
| 3 | direccion | character varying | 150 | YES | NULL |
| 4 | estado | numeric | 5,0 | YES | NULL |
| 5 | contrato | numeric | 10,0 | YES | NULL |
| 6 | persona | text |  | YES | NULL |
| 7 | telefono | character varying | 16 | YES | NULL |

---

### vgis_servacometida

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acometida | character varying | 150 | YES | NULL |
| 2 | servicio | character varying | 150 | YES | NULL |
| 3 | id_acometida | numeric | 10,0 | YES | NULL |

---

### vgiss_abonados

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | idacometida | numeric | 10,0 | YES | NULL |
| 3 | idtipoacometida | numeric | 5,0 | YES | NULL |
| 4 | idpuntoservicio | numeric | 10,0 | YES | NULL |
| 5 | idcliente | numeric | 10,0 | YES | NULL |
| 6 | idcontrato | numeric | 10,0 | YES | NULL |
| 7 | nombrecompleto | character varying | 203 | YES | NULL |
| 8 | nif | character varying | 15 | YES | NULL |
| 9 | telefono | character varying | 16 | YES | NULL |
| 10 | contratocortable | character | 1 | YES | NULL |
| 11 | ptoservcortable | character | 1 | YES | NULL |
| 12 | cdireccion | character varying | 150 | YES | NULL |
| 13 | ccomplementodir | character varying | 40 | YES | NULL |
| 14 | cpoblacion | character varying | 40 | YES | NULL |
| 15 | cprovincia | character varying | 30 | YES | NULL |
| 16 | cpais | character varying | 40 | YES | NULL |
| 17 | psidpoblacion | numeric | 10,0 | YES | NULL |
| 18 | psidcalle | numeric | 10,0 | YES | NULL |
| 19 | pscalle | character varying | 80 | YES | NULL |
| 20 | psedificio | character varying | 25 | YES | NULL |
| 21 | psnumero | numeric | 10,0 | YES | NULL |
| 22 | pscomplementofinca | character | 10 | YES | NULL |
| 23 | psbloque | character | 4 | YES | NULL |
| 24 | psescalera | character | 4 | YES | NULL |
| 25 | psplanta | character | 4 | YES | NULL |
| 26 | pspuerta | character | 4 | YES | NULL |
| 27 | pscomplementodir | character varying | 40 | YES | NULL |
| 28 | psbarrio | character varying | 100 | YES | NULL |
| 29 | pscodigopostal | character varying | 10 | YES | NULL |
| 30 | pspoblacion | character varying | 40 | YES | NULL |
| 31 | psprovincia | character varying | 30 | YES | NULL |
| 32 | ccnae | numeric | 10,0 | YES | NULL |
| 33 | pscodigorecorrido | numeric | 14,0 | YES | NULL |
| 34 | psidsector | numeric | 5,0 | YES | NULL |
| 35 | psidsubsector | numeric | 10,0 | YES | NULL |

---

### vgiss_acometidas

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | idacometida | numeric | 10,0 | YES | NULL |
| 3 | idtipoacometida | numeric | 5,0 | YES | NULL |
| 4 | idpoblacion | numeric | 10,0 | YES | NULL |
| 5 | poblacion | character varying | 40 | YES | NULL |
| 6 | idcalle | numeric | 10,0 | YES | NULL |
| 7 | nombrecalle | character varying | 80 | YES | NULL |
| 8 | numero | numeric | 10,0 | YES | NULL |
| 9 | complementofinca | character | 10 | YES | NULL |

---

### vgiss_calles

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idlocalidad | numeric | 10,0 | YES | NULL |
| 2 | localidad | character varying | 40 | YES | NULL |
| 3 | idcalle | numeric | 10,0 | YES | NULL |
| 4 | nombrecalle | character varying | 80 | YES | NULL |

---

### vgiss_cartasenv

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | idacometida | numeric | 10,0 | YES | NULL |
| 3 | idtipodocumento | numeric | 5,0 | YES | NULL |
| 4 | idcontrato | numeric | 10,0 | YES | NULL |
| 5 | fechaimpresion | timestamp without time zone |  | YES | NULL |
| 6 | obscontador | character | 80 | YES | NULL |

---

### vgiss_consumfact

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | idacometida | numeric | 10,0 | YES | NULL |
| 3 | periodicidad | numeric | 5,0 | YES | NULL |
| 4 | fechalectura | date |  | YES | NULL |
| 5 | concepto | numeric | 5,0 | YES | NULL |
| 6 | limitetramo | numeric | 10,0 | YES | NULL |
| 7 | consumofacturado | double precision | 53 | YES | NULL |

---

### vgiss_consumreg

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | idacometida | numeric | 10,0 | YES | NULL |
| 3 | fechalectura | date |  | YES | NULL |
| 4 | periodicidad | numeric | 5,0 | YES | NULL |
| 5 | consumoreg | numeric |  | YES | NULL |
| 6 | ajusterep | numeric |  | YES | NULL |
| 7 | ajusteest | numeric |  | YES | NULL |

---

### vgiss_explotacion

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | descripcion | character varying | 70 | YES | NULL |
| 3 | idlocalidad | numeric | 10,0 | YES | NULL |
| 4 | localidad | character varying | 40 | YES | NULL |
| 5 | idpoblacion | numeric | 10,0 | YES | NULL |
| 6 | poblacion | character varying | 40 | YES | NULL |

---

### vgiss_faccobrada

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | idacometida | numeric | 10,0 | YES | NULL |
| 3 | nif | character varying | 15 | YES | NULL |
| 4 | nombrecompleto | character varying | 203 | YES | NULL |
| 5 | idcontrato | numeric | 10,0 | YES | NULL |
| 6 | idpoblacion | numeric | 10,0 | YES | NULL |
| 7 | idcalle | numeric | 10,0 | YES | NULL |
| 8 | nombrecalle | character varying | 80 | YES | NULL |
| 9 | edificio | character varying | 25 | YES | NULL |
| 10 | numero | numeric | 10,0 | YES | NULL |
| 11 | complementofinca | character | 10 | YES | NULL |
| 12 | bloque | character | 4 | YES | NULL |
| 13 | escalera | character | 4 | YES | NULL |
| 14 | planta | character | 4 | YES | NULL |
| 15 | puerta | character | 4 | YES | NULL |
| 16 | complementodir | character varying | 40 | YES | NULL |
| 17 | barrio | character varying | 100 | YES | NULL |
| 18 | codigopostal | character varying | 10 | YES | NULL |
| 19 | poblacion | character varying | 40 | YES | NULL |
| 20 | provincia | character varying | 30 | YES | NULL |
| 21 | numfactura | character | 18 | YES | NULL |
| 22 | importe | numeric |  | YES | NULL |
| 23 | tipofactura | numeric | 5,0 | YES | NULL |
| 24 | clasefactura | numeric | 5,0 | YES | NULL |
| 25 | fechavencimiento | date |  | YES | NULL |
| 26 | fechacobro | timestamp without time zone |  | YES | NULL |
| 27 | anno | numeric | 5,0 | YES | NULL |
| 28 | periodo | numeric | 5,0 | YES | NULL |
| 29 | periodicidad | numeric | 5,0 | YES | NULL |
| 30 | m3facturados | numeric | 10,0 | YES | NULL |

---

### vgiss_lectuacom

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idexplotacion | numeric | 5,0 | YES | NULL |
| 2 | idcontrato | numeric | 10,0 | YES | NULL |
| 3 | idacometida | numeric | 10,0 | YES | NULL |
| 4 | periodicidad | numeric | 5,0 | YES | NULL |
| 5 | fechalectura | date |  | YES | NULL |
| 6 | lectura | numeric | 10,0 | YES | NULL |
| 7 | idorigen | character | 2 | YES | NULL |
| 8 | consumoreg | numeric | 10,0 | YES | NULL |
| 9 | ajusteconsumo | numeric |  | YES | NULL |

---

### vgiss_tpconcepto

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idtipoconcepto | numeric | 5,0 | YES | NULL |
| 2 | descripcion | text |  | YES | NULL |
| 3 | idioma | character | 2 | YES | NULL |

---

### via

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | viacod | character | 2 | NO | NULL |
| 2 | viatxtid | numeric | 10,0 | NO | NULL |
| 3 | viasnimpdoc | character | 1 | NO | NULL |
| 4 | viasnpermdef | character | 1 | NO | NULL |
| 5 | viadiasvto | numeric | 5,0 | NO | NULL |
| 6 | viasnregistr | character | 1 | NO | NULL |
| 7 | viasndigital | character | 1 | NO | 'N'::bpchar |
| 8 | viasnbiomet | character | 1 | NO | 'N'::bpchar |
| 9 | viasncanaldigital | character | 1 | NO | 'N'::bpchar |
| 10 | viatipocrm | character varying | 8 | YES | NULL |

---

### viatipobonif

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vtbtbid | numeric | 5,0 | NO | NULL |
| 2 | vtbviacod | character | 2 | NO | NULL |
| 3 | vtbhstusu | character varying | 10 | NO | NULL |
| 4 | vtbhsthora | timestamp without time zone |  | NO | NULL |

---

### viatipocontra

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vtctctcod | numeric | 10,0 | NO | NULL |
| 2 | vtcviacod | character | 2 | NO | NULL |
| 3 | vtcsnselccont | character | 1 | NO | NULL |
| 4 | vtcsnselclec | character | 1 | NO | NULL |
| 5 | vtctpdid | numeric | 5,0 | YES | NULL |
| 6 | vtchstusu | character varying | 10 | NO | NULL |
| 7 | vtchsthora | timestamp without time zone |  | NO | NULL |
| 8 | vtctpoidsc | numeric | 5,0 | YES | NULL |
| 9 | vtctpoidcnv | numeric | 5,0 | YES | NULL |
| 10 | vtctpoidprec | numeric | 5,0 | YES | NULL |
| 11 | vtctpoidnprec | numeric | 5,0 | YES | NULL |
| 12 | vtcsnhabit | character | 1 | NO | 'N'::bpchar |
| 13 | vtcsncaldef | character | 1 | NO | 'N'::bpchar |
| 14 | vtcsnlicpriocu | character | 1 | NO | 'N'::bpchar |
| 15 | vtcsnboletin | character | 1 | NO | 'N'::bpchar |
| 16 | vtcsnlicsegocu | character | 1 | NO | 'N'::bpchar |
| 17 | vtcsnrefcat | character | 1 | NO | 'N'::bpchar |
| 18 | vtcsnhabitobl | character | 1 | NO | 'N'::bpchar |
| 19 | vtcsncaldefobl | character | 1 | NO | 'N'::bpchar |
| 20 | vtcsnlicpriocuobl | character | 1 | NO | 'N'::bpchar |
| 21 | vtcsnboletinobl | character | 1 | NO | 'N'::bpchar |
| 22 | vtcsnlicsegocuobl | character | 1 | NO | 'N'::bpchar |
| 23 | vtcsnrefcatobl | character | 1 | NO | 'N'::bpchar |
| 24 | vtcsnselvar | character | 1 | NO | 'S'::bpchar |
| 25 | vtcsnselclau | character | 1 | NO | 'S'::bpchar |
| 28 | vtcsnactfactpdf | character | 1 | NO | 'N'::bpchar |

---

### vpersona

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | prsnombre | text |  | YES | NULL |
| 2 | prspriapel | text |  | YES | NULL |
| 3 | prssegapel | text |  | YES | NULL |
| 4 | prsnomcpto | character varying |  | YES | NULL |
| 5 | prsnif | text |  | YES | NULL |
| 6 | prstelef | character varying | 16 | YES | NULL |
| 7 | prstelef2 | character varying | 16 | YES | NULL |
| 8 | prstelef3 | character varying | 16 | YES | NULL |
| 9 | prsjubilad | character | 1 | YES | NULL |
| 10 | prsjuridic | character | 1 | YES | NULL |
| 11 | prsid | numeric | 10,0 | YES | NULL |
| 12 | prspassweb | text |  | YES | NULL |
| 13 | prscodextran | character varying | 12 | YES | NULL |

---

### vpteleclei

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vplexpid | numeric | 5,0 | YES | NULL |
| 2 | vplzonid | character | 3 | YES | NULL |
| 3 | vplconcod | numeric | 5,0 | YES | NULL |
| 4 | vplpernum | numeric | 5,0 | YES | NULL |
| 5 | vplanno | double precision | 53 | YES | NULL |
| 6 | vplfecha | date |  | YES | NULL |
| 7 | vplleidos | numeric |  | YES | NULL |
| 8 | vplnoleido | numeric |  | YES | NULL |

---

### vptelecmes

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vllconcod | numeric | 5,0 | YES | NULL |
| 2 | vllfecha | date |  | YES | NULL |
| 3 | vllscodid | numeric | 5,0 | YES | NULL |
| 4 | vllcantid | numeric | 5,0 | YES | NULL |
| 5 | vllmes | double precision | 53 | YES | NULL |
| 6 | vllpartexpid | numeric | 5,0 | YES | NULL |
| 7 | vllzonid | character | 3 | YES | NULL |
| 8 | vlllibreta | numeric | 5,0 | YES | NULL |

---

### vw_gis_inspecciones

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | orden_servicio | numeric | 10,0 | YES | NULL |
| 2 | fecha_de_reporte | timestamp without time zone |  | YES | NULL |
| 3 | idusuario | character varying | 10 | YES | NULL |
| 4 | nombre_usuario | character varying | 40 | YES | NULL |
| 5 | estatus | numeric | 5,0 | YES | NULL |
| 6 | descripcion_status | text |  | YES | NULL |
| 7 | descripcion | text |  | YES | NULL |
| 8 | tipo_id | integer | 32,0 | YES | NULL |
| 9 | tipo_orden | character varying | 1000 | YES | NULL |
| 10 | motivo_id | integer | 32,0 | YES | NULL |
| 11 | motivo_orden | character varying | 1000 | YES | NULL |
| 12 | numero_queja | text |  | YES | NULL |
| 13 | usuario_queja | character varying | 40 | YES | NULL |
| 14 | contratoaqua | integer | 32,0 | YES | NULL |
| 15 | contratoant | text |  | YES | NULL |
| 16 | idexplotacion | numeric | 5,0 | YES | NULL |
| 17 | descexplotacion | character varying | 70 | YES | NULL |
| 18 | nombre_completo_usuario | text |  | YES | NULL |
| 19 | domicilio_del_usuario | character varying | 150 | YES | NULL |
| 20 | numero_de_colonia | numeric | 5,0 | YES | NULL |
| 21 | nombre_colonia | character varying | 100 | YES | NULL |
| 22 | tipo_servicio | character varying | 1000 | YES | NULL |
| 23 | diametro_de_medidor | numeric | 5,0 | YES | NULL |
| 24 | localizacion | numeric | 14,0 | YES | NULL |
| 25 | fecha_ultimo_pago | date |  | YES | NULL |
| 26 | saldo_actual | numeric |  | YES | NULL |
| 27 | noperadeudo | integer | 32,0 | YES | NULL |
| 28 | numero_de_serie_del_medidor | character varying | 12 | YES | NULL |
| 29 | marca_del_medidor | character varying | 30 | YES | NULL |
| 30 | modelo_del_medidor | character varying | 20 | YES | NULL |
| 31 | fecha_de_instalacion_de_medidor | date |  | YES | NULL |
| 32 | numero_desello_del_medidor | character | 10 | YES | NULL |
| 33 | geox | numeric |  | YES | NULL |
| 34 | geoy | numeric |  | YES | NULL |
| 35 | nombre_del_distrito | text |  | YES | NULL |
| 36 | ultimo_consumo_de_metros_cubicos_facturados | integer | 32,0 | YES | NULL |
| 37 | ultimo_periodo_de_facturacion | text |  | YES | NULL |
| 38 | lectura_actual | integer | 32,0 | YES | NULL |
| 39 | fecha_de_lectura_actual | date |  | YES | NULL |
| 40 | ultima_lectura_facturada | integer | 32,0 | YES | NULL |
| 41 | fecha_ultima_lectura_facturada | date |  | YES | NULL |
| 42 | numero_solicitud | numeric | 10,0 | YES | NULL |
| 43 | tipo_solicitud | character varying | 1000 | YES | NULL |
| 44 | fecha_creacion_solicitud | timestamp without time zone |  | YES | NULL |
| 45 | id_uso_acometida | numeric | 5,0 | YES | NULL |
| 46 | descripcion_uso_acometida | character varying | 1000 | YES | NULL |
| 47 | tipo_instalacion | numeric | 5,0 | YES | NULL |
| 48 | descripcion_tipo_instalacion | text |  | YES | NULL |
| 49 | tipo_acometida | numeric | 5,0 | YES | NULL |
| 50 | descripcion_tipo_acometida | text |  | YES | NULL |
| 51 | tipo_trabajo | numeric | 5,0 | YES | NULL |
| 52 | descripcion_tipo_trabajo | text |  | YES | NULL |
| 53 | descripcion_servicio_solicitado | character varying | 80 | YES | NULL |
| 54 | observaciones_solicitud | character varying | 80 | YES | NULL |

---

### vw_gis_inspecciones_old

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | orden_servicio | numeric | 10,0 | YES | NULL |
| 2 | fecha_de_reporte | timestamp without time zone |  | YES | NULL |
| 3 | idusuario | character varying | 10 | YES | NULL |
| 4 | nombre_usuario | character varying | 40 | YES | NULL |
| 5 | estatus | numeric | 5,0 | YES | NULL |
| 6 | descripcion_status | text |  | YES | NULL |
| 7 | descripcion | text |  | YES | NULL |
| 8 | tipo_id | integer | 32,0 | YES | NULL |
| 9 | tipo_orden | character varying | 1000 | YES | NULL |
| 10 | motivo_id | integer | 32,0 | YES | NULL |
| 11 | motivo_orden | character varying | 1000 | YES | NULL |
| 12 | numero_queja | text |  | YES | NULL |
| 13 | usuario_queja | character varying | 40 | YES | NULL |
| 14 | contratoaqua | integer | 32,0 | YES | NULL |
| 15 | contratoant | text |  | YES | NULL |
| 16 | idexplotacion | numeric | 5,0 | YES | NULL |
| 17 | descexplotacion | character varying | 70 | YES | NULL |
| 18 | nombre_completo_usuario | text |  | YES | NULL |
| 19 | domicilio_del_usuario | character varying | 150 | YES | NULL |
| 20 | numero_de_colonia | numeric | 5,0 | YES | NULL |
| 21 | nombre_colonia | character varying | 100 | YES | NULL |
| 22 | tipo_servicio | character varying | 1000 | YES | NULL |
| 23 | diametro_de_medidor | numeric | 5,0 | YES | NULL |
| 24 | localizacion | numeric | 14,0 | YES | NULL |
| 25 | fecha_ultimo_pago | date |  | YES | NULL |
| 26 | saldo_actual | numeric |  | YES | NULL |
| 27 | noperadeudo | integer | 32,0 | YES | NULL |
| 28 | numero_de_serie_del_medidor | character varying | 12 | YES | NULL |
| 29 | marca_del_medidor | character varying | 30 | YES | NULL |
| 30 | modelo_del_medidor | character varying | 20 | YES | NULL |
| 31 | fecha_de_instalacion_de_medidor | date |  | YES | NULL |
| 32 | numero_desello_del_medidor | character | 10 | YES | NULL |
| 33 | geox | numeric |  | YES | NULL |
| 34 | geoy | numeric |  | YES | NULL |
| 35 | nombre_del_distrito | text |  | YES | NULL |
| 36 | ultimo_consumo_de_metros_cubicos_facturados | integer | 32,0 | YES | NULL |
| 37 | ultimo_periodo_de_facturacion | text |  | YES | NULL |
| 38 | lectura_actual | integer | 32,0 | YES | NULL |
| 39 | fecha_de_lectura_actual | date |  | YES | NULL |
| 40 | ultima_lectura_facturada | integer | 32,0 | YES | NULL |
| 41 | fecha_ultima_lectura_facturada | date |  | YES | NULL |
| 42 | numero_solicitud | numeric | 10,0 | YES | NULL |
| 43 | tipo_solicitud | character varying | 1000 | YES | NULL |
| 44 | fecha_creacion_solicitud | timestamp without time zone |  | YES | NULL |
| 45 | id_uso_acometida | numeric | 5,0 | YES | NULL |
| 46 | descripcion_uso_acometida | character varying | 1000 | YES | NULL |
| 47 | tipo_instalacion | numeric | 5,0 | YES | NULL |
| 48 | descripcion_tipo_instalacion | text |  | YES | NULL |
| 49 | tipo_acometida | numeric | 5,0 | YES | NULL |
| 50 | descripcion_tipo_acometida | text |  | YES | NULL |
| 51 | tipo_trabajo | numeric | 5,0 | YES | NULL |
| 52 | descripcion_tipo_trabajo | text |  | YES | NULL |
| 53 | descripcion_servicio_solicitado | character varying | 80 | YES | NULL |
| 54 | observaciones_solicitud | character varying | 80 | YES | NULL |

---

### vw_gis_pad_usu_amealco_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_cadereyta_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_colon_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_corregidora_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_ezequiel_montes_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_huimilpan_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_jalpan_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_marques_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_pedro_escobedo_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_pinal_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_queretaro_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_santa_rosa_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_pad_usu_tequisquiapan_new

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | contratoant | text |  | YES | NULL |
| 3 | clavepredio | character varying | 30 | YES | NULL |
| 4 | titularcontrato | text |  | YES | NULL |
| 5 | idexplotacion | numeric | 5,0 | YES | NULL |
| 6 | descexplotacion | character varying | 70 | YES | NULL |
| 7 | idcolonia | numeric | 5,0 | YES | NULL |
| 8 | desccolonia | character varying | 100 | YES | NULL |
| 9 | numcalle | numeric | 10,0 | YES | NULL |
| 10 | descalle | character varying | 80 | YES | NULL |
| 11 | numexterior | numeric | 10,0 | YES | NULL |
| 12 | numinterior | text |  | YES | NULL |
| 13 | bloque | character | 4 | YES | NULL |
| 14 | km | numeric | 5,1 | YES | NULL |
| 15 | duplicado | character | 1 | YES | NULL |
| 16 | planta | character | 4 | YES | NULL |
| 17 | puerta | character | 4 | YES | NULL |
| 18 | complemento | character | 10 | YES | NULL |
| 19 | domusuario | character varying | 150 | YES | NULL |
| 20 | idtiposervicio | numeric | 5,0 | YES | NULL |
| 21 | desctiposervicio | character varying | 1000 | YES | NULL |
| 22 | ruta | numeric | 14,0 | YES | NULL |
| 23 | acometida | numeric | 10,0 | YES | NULL |
| 24 | sectorhidraulico | character varying | 50 | YES | NULL |
| 25 | iddistrito | text |  | YES | NULL |
| 26 | nombredistrito | text |  | YES | NULL |
| 27 | estatus | numeric | 5,0 | YES | NULL |
| 28 | descestatus | text |  | YES | NULL |
| 29 | idlocalidad | numeric | 10,0 | YES | NULL |
| 30 | desclocalidad | character varying | 40 | YES | NULL |
| 31 | noperadeudo | bigint | 64,0 | YES | NULL |
| 32 | numeroseriemedidor | character varying | 12 | YES | NULL |
| 33 | saldoactual | numeric |  | YES | NULL |
| 34 | fechaultimopago | date |  | YES | NULL |
| 35 | numerodepartamentos | text |  | YES | NULL |
| 36 | idestatusmedidor | numeric | 5,0 | YES | NULL |
| 37 | estatusmedidor | text |  | YES | NULL |
| 38 | marcamedidor | character varying | 20 | YES | NULL |
| 39 | modelomedidor | character varying | 30 | YES | NULL |
| 40 | diametro_de_medidor_in | text |  | YES | NULL |
| 41 | diametro_de_medidor_mm | numeric | 5,0 | YES | NULL |
| 42 | geox | numeric |  | YES | NULL |
| 43 | geoy | numeric |  | YES | NULL |
| 44 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 45 | telefono | character varying | 16 | YES | NULL |
| 46 | lada_movil | character varying | 5 | YES | NULL |
| 47 | movil | character varying | 16 | YES | NULL |
| 48 | fax | character varying | 16 | YES | NULL |
| 49 | telefono_extra | character varying | 80 | YES | NULL |
| 50 | email | character varying | 150 | YES | NULL |

---

### vw_gis_sectorizacion

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contratoaqua | numeric | 10,0 | YES | NULL |
| 2 | descexplotacion | character varying | 70 | YES | NULL |
| 3 | desccolonia | character varying | 100 | YES | NULL |
| 4 | desctiposervicio | character varying | 1000 | YES | NULL |
| 5 | sectorhidraulico | character varying | 50 | YES | NULL |
| 6 | nombredistrito | text |  | YES | NULL |
| 7 | descestatus | text |  | YES | NULL |
| 8 | desclocalidad | character varying | 40 | YES | NULL |
| 9 | geox | numeric |  | YES | NULL |
| 10 | geoy | numeric |  | YES | NULL |
| 11 | unidades_servidas | numeric | 24,6 | YES | NULL |
| 12 | ultimo_consumo_de_metros_cubicos_facturados | integer | 32,0 | YES | NULL |
| 13 | ultimo_periodo_de_facturacion | text |  | YES | NULL |
| 14 | lectura_actual | integer | 32,0 | YES | NULL |

---

### vwconjuipdte

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | vwcjpcnttnum | integer | 32,0 | YES | NULL |

---

### webcliente

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | webcliid | numeric | 10,0 | NO | NULL |
| 2 | webuser | character varying | 11 | NO | NULL |
| 3 | webpass | character varying | 10 | NO | NULL |
| 4 | webconex | numeric | 10,0 | NO | NULL |
| 5 | webtime | timestamp without time zone |  | NO | NULL |
| 6 | webemail | character varying | 100 | NO | NULL |

---

### xra_contadores

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | refant | character | 12 | YES | NULL |
| 2 | datains | character varying | 10 | YES | NULL |
| 3 | ncont | character varying | 12 | YES | NULL |
| 4 | idmarc | numeric | 5,0 | YES | NULL |
| 5 | idmod | numeric | 5,0 | YES | NULL |
| 6 | ncto | numeric | 10,0 | YES | NULL |
| 7 | idcont | numeric | 10,0 | YES | NULL |

---

### zona

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | zonexpid | numeric | 5,0 | NO | NULL |
| 2 | zonid | character | 3 | NO | NULL |
| 3 | zonperid | numeric | 5,0 | NO | NULL |
| 4 | zondescrip | character varying | 30 | NO | NULL |
| 5 | zoncontcod | numeric | 5,0 | NO | NULL |
| 6 | zonsnmpaa | character | 1 | NO | 'S'::bpchar |
| 7 | zonsnpa | character | 1 | NO | 'N'::bpchar |
| 8 | zonsnpua | character | 1 | NO | 'S'::bpchar |
| 9 | zonsnactiva | character | 1 | NO | 'S'::bpchar |
| 10 | zonsncerautfto | character | 1 | NO | 'N'::bpchar |
| 11 | zonsnple | character varying | 1 | NO | 'N'::character varying |

---

### zz_backupexpedsif

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | exsid | numeric | 10,0 | YES | NULL |
| 2 | exsestado | numeric | 5,0 | YES | NULL |
| 3 | exsestadoant | numeric | 5,0 | YES | NULL |

---

### zz_backuphisexpedsif

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | hexsid | numeric | 10,0 | YES | NULL |
| 2 | hexsestado | numeric | 5,0 | YES | NULL |
| 3 | hexsestadoant | numeric | 5,0 | YES | NULL |
| 4 | hexshstusu | character | 10 | YES | NULL |
| 5 | hexshsthora | timestamp without time zone |  | YES | NULL |

---

---

## Schema: aux_migracion

### apunte_maria

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | apnasiento | numeric | 10,0 | YES | NULL |
| 2 | apnorden | numeric | 5,0 | YES | NULL |
| 3 | apndh | character | 1 | YES | NULL |
| 4 | apncuenta | character varying | 10 | YES | NULL |
| 5 | apnimporte | numeric | 18,2 | YES | NULL |
| 6 | apndescrip | character varying | 50 | YES | NULL |
| 7 | apndestino | character varying | 10 | YES | NULL |
| 8 | apncantida | double precision | 53 | YES | NULL |
| 9 | apnunidade | character | 3 | YES | NULL |
| 10 | apnindiva | character | 2 | YES | NULL |
| 11 | apnpctjiva | numeric | 5,4 | YES | NULL |
| 12 | apncsc | numeric | 5,0 | YES | NULL |
| 13 | apnclconta | character varying | 2 | YES | NULL |
| 14 | apnbase | numeric | 18,2 | YES | NULL |
| 15 | apnfvalor | date |  | YES | NULL |
| 16 | apnnasigna | character varying | 18 | YES | NULL |
| 17 | apntxtpos | character varying | 50 | YES | NULL |
| 18 | apnbcr | character varying | 3 | YES | NULL |
| 19 | apnnif | character varying | 15 | YES | NULL |
| 20 | apnactcont | character | 2 | YES | NULL |
| 21 | apnclaref | character varying | 12 | YES | NULL |
| 22 | apnnivtes | character varying | 2 | YES | NULL |
| 23 | apncenben | character varying | 6 | YES | NULL |
| 24 | apntpcuen | character varying | 1 | YES | NULL |
| 25 | apnsninccont | character | 1 | YES | NULL |

---

---

## Schema: public

### pg_stat_statements

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | userid | oid |  | YES | NULL |
| 2 | dbid | oid |  | YES | NULL |
| 3 | queryid | bigint | 64,0 | YES | NULL |
| 4 | query | text |  | YES | NULL |
| 5 | plans | bigint | 64,0 | YES | NULL |
| 6 | total_plan_time | double precision | 53 | YES | NULL |
| 7 | min_plan_time | double precision | 53 | YES | NULL |
| 8 | max_plan_time | double precision | 53 | YES | NULL |
| 9 | mean_plan_time | double precision | 53 | YES | NULL |
| 10 | stddev_plan_time | double precision | 53 | YES | NULL |
| 11 | calls | bigint | 64,0 | YES | NULL |
| 12 | total_exec_time | double precision | 53 | YES | NULL |
| 13 | min_exec_time | double precision | 53 | YES | NULL |
| 14 | max_exec_time | double precision | 53 | YES | NULL |
| 15 | mean_exec_time | double precision | 53 | YES | NULL |
| 16 | stddev_exec_time | double precision | 53 | YES | NULL |
| 17 | rows | bigint | 64,0 | YES | NULL |
| 18 | shared_blks_hit | bigint | 64,0 | YES | NULL |
| 19 | shared_blks_read | bigint | 64,0 | YES | NULL |
| 20 | shared_blks_dirtied | bigint | 64,0 | YES | NULL |
| 21 | shared_blks_written | bigint | 64,0 | YES | NULL |
| 22 | local_blks_hit | bigint | 64,0 | YES | NULL |
| 23 | local_blks_read | bigint | 64,0 | YES | NULL |
| 24 | local_blks_dirtied | bigint | 64,0 | YES | NULL |
| 25 | local_blks_written | bigint | 64,0 | YES | NULL |
| 26 | temp_blks_read | bigint | 64,0 | YES | NULL |
| 27 | temp_blks_written | bigint | 64,0 | YES | NULL |
| 28 | blk_read_time | double precision | 53 | YES | NULL |
| 29 | blk_write_time | double precision | 53 | YES | NULL |
| 30 | wal_records | bigint | 64,0 | YES | NULL |
| 31 | wal_fpi | bigint | 64,0 | YES | NULL |
| 32 | wal_bytes | numeric |  | YES | NULL |

---
