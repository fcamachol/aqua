# Database Map - Tables I*, J*, L*, M*, N*, O*
## Schema: cf_quere_pro

Total tables: 250

### iae

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | iaeseccion | numeric | 5,0 | NO | NULL |
| 2 | iaeepigraf | numeric | 5,0 | NO | NULL |
| 3 | iaedesc | character varying | 254 | NO | NULL |
| 4 | iaerpcgrup | numeric | 5,0 | NO | NULL |
| 5 | iaegraid | numeric | 5,0 | YES | NULL |

### idioma

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | idicodigo | character | 2 | NO | NULL |
| 2 | ididescrip | character varying | 20 | NO | NULL |
| 3 | idicodface | character | 2 | YES | NULL |
| 4 | idiidioma | character | 2 | NO | NULL |
| 5 | idipais | character | 2 | NO | NULL |

### idocaux01

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | id1cuenta | character varying | 10 | NO | NULL |
| 2 | id1clcont | character | 2 | NO | NULL |
| 3 | id1clsust | character | 2 | NO | NULL |

### imagen

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | imaid | numeric | 10,0 | NO | NULL |
| 2 | imaorigen | numeric | 5,0 | NO | NULL |
| 3 | imaidorigen | numeric | 10,0 | NO | NULL |
| 4 | imanum | numeric | 5,0 | NO | NULL |
| 5 | imatpdoc | numeric | 5,0 | NO | NULL |
| 6 | imahora | timestamp without time zone |  | NO | NULL |
| 7 | imausuario | character varying | 100 | NO | NULL |
| 8 | imatipoext | numeric | 5,0 | NO | NULL |
| 9 | imacontenido | bytea |  | NO | NULL |
| 10 | imatxt | character varying | 160 | YES | NULL |
| 11 | imaexpid | numeric | 5,0 | YES | NULL |
| 12 | imadescripcion | character varying | 50 | YES | NULL |

### imagenmigradas

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | immgimaid | numeric | 10,0 | NO | NULL |
| 2 | immgfecha | date |  | YES | NULL |

### imglogos

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | imlid | numeric | 10,0 | NO | NULL |
| 2 | imldesc | character | 30 | NO | NULL |
| 3 | imltipo | character | 10 | NO | NULL |
| 4 | imlimg | bytea |  | NO | NULL |
| 5 | imlexpid | numeric | 5,0 | NO | 0 |

### impcargodemora

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | icdfactura | numeric | 10,0 | NO | NULL |
| 2 | icdoperacion | numeric | 10,0 | NO | NULL |
| 3 | icdimpcargo | numeric | 18,2 | NO | NULL |
| 4 | icdfacturacargo | numeric | 10,0 | YES | NULL |
| 5 | icdftocargo | numeric | 10,0 | YES | NULL |
| 6 | icdcontrato | numeric | 10,0 | NO | NULL |
| 7 | icdvarcargo | numeric | 10,0 | YES | NULL |
| 8 | icdimpfracargo | numeric | 18,2 | NO | NULL |

### impconcepcontr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | iccid | numeric | 10,0 | NO | NULL |
| 2 | icccnttnum | numeric | 10,0 | NO | NULL |
| 3 | iccpccid | numeric | 10,0 | NO | NULL |
| 4 | icccptoexpid | numeric | 5,0 | NO | NULL |
| 5 | icccptotconid | numeric | 5,0 | NO | NULL |
| 6 | iccimpo | numeric | 18,2 | NO | NULL |
| 7 | iccimpu | numeric | 5,4 | YES | NULL |
| 8 | icchstusu | character varying | 10 | NO | NULL |
| 9 | icchsthora | timestamp without time zone |  | NO | NULL |

### impcuotasocpcp

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | icsgscid | numeric | 10,0 | NO | NULL |
| 2 | icspsocid | numeric | 10,0 | NO | NULL |
| 3 | icspimpini | numeric | 18,2 | YES | NULL |
| 4 | icspimpsig | numeric | 18,2 | YES | NULL |
| 5 | icspimpdtos | numeric | 18,2 | YES | NULL |
| 6 | icspimpint | numeric | 18,2 | YES | NULL |
| 7 | icspdeudatotal | numeric | 18,2 | YES | NULL |
| 8 | icspdescesp | numeric | 18,2 | YES | NULL |
| 9 | icspdeudacons | numeric | 18,2 | YES | NULL |
| 10 | icsptotalpagar | numeric | 18,2 | YES | NULL |
| 11 | icspfinanciar | numeric | 18,2 | YES | NULL |
| 12 | icspimpiniesp | numeric | 18,2 | YES | NULL |

### impfacdiferida

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ifdid | numeric | 10,0 | NO | NULL |
| 2 | ifddesglos | numeric | 10,0 | NO | NULL |
| 3 | ifdfactura | numeric | 10,0 | YES | NULL |
| 4 | ifdftofacdif | numeric | 10,0 | YES | NULL |
| 5 | ifdvarimpfacdif | numeric | 10,0 | NO | NULL |
| 6 | ifdvarintfacdif | numeric | 10,0 | YES | NULL |
| 7 | ifdpocid | numeric | 10,0 | YES | NULL |

### implocpte

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ilpid | numeric | 10,0 | NO | NULL |
| 2 | ilpexpid | numeric | 5,0 | NO | NULL |
| 3 | ilpfeccrea | timestamp without time zone |  | NO | NULL |
| 4 | ilpusucrea | character varying | 10 | NO | NULL |
| 5 | ilpftoid | numeric | 10,0 | YES | NULL |
| 6 | ilppcsid | numeric | 10,0 | YES | NULL |
| 7 | ilpfecimp | timestamp without time zone |  | YES | NULL |
| 8 | ilpusuimp | character varying | 10 | YES | NULL |
| 9 | ilpcliimpov | numeric | 19,0 | YES | NULL |
| 10 | ilpdesctrabov | character varying | 50 | YES | NULL |
| 11 | ilpfeccad | date |  | YES | NULL |
| 12 | ilpsimulacion | character | 1 | NO | 'N'::bpchar |
| 13 | ilpfinalizado | character | 1 | NO | 'S'::bpchar |
| 14 | ilpcorreoov | character varying | 110 | YES | NULL |
| 15 | ilpfecfin | timestamp without time zone |  | YES | NULL |
| 16 | ilpproccomid | numeric | 10,0 | YES | NULL |
| 17 | ilpcontrato | numeric | 10,0 | YES | NULL |
| 18 | ilpurldescarga | character varying | 500 | YES | NULL |

### impresor

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | impdprsid | numeric | 10,0 | NO | NULL |
| 2 | impdfactur | character | 1 | NO | NULL |
| 3 | impdcartas | character | 1 | NO | NULL |
| 4 | impdactivo | character | 1 | NO | NULL |
| 5 | impdcodext | numeric | 5,0 | NO | NULL |
| 6 | impdsnexterno | character | 1 | NO | NULL |
| 7 | impdhstusu | character varying | 10 | NO | NULL |
| 8 | impdhsthora | timestamp without time zone |  | NO | NULL |
| 9 | impdsnsicer | character | 1 | NO | 'N'::bpchar |
| 10 | impddiasentcor | numeric | 5,0 | YES | NULL |

### impuestao

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | itaoexpid | numeric | 5,0 | NO | NULL |
| 2 | itasoc | numeric | 10,0 | NO | NULL |
| 3 | itaoimpu | numeric | 18,2 | NO | NULL |
| 4 | itaoconconttao | numeric | 10,0 | NO | NULL |
| 5 | itatipfich | numeric | 5,0 | NO | NULL |
| 6 | itaoivatao | numeric | 5,0 | YES | NULL |

### impuesto

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | impuid | numeric | 5,0 | NO | NULL |
| 2 | impudesc | character varying | 18 | NO | NULL |
| 3 | imputifele | numeric | 5,0 | NO | 1 |

### impufact

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ipaid | numeric | 10,0 | NO | NULL |
| 2 | ipafacid | numeric | 10,0 | NO | NULL |
| 3 | ipatipo | numeric | 5,0 | NO | NULL |
| 4 | ipatconid | numeric | 5,0 | YES | NULL |
| 5 | ipasubcid | numeric | 5,0 | YES | NULL |
| 6 | ipafacnlin | numeric | 5,0 | YES | NULL |
| 7 | ipaimporte | numeric | 18,2 | NO | NULL |
| 8 | ipaimpuesto | numeric | 18,2 | NO | NULL |

### impvalfac

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ivfexpid | numeric | 5,0 | NO | NULL |
| 2 | ivfperiid | numeric | 5,0 | NO | NULL |
| 3 | ivfusocod | numeric | 5,0 | NO | NULL |
| 4 | ivfimpmin | numeric | 18,2 | NO | NULL |
| 5 | ivfimpmax | numeric | 18,2 | NO | NULL |
| 6 | ivfsnactiva | character | 1 | NO | NULL |
| 7 | ivfhstusu | character varying | 10 | NO | NULL |
| 8 | ivfhsthora | timestamp without time zone |  | NO | NULL |
| 9 | ivfsnaltas | character | 1 | NO | 'S'::bpchar |

### impvalfacact

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ivfaexpid | numeric | 5,0 | NO | NULL |
| 2 | ivfaperiid | numeric | 5,0 | NO | NULL |
| 3 | ivfausocod | numeric | 5,0 | NO | NULL |
| 4 | ivfaactivid | numeric | 5,0 | NO | NULL |
| 5 | ivfaimpmin | numeric | 18,2 | NO | NULL |
| 6 | ivfaimpmax | numeric | 18,2 | NO | NULL |
| 7 | ivfasnactiva | character | 1 | NO | NULL |
| 8 | ivfahstusu | character varying | 10 | NO | NULL |
| 9 | ivfahsthora | timestamp without time zone |  | NO | NULL |

### indcadatos

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | icadicaiid | character varying | 6 | NO | NULL |
| 2 | icadanno | numeric | 5,0 | NO | NULL |
| 3 | icadmes | numeric | 5,0 | NO | NULL |
| 4 | icadexpid | numeric | 5,0 | NO | NULL |
| 5 | icadfrec | character | 1 | NO | NULL |
| 6 | icadnumera | numeric | 10,0 | NO | NULL |
| 7 | icaddenomi | numeric | 10,0 | NO | NULL |

### indcalid

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | icaiid | character varying | 6 | NO | NULL |
| 2 | icaitxtid | numeric | 10,0 | NO | NULL |
| 3 | icaifrec | character | 1 | NO | NULL |
| 4 | icaitpmes | character | 1 | NO | NULL |
| 5 | icaitxtidcri | numeric | 10,0 | YES | NULL |
| 6 | icaicrval | numeric | 10,0 | YES | NULL |
| 7 | icaiunidad | numeric | 10,0 | NO | NULL |
| 8 | icainumera | character varying | 50 | NO | NULL |
| 9 | icaidenomi | character varying | 50 | NO | NULL |

### indemexpcont

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | iectinid | numeric | 10,0 | NO | NULL |
| 2 | iecexpid | numeric | 5,0 | NO | NULL |
| 3 | ieccnttnum | numeric | 10,0 | NO | NULL |
| 4 | ieczonid | character | 3 | NO | NULL |
| 5 | iecanno | numeric | 5,0 | NO | NULL |
| 6 | iecperiodi | numeric | 5,0 | NO | NULL |
| 7 | iecperiodo | numeric | 5,0 | NO | NULL |
| 8 | iecaplicada | character | 1 | NO | 'N'::bpchar |
| 9 | iecftoid | numeric | 10,0 | YES | NULL |

### indemexplo

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | inetinid | numeric | 10,0 | NO | NULL |
| 2 | ineexpid | numeric | 5,0 | NO | NULL |
| 3 | inetconid | numeric | 5,0 | NO | NULL |
| 4 | inetiptid | numeric | 5,0 | NO | NULL |
| 5 | inetpvid | numeric | 5,0 | NO | NULL |

### indproc

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | iprocod | character | 6 | NO | NULL |
| 2 | iprodesctxtid | numeric | 10,0 | YES | NULL |
| 3 | ipronumtxtid | numeric | 10,0 | YES | NULL |
| 4 | iprodentxtid | numeric | 10,0 | YES | NULL |
| 5 | ipromult | numeric | 10,0 | YES | NULL |
| 6 | iprosnquipu | character | 1 | NO | NULL |
| 7 | iprotemp | numeric | 5,0 | NO | NULL |
| 8 | iprotipcalv1 | numeric | 5,0 | NO | 1 |
| 9 | iprotipcalv2 | numeric | 5,0 | NO | 1 |
| 10 | iprotipcalv3 | numeric | 5,0 | NO | 1 |
| 11 | iprotipcalv4 | numeric | 5,0 | NO | 1 |
| 12 | iprosnmescont | character | 1 | NO | 'N'::bpchar |

### indprocdat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | iprdid | numeric | 10,0 | NO | NULL |
| 2 | iprdipreid | numeric | 10,0 | NO | NULL |
| 3 | iprdanno | numeric | 5,0 | NO | NULL |
| 4 | iprdmes | numeric | 5,0 | NO | NULL |
| 5 | iprdperanno | numeric | 5,0 | YES | NULL |
| 6 | iprdperiid | numeric | 5,0 | YES | NULL |
| 7 | iprdpernum | numeric | 5,0 | YES | NULL |
| 8 | iprdvar1 | numeric | 18,2 | YES | NULL |
| 9 | iprdvar2 | numeric | 18,2 | YES | NULL |
| 10 | iprdvar3 | numeric | 18,2 | YES | NULL |
| 11 | iprdvar4 | numeric | 18,2 | YES | NULL |
| 12 | iprdfeccar | date |  | YES | NULL |
| 13 | iprdcodsub | character | 4 | YES | NULL |
| 14 | iprdanyrefnum | numeric | 5,0 | YES | NULL |
| 15 | iprdmesrefnum | numeric | 5,0 | YES | NULL |

### indprocexp

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ipreid | numeric | 10,0 | NO | NULL |
| 2 | ipreiprocod | character | 6 | NO | NULL |
| 3 | ipreexpid | numeric | 5,0 | NO | NULL |
| 4 | ipreperiid | numeric | 5,0 | YES | NULL |
| 5 | ipreobj | numeric | 10,2 | YES | NULL |
| 6 | iprecrit | numeric | 10,2 | YES | NULL |
| 7 | iprefecact | date |  | NO | NULL |

### infocobro

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | polnum | numeric | 10,0 | NO | NULL |
| 2 | nomcliente | character varying | 30 | YES | NULL |
| 3 | priapeclie | character varying | 60 | YES | NULL |
| 4 | segapeclie | character varying | 60 | YES | NULL |
| 5 | nifcliente | character varying | 15 | YES | NULL |
| 6 | locnombre | character varying | 40 | YES | NULL |
| 7 | dirtexto | character varying | 110 | YES | NULL |
| 8 | ncalnombre | character varying | 80 | YES | NULL |
| 9 | dirfinca | numeric | 10,0 | YES | NULL |
| 10 | dircomfin | character varying | 10 | YES | NULL |
| 11 | dirbloque | character varying | 4 | YES | NULL |
| 12 | direscal | character varying | 4 | YES | NULL |
| 13 | dirplanta | character varying | 4 | YES | NULL |
| 14 | dirpuerta | character varying | 4 | YES | NULL |
| 15 | dircomplem | character varying | 40 | YES | NULL |
| 16 | polestado | numeric | 5,0 | YES | NULL |
| 17 | ptossncortado | character | 1 | YES | NULL |
| 18 | ptosfeccorte | date |  | YES | NULL |
| 19 | ultlectfec | date |  | YES | NULL |
| 20 | ultlectcon | numeric | 10,0 | YES | NULL |
| 21 | ultlectobs | character | 2 | YES | NULL |
| 22 | ultlectori | character varying | 30 | YES | NULL |
| 23 | deblimpentr | numeric | 18,2 | YES | NULL |
| 24 | deblimptotal | numeric | 18,2 | YES | NULL |
| 25 | deblnumciclos | numeric | 10,0 | YES | NULL |
| 26 | decoimptotal | numeric | 18,2 | YES | NULL |
| 27 | deconumciclos | numeric | 10,0 | YES | NULL |
| 28 | debltxtcom | character varying | 1750 | YES | NULL |
| 29 | decotxtcom | character varying | 1750 | YES | NULL |
| 30 | socprsid | numeric | 10,0 | YES | NULL |
| 31 | expid | numeric | 5,0 | YES | NULL |
| 32 | deblfacnumfac | character varying | 1750 | YES | NULL |
| 33 | decofacnumfac | character varying | 1750 | YES | NULL |

### infoinspeccion

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ifiid | numeric | 10,0 | NO | NULL |
| 2 | ifisaid | numeric | 10,0 | NO | NULL |
| 3 | ifisnfactible | character varying | 1 | NO | NULL |
| 4 | ifisnservidumbre | character varying | 1 | NO | NULL |
| 5 | ifiacobertura | numeric | 5,0 | YES | NULL |
| 6 | ifinramales | numeric | 5,0 | YES | NULL |
| 7 | ifiubicacion | character | 2 | YES | NULL |
| 8 | ifiubiotro | character varying | 100 | YES | NULL |
| 9 | ifiafectadored | numeric | 5,0 | YES | NULL |
| 10 | ifitpredcloaca | numeric | 5,0 | YES | NULL |
| 11 | ifitptaparegistro | numeric | 5,0 | YES | NULL |
| 12 | ifitptaparegotro | character varying | 100 | YES | NULL |
| 13 | ificonactual | numeric | 5,0 | YES | NULL |
| 14 | ificonactotro | character varying | 100 | YES | NULL |
| 15 | ifisolconexion | numeric | 5,0 | YES | NULL |
| 16 | ifisolconotro | character varying | 100 | YES | NULL |
| 17 | ificambdiametro | numeric | 5,0 | YES | NULL |
| 18 | ificambdiamotro | character varying | 100 | YES | NULL |
| 19 | ifitppavtierra | character varying | 3 | YES | NULL |
| 20 | ifitppavasfalto | character varying | 3 | YES | NULL |
| 21 | ifitppavempedrado | character varying | 3 | YES | NULL |
| 22 | ifitppavotro | character varying | 50 | YES | NULL |
| 23 | ifitppavref | character varying | 100 | YES | NULL |
| 24 | ifidetmedtierra | character varying | 50 | YES | NULL |
| 25 | ifidetmedasfalto | character varying | 50 | YES | NULL |
| 26 | ifidetmedempedrado | character varying | 50 | YES | NULL |
| 27 | ifidetmedotro | character varying | 50 | YES | NULL |
| 28 | ifiobservaciones | character varying | 1024 | YES | NULL |

### infolecturas

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cnttnum | numeric | 10,0 | NO | NULL |
| 2 | contid | numeric | 10,0 | NO | NULL |
| 3 | contnumero | character varying | 12 | YES | NULL |
| 4 | zona | character varying | 50 | YES | NULL |
| 5 | codreclec | numeric | 14,0 | YES | NULL |
| 6 | locnombre | character varying | 40 | YES | NULL |
| 7 | dirtexto | character varying | 110 | YES | NULL |
| 8 | ncalnombre | character varying | 80 | YES | NULL |
| 9 | dirfinca | numeric | 10,0 | YES | NULL |
| 10 | dircomfin | character varying | 10 | YES | NULL |
| 11 | dirbloque | character varying | 4 | YES | NULL |
| 12 | direscal | character varying | 4 | YES | NULL |
| 13 | dirplanta | character varying | 4 | YES | NULL |
| 14 | dirpuerta | character varying | 4 | YES | NULL |
| 15 | dircomplem | character varying | 40 | YES | NULL |
| 16 | contcalimm | numeric | 5,0 | YES | NULL |
| 17 | emplazto | character varying | 1000 | YES | NULL |
| 18 | obslector | character varying | 80 | YES | NULL |
| 19 | numllave | numeric | 5,0 | YES | NULL |
| 20 | prsnombre | character varying | 122 | YES | NULL |
| 21 | expid | numeric | 5,0 | NO | NULL |
| 22 | socprsid | numeric | 10,0 | NO | NULL |
| 23 | esfera | numeric | 5,0 | YES | NULL |
| 24 | lectperant | numeric | 10,0 | YES | NULL |
| 25 | consperant | numeric | 10,0 | YES | NULL |
| 26 | obsperant | character varying | 1000 | YES | NULL |

### ingresosDepInterno

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | idrec | numeric | 6,0 | NO | NULL |
| 2 | administracion | character varying | 80 | NO | NULL |
| 3 | caja | character varying | 100 | NO | NULL |
| 4 | usuario | character varying | 80 | NO | NULL |
| 5 | sesfecha | date |  | YES | NULL |
| 6 | fechadeposito | date |  | YES | NULL |
| 7 | formapago | character varying | 40 | YES | NULL |
| 8 | importedep | numeric | 18,2 | YES | NULL |
| 9 | cuenta | character varying | 50 | NO | NULL |
| 10 | importebanco | numeric | 18,2 | YES | NULL |
| 11 | sob_falt | numeric | 18,2 | YES | NULL |
| 12 | fecha | date |  | YES | NULL |

### ingresosaplicados

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | periodo | numeric | 6,0 | NO | NULL |
| 2 | ocgid | numeric | 10,0 | NO | NULL |
| 3 | ocgoperaci | character varying | 40 | NO | NULL |
| 4 | opdtipopecaja | numeric | 5,0 | YES | NULL |
| 5 | opdasiento | numeric | 10,0 | YES | NULL |
| 6 | ocgfechaprov | timestamp without time zone |  | NO | NULL |
| 7 | ocgfechadef | timestamp without time zone |  | YES | NULL |
| 8 | oficina | character varying | 25 | NO | NULL |
| 9 | sesfecha | date |  | NO | NULL |
| 10 | usudesc | character varying | 40 | NO | NULL |
| 11 | usupuesto | character varying | 40 | YES | NULL |
| 12 | opdid | numeric | 10,0 | NO | NULL |
| 13 | opdcanal | character | 1 | NO | NULL |
| 14 | formapago | character varying | 1000 | NO | NULL |
| 15 | opdimporte | numeric | 18,4 | NO | NULL |
| 16 | opdbanco | numeric | 5,0 | YES | NULL |
| 17 | opdreferen | character varying | 61 | YES | NULL |
| 18 | opdfecopeb | date |  | YES | NULL |
| 19 | opdfecprev | date |  | NO | NULL |

### ingresoscfdi

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | periodo | numeric | 6,0 | NO | NULL |
| 2 | periodo_mov | character varying | 6 | NO | NULL |
| 3 | importe_ingreso | numeric | 18,4 | YES | NULL |
| 4 | ocgid | numeric | 10,0 | NO | NULL |
| 5 | ocgoperaci | character varying | 40 | NO | NULL |
| 6 | opdtipopecaja | numeric | 5,0 | YES | NULL |
| 7 | opdasiento | numeric | 10,0 | YES | NULL |
| 8 | ocgfechaprov | timestamp without time zone |  | NO | NULL |
| 9 | ocgfechadef | timestamp without time zone |  | YES | NULL |
| 10 | oficina | character varying | 25 | NO | NULL |
| 11 | sesfecha | date |  | NO | NULL |
| 12 | usudesc | character varying | 40 | NO | NULL |
| 13 | usupuesto | character varying | 40 | YES | NULL |
| 14 | opdid | numeric | 10,0 | NO | NULL |
| 15 | opdcanal | character | 1 | NO | NULL |
| 16 | formapago | character varying | 1000 | NO | NULL |
| 17 | opdimporte | numeric | 18,4 | NO | NULL |
| 18 | opdbanco | numeric | 5,0 | YES | NULL |
| 19 | opdreferen | character varying | 61 | YES | NULL |
| 20 | opdfecopeb | date |  | YES | NULL |
| 21 | opdfecprev | date |  | NO | NULL |
| 22 | dccfid | numeric | 10,0 | NO | NULL |
| 23 | dccfentid | numeric | 10,0 | NO | NULL |
| 24 | dccftipo | character varying | 3 | NO | NULL |
| 25 | dccfcnttnum | numeric | 10,0 | NO | NULL |
| 26 | dccfentidorg | numeric | 10,0 | NO | NULL |
| 27 | dccftipoorg | character | 1 | NO | NULL |
| 28 | dccffeccrea | timestamp without time zone |  | NO | NULL |
| 29 | dccfestado | numeric | 5,0 | NO | NULL |
| 30 | dccfimporte | numeric | 18,4 | YES | NULL |
| 31 | dccfuuid | character varying | 36 | YES | NULL |
| 32 | dccffechaenv | timestamp without time zone |  | YES | NULL |
| 33 | dccffecharec | timestamp without time zone |  | YES | NULL |
| 34 | dccfreldccfid | numeric | 10,0 | YES | NULL |
| 35 | dccfuuid_relacionado | character varying | 36 | YES | NULL |
| 36 | dccffeccrea_relacionado | timestamp without time zone |  | YES | NULL |
| 37 | dccfimporte_relacionado | numeric | 18,4 | YES | NULL |
| 38 | dccfestado_relacionado | numeric | 5,0 | YES | NULL |

### ingresoscfdi2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | periodo | numeric | 6,0 | NO | NULL |
| 2 | periodo_mov | character varying | 6 | NO | NULL |
| 3 | importe_ingreso | numeric | 18,4 | YES | NULL |
| 4 | importe_original | numeric | 18,4 | YES | NULL |
| 5 | ocgid | numeric | 10,0 | NO | NULL |
| 6 | ocgoperaci | character varying | 40 | NO | NULL |
| 7 | opdtipopecaja | numeric | 5,0 | YES | NULL |
| 8 | opdasiento | numeric | 10,0 | YES | NULL |
| 9 | ocgfechaprov | timestamp without time zone |  | NO | NULL |
| 10 | ocgfechadef | timestamp without time zone |  | YES | NULL |
| 11 | oficina | character varying | 25 | NO | NULL |
| 12 | sesfecha | date |  | NO | NULL |
| 13 | usudesc | character varying | 40 | NO | NULL |
| 14 | usupuesto | character varying | 40 | YES | NULL |
| 15 | opdid | numeric | 10,0 | NO | NULL |
| 16 | opdcanal | character | 1 | NO | NULL |
| 17 | formapago | character varying | 1000 | NO | NULL |
| 18 | opdimporte | numeric | 18,4 | NO | NULL |
| 19 | opdbanco | numeric | 5,0 | YES | NULL |
| 20 | opdreferen | character varying | 61 | YES | NULL |
| 21 | opdfecopeb | date |  | YES | NULL |
| 22 | opdfecprev | date |  | NO | NULL |
| 23 | dccfid | numeric | 10,0 | NO | NULL |
| 24 | dccfentid | numeric | 10,0 | NO | NULL |
| 25 | dccftipo | character varying | 3 | NO | NULL |
| 26 | dccfcnttnum | numeric | 10,0 | NO | NULL |
| 27 | dccfentidorg | numeric | 10,0 | NO | NULL |
| 28 | dccftipoorg | character | 1 | NO | NULL |
| 29 | dccffeccrea | timestamp without time zone |  | NO | NULL |
| 30 | dccfestado | numeric | 5,0 | NO | NULL |
| 31 | dccfimporte | numeric | 18,4 | YES | NULL |
| 32 | dccfuuid | character varying | 36 | YES | NULL |
| 33 | dccffechaenv | timestamp without time zone |  | YES | NULL |
| 34 | dccffecharec | timestamp without time zone |  | YES | NULL |
| 35 | dccfreldccfid | numeric | 10,0 | YES | NULL |
| 36 | dccfuuid_relacionado | character varying | 36 | YES | NULL |
| 37 | dccffeccrea_relacionado | timestamp without time zone |  | YES | NULL |
| 38 | dccfimporte_relacionado | numeric | 18,4 | YES | NULL |
| 39 | dccfestado_relacionado | numeric | 5,0 | YES | NULL |

### ingresoscfdi_SAT

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | UUID | character varying | 50 | NO | NULL |
| 2 | RFCEmisor | character varying | 15 | YES | NULL |
| 3 | NombreEmisor | character varying | 200 | YES | NULL |
| 4 | RfcReceptor | character varying | 15 | YES | NULL |
| 5 | NombreReceptor | character varying | 200 | YES | NULL |
| 6 | RfcPac | character varying | 15 | YES | NULL |
| 7 | FechaEmision | character varying | 50 | NO | NULL |
| 8 | FechaCertificacionSat | character varying | 50 | NO | NULL |
| 9 | Monto | numeric | 18,2 | YES | NULL |
| 10 | EfectoComprobante | character varying | 10 | YES | NULL |
| 11 | Estatus | numeric |  | YES | NULL |
| 12 | FechaCancelacion | character varying | 50 | YES | NULL |

### ingresoscfdi_detecno

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fecha | character varying | 10 | NO | NULL |
| 2 | estatus | character varying | 30 | NO | NULL |
| 3 | facturaid | numeric | 10,0 | YES | NULL |
| 4 | serie | character varying | 10 | NO | NULL |
| 5 | folio | numeric | 10,0 | YES | NULL |
| 6 | uuid | character varying | 50 | NO | NULL |
| 7 | contrato | numeric | 13,0 | YES | NULL |
| 8 | rfc | character varying | 15 | NO | NULL |
| 9 | nombre | character varying | 300 | NO | NULL |
| 10 | domicilio | numeric | 6,0 | YES | NULL |
| 11 | uso_cfdi | character varying | 10 | NO | NULL |
| 12 | regimen | numeric | 3,0 | YES | NULL |
| 13 | tipo_comprobante | character varying | 50 | NO | NULL |
| 14 | totaltrasladosbaseiva16 | numeric | 18,2 | YES | NULL |
| 15 | totaltrasladosimpuestoiva16 | numeric | 18,2 | YES | NULL |
| 16 | totaltrasladosbaseiva0 | numeric | 18,2 | YES | NULL |
| 17 | totaltrasladosimpuestoiva0 | numeric | 18,2 | YES | NULL |
| 18 | totaltrasladosbaseivaexento | numeric | 18,2 | YES | NULL |
| 19 | totalpago | numeric | 18,2 | YES | NULL |
| 20 | fechapago | character varying | 50 | NO | NULL |
| 21 | metodopago | character varying | 10 | YES | NULL |

### inspeccionfrau

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ifdlifid | numeric | 10,0 | NO | NULL |
| 2 | ifdptosid | numeric | 10,0 | NO | NULL |
| 3 | ifdordid | numeric | 10,0 | YES | NULL |
| 4 | ifdsnexcluido | character | 1 | NO | 'N'::bpchar |

### insplecsol

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ilspocid | numeric | 10,0 | NO | NULL |
| 2 | ilsusuario | character varying | 10 | NO | NULL |
| 3 | ilssnpetman | character | 1 | NO | 'S'::bpchar |
| 4 | ilshstusu | character varying | 10 | YES | NULL |

### interbanco

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | bebanid | numeric | 5,0 | NO | NULL |
| 2 | bebngsocprsid | numeric | 10,0 | NO | NULL |
| 3 | bebngbanid | numeric | 5,0 | NO | NULL |

### interfacespdtes

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ifpdtid | numeric | 10,0 | NO | NULL |
| 2 | ifpdttipo | numeric | 5,0 | NO | NULL |
| 3 | ifpdtparams | character varying | 100 | NO | NULL |
| 4 | ifpdtorigin | character varying | 50 | NO | NULL |
| 5 | ifpdtestado | numeric | 5,0 | NO | NULL |
| 6 | ifpdtintentos | numeric | 5,0 | NO | 0 |
| 7 | ifpdthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### jucostas

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | jucid | numeric | 10,0 | NO | NULL |
| 2 | jucjuicio | numeric | 10,0 | NO | NULL |
| 3 | jucdescrip | character varying | 30 | NO | NULL |
| 4 | jucimporte | numeric | 18,2 | NO | NULL |

### judocument

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | judid | numeric | 10,0 | NO | NULL |
| 2 | judjuicio | numeric | 10,0 | NO | NULL |
| 3 | judfichero | character varying | 30 | NO | NULL |

### juicio

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | juid | numeric | 10,0 | NO | NULL |
| 2 | juestado | numeric | 5,0 | NO | NULL |
| 3 | judemanda1 | numeric | 10,0 | YES | NULL |
| 4 | judemanda2 | numeric | 10,0 | YES | NULL |
| 5 | judemanda3 | numeric | 10,0 | YES | NULL |
| 6 | jujuzgado | character varying | 30 | YES | NULL |
| 7 | jufecjuici | date |  | YES | NULL |
| 8 | junumero | character varying | 30 | YES | NULL |
| 9 | jusitcobro | numeric | 5,0 | NO | NULL |
| 10 | jucaducado | character | 1 | NO | NULL |
| 11 | jufaborabl | character | 1 | NO | NULL |
| 12 | juobsid | numeric | 10,0 | YES | NULL |
| 13 | juexterno | character | 1 | NO | NULL |
| 14 | jufecpresentacion | date |  | YES | NULL |
| 15 | jufecresolucion | date |  | YES | NULL |
| 16 | jufecanulacion | date |  | YES | NULL |
| 17 | jumonitorio | character | 1 | NO | 'N'::bpchar |
| 18 | juhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 19 | juhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 20 | juabogado | numeric | 10,0 | YES | NULL |
| 21 | jucargo | numeric | 10,0 | YES | NULL |
| 22 | jugestorcobro | numeric | 10,0 | YES | NULL |
| 23 | jusnconciliacion | character | 1 | NO | 'N'::bpchar |
| 24 | jusnnotarial | character | 1 | NO | 'N'::bpchar |
| 25 | jusndesfavorable | character | 1 | NO | 'N'::bpchar |
| 26 | jusnverbal | character | 1 | NO | 'N'::bpchar |
| 27 | jusnordinario | character | 1 | NO | 'N'::bpchar |
| 28 | jufecejecucion | date |  | YES | NULL |
| 29 | jufecrevpatrimon | date |  | YES | NULL |
| 30 | judemanda4 | numeric | 10,0 | YES | NULL |
| 31 | jusubestado | numeric | 5,0 | YES | NULL |
| 32 | jufecliqtasas | date |  | YES | NULL |
| 33 | jufecliqfija | date |  | YES | NULL |
| 34 | jufecliqtotal | date |  | YES | NULL |
| 35 | jusnorigenfraude | character | 1 | NO | 'N'::bpchar |
| 36 | jusnpenal | character | 1 | NO | 'N'::bpchar |
| 37 | jusncivil | character | 1 | NO | 'N'::bpchar |

### lecturatxt

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ltxid | numeric | 10,0 | NO | NULL |
| 2 | ltxtexto | character varying | 240 | NO | NULL |

### libreta

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | libexpid | numeric | 5,0 | NO | NULL |
| 2 | libzonid | character | 3 | NO | NULL |
| 3 | libcod | numeric | 5,0 | NO | NULL |
| 4 | libdesc | character varying | 50 | YES | NULL |
| 5 | libsnrep | character | 1 | NO | NULL |
| 6 | libnabolot | numeric | 5,0 | NO | NULL |
| 7 | libmulabob | numeric | 5,0 | NO | NULL |
| 8 | libdiasgenlot | numeric | 5,0 | NO | NULL |
| 9 | libcascoid | numeric | 5,0 | NO | NULL |
| 10 | libbateria | numeric | 5,0 | NO | NULL |
| 11 | libnobateria | numeric | 5,0 | NO | NULL |
| 12 | libcerrados | numeric | 5,0 | NO | NULL |
| 13 | libnumjorn | numeric | 5,0 | NO | 1 |
| 14 | libcoefcorr | numeric | 5,3 | YES | NULL |
| 15 | libdestino | character varying | 10 | YES | NULL |
| 16 | libsnestimnl | character | 1 | NO | 'N'::bpchar |
| 17 | libhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 18 | libhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 19 | libsnagfich | character | 1 | NO | 'N'::bpchar |

### licexpver

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcvid | numeric | 10,0 | NO | NULL |
| 2 | lcvexvid | numeric | 10,0 | NO | NULL |
| 3 | lcvtlvid | numeric | 5,0 | NO | NULL |
| 4 | lcvtsvid | numeric | 5,0 | NO | NULL |
| 6 | lcvnumref | character | 20 | YES | NULL |
| 7 | lcvfeclim | date |  | NO | NULL |
| 8 | lcvsnflimdef | character | 1 | NO | NULL |
| 9 | lcvsnactiva | character | 1 | NO | NULL |
| 10 | lcvobserv | character varying | 256 | YES | NULL |
| 11 | lcvfecasign | timestamp without time zone |  | NO | NULL |
| 12 | lcvhstusu | character varying | 10 | NO | NULL |
| 13 | lcvhsthora | timestamp without time zone |  | NO | NULL |
| 14 | lcvdescactv | character varying | 150 | YES | NULL |

### lindiscontrato

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lctldtid | numeric | 5,0 | NO | NULL |
| 2 | lctcnttnum | numeric | 10,0 | NO | NULL |
| 3 | lctexpid | numeric | 5,0 | NO | NULL |
| 4 | lcthstusu | character varying | 10 | NO | NULL |
| 5 | lcthsthora | timestamp without time zone |  | NO | NULL |

### lindisgescob

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lgcldtid | numeric | 5,0 | NO | NULL |
| 2 | lgcprsid | numeric | 10,0 | NO | NULL |
| 3 | lgcexpid | numeric | 5,0 | NO | NULL |
| 4 | lgchstusu | character varying | 10 | NO | NULL |
| 5 | lgchsthora | timestamp without time zone |  | NO | NULL |

### lindistpcli

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ltcldtid | numeric | 5,0 | NO | NULL |
| 2 | ltctclicod | character | 1 | NO | NULL |
| 3 | ltcexpid | numeric | 5,0 | NO | NULL |
| 4 | ltchstusu | character varying | 10 | NO | NULL |
| 5 | ltchsthora | timestamp without time zone |  | NO | NULL |

### lineadistrib

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldtid | numeric | 5,0 | NO | NULL |
| 2 | ldtexpid | numeric | 5,0 | NO | NULL |
| 3 | ldtdescrip | character varying | 50 | NO | NULL |
| 4 | ldtsndefecto | character | 1 | NO | NULL |
| 5 | ldtsnactiva | character | 1 | NO | NULL |
| 6 | ldthstusu | character varying | 10 | NO | NULL |
| 7 | ldthsthora | timestamp without time zone |  | NO | NULL |

### linfaccor

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfcfacid | numeric | 10,0 | NO | NULL |
| 2 | lfcfacnlin | numeric | 5,0 | NO | NULL |
| 3 | lfccorrmin | numeric | 10,0 | YES | NULL |
| 4 | lfccorruni | numeric | 5,0 | YES | NULL |
| 5 | lfccorcfij | numeric | 10,0 | YES | NULL |
| 6 | lfccorcpro | double precision | 53 | YES | NULL |
| 7 | lfccorpref | double precision | 53 | YES | NULL |
| 8 | lfccorprep | double precision | 53 | YES | NULL |
| 9 | lfccorimpf | double precision | 53 | YES | NULL |
| 10 | lfccorimpp | double precision | 53 | YES | NULL |
| 11 | lfcfacexen | character | 1 | NO | NULL |
| 12 | lfccorref | numeric | 10,0 | YES | NULL |

### linfacprecsubcon

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfpfacid | numeric | 10,0 | NO | NULL |
| 2 | lfpfacnlin | numeric | 5,0 | NO | NULL |
| 3 | lfpforapl | numeric | 5,0 | NO | NULL |
| 4 | lfpobtfec | numeric | 5,0 | NO | NULL |
| 5 | lfssnptran | character | 1 | NO | NULL |
| 6 | lfssnpropre | character | 1 | NO | NULL |
| 7 | lfpobtcan | numeric | 5,0 | NO | NULL |
| 8 | lfptpvid | numeric | 5,0 | YES | NULL |
| 9 | lfpsnconsreal | character | 1 | NO | NULL |
| 10 | lfpsnestim | character | 1 | NO | NULL |
| 11 | lfpsnreparto | character | 1 | NO | NULL |
| 12 | lfpsnotros | character | 1 | NO | NULL |

### linfacrep

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfrfacid | numeric | 10,0 | NO | NULL |
| 2 | lfrnlin | numeric | 5,0 | NO | NULL |
| 3 | lfrmasc0 | numeric | 20,0 | YES | NULL |
| 4 | lfrmasc1 | numeric | 20,0 | YES | NULL |
| 5 | lfrotrcon | character | 1 | NO | NULL |
| 6 | lfrcalibre | character | 1 | NO | NULL |
| 7 | lfrtramo | character | 1 | NO | NULL |
| 8 | lfrtracal | character | 1 | NO | NULL |
| 9 | lfrpoliza | character | 1 | NO | NULL |
| 10 | lfrsesrep | numeric | 10,0 | YES | NULL |

### linfacsub

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfsfacid | numeric | 10,0 | NO | NULL |
| 2 | lfsfacnlin | numeric | 5,0 | NO | NULL |
| 3 | lfsexpid | numeric | 5,0 | NO | NULL |
| 4 | lfssocsub | numeric | 10,0 | NO | NULL |

### linfactestim

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfefacid | numeric | 10,0 | NO | NULL |
| 2 | lfeexpid | numeric | 5,0 | NO | NULL |
| 3 | lfeconceid | numeric | 5,0 | NO | NULL |
| 4 | lfetiptid | numeric | 5,0 | NO | NULL |
| 5 | lfetsubid | numeric | 5,0 | NO | NULL |

### linfactura

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | linfacid | numeric | 10,0 | NO | NULL |
| 2 | linfacnlin | numeric | 5,0 | NO | NULL |
| 3 | linexpid | numeric | 5,0 | NO | NULL |
| 4 | lincptoid | numeric | 5,0 | NO | NULL |
| 5 | linttarid | numeric | 5,0 | NO | NULL |
| 6 | linfecapli | date |  | NO | NULL |
| 7 | linscptoid | numeric | 5,0 | NO | NULL |
| 8 | lintralim | numeric | 10,0 | YES | NULL |
| 9 | lincaltra | numeric | 5,0 | YES | NULL |
| 10 | lincalibmm | numeric | 5,0 | YES | NULL |
| 11 | linpmvtpvid | numeric | 5,0 | YES | NULL |
| 12 | linunitpvid | numeric | 5,0 | YES | NULL |
| 13 | linfaccant | double precision | 53 | NO | NULL |
| 14 | linfprefij | double precision | 53 | NO | NULL |
| 15 | linfprepro | double precision | 53 | NO | NULL |
| 16 | linfacimpo | numeric | 18,2 | NO | NULL |
| 17 | linfacimpu | numeric | 5,4 | YES | NULL |
| 18 | linimpreg | numeric | 18,2 | YES | NULL |
| 19 | linexeimp | character | 1 | NO | 'N'::bpchar |

### linfactxt

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lftxtfacid | numeric | 10,0 | NO | NULL |
| 2 | lftfacnlin | numeric | 5,0 | NO | NULL |
| 3 | lfttxt | character varying | 500 | NO | NULL |

### liqaacfacgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | laagliqid | numeric | 5,0 | NO | NULL |
| 2 | laagexpid | numeric | 5,0 | NO | NULL |
| 3 | laagpobid | numeric | 10,0 | NO | NULL |
| 4 | laagcptoid | numeric | 5,0 | NO | NULL |
| 5 | laagatlid | numeric | 5,0 | NO | NULL |
| 6 | laagtiprepe | numeric | 5,0 | NO | NULL |
| 7 | laagnumfac | numeric | 10,0 | NO | NULL |
| 8 | laagm3fac | double precision | 53 | NO | NULL |
| 9 | laagimpcuofij | double precision | 53 | NO | NULL |
| 10 | laagimpcuovar | double precision | 53 | NO | NULL |

### liqandcod

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqacliqid | numeric | 5,0 | NO | NULL |
| 2 | lqaccodigo | character varying | 50 | NO | NULL |

### liqanual

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqaanno | numeric | 5,0 | NO | NULL |
| 2 | lqasocemi | numeric | 10,0 | NO | NULL |
| 3 | lqasocprop | numeric | 10,0 | NO | NULL |
| 4 | lqaliqid | numeric | 5,0 | NO | NULL |
| 5 | lqadefinit | character | 1 | NO | NULL |
| 6 | lqadescrip | character varying | 60 | NO | NULL |
| 7 | lqasesid | numeric | 10,0 | YES | NULL |
| 8 | lqaparcial | character | 1 | NO | NULL |

### liqanubaleares

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqabanno | numeric | 5,0 | NO | NULL |
| 2 | lqabsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqabsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqabsndefinit | character | 1 | NO | NULL |
| 5 | lqabdescrip | character varying | 60 | NO | NULL |
| 6 | lqabsesid | numeric | 10,0 | NO | NULL |

### liqanucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lacsocliqemi | numeric | 10,0 | NO | NULL |
| 2 | lacsocliqprop | numeric | 10,0 | NO | NULL |
| 3 | lacdefinit | character | 1 | NO | NULL |
| 4 | lacdescrip | character varying | 60 | NO | NULL |
| 5 | lacsesid | numeric | 10,0 | YES | NULL |
| 6 | lacfecini | date |  | NO | NULL |
| 7 | lacfecfin | date |  | NO | NULL |

### liqanugalicia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqaganno | numeric | 5,0 | NO | NULL |
| 2 | lqagsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqagsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqagdefinit | character | 1 | NO | NULL |
| 5 | lqagdescrip | character varying | 60 | NO | NULL |
| 6 | lqagsesid | numeric | 10,0 | YES | NULL |

### liqanumurcia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqamanno | numeric | 5,0 | NO | NULL |
| 2 | lqamsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqamsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqamsndefinit | character | 1 | NO | NULL |
| 5 | lqamdescrip | character varying | 60 | NO | NULL |
| 6 | lqamsesid | numeric | 10,0 | YES | NULL |

### liqanutmtr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqatid | numeric | 10,0 | NO | NULL |
| 2 | lqatsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqatsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqatfecini | date |  | NO | NULL |
| 5 | lqatfecfin | date |  | NO | NULL |
| 6 | lqatdescrip | character varying | 60 | NO | NULL |
| 7 | lqatestado | numeric | 5,0 | NO | NULL |
| 8 | lqattipo | numeric | 5,0 | NO | NULL |
| 9 | lqatperiodo | numeric | 5,0 | NO | NULL |
| 10 | lqatimpfac | numeric | 10,2 | YES | NULL |
| 11 | lqatimprec | numeric | 10,2 | YES | NULL |
| 12 | lqatsesid | numeric | 10,0 | NO | NULL |

### liqautocuadcanta

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | accliqid | numeric | 5,0 | NO | NULL |
| 2 | accpobid | numeric | 10,0 | NO | NULL |
| 3 | accexpid | numeric | 5,0 | NO | NULL |
| 4 | accfactact | numeric | 10,2 | NO | 0 |
| 5 | acccobact | numeric | 10,2 | NO | 0 |
| 6 | accdesact | numeric | 10,2 | NO | 0 |
| 7 | accrecact | numeric | 10,2 | NO | 0 |
| 8 | accimpact | numeric | 10,2 | NO | 0 |
| 9 | accsaldoact | numeric | 10,2 | NO | 0 |
| 10 | accsaldoant | numeric | 10,2 | NO | 0 |
| 11 | accaboant | numeric | 10,2 | NO | 0 |
| 12 | acccobant | numeric | 10,2 | NO | 0 |
| 13 | accdesant | numeric | 10,2 | NO | 0 |
| 14 | accrecant | numeric | 10,2 | NO | 0 |
| 15 | accimpant | numeric | 10,2 | NO | 0 |
| 16 | accnuesaldoant | numeric | 10,2 | NO | 0 |

### liqautocuadextr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | aceliqid | numeric | 5,0 | NO | NULL |
| 2 | acepobid | numeric | 10,0 | NO | NULL |
| 3 | aceexpid | numeric | 5,0 | NO | NULL |
| 4 | acefactact | numeric | 10,2 | NO | 0 |
| 5 | acecobact | numeric | 10,2 | NO | 0 |
| 6 | acedesact | numeric | 10,2 | NO | 0 |
| 7 | acerecact | numeric | 10,2 | NO | 0 |
| 8 | aceimpact | numeric | 10,2 | NO | 0 |
| 9 | acesaldoact | numeric | 10,2 | NO | 0 |
| 10 | acesaldoant | numeric | 10,2 | NO | 0 |
| 11 | aceaboant | numeric | 10,2 | NO | 0 |
| 12 | acecobant | numeric | 10,2 | NO | 0 |
| 13 | acedesant | numeric | 10,2 | NO | 0 |
| 14 | acerecant | numeric | 10,2 | NO | 0 |
| 15 | aceimpant | numeric | 10,2 | NO | 0 |
| 16 | acenuesaldoant | numeric | 10,2 | NO | 0 |

### liqautocuadgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lacgliqid | numeric | 5,0 | NO | NULL |
| 2 | lacgexpid | numeric | 5,0 | NO | NULL |
| 3 | lacgpobid | numeric | 10,0 | NO | NULL |
| 4 | lacgcptoid | numeric | 5,0 | NO | NULL |
| 5 | lacgcateg | numeric | 5,0 | NO | NULL |
| 6 | lacgimporte | numeric | 10,2 | NO | NULL |

### liqbloqcat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lbcliqid | numeric | 5,0 | NO | NULL |
| 2 | lbcsocemi | numeric | 10,0 | NO | NULL |
| 3 | lbcpobid | numeric | 10,0 | NO | NULL |
| 4 | lbcexpid | numeric | 5,0 | NO | NULL |
| 5 | lbcimptot | numeric | 12,2 | NO | NULL |
| 6 | lbcimpues | numeric | 12,2 | NO | NULL |

### liqbloquetramo

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lbtcodigo | numeric | 10,0 | NO | NULL |
| 2 | lbtsocprop | numeric | 10,0 | NO | NULL |
| 3 | lbtbloque | character varying | 10 | NO | NULL |
| 4 | lbttramo | character varying | 10 | NO | NULL |
| 5 | lbtdescrip | character varying | 80 | YES | NULL |
| 6 | lbthstusu | character varying | 10 | NO | NULL |
| 7 | lbthsthora | timestamp without time zone |  | NO | NULL |

### liqblotramtar

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lbttcodigo | numeric | 10,0 | NO | NULL |
| 2 | lbtttiptid | numeric | 5,0 | NO | NULL |
| 3 | lbttsnactivo | character | 1 | NO | NULL |
| 4 | lbtthstusu | character varying | 10 | NO | NULL |
| 5 | lbtthsthora | timestamp without time zone |  | NO | NULL |

### liqcantadet

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcdliqid | numeric | 5,0 | NO | NULL |
| 2 | lcdtipodato | numeric | 5,0 | NO | NULL |
| 3 | lcdpobid | numeric | 10,0 | NO | NULL |
| 4 | lcdexpid | numeric | 5,0 | NO | NULL |
| 5 | lcdatlid | numeric | 5,0 | YES | NULL |
| 6 | lcdexpdescri | character varying | 70 | NO | NULL |
| 7 | lcdpobnombre | character varying | 40 | NO | NULL |
| 8 | lcdpobcodine | numeric | 10,0 | NO | NULL |
| 9 | lcddirid | numeric | 10,0 | NO | NULL |
| 10 | lcdfacid | numeric | 10,0 | NO | NULL |
| 11 | lcdfacnumfac | character | 18 | NO | NULL |
| 12 | lcdfacfecfact | date |  | NO | NULL |
| 13 | lcdfaccliid | numeric | 10,0 | NO | NULL |
| 14 | lcdsnconsumo | character | 1 | NO | NULL |
| 15 | lcdlincptoid | numeric | 5,0 | NO | NULL |
| 16 | lcdlinttarid | numeric | 5,0 | NO | NULL |
| 17 | lcdlinfecapli | date |  | NO | NULL |
| 18 | ldclinscptoid | numeric | 5,0 | NO | NULL |
| 19 | lcdflinfprepro | double precision | 53 | NO | NULL |
| 20 | lcdlinfaccant | double precision | 53 | NO | NULL |
| 21 | lcdlinfacimpo | numeric | 10,2 | NO | NULL |

### liqcantatot

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lctliqid | numeric | 5,0 | NO | NULL |
| 2 | lctpobid | numeric | 10,0 | NO | NULL |
| 3 | lctexpid | numeric | 5,0 | NO | NULL |
| 4 | lcttipodato | numeric | 5,0 | NO | NULL |
| 5 | lctatlid | numeric | 5,0 | NO | NULL |
| 6 | lctexpdescri | character varying | 70 | NO | NULL |
| 7 | lctpobnom | character varying | 40 | NO | NULL |
| 8 | lctcodine | numeric | 10,0 | NO | NULL |
| 9 | lctcuota | numeric | 10,2 | NO | NULL |
| 10 | lctconsumo | numeric | 10,2 | NO | NULL |
| 11 | lctimporte | numeric | 10,2 | NO | NULL |
| 12 | lctm3 | double precision | 53 | NO | NULL |
| 13 | lctnumfacs | numeric | 10,0 | NO | NULL |

### liqcarfacgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcfgliqid | numeric | 5,0 | NO | NULL |
| 2 | lcfgfacid | numeric | 10,0 | NO | NULL |
| 3 | lcfgtiprepe | numeric | 5,0 | NO | NULL |
| 4 | lcfgocgid | numeric | 10,0 | YES | NULL |

### liqcieabocat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | labcanno | numeric | 5,0 | NO | NULL |
| 2 | labcsocliq | numeric | 10,0 | NO | NULL |
| 3 | labcsocprop | numeric | 10,0 | NO | NULL |
| 4 | labcsocemi | numeric | 10,0 | NO | NULL |
| 5 | labcpobid | numeric | 10,0 | NO | NULL |
| 6 | labcexpid | numeric | 5,0 | NO | NULL |
| 7 | labcimptotdc | numeric | 10,2 | NO | NULL |
| 8 | labcimpuesdc | numeric | 10,2 | NO | NULL |

### liqcieanucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcacanno | numeric | 5,0 | NO | NULL |
| 2 | lcacsocliq | numeric | 10,0 | NO | NULL |
| 3 | lcacsocprop | numeric | 10,0 | NO | NULL |
| 4 | lcacsndefinit | character | 1 | NO | NULL |
| 5 | lcacdescrip | character varying | 60 | NO | NULL |
| 6 | lcacsesid | numeric | 10,0 | YES | NULL |
| 7 | lcacfcierre | date |  | YES | NULL |
| 8 | lcacliqidca | numeric | 5,0 | YES | NULL |
| 9 | lcacliqidac | numeric | 5,0 | YES | NULL |
| 10 | lcacsnantfacbl | character | 1 | NO | 'N'::bpchar |

### liqcobant

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcaliqid | numeric | 5,0 | NO | NULL |
| 2 | lcapobid | numeric | 10,0 | NO | NULL |
| 3 | lcaexpid | numeric | 5,0 | NO | NULL |
| 4 | lcabancari | character | 1 | NO | NULL |
| 5 | lcaantigue | numeric | 5,0 | NO | NULL |
| 6 | lcaimpues | numeric | 10,2 | NO | NULL |
| 7 | lcabaseimp | numeric | 12,2 | NO | NULL |

### liqcobbalear

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcbliqid | numeric | 5,0 | NO | NULL |
| 2 | lcbpobid | numeric | 10,0 | NO | NULL |
| 3 | lcbexpid | numeric | 5,0 | NO | NULL |
| 4 | lcbcuota | numeric | 12,2 | NO | NULL |
| 5 | lcbcuotavar | numeric | 12,2 | NO | NULL |
| 6 | lcbimpo | numeric | 12,2 | NO | NULL |

### liqcobcat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lccliqid | numeric | 5,0 | NO | NULL |
| 2 | lccsocemi | numeric | 10,0 | NO | NULL |
| 3 | lccpobid | numeric | 10,0 | NO | NULL |
| 4 | lccexpid | numeric | 5,0 | NO | NULL |
| 5 | lccimptot | numeric | 10,2 | NO | NULL |
| 6 | lccimpues | numeric | 10,2 | NO | NULL |

### liqcobfac

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcfliqid | numeric | 5,0 | NO | NULL |
| 2 | lcfexpid | numeric | 5,0 | NO | NULL |
| 3 | lcfconceid | numeric | 5,0 | NO | NULL |
| 4 | lcftiptaid | numeric | 5,0 | NO | NULL |
| 5 | lcfbancari | character | 1 | NO | NULL |
| 6 | lcfsncoefc | character | 1 | NO | NULL |
| 7 | lcfbaseimp | numeric | 12,2 | NO | NULL |

### liqcobgalicia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcgliqid | numeric | 5,0 | NO | NULL |
| 2 | lcgpobid | numeric | 10,0 | NO | NULL |
| 3 | lcgexpid | numeric | 5,0 | NO | NULL |
| 4 | lcgcptoid | numeric | 5,0 | NO | NULL |
| 5 | lcgttarid | numeric | 5,0 | NO | NULL |
| 6 | lcgpubid | numeric | 5,0 | NO | NULL |
| 7 | lcgantigue | numeric | 5,0 | NO | NULL |
| 8 | lcgcodine | numeric | 10,0 | NO | NULL |
| 9 | lcgnumcli | numeric | 10,0 | NO | NULL |
| 10 | lcgimpues | numeric | 10,2 | NO | NULL |
| 11 | lcgbaseimp | numeric | 10,2 | NO | NULL |

### liqcobmurcia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcmliqid | numeric | 5,0 | NO | NULL |
| 2 | lcmpobid | numeric | 10,0 | NO | NULL |
| 3 | lcmexpid | numeric | 5,0 | NO | NULL |
| 4 | lcmcptoid | numeric | 5,0 | NO | NULL |
| 5 | lcmttarid | numeric | 5,0 | NO | NULL |
| 6 | lcmpubid | numeric | 5,0 | NO | NULL |
| 7 | lcmscptoid | numeric | 5,0 | NO | NULL |
| 8 | lcmantiguedad | numeric | 5,0 | NO | NULL |
| 9 | lcmcodine | numeric | 10,0 | NO | NULL |
| 10 | lcmnumfac | numeric | 10,0 | NO | NULL |
| 11 | lcmimpues | numeric | 10,2 | NO | NULL |
| 12 | lcmbaseimp | numeric | 10,2 | NO | NULL |

### liqcobpobbalear

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcpbliqid | numeric | 5,0 | NO | NULL |
| 2 | lcpbpobid | numeric | 10,0 | NO | NULL |
| 3 | lcpbliqcuota | numeric | 12,2 | NO | 0 |
| 4 | lcpbliqcuotavar | numeric | 12,2 | NO | 0 |
| 5 | lcpbsaldocuota | numeric | 12,2 | NO | 0 |
| 6 | lcpbsaldocuotavar | numeric | 12,2 | NO | 0 |
| 7 | lcpbfactacum | numeric | 10,2 | NO | 0 |
| 8 | lcpbporcendudcob | numeric | 5,2 | YES | NULL |
| 9 | lcpbestimsaldudcob | numeric | 10,2 | NO | 0 |
| 10 | lcpbfacfijacum | numeric | 10,2 | NO | '0'::numeric |
| 11 | lcpbfacvaracum | numeric | 10,2 | NO | '0'::numeric |

### liqcobpostcat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcpcliqid | numeric | 5,0 | NO | NULL |
| 2 | lcpcsocemi | numeric | 10,0 | NO | NULL |
| 3 | lcpcpobid | numeric | 10,0 | NO | NULL |
| 4 | lcpcexpid | numeric | 5,0 | NO | NULL |
| 5 | lcpcejer | numeric | 5,0 | NO | NULL |
| 6 | lcpcimpocob | numeric | 10,2 | NO | NULL |
| 7 | lcpcimpucob | numeric | 10,2 | NO | NULL |
| 8 | lcpcimpoa91 | numeric | 10,2 | NO | NULL |
| 9 | lcpcimpua91 | numeric | 10,2 | NO | NULL |
| 10 | lcpcimpoa92 | numeric | 10,2 | NO | NULL |
| 11 | lcpcimpua92 | numeric | 10,2 | NO | NULL |

### liqcodentsum

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcessocprop | numeric | 10,0 | NO | NULL |
| 2 | lcessocliquid | numeric | 10,0 | NO | NULL |
| 3 | lcescodigo | numeric | 10,0 | YES | NULL |

### liqcodpob

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqcppobid | numeric | 10,0 | NO | NULL |
| 2 | lqcpcodigo | character varying | 15 | YES | NULL |
| 3 | lqcpsnpadron | character | 1 | NO | NULL |
| 4 | lqcpcodine | character varying | 4 | YES | NULL |

### liqcodred

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcrcodmuni | character varying | 6 | NO | NULL |
| 2 | lcrcodred | character varying | 6 | NO | NULL |
| 3 | lcrcodreddesc | character varying | 150 | YES | NULL |

### liqcompens

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcomliqid | numeric | 5,0 | NO | NULL |
| 2 | lcomfecini | date |  | NO | NULL |
| 3 | lcomfecfin | date |  | NO | NULL |
| 4 | lcomfinexp | numeric | 10,2 | NO | NULL |
| 5 | lcomliqneg | numeric | 10,2 | NO | NULL |
| 6 | lcomotros | numeric | 10,2 | NO | NULL |
| 7 | lcomotrtxt | character varying | 100 | YES | NULL |
| 8 | lcomsesid | numeric | 10,0 | NO | NULL |

### liqcompob

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lcopliqid | numeric | 5,0 | NO | NULL |
| 2 | lcoppobid | numeric | 10,0 | NO | NULL |
| 3 | lcopfinexp | numeric | 10,2 | NO | NULL |
| 4 | lcopliqneg | numeric | 10,2 | NO | NULL |
| 5 | lcopotros | numeric | 10,2 | NO | NULL |
| 6 | lcopotrtxt | character varying | 100 | YES | NULL |

### liqcuadmurcia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqcmliqid | numeric | 5,0 | NO | NULL |
| 2 | lqcmpobid | numeric | 10,0 | NO | NULL |
| 3 | lqcmexpid | numeric | 5,0 | NO | NULL |
| 4 | lqcmtotfac | numeric | 12,2 | NO | NULL |
| 5 | lqcmtotabo | numeric | 12,2 | NO | NULL |
| 6 | lqcmtotdeu | numeric | 12,2 | NO | NULL |
| 7 | lqcmtotliq | numeric | 12,2 | NO | NULL |

### liqdatfacgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldfgliqid | numeric | 5,0 | NO | NULL |
| 2 | ldfgexpid | numeric | 5,0 | NO | NULL |
| 3 | ldfgpobid | numeric | 10,0 | NO | NULL |
| 4 | ldfgcptoid | numeric | 5,0 | NO | NULL |
| 5 | ldfgatlid | numeric | 5,0 | NO | NULL |
| 6 | ldfgsujconc | character | 1 | NO | NULL |
| 7 | ldfgnumaboag | numeric | 10,0 | NO | NULL |
| 8 | ldfgnumabonoag | numeric | 10,0 | NO | NULL |
| 9 | ldfgnumaboprop | numeric | 10,0 | NO | NULL |

### liqdesglosetamer

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldtlitcod | numeric | 10,0 | NO | NULL |
| 2 | ldtanyo | numeric | 5,0 | NO | NULL |
| 3 | ldtperiid | numeric | 5,0 | NO | NULL |
| 4 | ldtpernumero | numeric | 5,0 | NO | NULL |
| 5 | ldtmotfact | numeric | 5,0 | NO | NULL |
| 6 | ldtoperacion | numeric | 5,0 | NO | NULL |
| 7 | ldtimporte | numeric | 18,2 | NO | NULL |

### liqdetanu

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqdanno | numeric | 5,0 | NO | NULL |
| 2 | lqdsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqdsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqdliqid | numeric | 5,0 | NO | NULL |
| 5 | lqdpobid | numeric | 10,0 | NO | NULL |
| 6 | lqdexpid | numeric | 5,0 | NO | NULL |
| 7 | lqdfacnfac | numeric | 10,0 | NO | NULL |
| 8 | lqdfaccant | double precision | 53 | NO | NULL |
| 9 | lqdfacimp | numeric | 10,2 | NO | NULL |
| 10 | lqdcobtot1 | numeric | 10,2 | NO | NULL |
| 11 | lqdcobtot2 | numeric | 10,2 | NO | NULL |
| 12 | lqdcobtot3 | numeric | 10,2 | NO | NULL |
| 13 | lqdsaldo | numeric | 10,2 | NO | NULL |
| 14 | lqdsaldoan | numeric | 10,2 | NO | NULL |
| 15 | lqdabo1 | numeric | 10,2 | NO | NULL |
| 16 | lqdabo2 | numeric | 10,2 | NO | NULL |
| 17 | lqdabo3 | numeric | 10,2 | NO | NULL |
| 18 | lqddeudaan | numeric | 10,2 | NO | NULL |

### liqdetanubalear

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldabanno | numeric | 5,0 | NO | NULL |
| 2 | ldabsocemi | numeric | 10,0 | NO | NULL |
| 3 | ldabsocprop | numeric | 10,0 | NO | NULL |
| 4 | ldabpobid | numeric | 10,0 | NO | NULL |
| 5 | ldabexpid | numeric | 5,0 | NO | NULL |
| 6 | ldabcuota | numeric | 12,2 | NO | NULL |
| 7 | ldabcuotavar | numeric | 12,2 | NO | NULL |
| 8 | ldabimpo | numeric | 12,2 | NO | NULL |

### liqdetanugalic

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqdganno | numeric | 5,0 | NO | NULL |
| 2 | lqdgsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqdgsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqdgpobid | numeric | 10,0 | NO | NULL |
| 5 | lqdgexpid | numeric | 5,0 | NO | NULL |
| 6 | lqdgcptoid | numeric | 5,0 | NO | NULL |
| 7 | lqdgttarid | numeric | 5,0 | NO | NULL |
| 8 | lqdgm3fac | double precision | 53 | NO | NULL |
| 9 | lqdgnumfac | numeric | 10,0 | NO | NULL |
| 10 | lqdgnumcli | numeric | 10,0 | NO | NULL |
| 11 | lqdgimpfac | numeric | 10,2 | NO | NULL |
| 12 | lqdgimpcobact | numeric | 10,2 | NO | NULL |
| 13 | lqdgimpcobant | numeric | 10,2 | NO | NULL |
| 14 | lqdgsaldact | numeric | 10,2 | NO | NULL |
| 15 | lqdgsaldant | numeric | 10,2 | NO | NULL |
| 16 | lqdgimpimp | numeric | 10,2 | NO | NULL |

### liqdetfacgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldetfgfacid | numeric | 10,0 | NO | NULL |
| 2 | ldetfgpriliqid | numeric | 5,0 | NO | NULL |
| 3 | ldetfgfecvenc | date |  | NO | NULL |
| 4 | ldetfgpobid | numeric | 10,0 | NO | NULL |
| 5 | ldetfgsnpad | character | 1 | NO | NULL |
| 6 | ldetfgtiprepe | numeric | 5,0 | YES | NULL |
| 7 | ldetfgtipimpa | numeric | 5,0 | YES | NULL |
| 8 | ldetfgidcomprpg | numeric | 10,0 | YES | NULL |
| 9 | ldetfgidconacre | numeric | 10,0 | YES | NULL |
| 10 | ldetfgdefliqid | numeric | 5,0 | YES | NULL |

### liqdetpobbalear

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldpbanno | numeric | 5,0 | NO | NULL |
| 2 | ldpbsocemi | numeric | 10,0 | NO | NULL |
| 3 | ldpbsocprop | numeric | 10,0 | NO | NULL |
| 4 | ldpbpobid | numeric | 10,0 | NO | NULL |
| 5 | ldpbdudcobro | numeric | 10,2 | NO | 0 |
| 6 | ldpbcobradoant | numeric | 10,2 | NO | 0 |
| 7 | ldpbliqcuota | numeric | 10,2 | NO | 0 |
| 8 | ldpbliqcuotavar | numeric | 10,2 | NO | 0 |
| 9 | ldpbsaldocuota | numeric | 10,2 | NO | 0 |
| 10 | ldpbsaldocuotavar | numeric | 10,2 | NO | 0 |

### liqdetvolcat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldvcanno | numeric | 5,0 | NO | NULL |
| 2 | ldvcmes | numeric | 5,0 | NO | NULL |
| 3 | ldvcsocliq | numeric | 10,0 | NO | NULL |
| 4 | ldvcsocprop | numeric | 10,0 | NO | NULL |
| 5 | ldvcpobid | numeric | 10,0 | NO | NULL |
| 6 | ldvcexpid | numeric | 5,0 | NO | NULL |
| 7 | ldvcvar | character varying | 5 | NO | NULL |
| 8 | ldvcvlavar | double precision | 53 | NO | NULL |

### liqdmcpobex

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldpobid | numeric | 10,0 | NO | NULL |
| 2 | ldexpid | numeric | 5,0 | NO | NULL |
| 3 | ldfechaini | date |  | NO | NULL |
| 4 | ldfechafin | date |  | YES | NULL |

### liqdomand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldaliqid | numeric | 5,0 | NO | NULL |
| 2 | ldapobid | numeric | 10,0 | NO | NULL |
| 3 | ldaexpid | numeric | 5,0 | NO | NULL |
| 4 | ldatiptid | numeric | 5,0 | NO | NULL |
| 5 | ldafecapl | date |  | NO | NULL |
| 6 | ldaprepro1 | double precision | 53 | NO | NULL |
| 7 | ldaprepro2 | double precision | 53 | NO | NULL |
| 8 | ldaprepro3 | double precision | 53 | NO | NULL |
| 9 | ldacuota | numeric | 10,2 | NO | NULL |
| 10 | ldacantex | double precision | 53 | NO | NULL |
| 11 | ldaimpo1 | numeric | 10,2 | NO | NULL |
| 12 | ldacant1 | double precision | 53 | NO | NULL |
| 13 | ldaimpo2 | numeric | 10,2 | NO | NULL |
| 14 | ldacant2 | double precision | 53 | NO | NULL |
| 15 | ldaimpo3 | numeric | 10,2 | NO | NULL |
| 16 | ldacant3 | double precision | 53 | NO | NULL |
| 17 | ldasnpropio | character | 1 | NO | 'N'::bpchar |
| 18 | ldam3sinabast | double precision | 53 | NO | 0 |
| 19 | ldaprepfugas | double precision | 53 | NO | 0 |
| 20 | ldaimpofugas | numeric | 10,2 | NO | 0 |
| 21 | ldacantfugas | double precision | 53 | NO | 0 |
| 22 | ldatipfac | numeric | 5,0 | NO | '0'::numeric |
| 23 | ldaliqfacori | numeric | 5,0 | NO | '0'::numeric |
| 24 | ldasnant2025 | character | 1 | NO | 'S'::bpchar |

### liqdsimurcia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqdmliqid | numeric | 5,0 | NO | NULL |
| 2 | lqdmanno | numeric | 5,0 | NO | NULL |
| 3 | lqdmsocemi | numeric | 10,0 | NO | NULL |
| 4 | lqdmsocprop | numeric | 10,0 | NO | NULL |
| 5 | lqdmpobid | numeric | 10,0 | NO | NULL |
| 6 | lqdmexpid | numeric | 5,0 | NO | NULL |
| 7 | lqdmcptoid | numeric | 5,0 | NO | NULL |
| 8 | lqdmttarid | numeric | 5,0 | NO | NULL |
| 9 | lqdmsaldpend | numeric | 10,2 | NO | NULL |
| 10 | lqdmimpanu | numeric | 10,2 | NO | NULL |
| 11 | lqdmimptot | numeric | 10,2 | NO | NULL |
| 12 | lqdmimpimp | numeric | 10,2 | NO | NULL |

### liqdtanumurcia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ltamanno | numeric | 5,0 | NO | NULL |
| 2 | ltamsocemi | numeric | 10,0 | NO | NULL |
| 3 | ltamsocprop | numeric | 10,0 | NO | NULL |
| 4 | ltampobid | numeric | 10,0 | NO | NULL |
| 5 | ltamm3sum | numeric | 10,0 | YES | NULL |
| 6 | ltamm3reg | numeric | 10,0 | YES | NULL |

### liqexcexpcat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | leecexpid | numeric | 5,0 | NO | NULL |
| 2 | leecanyo | numeric | 5,0 | NO | NULL |
| 3 | leecpobid | numeric | 10,0 | NO | NULL |

### liqexcjustdmccat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lejcliqid | numeric | 5,0 | NO | NULL |
| 2 | lejcfacid | numeric | 10,0 | NO | NULL |

### liqexenextr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | leeliqid | numeric | 5,0 | NO | NULL |
| 2 | leepobid | numeric | 10,0 | NO | NULL |
| 3 | leeexpid | numeric | 5,0 | NO | NULL |
| 4 | leeusoex | numeric | 5,0 | YES | NULL |
| 5 | leevolcons | double precision | 53 | NO | NULL |
| 6 | leevarex | numeric | 5,0 | YES | NULL |

### liqexpedrecobro

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | liqexrcid | numeric | 10,0 | NO | NULL |
| 2 | liqexrcusuid | character varying | 10 | NO | NULL |
| 3 | liqexrcfecha | date |  | NO | NULL |
| 4 | liqexrcimporte | numeric | 10,2 | NO | NULL |
| 5 | liqexrcimpsoc | numeric | 10,2 | NO | NULL |
| 6 | liqexrcimpgest | numeric | 10,2 | NO | NULL |
| 7 | liqexrcimpcob | numeric | 10,2 | NO | NULL |
| 8 | liqexrcimpsuj | numeric | 10,2 | NO | NULL |
| 9 | liqexrcliqcp | character | 1 | NO | NULL |
| 10 | liqexrctipcom | numeric | 5,0 | NO | NULL |
| 11 | liqexrcimpcom | numeric | 10,2 | NO | NULL |
| 12 | liqexrcimpcom1 | numeric | 10,2 | YES | NULL |
| 13 | liqexrcimpcom2 | numeric | 10,2 | YES | NULL |
| 14 | liqexrcimpcom3 | numeric | 10,2 | YES | NULL |
| 15 | liqexrcimpcom4 | numeric | 10,2 | YES | NULL |
| 16 | liqexrcimpcom5 | numeric | 10,2 | YES | NULL |
| 17 | liqexrcimpcom6 | numeric | 10,2 | YES | NULL |

### liqfac1anucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lf1csocliqemi | numeric | 10,0 | NO | NULL |
| 2 | lf1csocprop | numeric | 10,0 | NO | NULL |
| 3 | lf1cpobid | numeric | 10,0 | NO | NULL |
| 4 | lf1cexpid | numeric | 5,0 | NO | NULL |
| 5 | lf1csocemi | numeric | 10,0 | NO | NULL |
| 6 | lf1cimpbase | numeric | 10,2 | NO | NULL |
| 7 | lf1cimpiva | numeric | 10,2 | NO | NULL |
| 8 | lf1cfeclecini | date |  | NO | NULL |
| 9 | lf1cfeclecfin | date |  | NO | NULL |
| 10 | lf1cfecini | date |  | NO | NULL |
| 11 | lf1cfecfin | date |  | NO | NULL |
| 12 | lf1csocliqprop | numeric | 10,0 | NO | NULL |

### liqfac2anucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lf2csocliqemi | numeric | 10,0 | NO | NULL |
| 2 | lf2csocprop | numeric | 10,0 | NO | NULL |
| 3 | lf2cpobid | numeric | 10,0 | NO | NULL |
| 4 | lf2cexpid | numeric | 5,0 | NO | NULL |
| 5 | lf2ccptoid | numeric | 5,0 | NO | NULL |
| 6 | lf2cttarid | numeric | 5,0 | NO | NULL |
| 7 | lf2cperiid | numeric | 5,0 | NO | NULL |
| 8 | lf2catlid | numeric | 5,0 | NO | NULL |
| 9 | lf2csocemi | numeric | 10,0 | NO | NULL |
| 10 | lf2cnumfac | numeric | 10,0 | NO | NULL |
| 11 | lf2cm3cons | double precision | 53 | NO | NULL |
| 12 | lf2cfecini | date |  | NO | NULL |
| 13 | lf2cfecfin | date |  | NO | NULL |
| 14 | lf2csnfuga | character | 1 | NO | 'N'::bpchar |
| 15 | lf2csocliqprop | numeric | 10,0 | NO | NULL |

### liqfac3anucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lf3csocliqemi | numeric | 10,0 | NO | NULL |
| 2 | lf3csocprop | numeric | 10,0 | NO | NULL |
| 3 | lf3cpobid | numeric | 10,0 | NO | NULL |
| 4 | lf3cexpid | numeric | 5,0 | NO | NULL |
| 5 | lf3ccptoid | numeric | 5,0 | NO | NULL |
| 6 | lf3cttarid | numeric | 5,0 | NO | NULL |
| 7 | lf3cfecapl | date |  | NO | NULL |
| 8 | lf3csubcid | numeric | 5,0 | NO | NULL |
| 9 | lf3catlid | numeric | 5,0 | NO | NULL |
| 10 | lf3cidsubconc | numeric | 5,0 | NO | NULL |
| 11 | lf3ctralim | numeric | 10,0 | NO | NULL |
| 12 | lf3cntramo | numeric | 5,0 | NO | NULL |
| 13 | lf3cnumhab | numeric | 5,0 | NO | NULL |
| 14 | lf3csocemi | numeric | 10,0 | NO | NULL |
| 15 | lf3ccant | double precision | 53 | NO | NULL |
| 16 | lf3cimpo | numeric | 10,2 | NO | NULL |
| 17 | lf3cfeclecini | date |  | NO | NULL |
| 18 | lf3cfeclecfin | date |  | NO | NULL |
| 19 | lf3cfecini | date |  | NO | NULL |
| 20 | lf3cfecfin | date |  | NO | NULL |
| 21 | lf3csnbonif | character | 1 | NO | 'N'::bpchar |
| 22 | lf3csocliqprop | numeric | 10,0 | NO | NULL |
| 23 | lf3csnanu | character | 1 | NO | 'N'::bpchar |
| 24 | lf3csnfuga | character | 1 | NO | 'N'::bpchar |

### liqfac4anucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lf4csocliqemi | numeric | 10,0 | NO | NULL |
| 2 | lf4csocprop | numeric | 10,0 | NO | NULL |
| 3 | lf4cpobid | numeric | 10,0 | NO | NULL |
| 4 | lf4cexpid | numeric | 5,0 | NO | NULL |
| 5 | lf4ccptoid | numeric | 5,0 | NO | NULL |
| 6 | lf4cttarid | numeric | 5,0 | NO | NULL |
| 7 | lf4catlid | numeric | 5,0 | NO | NULL |
| 8 | lf4cnumhab | numeric | 5,0 | NO | NULL |
| 9 | lf4ctsumid | numeric | 5,0 | NO | NULL |
| 10 | lf4ctsnconcom | character | 1 | NO | NULL |
| 11 | lf4csnptoprinc | character | 1 | NO | NULL |
| 12 | lf4csocemi | numeric | 10,0 | NO | NULL |
| 13 | lf4cnumcontr | numeric | 10,0 | NO | NULL |
| 14 | lf4cfecini | date |  | NO | NULL |
| 15 | lf4cfecfin | date |  | NO | NULL |
| 16 | lf4csnbonif | character | 1 | NO | 'N'::bpchar |
| 17 | lf4csocliqprop | numeric | 10,0 | NO | NULL |

### liqfac5anucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lf5csocliqemi | numeric | 10,0 | NO | NULL |
| 2 | lf5csocprop | numeric | 10,0 | NO | NULL |
| 3 | lf5cpobid | numeric | 10,0 | NO | NULL |
| 4 | lf5cexpid | numeric | 5,0 | NO | NULL |
| 5 | lf5ccptoid | numeric | 5,0 | NO | NULL |
| 6 | lf5cttarid | numeric | 5,0 | NO | NULL |
| 7 | lf5csncanon | character | 1 | NO | NULL |
| 8 | lf5csocemi | numeric | 10,0 | NO | NULL |
| 9 | lf5cnumabo | numeric | 10,0 | NO | NULL |
| 10 | lf5cm3fac | double precision | 53 | NO | NULL |
| 11 | lf5cfecini | date |  | NO | NULL |
| 12 | lf5cfecfin | date |  | NO | NULL |
| 13 | lf5csocliqprop | numeric | 10,0 | NO | NULL |

### liqfac6anucat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lf6cfecini | date |  | NO | NULL |
| 2 | lf6cfecfin | date |  | NO | NULL |
| 3 | lf6csocliqemi | numeric | 10,0 | NO | NULL |
| 4 | lf6csocliqprop | numeric | 10,0 | NO | NULL |
| 5 | lf6cpobid | numeric | 10,0 | NO | NULL |
| 6 | lf6cexpid | numeric | 5,0 | NO | NULL |
| 7 | lf6csocemi | numeric | 10,0 | NO | NULL |
| 8 | lf6csocprop | numeric | 10,0 | NO | NULL |
| 9 | lf6canuant | character | 1 | NO | NULL |
| 10 | lf6cnumfacanu | numeric | 10,0 | NO | NULL |
| 11 | lf6cm3consanu | double precision | 53 | NO | NULL |
| 12 | lf6cm3facanu | double precision | 53 | NO | NULL |
| 13 | lf6cimpanu | numeric | 10,2 | NO | NULL |

### liqfacanumurc

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqfmanno | numeric | 5,0 | NO | NULL |
| 2 | lqfmsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqfmsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqfmpobid | numeric | 10,0 | NO | NULL |
| 5 | lqfmexpid | numeric | 5,0 | NO | NULL |
| 6 | lqfmcptoid | numeric | 5,0 | NO | NULL |
| 7 | lqfmttarid | numeric | 5,0 | NO | NULL |
| 8 | lqfmm3cons | double precision | 53 | NO | NULL |
| 9 | lqfmnumfac | numeric | 10,0 | NO | NULL |
| 10 | lqfnnumcli | numeric | 10,0 | NO | NULL |
| 11 | lqfmimpag | numeric | 10,2 | NO | NULL |
| 12 | lqfmimpcs | numeric | 10,2 | NO | NULL |
| 13 | lqfmimpcc | numeric | 10,2 | NO | NULL |

### liqfaccat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfcliqid | numeric | 5,0 | NO | NULL |
| 2 | lfcsocemi | numeric | 10,0 | NO | NULL |
| 3 | lfcpobid | numeric | 10,0 | NO | NULL |
| 4 | lfcexpid | numeric | 5,0 | NO | NULL |
| 5 | lfcperinicon | character | 6 | YES | NULL |
| 6 | lfcperfincon | character | 6 | YES | NULL |
| 7 | lfcimpnettot | numeric | 10,2 | YES | NULL |
| 8 | lfcimpivatot | numeric | 10,2 | YES | NULL |
| 9 | lfcimptotbaj | numeric | 10,2 | YES | NULL |
| 10 | lfcvolconsdom | double precision | 53 | YES | NULL |
| 11 | lfcvolconsind | double precision | 53 | YES | NULL |
| 12 | lfcvolfacdom | double precision | 53 | YES | NULL |
| 13 | lfcvolfacind | double precision | 53 | YES | NULL |
| 14 | lfcvolfacdomt1 | double precision | 53 | YES | NULL |
| 15 | lfcvolfacdomt2 | double precision | 53 | YES | NULL |
| 16 | lfcvolfacdomt3 | double precision | 53 | YES | NULL |

### liqfaccatagua

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | liqcatsocliq | numeric | 10,0 | NO | NULL |
| 2 | liqcatsocprop | numeric | 10,0 | NO | NULL |
| 3 | liqcatdescsoc | character varying | 255 | YES | NULL::character varying |
| 4 | liqcattfact | character varying | 100 | YES | NULL::character varying |
| 5 | liqcatnommunv | character varying | 100 | YES | NULL::character varying |
| 6 | liqcatcodinev | character varying | 20 | YES | NULL::character varying |
| 7 | liqcatnumfact | character varying | 20 | YES | NULL::character varying |
| 8 | liqcatffact | date |  | YES | NULL |
| 9 | liqcatnifclte | character varying | 10 | YES | NULL::character varying |
| 10 | liqcatnomclte | character varying | 255 | YES | NULL::character varying |
| 11 | liqcatcodvia | character varying | 10 | YES | NULL::character varying |
| 12 | liqcatnomcalle | character varying | 100 | YES | NULL::character varying |
| 13 | liqcatnumfinca | character varying | 5 | YES | NULL::character varying |
| 14 | liqcatplanta | character varying | 5 | YES | NULL::character varying |
| 15 | liqcatpuerta | character varying | 5 | YES | NULL::character varying |
| 16 | liqcatescal | character varying | 5 | YES | NULL::character varying |
| 17 | liqcatcodpost | character varying | 5 | YES | NULL::character varying |
| 18 | liqcatpobnom | character varying | 100 | YES | NULL::character varying |
| 19 | liqcatdescptoserv | character varying | 100 | YES | NULL::character varying |
| 20 | liqcatnommunc | character varying | 100 | YES | NULL::character varying |
| 21 | liqcatcodinec | character varying | 20 | YES | NULL::character varying |
| 22 | liqcatnumcontr | numeric | 10,0 | YES | NULL::numeric |
| 23 | liqcatnumconts | numeric | 1,0 | YES | NULL::numeric |
| 24 | liqcatfiniconsum | date |  | YES | NULL |
| 25 | liqcatffinconsum | date |  | YES | NULL |
| 26 | liqcatm3consum | numeric | 10,0 | YES | NULL::numeric |
| 27 | liqcatm3facturados | numeric | 10,0 | YES | NULL::numeric |
| 28 | liqcatnumcuotas | numeric | 3,0 | YES | NULL::numeric |
| 29 | liqcatdesccpto | character varying | 255 | YES | NULL::character varying |
| 30 | liqcatimpfijo | numeric | 10,5 | YES | NULL::numeric |
| 31 | liqcatimpcuotfija | numeric | 10,5 | YES | NULL::numeric |
| 32 | liqcatm3tramo1 | numeric | 10,0 | YES | NULL::numeric |
| 33 | liqcattartramo1 | numeric | 10,5 | YES | NULL::numeric |
| 34 | liqcatimptramo1 | numeric | 10,5 | YES | NULL::numeric |
| 35 | liqcatm3tramo2 | numeric | 10,0 | YES | NULL::numeric |
| 36 | liqcattartramo2 | numeric | 10,5 | YES | NULL::numeric |
| 37 | liqcatimptramo2 | numeric | 10,5 | YES | NULL::numeric |
| 38 | liqcatm3tramo3 | numeric | 10,0 | YES | NULL::numeric |
| 39 | liqcattartramo3 | numeric | 10,5 | YES | NULL::numeric |
| 40 | liqcatimptramo3 | numeric | 10,5 | YES | NULL::numeric |
| 41 | liqcatimpiva | numeric | 10,5 | YES | NULL::numeric |
| 42 | liqcatimpfactotal | numeric | 10,5 | YES | NULL::numeric |
| 43 | liqcatnumfacanu | character varying | 20 | YES | NULL::character varying |
| 44 | liqcatfemifacanu | date |  | YES | NULL |
| 45 | liqcatnumcont | character varying | 20 | YES | NULL::character varying |
| 46 | liqcatlecant | numeric | 10,0 | YES | NULL::numeric |
| 47 | liqcatflecant | date |  | YES | NULL |
| 48 | liqcatlecact | numeric | 10,0 | YES | NULL::numeric |
| 49 | liqcatflecact | date |  | YES | NULL |
| 50 | liqcatconsum | numeric | 10,0 | YES | NULL::numeric |
| 51 | liqcatconsumdesc | numeric | 10,0 | YES | NULL::numeric |
| 52 | liqcatconsumtotal | numeric | 10,0 | YES | NULL::numeric |

### liqfacfug

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfffacid | numeric | 10,0 | NO | NULL |
| 2 | lffliqid | numeric | 5,0 | NO | NULL |

### liqfacpropgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfacprpgfacid | numeric | 10,0 | NO | NULL |
| 2 | lfacprpgliqid | numeric | 5,0 | NO | NULL |
| 3 | lfacprpgpobid | numeric | 10,0 | NO | NULL |

### liqfacrectamer

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lrtlitcod | numeric |  | NO | NULL |
| 2 | lrtexpid | numeric |  | NO | NULL |
| 3 | lrtcliid | numeric |  | NO | NULL |
| 4 | lrtfacid | numeric |  | NO | NULL |
| 5 | lrtimporte | numeric | 12,2 | NO | NULL |
| 6 | lrtfecdesc | date |  | NO | NULL |
| 7 | lrtfecrec | date |  | NO | NULL |
| 8 | lrtfeccobro | date |  | NO | NULL |

### liqfactot

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lftliqid | numeric | 5,0 | NO | NULL |
| 2 | lftpobid | numeric | 10,0 | NO | NULL |
| 3 | lftexpid | numeric | 5,0 | NO | NULL |
| 4 | lftperiid | numeric | 5,0 | NO | NULL |
| 5 | lftnfac | numeric | 10,0 | NO | NULL |
| 6 | lftcons | double precision | 53 | NO | NULL |
| 7 | lftimpo | numeric | 10,2 | NO | NULL |
| 8 | lftnfacabo | numeric | 10,0 | NO | NULL |
| 9 | lftconsabo | double precision | 53 | NO | NULL |
| 10 | lftimpoabo | numeric | 10,2 | NO | NULL |

### liqfactu

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lifliqid | numeric | 5,0 | NO | NULL |
| 2 | lifpobid | numeric | 10,0 | NO | NULL |
| 3 | lifexpid | numeric | 5,0 | NO | NULL |
| 4 | lifcptoid | numeric | 5,0 | NO | NULL |
| 5 | lifttarid | numeric | 5,0 | NO | NULL |
| 6 | liffecapl | date |  | NO | NULL |
| 7 | lifsubcid | numeric | 5,0 | NO | NULL |
| 8 | lifperiid | numeric | 5,0 | NO | NULL |
| 9 | lifcalimm | numeric | 5,0 | NO | NULL |
| 10 | lifsncoefc | character | 1 | NO | NULL |
| 11 | lifnumfact | numeric | 10,0 | NO | NULL |
| 12 | lifcantida | double precision | 53 | NO | NULL |
| 13 | lifbaseimp | numeric | 12,2 | NO | NULL |

### liqgalopfecalt

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lgoffaocgid | numeric | 10,0 | NO | NULL |
| 2 | lgoffafacid | numeric | 10,0 | NO | NULL |
| 3 | lgoffafeccob | timestamp without time zone |  | YES | NULL |
| 4 | lgoffafecalt | timestamp without time zone |  | YES | NULL |
| 5 | lgoffaopedev | numeric | 10,0 | YES | NULL |
| 6 | lgoffafecdev | timestamp without time zone |  | YES | NULL |

### liqimpfacgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lifgliqid | numeric | 5,0 | NO | NULL |
| 2 | lifgexpid | numeric | 5,0 | NO | NULL |
| 3 | lifgpobid | numeric | 10,0 | NO | NULL |
| 4 | lifgcptoid | numeric | 5,0 | NO | NULL |
| 5 | lifgatlid | numeric | 5,0 | NO | NULL |
| 6 | lifgtipimpa | numeric | 5,0 | NO | NULL |
| 7 | lifgnumfac | numeric | 10,0 | NO | NULL |
| 8 | lifgm3fac | double precision | 53 | NO | NULL |
| 9 | lifgimpcuofij | double precision | 53 | NO | NULL |
| 10 | lifgimpcuovar | double precision | 53 | NO | NULL |

### liqimportdmccat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | limcliqid | numeric | 5,0 | NO | NULL |
| 2 | limcpobid | numeric | 10,0 | NO | NULL |
| 3 | limcsocemi | numeric | 10,0 | NO | NULL |
| 4 | limcarrensn | character | 1 | NO | NULL |
| 5 | limcmes | numeric | 5,0 | NO | NULL |
| 6 | limcanyo | numeric | 5,0 | NO | NULL |
| 7 | limcimpfac | numeric | 10,2 | NO | NULL |
| 8 | limcimprep | numeric | 10,2 | NO | NULL |
| 9 | limcsalapl | numeric | 10,2 | YES | NULL |
| 10 | limcsalpen | numeric | 10,2 | YES | NULL |
| 11 | limcsocprop | numeric | 10,0 | NO | NULL |
| 12 | limcimpjust | numeric | 10,2 | YES | NULL |

### liqjimurcia

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ljimliqid | numeric | 5,0 | NO | NULL |
| 2 | ljimpobid | numeric | 10,0 | NO | NULL |
| 3 | ljimagrutar | numeric | 5,0 | NO | NULL |
| 4 | ljimnumfac | numeric | 10,0 | NO | NULL |
| 5 | ljimimporte | numeric | 10,2 | NO | NULL |

### liqjustdmccat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ljucfacid | numeric | 10,0 | NO | NULL |
| 2 | ljucliqid | numeric | 5,0 | NO | NULL |
| 3 | ljucsup | character varying | 2 | YES | NULL |
| 4 | ljucliqsup | numeric | 5,0 | YES | NULL |
| 5 | ljucliqfinal | numeric | 5,0 | YES | NULL |

### liqliqanumurc

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqlmanno | numeric | 5,0 | NO | NULL |
| 2 | lqlmsocemi | numeric | 10,0 | NO | NULL |
| 3 | lqlmsocprop | numeric | 10,0 | NO | NULL |
| 4 | lqlmpobid | numeric | 10,0 | NO | NULL |
| 5 | lqlmexpid | numeric | 5,0 | NO | NULL |
| 6 | lqlmcptoid | numeric | 5,0 | NO | NULL |
| 7 | lqlmttarid | numeric | 5,0 | NO | NULL |
| 8 | lqlmimpcs | numeric | 10,2 | NO | NULL |
| 9 | lqlmimpcc | numeric | 10,2 | NO | NULL |
| 10 | lqlmimpimp | numeric | 10,2 | NO | NULL |
| 11 | lqlmimpfacnliq | numeric | 10,2 | NO | NULL |

### liqnodomand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lndaliqid | numeric | 5,0 | NO | NULL |
| 2 | lndapobid | numeric | 10,0 | NO | NULL |
| 3 | lndaexpid | numeric | 5,0 | NO | NULL |
| 4 | lndaprepro | double precision | 53 | NO | NULL |
| 5 | lndacant | double precision | 53 | NO | NULL |
| 6 | lndaimpo | numeric | 10,2 | NO | NULL |
| 7 | lndasnpropio | character | 1 | NO | 'N'::bpchar |
| 8 | lndam3sinabast | double precision | 53 | NO | 0 |
| 9 | lndatipfac | numeric | 5,0 | NO | '0'::numeric |
| 10 | lndaliqfacori | numeric | 5,0 | NO | '0'::numeric |
| 11 | lndasnant2025 | character | 1 | NO | 'S'::bpchar |

### liqperbontamer

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lbtlitcod | numeric | 10,0 | NO | NULL |
| 2 | lbtanno | numeric | 5,0 | NO | NULL |
| 3 | lbtperiid | numeric | 5,0 | NO | NULL |
| 4 | lbtpernumero | numeric | 5,0 | NO | NULL |
| 5 | lbtsnliqact | character | 1 | NO | NULL |
| 6 | lbtsaldoant | numeric | 12,2 | NO | NULL |
| 7 | lbtimpfact | numeric | 12,2 | NO | NULL |
| 8 | lbtimpanul | numeric | 12,2 | NO | NULL |
| 9 | lbtimpcobra | numeric | 12,2 | NO | NULL |
| 10 | lbtimpdescarga | numeric | 12,2 | NO | NULL |
| 11 | lbtimprecarga | numeric | 12,2 | NO | NULL |
| 12 | lbtsaldopend | numeric | 12,2 | NO | NULL |
| 13 | lbtcompsaldo | numeric | 12,2 | NO | NULL |
| 14 | lbtimpdescuadre | numeric | 12,2 | NO | NULL |

### liqperdbontamer

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ldbtlitcod | numeric | 10,0 | NO | NULL |
| 2 | ldbexpdescri | character varying | 70 | YES | NULL |
| 3 | ldbfacid | numeric | 10,0 | NO | NULL |
| 4 | ldbfaccnttnum | numeric | 10,0 | YES | NULL |
| 5 | ldbfacnumfac | character | 18 | YES | NULL |
| 6 | ldbprsnomcpto | character varying | 122 | YES | NULL |
| 7 | ldbfacfecfact | date |  | YES | NULL |
| 8 | ldbpocperiodi | numeric | 5,0 | YES | NULL |
| 9 | ldbconcepto | character varying | 1000 | YES | NULL |
| 10 | ldbdirtexto | character varying | 110 | YES | NULL |
| 11 | ldbimporte | numeric | 10,2 | YES | NULL |
| 12 | ldbfacfecfact2 | date |  | YES | NULL |
| 13 | ldbtarifa | character varying | 1000 | YES | NULL |
| 14 | ldbtipo | numeric | 5,0 | NO | NULL |

### liqperextr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lpeliqid | numeric | 5,0 | NO | NULL |
| 2 | lpepobid | numeric | 10,0 | NO | NULL |
| 3 | lpeexpid | numeric | 5,0 | NO | NULL |
| 4 | lpeatlid | numeric | 5,0 | NO | NULL |
| 5 | lpesnpropio | character | 1 | NO | NULL |
| 6 | lpeperiact | character | 1 | NO | NULL |
| 7 | lpetipodato | numeric | 5,0 | NO | NULL |
| 8 | lpecuota | numeric | 10,2 | NO | NULL |
| 9 | lpeconsumo | numeric | 10,2 | NO | NULL |

### liqperfactamer

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lftlitcod | numeric |  | YES | NULL |
| 2 | lftfacid | numeric |  | YES | NULL |
| 3 | lftlinfacnlin | numeric |  | YES | NULL |
| 4 | lftfacexpid | numeric |  | YES | NULL |
| 5 | lftact | character |  | YES | NULL |

### liqpertamer

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lptlitcod | numeric | 10,0 | NO | NULL |
| 2 | lptanno | numeric | 5,0 | NO | NULL |
| 3 | lptperiid | numeric | 5,0 | NO | NULL |
| 4 | lptpernumero | numeric | 5,0 | NO | NULL |
| 5 | lptlbtcodigo | numeric | 10,0 | NO | NULL |
| 6 | lptsnliqact | character | 1 | NO | NULL |
| 7 | lptsaldoant | numeric | 12,2 | NO | NULL |
| 8 | lptnumcontr | numeric | 10,0 | NO | NULL |
| 9 | lptimpfact | numeric | 12,2 | NO | NULL |
| 10 | lptimpanul | numeric | 12,2 | NO | NULL |
| 11 | lptimprefact | numeric | 12,2 | NO | NULL |
| 12 | lptimpcobra | numeric | 12,2 | NO | NULL |
| 13 | lptsaldopend | numeric | 12,2 | NO | NULL |
| 14 | lptimpdescarga | numeric | 12,2 | NO | NULL |
| 15 | lptimprecarga | numeric | 12,2 | NO | NULL |
| 16 | lptimpautocuad | numeric | 12,2 | NO | NULL |

### liqpobfacdmccat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lpfcidfact | numeric | 10,0 | NO | NULL |
| 2 | lpfcidpobl | numeric | 10,0 | NO | NULL |
| 3 | lpfcidftbe | numeric | 10,0 | NO | NULL |
| 4 | lpfcidliqd | numeric | 5,0 | NO | NULL |

### liqregabaterand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lraaanno | numeric | 5,0 | NO | NULL |
| 2 | lraasocliq | numeric | 10,0 | NO | NULL |
| 3 | lraanif | character varying | 9 | NO | NULL |
| 4 | lraarazsoc | character varying | 125 | NO | NULL |
| 5 | lraavolab | double precision | 53 | NO | NULL |

### liqregcaproand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lrcaanno | numeric | 5,0 | NO | NULL |
| 2 | lrcasocliq | numeric | 10,0 | NO | NULL |
| 3 | lrcadescrip | character varying | 200 | NO | NULL |
| 4 | lrcacodconc | character varying | 25 | YES | NULL |
| 5 | lrcavolcap | double precision | 53 | NO | NULL |

### liqregclocand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lrlaanno | numeric | 5,0 | NO | NULL |
| 2 | lrlasocliq | numeric | 10,0 | NO | NULL |
| 3 | lrlaidcanon | character varying | 50 | NO | NULL |
| 4 | lrlaimpdeduc | numeric | 12,2 | NO | NULL |

### liqreginiand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lriaanno | numeric | 5,0 | NO | NULL |
| 2 | lriasocliq | numeric | 10,0 | NO | NULL |
| 3 | lriaindtarif | character | 1 | NO | 'N'::bpchar |
| 4 | lriafeciniper1 | date |  | NO | NULL |
| 5 | lriafecfinper1 | date |  | NO | NULL |
| 6 | lriaprectr1per1 | double precision | 53 | NO | NULL |
| 7 | lriaprectr2per1 | double precision | 53 | NO | NULL |
| 8 | lriaprectr3per1 | double precision | 53 | NO | NULL |
| 9 | lriaprecndomper1 | double precision | 53 | NO | NULL |
| 10 | lriaprecperdper1 | double precision | 53 | NO | NULL |
| 11 | lriafeciniper2 | date |  | YES | NULL |
| 12 | lriafecfinper2 | date |  | YES | NULL |
| 13 | lriaprectr1per2 | double precision | 53 | YES | NULL |
| 14 | lriaprectr2per2 | double precision | 53 | YES | NULL |
| 15 | lriaprectr3per2 | double precision | 53 | YES | NULL |
| 16 | lriaprecndomper2 | double precision | 53 | YES | NULL |
| 17 | lriaprecperdper2 | double precision | 53 | YES | NULL |
| 18 | lriapretartraex | double precision | 53 | YES | NULL |

### liqregsumterand

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lrsaanno | numeric | 5,0 | NO | NULL |
| 2 | lrsasocliq | numeric | 10,0 | NO | NULL |
| 3 | lrsanif | character varying | 9 | NO | NULL |
| 4 | lrsarazsoc | character varying | 125 | NO | NULL |
| 5 | lrsavolab | double precision | 53 | NO | NULL |

### liqrepfacgali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lrfgliqid | numeric | 5,0 | NO | NULL |
| 2 | lrfgexpid | numeric | 5,0 | NO | NULL |
| 3 | lrfgpobid | numeric | 10,0 | NO | NULL |
| 4 | lrfgcptoid | numeric | 5,0 | NO | NULL |
| 5 | lrfgatlid | numeric | 5,0 | NO | NULL |
| 6 | lrfgtiprepe | numeric | 5,0 | NO | NULL |
| 7 | lrfgnumfac | numeric | 10,0 | NO | NULL |
| 8 | lrfgm3fac | double precision | 53 | NO | NULL |
| 9 | lrfgimpcuofij | double precision | 53 | NO | NULL |
| 10 | lrfgimpcuovar | double precision | 53 | NO | NULL |

### liqsocpro

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lsptliqid | numeric | 5,0 | NO | NULL |
| 2 | lspsocprop | numeric | 10,0 | NO | NULL |

### liqtarifmd101

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lqttiptid | numeric | 5,0 | NO | NULL |
| 2 | lqttipreg | numeric | 5,0 | NO | NULL |
| 3 | lqtsnfijoreg | character | 1 | NO | NULL |
| 4 | lqthstusu | character varying | 10 | NO | NULL |
| 5 | lqthsthora | timestamp without time zone |  | NO | NULL |

### liqtipotamer

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | litcod | numeric | 10,0 | NO | NULL |
| 2 | litsocemi | numeric | 10,0 | NO | NULL |
| 3 | litsocprop | numeric | 10,0 | NO | NULL |
| 4 | litpobid | numeric | 10,0 | NO | NULL |
| 5 | litfecdesde | date |  | NO | NULL |
| 6 | litfechasta | date |  | NO | NULL |
| 7 | litfecliq | date |  | NO | NULL |
| 8 | litestado | numeric | 5,0 | NO | NULL |
| 9 | litimppremio | numeric | 10,2 | YES | NULL |
| 10 | litivapremio | numeric | 10,2 | YES | NULL |
| 11 | litmoterror | character varying | 255 | YES | NULL |
| 12 | litusucrea | character varying | 10 | NO | NULL |
| 13 | litfeccrea | timestamp without time zone |  | NO | NULL |
| 14 | litusucalc | character varying | 10 | YES | NULL |
| 15 | litfeccalc | timestamp without time zone |  | YES | NULL |
| 16 | litusulistado | character varying | 10 | YES | NULL |
| 17 | litfeclistado | timestamp without time zone |  | YES | NULL |
| 18 | litusuficcsv | character varying | 10 | YES | NULL |
| 19 | litfecficcsv | timestamp without time zone |  | YES | NULL |
| 20 | lithstusu | character varying | 10 | NO | NULL |
| 21 | lithsthora | timestamp without time zone |  | NO | NULL |
| 22 | litporccobro | numeric | 12,2 | NO | 0.00 |
| 23 | litporcaplicado | numeric | 12,2 | NO | 0.00 |

### liquidacion

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | liqid | numeric | 5,0 | NO | NULL |
| 2 | liqsocprop | numeric | 10,0 | NO | NULL |
| 3 | liqsesion | numeric | 10,0 | NO | NULL |
| 4 | liqfinifac | date |  | YES | NULL |
| 5 | liqffinfac | date |  | YES | NULL |
| 6 | liqffinban | date |  | YES | NULL |
| 7 | liqffinnob | date |  | YES | NULL |
| 8 | liqnumfac | numeric | 10,0 | YES | NULL |
| 9 | liqbaseimp | numeric | 12,2 | YES | NULL |
| 10 | liqimpues | numeric | 12,2 | YES | NULL |
| 11 | liqresid | numeric | 10,0 | YES | NULL |
| 12 | liqanno | numeric | 5,0 | NO | NULL |
| 13 | liqestado | numeric | 5,0 | NO | NULL |
| 14 | liqtipo | numeric | 5,0 | NO | NULL |
| 15 | liqdescrip | character varying | 60 | NO | NULL |
| 16 | liqsocemi | numeric | 10,0 | NO | NULL |
| 17 | liqfinicob | date |  | YES | NULL |
| 18 | liqsndsi | character | 1 | NO | 'N'::bpchar |
| 19 | liqhoracal | time without time zone |  | YES | NULL |

### liqvarvolcat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lvvcvar | character varying | 5 | NO | NULL |
| 2 | lvvcsocprop | numeric | 10,0 | NO | NULL |
| 3 | lvvctipvar | character | 1 | NO | NULL |
| 4 | lvvctxtid | numeric | 10,0 | NO | NULL |
| 5 | lvvcatlid | numeric | 5,0 | YES | NULL |
| 6 | lvvctipex | character | 1 | YES | NULL |
| 7 | lvcctramo | numeric | 5,0 | YES | NULL |
| 8 | lvcctipcalc | character | 1 | NO | NULL |

### liqvolcat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lvcanno | numeric | 5,0 | NO | NULL |
| 2 | lvcmes | numeric | 5,0 | NO | NULL |
| 3 | lvcsocliq | numeric | 10,0 | NO | NULL |
| 4 | lvcsocprop | numeric | 10,0 | NO | NULL |
| 5 | lvcdefinit | character | 1 | NO | NULL |
| 6 | lvcdescrip | character varying | 60 | NO | NULL |
| 7 | lvcsesid | numeric | 10,0 | NO | NULL |

### liqvolcondmccat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lvccliqid | numeric | 5,0 | NO | NULL |
| 2 | lvccpobid | numeric | 10,0 | NO | NULL |
| 3 | lvccexpid | numeric | 5,0 | NO | NULL |
| 4 | lvccsocemi | numeric | 10,0 | NO | NULL |
| 5 | lvccarrensn | character | 1 | NO | NULL |
| 6 | lvccatlid | numeric | 5,0 | NO | NULL |
| 7 | lvccvolcon | double precision | 53 | NO | NULL |
| 8 | lvccsocprop | numeric | 10,0 | NO | NULL |

### liqvolfacdmccat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lvfcliqid | numeric | 5,0 | NO | NULL |
| 2 | lvfcpobid | numeric | 10,0 | NO | NULL |
| 3 | lvfcexpid | numeric | 5,0 | NO | NULL |
| 4 | lvfcsocemi | numeric | 10,0 | NO | NULL |
| 5 | lvfcarrensn | character | 1 | NO | NULL |
| 6 | lvfcatlid | numeric | 5,0 | NO | NULL |
| 7 | lvfcntramo | numeric | 5,0 | NO | NULL |
| 8 | lvfcvolfac | double precision | 53 | NO | NULL |
| 9 | lvfcimpfac | numeric | 10,2 | NO | NULL |
| 10 | lvfcsocprop | numeric | 10,0 | NO | NULL |

### localidad

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | locid | numeric | 10,0 | NO | NULL |
| 2 | locnombre | character varying | 40 | NO | NULL |
| 3 | locpobid | numeric | 10,0 | NO | NULL |
| 4 | loccodpost | character varying | 10 | YES | NULL |
| 5 | locindblk | numeric | 5,0 | NO | NULL |
| 6 | lochstusu | character varying | 10 | YES | NULL |
| 7 | lochsthora | timestamp without time zone |  | YES | NULL |
| 8 | locclaveloc | character varying | 10 | YES | NULL |

### loctpcon

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ltpctctcod | numeric | 10,0 | NO | NULL |
| 2 | ltpcexpid | numeric | 5,0 | NO | NULL |
| 3 | ltpccptoid | numeric | 5,0 | NO | NULL |
| 4 | ltpclocid | numeric | 10,0 | NO | NULL |
| 5 | ltpctarifa | numeric | 5,0 | NO | NULL |

### logerrorenvioszgz

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lezid | numeric | 10,0 | NO | NULL |
| 2 | lezcnttnum | numeric | 10,0 | NO | NULL |
| 3 | leznomfich | character varying | 20 | NO | NULL |
| 4 | lezeazgzid | numeric | 10,0 | NO | NULL |
| 5 | lezdirfiscal | character | 1 | YES | NULL |
| 6 | lezerror | character varying | 1000 | YES | NULL |
| 7 | lezhora | timestamp without time zone |  | NO | NULL |

### lopd

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lopd_exec | character varying | 2 | YES | NULL |
| 2 | obs | character varying | 100 | YES | NULL |

### lote

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lotcod | character | 12 | NO | NULL |
| 2 | lotplecexpid | numeric | 5,0 | NO | NULL |
| 3 | lotpleczonid | character | 3 | NO | NULL |
| 4 | lotpleclibcod | numeric | 5,0 | NO | NULL |
| 5 | lotplecanno | numeric | 5,0 | NO | NULL |
| 6 | lotplecperiid | numeric | 5,0 | NO | NULL |
| 7 | lotplecpernum | numeric | 5,0 | NO | NULL |
| 8 | lottipo | character | 1 | NO | NULL |
| 9 | lotnumero | numeric | 5,0 | NO | NULL |
| 10 | lotestado | numeric | 5,0 | NO | NULL |
| 11 | lotfeccrea | date |  | NO | NULL |
| 12 | lotfecemis | date |  | YES | NULL |
| 13 | lotfecactu | date |  | YES | NULL |
| 14 | lotnumabo | numeric | 5,0 | NO | NULL |
| 15 | lotnumctde | numeric | 5,0 | NO | NULL |
| 16 | lotnumctdi | numeric | 5,0 | NO | NULL |
| 17 | lotnumnbat | numeric | 5,0 | NO | NULL |
| 18 | lotnumbat | numeric | 5,0 | NO | NULL |
| 19 | lotreppda | character | 1 | NO | 'N'::bpchar |
| 20 | lotsntelelec | character | 1 | NO | 'N'::bpchar |
| 21 | lotpromintent | numeric | 5,2 | YES | NULL |
| 22 | lotnumcontsupints | numeric | 5,0 | YES | NULL |
| 23 | lotcontsinlectura | numeric | 5,0 | YES | NULL |
| 24 | lotcontlecfuermargen | numeric | 5,0 | YES | NULL |
| 25 | lotfechnplanificada | numeric | 5,0 | YES | NULL |
| 26 | lotsntelelecexterna | character | 1 | NO | 'N'::bpchar |

### lotecamb

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ltccontcod | numeric | 5,0 | NO | NULL |
| 2 | ltctipo | character | 1 | NO | NULL |
| 3 | ltcnumero | numeric | 5,0 | NO | NULL |
| 4 | ltcestado | numeric | 5,0 | NO | NULL |
| 5 | ltccodrecd | numeric | 14,0 | NO | NULL |
| 6 | ltccodrech | numeric | 14,0 | NO | NULL |
| 7 | ltcfecemis | date |  | NO | NULL |
| 8 | ltcnumcon | numeric | 10,0 | NO | NULL |
| 9 | ltcfeccomu | date |  | YES | NULL |
| 10 | ltcdescri | character varying | 100 | YES | NULL |
| 11 | ltcexpid | numeric | 5,0 | NO | NULL |
| 12 | ltcpcsid | numeric | 10,0 | YES | NULL |

### loteinspeccionfrau

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lifid | numeric | 10,0 | NO | NULL |
| 2 | lifexpid | numeric | 5,0 | NO | NULL |
| 3 | lifpifid | numeric | 5,0 | NO | NULL |
| 4 | lifdescrip | character varying | 50 | NO | NULL |
| 5 | lifestado | numeric | 5,0 | NO | NULL |
| 6 | liftpestrtec | numeric | 5,0 | YES | NULL |
| 7 | lifsechidra | character varying | 200 | YES | NULL |
| 8 | lifsubsechidra | character varying | 200 | YES | NULL |
| 9 | lifperiodic | numeric | 5,0 | YES | NULL |
| 10 | lifzonas | character varying | 200 | YES | NULL |
| 11 | lifcodrecordesde | numeric | 14,0 | YES | NULL |
| 12 | lifcodrecorhasta | numeric | 14,0 | YES | NULL |
| 13 | liftpcliente | character varying | 30 | YES | NULL |
| 14 | liftpcptoid | numeric | 5,0 | YES | NULL |
| 15 | liftarifa | character varying | 200 | YES | NULL |
| 16 | lifactividad | character varying | 200 | YES | NULL |
| 17 | lifusos | character varying | 256 | YES | NULL |
| 18 | lifcnae | character varying | 200 | YES | NULL |
| 19 | lifsnexclsifraude | character | 1 | NO | 'S'::bpchar |
| 20 | lifsnexclsiinspec | character | 1 | NO | 'S'::bpchar |
| 21 | lifsninclfrauotrodom | character | 1 | NO | 'N'::bpchar |
| 22 | lifestadofraude | character varying | 200 | YES | NULL |
| 23 | liforiglect | character varying | 200 | YES | NULL |
| 24 | lifobslectincl | character varying | 200 | YES | NULL |
| 25 | lifobslectexcl | character varying | 200 | YES | NULL |
| 26 | lifnumperiodos | numeric | 5,0 | YES | NULL |
| 27 | lifestadoptoserv | character varying | 200 | YES | NULL |
| 28 | lifnumdiascort | numeric | 5,0 | YES | NULL |
| 29 | lifestadocntt | character varying | 200 | YES | NULL |
| 30 | lifnumdiasbaja | numeric | 5,0 | YES | NULL |
| 31 | lifnumdiasalta | numeric | 5,0 | YES | NULL |
| 32 | lifemplazconta | character varying | 200 | YES | NULL |
| 33 | lifporcdebajomedia | numeric | 5,0 | YES | NULL |
| 34 | lifdifanualmcub | numeric | 5,0 | YES | NULL |
| 35 | lifnumanios | numeric | 5,0 | YES | NULL |
| 36 | lifmaxptoserv | numeric | 5,0 | YES | NULL |
| 37 | lifsesioncrea | numeric | 10,0 | YES | NULL |
| 38 | lifsesionacep | numeric | 10,0 | YES | NULL |
| 39 | lifresid | numeric | 10,0 | YES | NULL |
| 40 | lifsngeneradocsv | character | 1 | NO | 'N'::bpchar |
| 41 | liffichero | bytea |  | YES | NULL |

### lotemdm

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lmdmnumrefbatchso | numeric | 10,0 | NO | NULL |
| 2 | lmdmtotalpet | numeric | 10,0 | NO | NULL |
| 3 | lmdmfeccom | timestamp without time zone |  | YES | NULL |

### loterequestmdm

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lrmdmnumrefbatchso | numeric | 10,0 | NO | NULL |
| 2 | lrmdmnrsistorigen | numeric | 10,0 | NO | NULL |

### lotesii

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lsiid | numeric | 10,0 | NO | NULL |
| 2 | lsidesc | character varying | 100 | NO | NULL |
| 3 | lsiexpid | numeric | 5,0 | NO | NULL |
| 4 | lsisocpro | numeric | 10,0 | NO | NULL |
| 5 | lsitipo | numeric | 5,0 | NO | NULL |
| 6 | lsitipocomunic | character varying | 2 | NO | NULL |
| 7 | lsiestado | numeric | 5,0 | NO | NULL |
| 8 | lsimotrechazo | numeric | 5,0 | YES | NULL |
| 9 | lsixml | bytea |  | YES | NULL |
| 10 | lsiusucrea | character varying | 10 | NO | NULL |
| 11 | lsifeccrea | date |  | NO | NULL |
| 12 | lsilsrcod | character varying | 20 | YES | NULL |
| 13 | lsilmrcod | numeric | 10,0 | YES | NULL |

### lotesiifact

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lsflsiid | numeric | 10,0 | NO | NULL |
| 2 | lsffacid | numeric | 10,0 | NO | NULL |

### lotesiifactinc

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfilsiid | numeric | 10,0 | NO | NULL |
| 2 | lfifacid | numeric | 10,0 | NO | NULL |
| 3 | lfiincidencia | numeric | 5,0 | YES | NULL |
| 4 | lfifeccrea | timestamp without time zone |  | NO | NULL |
| 5 | lfilmrcod | numeric | 10,0 | YES | NULL |

### lotesiimotrec

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lmrcod | numeric | 10,0 | NO | NULL |
| 2 | lmrdesctxtid | numeric | 10,0 | NO | NULL |
| 3 | lmraclartxtid | numeric | 10,0 | YES | NULL |
| 4 | lmrtecnica | character | 1 | NO | 'N'::bpchar |
| 5 | lmrfactura | character | 1 | NO | 'N'::bpchar |
| 6 | lmrlote | character | 1 | NO | 'N'::bpchar |
| 7 | lmrestado | numeric | 5,0 | YES | NULL |
| 8 | lmrreenvionif | character | 1 | NO | 'N'::bpchar |
| 9 | lmrtiporev | character varying | 50 | YES | NULL |

### lotesiiresp

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lsrcod | character varying | 20 | NO | NULL |
| 2 | lsrdesctxtid | numeric | 10,0 | NO | NULL |
| 3 | lsrestado | numeric | 5,0 | NO | NULL |

### lotpetcam

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lpetcontcod | numeric | 5,0 | NO | NULL |
| 2 | lpettipo | character | 1 | NO | NULL |
| 3 | lpetnumero | numeric | 5,0 | NO | NULL |
| 4 | lpetptosid | numeric | 10,0 | NO | NULL |
| 5 | lpetconid | numeric | 10,0 | NO | NULL |
| 6 | lpetoperid | numeric | 5,0 | YES | NULL |
| 7 | lpetfecemi | date |  | NO | NULL |
| 8 | lpetpriori | numeric | 5,0 | YES | NULL |
| 9 | lpetnumesf | numeric | 5,0 | NO | NULL |
| 10 | lpetestado | numeric | 5,0 | NO | NULL |
| 11 | lpetfeccit | date |  | YES | NULL |
| 12 | lpethorcit | time without time zone |  | YES | NULL |
| 13 | lpetfecvis | date |  | YES | NULL |
| 14 | lpetlecret | numeric | 10,0 | YES | NULL |
| 15 | lpetconins | character varying | 12 | YES | NULL |
| 16 | lpetcalibm | numeric | 5,0 | YES | NULL |
| 17 | lpetmarcid | numeric | 5,0 | YES | NULL |
| 18 | lpetmodeid | numeric | 5,0 | YES | NULL |
| 19 | lpetanofab | numeric | 5,0 | YES | NULL |
| 20 | lpetlecins | numeric | 10,0 | YES | NULL |
| 21 | lpetmotcam | character | 2 | YES | NULL |
| 22 | lpetmotnca | character | 2 | YES | NULL |
| 23 | lpetobstxt | character varying | 400 | YES | NULL |
| 24 | lpetmesopd | numeric | 5,0 | YES | NULL |
| 25 | lpetmesoph | numeric | 5,0 | YES | NULL |
| 26 | lpetofiid | numeric | 5,0 | YES | NULL |
| 27 | lpetfecact | timestamp without time zone |  | YES | NULL |
| 28 | lpetobscod | character | 2 | YES | NULL |
| 29 | lpetnoinsemisor | character | 1 | YES | NULL |
| 30 | lpetmodcomunica | character | 20 | YES | NULL |
| 31 | lpettipotelec | numeric | 5,0 | YES | NULL |
| 32 | lpetsistelec | numeric | 5,0 | YES | NULL |
| 33 | lpetsnactivarov | character | 1 | NO | 'N'::bpchar |
| 34 | lpetemplidnue | character | 2 | YES | NULL |
| 35 | lpetfilbat | numeric | 5,0 | YES | NULL |
| 36 | lpetcolbat | numeric | 5,0 | YES | NULL |
| 37 | lpetvalvret | character | 1 | YES | NULL |
| 38 | lpetvrret | character | 1 | YES | NULL |
| 39 | lpetobservacion | character varying | 400 | YES | NULL |
| 40 | lpettelec | character | 1 | NO | 'N'::bpchar |
| 41 | lpetetecnologia | numeric | 5,0 | YES | NULL |
| 42 | lpetepremontado | character | 1 | NO | 'N'::bpchar |
| 43 | lpetemodelo | numeric | 10,0 | YES | NULL |
| 44 | lpetepesopulso | numeric | 10,0 | YES | NULL |
| 45 | lpetemodulo | character varying | 16 | YES | NULL |
| 46 | lpeteimeter | character varying | 15 | YES | NULL |
| 47 | lpeteoptions | numeric | 10,0 | YES | NULL |
| 48 | lpetebusserie | character varying | 7 | YES | NULL |
| 49 | lpetelecinicial | numeric | 10,0 | YES | NULL |
| 50 | lpetefechainstala | timestamp without time zone |  | YES | NULL |
| 51 | lpetepulsoemi | numeric | 5,1 | YES | NULL |
| 52 | lpetlwmodulo | character varying | 50 | YES | NULL |
| 53 | lpetmarcatelec | numeric | 5,0 | YES | NULL |
| 54 | lpetmodeltelec | numeric | 5,0 | YES | NULL |
| 55 | lpetclaveadic | character varying | 50 | YES | NULL |
| 56 | lpetbusnbiotserie | character varying | 50 | YES | NULL |
| 57 | lpetsndeportado | character | 1 | YES | NULL |

### lotpetcameq

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lpeteqcontcod | numeric | 5,0 | NO | NULL |
| 2 | lpeteqtipo | character | 1 | NO | NULL::bpchar |
| 3 | lpeteqnumero | numeric | 5,0 | NO | NULL |
| 4 | lpeteqptosid | numeric | 10,0 | NO | NULL |
| 5 | lpeteqconid | numeric | 10,0 | NO | NULL |
| 6 | lpeteqoperid | numeric | 5,0 | YES | NULL |
| 7 | lpeteqfecemi | date |  | NO | NULL |
| 8 | lpeteqpriori | numeric | 5,0 | YES | NULL |
| 9 | lpeteqnumesf | numeric | 5,0 | NO | NULL |
| 10 | lpeteqestado | numeric | 5,0 | NO | NULL |
| 11 | lpeteqfeccit | date |  | YES | NULL |
| 12 | lpeteqhorcit | date |  | YES | NULL |
| 13 | lpeteqfecvis | date |  | YES | NULL |
| 14 | lpeteqlecret | numeric | 10,0 | YES | NULL |
| 15 | lpeteqconins | character varying | 12 | YES | NULL::character varying |
| 16 | lpeteqcalibm | numeric | 5,0 | YES | NULL |
| 17 | lpeteqmarcid | numeric | 5,0 | YES | NULL |
| 18 | lpeteqmodeid | numeric | 5,0 | YES | NULL |
| 19 | lpeteqanofab | numeric | 5,0 | YES | NULL |
| 20 | lpeteqlecins | numeric | 10,0 | YES | NULL |
| 21 | lpeteqmotcam | character | 2 | YES | NULL::bpchar |
| 22 | lpeteqmotnca | character | 2 | YES | NULL::bpchar |
| 23 | lpeteqobstxt | character varying | 400 | YES | NULL::character varying |
| 24 | lpeteqmesopd | numeric | 5,0 | YES | NULL |
| 25 | lpeteqmesoph | numeric | 5,0 | YES | NULL |
| 26 | lpeteqofiid | numeric | 5,0 | YES | NULL |
| 27 | lpeteqfecact | timestamp without time zone |  | YES | NULL |
| 28 | lpeteqobscod | character | 2 | YES | NULL::bpchar |
| 29 | lpeteqnoinsemisor | character | 1 | YES | NULL::bpchar |
| 30 | lpeteqmodcomunica | character | 20 | YES | NULL::bpchar |
| 31 | lpeteqtipotelec | numeric | 5,0 | YES | NULL |
| 32 | lpeteqsistelec | numeric | 5,0 | YES | NULL |
| 33 | lpeteqsnactivarov | character | 1 | NO | 'N'::bpchar |
| 34 | lpeteqemplidnue | character | 2 | YES | NULL::bpchar |
| 35 | lpeteqfilbat | numeric | 5,0 | YES | NULL |
| 36 | lpeteqcolbat | numeric | 5,0 | YES | NULL |
| 37 | lpeteqvalvret | character | 1 | YES | NULL::bpchar |
| 38 | lpeteqvrret | character | 1 | YES | NULL::bpchar |
| 39 | lpeteqobservacion | character varying | 400 | YES | NULL |
| 40 | lpeteqetecnologia | numeric | 5,0 | YES | NULL |
| 41 | lpeteqepremontado | character | 1 | NO | 'N'::bpchar |
| 42 | lpeteqemodelo | numeric | 10,0 | YES | NULL |
| 43 | lpeteqemodulo | character varying | 16 | YES | NULL |
| 44 | lpeteqeimeter | character varying | 15 | YES | NULL |
| 45 | lpeteqeoptions | numeric | 10,0 | YES | NULL |
| 46 | lpeteqebusserie | character varying | 7 | YES | NULL |
| 47 | lpeteqelecinicial | numeric | 10,0 | YES | NULL |
| 48 | lpeteqefechainstala | timestamp without time zone |  | YES | NULL |
| 49 | lpeteqtelec | character | 1 | NO | 'N'::bpchar |
| 50 | lpeteqepesopulso | numeric | 10,0 | YES | NULL |
| 51 | lpeteqpulsoemi | numeric | 5,1 | YES | NULL |
| 52 | lpeteqlwmodulo | character varying | 50 | YES | NULL |
| 53 | lpeteqmarcatelec | numeric | 5,0 | YES | NULL |
| 54 | lpeteqmodeltelec | numeric | 5,0 | YES | NULL |
| 55 | lpeteqclaveadic | character varying | 50 | YES | NULL |
| 56 | lpeteqbusnbiotserie | character varying | 50 | YES | NULL |
| 57 | lpeteqsndeportado | character | 1 | YES | NULL |

### magnitud

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | magcod | character | 10 | NO | NULL |
| 2 | magtpmes | character | 1 | NO | NULL |
| 3 | magtxtid | numeric | 10,0 | NO | NULL |
| 4 | magsnactiva | character | 1 | NO | NULL |
| 5 | maghstusu | character varying | 10 | NO | NULL |
| 6 | maghsthora | timestamp without time zone |  | NO | NULL |

### magnituddat

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mgdid | numeric | 10,0 | NO | NULL |
| 2 | mgdexpcont | character | 4 | NO | NULL |
| 3 | mgdmagcod | character | 10 | NO | NULL |
| 4 | mgdano | numeric | 5,0 | NO | NULL |
| 5 | mgdmes | numeric | 5,0 | NO | NULL |
| 6 | mgdcodsdiv | character | 4 | YES | NULL |
| 7 | mgddessdiv | character varying | 30 | YES | NULL |
| 8 | mgdcodcpto | character | 4 | YES | NULL |
| 9 | mgddescpto | character varying | 30 | YES | NULL |
| 10 | mgdvar1 | numeric | 18,2 | YES | NULL |
| 11 | mgdvar2 | numeric | 18,2 | YES | NULL |
| 12 | mgdvar3 | numeric | 18,2 | YES | NULL |
| 13 | mgdvar4 | numeric | 18,2 | YES | NULL |
| 14 | mgdfeccarga | date |  | NO | NULL |
| 15 | mgdregimen | character | 1 | YES | NULL |
| 16 | mgdperanno | numeric | 5,0 | YES | NULL |
| 17 | mgdperperiodi | numeric | 5,0 | YES | NULL |
| 18 | mgdperperiodo | numeric | 5,0 | YES | NULL |

### magtpconcpt

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtcmagcod | character | 10 | NO | NULL |
| 2 | mtctconid | numeric | 5,0 | NO | NULL |
| 3 | mtcsnactivo | character | 1 | NO | NULL |
| 4 | mtcfecmodif | timestamp without time zone |  | NO | NULL |
| 5 | mtcusumodif | character varying | 10 | NO | NULL |

### marcacont

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | marcid | numeric | 5,0 | NO | NULL |
| 2 | marcdesc | character varying | 20 | NO | NULL |
| 3 | marchstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 4 | marchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | marcbaja | character | 1 | NO | 'S'::bpchar |
| 6 | marcrcuid | numeric | 5,0 | NO | 0 |

### marcaequipotelec

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | marceqtlid | numeric | 5,0 | NO | NULL |
| 2 | marceqtldesc | character varying | 20 | NO | NULL::character varying |
| 3 | marceqtlhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 4 | marceqtlhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | marceqtlactivo | character | 1 | NO | 'S'::bpchar |

### marmodeq

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | marmodeqmarid | numeric | 5,0 | NO | NULL |
| 2 | marmodeqmodid | numeric | 5,0 | NO | NULL |
| 3 | marmodeqcalibre | numeric | 5,0 | NO | NULL |
| 4 | marmodeqeuipo | numeric | 10,0 | NO | NULL |

### material

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | matcod | character | 4 | NO | NULL |
| 2 | matindblk | numeric | 5,0 | NO | NULL |
| 3 | matdesctxtid | numeric | 10,0 | NO | NULL |

### mejdiaremcal

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mdrcnttnum | numeric | 10,0 | NO | NULL |
| 2 | mdrfecha | timestamp without time zone |  | NO | NULL |
| 3 | mdrdia | numeric | 5,0 | NO | NULL |
| 4 | mdractivo | character | 1 | NO | 'S'::bpchar |
| 5 | mdrfecdesactiv | timestamp without time zone |  | YES | NULL |

### mensaje

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | menpocid | numeric | 10,0 | NO | NULL |
| 2 | mentipmeid | numeric | 10,0 | NO | NULL |
| 3 | menftoid | numeric | 10,0 | YES | NULL |
| 4 | menclitext | character varying | 600 | NO | NULL |
| 5 | menorigen | numeric | 10,0 | NO | NULL |
| 6 | menfeccart | date |  | YES | NULL |
| 7 | menocgid | numeric | 10,0 | YES | NULL |
| 8 | mengesid | numeric | 10,0 | YES | NULL |

### mensajerecap

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | msjrcpfbleid | numeric | 10,0 | NO | NULL |
| 2 | msjrcptipmeid | numeric | 10,0 | NO | NULL |
| 3 | msjrcpclitext | character varying | 600 | NO | NULL |
| 4 | msjrcporigen | numeric | 10,0 | NO | NULL |

### mensajerespettele

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mrptid | numeric | 10,0 | NO | NULL |
| 2 | mrptrptid | numeric | 10,0 | NO | NULL |
| 3 | mrptipomensaje | character | 1 | NO | NULL |
| 4 | mrptetxcodigo | character varying | 50 | NO | NULL |
| 5 | mrptargumentos | character varying | 200 | YES | NULL |
| 6 | mrptestado | numeric | 5,0 | NO | NULL |
| 7 | mrptusuval | character varying | 10 | YES | NULL |
| 8 | mrptfecval | timestamp without time zone |  | YES | NULL |

### mensajespeticionmdm

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mpmdmid | numeric | 10,0 | NO | NULL |
| 2 | mpmdmnumorden | numeric | 5,0 | NO | NULL |
| 3 | mpmdmcodretorno | numeric | 5,0 | NO | NULL |
| 4 | mpmdmtipomensaje | character | 1 | NO | NULL |
| 5 | mpmdmmensaje | character varying | 200 | NO | NULL |
| 6 | mpmdmresultado | numeric | 10,0 | NO | NULL |
| 7 | mpmdmestado | numeric | 5,0 | NO | NULL |

### mgr_tipocontra

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mgrexpid | numeric | 5,0 | NO | NULL |
| 2 | mgrtctclsccod | character | 2 | NO | NULL |
| 3 | mgrtctcod | character | 2 | NO | NULL |
| 4 | mgrcodigo | numeric | 5,0 | NO | NULL |
| 5 | mgrtxtid | numeric | 10,0 | NO | NULL |

### mig_operarios

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | contratista | numeric | 5,0 | NO | NULL |
| 2 | old_id | numeric | 5,0 | NO | NULL |
| 3 | new_id | numeric | 5,0 | NO | NULL |

### migfaccsb19

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mgfc19emisor | character varying | 8 | NO | NULL |
| 2 | mgfc19cobid | character varying | 16 | NO | NULL |
| 3 | mgfc19refant | character varying | 12 | NO | NULL |
| 4 | mgfc19gesid | numeric | 10,0 | NO | NULL |
| 5 | mgfc19ocgid | numeric | 10,0 | NO | NULL |
| 6 | mgfc19cnttnum | numeric | 10,0 | YES | NULL |

### migfaccsb1914

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mgfc1914emisor | character varying | 8 | NO | NULL |
| 2 | mgfc1914adeudo | character varying | 35 | NO | NULL |
| 3 | mgfc1914refman | character varying | 35 | NO | NULL |
| 4 | mgfc1914gesid | numeric | 10,0 | NO | NULL |
| 5 | mgfc1914ocgid | numeric | 10,0 | NO | NULL |
| 6 | mgfc1914cnttnum | numeric | 10,0 | YES | NULL |
| 7 | mgfc1914idfic | character varying | 35 | YES | NULL |

### migplzcsb19

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mgpl19emisor | character varying | 8 | NO | NULL |
| 2 | mgpl19cobid | character varying | 16 | NO | NULL |
| 3 | mgpl19refant | character varying | 12 | NO | NULL |
| 4 | mgpl19gesid | numeric | 10,0 | NO | NULL |
| 5 | mgpl19ocgid | numeric | 10,0 | NO | NULL |
| 6 | mgpl19opdid | numeric | 10,0 | NO | NULL |
| 7 | mgpl19cnttnum | numeric | 10,0 | NO | NULL |

### migplzcsb1914

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mgpl1914emisor | character varying | 8 | NO | NULL |
| 2 | mgpl1914adeudo | character varying | 35 | NO | NULL |
| 3 | mgpl1914refman | character varying | 35 | NO | NULL |
| 4 | mgpl1914gesid | numeric | 10,0 | NO | NULL |
| 5 | mgpl1914ocgid | numeric | 10,0 | NO | NULL |
| 6 | mgpl1914opdid | numeric | 10,0 | NO | NULL |
| 7 | mgpl1914cnttnum | numeric | 10,0 | NO | NULL |
| 8 | mgpl1914idfic | character varying | 35 | YES | NULL |

### modaplic

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | moducod | character varying | 15 | NO | NULL |
| 2 | modutxtid | numeric | 10,0 | NO | NULL |
| 3 | modudptid | numeric | 5,0 | NO | NULL |
| 4 | modunecven | character | 1 | NO | NULL |
| 5 | modunivel | numeric | 5,0 | NO | NULL |
| 6 | modupadre | character varying | 15 | YES | NULL |
| 7 | modorden | numeric | 5,0 | NO | 0 |

### modcontcali

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mccmarcid | numeric | 5,0 | NO | NULL |
| 2 | mccmodid | numeric | 5,0 | NO | NULL |
| 3 | mcccalimm | numeric | 5,0 | NO | NULL |
| 4 | mcccaudal | double precision | 53 | YES | NULL |
| 5 | mccpulso | double precision | 53 | YES | NULL |

### modelcont

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | modmarcid | numeric | 5,0 | NO | NULL |
| 2 | modid | numeric | 5,0 | NO | NULL |
| 3 | moddesc | character varying | 30 | NO | NULL |
| 4 | modtipesf | character | 2 | NO | NULL |
| 5 | moddigit | numeric | 5,0 | NO | NULL |
| 6 | modtcnid | numeric | 5,0 | NO | NULL |
| 7 | modhstusu | character varying | 10 | NO | NULL |
| 8 | modhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 9 | modbaja | character | 1 | NO | 'S'::bpchar |
| 10 | modsntelecintegrada | character | 1 | NO | 'N'::bpchar |
| 11 | modtipotelec | numeric | 5,0 | YES | NULL |

### modelequip

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | moddeqid | numeric | 10,0 | NO | NULL |
| 2 | moddeqdescrip | character varying | 100 | NO | NULL |
| 3 | moddeqoption | numeric | 10,0 | YES | NULL |
| 4 | moddeqpulsoemi | numeric | 5,1 | YES | NULL |

### modelequipotelec

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | modeqtlmarceqid | numeric | 5,0 | NO | NULL |
| 2 | modeqtlid | numeric | 5,0 | NO | NULL |
| 3 | modeqtldesc | character varying | 30 | NO | NULL::character varying |
| 4 | modeqtltiptelec | numeric | 5,0 | NO | NULL |
| 5 | modeqtldeportado | character | 1 | NO | 'N'::bpchar |
| 6 | modeqtlvalregex | character varying | 500 | NO | NULL::character varying |
| 7 | modeqtlhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 8 | modeqtlhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 9 | modeqtlactivo | character | 1 | NO | 'S'::bpchar |

### modelocp

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mcpcod | numeric | 5,0 | NO | NULL |
| 2 | mcptxtid | numeric | 10,0 | NO | NULL |

### modestimac

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mestid | numeric | 5,0 | NO | NULL |
| 2 | mesttxtid | numeric | 10,0 | NO | NULL |
| 3 | mestprog | character varying | 10 | NO | NULL |
| 4 | mestsnactivo | character | 1 | NO | 'S'::bpchar |
| 5 | mesthstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | mesthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | mestutlect | character | 1 | NO | 'R'::bpchar |
| 8 | mestaplicaxlectval | character | 1 | NO | 'N'::bpchar |

### modlinregul

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mlrid | numeric | 10,0 | NO | NULL |
| 2 | mlrfactur | numeric | 10,0 | YES | NULL |
| 3 | mlrconcep | numeric | 10,0 | YES | NULL |
| 4 | mlraccion | character | 1 | YES | NULL |
| 5 | mlrimpant | numeric | 18,2 | YES | NULL |
| 6 | mlrimpact | numeric | 18,2 | YES | NULL |
| 7 | mlrhstusu | character varying | 10 | YES | NULL |
| 8 | mlrfechor | timestamp without time zone |  | YES | NULL |

### monexis

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | codigo | character | 3 | NO | NULL |
| 2 | montxtid | numeric | 10,0 | NO | NULL |
| 3 | montxtidalt | numeric | 10,0 | YES | NULL |
| 4 | abrev | character varying | 20 | NO | NULL |
| 5 | abrevalt | character varying | 20 | YES | NULL |
| 6 | abrevplural | character varying | 20 | NO | NULL |
| 7 | abrevpluralalt | character varying | 20 | YES | NULL |
| 8 | valor | numeric | 10,3 | NO | NULL |
| 9 | descrplural | numeric | 10,0 | NO | NULL |
| 10 | descrpluralalt | numeric | 10,0 | YES | NULL |
| 11 | simbdelante | character | 1 | NO | 'N'::bpchar |
| 12 | formato | character varying | 10 | NO | NULL |
| 13 | formaalt | character varying | 10 | YES | NULL |
| 14 | numdec | numeric | 5,0 | NO | NULL |
| 15 | numdecalt | numeric | 5,0 | YES | NULL |
| 16 | numdecprecext | numeric | 5,0 | NO | NULL |
| 17 | numdecprecextalt | numeric | 5,0 | YES | NULL |
| 18 | simbolo | character varying | 10 | NO | NULL |
| 19 | simbalt | character varying | 10 | YES | NULL |
| 20 | idiomaloc | character varying | 6 | YES | NULL |
| 21 | paisloc | character varying | 6 | YES | NULL |
| 22 | actual | character | 1 | NO | 'N'::bpchar |
| 23 | op_conv | numeric | 5,0 | NO | 1 |
| 24 | numcod | character | 3 | YES | NULL |
| 25 | numdecred | numeric | 5,0 | YES | 0 |

### motbajacontra

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtbcid | numeric | 5,0 | NO | NULL |
| 2 | mtbctxtid | numeric | 10,0 | NO | NULL |
| 3 | mtbcsnoficio | character | 1 | NO | NULL |
| 4 | mtbcsncambtit | character | 1 | NO | NULL |
| 5 | mtbchstusu | character varying | 10 | NO | NULL |
| 6 | mtbchsthora | timestamp without time zone |  | NO | NULL |
| 7 | mtbcsnmasiva | character | 1 | NO | 'N'::bpchar |
| 8 | mtbcsnrecfianza | character | 1 | NO | 'N'::bpchar |

### motcambsen

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mcspcsid | numeric | 10,0 | NO | NULL |
| 2 | mcssencid | numeric | 10,0 | NO | NULL |
| 3 | mcsmotcom | numeric | 5,0 | YES | NULL |

### motdevol

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtdid | numeric | 5,0 | NO | NULL |
| 2 | mtdtxtid | numeric | 10,0 | NO | NULL |
| 3 | mtdbancario | character | 1 | NO | NULL |
| 4 | mtdcodigo | character | 4 | NO | NULL |
| 5 | mtdtipo | numeric | 5,0 | NO | NULL |
| 6 | mtdtipges | numeric | 5,0 | NO | NULL |
| 7 | mtdsnincorr | character | 1 | NO | NULL |
| 8 | mtdsnaimpagada | character | 1 | NO | 'N'::bpchar |

### motfactura

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtfcodigo | numeric | 5,0 | NO | NULL |
| 2 | mtforigen | numeric | 5,0 | NO | NULL |
| 3 | mtftxtid | numeric | 10,0 | NO | NULL |
| 4 | mtfsnmanual | character | 1 | NO | NULL |
| 5 | mtftsumid | numeric | 5,0 | YES | NULL |
| 6 | mtfsnselcon | character | 1 | NO | NULL |
| 7 | mtftpvid | numeric | 5,0 | YES | NULL |
| 8 | mtftccid | numeric | 5,0 | YES | NULL |
| 9 | mtfsnfuga | character | 1 | NO | NULL |
| 10 | mtfhstusu | character varying | 10 | NO | NULL |
| 11 | mtfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 12 | mtfsnfraude | character | 1 | NO | 'N'::bpchar |
| 13 | mtfsnbajas | character | 1 | NO | 'N'::bpchar |

### motnocontr

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mncid | numeric | 5,0 | NO | NULL |
| 2 | mnctxtid | numeric | 10,0 | NO | NULL |

### motnoftofraude

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mnffid | numeric | 5,0 | NO | NULL |
| 2 | mnfftxtid | numeric | 10,0 | NO | NULL |
| 3 | mnffhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 4 | mnffhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### motordenes

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mvoid | numeric | 5,0 | NO | NULL |
| 2 | mvotpoid | numeric | 5,0 | NO | NULL |
| 3 | mvotxtid | numeric | 10,0 | NO | NULL |
| 4 | mvosnmanual | character | 1 | NO | 'N'::bpchar |
| 5 | mvosnmotfactext | character | 1 | NO | 'N'::bpchar |
| 6 | mvosnordext | character | 1 | NO | 'N'::bpchar |
| 7 | mvotetid | numeric | 5,0 | YES | NULL |
| 8 | mvoorigen | character | 1 | YES | NULL |

### motrechazobonif

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtbid | numeric | 5,0 | NO | NULL |
| 2 | mtbdescrip | numeric | 10,0 | NO | NULL |
| 3 | mtbexpid | numeric | 5,0 | NO | NULL |

### mottpcontacto

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtcid | numeric | 5,0 | NO | NULL |
| 2 | mtctctid | numeric | 5,0 | NO | NULL |
| 3 | mtctxtid | numeric | 10,0 | NO | NULL |
| 4 | mtcsnaut | character | 1 | NO | NULL |
| 5 | mtchstusu | character varying | 10 | NO | NULL |
| 6 | mtchsthora | timestamp without time zone |  | NO | NULL |
| 7 | mtcsnact | character | 1 | YES | 'S'::bpchar |

### movccontrato

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mccid | numeric | 10,0 | NO | NULL |
| 2 | mcctmcid | numeric | 5,0 | NO | NULL |
| 3 | mcccntnum | numeric | 10,0 | NO | NULL |
| 4 | mccimporte | numeric | 18,2 | NO | NULL |
| 5 | mccdesc | character varying | 100 | YES | NULL |
| 6 | mccfechahora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | mccfacid | numeric | 10,0 | YES | NULL |
| 8 | mccopdid | numeric | 10,0 | YES | NULL |
| 9 | mcchstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 10 | mccftoid | numeric | 10,0 | YES | NULL |
| 11 | mccsntratado | character | 1 | NO | 'N'::bpchar |
| 12 | mccsaldoact | numeric | 18,2 | YES | NULL |
| 13 | mccsaldoant | numeric | 18,2 | YES | NULL |
| 14 | mccgesid | numeric | 10,0 | YES | NULL |
| 15 | mccporcivaant | numeric | 5,4 | YES | NULL |
| 16 | mccsaldopdteant | numeric | 18,2 | YES | NULL |
| 17 | mcctipodesctoant | numeric | 5,0 | YES | NULL |

### movlotecam

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mlccontcod | numeric | 5,0 | NO | NULL |
| 2 | mlctipo | character | 1 | NO | NULL |
| 3 | mlcnumero | numeric | 5,0 | NO | NULL |
| 4 | mlcptosid | numeric | 10,0 | NO | NULL |
| 5 | mlcfecha | timestamp without time zone |  | NO | NULL |
| 6 | mlctipmov | numeric | 5,0 | NO | NULL |
| 7 | mlcmotivo | numeric | 5,0 | NO | NULL |
| 8 | mlccontid | numeric | 10,0 | NO | NULL |
| 9 | mlcusuid | character varying | 10 | NO | NULL |

### movrecargo

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mrcgid | numeric | 10,0 | NO | NULL |
| 2 | mrcgrcgid | numeric | 10,0 | NO | NULL |
| 3 | mrcgimporte | numeric | 18,2 | NO | NULL |
| 4 | mrcgocgid | numeric | 10,0 | NO | NULL |
| 5 | mrcgasnid | numeric | 10,0 | YES | NULL |

### msjsistema

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | msjsid | numeric | 10,0 | NO | NULL |
| 2 | msjsusuid | character varying | 10 | NO | NULL |
| 3 | msjsmensaje | character varying | 250 | NO | NULL |
| 4 | msjsorigen | character varying | 100 | NO | NULL |
| 5 | msjstcaduca | timestamp without time zone |  | NO | NULL |
| 6 | msjstborrar | timestamp without time zone |  | NO | NULL |

### msjusuario

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | msjid | numeric | 10,0 | NO | NULL |
| 2 | msjusuid | character varying | 10 | NO | NULL |
| 3 | msjmensaje | character varying | 250 | NO | NULL |
| 4 | msjf_aviso | timestamp without time zone |  | NO | NULL |
| 5 | msjsn_enviado | character | 1 | NO | NULL |
| 6 | msjorigen | character varying | 100 | NO | NULL |
| 7 | msjfecha | timestamp without time zone |  | NO | NULL |
| 8 | msjtcaduca | timestamp without time zone |  | YES | NULL |

### nivelcorte

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | nconivel | numeric | 5,0 | NO | NULL |
| 2 | ncodesctxtid | numeric | 10,0 | NO | NULL |
| 3 | ncocanttpvid | numeric | 5,0 | YES | NULL |
| 4 | ncofacttpvid | numeric | 5,0 | YES | NULL |

### nivelcritptoserv

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ncpsid | numeric | 5,0 | NO | NULL |
| 2 | ncpscodigo | numeric | 5,0 | NO | NULL |
| 3 | ncpsdescctxtid | numeric | 10,0 | NO | NULL |
| 4 | ncpsdescltxtid | numeric | 10,0 | NO | NULL |
| 5 | ncpstusu | character varying | 10 | NO | NULL::character varying |
| 6 | ncpsthora | timestamp without time zone |  | NO | NULL |

### nivestruc

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | nieid | numeric | 5,0 | NO | NULL |
| 2 | niedescripcion | character varying | 10 | NO | NULL |
| 3 | niehstusu | character varying | 10 | NO | NULL |
| 4 | niehsthora | timestamp without time zone |  | NO | NULL |

### nomcalle

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ncalcalid | numeric | 10,0 | NO | NULL |
| 2 | ncalnombre | character varying | 80 | NO | NULL |
| 3 | ncallocid | numeric | 10,0 | NO | NULL |
| 4 | ncaltviaid | numeric | 5,0 | YES | NULL |
| 5 | ncalbarrid | numeric | 5,0 | YES | NULL |
| 6 | ncaltpstcid | numeric | 5,0 | YES | NULL |
| 7 | ncalcodext | character varying | 15 | YES | NULL |
| 8 | ncalhstusu | character varying | 10 | YES | NULL |
| 9 | ncalhsthora | timestamp without time zone |  | YES | NULL |
| 10 | ncalactiva | character | 1 | NO | 'S'::bpchar |

### normatbonif

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | noridnorid | numeric | 5,0 | NO | NULL |
| 2 | nortbid | numeric | 5,0 | NO | NULL |
| 3 | norhstusu | character varying | 10 | NO | NULL |
| 4 | norhsthora | timestamp without time zone |  | NO | NULL |

### normativa

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | norid | numeric | 5,0 | NO | NULL |
| 2 | norexpid | numeric | 5,0 | NO | NULL |
| 3 | nortxtid | numeric | 10,0 | NO | NULL |
| 4 | norfecpub | date |  | NO | NULL |
| 5 | norhstusu | character varying | 10 | NO | NULL |
| 6 | norhsthora | timestamp without time zone |  | NO | NULL |

### notifcambsen

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | notcsid | numeric | 5,0 | NO | NULL |
| 2 | notcstipofich | numeric | 5,0 | NO | NULL |
| 3 | notcstipo | numeric | 5,0 | NO | NULL |

### numfactura

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | nfacexpid | numeric | 5,0 | NO | NULL |
| 2 | nfacsocemi | numeric | 10,0 | NO | NULL |
| 3 | nfacsrfcod | character | 1 | NO | NULL |
| 4 | nfacanno | numeric | 5,0 | NO | NULL |
| 5 | nfaccodigo | character | 1 | NO | NULL |
| 6 | nfacconta | numeric | 10,0 | NO | NULL |

### obsaccion

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | obaexpid | numeric | 5,0 | NO | NULL |
| 2 | obaacccod | character | 2 | NO | NULL |
| 3 | obaobscod | character | 2 | NO | NULL |
| 4 | obatiplote | character | 1 | NO | NULL |
| 5 | obainterio | character | 1 | NO | 'S'::bpchar |
| 6 | obaexterio | character | 1 | NO | 'S'::bpchar |
| 7 | obatmenid | numeric | 10,0 | YES | NULL |
| 8 | obaetqid | numeric | 5,0 | YES | NULL |
| 9 | obalibnorep | character | 1 | NO | 'N'::bpchar |
| 10 | obahstusu | character varying | 10 | NO | ' '::character varying |
| 11 | obahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 12 | obatcmid | numeric | 5,0 | YES | NULL |
| 13 | obasntelelec | character | 1 | NO | 'N'::bpchar |
| 14 | obasnauto | character | 1 | NO | 'N'::bpchar |
| 15 | obamodcampo | numeric | 5,0 | YES | 0 |
| 16 | obatipoobs | numeric | 5,0 | YES | NULL |
| 17 | obatiporden | numeric | 5,0 | YES | NULL |
| 18 | obamotorden | numeric | 5,0 | YES | NULL |
| 19 | obamotcambio | character | 2 | YES | NULL |
| 20 | obasnlimite | character | 1 | NO | 'N'::bpchar |

### obsacomet

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | oacocod | character | 4 | NO | NULL |
| 2 | oacodesc | character varying | 30 | NO | NULL |
| 3 | oacoindblk | numeric | 5,0 | NO | NULL |

### observac

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | obscod | character | 2 | NO | NULL |
| 2 | obstxtid | numeric | 10,0 | NO | NULL |
| 3 | obstipocal | character | 1 | NO | NULL |
| 4 | obslecreal | character | 1 | NO | NULL |
| 5 | obsesfuga | character | 1 | NO | NULL |
| 6 | obsmotnoca | character | 1 | NO | NULL |
| 7 | obsmotcamb | character | 1 | NO | NULL |
| 8 | obsactivo | character | 1 | NO | NULL |
| 9 | obsdiascambio | numeric | 5,0 | YES | NULL |
| 10 | obshstusu | character varying | 10 | NO | NULL |
| 11 | obshsthora | timestamp without time zone |  | NO | NULL |
| 12 | obsagrucam | character | 2 | YES | NULL |
| 13 | obsperirep | character varying | 30 | YES | NULL |
| 14 | obsnumperrep | numeric | 5,0 | YES | NULL |
| 15 | obssnaltnuerep | character | 1 | NO | 'S'::bpchar |
| 16 | obsesauto | character | 1 | NO | 'N'::bpchar |
| 17 | obsnota | character | 1 | NO | 'N'::bpchar |
| 18 | obslectvalida | character | 1 | NO | 'N'::bpchar |
| 19 | obsaveria | character | 1 | NO | 'N'::bpchar |
| 20 | obsdesmarcaraveria | character | 1 | NO | 'N'::bpchar |
| 21 | obsnoestimar | character | 1 | NO | 'N'::bpchar |
| 22 | obsestadollave | numeric | 5,0 | YES | NULL |
| 23 | obsgenerarcom | character | 1 | NO | 'N'::bpchar |

### obsfirmaelectronica

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | obffecid | numeric | 10,0 | NO | NULL |
| 2 | obfotobsid | numeric | 10,0 | NO | NULL |
| 3 | obfotindice | numeric | 5,0 | NO | NULL |

### obsids

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | obsid | numeric | 10,0 | NO | NULL |

### obslectao

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | oltexpid | numeric | 5,0 | NO | NULL |
| 2 | oltobscod | character | 2 | NO | NULL |
| 3 | oltobstao | numeric | 5,0 | NO | NULL |

### obspermiso

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | obpexpid | numeric | 5,0 | NO | NULL |
| 2 | obpobscod | character | 2 | NO | NULL |
| 3 | obppermitz | character | 1 | NO | NULL |
| 4 | obppltant | character | 1 | NO | NULL |
| 5 | obppeqant | character | 1 | NO | NULL |
| 6 | obppltesp | character | 1 | NO | NULL |
| 7 | obppgtesp | character | 1 | NO | NULL |
| 8 | obphstusu | character varying | 10 | NO | NULL |
| 9 | obphsthora | timestamp without time zone |  | NO | NULL |
| 10 | obpsnnoenvtpl | character | 1 | NO | 'N'::bpchar |
| 11 | obpsnconsumcor | character | 1 | NO | 'N'::bpchar |
| 12 | obpsnconigcerosumcor | character | 1 | NO | 'N'::bpchar |
| 13 | obpprorrtel | character | 1 | NO | 'N'::bpchar |
| 14 | obpvalcerrar | character | 1 | NO | 'N'::bpchar |
| 15 | obpvalrevisar | character | 1 | NO | 'N'::bpchar |

### obstext

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | otobsid | numeric | 10,0 | NO | NULL |
| 2 | otindice | numeric | 5,0 | NO | NULL |
| 3 | otusuid | character varying | 10 | YES | NULL |
| 4 | otfecha | date |  | NO | NULL |
| 5 | ottobsid | numeric | 5,0 | NO | NULL |
| 6 | ottexto | character varying | 80 | NO | NULL |
| 7 | otfecvigencia | date |  | YES | NULL |

### oficcobro

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | occofiid | numeric | 5,0 | NO | NULL |
| 2 | occcanaid | character | 1 | NO | NULL |

### oficina

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ofiid | numeric | 5,0 | NO | NULL |
| 2 | ofiviacod | character | 2 | NO | NULL |
| 3 | ofidescrip | character varying | 25 | NO | NULL |
| 4 | ofidirid | numeric | 10,0 | YES | NULL |
| 5 | ofitelef1 | character varying | 16 | YES | NULL |
| 6 | ofitelef2 | character varying | 16 | YES | NULL |
| 7 | ofitelef3 | character varying | 16 | YES | NULL |
| 8 | ofifax | character varying | 16 | YES | NULL |
| 9 | ofirespon | character varying | 36 | YES | NULL |
| 10 | ofihorvera | character varying | 100 | YES | NULL |
| 11 | ofihorinvi | character varying | 100 | YES | NULL |
| 12 | ofiadmitot | character | 1 | YES | NULL |
| 13 | ofiprsid | numeric | 10,0 | NO | NULL |
| 14 | ofitofid | numeric | 5,0 | NO | NULL |
| 15 | oficbecodigo | character varying | 6 | NO | NULL |
| 16 | oficodcrisol | character | 3 | YES | NULL |
| 17 | ofisnincfdoc | character | 1 | NO | NULL |
| 18 | ofisnregcto | character | 1 | NO | NULL |
| 19 | ofisnimpord | character | 1 | NO | 'S'::bpchar |
| 20 | ofihstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 21 | ofihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 22 | ofisnanadircobro | character | 1 | NO | 'N'::bpchar |
| 23 | ofisnvermsgconf | character | 1 | NO | 'S'::bpchar |
| 24 | ofisnvermsgrecibicob | character | 1 | NO | 'S'::bpchar |
| 25 | ofisnmoddatfacaltcon | character | 1 | NO | 'S'::bpchar |
| 26 | ofisnrealgrab | character | 1 | NO | 'N'::bpchar |
| 27 | ofisnfirelec | character | 1 | NO | 'N'::bpchar |
| 28 | ofisndifdoc | character | 1 | NO | 'N'::bpchar |
| 29 | ofisopfirele | numeric | 5,0 | NO | '1'::numeric |

### ofidocfirele

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | odfeofiid | numeric | 5,0 | NO | NULL |
| 2 | odfetpdid | numeric | 5,0 | NO | NULL |

### ofifpago

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ofpofiid | numeric | 5,0 | NO | NULL |
| 2 | ofpfmpcanal | character | 1 | NO | NULL |
| 3 | ofpfmpid | numeric | 5,0 | NO | NULL |
| 4 | ofpdefecto | character | 1 | NO | NULL |
| 5 | ofpccid | numeric | 5,0 | YES | NULL |

### ofisocgest

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | osgofiid | numeric | 5,0 | NO | NULL |
| 2 | osgsocid | numeric | 10,0 | NO | NULL |
| 3 | osgcbecodigo | character varying | 6 | NO | NULL |
| 4 | osgsnactivo | character | 1 | NO | NULL |
| 5 | osghstusu | character varying | 10 | NO | NULL |
| 6 | osghsthora | timestamp without time zone |  | NO | NULL |

### ofiterminal

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | oftterid | numeric | 10,0 | NO | NULL |
| 2 | oftofiid | numeric | 5,0 | NO | NULL |
| 3 | oftterdesc | character varying | 100 | NO | NULL |
| 4 | oftteremail | character varying | 150 | NO | NULL |

### opecarfac

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ocfopecart | numeric | 10,0 | NO | NULL |
| 2 | ocffactura | numeric | 10,0 | NO | NULL |
| 3 | ocfestantf | numeric | 5,0 | NO | NULL |
| 4 | ocfmotivod | numeric | 5,0 | YES | NULL |
| 5 | ocfliquida | numeric | 5,0 | YES | NULL |
| 6 | ocfgestorrecobro | numeric | 10,0 | YES | NULL |
| 7 | ocfrecobro | character | 1 | YES | NULL |

### opecarfacint

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | opfiocgid | numeric | 10,0 | NO | NULL |
| 2 | opfifacid | numeric | 10,0 | NO | NULL |

### opecarfacjuicio

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ocfjopecart | numeric | 10,0 | NO | NULL |
| 2 | ocfjfactura | numeric | 10,0 | NO | NULL |
| 3 | ocfjestantf | numeric | 5,0 | NO | NULL |
| 4 | ocfjmotivod | numeric | 5,0 | YES | NULL |
| 5 | ocfjliquida | numeric | 5,0 | YES | NULL |
| 6 | ocfjgestorrecobro | numeric | 10,0 | YES | NULL |
| 7 | ocfjrecobro | character | 1 | YES | NULL::bpchar |

### opecargest

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ocgid | numeric | 10,0 | NO | NULL |
| 2 | ocggescart | numeric | 10,0 | NO | NULL |
| 3 | ocgoperaci | numeric | 5,0 | NO | NULL |
| 4 | ocgviacomu | character | 2 | NO | NULL |
| 5 | ocghora | time without time zone |  | NO | NULL |
| 6 | ocgasiento | numeric | 10,0 | YES | NULL |
| 7 | ocgextrid | numeric | 10,0 | YES | NULL |
| 8 | ocgimperr | numeric | 18,2 | NO | NULL |
| 9 | ocgpcsid | numeric | 10,0 | YES | NULL |
| 10 | ocgexpid | numeric | 5,0 | NO | NULL |
| 11 | ocgpctinteres | numeric | 5,2 | YES | NULL |
| 12 | ocgimpinteres | numeric | 18,2 | YES | NULL |
| 13 | ocggastosftoid | numeric | 10,0 | YES | NULL |
| 14 | ocgsnrecargo | character | 1 | NO | 'S'::bpchar |
| 15 | ocgfecvto | date |  | YES | NULL |
| 16 | ocgsnarchiv | character | 1 | NO | 'N'::bpchar |
| 17 | ocgusuiddef | character varying | 10 | YES | NULL |
| 18 | ocgfechadef | timestamp without time zone |  | YES | NULL |
| 19 | ocgofiiddef | numeric | 5,0 | YES | NULL |
| 20 | ocgusuidprov | character varying | 10 | NO | NULL |
| 21 | ocgfechaprov | timestamp without time zone |  | NO | NULL |
| 22 | ocgofiidprov | numeric | 5,0 | NO | NULL |
| 23 | ocghoradef | time without time zone |  | YES | NULL |
| 24 | ococgidcobro | numeric | 10,0 | YES | NULL |

### opecargestcea

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | opcsecundaria | numeric | 10,0 | NO | NULL |
| 2 | opcprincipal | numeric | 10,0 | NO | NULL |

### opecargestcon

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | occid | numeric | 10,0 | NO | NULL |
| 2 | occfechacontable | date |  | YES | NULL |

### opecarrec

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ocropedot | numeric | 10,0 | NO | NULL |
| 2 | ocroperec | numeric | 10,0 | NO | NULL |

### opecartera

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ocaid | numeric | 5,0 | NO | NULL |
| 2 | ocatxtid | numeric | 10,0 | NO | NULL |
| 3 | ocatipasie | numeric | 5,0 | YES | NULL |

### opedesfac

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | opdfopdid | numeric | 10,0 | NO | NULL |
| 2 | opdffacid | numeric | 10,0 | NO | NULL |

### opedesglos

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | opdid | numeric | 10,0 | NO | NULL |
| 2 | opdopecart | numeric | 10,0 | NO | NULL |
| 3 | opdcanal | character | 1 | NO | NULL |
| 4 | opdfrmpago | numeric | 5,0 | NO | NULL |
| 5 | opdimporte | numeric | 18,2 | NO | NULL |
| 6 | opdsescrea | numeric | 10,0 | NO | NULL |
| 7 | opdsespago | numeric | 10,0 | YES | NULL |
| 8 | opdageid | numeric | 5,0 | YES | NULL |
| 9 | opdbanco | numeric | 5,0 | YES | NULL |
| 10 | opdreferen | character varying | 61 | YES | NULL |
| 11 | opdfecopeb | date |  | YES | NULL |
| 12 | opdfecprev | date |  | NO | NULL |
| 13 | opdasiento | numeric | 10,0 | YES | NULL |
| 14 | opdtipopecaja | numeric | 5,0 | YES | NULL |
| 15 | opdsnpropio | character | 1 | NO | 'S'::bpchar |
| 16 | opdsnintereses | character | 1 | NO | 'N'::bpchar |
| 17 | opdopdiddevol | numeric | 10,0 | YES | NULL |
| 18 | opdnumcta | character varying | 18 | YES | NULL |
| 19 | opdfecchec | date |  | YES | NULL |
| 20 | opdnciclo | numeric | 5,0 | YES | NULL |
| 21 | opdnumremesas | numeric | 5,0 | NO | 0 |
| 22 | opdcuotadev | numeric | 14,0 | YES | NULL |
| 23 | opdnumcuota | numeric | 5,0 | YES | NULL |
| 24 | opdavisovenccuocp | character | 1 | NO | 'N'::bpchar |
| 25 | opdimporteorig | numeric | 18,2 | YES | NULL |
| 26 | opdopdidorig | numeric | 10,0 | YES | NULL |
| 27 | opdopdiddevolfict | numeric | 10,0 | YES | NULL |

### opedesgloscon

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | odcid | numeric | 10,0 | NO | NULL |
| 2 | odcfechacontable | date |  | YES | NULL |

### opefacamort

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ofaocgid | numeric | 10,0 | NO | NULL |
| 2 | ofafacid | numeric | 10,0 | NO | NULL |
| 3 | ofaocgidamor | numeric | 10,0 | YES | NULL |
| 4 | ofaestantfac | numeric | 5,0 | YES | NULL |

### opefirmaelectronica

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ofefecid | numeric | 10,0 | NO | NULL |
| 2 | ofetipo | numeric | 5,0 | NO | NULL |
| 3 | ofeestado | numeric | 5,0 | NO | NULL |
| 4 | ofefecrec | timestamp without time zone |  | YES | NULL |

### operacionperfil

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | opperfid | numeric | 5,0 | NO | NULL |
| 2 | optoperacid | numeric | 5,0 | NO | NULL |
| 3 | opcantidad | numeric | 18,2 | YES | NULL |
| 4 | opnrooperacion | numeric | 5,0 | YES | NULL |

### operleccam

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | olccontcod | numeric | 5,0 | NO | NULL |
| 2 | olcoperid | numeric | 5,0 | NO | NULL |
| 3 | olcnombre | character varying | 80 | NO | NULL |
| 4 | olcnif | character varying | 15 | NO | NULL |
| 5 | olchstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | olchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | olcusuid | character varying | 10 | YES | NULL |
| 8 | olcsnlector | character | 1 | NO | 'N'::bpchar |
| 9 | olcusurid | numeric | 10,0 | YES | NULL |

### orddistcalle

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | orcexpid | numeric | 5,0 | NO | NULL |
| 2 | orcortid | numeric | 5,0 | NO | NULL |
| 3 | orcncalcalid | numeric | 10,0 | NO | NULL |

### orddistrito

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ortid | numeric | 5,0 | NO | NULL |
| 2 | ortexpid | numeric | 5,0 | NO | NULL |
| 3 | ortcod | character varying | 10 | NO | NULL |
| 4 | orttxtid | numeric | 10,0 | NO | NULL |

### orden

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ordid | numeric | 10,0 | NO | NULL |
| 2 | ordtpoid | numeric | 5,0 | NO | NULL |
| 3 | ordptosid | numeric | 10,0 | NO | NULL |
| 4 | ordpccid | numeric | 10,0 | YES | NULL |
| 5 | ordgesid | numeric | 10,0 | YES | NULL |
| 6 | ordpolnum | numeric | 10,0 | YES | NULL |
| 7 | ordmvoid | numeric | 5,0 | NO | NULL |
| 8 | ordcontvie | numeric | 10,0 | YES | NULL |
| 9 | ordcontnue | numeric | 10,0 | YES | NULL |
| 10 | ordlecvie1 | numeric | 10,0 | YES | NULL |
| 11 | ordlecvie2 | numeric | 10,0 | YES | NULL |
| 12 | ordlecnue1 | numeric | 10,0 | YES | NULL |
| 13 | ordlecnue2 | numeric | 10,0 | YES | NULL |
| 14 | ordestado | numeric | 5,0 | NO | NULL |
| 15 | ordvisita | numeric | 10,0 | YES | NULL |
| 16 | ordobsid | numeric | 10,0 | YES | NULL |
| 17 | ordfactrep | character | 1 | NO | NULL |
| 18 | ordgscid | numeric | 10,0 | YES | NULL |
| 19 | ordoficina | numeric | 5,0 | NO | 0 |
| 20 | ordfecestfin | date |  | YES | NULL |
| 21 | ordgespid | numeric | 10,0 | YES | NULL |
| 22 | ordgotid | character varying | 36 | YES | NULL |
| 23 | ordhstusu | character varying | 10 | NO | ''::character varying |
| 24 | ordhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 25 | ordobscod | character | 2 | YES | NULL |
| 26 | ordtrepid | numeric | 5,0 | YES | NULL |
| 27 | ordexpany | numeric | 5,0 | YES | NULL |
| 28 | ordexpnum | character varying | 20 | YES | NULL |
| 29 | ordsnvalpaso | character | 1 | YES | NULL |
| 30 | ordemplidvie | character | 2 | YES | NULL |
| 31 | ordfilbatvie | numeric | 5,0 | YES | NULL |
| 32 | ordcolbatvie | numeric | 5,0 | YES | NULL |
| 33 | ordemplidnue | character | 2 | YES | NULL |
| 34 | ordfilbatnue | numeric | 5,0 | YES | NULL |
| 35 | ordcolbatnue | numeric | 5,0 | YES | NULL |
| 36 | ordseqestado | numeric | 5,0 | NO | 1 |
| 37 | ordrescertaut | character varying | 250 | YES | NULL |
| 38 | ordnoinsemisor | character | 1 | YES | NULL |
| 39 | ordfacid | numeric | 10,0 | YES | NULL |
| 40 | ordrefexterna | character varying | 15 | YES | NULL |
| 41 | ordsnexterna | character | 1 | NO | 'N'::bpchar |
| 42 | ordnconivel | numeric | 5,0 | YES | NULL |
| 43 | ordtipofraude | numeric | 5,0 | YES | NULL |
| 44 | ordspcid | numeric | 10,0 | YES | NULL |

### ordenanucob

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | oracgscid | numeric | 10,0 | NO | NULL |
| 2 | oracordid | numeric | 10,0 | NO | NULL |
| 3 | oracestado | numeric | 5,0 | NO | NULL |

### ordenestad

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | oreordid | numeric | 10,0 | NO | NULL |
| 2 | oreestado | numeric | 5,0 | NO | NULL |
| 3 | oreoficina | numeric | 5,0 | NO | 0 |
| 4 | orehstusu | character varying | 10 | NO | ''::character varying |
| 5 | orehsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 6 | oreseqestado | numeric | 5,0 | NO | 1 |

### ordenreapertura

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | oreaid | numeric | 10,0 | NO | NULL |
| 2 | oreaordid | numeric | 10,0 | NO | NULL |
| 3 | oreavarid | numeric | 10,0 | NO | NULL |
| 4 | oreacptoid | numeric | 5,0 | NO | NULL |
| 5 | oreafecini | date |  | YES | NULL |
| 6 | oreafecfin | date |  | YES | NULL |

### ordenrel

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ordrelp | numeric | 10,0 | NO | NULL |
| 2 | ordrelh | numeric | 10,0 | NO | NULL |
| 3 | ordreltip | numeric | 5,0 | NO | NULL |

### ordenvisit

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | orvid | numeric | 10,0 | NO | NULL |
| 2 | orvordid | numeric | 10,0 | NO | NULL |
| 3 | orvfeccita | date |  | YES | NULL |
| 4 | orvhorcitd | time without time zone |  | YES | NULL |
| 5 | orvhorcith | time without time zone |  | YES | NULL |
| 6 | orvfecvisi | date |  | YES | NULL |
| 7 | orvhorvisi | time without time zone |  | YES | NULL |
| 8 | orvcontcod | numeric | 5,0 | YES | NULL |
| 9 | orvoperid | numeric | 5,0 | YES | NULL |
| 10 | orvtpiid | numeric | 5,0 | YES | NULL |
| 11 | orvestado | numeric | 5,0 | NO | NULL |
| 12 | orvobs | character varying | 300 | YES | NULL |
| 13 | orvfranjaid | numeric | 5,0 | YES | NULL |
| 14 | orvperfilid | numeric | 5,0 | YES | NULL |
| 15 | orvdistriid | numeric | 5,0 | YES | NULL |
| 16 | orvnomresp | character varying | 30 | YES | NULL |
| 17 | orvape1resp | character varying | 60 | YES | NULL |
| 18 | orvape2resp | character varying | 30 | YES | NULL |
| 19 | orvnifresp | character varying | 15 | YES | NULL |
| 20 | orvtelresp | character varying | 11 | YES | NULL |
| 21 | orvrelinsid | numeric | 10,0 | YES | NULL |
| 22 | ordvgotid | character varying | 36 | YES | NULL |

### ordfranja

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | orfid | numeric | 5,0 | NO | NULL |
| 2 | orfexpid | numeric | 5,0 | NO | NULL |
| 3 | orfcod | character varying | 20 | NO | NULL |
| 4 | orftxtid | numeric | 10,0 | NO | NULL |
| 5 | orforpid | numeric | 5,0 | NO | 0 |

### ordperfil

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | orpid | numeric | 5,0 | NO | NULL |
| 2 | orpexpid | numeric | 5,0 | NO | NULL |
| 3 | orpcod | character varying | 20 | NO | NULL |
| 4 | orptxtid | numeric | 10,0 | NO | NULL |

### orifraude

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | orifraid | numeric | 5,0 | NO | NULL |
| 2 | orifratxtid | numeric | 10,0 | NO | NULL |
| 3 | orifrahstusu | character varying | 10 | NO | ''::character varying |
| 4 | orifrahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### origen

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | oriid | character | 2 | NO | NULL |
| 2 | oritxtid | numeric | 10,0 | NO | NULL |
| 3 | orihstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 4 | orihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | orivalidocrmov | character | 1 | NO | 'N'::bpchar |
