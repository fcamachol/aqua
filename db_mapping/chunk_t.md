# Database Map - Tables T*
## Schema: cf_quere_pro

### t074
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ktopl | character | 4 | YES | NULL |
| 2 | koart | character | 1 | YES | NULL |
| 3 | umskz | character | 1 | YES | NULL |
| 4 | hkont | character | 8 | YES | NULL |
| 5 | skont | character | 8 | YES | NULL |
| 6 | ebene | character | 2 | YES | NULL |

---

### tabladesc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tdid | numeric | 10,0 | NO | NULL |
| 2 | tdidicod | character | 2 | NO | NULL |
| 3 | tdtxtid | numeric | 10,0 | NO | NULL |
| 4 | tddesc | character varying | 1000 | NO | NULL |
| 5 | tdhstusu | character varying | 10 | NO | NULL |
| 6 | tdhsthora | timestamp without time zone | - | NO | NULL |

---

### tablas_multiidioma
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tabla | name | - | YES | NULL |
| 2 | descripcion_tabla | text | - | YES | NULL |
| 3 | columna | name | - | YES | NULL |
| 4 | descripcion_columna | text | - | YES | NULL |

---

### tablastmp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ttmpid | numeric | 10,0 | NO | NULL |
| 2 | ttmporigen | character varying | 20 | NO | NULL |
| 3 | ttmpobs | character varying | 100 | NO | NULL |
| 4 | ttmpestado | numeric | 5,0 | NO | NULL |
| 5 | ttmptreid | numeric | 10,0 | YES | NULL |
| 6 | ttmpfecha | date | - | YES | CURRENT_TIMESTAMP |

---

### tablatext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ttid | numeric | 10,0 | NO | NULL |
| 2 | ttidicod | character | 2 | NO | NULL |
| 3 | tttxtid | numeric | 10,0 | NO | NULL |
| 4 | ttdesc | text | - | NO | NULL |
| 5 | tthstusu | character | 10 | NO | NULL |
| 6 | tthsthora | timestamp without time zone | - | NO | NULL |

---

### taralterna
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | talexpid | numeric | 5,0 | NO | NULL |
| 2 | talcptoid | numeric | 5,0 | NO | NULL |
| 3 | talttarid | numeric | 5,0 | NO | NULL |
| 4 | talcnttnum | numeric | 10,0 | NO | NULL |
| 5 | talpctfecini | date | - | NO | NULL |
| 6 | talanno | numeric | 5,0 | NO | NULL |
| 7 | talttaralt | numeric | 5,0 | NO | NULL |
| 8 | talpocid | numeric | 10,0 | NO | NULL |

---

### tarcontenedor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tcnid | numeric | 10,0 | NO | NULL |
| 2 | tcndescrip | character varying | 70 | NO | NULL |
| 3 | tcnorigen | numeric | 5,0 | NO | NULL |
| 4 | tcnplantilla | numeric | 10,0 | YES | NULL |
| 5 | tcnverplantilla | numeric | 5,0 | YES | NULL |
| 6 | tcnestado | numeric | 5,0 | NO | NULL |
| 7 | tcnsnfinexito | character | 1 | NO | NULL |
| 8 | tcndepend | numeric | 10,0 | YES | NULL |
| 9 | tcnsnfuncional | character | 1 | NO | NULL |
| 10 | tcnsninmediata | character | 1 | NO | NULL |
| 11 | tcnhoraplan | timestamp without time zone | - | YES | NULL |
| 12 | tcnhoralim | timestamp without time zone | - | YES | NULL |
| 13 | tcnhoraini | timestamp without time zone | - | YES | NULL |
| 14 | tcnhorafin | timestamp without time zone | - | YES | NULL |
| 15 | tcnperiod | numeric | 5,0 | YES | NULL |
| 16 | tcnminper | numeric | 5,0 | YES | NULL |
| 17 | tcnsnacont | character | 1 | NO | NULL |
| 18 | tcnhoracrea | timestamp without time zone | - | NO | NULL |
| 19 | tcnidreplanif | numeric | 10,0 | YES | NULL |
| 20 | tcnservnombre | character varying | 128 | YES | NULL |
| 21 | tcnservinst | numeric | 5,0 | YES | NULL |
| 22 | tcnespera | numeric | 10,0 | YES | NULL |
| 23 | tcnesperafuncional | character | 1 | NO | 'N'::bpchar |

---

### tarea
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | treid | numeric | 10,0 | NO | NULL |
| 2 | tregesproc | character varying | 150 | NO | NULL |
| 3 | tremetodo | character varying | 100 | NO | NULL |
| 4 | tregtreid | numeric | 5,0 | NO | 0 |
| 5 | treorden | numeric | 5,0 | NO | 1 |
| 6 | trehoraplan | time without time zone | - | YES | NULL |
| 7 | tresnbatch | character | 1 | NO | 'N'::bpchar |
| 8 | tremaxhilo | numeric | 5,0 | YES | NULL |
| 9 | trenomtxtid | numeric | 10,0 | NO | NULL |
| 10 | tredesctxtid | numeric | 10,0 | NO | NULL |
| 11 | tresnejecparalela | character | 1 | NO | 'N'::bpchar |
| 12 | tredroptablastemporales | numeric | 5,0 | NO | 0 |
| 13 | tremaxhilodbcopia | numeric | 5,0 | YES | NULL |
| 14 | trehoraretrejec | numeric | 5,0 | YES | NULL |
| 15 | treusunotif | character varying | 10 | YES | NULL |

---

### tareaparams
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tprid | numeric | 10,0 | NO | NULL |
| 2 | tprparam | numeric | 10,0 | NO | NULL |

---

### tareapevento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpeid | numeric | 10,0 | NO | NULL |
| 2 | tpepath | character varying | 200 | YES | NULL |
| 3 | tpetreid | numeric | 10,0 | NO | NULL |

---

### tarescuela
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tescid | numeric | 5,0 | NO | NULL |
| 2 | tescdescritxtid | numeric | 10,0 | NO | NULL |
| 3 | tescimporte | numeric | 18,2 | NO | NULL |

---

### tarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tarexpid | numeric | 5,0 | NO | NULL |
| 2 | tarconceid | numeric | 5,0 | NO | NULL |
| 3 | tartiptid | numeric | 5,0 | NO | NULL |
| 4 | tarfmtcod | numeric | 5,0 | NO | NULL |
| 5 | tarvigente | character | 1 | NO | NULL |
| 6 | tarsnapliper | character | 1 | NO | 'N'::bpchar |
| 7 | tarperiidf | numeric | 5,0 | YES | NULL |
| 8 | tarsnadelfto | character | 1 | NO | NULL |
| 9 | tarhstusu | character varying | 10 | NO | NULL |
| 10 | tarhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 11 | tarsngesbonif | character | 1 | NO | 'N'::bpchar |
| 12 | tarvarimporte | numeric | 5,0 | YES | NULL |
| 13 | tartiptarsoc | numeric | 5,0 | YES | NULL |

---

### tarifaytozgz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tarzgzid | numeric | 5,0 | NO | NULL |
| 2 | tarzgztptarifa | numeric | 5,0 | NO | NULL |
| 3 | tarzgztiptid | numeric | 5,0 | NO | NULL |
| 4 | tarzgzusoayu | character varying | 30 | YES | NULL |
| 5 | tarzgzvaltar | character | 3 | NO | NULL |

---

### tariftao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ttaoexpid | numeric | 5,0 | NO | NULL |
| 2 | ttasoc | numeric | 10,0 | NO | NULL |
| 3 | ttaotconid | numeric | 5,0 | NO | NULL |
| 4 | ttaotartipid | numeric | 5,0 | NO | NULL |
| 5 | ttaotartao | numeric | 5,0 | NO | NULL |
| 6 | ttaosnexenta | character | 1 | NO | 'N'::bpchar |

---

### tarifvartao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tvtexpid | numeric | 5,0 | NO | NULL |
| 2 | tvtsoc | numeric | 10,0 | NO | NULL |
| 3 | tvtotconid | numeric | 5,0 | NO | NULL |
| 4 | tvtotartipid | numeric | 5,0 | NO | NULL |
| 5 | tvtvar | numeric | 5,0 | NO | NULL |
| 6 | tvtotartao | numeric | 5,0 | NO | NULL |
| 7 | tvtosnexenta | character | 1 | NO | 'N'::bpchar |

---

### tarmetrica
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmtid | numeric | 10,0 | NO | NULL |
| 2 | tmttpfid | numeric | 10,0 | NO | NULL |
| 3 | tmtsocprsid | numeric | 10,0 | YES | NULL |
| 4 | tmtexpid | numeric | 5,0 | YES | NULL |
| 5 | tmtmiliseg | numeric | 10,0 | NO | NULL |
| 6 | tmtmetrica1 | numeric | 10,0 | NO | NULL |
| 7 | tmtmetrica2 | numeric | 10,0 | YES | NULL |
| 8 | tmtvalor1 | numeric | 14,2 | YES | NULL |
| 9 | tmtvalor2 | numeric | 14,2 | YES | NULL |

---

### tarplanif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpfid | numeric | 10,0 | NO | NULL |
| 2 | tpftarea | numeric | 10,0 | NO | NULL |
| 3 | tpfcontenedor | numeric | 10,0 | YES | NULL |
| 4 | tpfplantilla | numeric | 10,0 | YES | NULL |
| 5 | tpfparametros | character varying | 2000 | YES | NULL |
| 6 | tpfexpid | numeric | 5,0 | YES | NULL |
| 7 | tpfsocprsid | numeric | 10,0 | YES | NULL |
| 8 | tpfdepend | numeric | 10,0 | YES | NULL |
| 9 | tpfsnfuncional | character | 1 | NO | NULL |
| 10 | tpfestado | numeric | 5,0 | NO | NULL |
| 11 | tpfhoraini | timestamp without time zone | - | YES | NULL |
| 12 | tpfhorafin | timestamp without time zone | - | YES | NULL |
| 13 | tpfresultado | text | - | YES | NULL |
| 14 | tpfusuario | character varying | 10 | NO | NULL |
| 15 | tpfhorasolic | timestamp without time zone | - | NO | NULL |
| 16 | tpfofiid | numeric | 5,0 | YES | NULL |
| 17 | tpfip | character varying | 15 | YES | NULL |
| 18 | tpfpuerto | numeric | 10,0 | YES | NULL |
| 19 | tpfservnombre | character varying | 128 | YES | NULL |
| 20 | tpfservinst | numeric | 5,0 | YES | NULL |
| 21 | tpfusunotif | character varying | 10 | YES | NULL |
| 22 | tpfnotifexito | character | 1 | YES | 'N'::bpchar |
| 23 | tpfdbcopia | character | 1 | NO | 'N'::bpchar |

---

### tarultimejec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tuetreid | numeric | 10,0 | NO | NULL |
| 2 | tuefecha | timestamp without time zone | - | NO | NULL |

---

### tbsl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | bschl | character | 2 | YES | NULL |
| 2 | shkzg | character | 1 | YES | NULL |
| 3 | koart | character | 1 | YES | NULL |
| 4 | ltext | character | 30 | YES | NULL |

---

### tcscsustcu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tcsutcsid | numeric | 5,0 | NO | NULL |
| 2 | tcsuprsid | numeric | 10,0 | NO | NULL |
| 3 | tcsucuorig | numeric | 5,0 | NO | NULL |
| 4 | tcsucusust | numeric | 5,0 | NO | NULL |
| 5 | tcsusnactiva | character | 1 | NO | NULL |
| 6 | tcsuhstusu | character varying | 10 | NO | NULL |
| 7 | tcsuhsthora | timestamp without time zone | - | NO | NULL |

---

### tipasiento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tasid | numeric | 5,0 | NO | NULL |
| 2 | tastxtid | numeric | 10,0 | NO | NULL |
| 3 | tastextotxtid | numeric | 10,0 | NO | NULL |
| 4 | tasdh | character | 1 | NO | NULL |
| 5 | tassnrecar | character | 1 | NO | NULL |
| 6 | tassnperio | character | 1 | NO | NULL |
| 7 | tasclsdoc | character | 2 | NO | NULL |
| 8 | tashstusu | character varying | 10 | NO | NULL |
| 9 | tashsthora | timestamp without time zone | - | NO | NULL |
| 10 | tascatsisext | character varying | 25 | YES | NULL |

---

### tipcliente
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tclicod | character | 1 | NO | NULL |
| 2 | tclitxtid | numeric | 10,0 | NO | NULL |
| 3 | tclimunici | character | 1 | NO | NULL |
| 4 | tclidotmor | character | 1 | NO | NULL |
| 5 | tclisnefac | character | 1 | NO | 'N'::bpchar |
| 6 | tclisncortpos | character | 1 | NO | 'S'::bpchar |
| 7 | tclisncargodemora | character | 1 | NO | 'N'::bpchar |
| 8 | tclisnintdem | character | 1 | NO | 'N'::bpchar |
| 9 | tclsnblqsalmov | character | 1 | YES | 'N'::bpchar |

---

### tipcontmtr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tctconid | numeric | 5,0 | NO | NULL |

---

### tipfacgasrec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tfgrmfid | numeric | 5,0 | NO | NULL |
| 2 | tfgrexpid | numeric | 5,0 | NO | NULL |

---

### tipfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpforigen | numeric | 5,0 | NO | NULL |
| 2 | tpfopera | numeric | 5,0 | NO | NULL |
| 3 | tpfdescri | character varying | 30 | NO | NULL |
| 4 | tpfsrfcod | character | 1 | NO | NULL |
| 5 | tpftipasie | numeric | 5,0 | NO | NULL |
| 6 | tpfhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 7 | tpfhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tipfichtao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tftexpid | numeric | 5,0 | NO | NULL |
| 2 | tftsoc | numeric | 10,0 | NO | NULL |
| 3 | tfttipfich | numeric | 5,0 | NO | NULL |

---

### tipfraude
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tipfraid | numeric | 5,0 | NO | NULL |
| 2 | tipfratxtid | numeric | 10,0 | NO | NULL |
| 3 | tipfrahstusu | character varying | 10 | NO | ''::character varying |
| 4 | tipfrahsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 5 | tipclandes | character | 1 | NO | 'N'::bpchar |

---

### tipgesdeud
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tgedcod | numeric | 5,0 | NO | NULL |
| 2 | tgedtxtid | numeric | 10,0 | NO | NULL |
| 3 | tgedtxtidabr | numeric | 10,0 | NO | NULL |
| 4 | tgedsnimprraf | character | 1 | NO | 'S'::bpchar |
| 5 | tgedsnexcfacrep | character | 1 | NO | 'N'::bpchar |

---

### tipimpues
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | timpuid | numeric | 5,0 | NO | NULL |
| 2 | timpuimpid | numeric | 5,0 | NO | NULL |
| 3 | timputxtid | numeric | 10,0 | NO | NULL |
| 4 | timpucod347 | character | 1 | NO | '0'::bpchar |

---

### tipliqsoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tlssocid | numeric | 10,0 | NO | NULL |
| 2 | tlstliqid | numeric | 5,0 | NO | NULL |

---

### tipoactsucsif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tacssiftipid | numeric | 5,0 | NO | NULL |
| 2 | tacssifactid | numeric | 5,0 | NO | NULL |

---

### tipoalarmatel
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tatcodigo | numeric | 5,0 | NO | NULL |
| 2 | tattxtid | numeric | 10,0 | NO | NULL |
| 3 | tatsnactivo | character | 1 | NO | 'S'::bpchar |
| 4 | tatsnmosencont | character | 1 | NO | 'S'::bpchar |

---

### tipoalarmatelext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | taeid | numeric | 5,0 | NO | NULL |
| 2 | taesistema | numeric | 5,0 | NO | NULL |
| 3 | taecodigo | character varying | 50 | NO | NULL |
| 4 | taetxtid | numeric | 10,0 | NO | NULL |
| 5 | taesnactivo | character | 1 | NO | 'S'::bpchar |

---

### tipoatencion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpaid | numeric | 5,0 | NO | NULL |
| 2 | tpatxtid | numeric | 10,0 | NO | NULL |
| 3 | tpasnpresen | character | 1 | NO | NULL |
| 4 | tpasnactiva | character | 1 | NO | 'S'::bpchar |

---

### tipobonif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tbid | numeric | 5,0 | NO | NULL |
| 2 | tbexpid | numeric | 5,0 | NO | NULL |
| 3 | tbtxtid | numeric | 10,0 | NO | NULL |
| 4 | tbfecini | date | - | NO | NULL |
| 5 | tbfecfin | date | - | YES | NULL |
| 6 | tbdiasbonif | numeric | 5,0 | YES | NULL |
| 7 | tbdiasnotifvenc | numeric | 5,0 | YES | NULL |
| 8 | tbfacimpagadas | numeric | 5,0 | YES | NULL |
| 9 | tbprsid | numeric | 10,0 | YES | NULL |
| 10 | tbdiasaprob | numeric | 5,0 | YES | NULL |
| 11 | tbsniniaprob | character | 1 | NO | 'N'::bpchar |
| 12 | tbusocod | numeric | 5,0 | YES | NULL |
| 13 | tbconceidmod | numeric | 5,0 | YES | NULL |
| 14 | tbtiptidmod | numeric | 5,0 | YES | NULL |
| 15 | tbaplicacion | numeric | 5,0 | NO | 0 |
| 16 | tbconceidasig | numeric | 5,0 | YES | NULL |
| 17 | tbtiptidasig | numeric | 5,0 | YES | NULL |
| 18 | tbsncambtarif | character | 1 | NO | 'N'::bpchar |
| 19 | tbhstusu | character varying | 10 | NO | NULL |
| 20 | tbhsthora | timestamp without time zone | - | NO | NULL |
| 21 | tbnumvar | numeric | 10,0 | YES | NULL |

---

### tipobonifdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tbdtbid | numeric | 5,0 | NO | NULL |
| 2 | tbddconid | numeric | 10,0 | NO | NULL |
| 3 | tbdsnactivo | character | 1 | NO | NULL |
| 4 | tbdsnobligat | character | 1 | NO | NULL |
| 5 | tbdhstusu | character varying | 10 | NO | NULL |
| 6 | tbdhsthora | timestamp without time zone | - | NO | NULL |

---

### tipocarta
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tcarid | numeric | 5,0 | NO | NULL |
| 2 | tcardesc | character varying | 30 | NO | NULL |
| 3 | tcardocum | character varying | 60 | NO | NULL |
| 4 | tcarcertif | character | 1 | NO | NULL |

---

### tipocatcalle
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpctcid | numeric | 5,0 | NO | NULL |
| 2 | tpctctxtid | numeric | 10,0 | NO | NULL |

---

### tipoconcep
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tconid | numeric | 5,0 | NO | NULL |
| 2 | tcontxtid | numeric | 10,0 | NO | NULL |
| 3 | tconhstusu | character varying | 10 | NO | ' '::character varying |
| 4 | tconhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 5 | tconrcuid | numeric | 5,0 | YES | NULL |
| 6 | tconsncargodemora | character | 1 | NO | 'N'::bpchar |
| 7 | tconsnintdem | character | 1 | NO | 'N'::bpchar |
| 8 | tconsnintfrac | character | 1 | NO | 'N'::bpchar |
| 9 | tconsnfacdiferida | character varying | 1 | NO | 'N'::character varying |
| 10 | tconsncargored | character | 1 | NO | 'N'::bpchar |
| 11 | tconsncreditored | character | 1 | NO | 'N'::bpchar |

---

### tipocontador
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tcnid | numeric | 5,0 | NO | NULL |
| 2 | tcntxtid | numeric | 10,0 | NO | NULL |
| 3 | tcntplote | character | 1 | NO | NULL |
| 4 | tcntipo | numeric | 5,0 | NO | 1 |

---

### tipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tctclsccod | character | 2 | NO | NULL |
| 2 | tctcod | character | 2 | NO | NULL |
| 3 | tctdesc | character varying | 30 | NO | NULL |
| 4 | tctcalimm | numeric | 5,0 | YES | NULL |
| 5 | tctmarca | numeric | 5,0 | NO | NULL |
| 6 | tctmodelo | numeric | 5,0 | NO | NULL |
| 7 | tctformato | numeric | 5,0 | NO | NULL |
| 8 | tcttipclie | character varying | 30 | YES | NULL |
| 9 | tctperid | character varying | 30 | YES | NULL |
| 10 | tctactivo | character | 1 | NO | NULL |
| 11 | tctsesid | numeric | 10,0 | NO | NULL |
| 12 | tcthora | time without time zone | - | NO | NULL |
| 13 | tctobras | character | 1 | NO | NULL |
| 14 | tcttpsid | numeric | 5,0 | YES | NULL |
| 15 | tctcedula | character | 1 | NO | 'N'::bpchar |
| 16 | tctcontcedido | character | 1 | NO | 'N'::bpchar |
| 17 | tctdocsubr | character | 1 | NO | 'N'::bpchar |
| 18 | tcthstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 19 | tcthsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tipocontratcn
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tctcod | numeric | 10,0 | NO | NULL |
| 2 | tcttxtid | numeric | 10,0 | NO | NULL |
| 3 | tctsnactivo | character | 1 | NO | NULL |
| 4 | tctexpid | numeric | 5,0 | NO | NULL |
| 5 | tctclsccod | character | 2 | NO | NULL |
| 6 | tctsncontcedido | character | 1 | NO | NULL |
| 7 | tcttpsid | numeric | 5,0 | NO | NULL |
| 8 | tcttetid | numeric | 5,0 | NO | NULL |
| 9 | tctcodsperi | character | 30 | YES | NULL |
| 10 | tctcodstcli | character | 30 | YES | NULL |
| 11 | tctsnformal | character | 1 | NO | NULL |
| 12 | tctsnobras | character | 1 | NO | NULL |
| 13 | tctmarcid | numeric | 5,0 | YES | NULL |
| 14 | tctmodid | numeric | 5,0 | YES | NULL |
| 15 | tctcalimm | numeric | 5,0 | YES | NULL |
| 16 | tctprsid | numeric | 10,0 | YES | NULL |
| 17 | tctdiasaprob | numeric | 5,0 | YES | NULL |
| 18 | tctcntrtpdid | numeric | 5,0 | YES | NULL |
| 19 | tctcntrcopias | numeric | 5,0 | YES | NULL |
| 20 | tctsubrtpdid | numeric | 5,0 | YES | NULL |
| 21 | tctsubrcopias | numeric | 5,0 | YES | NULL |
| 22 | tctbajatpdid | numeric | 5,0 | YES | NULL |
| 23 | tctbajacopias | numeric | 5,0 | YES | NULL |
| 24 | tcthstusu | character varying | 10 | NO | NULL |
| 25 | tcthsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 26 | tctactidef | numeric | 5,0 | YES | NULL |
| 27 | tctsndatosexp | character | 1 | NO | 'N'::bpchar |
| 28 | tctsnfecescr | character | 1 | NO | 'N'::bpchar |
| 29 | tctsnmostrcntant | character | 1 | NO | 'N'::bpchar |
| 30 | tctsnesticer | character | 1 | NO | 'S'::bpchar |
| 31 | tctsnfactalta | character | 1 | NO | 'N'::bpchar |
| 32 | tctsnmsjalta | character | 1 | NO | 'N'::bpchar |
| 33 | tctsnmsjbaja | character | 1 | NO | 'N'::bpchar |
| 34 | tctsolcontrato | character | 1 | NO | 'N'::bpchar |
| 35 | tctsoltpdid | numeric | 5,0 | YES | NULL |
| 36 | tctsoltpoid | numeric | 5,0 | YES | NULL |
| 37 | tctsoldiascaduca | numeric | 5,0 | YES | NULL |

---

### tipocorreo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tipctipo | numeric | 5,0 | NO | NULL |
| 2 | tipcdesctxtid | numeric | 10,0 | NO | NULL |

---

### tipocptocobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tccid | numeric | 5,0 | NO | NULL |
| 2 | tcctxtid | numeric | 10,0 | NO | NULL |
| 3 | tcchstusu | character varying | 10 | NO | NULL |
| 4 | tcchsthora | timestamp without time zone | - | NO | NULL |

---

### tipocsc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tcsid | numeric | 5,0 | NO | NULL |
| 2 | tcstxtid | numeric | 10,0 | NO | NULL |
| 3 | tcstpnif | numeric | 5,0 | NO | NULL |
| 4 | tcshstusu | character varying | 10 | NO | NULL |
| 5 | tcshsthora | timestamp without time zone | - | NO | NULL |

---

### tipodesctoanticipo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tdaid | numeric | 5,0 | NO | NULL |
| 2 | tdatxtid | numeric | 10,0 | NO | NULL |
| 3 | tdanumperiodos | numeric | 5,0 | NO | NULL |
| 4 | tdadescuento | numeric | 5,4 | NO | NULL |
| 5 | tdatipovariable | numeric | 5,0 | YES | NULL |

---

### tipodocextfirmaele
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tdefeid | numeric | 5,0 | NO | NULL |
| 2 | tdefenombre | character varying | 100 | NO | NULL |
| 3 | tdefedesctxtid | numeric | 10,0 | NO | NULL |
| 4 | tdefesnactivo | character | 1 | NO | 'S'::bpchar |

---

### tipodocumento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpdid | numeric | 5,0 | NO | NULL |
| 2 | tpdtipo | numeric | 5,0 | NO | NULL |
| 3 | tpdsnimpext | character | 1 | NO | NULL |
| 4 | tpdgdoid | numeric | 5,0 | NO | NULL |
| 5 | tpdplantilla | character | 30 | NO | NULL |
| 6 | tpdsnarchivar | character | 1 | NO | NULL |
| 7 | tpdhstusu | character varying | 10 | NO | NULL |
| 8 | tpdhsthora | timestamp without time zone | - | NO | NULL |
| 9 | tpddescritxtid | numeric | 10,0 | NO | NULL |
| 10 | tpdplantillasms | character varying | 100 | YES | NULL |
| 11 | tpdplantillaemail | character varying | 100 | YES | NULL |
| 12 | tpdplantillapush | numeric | 10,0 | YES | NULL |
| 13 | tpdsnfirelec | character | 1 | NO | 'N'::bpchar |
| 14 | tpdsnadjdig | character | 1 | NO | 'N'::bpchar |
| 16 | tpdtpmodel | numeric | 5,0 | YES | NULL |
| 17 | tpdtpdocum | numeric | 5,0 | YES | NULL |
| 18 | tpdenvscorr | character | 1 | NO | 'N'::bpchar |
| 19 | tpdsncertdig | character | 1 | NO | 'N'::bpchar |
| 20 | tpdsnalarmatelelect | character | 1 | NO | 'N'::bpchar |
| 21 | tpdsncarsnarec | character | 1 | NO | 'N'::bpchar |
| 22 | tpdsndirenvnstd | character | 1 | NO | 'N'::bpchar |

---

### tipodocxml
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tdxid | numeric | 5,0 | NO | NULL |
| 2 | tdxtipo | character varying | 40 | NO | NULL |
| 3 | tdxsnalmac | character | 1 | NO | NULL |
| 4 | tdxdescrip | character varying | 80 | NO | NULL |
| 5 | tdxtagiddoc | character varying | 20 | NO | NULL |

---

### tipoelem
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tlmcod | character varying | 5 | NO | NULL |
| 2 | tlmdescrip | character varying | 30 | NO | NULL |
| 3 | tlmhstusu | character varying | 10 | NO | NULL |
| 4 | tlmhsthora | timestamp without time zone | - | NO | NULL |

---

### tipoenvfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | teftipfacid | numeric | 5,0 | NO | NULL |
| 2 | teftipenvid | numeric | 5,0 | NO | NULL |

---

### tipoesttec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tetid | numeric | 5,0 | NO | NULL |
| 2 | tettxtid | numeric | 10,0 | NO | NULL |
| 3 | tetsnagua | character | 1 | NO | 'N'::bpchar |
| 4 | tetsngestint | character | 1 | YES | 'N'::bpchar |

---

### tipofacturaext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpfid | numeric | 5,0 | NO | NULL |

---

### tipogestcobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tgcid | numeric | 5,0 | NO | NULL |
| 2 | tgctxtid | numeric | 10,0 | NO | NULL |
| 3 | tgcconcacre | character | 1 | NO | 'N'::bpchar |

---

### tipoincide
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpiid | numeric | 5,0 | NO | NULL |
| 2 | tpitxtid | numeric | 10,0 | NO | NULL |
| 3 | tpiorgint | character | 1 | NO | NULL |
| 4 | tpimotnoca | character | 2 | YES | NULL |

---

### tipoindem
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tinid | numeric | 10,0 | NO | NULL |
| 2 | tindesc | character varying | 50 | NO | NULL |

---

### tipolicver
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tlvid | numeric | 5,0 | NO | NULL |
| 2 | tlvtxtid | numeric | 10,0 | NO | NULL |
| 3 | tlvmesesflim | numeric | 5,0 | NO | NULL |
| 4 | tlvsnrefer | character | 1 | NO | NULL |
| 5 | tlvhstusu | character varying | 10 | NO | NULL |
| 6 | tlvhsthora | timestamp without time zone | - | NO | NULL |

---

### tipoliquidacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tliqid | numeric | 5,0 | NO | NULL |
| 2 | tliqdescri | character varying | 60 | NO | NULL |
| 3 | tliqsndifcob | character | 1 | NO | NULL |
| 4 | tliqtconid | numeric | 5,0 | YES | NULL |
| 5 | tliqtconidseg | numeric | 5,0 | YES | NULL |
| 6 | tliqtconid3 | numeric | 5,0 | YES | NULL |
| 7 | tliqtconid4 | numeric | 5,0 | YES | NULL |
| 8 | tliqtconid5 | numeric | 5,0 | YES | NULL |

---

### tipomccontrato
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmcid | numeric | 5,0 | NO | NULL |
| 2 | tmcentsal | character | 1 | NO | NULL |
| 3 | tmctxtid | numeric | 10,0 | NO | NULL |
| 4 | tmcsnmovprov | character varying | 1 | NO | 'N'::character varying |
| 5 | tmcafectasaldo | character varying | 1 | NO | 'A'::character varying |

---

### tipomensaj
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmenid | numeric | 10,0 | NO | NULL |
| 2 | tmentxtid | numeric | 10,0 | NO | NULL |
| 3 | tmenfaplic | numeric | 5,0 | NO | NULL |
| 4 | tmenactivo | character | 1 | NO | 'S'::bpchar |
| 5 | tmensectorial | character | 1 | NO | 'S'::bpchar |
| 6 | tmensdesccort | character varying | 30 | NO | NULL |
| 7 | tmensexpid | numeric | 5,0 | YES | NULL |
| 8 | tmensnpubl | character | 1 | NO | 'N'::bpchar |
| 9 | tmensncontad | character | 1 | NO | 'N'::bpchar |
| 10 | tmensncesiond | character | 1 | NO | 'N'::bpchar |
| 11 | tmencodenc | numeric | 5,0 | YES | NULL |
| 12 | tmensnasociar | character | 1 | NO | 'N'::bpchar |
| 13 | tmenhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 14 | tmenhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 15 | tmensnfacturabaja | character | 1 | NO | 'N'::bpchar |

---

### tipoobs
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tobsid | numeric | 5,0 | NO | NULL |
| 2 | tobsdescri | character varying | 25 | NO | NULL |
| 3 | tobssnaviso | character | 1 | NO | 'N'::bpchar |
| 4 | tobssnbloqueo | character | 1 | NO | 'N'::bpchar |
| 5 | tobssnnotfact | character | 1 | NO | 'N'::bpchar |

---

### tipooficina
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tofid | numeric | 5,0 | NO | NULL |
| 2 | tofsnpresen | character | 1 | NO | 'N'::bpchar |
| 3 | tofsngestpda | character | 1 | NO | NULL |
| 4 | tofhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 5 | tofhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 6 | tofdescritxtid | numeric | 10,0 | NO | NULL |

---

### tipooperacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | toperacid | numeric | 5,0 | NO | NULL |
| 2 | toperatxtid | numeric | 10,0 | NO | NULL |

---

### tipoorden
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpoid | numeric | 5,0 | NO | NULL |
| 2 | tpotxtid | numeric | 10,0 | NO | NULL |
| 3 | tposninscon | character | 1 | NO | 'N'::bpchar |
| 4 | tpoorigen | numeric | 5,0 | NO | 1 |
| 5 | tposnformpropio | character | 1 | NO | 'N'::bpchar |
| 6 | tpoprioridad | character | 1 | YES | NULL |
| 7 | tposncontrat | character | 1 | NO | NULL |
| 8 | tponumlect | numeric | 5,0 | YES | NULL |
| 9 | tpovalnhc | character | 1 | NO | 'N'::bpchar |
| 11 | tposnmasivo | character | 1 | NO | 'N'::bpchar |

---

### tipoordenperf
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | topftpoid | numeric | 5,0 | NO | NULL |
| 2 | topfperfid | numeric | 5,0 | NO | NULL |

---

### tipoproceso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tipid | numeric | 5,0 | NO | NULL |
| 2 | tipprocid | numeric | 5,0 | NO | NULL |
| 3 | tipfuncod | character varying | 50 | YES | NULL |
| 4 | tiptreid | numeric | 10,0 | YES | NULL |

---

### tipoptosrv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpsid | numeric | 5,0 | NO | NULL |
| 2 | tpsusocod | numeric | 5,0 | NO | NULL |
| 3 | tpstxtid | numeric | 10,0 | NO | NULL |
| 4 | tpsorden | numeric | 5,0 | NO | NULL |
| 5 | tpstiposerv | numeric | 5,0 | NO | 1 |
| 6 | tpssncortpos | character | 1 | NO | 'S'::bpchar |

---

### tipoqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tqueid | numeric | 5,0 | NO | NULL |
| 2 | tquedesc | character varying | 30 | NO | NULL |

---

### tiporecface
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trfeid | numeric | 5,0 | NO | NULL |
| 2 | trfecod | character | 2 | NO | NULL |
| 3 | trfetxtid | numeric | 10,0 | NO | NULL |

---

### tiporegulf
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trgid | numeric | 5,0 | NO | NULL |
| 2 | trgdesc | character varying | 50 | NO | NULL |
| 3 | trgcompcli | numeric | 5,0 | YES | NULL |
| 4 | trgtconid | numeric | 5,0 | YES | NULL |
| 5 | trgtsubid | numeric | 5,0 | YES | NULL |
| 6 | trgtmenid | numeric | 10,0 | YES | NULL |
| 7 | trgimporte | numeric | 18,2 | YES | NULL |
| 8 | trgcantidad | numeric | 5,0 | YES | NULL |
| 9 | trgbonificar | character | 1 | NO | NULL |
| 10 | trgsnparcial | character | 1 | NO | NULL |
| 11 | trgsnnocons | character | 1 | NO | NULL |
| 12 | trgexpid | numeric | 5,0 | NO | NULL |
| 13 | trgtxtestandar | character | 1 | NO | 'S'::bpchar |
| 14 | trgtxtid | numeric | 10,0 | YES | NULL |
| 15 | trgsnfichext | character | 1 | NO | NULL |
| 16 | trghstusu | character varying | 10 | NO | NULL |
| 17 | trghsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tiporelps
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trpid | numeric | 5,0 | NO | NULL |
| 2 | trpmetodo | character varying | 512 | NO | NULL |
| 3 | trptxtid | numeric | 10,0 | NO | NULL |
| 4 | trpsnrepcons | character | 1 | NO | NULL |
| 5 | trptmenid | numeric | 10,0 | YES | NULL |
| 6 | trptpmendet | numeric | 10,0 | YES | NULL |
| 7 | trphstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 8 | trphsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tiposervicio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpsid | numeric | 5,0 | NO | NULL |
| 2 | tpstxtid | numeric | 10,0 | NO | NULL |
| 3 | tpssninc | character | 1 | NO | NULL |
| 4 | tpssnfreatica | character | 1 | NO | 'N'::bpchar |

---

### tipositadmver
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsavcod | character | 5 | NO | NULL |
| 2 | tsavtxtidc | numeric | 10,0 | NO | NULL |
| 3 | tsavtxtidl | numeric | 10,0 | NO | NULL |
| 4 | tsavsnactivo | character | 1 | NO | 'S'::bpchar |

---

### tipositcalle
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpstcid | numeric | 5,0 | NO | NULL |
| 2 | tpstctxtid | numeric | 10,0 | NO | NULL |

---

### tipositver
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsvid | numeric | 5,0 | NO | NULL |
| 2 | tsvtxtid | numeric | 10,0 | NO | NULL |

---

### tiposobre
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpsid | numeric | 5,0 | NO | NULL |
| 2 | tpstxtid | numeric | 10,0 | NO | NULL |
| 3 | tpscodext | numeric | 5,0 | NO | NULL |
| 4 | tpshstusu | character varying | 10 | NO | NULL |
| 5 | tpshsthora | timestamp without time zone | - | NO | NULL |

---

### tiposoci
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsocid | numeric | 5,0 | NO | NULL |
| 2 | tsocsiglas | character varying | 10 | YES | NULL |
| 3 | tsochstusu | character varying | 10 | NO | NULL |
| 4 | tsochsthora | timestamp without time zone | - | NO | NULL |
| 5 | tsocdescritxtid | numeric | 10,0 | NO | NULL |

---

### tiposolaco
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsaid | numeric | 5,0 | NO | NULL |
| 2 | tsaexpid | numeric | 5,0 | NO | NULL |
| 3 | tsadescrip | numeric | 10,0 | NO | NULL |
| 4 | tsasnapro | character | 1 | NO | NULL |
| 5 | tsaplazapter | numeric | 5,0 | YES | NULL |
| 6 | tsaplazappre | numeric | 5,0 | YES | NULL |
| 7 | tsasncontaco | character | 1 | NO | NULL |
| 8 | tsasnfacaco | character | 1 | NO | 'S'::bpchar |
| 9 | tsasngenordeni | character | 1 | NO | 'S'::bpchar |
| 10 | tsacontralta | character | 1 | NO | 'N'::bpchar |
| 11 | tsacontrbaja | character | 1 | NO | 'N'::bpchar |
| 12 | tsasncertsinaco | character | 1 | NO | 'N'::bpchar |
| 13 | tsasnfracnttalta | character | 1 | NO | 'N'::bpchar |
| 14 | tsasncobordinst | character | 1 | NO | 'N'::bpchar |
| 15 | tsadestoferta | numeric | 5,0 | YES | NULL |
| 16 | tsacalidadde | numeric | 5,0 | YES | NULL |
| 17 | tsade | numeric | 5,0 | YES | NULL |
| 18 | tsausocod | numeric | 5,0 | YES | NULL |
| 19 | tsatipoinst | numeric | 5,0 | YES | NULL |
| 20 | tsatipoacom | numeric | 5,0 | YES | NULL |
| 21 | tsatipotrabajo | numeric | 5,0 | YES | NULL |
| 22 | tsasnaguapot | character | 1 | NO | 'S'::bpchar |
| 23 | tsasnsanea | character | 1 | NO | 'N'::bpchar |
| 24 | tsasngrupopres | character | 1 | NO | 'N'::bpchar |
| 25 | tsatetid | numeric | 5,0 | YES | NULL |
| 26 | tsatipoptosrv | numeric | 5,0 | YES | NULL |
| 27 | tsanumsum | numeric | 5,0 | YES | NULL |
| 28 | tsafsumcod | numeric | 5,0 | YES | NULL |
| 29 | tsatsumid | numeric | 5,0 | YES | NULL |

---

### tiposubcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsubid | numeric | 5,0 | NO | NULL |
| 2 | tsubtxtid | numeric | 10,0 | NO | NULL |
| 3 | tsubsnconsumo | character | 1 | NO | NULL |
| 4 | tsubhstusu | character varying | 10 | NO | NULL |
| 5 | tsubhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 6 | tsubsnnosumacons | character | 1 | NO | 'S'::bpchar |
| 7 | tsubfactlectvalidas | character | 1 | NO | 'N'::bpchar |
| 8 | tsubrcuid | numeric | 5,0 | YES | NULL |

---

### tiposubrogacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsrgid | numeric | 5,0 | NO | NULL |
| 2 | tsrgtxtid | numeric | 10,0 | NO | NULL |
| 3 | tsrgtipooper | numeric | 5,0 | NO | NULL |

---

### tiposucsif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tssifid | numeric | 5,0 | NO | NULL |
| 2 | tssiftipo | numeric | 5,0 | NO | NULL |
| 3 | tssiftxtid | numeric | 10,0 | NO | NULL |
| 4 | tssifhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 5 | tssifhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tiposumin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsumid | numeric | 5,0 | NO | NULL |
| 2 | tsumtxtid | numeric | 10,0 | NO | NULL |
| 3 | tsumlecper | character | 1 | NO | NULL |
| 4 | tsuminscon | character | 1 | NO | NULL |
| 5 | tsumcaedad | character | 1 | NO | NULL |
| 6 | tsumhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 7 | tsumhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 8 | tsumfactper | character | 1 | NO | 'S'::bpchar |
| 9 | tsumneccons | character | 1 | NO | 'S'::bpchar |
| 10 | tsumtpvid | numeric | 5,0 | YES | NULL |
| 11 | tsusngestint | character | 1 | NO | 'N'::bpchar |
| 12 | tsumsncortepos | character | 1 | NO | 'S'::bpchar |

---

### tipotarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tiptid | numeric | 5,0 | NO | NULL |
| 2 | tipttxtid | numeric | 10,0 | NO | NULL |
| 3 | tipthstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 4 | tipthsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |
| 5 | tiptrcuid | numeric | 5,0 | NO | 0 |
| 6 | tipvarid | numeric | 5,0 | YES | NULL |

---

### tipotarifasocial
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ttfscod | numeric | 5,0 | NO | NULL |
| 2 | ttfstxtid | numeric | 10,0 | NO | NULL |

---

### tipotartao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tttexpid | numeric | 5,0 | NO | NULL |
| 2 | ttttiptariftao | numeric | 5,0 | NO | NULL |
| 3 | ttttxtid | numeric | 10,0 | NO | NULL |

---

### tipotelelectura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tptlid | numeric | 5,0 | NO | NULL |
| 2 | tptltxtid | numeric | 10,0 | NO | NULL |
| 3 | tptlabreviacion | character varying | 10 | NO | NULL |
| 4 | tptlsnmdm | character | 1 | NO | NULL |
| 5 | tptlsistele | numeric | 5,0 | YES | NULL |
| 6 | tptlsnmodcom | character | 1 | NO | 'N'::bpchar |
| 7 | tptlvalormdm | character varying | 5 | YES | NULL |
| 8 | tptsnllectcent | character | 1 | NO | 'N'::bpchar |

---

### tipounidad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpuid | numeric | 5,0 | NO | NULL |
| 2 | tputxtid | numeric | 10,0 | NO | NULL |
| 3 | tpudesccort | numeric | 10,0 | NO | NULL |
| 4 | tputipodato | numeric | 5,0 | NO | NULL |
| 5 | tpudecimales | numeric | 5,0 | YES | NULL |
| 6 | tpuorigen | numeric | 5,0 | NO | NULL |
| 7 | tpuoperacion | numeric | 5,0 | YES | NULL |
| 8 | tpuoperando1 | numeric | 5,0 | YES | NULL |
| 9 | tpuoperando2 | numeric | 5,0 | YES | NULL |
| 10 | tpuhstusu | character varying | 10 | NO | NULL |
| 11 | tpuhsthora | timestamp without time zone | - | NO | NULL |

---

### tipovarbonif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tvbtbid | numeric | 5,0 | NO | NULL |
| 2 | tvbtpvid | numeric | 5,0 | NO | NULL |
| 3 | tvbvaldef | character | 10 | NO | NULL |
| 4 | tvbhstusu | character varying | 10 | NO | NULL |
| 5 | tvbhsthora | timestamp without time zone | - | NO | NULL |

---

### tipovarcom
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tvcomtpdid | numeric | 5,0 | NO | NULL |
| 2 | tvcomtagvar | character varying | 30 | NO | NULL |
| 3 | tvcomtxtid | numeric | 10,0 | NO | NULL |
| 4 | tvcomtipurl | character | 1 | NO | 'N'::bpchar |
| 5 | tvcomacortarurl | character | 1 | NO | 'N'::bpchar |
| 6 | tvcomhstusu | character varying | 10 | NO | ' '::character varying |
| 7 | tvcomhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tipovarcontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tvctctcod | numeric | 10,0 | NO | NULL |
| 2 | tvctpvid | numeric | 5,0 | NO | NULL |
| 3 | tvcsnoblig | character | 1 | NO | NULL |
| 4 | tvcvaldef | character | 10 | YES | NULL |
| 5 | tvcgvcgrupo | numeric | 5,0 | YES | NULL |
| 6 | tvchstusu | character varying | 10 | NO | NULL |
| 7 | tvchsthora | timestamp without time zone | - | NO | NULL |

---

### tipovarepi
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tveptpvid | numeric | 5,0 | NO | NULL |
| 2 | tvepepiid | numeric | 10,0 | NO | NULL |

---

### tipovarext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tvetipvarid | numeric | 5,0 | NO | NULL |
| 2 | tvesnexen | character | 1 | NO | NULL |
| 3 | tvecodexen | numeric | 5,0 | YES | NULL |

---

### tipovariable
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpvid | numeric | 5,0 | NO | NULL |
| 2 | tpvtxtid | numeric | 10,0 | NO | NULL |
| 3 | tpvdesccort | numeric | 10,0 | NO | NULL |
| 4 | tpvtipodato | numeric | 5,0 | NO | NULL |
| 5 | tpvdecimales | numeric | 5,0 | YES | NULL |
| 6 | tpvorigen | numeric | 5,0 | NO | NULL |
| 7 | tpvoperacion | numeric | 5,0 | YES | NULL |
| 8 | tpvoperando1 | numeric | 5,0 | YES | NULL |
| 9 | tpvoperando2 | numeric | 5,0 | YES | NULL |
| 10 | tpventsan | numeric | 10,0 | YES | NULL |
| 11 | tpvrefentsan | numeric | 5,0 | YES | NULL |
| 12 | tpvhstusu | character varying | 10 | NO | NULL |
| 13 | tpvhsthora | timestamp without time zone | - | NO | NULL |
| 14 | tpvconfecaplic | character | 1 | NO | 'N'::bpchar |

---

### tipovia
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tviaid | numeric | 5,0 | NO | NULL |
| 2 | tviacod | character | 4 | NO | NULL |
| 3 | tviaposicion | character | 1 | NO | 'A'::bpchar |
| 4 | tviahstusu | character varying | 10 | NO | NULL |
| 5 | tviahsthora | timestamp without time zone | - | NO | NULL |
| 6 | tviadesctxtid | numeric | 10,0 | NO | NULL |

---

### tipoviaaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tvatviaid | numeric | 5,0 | NO | NULL |
| 2 | tvacodaca | character | 2 | NO | NULL |

---

### tippersautoriz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpaid | numeric | 5,0 | NO | NULL |
| 2 | tpatxtid | numeric | 10,0 | NO | NULL |

---

### tipptoservtao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tptexpid | numeric | 5,0 | NO | NULL |
| 2 | tpttipptoserv | numeric | 5,0 | NO | NULL |
| 3 | tpttipuso | numeric | 5,0 | NO | NULL |

---

### tiprepara
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trepid | numeric | 5,0 | NO | NULL |
| 2 | trepcod | character varying | 10 | NO | ''::character varying |
| 3 | treptxtid | numeric | 10,0 | YES | NULL |

---

### tiprespvisita
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpresvid | numeric | 10,0 | NO | NULL |
| 2 | tpresvcod | character varying | 10 | NO | NULL |
| 3 | tpresvdescri | numeric | 10,0 | NO | NULL |

---

### tipvalvula
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tvalcod | character | 4 | NO | NULL |
| 2 | tvalindblk | numeric | 5,0 | NO | NULL |
| 3 | tvaldesctxtid | numeric | 10,0 | NO | NULL |

---

### tmkconfig
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmcid | numeric | 5,0 | NO | NULL |
| 2 | tmcdiasfin | numeric | 5,0 | NO | NULL |
| 3 | tmcminlocu | numeric | 5,0 | NO | NULL |
| 4 | tmcmaxinte | numeric | 5,0 | NO | NULL |
| 5 | tmchtarde | time without time zone | - | NO | NULL |
| 6 | tmcdiasges | numeric | 5,0 | NO | 10 |

---

### tmtranufac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | taflqatid | numeric | 10,0 | YES | NULL |
| 2 | tafpobid | numeric | 10,0 | YES | NULL |
| 3 | tafvariable | character varying | 30 | YES | NULL |
| 4 | tafvariablef | character | 1 | YES | NULL |
| 5 | taftarifa | character varying | 60 | YES | NULL |
| 6 | taftarifamm | character varying | 10 | YES | NULL |
| 7 | tafsubcpto | character varying | 60 | YES | NULL |
| 8 | taffamtarifa | character varying | 20 | YES | NULL |
| 9 | taffacact | numeric | 10,2 | YES | NULL |
| 10 | taffacant | numeric | 10,2 | YES | NULL |
| 11 | taffactot | numeric | 10,2 | YES | NULL |
| 12 | tafregact | numeric | 10,2 | YES | NULL |
| 13 | tafregant | numeric | 10,2 | YES | NULL |
| 14 | tafregtot | numeric | 10,2 | YES | NULL |

---

### tmtranupad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | taplqatid | numeric | 10,0 | YES | NULL |
| 2 | tappobid | numeric | 10,0 | YES | NULL |
| 3 | tapvariable | character varying | 30 | YES | NULL |
| 4 | tapvariablef | character | 1 | YES | NULL |
| 5 | taptarifa | character varying | 60 | YES | NULL |
| 6 | taptarifamm | character varying | 10 | YES | NULL |
| 7 | tapsubcpto | character varying | 60 | YES | NULL |
| 8 | tapfamtarifa | character varying | 20 | YES | NULL |
| 9 | tapusudom | numeric | 10,0 | YES | NULL |
| 10 | tappersona5 | numeric | 10,0 | YES | NULL |
| 11 | tappersona6 | numeric | 10,0 | YES | NULL |
| 12 | tappersona7 | numeric | 10,0 | YES | NULL |
| 13 | tappersona8 | numeric | 10,0 | YES | NULL |
| 14 | tapcansoc | numeric | 10,0 | YES | NULL |
| 15 | tapotras | numeric | 10,0 | YES | NULL |
| 16 | tapusunodom | numeric | 10,0 | YES | NULL |
| 17 | tapbonif141 | numeric | 10,0 | YES | NULL |
| 18 | tapbonif142 | numeric | 10,0 | YES | NULL |
| 19 | tapbonif143 | numeric | 10,0 | YES | NULL |
| 20 | tapbonif144 | numeric | 10,0 | YES | NULL |
| 21 | tapususindes | numeric | 10,0 | YES | NULL |
| 22 | tappersona4 | numeric | 10,0 | YES | NULL |
| 23 | tappersonamas8 | numeric | 10,0 | YES | NULL |

---

### tmtranureg
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tarlqatid | numeric | 10,0 | YES | NULL |
| 2 | tarpobid | numeric | 10,0 | YES | NULL |
| 3 | tarvariable | character varying | 30 | YES | NULL |
| 4 | tarvariablef | character | 1 | YES | NULL |
| 5 | tartarifa | character varying | 60 | YES | NULL |
| 6 | tartarifamm | character varying | 10 | YES | NULL |
| 7 | tarsubcpto | character varying | 60 | YES | NULL |
| 8 | tarfamtarifa | character varying | 20 | YES | NULL |
| 9 | tarfacact | numeric | 10,2 | YES | NULL |
| 10 | tarfacant | numeric | 10,2 | YES | NULL |
| 11 | tarfactot | numeric | 10,2 | YES | NULL |
| 12 | tarregact | numeric | 10,2 | YES | NULL |
| 13 | tarregant | numeric | 10,2 | YES | NULL |
| 14 | tarregtot | numeric | 10,2 | YES | NULL |

---

### tmtrautocuad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tacliqid | numeric | 5,0 | NO | NULL |
| 2 | tacpobid | numeric | 10,0 | NO | NULL |
| 3 | tacfactact | numeric | 10,2 | NO | 0 |
| 4 | taccobact | numeric | 10,2 | NO | 0 |
| 5 | tacdesact | numeric | 10,2 | NO | 0 |
| 6 | tacrecact | numeric | 10,2 | NO | 0 |
| 7 | tacsaldocalact | numeric | 10,2 | NO | 0 |
| 8 | tacsalrealact | numeric | 10,2 | NO | 0 |
| 9 | tacdescuadact | numeric | 10,2 | NO | 0 |
| 10 | tacsaldoant | numeric | 10,2 | NO | 0 |
| 11 | tacanulant | numeric | 10,2 | NO | 0 |
| 12 | taccobant | numeric | 10,2 | NO | 0 |
| 13 | tacdesant | numeric | 10,2 | NO | 0 |
| 14 | tacrecant | numeric | 10,2 | NO | 0 |
| 15 | tacsaldocalant | numeric | 10,2 | NO | 0 |
| 16 | tacsalrealant | numeric | 10,2 | NO | 0 |
| 17 | tacdescuadant | numeric | 10,2 | NO | 0 |

---

### tmtrdetcob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tdcliqid | numeric | 5,0 | YES | NULL |
| 2 | tdcpobid | numeric | 10,0 | YES | NULL |
| 3 | tdcocgid | numeric | 10,0 | YES | NULL |
| 4 | tdcoperaci | numeric | 10,0 | YES | NULL |
| 5 | tdcfopera | date | - | YES | NULL |
| 6 | tdcgsctipo | numeric | 5,0 | YES | NULL |
| 7 | tdcnumfac | character varying | 18 | YES | NULL |
| 8 | tdcimp | numeric | 10,2 | YES | NULL |
| 9 | tdccnttnum | numeric | 10,0 | YES | NULL |
| 10 | tdcfecfac | date | - | YES | NULL |
| 11 | tdcfacid | numeric | 10,0 | YES | NULL |
| 12 | tdcpocid | numeric | 10,0 | YES | NULL |
| 13 | tdcftoid | numeric | 10,0 | YES | NULL |
| 14 | tdcn | numeric | 5,0 | YES | NULL |
| 15 | tdcorifacid | numeric | 10,0 | YES | NULL |
| 16 | tdcorifecfac | date | - | YES | NULL |
| 17 | tdccliid | numeric | 10,0 | YES | NULL |
| 18 | tdcclinif | character varying | 15 | YES | NULL |

---

### tmtrdetfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tdfliqid | numeric | 5,0 | YES | NULL |
| 2 | tdfpobid | numeric | 10,0 | YES | NULL |
| 3 | tdfnumfac | character varying | 18 | YES | NULL |
| 4 | tdfimp | numeric | 10,2 | YES | NULL |
| 5 | tdfcnttnum | numeric | 10,0 | YES | NULL |
| 6 | tdffecfac | date | - | YES | NULL |
| 7 | tdffacid | numeric | 10,0 | YES | NULL |
| 8 | tdfpocid | numeric | 10,0 | YES | NULL |
| 9 | tdfftoid | numeric | 10,0 | YES | NULL |
| 10 | tdfn | numeric | 5,0 | YES | NULL |
| 11 | tdforifacid | numeric | 10,0 | YES | NULL |
| 12 | tdforifecfac | date | - | YES | NULL |
| 13 | tdfcliid | numeric | 10,0 | YES | NULL |
| 14 | tdfclinif | character varying | 15 | YES | NULL |
| 15 | tdfopera | numeric | - | YES | NULL |
| 16 | tdffacestado | numeric | - | YES | NULL |

---

### tmtrmtot
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmtrliqid | numeric | 5,0 | NO | NULL |
| 2 | tmtrfant0 | numeric | 12,2 | YES | NULL |
| 3 | tmtrfant1 | numeric | 12,2 | YES | NULL |
| 4 | tmtrfant2 | numeric | 12,2 | YES | NULL |
| 5 | tmtrfant3 | numeric | 12,2 | YES | NULL |
| 6 | tmtrfant4 | numeric | 12,2 | YES | NULL |
| 7 | tmtrfant5 | numeric | 12,2 | YES | NULL |
| 8 | tmtrrant0 | numeric | 12,2 | YES | NULL |
| 9 | tmtrrant1 | numeric | 12,2 | YES | NULL |
| 10 | tmtrrant2 | numeric | 12,2 | YES | NULL |
| 11 | tmtrrant3 | numeric | 12,2 | YES | NULL |
| 12 | tmtrrant4 | numeric | 12,2 | YES | NULL |
| 13 | tmtrrant5 | numeric | 12,2 | YES | NULL |
| 14 | tmtrrpdte | numeric | 12,2 | YES | NULL |
| 15 | tmtrraliq | numeric | 12,2 | YES | NULL |
| 16 | tmtrrprox | numeric | 12,2 | YES | NULL |
| 17 | tmtriva | numeric | 3,2 | NO | NULL |
| 18 | tmtrcomis | numeric | 3,2 | NO | NULL |
| 19 | tmtrimpcom | numeric | 10,2 | YES | NULL |

---

### tmtrmtotpob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmtrtpliqid | numeric | 5,0 | NO | NULL |
| 2 | tmtrtppobid | numeric | 10,0 | NO | NULL |
| 3 | tmtrtpfant0 | numeric | 12,2 | YES | NULL |
| 4 | tmtrtpfant1 | numeric | 12,2 | YES | NULL |
| 5 | tmtrtpfant2 | numeric | 12,2 | YES | NULL |
| 6 | tmtrtpfant3 | numeric | 12,2 | YES | NULL |
| 7 | tmtrtpfant4 | numeric | 12,2 | YES | NULL |
| 8 | tmtrtpfant5 | numeric | 12,2 | YES | NULL |
| 9 | tmtrtprant0 | numeric | 12,2 | YES | NULL |
| 10 | tmtrtprant1 | numeric | 12,2 | YES | NULL |
| 11 | tmtrtprant2 | numeric | 12,2 | YES | NULL |
| 12 | tmtrtprant3 | numeric | 12,2 | YES | NULL |
| 13 | tmtrtprant4 | numeric | 12,2 | YES | NULL |
| 14 | tmtrtprant5 | numeric | 12,2 | YES | NULL |

---

### tmtrsocliqrec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tslrexpid | numeric | 5,0 | NO | NULL |
| 2 | tslrsocliq | numeric | 10,0 | NO | NULL |
| 3 | tslrsocemi | numeric | 10,0 | NO | NULL |
| 4 | tslrfechaini | date | - | NO | NULL |
| 5 | tslrfechafin | date | - | YES | NULL |

---

### tpcartasif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tcsid | numeric | 5,0 | NO | NULL |
| 4 | tcstxtid | numeric | 10,0 | NO | '0'::numeric |
| 5 | tcsdescid | numeric | 10,0 | NO | '0'::numeric |

---

### tpcontacto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tctid | numeric | 5,0 | NO | NULL |
| 2 | tcttxtid | numeric | 10,0 | NO | NULL |
| 3 | tcthstusu | character varying | 10 | NO | NULL |
| 4 | tcthsthora | timestamp without time zone | - | NO | NULL |

---

### tpdocescan
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tdstpmodel | numeric | 5,0 | NO | NULL |
| 2 | tdstpdocum | numeric | 5,0 | NO | NULL |
| 3 | tdstxtid | numeric | 10,0 | NO | NULL |
| 4 | tdssnsuscripcion | character | 1 | NO | 'N'::bpchar |
| 5 | tdsreldocentidad | numeric | 10,0 | YES | NULL |

---

### tpfinbtmk
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tfbid | numeric | 5,0 | NO | NULL |
| 2 | tfbdesc | character varying | 30 | NO | NULL |

---

### tpgesttmk
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tgtmkid | numeric | 5,0 | NO | NULL |
| 2 | tgtmktxtid | numeric | 10,0 | NO | NULL |
| 3 | tgtmksnfact | character | 1 | NO | 'N'::bpchar |

---

### tpimpusoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tisapiid | numeric | 5,0 | NO | NULL |
| 2 | tissocid | numeric | 10,0 | NO | NULL |
| 3 | tiswtipo | character | 1 | NO | NULL |
| 4 | tiscodigo | character | 2 | NO | NULL |
| 5 | tishstusu | character varying | 10 | NO | NULL |
| 6 | tishsthora | timestamp without time zone | - | NO | NULL |

---

### tpofccquipu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | toqtofid | numeric | 5,0 | NO | NULL |
| 2 | toqtgcar | numeric | 5,0 | NO | NULL |
| 3 | toqccqcod | character | 4 | NO | NULL |
| 4 | toqusuario | character | 10 | NO | NULL |
| 5 | toqfecha | timestamp without time zone | - | NO | NULL |

---

### traduccion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trdtipo | numeric | 5,0 | NO | NULL |
| 2 | trdclave | character varying | 100 | NO | NULL |
| 3 | trdforma | character varying | 20 | NO | NULL |
| 4 | trdidicod | character | 2 | NO | NULL |
| 5 | trdtexto | character varying | 50 | NO | NULL |
| 6 | trdhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 7 | trdhsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tramoestim
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trmeexpid | numeric | 5,0 | NO | NULL |
| 2 | trmeperiid | numeric | 5,0 | NO | NULL |
| 3 | trmeliminf | numeric | 10,0 | NO | NULL |
| 4 | trmelimsup | numeric | 10,0 | YES | NULL |
| 5 | trmeporcinf | numeric | 5,0 | NO | NULL |
| 6 | trmeporcsup | numeric | 5,0 | NO | NULL |
| 7 | trmeacosup | numeric | 10,0 | YES | NULL |
| 8 | trmehstusu | character varying | 10 | NO | NULL |
| 9 | trmehsthora | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tramosmodelocp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmcpid | numeric | 5,0 | NO | NULL |
| 2 | tmcpimpmax | numeric | 15,2 | NO | NULL |
| 3 | tmcpnumplazos | numeric | 3,0 | NO | NULL |
| 4 | tmcpnumplazosmax | numeric | 3,0 | YES | NULL |
| 5 | tmcpmcpcod | numeric | 5,0 | YES | NULL |

---

### transportista
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trpprsid | numeric | 10,0 | NO | NULL |
| 2 | trpcodext | numeric | 5,0 | NO | NULL |
| 3 | trpactivo | character | 1 | NO | NULL |
| 4 | trphstusu | character varying | 10 | NO | NULL |
| 5 | trphsthora | timestamp without time zone | - | NO | NULL |

---

### traza
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | trzid | numeric | 10,0 | NO | NULL |
| 2 | trzusuario | character | 10 | NO | NULL |
| 3 | trzfecha | timestamp without time zone | - | NO | NULL |
| 4 | trzserver | character varying | 128 | NO | NULL |
| 5 | trztraza | bytea | - | NO | NULL |

---

### tsolacoclau
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsctsaid | numeric | 5,0 | NO | NULL |
| 2 | tscexpid | numeric | 5,0 | NO | NULL |
| 3 | tscclauid | numeric | 5,0 | NO | NULL |

---

### tsolacodoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsdtsaid | numeric | 5,0 | NO | NULL |
| 2 | tsddconid | numeric | 10,0 | NO | NULL |
| 3 | tsdorden | numeric | 5,0 | NO | NULL |

---

### tsolacomotf
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsmtsaid | numeric | 5,0 | NO | NULL |
| 2 | tsmmtfcodigo | numeric | 5,0 | NO | NULL |

---

### tsolacotipcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsatctsaid | numeric | 5,0 | NO | NULL |
| 2 | tsatctctcod | numeric | 10,0 | NO | NULL |

---
---

## Temporary Tables (tmp_deuda_*)
> **Total count: 2,144 identical tables** with pattern `tmp_deuda_XXXXXXX`

### tmp_deuda_1779865 (sample)
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | importe | numeric | 18,2 | YES | NULL |
| 2 | numfacturas | integer | 32,0 | YES | NULL |
| 3 | facsocemi | integer | 32,0 | YES | NULL |
| 4 | faccnttnum | integer | 32,0 | YES | NULL |

---
---

## Other tmp* Tables

### tmp_gestordocumental
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tgdid | numeric | 10,0 | NO | NULL |
| 2 | tgdexpid | numeric | 5,0 | NO | NULL |
| 3 | tgdtpdoc | numeric | 5,0 | NO | NULL |
| 4 | tgdtpent | numeric | 5,0 | NO | NULL |
| 5 | tgdentid | numeric | 10,0 | NO | NULL |
| 6 | tgdnombredoc | character varying | 50 | NO | NULL |
| 7 | tgdtpimg | numeric | 5,0 | NO | NULL |
| 8 | tgdcontenido | bytea | - | NO | NULL |
| 9 | tgddescrip | character varying | 50 | YES | NULL |
| 10 | tgdusuario | character varying | 30 | NO | NULL |
| 11 | tgdfecha | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tmpbb_XXXXXXX (sample: tmpbb_4562592)
> **Total count: 22 identical tables** with pattern `tmpbb_XXXXXXX`

| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | bbfbleid | numeric | 10,0 | YES | NULL |
| 2 | bbsbid | numeric | 10,0 | YES | NULL |
| 3 | bbcnttnum | numeric | 10,0 | YES | NULL |
| 4 | bbaplicacion | numeric | 5,0 | YES | NULL |
| 5 | bbfecini | date | - | YES | NULL |
| 6 | bbfecfin | date | - | YES | NULL |
| 7 | bbvardel | numeric | 5,0 | YES | NULL |
| 8 | bbexpdid | numeric | 5,0 | YES | NULL |
| 9 | bbcptodel | numeric | 5,0 | YES | NULL |
| 10 | bbtariddel | numeric | 5,0 | YES | NULL |
| 11 | bbctponew | numeric | 5,0 | YES | NULL |
| 12 | bbtaridnew | numeric | 5,0 | YES | NULL |
| 13 | bbfecfinbonif | date | - | YES | NULL |
| 14 | bbfecinitar | date | - | YES | NULL |

---

### tmpcntt
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cnttnum | numeric | - | YES | NULL |
| 2 | expid | numeric | - | YES | NULL |
| 3 | pobid | numeric | - | YES | NULL |
| 4 | cptoid | numeric | - | YES | NULL |
| 5 | atlid | numeric | - | YES | NULL |
| 6 | snpropio | character | - | YES | NULL |
| 7 | snagua | character | - | YES | NULL |

---

### tmpcrr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | fcrrfacid | numeric | - | YES | NULL |
| 2 | fcrrcorid | numeric | - | YES | NULL |
| 3 | fcrrorden | numeric | - | YES | NULL |
| 4 | fcrrexpid | numeric | - | YES | NULL |
| 5 | fcrrcptoid | numeric | - | YES | NULL |
| 6 | fcrrttarid | numeric | - | YES | NULL |
| 7 | fcrrfecapl | timestamp without time zone | - | YES | NULL |
| 8 | fcrrsubcid | numeric | - | YES | NULL |
| 9 | fcrrobjaplic | numeric | - | YES | NULL |
| 10 | fcrrnlin | numeric | - | YES | NULL |
| 11 | fcrrvalorig | numeric | - | YES | NULL |
| 12 | fcrrresult | numeric | - | YES | NULL |
| 13 | fcrroperacion | numeric | - | YES | NULL |
| 14 | fcrrtipovalope | numeric | - | YES | NULL |
| 15 | fcrrvalope | numeric | - | YES | NULL |
| 16 | fcrrtvarope | numeric | - | YES | NULL |
| 17 | fcrrcptoope | numeric | - | YES | NULL |
| 18 | fcrrvalfct | numeric | - | YES | NULL |

---

### tmpfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | facid | numeric | - | YES | NULL |
| 2 | facftoid | numeric | - | YES | NULL |
| 3 | facsocemi | numeric | - | YES | NULL |
| 4 | facsocpro | numeric | - | YES | NULL |
| 5 | facpocid | numeric | - | YES | NULL |
| 6 | faccliid | numeric | - | YES | NULL |
| 7 | facestado | numeric | - | YES | NULL |
| 8 | facfecfact | timestamp without time zone | - | YES | NULL |
| 9 | facnumfac | character | - | YES | NULL |
| 10 | facimporte | numeric | - | YES | NULL |
| 11 | facimpuest | numeric | - | YES | NULL |
| 12 | facfecvto | timestamp without time zone | - | YES | NULL |
| 13 | facfecprem | timestamp without time zone | - | YES | NULL |
| 14 | facdotmoro | numeric | - | YES | NULL |
| 15 | facclinif | character | - | YES | NULL |
| 16 | facexpid | numeric | - | YES | NULL |
| 17 | facdcfaid | numeric | - | YES | NULL |
| 18 | faccnttnum | numeric | - | YES | NULL |
| 19 | factipgesd | numeric | - | YES | NULL |
| 20 | facvtoori | timestamp without time zone | - | YES | NULL |

---

### tmpgeo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmpgexp | character varying | 10 | YES | NULL |
| 2 | tmpgaco | character varying | 10 | YES | NULL |
| 3 | tmpglong | character varying | 20 | YES | NULL |
| 4 | tmpglat | character varying | 20 | YES | NULL |
| 5 | tmpgalt | character varying | 20 | YES | NULL |
| 6 | tmpginfo | character varying | 100 | YES | NULL |
| 7 | tmpgact | character varying | 1 | YES | NULL |

---

### tmpimpufact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ipaid | numeric | - | YES | NULL |
| 2 | ipafacid | numeric | - | YES | NULL |
| 3 | ipatipo | numeric | - | YES | NULL |
| 4 | ipatconid | numeric | - | YES | NULL |
| 5 | ipasubcid | numeric | - | YES | NULL |
| 6 | ipafacnlin | numeric | - | YES | NULL |
| 7 | ipaimporte | numeric | - | YES | NULL |
| 8 | ipaimpuesto | numeric | - | YES | NULL |

---

### tmplin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | linfacid | numeric | - | YES | NULL |
| 2 | linfacnlin | numeric | - | YES | NULL |
| 3 | linexpid | numeric | - | YES | NULL |
| 4 | lincptoid | numeric | - | YES | NULL |
| 5 | linttarid | numeric | - | YES | NULL |
| 6 | linfecapli | timestamp without time zone | - | YES | NULL |
| 7 | linscptoid | numeric | - | YES | NULL |
| 8 | lintralim | numeric | - | YES | NULL |
| 9 | lincaltra | numeric | - | YES | NULL |
| 10 | lincalibmm | numeric | - | YES | NULL |
| 11 | linpmvtpvid | numeric | - | YES | NULL |
| 12 | linunitpvid | numeric | - | YES | NULL |
| 13 | linfaccant | double precision | 53 | YES | NULL |
| 14 | linfprefij | double precision | 53 | YES | NULL |
| 15 | linfprepro | double precision | 53 | YES | NULL |
| 16 | linfacimpo | numeric | - | YES | NULL |
| 17 | linfacimpu | numeric | - | YES | NULL |
| 18 | linimpreg | numeric | - | YES | NULL |
| 19 | linexeimp | character | - | YES | NULL |

---

### tmplinprecsubcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | lfpfacid | numeric | - | YES | NULL |
| 2 | lfpfacnlin | numeric | - | YES | NULL |
| 3 | lfpforapl | numeric | - | YES | NULL |
| 4 | lfpobtfec | numeric | - | YES | NULL |
| 5 | lfssnptran | character | - | YES | NULL |
| 6 | lfssnpropre | character | - | YES | NULL |
| 7 | lfpobtcan | numeric | - | YES | NULL |
| 8 | lfptpvid | numeric | - | YES | NULL |
| 9 | lfpsnconsreal | character | - | YES | NULL |
| 10 | lfpsnestim | character | - | YES | NULL |
| 11 | lfpsnreparto | character | - | YES | NULL |
| 12 | lfpsnotros | character | - | YES | NULL |

---

### tmpmejdiaremcal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tmpmdrcnttnum | numeric | 10,0 | YES | NULL |
| 2 | tmpmdrdia | numeric | 5,0 | YES | NULL |
| 3 | tmpmdrfecha | timestamp without time zone | - | YES | NULL |

---

### tmpses
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsid | numeric | 10,0 | NO | NULL |
| 2 | tsinises | timestamp without time zone | - | NO | NULL |
| 3 | tsusuario | character | 10 | NO | NULL |
| 4 | tsexplotacion | numeric | 5,0 | NO | NULL |
| 5 | tsoficina | numeric | 5,0 | NO | NULL |
| 6 | tsip | character | 15 | YES | NULL |
| 7 | tspuerto | numeric | 10,0 | YES | NULL |
| 8 | tsserv | character varying | 128 | YES | NULL |
| 9 | tsultping | timestamp without time zone | - | NO | CURRENT_TIMESTAMP |

---

### tmpsesevtcliente
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsetsid | numeric | 10,0 | NO | NULL |
| 2 | tseid | numeric | 10,0 | NO | NULL |
| 3 | tsetipo | numeric | 5,0 | NO | NULL |
| 4 | tsetexto | character varying | 512 | YES | NULL |
| 5 | tsecodmonproc | numeric | 10,0 | YES | NULL |
| 6 | tseminval | numeric | 10,0 | YES | NULL |
| 7 | tsemaxval | numeric | 10,0 | YES | NULL |
| 8 | tsedescmon | character varying | 128 | YES | NULL |
| 9 | tsetitmon | character varying | 128 | YES | NULL |
| 10 | tseprogreso | numeric | 10,0 | YES | NULL |
| 11 | tsenotif | timestamp without time zone | - | YES | NULL |

---

### tmpsesmonproccanc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tsmptsid | numeric | 10,0 | NO | NULL |
| 2 | tsmpmonprocid | numeric | 10,0 | NO | NULL |

---

### tmptx
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | txidreg | numeric | 10,0 | NO | NULL |
| 2 | txidregpadre | numeric | 10,0 | YES | NULL |
| 3 | txdesc | character varying | 100 | NO | NULL |
| 4 | txparams | character varying | 1000 | YES | NULL |
| 5 | txhorareg | timestamp without time zone | - | NO | NULL |
| 6 | txsnproc | character | 1 | NO | NULL |
| 7 | txclasegp | character varying | 200 | YES | NULL |
| 8 | txmetodogp | character varying | 100 | YES | NULL |
| 9 | txparamsundo | character varying | 3000 | YES | NULL |
| 10 | txsesion | numeric | 10,0 | NO | NULL |
| 11 | txestado | numeric | 5,0 | NO | 0 |
