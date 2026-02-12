# Database Map - Tables E*, F*, G*
## Schema: cf_quere_pro

Total tables: 165

### elemestruc
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | elsid | numeric | 5,0 | NO | NULL |
| 2 | elsdescrip | character varying | 50 | NO | NULL |
| 3 | elsdescabr | character varying | 5 | NO | NULL |
| 4 | elstlmcod | character varying | 5 | NO | NULL |
| 5 | elsnieid | numeric | 5,0 | NO | NULL |
| 6 | elselsid | numeric | 5,0 | YES | NULL |
| 7 | elshstusu | character varying | 10 | NO | NULL |
| 8 | elshsthora | timestamp without time zone | - | NO | NULL |

### emisordefimp
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ediexpid | numeric | 5,0 | NO | NULL |
| 2 | edisocemi | numeric | 10,0 | NO | NULL |
| 3 | edidfiid | numeric | 5,0 | NO | NULL |
| 4 | edimtfcod | numeric | 5,0 | NO | NULL |
| 5 | ediopera | numeric | 5,0 | NO | NULL |
| 6 | edisnactivo | character | 1 | NO | NULL |
| 7 | edihstusu | character varying | 10 | NO | NULL |
| 8 | edihsthora | timestamp without time zone | - | NO | NULL |
| 9 | ediprior | numeric | 5,0 | YES | NULL |

### emisorventban
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | evbemisoid | numeric | 10,0 | NO | NULL |
| 2 | evbsufijo | numeric | 3,0 | NO | NULL |
| 3 | evbsocprsid | numeric | 10,0 | NO | NULL |
| 4 | evbofiid | numeric | 5,0 | NO | NULL |
| 5 | evbhstusu | character varying | 10 | NO | NULL |
| 6 | evbhsthora | timestamp without time zone | - | NO | NULL |
| 7 | evbformato | numeric | 5,0 | NO | 57 |
| 8 | evbcodtributo | character varying | 3 | YES | NULL |
| 9 | evbsnrafmig | character | 1 | NO | 'N'::bpchar |

### emplazto
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | emplid | character | 2 | NO | NULL |
| 2 | empltxtid | numeric | 10,0 | NO | NULL |
| 3 | emplintext | character | 1 | NO | NULL |
| 4 | emplgradif | numeric | 5,0 | NO | NULL |
| 5 | emplbateri | character | 1 | NO | NULL |
| 6 | emplhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 7 | emplhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### en_ejecucion
Columns: 1

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | count | bigint | 64,0 | YES | NULL |

### ensobrador
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | esdprsid | numeric | 10,0 | NO | NULL |
| 2 | esdfactur | character | 1 | NO | NULL |
| 3 | esdcartas | character | 1 | NO | NULL |
| 4 | esdactivo | character | 1 | NO | NULL |
| 5 | esdcodext | numeric | 5,0 | NO | NULL |
| 6 | esdhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 7 | esdhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### entidades
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | entid | numeric | 10,0 | NO | NULL |
| 2 | entexpid | numeric | 5,0 | NO | NULL |
| 3 | entdescri | numeric | 10,0 | YES | NULL |
| 4 | entfinalidad | numeric | 10,0 | YES | NULL |
| 5 | entcesion | numeric | 10,0 | YES | NULL |

### entmenu
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | emfuncod | character varying | 50 | NO | NULL |
| 2 | emtipo | numeric | 5,0 | NO | NULL |
| 3 | emclase | character varying | 150 | YES | NULL |
| 4 | emdetalle | character varying | 150 | YES | NULL |
| 5 | emtittabla | character varying | 80 | YES | NULL |
| 6 | emborrar | character | 1 | NO | 'S'::bpchar |
| 7 | emmodificar | character | 1 | NO | 'S'::bpchar |
| 8 | emnuevo | character | 1 | NO | 'S'::bpchar |
| 9 | emclasedao | character varying | 150 | YES | NULL |
| 10 | emmetdao | character varying | 50 | YES | NULL |
| 11 | emcompexpl | character | 1 | NO | 'N'::bpchar |

### envioplataformas
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | envpidenvio | character varying | 50 | NO | NULL |
| 2 | envpfinal | character | 1 | NO | 'N'::bpchar |
| 3 | envptcom | numeric | 5,0 | NO | NULL |

### enviosaytozgz
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eazgzid | numeric | 10,0 | NO | NULL |
| 2 | eazgzhora | timestamp without time zone | - | NO | NULL |
| 3 | eazgztipo | character | 1 | NO | NULL |
| 4 | eazgznombre | character varying | 20 | NO | NULL |
| 5 | eazgzestado | character | 2 | NO | NULL |
| 6 | eazgzfecini | date | - | NO | trunc(CURRENT_DATE) |
| 7 | eazgzfecfin | date | - | NO | trunc(CURRENT_DATE) |

### epigrafe
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | epiid | numeric | 10,0 | NO | NULL |
| 2 | epidescrip | character varying | 500 | NO | NULL |
| 3 | episntardom | character | 1 | NO | 'N'::bpchar |
| 4 | episndettramos | character | 1 | NO | 'N'::bpchar |

### equipo
Columns: 21

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eqid | numeric | 10,0 | NO | NULL |
| 2 | eqtecno | numeric | 5,0 | YES | NULL |
| 3 | eqpremontado | character | 1 | NO | 'N'::bpchar |
| 4 | eqvmodelo | numeric | 10,0 | YES | NULL |
| 5 | eqpesopulso | numeric | 10,0 | YES | NULL |
| 6 | eqvhfmodulo | character varying | 16 | YES | NULL |
| 7 | eqimeterequipo | character varying | 15 | YES | NULL |
| 8 | eqimeteroptions | numeric | 10,0 | YES | NULL |
| 9 | eqbusserie | character varying | 7 | YES | NULL |
| 10 | eqinstalado | character | 1 | NO | 'N'::bpchar |
| 11 | eqlectinicial | numeric | 10,0 | YES | NULL |
| 12 | eqfechainstala | timestamp without time zone | - | YES | NULL |
| 13 | eqhstusu | character varying | 10 | YES | NULL |
| 14 | eqhsthora | timestamp without time zone | - | YES | NULL |
| 15 | eqpulsoemi | numeric | 5,1 | YES | NULL |
| 16 | eqlwmodulo | character varying | 50 | YES | NULL |
| 17 | eqmarcatelec | numeric | 5,0 | YES | NULL |
| 18 | eqmodeltelec | numeric | 5,0 | YES | NULL |
| 19 | eqclaveadic | character varying | 50 | YES | NULL |
| 20 | eqbusnbiotserie | character varying | 50 | YES | NULL |
| 21 | eqsndeportado | character | 1 | YES | NULL |

### errfirmaelectronica
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | efeid | numeric | 10,0 | NO | NULL |
| 2 | efefecha | timestamp without time zone | - | NO | NULL |
| 3 | efetipo | numeric | 5,0 | NO | NULL |
| 4 | efeparam | character varying | 500 | YES | NULL |
| 5 | efesnvalidado | character | 1 | NO | 'N'::bpchar |
| 6 | efeusuvalida | character varying | 10 | YES | NULL |
| 7 | efefecvalida | timestamp without time zone | - | YES | NULL |

### errorfac
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | erfid | numeric | 10,0 | NO | NULL |
| 2 | erfftoid | numeric | 10,0 | NO | NULL |
| 3 | erfcnttnum | numeric | 10,0 | NO | NULL |
| 4 | erftexto | character varying | 500 | YES | NULL |

### errtelelect
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etxid | numeric | 5,0 | NO | NULL |
| 2 | etxsistema | numeric | 5,0 | NO | NULL |
| 3 | etxcodigo | character varying | 50 | NO | NULL |
| 4 | etxtxtid | numeric | 10,0 | NO | NULL |
| 5 | etxsnignwar | character | 1 | NO | 'N'::bpchar |
| 6 | etxsnautoval | character | 1 | NO | 'N'::bpchar |

### errtpvvirt
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | errtpvid | numeric | 10,0 | NO | NULL |
| 2 | errtpvusuid | character varying | 10 | NO | NULL |
| 3 | errtpvhstshora | timestamp without time zone | - | NO | NULL |
| 4 | errtpvcnttnum | numeric | 10,0 | NO | NULL |
| 5 | errtpvfacimp | numeric | 18,2 | NO | NULL |
| 6 | errtpvnumcom | character | 16 | NO | NULL |
| 7 | errtpvnumter | character | 16 | NO | NULL |
| 8 | errtpvdesc | character varying | 2048 | YES | NULL |
| 9 | errtpvcodresp | character | 32 | YES | NULL |
| 10 | errtpvidrts | character | 32 | YES | NULL |
| 11 | errtpverrcom | character | 1 | NO | 'N'::bpchar |

### estadcsb57
Columns: 18

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | estid | numeric | 10,0 | NO | NULL |
| 2 | estgscid | numeric | 10,0 | NO | NULL |
| 3 | estocgid | numeric | 10,0 | YES | NULL |
| 4 | estcnttnum | numeric | 10,0 | YES | NULL |
| 5 | estrefcobro | numeric | 10,0 | YES | NULL |
| 6 | estrefmsepa | numeric | 10,0 | YES | NULL |
| 7 | estsencid | numeric | 10,0 | YES | NULL |
| 8 | estnotcsid | numeric | 5,0 | YES | NULL |
| 9 | estctabanco | character varying | 25 | YES | NULL |
| 10 | estcanalid | character | 1 | NO | NULL |
| 11 | estnumentcob | character varying | 5 | NO | NULL |
| 12 | estnumoficob | character varying | 5 | NO | NULL |
| 13 | estfechacob | date | - | NO | NULL |
| 14 | estimporte | numeric | 18,2 | NO | NULL |
| 15 | estfeclimpago | date | - | NO | NULL |
| 16 | estcodanu | character | 1 | YES | NULL |
| 17 | estrefcobrof | character varying | 50 | NO | NULL |
| 18 | estnumlinea | numeric | 10,0 | NO | NULL |

### estadofraude
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | efrcod | numeric | 5,0 | NO | NULL |
| 2 | efrtxtid | numeric | 10,0 | NO | NULL |

### estadomotrec
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | esmrid | numeric | 5,0 | NO | NULL |
| 2 | esmrtxtid | numeric | 10,0 | NO | NULL |
| 3 | esmrtiprech | character varying | 50 | NO | NULL |

### estadosjuicios
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | esjcod | numeric | 5,0 | NO | NULL |
| 2 | esjtxtid | numeric | 10,0 | NO | NULL |

### estadossicer
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | esicod | character | 2 | NO | NULL |
| 2 | esitxtid | numeric | 10,0 | NO | NULL |
| 3 | esisnactivo | character | 1 | NO | NULL |

### estfirmaelectronica
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | efecodigo | numeric | 5,0 | NO | NULL |
| 2 | efetxtid | numeric | 10,0 | NO | NULL |
| 3 | efesnrenv | character | 1 | NO | 'N'::bpchar |
| 4 | efesncanc | character | 1 | NO | 'N'::bpchar |
| 5 | efetpenvdig | numeric | 5,0 | YES | 0 |
| 6 | efesnavrecl | character | 1 | NO | 'N'::bpchar |
| 7 | efeviaenv | numeric | 5,0 | NO | 1 |
| 8 | efesndesbl | character | 1 | NO | 'N'::bpchar |
| 9 | efesnrenvmail | character | 1 | NO | 'N'::bpchar |

### estimnogen
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | estlotcod | character | 12 | NO | NULL |
| 2 | estconid | numeric | - | NO | NULL |
| 3 | estpocid | numeric | - | NO | NULL |
| 4 | estesfera | numeric | - | NO | NULL |
| 5 | estfechale | timestamp without time zone | - | NO | NULL |
| 6 | estoriid | character | 2 | NO | NULL |
| 7 | estmotivo | character | 150 | NO | NULL |
| 8 | esttipest | character | 1 | NO | NULL |
| 9 | estconsperanyoant | character varying | 15 | YES | NULL |
| 10 | estconsultanyo | character varying | 15 | YES | NULL |
| 11 | estnumcnoleidos | numeric | 5,0 | YES | NULL |

### estopeplatfirma
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eopcodigo | numeric | 5,0 | NO | NULL |
| 2 | eopdescid | numeric | 10,0 | NO | NULL |
| 3 | eopsnestfin | character | 1 | NO | 'N'::bpchar |
| 4 | eopsnrecevi | character | 1 | NO | 'N'::bpchar |

### estpersautoriz
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | epaid | numeric | 5,0 | NO | NULL |
| 2 | epatxtid | numeric | 10,0 | NO | NULL |
| 3 | epasnactivo | character varying | 1 | NO | NULL |
| 4 | epasngenserv | character | 1 | NO | 'N'::bpchar |
| 5 | epasndefinitivo | character | 1 | NO | 'N'::bpchar |

### etiqueta
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etqid | numeric | 5,0 | NO | NULL |
| 2 | etqdesc | character varying | 30 | NO | NULL |
| 3 | etqtxtid | numeric | 10,0 | NO | NULL |
| 4 | etqexpid | numeric | 5,0 | NO | NULL |

### expccobro
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eccexpid | numeric | 5,0 | NO | NULL |
| 2 | ecccanaid | character | 1 | NO | NULL |
| 3 | eccsnimpdip | character | 1 | NO | NULL |
| 4 | ecctxtid | numeric | 10,0 | YES | NULL |
| 5 | eccsnenvimp | character | 1 | NO | NULL |
| 6 | eccsnimpmsj | character | 1 | NO | NULL |
| 7 | eccsnimpgraf | character | 1 | NO | NULL |
| 8 | ecchstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 9 | ecchsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### expctafrmpago
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ecfpexpid | numeric | 5,0 | NO | NULL |
| 2 | ecfpbngsoc | numeric | 10,0 | NO | NULL |
| 3 | ecfpbngbanid | numeric | 5,0 | NO | NULL |
| 4 | ecfpcanaid | character | 1 | NO | NULL |
| 5 | ecfpfmpid | numeric | 5,0 | NO | NULL |
| 6 | ecfpbngageid | numeric | 5,0 | NO | NULL |
| 7 | ecfpcbecodigo | character varying | 6 | YES | NULL |
| 8 | ecfphstusu | character varying | 10 | YES | NULL |
| 9 | ecfphsthora | timestamp without time zone | - | NO | NULL |
| 10 | ecfpnumcta | character varying | 11 | NO | ''::character varying |
| 11 | ecfpcuentaapp | character | 1 | NO | 'N'::bpchar |

### expedfact
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exfefcid | numeric | 10,0 | NO | NULL |
| 2 | exffacid | numeric | 10,0 | NO | NULL |

### expedrecobro
Columns: 12

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exrcid | numeric | 10,0 | NO | NULL |
| 2 | exrccnttnum | numeric | 10,0 | NO | NULL |
| 3 | exrcfecape | timestamp without time zone | - | NO | NULL |
| 4 | exrcfecven | date | - | NO | NULL |
| 5 | exrcgcprsid | numeric | 10,0 | NO | NULL |
| 6 | exrcgcexpid | numeric | 5,0 | NO | NULL |
| 7 | exrcestado | numeric | 5,0 | NO | 1 |
| 8 | exrcfeccierre | timestamp without time zone | - | YES | NULL |
| 9 | exrcmotfin | numeric | 5,0 | YES | NULL |
| 10 | exrcfecultenv | date | - | NO | CURRENT_DATE |
| 11 | exrchstusu | character varying | 10 | NO | ' '::character varying |
| 12 | exrchsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### expedsif
Columns: 64

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exsid | numeric | 10,0 | NO | NULL |
| 2 | exsfsigins | date | - | YES | NULL |
| 3 | exsnumact | numeric | 5,0 | NO | NULL |
| 4 | exsestado | numeric | 5,0 | NO | NULL |
| 5 | exssnaseso | character | 1 | NO | NULL |
| 6 | exssnespdf | character | 1 | NO | NULL |
| 7 | exsdirecio | numeric | 10,0 | NO | NULL |
| 8 | exspolnum | numeric | 10,0 | YES | NULL |
| 9 | exspersona | numeric | 10,0 | YES | NULL |
| 10 | exsperndir | numeric | 5,0 | YES | NULL |
| 11 | exsoperari | character varying | 30 | YES | NULL |
| 12 | exssnpropi | character | 1 | NO | NULL |
| 13 | exsfinspec | date | - | NO | NULL |
| 14 | exsobsfuen | character varying | 500 | YES | NULL |
| 15 | exsnumcont | character varying | 12 | YES | NULL |
| 16 | exslectura | numeric | 10,0 | YES | NULL |
| 17 | exsfaviso | date | - | YES | NULL |
| 18 | exstxtavis | character varying | 80 | YES | NULL |
| 19 | exsnpolnum | numeric | 10,0 | YES | NULL |
| 20 | exsexpid | numeric | 5,0 | NO | NULL |
| 21 | exsorifraid | numeric | 5,0 | NO | NULL |
| 22 | exstipfraid | numeric | 5,0 | YES | NULL |
| 23 | exscontcod | numeric | 5,0 | YES | NULL |
| 24 | exsoperid | numeric | 5,0 | YES | NULL |
| 25 | exssnproce | character | 1 | YES | NULL |
| 26 | exsestadoant | numeric | 5,0 | YES | NULL |
| 27 | exssnreincidente | character | 1 | YES | NULL |
| 28 | exsusuidaper | character varying | 10 | NO | NULL |
| 29 | exsfechaaper | date | - | NO | NULL |
| 30 | exsusuidsol | character varying | 10 | YES | NULL |
| 31 | exsfechasol | date | - | YES | NULL |
| 32 | exsofiidaper | numeric | 5,0 | NO | NULL |
| 33 | exsofiidsol | numeric | 5,0 | YES | NULL |
| 34 | exssncorte | character | 1 | NO | 'N'::bpchar |
| 35 | exsimporte | numeric | 18,2 | YES | NULL |
| 36 | exsinfraccion | character varying | 16 | YES | NULL |
| 37 | exsfeccamest | date | - | NO | CURRENT_DATE |
| 38 | exshstusu | character | 10 | NO | 'CONVERSION'::bpchar |
| 39 | exshsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 40 | exsmotnofto | numeric | 5,0 | YES | NULL |
| 41 | exscaudal | numeric | 18,2 | YES | NULL |
| 42 | exshoras | numeric | 18,2 | YES | NULL |
| 43 | exsdescuentom3 | numeric | 10,0 | YES | NULL |
| 44 | exsfechainiliq | date | - | YES | NULL |
| 45 | exsfechafinliq | date | - | YES | NULL |
| 46 | exsfecprevcorte | date | - | YES | NULL |
| 49 | exsestadoblq | character | 1 | NO | 'N'::bpchar |
| 50 | exsimportesimulacion | numeric | 18,2 | YES | NULL |
| 51 | exsgcobprsid | numeric | 10,0 | YES | NULL |
| 52 | exsgcobexpid | numeric | 5,0 | YES | NULL |
| 53 | exsreabierto | character | 1 | NO | 'N'::bpchar |
| 54 | exsfentradaworkflow | date | - | YES | NULL |
| 55 | exsfsalidaworkflow | date | - | YES | NULL |
| 56 | exsfaperturaalegacion | date | - | YES | NULL |
| 57 | exsfcierrealegacion | date | - | YES | NULL |
| 58 | exsfeccadest | date | - | YES | NULL |
| 59 | exsfecenviomen | date | - | YES | NULL |
| 60 | exssnbonosocial | character | 1 | NO | 'N'::bpchar |
| 61 | exsjuid | numeric | 10,0 | YES | NULL |
| 62 | exssnctoficticio | character | 1 | NO | 'N'::bpchar |
| 63 | exsimportesifconsim | numeric | 18,2 | YES | NULL |
| 64 | exsimportesifvarsim | numeric | 18,2 | YES | NULL |
| 65 | exscalsifvar | character varying | 200 | YES | NULL |
| 66 | exsdatospolicia | character varying | 500 | YES | NULL |

### expfactcnt
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | efcid | numeric | 10,0 | NO | NULL |
| 2 | efcexpid | numeric | 5,0 | NO | NULL |
| 3 | efccnttnum | numeric | 10,0 | NO | NULL |
| 4 | efcdescri | character varying | 50 | NO | NULL |
| 5 | efcfeccrea | date | - | NO | NULL |
| 6 | efcusucrea | character varying | 50 | NO | NULL |

### expgestofi
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | egoofiid | numeric | 5,0 | NO | NULL |
| 2 | egoexpid | numeric | 5,0 | NO | NULL |
| 3 | egosnactiva | character | 1 | NO | NULL |
| 4 | egosncat | character | 1 | NO | 'N'::bpchar |
| 5 | egosnpropia | character | 1 | NO | NULL |
| 6 | egosnboquejas | character | 1 | NO | NULL |
| 7 | egohstusu | character varying | 10 | NO | NULL |
| 8 | egohsthora | timestamp without time zone | - | NO | NULL |

### expidioma
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exiexpid | numeric | 5,0 | NO | NULL |
| 2 | exiidiid | character | 2 | NO | NULL |

### expinterfazext
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eieexpid | numeric | 5,0 | NO | NULL |
| 2 | eietipo | numeric | 5,0 | NO | NULL |
| 3 | eieurl | character varying | 250 | NO | NULL |
| 4 | eieuser | character varying | 25 | YES | NULL |
| 5 | eiepwd | character varying | 75 | YES | NULL |

### expintervalido
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eivexpid | numeric | 5,0 | NO | NULL |
| 2 | eivcptoid | numeric | 5,0 | NO | NULL |
| 3 | eivttarid | numeric | 5,0 | NO | NULL |
| 4 | eivsubcid | numeric | 5,0 | NO | NULL |
| 5 | eivfecini | date | - | NO | NULL |
| 6 | eivfecfin | date | - | YES | NULL |
| 7 | eivactivo | character | 1 | NO | 'N'::bpchar |
| 8 | eivhstusu | character varying | 10 | NO | NULL |
| 9 | eivhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### explcentdist
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ecdexpid | numeric | 5,0 | NO | NULL |
| 2 | ecdcdbid | numeric | 5,0 | NO | NULL |
| 3 | ecdccfact | character | 8 | YES | NULL |
| 4 | ecdccsera | character | 8 | YES | NULL |
| 5 | ecdcontrato | character varying | 50 | YES | NULL |
| 6 | ecdhstusu | character varying | 10 | NO | NULL |
| 7 | ecdhsthora | timestamp without time zone | - | NO | NULL |

### explobslec
Columns: 10

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eolexpid | numeric | 5,0 | NO | NULL |
| 2 | eolsinlec | character varying | 2 | YES | NULL |
| 3 | eolltant | character varying | 2 | YES | NULL |
| 4 | eoleqant | character varying | 2 | YES | NULL |
| 5 | eolltesp | character varying | 2 | YES | NULL |
| 6 | eolgtesp | character varying | 2 | YES | NULL |
| 7 | eolfrang | character | 2 | YES | NULL |
| 8 | eolconsumcor | character | 2 | YES | NULL |
| 9 | eolconigcerosumcor | character | 2 | YES | NULL |
| 10 | eolprorrtel | character | 2 | YES | NULL |

### explociclinc
Columns: 31

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exciexpid | numeric | 5,0 | NO | NULL |
| 2 | excifdcontr | date | - | YES | NULL |
| 3 | excifhcontr | date | - | YES | NULL |
| 4 | excifdmantcont | date | - | YES | NULL |
| 5 | excifhmantcont | date | - | YES | NULL |
| 6 | excifdlecper | date | - | YES | NULL |
| 7 | excifhlecper | date | - | YES | NULL |
| 8 | excifdcalcons | date | - | YES | NULL |
| 9 | excifhcalcons | date | - | YES | NULL |
| 10 | excifdfacper | date | - | YES | NULL |
| 11 | excifhfacper | date | - | YES | NULL |
| 12 | excifdimpfac | date | - | YES | NULL |
| 13 | excifhimpfac | date | - | YES | NULL |
| 14 | excifdgestcob | date | - | YES | NULL |
| 15 | excifhgestcob | date | - | YES | NULL |
| 16 | excifdrembanc | date | - | YES | NULL |
| 17 | excifhrembanc | date | - | YES | NULL |
| 18 | excifdctarest | date | - | YES | NULL |
| 19 | excifhctarest | date | - | YES | NULL |
| 20 | excifddevbanc | date | - | YES | NULL |
| 21 | excifhdevbanc | date | - | YES | NULL |
| 22 | excifdventban | date | - | YES | NULL |
| 23 | excifhventban | date | - | YES | NULL |
| 24 | excifdgestdeu | date | - | YES | NULL |
| 25 | excifhgestdeu | date | - | YES | NULL |
| 26 | excihstusu | character varying | 10 | YES | NULL |
| 27 | excihsthora | timestamp without time zone | - | NO | NULL |
| 28 | excifdfinprefac | date | - | YES | NULL |
| 29 | excifhfinprefac | date | - | YES | NULL |
| 30 | excifdfacext | date | - | YES | NULL |
| 31 | excifhfacext | date | - | YES | NULL |

### exploclausula
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exclexpid | numeric | 5,0 | NO | NULL |
| 2 | exclclauid | numeric | 5,0 | NO | NULL |
| 3 | exclsnactiva | character | 1 | NO | NULL |
| 4 | excldiasvto | numeric | 5,0 | YES | NULL |
| 5 | exclhstusu | character varying | 10 | NO | NULL |
| 6 | exclhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### exploconscal
Columns: 10

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | excid | numeric | 5,0 | NO | NULL |
| 2 | excexpid | numeric | 5,0 | NO | NULL |
| 3 | exctipest | character | 1 | NO | NULL |
| 4 | excusocod | numeric | 5,0 | NO | NULL |
| 5 | excmestid | numeric | 5,0 | NO | NULL |
| 6 | exccalimm | numeric | 5,0 | NO | NULL |
| 7 | excactipolid | numeric | 5,0 | NO | NULL |
| 8 | exctpsid | numeric | 5,0 | NO | NULL |
| 9 | excconsudiario | numeric | 10,2 | NO | NULL |
| 10 | exclecval | character | 1 | NO | 'N'::bpchar |

### exploctas
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exctexpid | numeric | 5,0 | NO | NULL |
| 2 | exctageid | numeric | 5,0 | NO | NULL |
| 3 | exctbanid | numeric | 5,0 | NO | NULL |
| 4 | exctdigcon | character | 2 | NO | NULL |
| 5 | exctnumcta | character | 10 | NO | NULL |
| 6 | excthstusu | character varying | 10 | NO | NULL |
| 7 | excthsthora | timestamp without time zone | - | NO | NULL |

### exploestim
Columns: 26

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eexpexpid | numeric | 5,0 | NO | NULL |
| 2 | eexptipest | character | 1 | NO | NULL |
| 3 | eexpusocod | numeric | 5,0 | NO | NULL |
| 4 | eexpmestid | numeric | 5,0 | NO | NULL |
| 5 | eexpsnaplint | character | 1 | NO | NULL |
| 6 | eexpsnaplext | character | 1 | NO | NULL |
| 7 | eexpordenapl | numeric | 10,0 | NO | NULL |
| 8 | eexpfiniapl | date | - | NO | NULL |
| 9 | eexpffinapl | date | - | YES | NULL |
| 10 | eexpm3min | numeric | 5,0 | YES | NULL |
| 11 | eexpvalor | numeric | 10,2 | YES | NULL |
| 12 | eexpconsudiario | numeric | 10,3 | YES | NULL |
| 13 | eexpminm3trim | numeric | 5,0 | YES | NULL |
| 14 | eexpmaxm3trim | numeric | 5,0 | YES | NULL |
| 15 | eexpporcpen | numeric | 5,0 | YES | NULL |
| 16 | eexppersup | numeric | 5,0 | YES | NULL |
| 17 | eexppernosup | numeric | 5,0 | YES | NULL |
| 18 | eexphstusu | character varying | 10 | NO | NULL |
| 19 | eexphsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 20 | eexpnumlectreal | numeric | 5,0 | YES | NULL |
| 21 | eexpsnproconfijo | character | 1 | NO | 'N'::bpchar |
| 22 | eexplecval | character | 1 | NO | 'N'::bpchar |
| 23 | eexpdescartar | character | 1 | NO | 'N'::bpchar |
| 24 | eexpnummesespost | numeric | 5,0 | YES | NULL |
| 25 | eexpestimcero | character | 1 | NO | 'N'::bpchar |
| 26 | eexpsnproconfijoab | character | 1 | NO | 'N'::bpchar |

### explomensaje
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exptmenid | numeric | 10,0 | NO | NULL |
| 2 | exptmenexpid | numeric | 5,0 | NO | NULL |
| 3 | exptmenprio | numeric | 5,0 | NO | NULL |
| 4 | exptmenactivo | character | 1 | NO | NULL |
| 5 | exptmenhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 6 | exptmenhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### explomotfact
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | emfexpid | numeric | 5,0 | NO | NULL |
| 2 | emfmtfcod | numeric | 5,0 | NO | NULL |

### explomotfacvencexc
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | emfveexpid | numeric | 5,0 | NO | NULL |
| 2 | emfvemtfcod | numeric | 5,0 | NO | NULL |

### explomotorden
Columns: 12

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exmoexpid | numeric | 5,0 | NO | NULL |
| 2 | exmomvoid | numeric | 5,0 | NO | NULL |
| 3 | exmoplzoprev | numeric | 5,0 | NO | NULL |
| 4 | exmotdmodel | numeric | 5,0 | YES | NULL |
| 5 | exmotdocum | numeric | 5,0 | YES | NULL |
| 6 | exmosnformpropio | character | 1 | NO | 'N'::bpchar |
| 7 | exmohabnat | character | 1 | NO | 'H'::bpchar |
| 8 | exmohstusu | character varying | 10 | NO | NULL |
| 9 | exmohsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 10 | exmosnpermbaja | character | 1 | NO | 'N'::bpchar |
| 11 | exmosncertauto | character | 1 | NO | 'N'::bpchar |
| 12 | exmosncertautofraude | character | 1 | NO | 'N'::bpchar |

### exploperiodic
Columns: 12

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eperexpid | numeric | 5,0 | NO | NULL |
| 2 | eperperiid | numeric | 5,0 | NO | NULL |
| 3 | eperdmrglecper | numeric | 5,0 | NO | NULL |
| 4 | eperdfecvtofac | numeric | 5,0 | NO | NULL |
| 5 | eperdfecpagfac | numeric | 5,0 | NO | NULL |
| 6 | eperdfecpagdev | numeric | 5,0 | NO | NULL |
| 7 | epersnhabitual | character | 1 | NO | 'N'::bpchar |
| 8 | epersncanon | character | 1 | NO | 'S'::bpchar |
| 9 | eperhstusu | character varying | 10 | NO | NULL |
| 10 | eperhsthora | timestamp without time zone | - | NO | NULL |
| 11 | eperdfeclimc60 | numeric | 5,0 | YES | NULL |
| 12 | eperdprorrtel | numeric | 5,0 | YES | NULL |

### exploperiodo
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | expperexpid | numeric | 5,0 | NO | NULL |
| 2 | expperperiid | numeric | 5,0 | NO | NULL |
| 3 | exppernumero | numeric | 5,0 | NO | NULL |
| 4 | exppermesd | numeric | 5,0 | NO | NULL |
| 5 | exppermesh | numeric | 5,0 | NO | NULL |
| 6 | exppertxtid | numeric | 10,0 | NO | NULL |
| 7 | expperhstusu | character varying | 10 | NO | NULL |
| 8 | expperhsthora | timestamp without time zone | - | NO | NULL |

### exploproducto
Columns: 10

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exppprd | numeric | 5,0 | NO | NULL |
| 2 | exppexpid | numeric | 5,0 | NO | NULL |
| 3 | exppactiva | character varying | 1 | NO | 'N'::character varying |
| 4 | exppfecces | timestamp without time zone | - | YES | NULL |
| 5 | exppultenv | timestamp without time zone | - | YES | NULL |
| 6 | exppenvmarcas | timestamp without time zone | - | YES | NULL |
| 7 | expphstusu | character varying | 10 | NO | NULL |
| 8 | expphsthora | timestamp without time zone | - | NO | NULL |
| 9 | exppsncargaini | character | 1 | NO | 'N'::bpchar |
| 10 | exppsnofrecat | character | 1 | NO | 'N'::bpchar |

### explorapro
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exrexpid | numeric | 5,0 | NO | NULL |
| 2 | exrprsid | numeric | 10,0 | NO | NULL |
| 3 | exrdiaspl | numeric | 5,0 | NO | NULL |
| 4 | exropcion | numeric | 5,0 | NO | NULL |
| 5 | exrhstusu | character varying | 10 | NO | NULL |
| 6 | exrhsthora | timestamp without time zone | - | NO | NULL |
| 7 | exrcontrat | character | 1 | NO | 'S'::bpchar |
| 8 | exrbonif | character | 1 | NO | 'N'::bpchar |
| 9 | exrmtbid | numeric | 5,0 | YES | NULL |

### explorgestmk
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | egtexpid | numeric | 5,0 | NO | NULL |
| 2 | egtrgtid | numeric | 5,0 | NO | NULL |
| 3 | egtmaxint | numeric | 5,0 | NO | NULL |
| 4 | egtdiaspxg | numeric | 5,0 | NO | NULL |
| 5 | egtsnefect | character | 1 | NO | NULL |
| 6 | egtsncobro | character | 1 | NO | NULL |
| 7 | egtsnactiv | character | 1 | NO | NULL |

### explosocemi
Columns: 22

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exseexpid | numeric | 5,0 | NO | NULL |
| 2 | exsesocemi | numeric | 10,0 | NO | NULL |
| 3 | exsesocprem | numeric | 10,0 | NO | NULL |
| 4 | exsesocorem | numeric | 10,0 | NO | NULL |
| 5 | exseepigraf | character varying | 30 | YES | NULL |
| 6 | exsesndifcob | character | 1 | NO | 'N'::bpchar |
| 7 | exsediasvto | numeric | 5,0 | YES | NULL |
| 8 | exsepriemi | numeric | 5,0 | NO | NULL |
| 9 | exsehstusu | character varying | 10 | NO | NULL |
| 10 | exsehsthora | timestamp without time zone | - | NO | NULL |
| 11 | exsesnrafdeu | character | 1 | NO | 'N'::bpchar |
| 12 | exsenumimpag | numeric | 5,0 | YES | NULL |
| 13 | exseemisoid | numeric | 10,0 | YES | NULL |
| 14 | exsesufijo | numeric | 3,0 | YES | NULL |
| 15 | exsesndelfirma | character | 1 | NO | 'N'::bpchar |
| 16 | exsesocfirma | numeric | 10,0 | YES | NULL |
| 17 | exsesndistfirm | character | 1 | NO | 'N'::bpchar |
| 18 | exsesndifimp | character | 1 | NO | 'N'::bpchar |
| 19 | exsebngbanid | numeric | 5,0 | YES | NULL |
| 20 | exsebngageid | numeric | 5,0 | YES | NULL |
| 21 | exsenumcta | character varying | 11 | YES | NULL |
| 22 | exsesndifcobfac | character varying | 1 | NO | 'N'::character varying |

### explosocpro
Columns: 28

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exspexpid | numeric | 5,0 | NO | NULL |
| 2 | exspsocprop | numeric | 10,0 | NO | NULL |
| 3 | exspfultliq | date | - | YES | NULL |
| 4 | exspctaper | numeric | 5,0 | YES | NULL |
| 5 | exspsndotmor | character | 1 | NO | NULL |
| 6 | exspsnfac | character | 1 | NO | 'N'::bpchar |
| 7 | exspsnabo | character | 1 | NO | 'N'::bpchar |
| 8 | exspsnref | character | 1 | NO | 'N'::bpchar |
| 9 | exsporden | numeric | 5,0 | NO | NULL |
| 10 | exsptxtccor | numeric | 10,0 | YES | NULL |
| 11 | exspvarccor | numeric | 5,0 | YES | NULL |
| 12 | exspsnimpccor | character | 1 | NO | NULL |
| 13 | exsptxtcvol | numeric | 10,0 | YES | NULL |
| 14 | exspvarcvol | numeric | 5,0 | YES | NULL |
| 15 | exspsnimpcvol | character | 1 | NO | NULL |
| 16 | exsphstusu | character varying | 10 | NO | NULL |
| 17 | exsphsthora | timestamp without time zone | - | NO | NULL |
| 18 | exspsncomrec | character | 1 | NO | 'N'::bpchar |
| 19 | exspsngenfacneg | character | 1 | NO | 'N'::bpchar |
| 20 | exspsngenlotsii | character | 1 | NO | 'S'::bpchar |
| 21 | exsptipolotsii | numeric | 5,0 | YES | NULL |
| 22 | exspsnenvlotsii | character | 1 | NO | 'N'::bpchar |
| 23 | exspsnenvfacsinsim | character | 1 | NO | 'N'::bpchar |
| 24 | exspvarimpintfrac | numeric | 5,0 | YES | NULL |
| 25 | exspsnlineg | character | 1 | YES | 'N'::bpchar |
| 26 | exspsnaseo | character | 1 | NO | 'N'::bpchar |
| 27 | exspsnalcan | character | 1 | NO | 'N'::bpchar |
| 28 | exspperliqsii | character | 1 | NO | 'M'::bpchar |

### explosocsub
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exssexpid | numeric | 5,0 | NO | NULL |
| 2 | exsssocsub | numeric | 10,0 | NO | NULL |

### explotacion
Columns: 350

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | expid | numeric | 5,0 | NO | NULL |
| 2 | expdescri | character varying | 70 | NO | ''::character varying |
| 3 | expfecha | date | - | YES | NULL |
| 4 | expcodigo | character | 4 | NO | '0000'::bpchar |
| 5 | expfecbaja | date | - | YES | NULL |
| 6 | expregimen | character | 1 | YES | NULL |
| 7 | expelsid | numeric | 5,0 | NO | NULL |
| 8 | expemail | character varying | 128 | YES | NULL |
| 9 | expnohabile | character | 15 | NO | 'HHHHHHN'::bpchar |
| 10 | expnohabils | character | 15 | NO | 'HHHHHHN'::bpchar |
| 11 | expciclocom | character | 1 | NO | 'S'::bpchar |
| 12 | exppropcont | character | 1 | NO | 'C'::bpchar |
| 13 | expdiasdevc | numeric | 5,0 | YES | NULL |
| 14 | expimpdocb | character | 1 | NO | 'S'::bpchar |
| 15 | expimpcat | character | 1 | NO | 'S'::bpchar |
| 16 | expmaxdiaspr | numeric | 5,0 | YES | NULL |
| 17 | expcontext | character | 1 | NO | 'N'::bpchar |
| 18 | expcielpv | character | 1 | NO | 'S'::bpchar |
| 19 | expreglfpi | character | 1 | NO | 'N'::bpchar |
| 20 | explotespl | character | 1 | NO | 'N'::bpchar |
| 21 | expestimnl | numeric | 5,0 | NO | 2 |
| 22 | expbolsaest | numeric | 5,0 | NO | 3 |
| 23 | expmaxestim | numeric | 5,0 | NO | 1 |
| 24 | expinccorrep | character | 1 | NO | 'S'::bpchar |
| 25 | expexclfact | character | 1 | NO | 'N'::bpchar |
| 26 | expimpuid | numeric | 5,0 | NO | 1 |
| 27 | expcalfecv | character | 1 | NO | 'S'::bpchar |
| 28 | expcobpprop | character | 1 | NO | 'N'::bpchar |
| 29 | expnplazoscp | numeric | 5,0 | NO | 2 |
| 30 | expcartacdup | character | 1 | NO | 'N'::bpchar |
| 31 | expdiasreminc | numeric | 5,0 | YES | NULL |
| 32 | expdiasvencfact | numeric | 5,0 | NO | NULL |
| 33 | expdiasproxgts | numeric | 5,0 | YES | NULL |
| 34 | expdiasproxgtn | numeric | 5,0 | YES | NULL |
| 35 | expcartadbint | numeric | 5,0 | NO | 1 |
| 36 | expcartadbext | numeric | 5,0 | NO | 3 |
| 37 | expgesttlf | numeric | 5,0 | NO | 1 |
| 38 | expmindiasgt | numeric | 5,0 | NO | NULL |
| 39 | expemisoid | numeric | 10,0 | YES | NULL |
| 40 | expsufijo | numeric | 3,0 | YES | NULL |
| 41 | expcbecodigo | character varying | 6 | NO | NULL |
| 42 | expidiid | character | 2 | NO | NULL |
| 43 | exprembloq | character | 1 | NO | 'N'::bpchar |
| 44 | expplazoemrem | numeric | 5,0 | NO | 4 |
| 45 | expplazotpdia | character | 1 | NO | 'H'::bpchar |
| 46 | expfremesa | date | - | YES | NULL |
| 47 | expsocgest | numeric | 10,0 | NO | 0 |
| 48 | expsnperiodificar | character | 1 | NO | 'N'::bpchar |
| 49 | expsncalrecargo | character | 1 | NO | 'N'::bpchar |
| 50 | expfeccomagr | date | - | YES | NULL |
| 51 | expfeccomesp | date | - | YES | NULL |
| 52 | expdiasfacmanu | numeric | 5,0 | YES | NULL |
| 53 | expncpcerobest | numeric | 5,0 | YES | NULL |
| 54 | expanorefacaut | numeric | 5,0 | NO | NULL |
| 55 | expdescserv1 | character varying | 50 | NO | NULL |
| 56 | expdescserv2 | character varying | 50 | YES | NULL |
| 57 | expdirweb | character varying | 128 | YES | NULL |
| 58 | expfecoccam | timestamp without time zone | - | NO | NULL |
| 59 | expm3promanual | numeric | 10,0 | YES | NULL |
| 60 | expplazoretdeuda | numeric | 5,0 | YES | NULL |
| 61 | expplazoretsindeuda | numeric | 5,0 | YES | NULL |
| 62 | expsngestsan | character | 1 | NO | NULL |
| 63 | expdiasextcontr | numeric | 5,0 | YES | NULL |
| 64 | expdiasrectarj | numeric | 5,0 | YES | NULL |
| 65 | expfrmfeccambcont | numeric | 5,0 | NO | NULL |
| 66 | expformctrtecont | numeric | 5,0 | NO | NULL |
| 67 | expmaxmensfact | numeric | 5,0 | YES | NULL |
| 68 | expdiascortesum | numeric | 5,0 | YES | NULL |
| 69 | exppresdiascorsum | numeric | 5,0 | YES | NULL |
| 70 | expsocayuprovapr | numeric | 10,0 | YES | NULL |
| 71 | expcobejeprovapr | numeric | 5,0 | YES | NULL |
| 72 | expofiayuntejec | numeric | 5,0 | YES | NULL |
| 73 | expsecnotprovapr | numeric | 10,0 | NO | NULL |
| 74 | expsncorteprovapr | character | 1 | NO | NULL |
| 75 | expsncontdup | character | 1 | NO | NULL |
| 76 | expsnhistlectpl | character | 1 | NO | NULL |
| 77 | expsnimpotr | character | 1 | NO | NULL |
| 78 | expantefirma | character | 1 | YES | NULL |
| 79 | expfirma | numeric | 5,0 | YES | NULL |
| 80 | expsnrecce | character | 1 | NO | 'N'::bpchar |
| 81 | exptlcatcomer | numeric | 11,0 | YES | NULL |
| 82 | exptlcataveria | numeric | 11,0 | YES | NULL |
| 83 | expdiasvtolimpag | numeric | 5,0 | NO | NULL |
| 84 | expsncortevisperas | character | 1 | NO | NULL |
| 85 | expsnnotmultimedia | character | 1 | NO | NULL |
| 86 | expgestord | numeric | 5,0 | NO | 1 |
| 87 | expsngendocacept | character | 1 | NO | 'S'::bpchar |
| 88 | expsninsitu | character | 1 | NO | NULL |
| 89 | exphstusu | character varying | 10 | NO | ''::character varying |
| 90 | exphsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 91 | expnolopd | character | 1 | NO | 'N'::bpchar |
| 92 | expurlofivirtual | character varying | 100 | YES | NULL |
| 93 | expservmapgisid | numeric | 5,0 | YES | NULL |
| 94 | expsncuenbancat | character | 1 | NO | 'N'::bpchar |
| 95 | exptxtoossrepo | numeric | 5,0 | YES | NULL |
| 96 | expuniliqbaja | character | 1 | NO | 'N'::bpchar |
| 97 | expsncopjust | character | 1 | NO | 'S'::bpchar |
| 98 | expsocpremcp | numeric | 10,0 | NO | 0 |
| 99 | expsocoremcp | numeric | 10,0 | NO | 0 |
| 100 | expncnlmsjfac | numeric | 5,0 | NO | 2 |
| 101 | expfecenlcont | date | - | YES | NULL |
| 102 | expdiaslotcamb | numeric | 5,0 | NO | 0 |
| 103 | expsndeufact | character | 1 | NO | 'N'::bpchar |
| 104 | expgestdoc | smallint | 16,0 | NO | 1 |
| 105 | expestimarnmeses | numeric | 5,0 | NO | 0 |
| 106 | expcntnvm3cons | numeric | 10,0 | YES | NULL |
| 107 | expcntnvantig | numeric | 5,0 | YES | NULL |
| 108 | expsnoperarsoloot | character | 1 | NO | 'N'::bpchar |
| 109 | expsngestopergot | character | 1 | NO | 'N'::bpchar |
| 110 | expsncontinstbajlot | character | 1 | NO | 'N'::bpchar |
| 111 | exptipcambcont | numeric | 5,0 | NO | 1 |
| 112 | expsncertifauto | character | 1 | NO | 'N'::bpchar |
| 113 | expsngestfallidos | character | 1 | NO | 'N'::bpchar |
| 114 | expsncobconjmulorg | character | 1 | NO | 'N'::bpchar |
| 115 | expurllogo | character varying | 200 | YES | NULL |
| 116 | expsnretener | character | 1 | YES | 'N'::bpchar |
| 117 | expsnsegcont | character | 1 | NO | 'N'::bpchar |
| 118 | expsegcttpvid | numeric | 5,0 | YES | NULL |
| 119 | expsegcttconid | numeric | 5,0 | YES | NULL |
| 120 | expdiasvenccp | numeric | 5,0 | NO | 10 |
| 121 | expsnemirecexp | character | 1 | NO | 'S'::bpchar |
| 122 | expgeoorden | numeric | 5,0 | YES | NULL |
| 123 | expgeoconf | text | - | YES | NULL |
| 124 | expcoordporce | numeric | 5,0 | NO | 0 |
| 125 | expcoordcopia | character | 1 | NO | 'S'::bpchar |
| 126 | expsnnoconsecutivos | character | 1 | NO | 'N'::bpchar |
| 127 | expcptofiltxtid | numeric | 10,0 | NO | NULL |
| 128 | expcptofinltxtid | numeric | 10,0 | NO | NULL |
| 129 | expcptocptxtid | numeric | 10,0 | NO | NULL |
| 130 | expcptototaltxtid | numeric | 10,0 | NO | NULL |
| 131 | expsncobfacblqofi | character | 1 | YES | 'N'::bpchar |
| 132 | expcadrafpago | numeric | 5,0 | NO | 5 |
| 133 | expsnsmsbienv | character | 1 | NO | 'N'::bpchar |
| 134 | expsnestimarcontador | character | 1 | NO | 'N'::bpchar |
| 135 | expsnconsvalidoini | character | 1 | NO | 'N'::bpchar |
| 136 | expupdid | numeric | 5,0 | NO | 0 |
| 137 | expimpcambsenba | character | 1 | NO | 'N'::bpchar |
| 138 | expctracod | numeric | 5,0 | YES | NULL |
| 139 | expolcoperid | numeric | 5,0 | YES | NULL |
| 140 | expsnasigbonif | character | 1 | NO | 'N'::bpchar |
| 141 | expestimnlval | numeric | 5,0 | NO | 2 |
| 142 | expobligvalvret | character | 1 | NO | 'N'::bpchar |
| 143 | expnumpladifdef | numeric | 5,0 | NO | 0 |
| 144 | expsnediremabo | character | 1 | NO | 'S'::bpchar |
| 145 | expsnalconrefext | character | 1 | NO | 'N'::bpchar |
| 146 | expsnsacofacext | character | 1 | NO | 'N'::bpchar |
| 147 | expsnordenfacext | character | 1 | NO | 'N'::bpchar |
| 148 | expsnregbaja | character | 1 | NO | 'S'::bpchar |
| 149 | expsntitularpagdef | character | 1 | NO | 'N'::bpchar |
| 150 | expsncobfaccon | character | 1 | NO | 'N'::bpchar |
| 151 | exptipvar | numeric | 5,0 | YES | NULL |
| 152 | expnummeses | numeric | 5,0 | YES | NULL |
| 153 | expsnloteauto | character | 1 | NO | 'N'::bpchar |
| 154 | expformlote | numeric | 5,0 | YES | NULL |
| 155 | expsnarchivarlote | character | 1 | NO | 'N'::bpchar |
| 156 | expsnfaceprop | character | 1 | NO | 'N'::bpchar |
| 157 | expsnbloqcob | character | 1 | NO | 'N'::bpchar |
| 158 | expplazoemremsinp | numeric | 5,0 | NO | 3 |
| 159 | expdiasavideu | numeric | 5,0 | YES | NULL |
| 160 | exptlfivr | numeric | 11,0 | YES | NULL |
| 161 | exptpmodel | numeric | 5,0 | YES | 1 |
| 162 | exptpdocum | numeric | 5,0 | YES | 3 |
| 163 | expnotifauto | character | 1 | NO | 'N'::bpchar |
| 164 | exptipcliente | character varying | 20 | YES | NULL |
| 165 | expnotxhoras | numeric | 5,0 | NO | 0 |
| 166 | expnotxmin | numeric | 5,0 | YES | NULL |
| 167 | expnotxminanu | numeric | 5,0 | NO | 0 |
| 168 | expdifminhorprev | numeric | 5,0 | YES | NULL |
| 169 | expdifmininiobra | numeric | 5,0 | YES | NULL |
| 170 | expperprohini | time without time zone | - | YES | NULL |
| 171 | expperprohfin | time without time zone | - | YES | NULL |
| 172 | exptipvarcor | numeric | 5,0 | YES | NULL |
| 173 | exptipoperac | numeric | 5,0 | YES | NULL |
| 174 | expjexentxtid | numeric | 10,0 | YES | NULL |
| 175 | expjnosujtxtid | numeric | 10,0 | YES | NULL |
| 176 | expnotalect | character varying | 2 | YES | NULL |
| 177 | expoperariocod | numeric | 5,0 | YES | NULL |
| 178 | expoperarioperid | numeric | 5,0 | YES | NULL |
| 179 | explogosoc | character varying | 20 | YES | NULL |
| 180 | expsngendocrecap | character | 1 | NO | 'S'::bpchar |
| 181 | expprohminant | numeric | 5,0 | YES | NULL |
| 182 | expsnfaceinfoadicon | character | 1 | NO | 'N'::bpchar |
| 183 | expmesantmin | numeric | 5,0 | NO | 12 |
| 184 | expimprdiredoc | character | 1 | NO | 'N'::bpchar |
| 185 | expnumdevcancel | numeric | 5,0 | NO | 2 |
| 186 | expnumdiarem | numeric | 5,0 | NO | 1 |
| 187 | expexcfacobsfug | character | 1 | NO | 'S'::bpchar |
| 188 | expexcfaclecest | character | 1 | NO | 'S'::bpchar |
| 189 | expobsexcfac | character varying | 105 | YES | NULL |
| 190 | expxcientoinc | numeric | 5,2 | NO | 0.00 |
| 191 | expdiamesreme | numeric | 5,0 | NO | 0 |
| 192 | expcconscero | numeric | 5,0 | YES | NULL |
| 193 | expcodsgo | character varying | 5 | YES | NULL |
| 194 | expdiasnuevaremesa | numeric | 5,0 | NO | 5 |
| 195 | expsnenvsicer | character | 1 | NO | 'N'::bpchar |
| 196 | expsnestnolei | character | 1 | NO | 'N'::bpchar |
| 197 | expsncieciclec | character | 1 | NO | 'N'::bpchar |
| 198 | expsnpercerravi | character | 1 | NO | 'N'::bpchar |
| 199 | expsncrearfact | character | 1 | NO | 'N'::bpchar |
| 200 | expsnprefact | character | 1 | NO | 'N'::bpchar |
| 201 | expsngenmens | character | 1 | NO | 'N'::bpchar |
| 202 | expsnaceptfact | character | 1 | NO | 'N'::bpchar |
| 203 | expsngendoc | character | 1 | NO | 'N'::bpchar |
| 204 | expsngenefact | character | 1 | NO | 'N'::bpchar |
| 205 | expnumdiaestlei | numeric | 5,0 | YES | NULL |
| 206 | expnumdiaciecic | numeric | 5,0 | YES | NULL |
| 207 | expnumdiacrefact | numeric | 5,0 | YES | NULL |
| 208 | expnumdiaprefact | numeric | 5,0 | YES | NULL |
| 209 | expnumdiagenmens | numeric | 5,0 | YES | NULL |
| 210 | expnumdiaacepfact | numeric | 5,0 | YES | NULL |
| 211 | expnumdiagendoc | numeric | 5,0 | YES | NULL |
| 212 | expnumdiagenefact | numeric | 5,0 | YES | NULL |
| 213 | expporcdifdom | numeric | 5,2 | NO | 40 |
| 214 | expporcdifind | numeric | 5,2 | NO | 30 |
| 215 | expcuotasadiplan | numeric | 5,0 | NO | 3 |
| 216 | expsnmodfpag | character | 1 | NO | 'S'::bpchar |
| 217 | expsngenpadron | character | 1 | NO | 'N'::bpchar |
| 218 | expmodpadron | numeric | 5,0 | YES | NULL |
| 219 | expurlpago | character varying | 200 | YES | NULL |
| 220 | expsngenrefsal | character | 1 | NO | 'N'::bpchar |
| 221 | expsnnousarsaldeu | character | 1 | NO | 'N'::bpchar |
| 222 | exptraaprobgest | numeric | 5,0 | NO | 1 |
| 223 | expsnrepautsum | character | 1 | NO | 'N'::bpchar |
| 224 | expsnlotrepman | character | 1 | NO | 'N'::bpchar |
| 225 | expsngastreap | character | 1 | NO | 'N'::bpchar |
| 226 | expm3ptoe | numeric | 10,0 | NO | 5000 |
| 227 | expagrcon | character varying | 256 | YES | NULL |
| 228 | expconexcl | character varying | 256 | YES | NULL |
| 229 | exptipsumexcl | character varying | 256 | YES | NULL |
| 230 | exppernotifind | numeric | 10,0 | YES | NULL |
| 231 | expnifcont | character varying | 15 | YES | NULL |
| 232 | expdirenvcont | character | 1 | NO | 'P'::bpchar |
| 233 | expsncaldemoracobro | character | 1 | NO | 'N'::bpchar |
| 234 | expporcdemora | numeric | 6,3 | YES | NULL |
| 235 | expvardemora | numeric | 5,0 | YES | NULL |
| 236 | expcarconauto | character | 1 | NO | 'N'::bpchar |
| 237 | expcarconpernoleido | numeric | 5,0 | YES | NULL |
| 238 | expcarconanno | numeric | 5,0 | YES | NULL |
| 239 | expcarconobs | character varying | 256 | YES | NULL |
| 240 | expsnusarsaldo | character | 1 | NO | 'N'::bpchar |
| 241 | expsnrecfianza | character | 1 | NO | 'N'::bpchar |
| 242 | expfeculteje | timestamp without time zone | - | YES | NULL |
| 243 | expsncomunilotecamb | character | 1 | NO | 'N'::bpchar |
| 244 | expsnlotecambauto | character | 1 | NO | 'N'::bpchar |
| 245 | expmotivoscomunica | character varying | 256 | NO | 'ED,CF'::character varying |
| 246 | exptipcliavvenfac | character varying | 20 | YES | NULL |
| 247 | expdiasintdem | numeric | 5,0 | YES | NULL |
| 248 | expciclosrefcobro | numeric | 5,0 | YES | NULL |
| 249 | expintfracccp | numeric | 5,2 | YES | NULL |
| 250 | expsncptocobroant | character | 1 | NO | 'N'::bpchar |
| 251 | expvarintfracc | numeric | 5,0 | YES | NULL |
| 252 | expcobrocpfac | numeric | 5,0 | NO | 0 |
| 253 | expformapagocanal | character | 1 | YES | NULL |
| 254 | expformapagoid | numeric | 5,0 | YES | NULL |
| 255 | expcobprimerplazo | character | 1 | NO | 'N'::bpchar |
| 256 | expsngencpagoprop | character | 1 | NO | 'N'::bpchar |
| 257 | expsncofactrecla | character | 1 | NO | 'N'::bpchar |
| 258 | expsnsecgis | character | 1 | NO | 'N'::bpchar |
| 259 | expsnincleins | character | 1 | NO | 'N'::bpchar |
| 260 | exptipdocesc | character varying | 256 | YES | NULL |
| 261 | expedadmaxcarcp | numeric | 5,0 | YES | NULL |
| 262 | expvigcot | numeric | 5,0 | NO | 999 |
| 263 | expsocpropdeudaprop | numeric | 10,0 | YES | NULL |
| 264 | expsninfextrareclam | character varying | 1 | NO | 'N'::character varying |
| 265 | expsnvarfacturado | character varying | 1 | NO | 'N'::character varying |
| 266 | expsndotcargo | character | 1 | NO | 'N'::bpchar |
| 267 | expsndeudasocprop | character varying | 1 | NO | 'N'::character varying |
| 268 | expsnplazosintdemora | character varying | 1 | NO | 'S'::character varying |
| 269 | expsocsaldosfavor | numeric | 10,0 | YES | NULL |
| 270 | exppormaxintfrac | numeric | 5,2 | YES | NULL |
| 271 | expmotivosfto | character varying | 256 | YES | NULL |
| 272 | expprfid | numeric | 5,0 | YES | NULL |
| 273 | expencsuezlopd | character varying | 1 | NO | 'N'::character varying |
| 274 | expsoctratdato | numeric | 10,0 | YES | NULL |
| 275 | expdiasprevavisocp | numeric | 5,0 | NO | 5 |
| 276 | expsnwaterc | character varying | 1 | NO | 'N'::character varying |
| 277 | expsnfactrepoauto | character | 1 | NO | 'N'::bpchar |
| 278 | expcptofactdifrepo | numeric | 5,0 | YES | NULL |
| 279 | expexclfactsubr | character | 1 | NO | 'N'::bpchar |
| 280 | expsnauditoria | character | 1 | NO | 'N'::bpchar |
| 281 | expsnauditoriaext | character | 1 | NO | 'N'::bpchar |
| 282 | expcatcntnopto | character varying | 50 | YES | NULL |
| 283 | expagprodatostxtid | numeric | 10,0 | YES | NULL |
| 284 | expwebagprodatos | character varying | 100 | YES | NULL |
| 285 | expimprimpconsent | character | 1 | NO | 'S'::bpchar |
| 286 | expnumordanthis | numeric | 5,0 | YES | NULL |
| 287 | expsnenvobslecser | character | 1 | NO | 'N'::bpchar |
| 288 | expsnenvordgestor | character | 1 | NO | 'S'::bpchar |
| 289 | expvarredondeofto | numeric | 5,0 | YES | NULL |
| 290 | expsnusarsaldoant | character | 1 | NO | 'N'::bpchar |
| 291 | exptlcatcomer2 | numeric | 11,0 | YES | NULL |
| 292 | expsnfeccobalt | character | 1 | NO | 'N'::bpchar |
| 293 | expcontaller | numeric | 5,0 | YES | NULL |
| 294 | expidplataf | character varying | 36 | YES | NULL |
| 295 | expsndigital | character | 1 | NO | 'N'::bpchar |
| 296 | expsnbiom | character | 1 | NO | 'N'::bpchar |
| 297 | expsnacortarurl | character | 1 | NO | 'N'::bpchar |
| 298 | expremisms | character varying | 11 | YES | NULL |
| 299 | expremimail | character varying | 110 | YES | NULL |
| 300 | expsistregest | numeric | 5,0 | YES | NULL |
| 301 | expanregest | numeric | 5,0 | YES | NULL |
| 302 | expsndrop | character | 1 | NO | 'N'::bpchar |
| 303 | expsndatossensible | character | 1 | NO | 'N'::bpchar |
| 304 | expdatossensibles | character varying | 90 | YES | NULL |
| 305 | expsnllavecerrada | character | 1 | NO | 'N'::bpchar |
| 306 | expmesescllave | numeric | 5,0 | YES | '0'::numeric |
| 307 | expobsexccllave | character varying | 256 | YES | ''::character varying |
| 308 | expsncertdig | character | 1 | NO | 'N'::bpchar |
| 309 | expdigfluid | character varying | 50 | YES | NULL |
| 310 | expbiofluid | character varying | 50 | YES | NULL |
| 311 | expcerfluid | character varying | 50 | YES | NULL |
| 312 | expmesesmaxcllave | numeric | 5,0 | YES | '0'::numeric |
| 313 | expzonascllave | character varying | 256 | YES | ''::character varying |
| 314 | expsnservdeuda | character | 1 | NO | 'N'::bpchar |
| 315 | expdoccortedeuda | character varying | 256 | YES | NULL |
| 316 | expordencortedeuda | character varying | 256 | YES | NULL |
| 317 | expsisgesficlot | numeric | 5,0 | NO | '1'::numeric |
| 318 | expsnmodleccont | character | 1 | NO | 'N'::bpchar |
| 320 | expnmaxdocspago | numeric | 5,0 | YES | NULL |
| 321 | exppermaxvalid | numeric | 5,0 | YES | NULL |
| 322 | exptlwhatsapp | numeric | 11,0 | YES | NULL |
| 323 | expsnusarsaldamor | character | 1 | NO | 'S'::bpchar |
| 324 | expsnumdr | character | 1 | NO | 'S'::bpchar |
| 325 | exptippuntexccllave | character varying | 256 | YES | NULL |
| 326 | exptipcliexccllave | character varying | 256 | YES | NULL |
| 327 | expdiasexccllave | numeric | 5,0 | YES | NULL |
| 328 | expcadrafpagocp | numeric | 5,0 | NO | '0'::numeric |
| 329 | expfecdesajudicacion | date | - | YES | NULL |
| 330 | expsntimbrarabonos | character | 1 | NO | 'S'::bpchar |
| 331 | expmarcasoc | character varying | 50 | YES | NULL |
| 332 | expcontarco | character varying | 90 | YES | NULL |
| 333 | expsnrblergpd | character | 1 | NO | 'N'::bpchar |
| 334 | expidsocdm | character varying | 36 | YES | NULL |
| 335 | expmodelocp | numeric | 5,0 | YES | NULL |
| 336 | expsnexcfacqueja | character | 1 | NO | 'N'::bpchar |
| 337 | expsocpropcreajuifrau | character varying | 200 | YES | NULL |
| 338 | expsnrecestsalaut | character | 1 | NO | 'N'::bpchar |
| 339 | expmomrecestsalaut | numeric | 5,0 | YES | NULL |
| 340 | expzonasrecsalaut | character varying | 256 | YES | NULL |
| 341 | expdiasvencsaldobolsa | numeric | 5,0 | YES | NULL |
| 342 | expsngenfragasfra | character | 1 | NO | 'N'::bpchar |
| 343 | expsnjuiciofacdef | character | 1 | NO | 'N'::bpchar |
| 344 | expsnjuiciofacprov | character | 1 | NO | 'N'::bpchar |
| 345 | expndiasprimeracom | numeric | 4,0 | NO | '30'::numeric |
| 346 | expndiasjuridico | numeric | 4,0 | NO | '30'::numeric |
| 347 | expndiasalegacionnoatend | numeric | 4,0 | NO | '15'::numeric |
| 348 | expcambcontant | character | 1 | NO | 'N'::bpchar |
| 349 | expmaxdeuda12gotas | numeric | 18,2 | YES | NULL |
| 350 | expmaxfacimp12gotas | numeric | 5,0 | YES | NULL |
| 351 | explitdiacanon | numeric | 5,0 | YES | NULL |

### explotao
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etaoexpid | numeric | 5,0 | NO | NULL |
| 2 | etaotipingayu | character varying | 8 | NO | NULL |
| 3 | etaotipingaut | character varying | 8 | NO | NULL |
| 4 | etaocosinst | character varying | 8 | NO | NULL |
| 5 | etaorefer | numeric | 5,0 | NO | NULL |
| 6 | etaoformnom | numeric | 5,0 | NO | NULL |
| 7 | etaocodmuni | numeric | 5,0 | YES | NULL |
| 8 | etasitu | character | 1 | NO | NULL |
| 9 | etatpvboni | numeric | 5,0 | YES | NULL |
| 10 | etatpvrefcob | numeric | 5,0 | YES | NULL |
| 11 | etatpvexcl | numeric | 5,0 | YES | NULL |

### explotesttec
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etetetid | numeric | 5,0 | NO | NULL |
| 2 | eteexpid | numeric | 5,0 | NO | NULL |
| 3 | etesnutiliza | character | 1 | NO | NULL |
| 4 | etesndattec | character | 1 | NO | 'N'::bpchar |

### explotipcli
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etpcexpid | numeric | 5,0 | NO | NULL |
| 2 | etpctclicod | character | 1 | NO | NULL |
| 3 | etpcsncontr | character | 1 | NO | NULL |
| 4 | etpchstusu | character varying | 10 | NO | NULL |
| 5 | etpchsthora | timestamp without time zone | - | NO | NULL |

### explotipoalartel
Columns: 13

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etaexpid | numeric | 5,0 | NO | NULL |
| 2 | etatipcod | numeric | 5,0 | NO | NULL |
| 3 | etasnactivo | character | 1 | NO | 'S'::bpchar |
| 4 | etamvoid | numeric | 5,0 | YES | NULL |
| 5 | etatpdid | numeric | 5,0 | YES | NULL |
| 6 | etasnautoval | character | 1 | NO | 'N'::bpchar |
| 7 | etasnaccauto | character | 1 | NO | 'N'::bpchar |
| 8 | etanumdias | numeric | 5,0 | NO | NULL |
| 9 | etasnverconsfr | character | 1 | NO | 'N'::bpchar |
| 10 | etasnincmas | character | 1 | NO | 'N'::bpchar |
| 11 | etanummincont | numeric | 5,0 | YES | NULL |
| 12 | etapormincont | numeric | 5,2 | YES | NULL |
| 13 | etasncompcam | character | 1 | NO | 'N'::bpchar |

### explotiposubrog
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | extsexpid | numeric | 5,0 | NO | NULL |
| 2 | extstsrgid | numeric | 5,0 | NO | NULL |
| 3 | extshstusu | character varying | 10 | NO | NULL |
| 4 | extshsthora | timestamp without time zone | - | NO | NULL |
| 5 | extsgeneradoc | character | 1 | NO | 'S'::bpchar |
| 6 | extsclauid | numeric | 5,0 | YES | NULL |

### explotipotelelec
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ettexpid | numeric | 5,0 | NO | NULL |
| 2 | etttptlid | numeric | 5,0 | NO | NULL |
| 3 | ettsistele | numeric | 5,0 | NO | NULL |

### explotipvar
Columns: 13

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etpvexpid | numeric | 5,0 | NO | NULL |
| 2 | etpvtpvid | numeric | 5,0 | NO | NULL |
| 3 | etpvvaldef | character | 10 | YES | NULL |
| 4 | etpvperidic | numeric | 5,0 | YES | NULL |
| 5 | etpvsnajustepi | character | 1 | NO | NULL |
| 6 | etpvsnimpfact | character | 1 | NO | 'S'::bpchar |
| 7 | etpvhstusu | character varying | 10 | NO | NULL |
| 8 | etpvhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 9 | etpvsnparamk | character | 1 | NO | 'N'::bpchar |
| 10 | etpvtxtid | numeric | 10,0 | YES | NULL |
| 11 | etpvsngesbonif | character | 1 | NO | 'N'::bpchar |
| 12 | etpvsnimpot | character | 1 | NO | 'N'::bpchar |
| 13 | etpvsnimpcntt | character | 1 | NO | 'N'::bpchar |

### explotloc
Columns: 13

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exlexpid | numeric | 5,0 | NO | NULL |
| 2 | exllocid | numeric | 10,0 | NO | NULL |
| 3 | exlofiid | numeric | 5,0 | NO | NULL |
| 4 | exlescudo | numeric | 10,0 | YES | NULL |
| 5 | exlcertcal | numeric | 10,0 | YES | NULL |
| 6 | exlcertgma | numeric | 10,0 | YES | NULL |
| 7 | exlsn_dirtxt | character | 1 | NO | NULL |
| 8 | exlpobid | numeric | 10,0 | YES | NULL |
| 9 | exltxtayunt | numeric | 10,0 | YES | NULL |
| 10 | exlsnlocprinc | character | 1 | NO | NULL |
| 11 | exlhstusu | character varying | 10 | NO | ''::character varying |
| 12 | exlhsthora | timestamp without time zone | - | NO | NULL |
| 13 | exlsocayunt | numeric | 10,0 | YES | NULL |

### explotoper
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exocontcod | numeric | 5,0 | NO | NULL |
| 2 | exooperid | numeric | 5,0 | NO | NULL |
| 3 | exoexpid | numeric | 5,0 | NO | NULL |

### explotxtcnt
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etxtexpid | numeric | 5,0 | NO | NULL |
| 2 | etxtclsccod | character | 2 | NO | NULL |
| 3 | etxtviacod | character | 2 | NO | NULL |
| 4 | etxtsnactivo | character | 1 | NO | 'S'::bpchar |
| 5 | etxttxtid | numeric | 10,0 | NO | NULL |
| 6 | etxthstusu | character varying | 10 | NO | NULL |
| 7 | etxthsthora | timestamp without time zone | - | NO | NULL |

### explotxtfunc
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etxfexpid | numeric | 5,0 | NO | NULL |
| 2 | etxffuncod | character varying | 50 | NO | NULL |
| 3 | etxfviacod | character | 2 | NO | NULL |
| 4 | etxfsnactivo | character | 1 | NO | NULL |
| 5 | etxftxtid | numeric | 10,0 | NO | NULL |
| 6 | etxfhstusu | character varying | 10 | NO | NULL |
| 7 | etxfhsthora | timestamp without time zone | - | NO | NULL |

### exploverif
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | evexpid | numeric | 5,0 | NO | NULL |
| 2 | evvlveriid | numeric | 5,0 | NO | NULL |
| 3 | evprioridad | numeric | 5,0 | NO | NULL |

### expmotbaja
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exmbexpid | numeric | 5,0 | NO | NULL |
| 2 | exmbmtbcid | numeric | 5,0 | NO | NULL |

### expmotdev
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | emdexpid | numeric | 5,0 | NO | NULL |
| 2 | emdmtdid | numeric | 5,0 | NO | NULL |
| 3 | emdnumdev | numeric | 5,0 | NO | NULL |

### expnotas
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | entexpid | numeric | 5,0 | NO | NULL |
| 2 | entnotas | text | - | NO | NULL |

### expofiperf
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | eopofiid | numeric | 5,0 | NO | NULL |
| 2 | eopexpid | numeric | 5,0 | NO | NULL |
| 3 | eopperfid | numeric | 5,0 | NO | NULL |

### expporintdem
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | epiexpid | numeric | 5,0 | NO | NULL |
| 2 | epifecapli | date | - | NO | NULL |
| 3 | epiporcent | numeric | 6,2 | NO | NULL |

### expservcentral
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | escexpid | numeric | 5,0 | NO | NULL |
| 2 | escsecid | numeric | 10,0 | NO | NULL |
| 3 | escrscid | numeric | 10,0 | NO | NULL |
| 4 | escfechaini | date | - | NO | NULL |
| 5 | escfechafin | date | - | YES | NULL |
| 6 | escindicadorsn | character | 1 | NO | NULL |
| 7 | eschstusu | character varying | 10 | NO | ' '::character varying |
| 8 | eschsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### exptipdocumento
Columns: 27

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etcexpid | numeric | 5,0 | NO | NULL |
| 2 | etctcmid | numeric | 5,0 | NO | NULL |
| 3 | etcsnenvps | character | 1 | NO | NULL |
| 4 | etcsnenvdf | character | 1 | NO | NULL |
| 5 | etcncoplis | numeric | 5,0 | NO | NULL |
| 6 | etctxtlibre | numeric | 10,0 | YES | NULL |
| 7 | etchstusu | character varying | 10 | NO | NULL |
| 8 | etchsthora | timestamp without time zone | - | NO | NULL |
| 9 | etcsncarta | character | 1 | YES | 'S'::bpchar |
| 10 | etcsnemail | character | 1 | YES | 'N'::bpchar |
| 11 | etcsnsms | character | 1 | YES | 'N'::bpchar |
| 12 | etcnumcopiassepa | numeric | 5,0 | NO | 0 |
| 13 | etcsnfirma | character | 1 | NO | 'S'::bpchar |
| 14 | etcsnpush | character | 1 | NO | 'N'::bpchar |
| 15 | etctipofirma | character | 1 | NO | 'F'::bpchar |
| 16 | etcsnincnomfir | character | 1 | NO | 'N'::bpchar |
| 17 | etctipofirmante | character | 1 | NO | 'A'::bpchar |
| 18 | etcfirid | numeric | 10,0 | YES | NULL |
| 19 | etccargo | character | 1 | YES | NULL |
| 20 | etcaprid | numeric | 10,0 | YES | 0 |
| 21 | etcsnimpraf | character | 1 | NO | 'N'::bpchar |
| 22 | etcsncertdig | character | 1 | NO | 'N'::bpchar |
| 23 | etcsndestcli | character | 1 | NO | 'N'::bpchar |
| 24 | etcestgesrec | character varying | 80 | YES | NULL |
| 25 | etcestentregasicer | character varying | 50 | YES | NULL |
| 26 | etcsncontigo | character | 1 | NO | 'N'::bpchar |
| 27 | etcsnemailysms | character | 1 | NO | 'N'::bpchar |

### exptiposumin
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | extsexpid | numeric | 5,0 | NO | NULL |
| 2 | extstsumid | numeric | 5,0 | NO | NULL |

### exptipsubdoccontr
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | etsdcexpid | numeric | 5,0 | NO | NULL |
| 2 | etsdctsrgid | numeric | 5,0 | NO | NULL |
| 3 | etsdcdconid | numeric | 10,0 | NO | NULL |
| 4 | etsdcordenimp | numeric | 5,0 | NO | NULL |
| 5 | etsdcsnactivo | character | 1 | NO | NULL |
| 6 | etsdchstusu | character varying | 10 | NO | NULL |
| 7 | etsdchsthora | timestamp without time zone | - | NO | NULL |

### expuserexit
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exueusexid | numeric | 5,0 | NO | NULL |
| 2 | exexpid | numeric | 5,0 | NO | NULL |

### expverestado
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exveid | numeric | 10,0 | NO | NULL |
| 2 | exveestado | numeric | 5,0 | NO | NULL |
| 3 | exvehstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 4 | exvehsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### expversituacion
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exvsid | numeric | 10,0 | NO | NULL |
| 2 | exvssituacion | numeric | 5,0 | NO | NULL |
| 3 | exvshstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 4 | exvshsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### expversituadm
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | evsaexvid | numeric | 10,0 | NO | NULL |
| 2 | evsatsacod | character | 5 | YES | NULL |
| 3 | evsafecha | date | - | YES | NULL |
| 4 | evsausu | character varying | 10 | NO | NULL |

### expvertido
Columns: 29

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exvid | numeric | 10,0 | NO | NULL |
| 2 | exvpolnum | numeric | 10,0 | NO | NULL |
| 3 | exvempresa | character varying | 100 | YES | NULL |
| 4 | exvestado | numeric | 5,0 | NO | NULL |
| 5 | exvclavecvi | character varying | 10 | YES | NULL |
| 6 | exvexpid | numeric | 5,0 | YES | NULL |
| 7 | exvpolcod | character | 2 | YES | NULL |
| 8 | exvcaduca | date | - | YES | NULL |
| 9 | exvobsid | numeric | 10,0 | YES | NULL |
| 10 | exvobserva | character varying | 500 | YES | NULL |
| 11 | exvobsdecl | character varying | 500 | YES | NULL |
| 12 | exvsnemedida | character | 1 | NO | NULL |
| 13 | exvsnamedida | character | 1 | NO | NULL |
| 14 | exvmedidas | character varying | 500 | YES | NULL |
| 15 | exvsncanon | character | 1 | NO | NULL |
| 16 | exvdesccan | character varying | 500 | YES | NULL |
| 17 | exvobsdepu | character varying | 100 | YES | NULL |
| 18 | exvsituacion | numeric | 5,0 | NO | 2 |
| 19 | exvpprsidd | numeric | 10,0 | YES | NULL |
| 20 | exvpcnaecodd | numeric | 10,0 | YES | NULL |
| 21 | exvpprsida | numeric | 10,0 | YES | NULL |
| 22 | exvpcnaecoda | numeric | 10,0 | YES | NULL |
| 23 | exvsndist | character | 1 | NO | NULL |
| 24 | exvsnpdteact | character | 1 | NO | 'N'::bpchar |
| 25 | exvhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 26 | exvhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 27 | exvtsacod | character | 5 | YES | NULL |
| 28 | exvsafecha | date | - | YES | NULL |
| 29 | exvcaudal | numeric | 10,0 | NO | 0 |

### exsubcontra
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exscnttnum | numeric | 10,0 | NO | NULL |
| 2 | exstconid | numeric | 5,0 | NO | NULL |
| 3 | exstsubid | numeric | 5,0 | NO | NULL |
| 4 | exsmotivo | character varying | 50 | NO | NULL |
| 5 | exshstusu | character varying | 10 | NO | NULL |
| 6 | exshsthora | timestamp without time zone | - | NO | NULL |

### extracto
Columns: 19

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | extrid | numeric | 10,0 | NO | NULL |
| 2 | extrageid | numeric | 5,0 | NO | NULL |
| 3 | extrbanid | numeric | 5,0 | NO | NULL |
| 4 | extrfecope | date | - | NO | NULL |
| 5 | extrfecval | date | - | YES | NULL |
| 6 | extrconcom | character | 2 | NO | NULL |
| 7 | extrconpro | character | 3 | NO | NULL |
| 8 | extrdebhab | character | 1 | NO | NULL |
| 9 | extrimport | numeric | 18,2 | NO | NULL |
| 10 | extrnumdoc | numeric | 10,0 | YES | NULL |
| 11 | extrfecrec | date | - | NO | NULL |
| 12 | extrrefer | character varying | 408 | YES | NULL |
| 13 | extrsescon | numeric | 10,0 | YES | NULL |
| 14 | extrobserv | character varying | 80 | YES | NULL |
| 15 | extrsocprsid | numeric | 10,0 | NO | NULL |
| 16 | extrgesageid | numeric | 5,0 | YES | NULL |
| 17 | extrnumcta | character varying | 10 | YES | NULL |
| 18 | extrhstusu | character varying | 10 | YES | NULL |
| 19 | extrhsthora | timestamp without time zone | - | YES | NULL |

### facavivenc
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | favfacid | numeric | 10,0 | NO | NULL |
| 2 | favfecaviso | date | - | NO | NULL |

### faccorrect
Columns: 18

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fcrrfacid | numeric | 10,0 | NO | NULL |
| 2 | fcrrcorid | numeric | 10,0 | NO | NULL |
| 3 | fcrrorden | numeric | 5,0 | NO | NULL |
| 4 | fcrrexpid | numeric | 5,0 | NO | NULL |
| 5 | fcrrcptoid | numeric | 5,0 | NO | NULL |
| 6 | fcrrttarid | numeric | 5,0 | NO | NULL |
| 7 | fcrrfecapl | date | - | NO | NULL |
| 8 | fcrrsubcid | numeric | 5,0 | NO | NULL |
| 9 | fcrrobjaplic | numeric | 5,0 | NO | NULL |
| 10 | fcrrnlin | numeric | 5,0 | YES | NULL |
| 11 | fcrrvalorig | numeric | 24,6 | YES | NULL |
| 12 | fcrrresult | numeric | 24,6 | YES | NULL |
| 13 | fcrroperacion | numeric | 5,0 | YES | NULL |
| 14 | fcrrtipovalope | numeric | 5,0 | YES | NULL |
| 15 | fcrrvalope | numeric | 24,6 | YES | NULL |
| 16 | fcrrtvarope | numeric | 5,0 | YES | NULL |
| 17 | fcrrcptoope | numeric | 5,0 | YES | NULL |
| 18 | fcrrvalfct | numeric | 24,6 | YES | NULL |

### facdecimptmtr
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fdicodigo | numeric | 10,0 | NO | NULL |
| 2 | fdiexpid | numeric | 5,0 | NO | NULL |
| 3 | fdifacid | numeric | 10,0 | NO | NULL |

### facdocucobrocfd
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fdccffacid | numeric | 10,0 | NO | NULL |
| 2 | fdccfdccfid | numeric | 10,0 | NO | NULL |

### facdocupago
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fdpdcpid | numeric | 10,0 | NO | NULL |
| 2 | fdpfacid | numeric | 10,0 | NO | NULL |
| 3 | fdpfecvtoant | date | - | YES | NULL |

### facexcrem
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ferid | numeric | 10,0 | NO | NULL |
| 2 | ferfacid | numeric | 10,0 | NO | NULL |
| 3 | ferocgven | numeric | 10,0 | YES | NULL |
| 4 | ferocgrem | numeric | 10,0 | YES | NULL |
| 5 | ferfecha | date | - | NO | NULL |
| 6 | ferbanid | numeric | 5,0 | NO | NULL |

### facexprecob
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ferfacid | numeric | 10,0 | NO | NULL |
| 2 | ferexrcid | numeric | 10,0 | NO | NULL |
| 3 | fergesid | numeric | 10,0 | YES | NULL |
| 4 | ferfechaenvio | date | - | YES | NULL |

### facexpsif
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fesfacid | numeric | 10,0 | NO | NULL |
| 2 | fesexsid | numeric | 10,0 | NO | NULL |

### facgradoinsolv
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fginfacid | numeric | 10,0 | NO | NULL |
| 2 | fginexpid | numeric | 5,0 | NO | NULL |
| 3 | fgincnttnum | numeric | 10,0 | NO | NULL |
| 4 | fginpocid | numeric | 10,0 | NO | NULL |
| 5 | fgintipo | numeric | 5,0 | YES | 0 |
| 6 | fginestfact | numeric | 5,0 | NO | NULL |
| 7 | fginfecfact | date | - | NO | NULL |
| 8 | fginfecvto | date | - | NO | NULL |
| 9 | fginfeccob | timestamp without time zone | - | YES | NULL |
| 10 | fgingscid | numeric | 10,0 | YES | NULL |
| 11 | fginvelpag | numeric | 16,6 | YES | NULL |

### facimpnorecl
Columns: 12

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | facid | numeric | 10,0 | YES | NULL |
| 2 | facfecfact | date | - | YES | NULL |
| 3 | facfecvto | date | - | YES | NULL |
| 4 | facimporte | numeric | 18,2 | YES | NULL |
| 5 | ftoid | numeric | 10,0 | YES | NULL |
| 6 | faccliid | numeric | 10,0 | YES | NULL |
| 7 | ftoorigen | numeric | 5,0 | YES | NULL |
| 8 | facpocid | numeric | 10,0 | YES | NULL |
| 9 | faccnttnum | numeric | 10,0 | YES | NULL |
| 10 | facestado | numeric | 5,0 | YES | NULL |
| 11 | facsocpro | numeric | 10,0 | YES | NULL |
| 12 | facexpid | numeric | 5,0 | YES | NULL |

### facindacades
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fiadfacid | numeric | 10,0 | NO | NULL |
| 2 | fiadfecapli | date | - | NO | NULL |
| 3 | fiadpregen | double precision | 53 | NO | NULL |
| 4 | fiadimpgen | numeric | 18,2 | NO | NULL |
| 5 | fiadpreesp | double precision | 53 | NO | NULL |
| 6 | fiadimpesp | numeric | 18,2 | NO | NULL |

### facinter
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fintfacid | numeric | 10,0 | NO | NULL |
| 2 | fintfecha | date | - | YES | NULL |

### facmuestreo
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fmstfacid | numeric | 10,0 | NO | NULL |
| 2 | fmstcasmid | numeric | 10,0 | NO | NULL |
| 3 | fmstsesval | numeric | 10,0 | YES | NULL |

### facpcp
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fpcpgscid | numeric | 10,0 | NO | NULL |
| 2 | fpcpsocid | numeric | 10,0 | NO | NULL |
| 3 | fpcplinfacid | numeric | 10,0 | NO | NULL |
| 4 | fpcplinfacnlin | numeric | 5,0 | NO | NULL |
| 5 | fpcpimpdtos | numeric | 18,2 | YES | NULL |
| 6 | fpcpimppagado | numeric | 18,2 | YES | NULL |

### facplzdocucobrocfd
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fpdccffacid | numeric | 10,0 | NO | NULL |
| 2 | fpdccfplzid | numeric | 10,0 | NO | NULL |
| 3 | fpdccfdccfid | numeric | 10,0 | NO | NULL |
| 4 | fpdccfocgid | numeric | 10,0 | NO | NULL |

### facprccambtit
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fprctid | numeric | 10,0 | NO | NULL |
| 2 | fprctfacid | numeric | 10,0 | NO | NULL |
| 3 | fprctfacestado | numeric | 5,0 | NO | NULL |
| 4 | fprcnumerador | numeric | 10,0 | NO | 0 |

### facprcdivcart
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fprdcid | numeric | 10,0 | NO | NULL |
| 2 | fprdcfacidori | numeric | 10,0 | NO | NULL |
| 3 | fprdcfaciddst | numeric | 10,0 | YES | NULL |
| 4 | fprdcfacestado | numeric | 5,0 | NO | NULL |
| 5 | fprdcfacimporte | numeric | 18,2 | NO | NULL |
| 6 | fprdcfacimpuest | numeric | 18,2 | NO | NULL |
| 7 | fprdcsnuniconc | character | 1 | NO | NULL |

### facrectao
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | frtfacid | numeric | 10,0 | NO | NULL |
| 2 | frtfacnumfac | character | 18 | NO | NULL |
| 3 | frtfacest | numeric | 5,0 | NO | NULL |
| 4 | frtfecha | date | - | NO | NULL |
| 5 | frtfecope | date | - | YES | NULL |

### facrectifivacanon
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | friclinfacid | numeric | 10,0 | NO | NULL |
| 2 | friclinfacnlin | numeric | 5,0 | NO | NULL |
| 3 | fricfacrecid | numeric | 10,0 | YES | NULL |

### facregbolsa
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | frbblscpocid | numeric | 10,0 | NO | NULL |
| 2 | frbftoid | numeric | 10,0 | NO | NULL |

### facregconsest
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | frceftoid | numeric | 10,0 | NO | NULL |
| 2 | frceftoppalid | numeric | 10,0 | NO | NULL |

### facregvalvarcadori
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | frvftoid | numeric | 10,0 | NO | NULL |
| 2 | frvcnttnum | numeric | 10,0 | NO | NULL |
| 3 | frvvalor | numeric | 24,6 | YES | NULL |
| 4 | frvsneliminado | character varying | 1 | YES | NULL |

### factiprel
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ftridfac | numeric | 10,0 | NO | NULL |
| 2 | ftridrel | character varying | 5 | NO | NULL |

### factlistados
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | factlid | numeric | 10,0 | NO | NULL |
| 2 | factlusuid | character varying | 10 | NO | NULL |
| 3 | factlnombre | character varying | 250 | YES | NULL |
| 4 | factlestado | numeric | 5,0 | NO | NULL |
| 5 | factlparms | bytea | - | YES | NULL |
| 6 | factlfechapeticion | timestamp without time zone | - | NO | NULL |
| 7 | factlfechageneracion | timestamp without time zone | - | YES | NULL |

### factpago
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fpfacid | numeric | 10,0 | NO | NULL |
| 2 | fpformapago | character | 2 | NO | NULL |
| 3 | fpmodalpago | numeric | 5,0 | NO | NULL |

### factuasien
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fasftoid | numeric | 10,0 | NO | NULL |
| 2 | fasasnid | numeric | 10,0 | NO | NULL |
| 3 | fassocemi | numeric | 10,0 | NO | NULL |

### factura
Columns: 20

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | facid | numeric | 10,0 | NO | NULL |
| 2 | facftoid | numeric | 10,0 | NO | NULL |
| 3 | facsocemi | numeric | 10,0 | NO | NULL |
| 4 | facsocpro | numeric | 10,0 | NO | NULL |
| 5 | facpocid | numeric | 10,0 | NO | NULL |
| 6 | faccliid | numeric | 10,0 | NO | NULL |
| 7 | facestado | numeric | 5,0 | NO | NULL |
| 8 | facfecfact | date | - | NO | trunc(CURRENT_DATE) |
| 9 | facnumfac | character | 18 | NO | NULL |
| 10 | facimporte | numeric | 18,2 | NO | NULL |
| 11 | facimpuest | numeric | 18,2 | NO | NULL |
| 12 | facfecvto | date | - | NO | trunc(CURRENT_DATE) |
| 13 | facfecprem | date | - | YES | NULL |
| 14 | facdotmoro | numeric | 5,0 | YES | NULL |
| 15 | facclinif | character | 15 | YES | NULL |
| 16 | facexpid | numeric | 5,0 | NO | NULL |
| 17 | facdcfaid | numeric | 10,0 | YES | NULL |
| 18 | faccnttnum | numeric | 10,0 | NO | NULL |
| 19 | factipgesd | numeric | 5,0 | YES | NULL |
| 20 | facvtoori | date | - | YES | NULL |

### facturable
Columns: 59

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fbleid | numeric | 10,0 | NO | NULL |
| 2 | fblepocid | numeric | 10,0 | NO | NULL |
| 3 | fbleftoid | numeric | 10,0 | NO | NULL |
| 4 | fblefecant | date | - | NO | NULL |
| 5 | fblelecant | numeric | 10,0 | NO | NULL |
| 6 | fblelecan2 | numeric | 10,0 | YES | NULL |
| 7 | fblefecact | date | - | NO | NULL |
| 8 | fblelecact | numeric | 10,0 | NO | NULL |
| 9 | fblelecac2 | numeric | 10,0 | YES | NULL |
| 10 | fblediaslec | numeric | 5,0 | NO | NULL |
| 11 | fbleexmrglec | numeric | 5,0 | NO | NULL |
| 12 | fbletciclo | numeric | 5,0 | NO | NULL |
| 13 | fbleleido | character | 1 | NO | NULL |
| 14 | fblecortad | character | 1 | NO | NULL |
| 15 | fblefecssum | date | - | YES | NULL |
| 16 | fblefecrsum | date | - | YES | NULL |
| 17 | fbleconsum | numeric | 10,0 | NO | NULL |
| 18 | fbleconsreg | numeric | 10,0 | NO | NULL |
| 19 | fbleconsest | numeric | 10,0 | NO | NULL |
| 20 | fbleconsrep | numeric | 10,0 | NO | NULL |
| 21 | fbleconsotr | numeric | 10,0 | NO | NULL |
| 22 | fblecontid | numeric | 10,0 | YES | NULL |
| 23 | fblecalib1 | numeric | 5,0 | NO | NULL |
| 24 | fblecalib2 | numeric | 5,0 | YES | NULL |
| 25 | fblesnconcom | character | 1 | NO | NULL |
| 26 | fbletsumid | numeric | 5,0 | NO | NULL |
| 27 | fbleumbral | numeric | 18,2 | YES | NULL |
| 28 | fbleexento | character | 1 | NO | NULL |
| 29 | fbleusocod | numeric | 5,0 | YES | NULL |
| 30 | fblefperini | date | - | NO | NULL |
| 31 | fblefperfin | date | - | NO | NULL |
| 32 | fblecnttnum | numeric | 10,0 | NO | 0 |
| 33 | fblealtcalimm | numeric | 5,0 | YES | NULL |
| 34 | fblecontsnprop | character | 1 | NO | 'N'::bpchar |
| 35 | fblesndesha | character | 1 | NO | 'N'::bpchar |
| 36 | fblesnbancario | character | 1 | NO | 'N'::bpchar |
| 37 | fblesnjubilad | character | 1 | NO | 'N'::bpchar |
| 38 | fblefecantval | date | - | YES | NULL |
| 39 | fblediaslecval | numeric | 5,0 | YES | NULL |
| 40 | fblelecval | character | 1 | YES | NULL |
| 41 | fblepocidvalant | numeric | 10,0 | YES | NULL |
| 42 | fblenumciclos | numeric | 5,0 | NO | 1 |
| 43 | fblefperantval | date | - | YES | NULL |
| 44 | fbleconsumval | numeric | 10,0 | YES | NULL |
| 45 | fbleconsregval | numeric | 10,0 | NO | 0 |
| 46 | fbleconsestval | numeric | 10,0 | NO | 0 |
| 47 | fbleconsrepval | numeric | 10,0 | NO | 0 |
| 48 | fbleconsotrval | numeric | 10,0 | NO | 0 |
| 49 | fblesnestave1 | character | 1 | NO | 'N'::bpchar |
| 50 | fblesnestave2 | character | 1 | NO | 'N'::bpchar |
| 51 | fblesnestnle1 | character | 1 | NO | 'N'::bpchar |
| 52 | fblesnestnle2 | character | 1 | NO | 'N'::bpchar |
| 53 | fblesnccval | character | 1 | NO | 'N'::bpchar |
| 54 | feblefeccamb | date | - | YES | NULL |
| 55 | fblelecantval | numeric | 10,0 | YES | NULL |
| 56 | fblelecantva2 | numeric | 10,0 | YES | NULL |
| 57 | fbleexmrglecval | numeric | 5,0 | NO | 0 |
| 58 | fbleconsestave | numeric | 10,0 | NO | 0 |
| 59 | fbleconsestaveval | numeric | 10,0 | NO | 0 |

### facturacio
Columns: 28

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ftoid | numeric | 10,0 | NO | NULL |
| 2 | ftoorigen | numeric | 5,0 | NO | NULL |
| 3 | ftoopera | numeric | 5,0 | NO | NULL |
| 4 | ftomtfcod | numeric | 5,0 | NO | NULL |
| 5 | ftodesc | character varying | 30 | NO | NULL |
| 6 | ftosesid | numeric | 10,0 | NO | NULL |
| 7 | ftofeccrea | date | - | NO | NULL |
| 8 | ftoestado | numeric | 5,0 | NO | NULL |
| 9 | ftoresid | numeric | 10,0 | YES | NULL |
| 10 | ftofecfact | date | - | YES | NULL |
| 11 | ftofeciva | date | - | YES | NULL |
| 12 | ftoexpid | numeric | 5,0 | NO | NULL |
| 13 | ftozonid | character | 3 | YES | NULL |
| 14 | ftoanno | numeric | 5,0 | YES | NULL |
| 15 | ftoperiid | numeric | 5,0 | YES | NULL |
| 16 | ftopernum | numeric | 5,0 | YES | NULL |
| 17 | ftocarcod | numeric | 5,0 | YES | NULL |
| 18 | ftosnsimula | character | 1 | NO | 'N'::bpchar |
| 19 | ftofcontab | date | - | YES | NULL |
| 20 | ftosnimpdoc | character | 1 | NO | 'S'::bpchar |
| 21 | ftosnimploc | character | 1 | NO | 'N'::bpchar |
| 22 | ftofecimpu | date | - | NO | NULL |
| 23 | ftoviafac | numeric | 5,0 | NO | 1 |
| 24 | ftofarchiv | date | - | YES | NULL |
| 25 | ftosnarchiv | character | 1 | NO | 'N'::bpchar |
| 26 | ftoestadoface | numeric | 5,0 | YES | NULL |
| 27 | ftomodal | numeric | 5,0 | NO | 0 |
| 28 | ftoobserv | numeric | 10,0 | YES | NULL |

### facturadorext
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | facextid | numeric | 5,0 | NO | NULL |
| 2 | facextdes | character varying | 50 | NO | NULL |

### facturaexml
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | faxid | character varying | 50 | NO | NULL |
| 2 | faxnumfac | character varying | 18 | YES | NULL |
| 3 | faxxml | bytea | - | YES | NULL |

### famitarifa
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | famtcod | numeric | 5,0 | NO | NULL |
| 2 | famtdesctxtid | numeric | 10,0 | NO | NULL |
| 3 | famtagfmid | numeric | 5,0 | YES | NULL |

### fbleproforma
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fbprffbleid | numeric | 10,0 | NO | NULL |
| 2 | fbprfcnttppal | numeric | 10,0 | NO | NULL |
| 3 | fbprfagrudesc | character varying | 30 | NO | NULL |

### fbletarif
Columns: 20

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fbltfbleid | numeric | 10,0 | NO | NULL |
| 2 | fbltsocpro | numeric | 10,0 | NO | NULL |
| 3 | fbltsocemi | numeric | 10,0 | NO | NULL |
| 4 | fbltcptoid | numeric | 5,0 | NO | NULL |
| 5 | fbltttarid | numeric | 5,0 | NO | NULL |
| 6 | fbltfecapl | date | - | NO | NULL |
| 7 | fbltpctfecini | date | - | NO | NULL |
| 8 | fbltpctfecfin | date | - | YES | NULL |
| 9 | fbltflecini | date | - | YES | NULL |
| 10 | fbltflecfin | date | - | YES | NULL |
| 11 | fbltdiaslec | numeric | 5,0 | YES | NULL |
| 12 | fbltfctlec | numeric | 6,3 | YES | NULL |
| 13 | fbltfperini | date | - | YES | NULL |
| 14 | fbltfperfin | date | - | YES | NULL |
| 15 | fbltdiasper | numeric | 5,0 | YES | NULL |
| 16 | fbltfctper | numeric | 6,3 | YES | NULL |
| 17 | fbltflecinival | date | - | YES | NULL |
| 18 | fbltdiaslecval | numeric | 5,0 | YES | NULL |
| 19 | fbltfperinival | date | - | YES | NULL |
| 20 | fbltdiasperval | numeric | 5,0 | YES | NULL |

### fblevars
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fblvfbleid | numeric | 10,0 | NO | NULL |
| 2 | fblvtpvid | numeric | 5,0 | NO | NULL |
| 3 | fblvvalnum | numeric | 24,6 | YES | NULL |
| 4 | fblvvalchar | character | 20 | YES | NULL |
| 5 | fblvvalfec | date | - | YES | NULL |
| 6 | fblvvalbool | character | 1 | YES | NULL |
| 7 | fblvfecini | date | - | YES | NULL |
| 8 | fblvfecfin | date | - | YES | NULL |

### feccieliqcat
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fclcanyo | numeric | 5,0 | NO | NULL |
| 2 | fclcsocliqemi | numeric | 10,0 | NO | NULL |
| 3 | fclcsocliqprop | numeric | 10,0 | NO | NULL |
| 4 | fclcfeccierre | date | - | NO | NULL |

### fianza
Columns: 12

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fzaexpid | numeric | 5,0 | NO | NULL |
| 2 | fzasocprsid | numeric | 10,0 | NO | NULL |
| 3 | fzatconid | numeric | 5,0 | NO | NULL |
| 4 | fzarefer | numeric | 10,0 | NO | NULL |
| 5 | fzacnttnum | numeric | 10,0 | NO | NULL |
| 6 | fzafacid | numeric | 10,0 | NO | NULL |
| 7 | fzaimporte | numeric | 18,2 | NO | NULL |
| 8 | fzaopera | numeric | 10,0 | YES | NULL |
| 9 | fzaimpcomp | numeric | 18,2 | YES | NULL |
| 10 | fzaabono | numeric | 10,0 | YES | NULL |
| 11 | fzaoperec | numeric | 10,0 | YES | NULL |
| 12 | fzaopesal | numeric | 10,0 | YES | NULL |

### ficheroadj
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fadnum | numeric | 10,0 | NO | NULL |
| 2 | fadid | numeric | 10,0 | NO | NULL |
| 3 | fadtipo | numeric | 5,0 | NO | NULL |
| 4 | fadfechacrea | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 5 | fadidbinario | numeric | 10,0 | NO | NULL |
| 6 | fadformatofichero | numeric | 5,0 | NO | 0 |
| 7 | fadtipofichero | numeric | 5,0 | NO | NULL |
| 8 | fadidsegundario | numeric | - | YES | NULL |
| 9 | fadnomfichero | character varying | 100 | YES | NULL |

### ficheroadjbin
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fabidbinario | numeric | 10,0 | NO | NULL |
| 2 | fabbinario | bytea | - | NO | NULL |

### ficherorecibido
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | frcbnombre | character varying | 50 | NO | NULL |
| 2 | frcbtipo | numeric | 5,0 | NO | NULL |

### ficherosaborrar
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fabid | numeric | 10,0 | NO | NULL |
| 2 | fabpath | character varying | 200 | YES | NULL |
| 3 | fabprop | character varying | 100 | YES | NULL |
| 4 | fabfichero | character varying | 50 | NO | NULL |
| 5 | fabndias | numeric | 5,0 | NO | NULL |

### firma
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | firid | numeric | 5,0 | NO | NULL |
| 2 | firnombre | character varying | 30 | NO | NULL |
| 3 | fircod | character | 4 | NO | NULL |
| 4 | firfecha | timestamp without time zone | - | NO | NULL |
| 5 | firusuario | character varying | 10 | NO | NULL |

### firmaelectronica
Columns: 49

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fecid | numeric | 10,0 | NO | NULL |
| 2 | fecsocprsid | numeric | 10,0 | NO | NULL |
| 3 | fecfluid | character varying | 50 | NO | NULL |
| 4 | fecestado | numeric | 5,0 | NO | NULL |
| 5 | fecfeccrea | timestamp without time zone | - | NO | NULL |
| 6 | fecprsiddest | numeric | 10,0 | NO | NULL |
| 7 | feccnttnum | numeric | 10,0 | NO | NULL |
| 8 | fecfecenvio | timestamp without time zone | - | YES | NULL |
| 9 | fecmovil | character varying | 20 | YES | NULL |
| 10 | fecmailpdprsid | numeric | 10,0 | YES | NULL |
| 11 | fecmailpdnumdir | numeric | 5,0 | YES | NULL |
| 12 | feccodext | character varying | 36 | YES | NULL |
| 13 | fecfecevid | timestamp without time zone | - | YES | NULL |
| 14 | fecusucrea | character varying | 10 | NO | NULL |
| 15 | fecoficrea | numeric | 5,0 | NO | NULL |
| 16 | fectipproc | numeric | 5,0 | NO | NULL |
| 17 | fecoridat | numeric | 5,0 | NO | NULL |
| 18 | fecnumenvios | numeric | 5,0 | NO | 0 |
| 19 | fecregfecid | numeric | 10,0 | YES | NULL |
| 20 | fecorifecid | numeric | 10,0 | YES | NULL |
| 22 | fecevijson | character varying | 4000 | YES | NULL |
| 23 | fecsnclau | character | 1 | NO | 'N'::bpchar |
| 24 | fecfecclau | timestamp without time zone | - | YES | NULL |
| 25 | fecviacom | numeric | 5,0 | NO | '1'::numeric |
| 26 | fecurlpago | character varying | 500 | YES | NULL |
| 27 | fecpermavan | character | 1 | NO | 'N'::bpchar |
| 28 | fecdetalle | character varying | 256 | YES | NULL |
| 29 | fechstusu | character varying | 10 | NO | NULL |
| 30 | fechsthora | timestamp without time zone | - | NO | NULL |
| 31 | fectipoenvdig | numeric | 5,0 | YES | NULL |
| 32 | fecadjunto | character | 1 | NO | 'N'::bpchar |
| 33 | fecsnmailinc | character | 1 | NO | 'N'::bpchar |
| 34 | fecfecdoc | timestamp without time zone | - | YES | NULL |
| 35 | fecrefmid | numeric | 10,0 | YES | NULL |
| 36 | fecfeccanc | timestamp without time zone | - | YES | NULL |
| 37 | fecusucanc | character varying | 10 | YES | NULL |
| 38 | fecsnmailmod | character | 1 | NO | 'N'::bpchar |
| 39 | fecmailtxt | character varying | 150 | YES | NULL |
| 40 | fecsnadjrev | character | 1 | NO | 'N'::bpchar |
| 41 | fecnumenvcad | numeric | 5,0 | NO | '0'::numeric |
| 42 | fecnumenvblo | numeric | 5,0 | NO | '0'::numeric |
| 43 | fecestadoant | numeric | 5,0 | YES | NULL |
| 44 | fecfeccierre | timestamp without time zone | - | YES | NULL |
| 45 | fecpccid | numeric | 10,0 | YES | NULL |
| 46 | fecasignado | character varying | 10 | YES | NULL |
| 47 | fecgestionado | character | 1 | NO | 'N'::bpchar |
| 48 | fecfecaud | timestamp without time zone | - | YES | NULL |
| 49 | fecotfeid | numeric | 10,0 | YES | NULL |
| 50 | fecprefijo | character varying | 5 | YES | NULL |

### firmaelectronicaseguimasignado
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fesaid | numeric | 10,0 | NO | NULL |
| 2 | fesafecid | numeric | 10,0 | YES | NULL |
| 3 | fesausuario | character varying | 10 | YES | NULL |
| 4 | fesafechor | timestamp without time zone | - | YES | NULL |
| 5 | fesaasignado | character varying | 10 | YES | NULL |

### formapago
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fmpcanal | character | 1 | NO | NULL |
| 2 | fmpid | numeric | 5,0 | NO | NULL |
| 3 | fmptxtid | numeric | 10,0 | NO | NULL |
| 4 | fmpsncompcaj | character | 1 | NO | NULL |
| 7 | fmpsngasto | character | 1 | NO | 'N'::bpchar |
| 8 | fmpclave | numeric | 5,0 | YES | NULL |
| 9 | fmpccbanc | numeric | 5,0 | YES | NULL |
| 10 | fmpsnexento | character | 1 | YES | 'N'::bpchar |

### formapagosat
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fpsid | numeric | 10,0 | NO | NULL |
| 2 | fpsopecart | numeric | 10,0 | NO | NULL |
| 3 | fpscontrato | numeric | 10,0 | NO | NULL |
| 4 | fpsreferencia | numeric | 10,0 | YES | NULL |
| 5 | fpsclavesat | numeric | 5,0 | NO | NULL |

### formasum
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fsumcod | numeric | 5,0 | NO | NULL |
| 2 | fsumtxtid | numeric | 10,0 | NO | NULL |
| 3 | fsumindblk | numeric | 5,0 | NO | NULL |

### formatoemail
Columns: 6

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fmeid | numeric | 5,0 | NO | NULL |
| 2 | fmeidicodigo | character | 2 | NO | NULL |
| 3 | fmeasunto | character varying | 256 | YES | NULL |
| 4 | fmcuerpo | character varying | 1000 | YES | NULL |
| 5 | fmehstusu | character varying | 10 | NO | NULL |
| 6 | fmehsthora | timestamp without time zone | - | NO | NULL |

### formfactu
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fmfid | numeric | 5,0 | NO | NULL |
| 2 | fmfdescrip | character varying | 30 | NO | NULL |
| 3 | fmffecini | date | - | NO | NULL |
| 4 | fmffondo | bytea | - | YES | NULL |
| 5 | fmffonddup | bytea | - | YES | NULL |
| 6 | fmfclase | character varying | 60 | NO | NULL |
| 7 | fmfmetvisu | character varying | 30 | NO | NULL |
| 8 | fmfmetimpr | character varying | 30 | NO | NULL |
| 9 | fmfmetimpm | character varying | 30 | YES | NULL |

### formtpfac
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ftforigen | numeric | 5,0 | NO | NULL |
| 2 | ftfopera | numeric | 5,0 | NO | NULL |
| 3 | ftfpropid | numeric | 10,0 | NO | NULL |
| 4 | ftfformato | numeric | 5,0 | NO | NULL |

### fotolector
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | flid | character varying | 80 | NO | NULL |
| 2 | flpsid | numeric | 10,0 | NO | NULL |

### frmpagoban
Columns: 10

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fpbbngsoc | numeric | 10,0 | NO | NULL |
| 2 | fpbbngbanid | numeric | 5,0 | NO | NULL |
| 3 | fpbcanaid | character | 1 | NO | NULL |
| 4 | fpbfmpid | numeric | 5,0 | NO | NULL |
| 5 | fpbccuecon | numeric | 5,0 | NO | NULL |
| 6 | fpbcuegast | numeric | 5,0 | NO | NULL |
| 7 | fpbtimpuid | numeric | 5,0 | YES | NULL |
| 8 | fpbhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 9 | fpbhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 10 | fpbnif | character varying | 15 | YES | NULL |

### ftoclavesfp
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ffpftoid | numeric | 10,0 | NO | NULL |
| 2 | ffpclavesfp | character varying | 100 | NO | NULL |
| 3 | ffpcanal | character | 1 | YES | NULL |
| 4 | ffpfmpid | numeric | 5,0 | YES | NULL |

### ftocobrodiferido
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ftcdftoid | numeric | 10,0 | NO | NULL |
| 2 | ftcdpagocfcd | numeric | 5,0 | NO | NULL |
| 3 | ftcdsnrecplz | character | 1 | NO | NULL |

### ftorecapitulativa
Columns: 3

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ftrcpftoid | numeric | 10,0 | NO | NULL |
| 2 | ftrcpanno | numeric | 5,0 | NO | NULL |
| 3 | ftrcpmes | numeric | 5,0 | NO | NULL |

### funaplic
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | funcod | character varying | 50 | NO | NULL |
| 2 | funmoducod | character varying | 15 | NO | NULL |
| 3 | funtxtid | numeric | 10,0 | NO | NULL |
| 4 | funmenu | character | 1 | NO | NULL |
| 5 | funorden | numeric | 5,0 | NO | 0 |
| 6 | funcmd | character varying | 8 | YES | NULL |
| 7 | fundenperm | character | 1 | NO | 'N'::bpchar |
| 8 | fundenpor | character varying | 50 | YES | NULL |

### funfav
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ffavusuid | character varying | 10 | NO | NULL |
| 2 | ffavfuncod | character varying | 50 | NO | NULL |

### geolocalizacion
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | geolocid | numeric | 10,0 | NO | NULL |
| 2 | geoloclong | character varying | 30 | NO | NULL |
| 3 | geoloclat | character varying | 30 | NO | NULL |
| 4 | geolocaltitud | character varying | 30 | YES | NULL |
| 5 | geoloctipogps | numeric | 5,0 | NO | NULL |
| 6 | geoloctipocodificacion | numeric | 5,0 | NO | NULL |
| 7 | geolocfechacaptura | timestamp without time zone | - | NO | NULL |
| 8 | geolocorigen | numeric | 5,0 | YES | '1'::numeric |

### gescarta
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gescgesfid | numeric | 10,0 | NO | NULL |
| 2 | gescnumero | numeric | 5,0 | NO | NULL |
| 3 | gescfeccrea | date | - | NO | NULL |
| 4 | gescfecimp | date | - | YES | NULL |
| 5 | gescfecdev | date | - | YES | NULL |
| 6 | gescmotdev | numeric | 5,0 | YES | NULL |
| 7 | gescobs | character varying | 3500 | YES | NULL |
| 8 | geschstusu | character varying | 10 | NO | ''::character varying |
| 9 | geschsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### gescartera
Columns: 18

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gscid | numeric | 10,0 | NO | NULL |
| 2 | gsctipo | numeric | 5,0 | NO | NULL |
| 3 | gscdescri | character | 50 | NO | NULL |
| 4 | gscresid | numeric | 10,0 | YES | NULL |
| 5 | gsccondcrea | character varying | 1000 | YES | NULL |
| 6 | gscnumdom | numeric | 5,0 | YES | NULL |
| 7 | gsctermina | character | 1 | NO | NULL |
| 8 | gschoraterm | timestamp without time zone | - | YES | NULL |
| 9 | gscusuterm | character | 10 | YES | NULL |
| 10 | gscnapuntescsb | numeric | 10,0 | YES | NULL |
| 11 | gscimportecsb | numeric | 18,2 | YES | NULL |
| 12 | gscremcp | character | 1 | YES | NULL |
| 13 | gscrecobro | character | 1 | YES | 'N'::bpchar |
| 14 | gscgestorrecobro | numeric | 10,0 | YES | NULL |
| 15 | gscnumplazos | numeric | 5,0 | NO | 0 |
| 16 | gscsocord | numeric | 10,0 | YES | NULL |
| 17 | gsctiporeme | character | 1 | YES | NULL |
| 18 | gscimpcobanucsb | numeric | 18,2 | YES | NULL |

### gesfallidos
Columns: 8

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gesfid | numeric | 10,0 | NO | NULL |
| 2 | gesfordid | numeric | 10,0 | NO | NULL |
| 3 | gesffecinicio | date | - | NO | NULL |
| 4 | gesffecfin | date | - | YES | NULL |
| 5 | gesffecespfin | date | - | YES | NULL |
| 6 | gesfsnfalltot | character | 1 | NO | NULL |
| 7 | gesfhstusu | character varying | 10 | NO | ''::character varying |
| 8 | gesfhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### gesllamada
Columns: 9

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gesllgesfid | numeric | 10,0 | NO | NULL |
| 2 | gesllnumero | numeric | 5,0 | NO | NULL |
| 3 | gesllfecha | date | - | NO | NULL |
| 4 | gesllhora | timestamp without time zone | - | NO | NULL |
| 5 | gesllcontacto | numeric | 5,0 | NO | NULL |
| 6 | gesllcontobs | character varying | 100 | YES | NULL |
| 7 | gesllobs | character varying | 3500 | YES | NULL |
| 8 | gesllhstusu | character varying | 10 | NO | ''::character varying |
| 9 | gesllhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### gesrcprcontra
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | grpccnttid | numeric | 10,0 | NO | NULL |
| 2 | grpcgespid | numeric | 10,0 | NO | NULL |
| 3 | grpcfeccad | date | - | YES | NULL |
| 4 | grpcsesexl | numeric | 10,0 | YES | NULL |

### gestautoriz
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gsaid | numeric | 5,0 | NO | NULL |
| 2 | gsatxtid | numeric | 10,0 | NO | NULL |

### gestcobro
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gcobprsid | numeric | 10,0 | NO | NULL |
| 2 | gcobexpid | numeric | 5,0 | NO | NULL |
| 3 | gcobtgcid | numeric | 5,0 | NO | NULL |
| 4 | gcobdiasplazo | numeric | 5,0 | NO | NULL |
| 5 | gcobcomision | numeric | 6,2 | NO | NULL |
| 6 | gcobhstusu | character varying | 10 | NO | NULL |
| 7 | gcobhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 8 | gcobforaplicom | numeric | 5,0 | NO | 1 |
| 9 | gcobcomalta | numeric | 6,2 | NO | 0 |
| 10 | gcobcombaja | numeric | 6,2 | NO | 0 |
| 11 | gcobcodigo | numeric | 10,0 | YES | NULL |

### gestcptocobro
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gccgesid | numeric | 10,0 | NO | NULL |
| 2 | gccctcid | numeric | 10,0 | NO | NULL |

### gestionfac
Columns: 4

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gfafactura | numeric | 10,0 | NO | NULL |
| 2 | gfagestion | numeric | 10,0 | NO | NULL |
| 3 | gfasesexcl | numeric | 10,0 | YES | NULL |
| 4 | gfanotificado | character | 1 | YES | 'N'::bpchar |

### gestionfacdif
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gfdgestion | numeric | 10,0 | NO | NULL |
| 2 | gfdfactura | numeric | 10,0 | NO | NULL |
| 3 | gdfcuotaini | numeric | 18,2 | YES | NULL |
| 4 | gfdimpdif | numeric | 18,2 | YES | NULL |
| 5 | gdfinteres | numeric | 5,2 | YES | NULL |
| 6 | gfdcptoexpid | numeric | 5,0 | NO | NULL |
| 7 | gdfcptotconid | numeric | 5,0 | NO | NULL |

### gestionov
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | govcnttnum | numeric | 10,0 | NO | NULL |
| 2 | govprsid | numeric | 10,0 | NO | NULL |
| 3 | govsocprsid | numeric | 10,0 | NO | NULL |
| 4 | govusuario | character varying | 40 | NO | NULL |
| 5 | govfechalogin | date | - | YES | NULL |

### gestreatmk
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | grtbgtid | numeric | 10,0 | NO | NULL |
| 2 | grtfecha | timestamp without time zone | - | NO | NULL |
| 3 | grtrgtid | numeric | 5,0 | NO | NULL |
| 4 | grtusuid | character varying | 10 | NO | NULL |
| 5 | grtofiid | numeric | 5,0 | NO | NULL |
| 6 | grtobserva | character varying | 40 | YES | NULL |
| 7 | grtorigen | character | 1 | NO | NULL |

### gestreccprov
Columns: 11

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gespid | numeric | 10,0 | NO | NULL |
| 2 | gespprppid | numeric | 10,0 | NO | NULL |
| 3 | gesppaspid | numeric | 5,0 | NO | NULL |
| 4 | gesporigen | character | 1 | NO | NULL |
| 5 | gespsesini | numeric | 10,0 | NO | NULL |
| 6 | gespfvento | date | - | NO | NULL |
| 7 | gespestado | numeric | 5,0 | NO | NULL |
| 8 | gespresid | numeric | 10,0 | YES | NULL |
| 9 | gesppcsid | numeric | 10,0 | YES | NULL |
| 10 | gesphstusu | character varying | 10 | NO | NULL |
| 11 | gesphsthora | timestamp without time zone | - | NO | NULL |

### gestreclam
Columns: 22

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gesid | numeric | 10,0 | NO | NULL |
| 2 | gesdescri | character varying | 30 | NO | NULL |
| 3 | gesproceso | numeric | 10,0 | NO | NULL |
| 4 | gespaso | numeric | 10,0 | NO | NULL |
| 5 | gessesini | numeric | 10,0 | NO | NULL |
| 6 | gesfvento | date | - | NO | NULL |
| 7 | gesestado | numeric | 5,0 | NO | NULL |
| 8 | gesfeccart | date | - | YES | NULL |
| 9 | gesresid | numeric | 10,0 | YES | NULL |
| 10 | gespcsid | numeric | 10,0 | YES | NULL |
| 11 | gessnnecaprob | character | 1 | NO | 'N'::bpchar |
| 12 | gesfecaprob | timestamp without time zone | - | YES | NULL |
| 13 | gessncanccambd | character | 1 | NO | 'N'::bpchar |
| 15 | geshstusu | character varying | 10 | NO | NULL |
| 16 | geshsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 17 | gesaprobada | character | 1 | NO | 'N'::bpchar |
| 18 | gesnoaprobada | character | 1 | NO | 'N'::bpchar |
| 19 | gessocprops | character varying | 100 | YES | NULL |
| 20 | gesmotfacts | character varying | 256 | YES | NULL |
| 21 | gesidant | numeric | 10,0 | YES | NULL |
| 22 | gesidorig | numeric | 10,0 | YES | NULL |
| 23 | gesappid | numeric | 10,0 | YES | NULL |

### gestreclvar
Columns: 5

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | grvgesid | numeric | 10,0 | NO | NULL |
| 2 | grvcnttnum | numeric | 10,0 | NO | NULL |
| 3 | grvvarid | numeric | 10,0 | NO | NULL |
| 4 | grvsnborrar | character | 1 | NO | NULL |
| 5 | grvvalor | character varying | 20 | YES | NULL |

### gesttramos
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gsttprsid | numeric | 10,0 | NO | NULL |
| 2 | gsttexpid | numeric | 5,0 | NO | NULL |
| 3 | gsttlimite | numeric | 5,0 | NO | NULL |
| 4 | gsttdescripcion | character varying | 50 | NO | NULL |
| 5 | gsttcomision | numeric | 6,2 | NO | NULL |
| 6 | gstthstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 7 | gstthsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

### gisenvio
Columns: 35

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gieid | numeric | 10,0 | NO | NULL |
| 2 | giegrupoenvio | numeric | 10,0 | YES | NULL |
| 3 | gieestado | numeric | 5,0 | NO | 1 |
| 4 | giemensaje | character varying | 100 | YES | NULL |
| 5 | gieptosid | numeric | 10,0 | YES | NULL |
| 6 | gieptosrefcat | character varying | 30 | YES | NULL |
| 7 | gieptoszonid | character | 3 | YES | NULL |
| 8 | gieptoscodrec | numeric | 14,0 | YES | NULL |
| 9 | gieptosestado | numeric | 5,0 | YES | NULL |
| 10 | gieptostpsid | numeric | 5,0 | YES | NULL |
| 11 | giecontid | numeric | 10,0 | YES | NULL |
| 12 | giecontnumero | character varying | 12 | YES | NULL |
| 13 | giecalieqpul | character varying | 10 | YES | NULL |
| 14 | giecnttnum | numeric | 10,0 | YES | NULL |
| 15 | giecnttcateid | numeric | 5,0 | YES | NULL |
| 16 | gieprsid | numeric | 10,0 | YES | NULL |
| 17 | gieprsnomcpto | character varying | 203 | YES | NULL |
| 18 | gieprstelef | character varying | 16 | YES | NULL |
| 19 | giedirid | numeric | 10,0 | YES | NULL |
| 20 | giedirtexto | character varying | 110 | YES | NULL |
| 21 | giepobid | numeric | 10,0 | YES | NULL |
| 22 | giepobnombre | character varying | 40 | YES | NULL |
| 23 | giedirlocid | numeric | 10,0 | YES | NULL |
| 24 | gielocnombre | character varying | 40 | YES | NULL |
| 25 | giencalbarrid | numeric | 5,0 | YES | NULL |
| 26 | giebarrnombre | character varying | 30 | YES | NULL |
| 27 | giedircalid | numeric | 10,0 | YES | NULL |
| 28 | giencalnombre | character varying | 80 | YES | NULL |
| 29 | giedirparimp | numeric | 5,0 | YES | NULL |
| 30 | giedirnumdes | numeric | 10,0 | YES | NULL |
| 31 | gienumero | character varying | 80 | YES | NULL |
| 32 | giedircomplem | character varying | 40 | YES | NULL |
| 33 | giefechacrea | timestamp without time zone | - | NO | NULL |
| 34 | giefechaenvio | timestamp without time zone | - | YES | NULL |
| 35 | giefechaconfirm | timestamp without time zone | - | YES | NULL |

### gisenvioep
Columns: 18

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | giepid | numeric | 10,0 | NO | NULL |
| 2 | giepestado | numeric | 5,0 | NO | 1 |
| 3 | giepmensaje | character varying | 100 | YES | NULL |
| 4 | gieptabla | character varying | 10 | NO | NULL |
| 5 | gieppobid | numeric | 10,0 | NO | NULL |
| 6 | gieppobnombre | character varying | 40 | YES | NULL |
| 7 | gieplocid | numeric | 10,0 | YES | NULL |
| 8 | gieplocnombre | character varying | 40 | YES | NULL |
| 9 | giepbarrid | numeric | 5,0 | YES | NULL |
| 10 | giepbarrnombre | character varying | 80 | YES | NULL |
| 11 | giepncalcalid | numeric | 10,0 | YES | NULL |
| 12 | giepncalnombre | character varying | 80 | YES | NULL |
| 13 | giepcalparimp | numeric | 5,0 | YES | NULL |
| 14 | giepcalnumdes | numeric | 10,0 | YES | NULL |
| 15 | giepfechacrea | timestamp without time zone | - | NO | NULL |
| 16 | giepgrupoenvio | numeric | 10,0 | YES | NULL |
| 17 | giepfechaenvio | timestamp without time zone | - | YES | NULL |
| 18 | giepfechaconfirm | timestamp without time zone | - | YES | NULL |

### gradoinsolv
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | grinid | numeric | 5,0 | NO | NULL |
| 2 | grindesctxtid | numeric | 10,0 | NO | NULL |

### grupactivi
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | graid | numeric | 5,0 | NO | NULL |
| 2 | gratxtid | numeric | 10,0 | NO | NULL |
| 3 | grasn_ind | character | 1 | NO | NULL |
| 4 | grarpcgrup | numeric | 5,0 | YES | NULL |
| 5 | grarpciae | character | 1 | NO | NULL |
| 6 | gratxtidlg | numeric | 10,0 | YES | NULL |
| 7 | graprsid | numeric | 10,0 | NO | NULL |

### grupodocumento
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gdoid | numeric | 5,0 | NO | NULL |
| 2 | gdocarpeta | character | 20 | NO | NULL |

### grupotarea
Columns: 2

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gtreid | numeric | 5,0 | NO | NULL |
| 2 | gtredesc | character varying | 100 | NO | NULL |

### grupovarcontra
Columns: 7

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | gvctctcod | numeric | 10,0 | NO | NULL |
| 2 | gvcgrupo | numeric | 5,0 | NO | NULL |
| 3 | gvcdesc | character varying | 30 | NO | NULL |
| 4 | gvcminvars | numeric | 5,0 | NO | NULL |
| 5 | gvcmaxvars | numeric | 5,0 | NO | NULL |
| 6 | gvchstusu | character varying | 10 | NO | NULL |
| 7 | gvchsthora | timestamp without time zone | - | NO | NULL |
