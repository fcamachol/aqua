# Database Map - Tables A*
## Schema: cf_quere_pro

Total tables: 528

### aboftoint
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | abintftoid | numeric | 10 | NO | NULL |

### accionobs
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acccod | character | 2 | NO | NULL |
| 2 | accsnpda | character | 1 | NO | 'N'::bpchar |
| 3 | accdesctxtid | numeric | 10 | NO | NULL |
| 4 | accsnnota | character | 1 | NO | 'N'::bpchar |
| 5 | accsnobs | character | 1 | NO | 'S'::bpchar |

### acohisrot
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acohacoid | numeric | 10 | NO | NULL |
| 2 | acohfecrot | timestamp without time zone |  | NO | NULL |
| 3 | acohmotrot | character varying | 50 | NO | NULL |
| 4 | acohindblk | numeric | 5 | NO | NULL |

### acometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acoid | numeric | 10 | NO | NULL |
| 2 | acodirid | numeric | 10 | NO | NULL |
| 3 | acotetid | numeric | 5 | NO | NULL |
| 4 | acoexpid | numeric | 5 | NO | NULL |
| 5 | acomatcod | character | 4 | YES | NULL |
| 6 | acotipvalc | character | 4 | YES | NULL |
| 7 | acoproext | numeric | 5 | NO | NULL |
| 8 | acoproint | numeric | 5 | NO | NULL |
| 9 | acohojrev | numeric | 10 | YES | NULL |
| 10 | acohojtra | numeric | 10 | YES | NULL |
| 11 | acocalmat | numeric | 5 | YES | NULL |
| 12 | acocalval | numeric | 5 | YES | NULL |
| 13 | acolong | double precision | 53 | YES | NULL |
| 14 | acofecins | date |  | NO | NULL |
| 15 | acofectap | date |  | YES | NULL |
| 16 | acosndig | character | 1 | NO | NULL |
| 17 | acoobsid | numeric | 10 | YES | NULL |
| 18 | acopep | character varying | 15 | YES | NULL |
| 19 | acoestado | numeric | 5 | NO | NULL |
| 20 | acotipo | numeric | 5 | NO | NULL |
| 21 | acocalimm | numeric | 5 | YES | NULL |
| 22 | acoschid | numeric | 5 | YES | NULL |
| 23 | acopepreno | character varying | 15 | YES | NULL |
| 24 | acopeptapo | character varying | 15 | YES | NULL |
| 25 | acorvaid | numeric | 10 | YES | NULL |
| 26 | acoacoidprov | numeric | 10 | YES | NULL |
| 27 | aconumviv | numeric | 5 | YES | NULL |
| 28 | acocalimm2 | numeric | 5 | YES | NULL |
| 29 | acocaudal | numeric | 6,2 | YES | NULL |
| 30 | acosshid | numeric | 10 | YES | NULL |
| 31 | acopresmin | numeric | 6,2 | YES | NULL |
| 32 | acohstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 33 | acohsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 34 | acopresmax | numeric | 6,2 | YES | NULL |
| 35 | acoptosid | numeric | 10 | YES | NULL |

### acortarurl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aurid | numeric | 10 | NO | NULL |
| 2 | aurexpid | numeric | 5 | NO | NULL |
| 3 | aurfecgen | timestamp without time zone |  | YES | NULL |
| 4 | aurvalue | character varying | 1000 | NO | NULL |
| 5 | aurestado | numeric | 5 | NO | NULL |
| 6 | aurintentos | numeric | 5 | NO | NULL |
| 7 | aurproceso | numeric | 5 | NO | NULL |
| 8 | aurdcfaid | numeric | 10 | YES | NULL |
| 9 | aurdcpid | numeric | 10 | YES | NULL |

### acticont
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | actccodigo | character | 2 | NO | NULL |
| 2 | actcdescri | character varying | 30 | NO | NULL |
| 3 | actcsisext | character varying | 4 | YES | NULL |

### activartao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | attexpid | numeric | 5 | NO | NULL |
| 2 | atttipvar | numeric | 5 | NO | NULL |
| 3 | attacttao | numeric | 5 | NO | NULL |
| 4 | attepigrafe | numeric | 5 | YES | NULL |
| 5 | attseccion | numeric | 5 | YES | NULL |
| 6 | attrefiae | numeric | 5 | YES | NULL |
| 7 | attsupdecl | numeric | 5 | YES | NULL |
| 8 | attsupcomp | numeric | 5 | YES | NULL |

### actividad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | actipolid | numeric | 5 | NO | NULL |
| 2 | actitextid | numeric | 10 | NO | NULL |
| 3 | actigraid | numeric | 5 | NO | NULL |
| 4 | actiprsid | numeric | 10 | NO | NULL |
| 5 | actidefecto | character | 1 | NO | 'N'::bpchar |
| 6 | actsecid | numeric | 5 | NO | NULL |

### actividadsec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | actsecid | numeric | 5 | NO | NULL |
| 2 | actsectxtid | numeric | 10 | NO | NULL |

### actividadver
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | actvid | numeric | 5 | NO | NULL |
| 2 | actvtxtid | numeric | 10 | NO | NULL |

### actsucsif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acssifid | numeric | 5 | NO | NULL |
| 2 | acssiftxtid | numeric | 10 | NO | NULL |
| 3 | acssifhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 4 | acssifhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### agencia
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ageid | numeric | 5 | NO | NULL |
| 2 | agebanid | numeric | 5 | NO | NULL |
| 3 | agedes | character varying | 80 | NO | NULL |
| 4 | agelocali | character varying | 40 | YES | NULL |
| 5 | agecodpost | character varying | 10 | YES | NULL |
| 6 | agetelef | character varying | 16 | YES | NULL |
| 7 | agefax | character varying | 16 | YES | NULL |
| 8 | ageindblk | numeric | 5 | NO | NULL |
| 9 | agepaisid | numeric | 10 | NO | NULL |
| 10 | agebiccod | character | 5 | YES | NULL |
| 11 | ageactiva | character | 1 | NO | 'S'::bpchar |
| 12 | agedir | character varying | 100 | YES | NULL |
| 13 | agepro | character varying | 100 | YES | NULL |

### agrconcepto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | agcid | numeric | 5 | NO | NULL |
| 2 | agctxtid | numeric | 10 | NO | NULL |
| 3 | agcconcagua | character | 1 | NO | 'N'::bpchar |

### agrcontar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | actconid | numeric | 5 | NO | NULL |
| 2 | acttiptid | numeric | 5 | NO | NULL |
| 3 | actagid | numeric | 5 | NO | NULL |
| 4 | acthstusu | character varying | 10 | NO | NULL |
| 5 | acthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### agrfamitarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | agfmid | numeric | 5 | NO | NULL |
| 2 | agfmtxtid | numeric | 10 | NO | NULL |

### agrucontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | agruid | numeric | 5 | NO | NULL |
| 2 | agrucliid | numeric | 10 | NO | NULL |
| 3 | agrudesc | character varying | 30 | NO | NULL |
| 4 | agruexpid | numeric | 5 | NO | NULL |
| 5 | agruaten | character varying | 36 | YES | NULL |
| 6 | agruprsid | numeric | 10 | NO | NULL |
| 7 | agrunumdir | numeric | 5 | NO | NULL |
| 8 | agrucntppal | numeric | 10 | YES | NULL |
| 9 | agrudiagenefac | numeric | 5 | YES | NULL |

### agrupacioncoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | agrucocid | numeric | 5 | NO | NULL |
| 2 | agrucocdesc | character varying | 50 | NO | NULL |

### agruprecsubcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | apsid | numeric | 5 | NO | NULL |
| 2 | apstxtid | numeric | 10 | NO | NULL |

### agrutarifliq
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | atlid | numeric | 5 | NO | NULL |
| 2 | atlsocprop | numeric | 10 | YES | NULL |
| 3 | atldesc | character varying | 80 | NO | NULL |

### ajustefact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ajfid | numeric | 10 | NO | NULL |
| 2 | ajfcntid | numeric | 10 | NO | NULL |
| 3 | ajfpocidfrom | numeric | 10 | NO | NULL |
| 4 | ajfpocidto | numeric | 10 | NO | NULL |
| 5 | ajfusuid | character varying | 10 | NO | NULL |
| 6 | ajfdate | timestamp without time zone |  | YES | NULL |

### alarmatel
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | altid | numeric | 10 | NO | NULL |
| 2 | altexpid | numeric | 5 | NO | NULL |
| 3 | alttipcod | numeric | 5 | NO | NULL |
| 4 | altcnttnum | numeric | 10 | NO | NULL |
| 5 | altcontid | numeric | 10 | NO | NULL |
| 6 | altestado | numeric | 5 | NO | NULL |
| 7 | altsnincmas | character | 1 | NO | 'N'::bpchar |
| 8 | altfecha | date |  | NO | NULL |
| 9 | altlectura | numeric | 10 | YES | NULL |
| 10 | altfeclec | date |  | YES | NULL |
| 11 | altordid | numeric | 10 | YES | NULL |
| 12 | altcosid | numeric | 10 | YES | NULL |
| 13 | alttexto | character varying | 1000 | YES | NULL |
| 14 | altaltext | numeric | 10 | YES | NULL |
| 15 | altorides | numeric | 5 | YES | NULL |
| 16 | altfecdes | timestamp without time zone |  | YES | NULL |

### alarmatelext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aleid | numeric | 10 | NO | NULL |
| 2 | alesistema | numeric | 5 | NO | NULL |
| 3 | alesocid | numeric | 10 | NO | NULL |
| 4 | aleidsisext | character varying | 36 | NO | NULL |
| 5 | alefecha | timestamp without time zone |  | NO | NULL |
| 6 | aleestado | numeric | 5 | NO | NULL |
| 7 | aletipo | character varying | 50 | NO | NULL |
| 8 | aleequiponumero | character varying | 12 | NO | NULL |
| 9 | alecontnumero | character varying | 12 | YES | NULL |
| 10 | alefechamodif | timestamp without time zone |  | NO | NULL |
| 11 | alelectura | numeric | 10 | YES | NULL |
| 12 | alefechalec | timestamp without time zone |  | YES | NULL |
| 13 | alefechafinalarma | timestamp without time zone |  | YES | NULL |
| 14 | alefechaproc | timestamp without time zone |  | YES | NULL |
| 15 | aleexpidpltf | character varying | 36 | YES | NULL |
| 16 | aleptoserv | character varying | 50 | YES | NULL |

### aliascarpeta
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aliasid | numeric | 10 | NO | NULL |
| 2 | aliasnombre | character varying | 30 | NO | ''::character varying |
| 3 | aliasruta | character varying | 150 | NO | ''::character varying |

### altasnuevas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ptosid | numeric | 10 | NO | NULL |
| 2 | locnombre | character varying | 40 | YES | NULL |
| 3 | dirtexto | character varying | 110 | YES | NULL |
| 4 | ncalnombre | character varying | 80 | YES | NULL |
| 5 | dirfinca | numeric | 10 | YES | NULL |
| 6 | dircomfin | character varying | 10 | YES | NULL |
| 7 | dirbloque | character varying | 4 | YES | NULL |
| 8 | direscal | character varying | 4 | YES | NULL |
| 9 | dirplanta | character varying | 4 | YES | NULL |
| 10 | dirpuerta | character varying | 4 | YES | NULL |
| 11 | dircomplem | character varying | 40 | YES | NULL |
| 12 | ptosestado | numeric | 5 | YES | NULL |
| 13 | tpsdesc | character varying | 40 | YES | NULL |
| 14 | sersncontrat | character | 1 | YES | NULL |
| 15 | sersnretaltas | character | 1 | YES | NULL |
| 16 | serfecprevmas | date |  | YES | NULL |
| 17 | seraport | double precision | 53 | YES | NULL |
| 18 | dircodpost | character varying | 10 | YES | NULL |
| 19 | socprsid | numeric | 10 | YES | NULL |
| 20 | expid | numeric | 5 | YES | NULL |

### altpasoproced
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | appid | numeric | 10 | NO | NULL |
| 2 | apppasid | numeric | 10 | NO | NULL |
| 3 | apporden | numeric | 10 | NO | NULL |
| 4 | apppassig | numeric | 10 | YES | NULL |
| 5 | apptpcond | numeric | 5 | NO | NULL |
| 6 | applistval | character varying | 100 | YES | NULL |
| 7 | appvalnum | numeric | 10 | YES | NULL |
| 8 | appvalnumhasta | numeric | 10 | YES | NULL |
| 9 | appvalsn | character | 1 | YES | NULL |
| 10 | apphstusu | character varying | 10 | YES | NULL::character varying |
| 11 | apphsthora | timestamp without time zone |  | YES | NULL |
| 12 | apppasomaestro | numeric | 10 | YES | NULL |
| 13 | appsnvigente | character | 1 | NO | 'S'::bpchar |

### annomes
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | amexpid | numeric | 5 | NO | NULL |
| 2 | amanno | numeric | 5 | NO | NULL |
| 3 | ammes | numeric | 5 | NO | NULL |
| 4 | amsescier | numeric | 10 | YES | NULL |

### aolimiteconsumo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aolexpid | numeric | 5 | NO | NULL |
| 2 | aolacccod | character | 2 | NO | NULL |
| 3 | aolobscod | character | 2 | NO | NULL |
| 4 | aoltiplote | character | 1 | NO | NULL |
| 5 | aolsntelelec | character | 1 | NO | 'N'::bpchar |
| 6 | aolperiid | numeric | 5 | NO | NULL |
| 7 | aolcptoid | numeric | 5 | NO | NULL |
| 8 | aolfmtcod | numeric | 5 | NO | NULL |
| 9 | aolliminf | numeric | 10 | YES | NULL |
| 10 | aollimsup | numeric | 10 | YES | NULL |
| 11 | aolhstusu | character varying | 10 | NO | ''::character varying |
| 12 | aolhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### aperturacaja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | apcid | numeric | 10 | NO | NULL |
| 2 | apcfecha | date |  | YES | NULL |
| 3 | apchora | time without time zone |  | YES | NULL |
| 4 | apcmonto | numeric | 18,2 | NO | NULL |
| 5 | apcsaldo | numeric | 18,2 | NO | NULL |
| 6 | apcusuid | character varying | 10 | NO | NULL |

### apliccpto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | apcexpid | numeric | 5 | NO | NULL |
| 2 | apccptoid | numeric | 5 | NO | NULL |
| 3 | apcfecini | date |  | NO | NULL |
| 4 | apcfecfin | date |  | YES | NULL |
| 5 | apcsocemi | numeric | 10 | NO | NULL |
| 6 | apcsocpro | numeric | 10 | NO | NULL |
| 7 | apchstusu | character varying | 10 | NO | NULL |
| 8 | apchsthora | timestamp without time zone |  | NO | NULL |
| 9 | apcsnaboac | character | 1 | NO | 'N'::bpchar |
| 10 | apcsnrefac | character | 1 | NO | 'N'::bpchar |
| 11 | apcsnaboeac | character | 1 | NO | 'N'::bpchar |
| 12 | apcsnrefeac | character | 1 | NO | 'N'::bpchar |

### aplicimpues
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | apiid | numeric | 5 | NO | NULL |
| 2 | apitimpuid | numeric | 5 | NO | NULL |
| 3 | apifecini | date |  | NO | NULL |
| 4 | apifecfin | date |  | YES | NULL |
| 5 | apivalor | numeric | 5,4 | NO | NULL |
| 6 | apihstusu | character varying | 10 | NO | NULL |
| 7 | apihsthora | timestamp without time zone |  | NO | NULL |
| 8 | apisnnoexe | character | 1 | NO | 'N'::bpchar |
| 9 | apisnnosujeto | character | 1 | NO | 'N'::bpchar |

### aplictarif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aptexpid | numeric | 5 | NO | NULL |
| 2 | aptcptoid | numeric | 5 | NO | NULL |
| 3 | apttarid | numeric | 5 | NO | NULL |
| 4 | aptfecapl | date |  | NO | NULL |
| 5 | aptfecfin | date |  | YES | NULL |
| 6 | aptpubid | numeric | 5 | NO | NULL |
| 7 | aptcoment | character varying | 70 | YES | NULL |
| 8 | aptaplifecini | date |  | NO | NULL |
| 9 | apthstusu | character varying | 10 | NO | NULL |
| 10 | apthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### aprobcontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aprbpccid | numeric | 10 | NO | NULL |
| 2 | aprbprsid | numeric | 10 | NO | NULL |
| 3 | aprbfeclimite | date |  | NO | NULL |
| 4 | aprbresol | numeric | 5 | NO | NULL |
| 5 | aprbsesid | numeric | 10 | NO | NULL |
| 6 | aprbmotre | character varying | 50 | YES | NULL |

### apunte
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | apnasiento | numeric | 10 | NO | NULL |
| 2 | apnorden | numeric | 5 | NO | NULL |
| 3 | apndh | character | 1 | NO | NULL |
| 4 | apncuenta | character varying | 10 | NO | NULL |
| 5 | apnimporte | numeric | 18,2 | NO | NULL |
| 6 | apndescrip | character varying | 50 | NO | NULL |
| 7 | apndestino | character varying | 10 | YES | NULL |
| 8 | apncantida | double precision | 53 | YES | NULL |
| 9 | apnunidade | character | 3 | YES | NULL |
| 10 | apnindiva | character | 2 | YES | NULL |
| 11 | apnpctjiva | numeric | 5,4 | YES | NULL |
| 12 | apncsc | numeric | 5 | YES | NULL |
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
| 25 | apnsninccont | character | 1 | NO | 'S'::bpchar |

### areadpto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | adareaid | numeric | 5 | NO | NULL |
| 2 | adareacodi | character | 2 | NO | NULL |
| 3 | adareadesc | character varying | 20 | NO | NULL |
| 4 | adareagrupo | numeric | 5 | NO | '1'::numeric |

### areaproc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aprid | numeric | 5 | NO | NULL |
| 2 | aprtxtid | numeric | 10 | NO | NULL |

### arqueo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | arqexpid | numeric | 5 | NO | NULL |
| 2 | arqfecha | date |  | NO | NULL |
| 3 | arqpropie | numeric | 10 | NO | NULL |
| 4 | arqorigen | numeric | 5 | NO | NULL |
| 5 | arqmoroso | character | 1 | NO | NULL |
| 6 | arqfactura | numeric | 18,2 | NO | NULL |
| 7 | arqrefactu | numeric | 18,2 | NO | NULL |
| 8 | arqabonado | numeric | 18,2 | NO | NULL |
| 9 | arqcobrado | numeric | 18,2 | NO | NULL |
| 10 | arqdevuelto | numeric | 18,2 | NO | NULL |
| 11 | arqcedido | numeric | 18,2 | NO | NULL |
| 12 | arqamortiz | numeric | 18,2 | NO | NULL |
| 13 | arqsaldo | numeric | 18,2 | NO | NULL |
| 14 | arqdiferen | numeric | 18,2 | NO | NULL |
| 15 | arqcorsald | numeric | 18,2 | YES | NULL |
| 16 | arqcordesc | character varying | 60 | YES | NULL |
| 17 | arqrecarga | numeric | 18,2 | NO | 0 |
| 18 | arqnfactura | numeric | 10 | NO | 0 |
| 19 | arqnrefactu | numeric | 10 | NO | 0 |
| 20 | arqnabonado | numeric | 10 | NO | 0 |
| 21 | arqncobrado | numeric | 10 | NO | 0 |
| 22 | arqndevuelto | numeric | 10 | NO | 0 |
| 23 | arqncedido | numeric | 10 | NO | 0 |
| 24 | arqnrecarga | numeric | 10 | NO | 0 |
| 25 | arqnamortiz | numeric | 10 | NO | 0 |
| 26 | arqnsaldo | numeric | 10 | NO | 0 |
| 27 | arqndiferen | numeric | 10 | NO | 0 |
| 28 | arqncorsald | numeric | 18,2 | NO | 0 |
| 29 | arqdotacion | numeric | 18,2 | NO | 0 |
| 30 | arqndotacion | numeric | 10 | NO | 0 |

### arqueocomp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | arqcexpid | numeric | 5 | NO | NULL |
| 2 | arqcfecha | date |  | NO | NULL |
| 3 | arqccobplz | numeric | 18,2 | NO | NULL |
| 4 | arqcdevplz | numeric | 18,2 | NO | NULL |
| 5 | arqcentccont | numeric | 18,2 | NO | NULL |
| 6 | arqcsalccont | numeric | 18,2 | NO | NULL |
| 7 | arqcsaldoccont | numeric | 18,2 | NO | NULL |
| 8 | arqcnfiancob | numeric | 10 | NO | NULL |
| 9 | arqcfiancob | numeric | 18,2 | NO | NULL |
| 10 | arqcnfiandev | numeric | 10 | NO | NULL |
| 11 | arqcfiandev | numeric | 18,2 | NO | NULL |
| 12 | arqcnsaldofian | numeric | 10 | NO | NULL |
| 13 | arqcsaldofian | numeric | 18,2 | NO | NULL |
| 14 | arqrecargocob | numeric | 18,2 | NO | NULL |
| 15 | arqrecargodev | numeric | 18,2 | NO | NULL |
| 16 | arqcdesamortiz | numeric | 18,2 | NO | 0 |
| 17 | arqcndesamortiz | numeric | 10 | NO | 0 |
| 18 | arqcsalplz | numeric | 18,2 | NO | 0 |
| 19 | arqccobplzterm | numeric | 18,2 | NO | 0 |

### asiento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | asnid | numeric | 10 | NO | NULL |
| 2 | asntipo | numeric | 5 | NO | NULL |
| 3 | asnmandant | character | 3 | NO | NULL |
| 4 | asnsocieda | character | 4 | NO | NULL |
| 5 | asnejerci | numeric | 5 | NO | NULL |
| 6 | asnfecha | date |  | YES | NULL |
| 7 | asnorigen | character varying | 16 | NO | NULL |
| 8 | asnsesion | numeric | 10 | NO | NULL |
| 9 | asnnumdoc | character varying | 10 | YES | NULL |
| 10 | asnasiento | numeric | 10 | YES | NULL |
| 11 | asnsociedad | numeric | 10 | NO | NULL |
| 12 | asnclsdoc | character | 2 | YES | NULL |
| 13 | asntxtcab | character varying | 25 | YES | NULL |
| 14 | asncenben | character varying | 6 | YES | NULL |

### asiggradoinsolv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | asginid | numeric | 5 | NO | NULL |
| 2 | asginfacdesde | numeric | 10 | NO | NULL |
| 3 | asginfachasta | numeric | 10 | NO | NULL |
| 4 | asginveldesde | numeric | 16,6 | NO | NULL |
| 5 | asginvelhasta | numeric | 16,6 | NO | NULL |
| 6 | asgintpgiid | numeric | 5 | NO | NULL |

### asignpolnegusoexp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | apnueid | numeric | 10 | NO | NULL |
| 2 | apnueexpid | numeric | 5 | NO | NULL |
| 3 | apnueusocod | numeric | 5 | NO | NULL |
| 4 | apnuenumcicimpdesde | numeric | 5 | NO | NULL |
| 5 | apnuenumicimphasta | numeric | 5 | NO | NULL |
| 6 | apnuepneid | numeric | 10 | NO | NULL |
| 7 | apnueuser | character varying | 20 | NO | NULL |
| 8 | apnuehora | timestamp without time zone |  | NO | NULL |

### atencion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | atcid | numeric | 10 | NO | NULL |
| 2 | atctpaid | numeric | 5 | NO | NULL |
| 3 | atcusuid | character varying | 10 | NO | NULL |
| 4 | atcofiid | numeric | 5 | NO | NULL |
| 5 | atcfecha | timestamp without time zone |  | NO | NULL |

### audcamfto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acfid | numeric | 10 | NO | NULL |
| 2 | acfftoid | numeric | 10 | NO | NULL |
| 3 | acfaftid | numeric | 10 | YES | NULL |
| 4 | acfafcid | numeric | 10 | YES | NULL |
| 5 | acfclave | character varying | 50 | YES | NULL |
| 6 | acfaccion | character varying | 1 | NO | NULL |
| 7 | acfidicod | character | 2 | YES | NULL |
| 8 | acfvalact | character varying | 4000 | YES | NULL |
| 9 | acfvalant | character varying | 4000 | YES | NULL |
| 10 | acfusucam | character varying | 10 | NO | NULL |
| 11 | acfhoracam | timestamp without time zone |  | NO | NULL |
| 12 | acfusuval | character varying | 10 | YES | NULL |
| 13 | acfhoraval | timestamp without time zone |  | YES | NULL |
| 14 | acfmodificado | character | 1 | NO | 'N'::bpchar |

### audcamftovidoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acfvid | numeric | 10 | NO | NULL |
| 2 | acfvftoid | numeric | 10 | NO | NULL |
| 3 | acfvidelemento | numeric | 14 | YES | NULL |
| 4 | acfvnombreelemento | character varying | 500 | NO | NULL |
| 5 | acfvtipo | numeric | 5 | NO | NULL |
| 6 | acfvaccion | character varying | 1 | YES | NULL |
| 7 | acfvusucam | character varying | 50 | YES | NULL |
| 8 | acfvhoracam | timestamp without time zone |  | YES | NULL |
| 9 | acfvusuval | character varying | 10 | YES | NULL |
| 10 | acfvhoraval | timestamp without time zone |  | YES | NULL |

### audcamval
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | acvid | numeric | 10 | NO | NULL |
| 2 | acvftoid | numeric | 10 | NO | NULL |
| 3 | acvaftid | numeric | 10 | YES | NULL |
| 4 | acvclave | character varying | 50 | YES | NULL |
| 5 | acvaccion | character varying | 1 | NO | NULL |
| 6 | acvsnlastval | character | 1 | NO | NULL |
| 7 | acvregant | numeric | 10 | YES | NULL |
| 8 | acvusuval | character varying | 10 | NO | NULL |
| 9 | acvhoraval | timestamp without time zone |  | NO | NULL |

### audfaccol
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | afcid | numeric | 10 | NO | NULL |
| 2 | afcaftid | numeric | 10 | NO | NULL |
| 3 | afcnombre | character varying | 35 | NO | NULL |
| 4 | afcnombrehistorico | character varying | 35 | NO | NULL |
| 5 | afcdescrip | character varying | 100 | NO | NULL |
| 6 | afcsnidi | character | 1 | NO | NULL |
| 7 | afchstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 8 | afchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 9 | afctipocambio | numeric | 5 | NO | 0 |

### audfactab
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | aftid | numeric | 10 | NO | NULL |
| 2 | aftnombre | character varying | 35 | NO | NULL |
| 3 | aftnombrehistorico | character varying | 35 | NO | NULL |
| 4 | aftdescrip | character varying | 60 | NO | NULL |
| 5 | aftclavetabla | character varying | 80 | NO | NULL |
| 6 | afttipoclave | character varying | 80 | NO | NULL |
| 7 | aftcampoidioma | character varying | 35 | YES | NULL |
| 8 | aftcampousu | character varying | 35 | NO | NULL |
| 9 | aftcampohora | character varying | 35 | NO | NULL |
| 10 | aftclasedet | character varying | 100 | NO | NULL |
| 11 | aftcampoactivo | character varying | 35 | YES | NULL |
| 12 | afthstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 13 | afthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 14 | aftsnetarifaria | character | 1 | NO | 'N'::bpchar |
| 15 | aftpadre | numeric | 10 | YES | NULL |
| 16 | afthisclavetabla | character varying | 80 | YES | NULL |
| 17 | afthiscampousu | character varying | 35 | YES | NULL |
| 18 | afthiscampohora | character varying | 35 | YES | NULL |
| 19 | afttipocambio | numeric | 5 | NO | 0 |

### audit_polcontar_prefactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | fecha | date |  | YES | NULL |
| 2 | operacion | character varying | 2 | YES | NULL |
| 3 | pctexpid | numeric | 5 | YES | NULL |
| 4 | pctcptoid | numeric | 5 | YES | NULL |
| 5 | pctttarid | numeric | 5 | YES | NULL |
| 6 | pctcnttnum | numeric | 10 | YES | NULL |
| 7 | old_pctfecini | date |  | YES | NULL |
| 8 | new_pctfecfin | date |  | YES | NULL |

### audit_polhissum_prefactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | fecha | date |  | YES | NULL |
| 2 | operacion | character varying | 2 | YES | NULL |
| 3 | hispocid | numeric | 10 | YES | NULL |
| 4 | hisesfera | numeric | 5 | YES | NULL |
| 5 | old_hisajuste | numeric | 10 | YES | NULL |
| 6 | old_hisajusteval | numeric | 10 | YES | NULL |
| 7 | new_hisajuste | numeric | 10 | YES | NULL |
| 8 | new_hisajusteval | numeric | 10 | YES | NULL |

### audit_variable_prefactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | fecha | date |  | YES | NULL |
| 2 | operacion | character varying | 2 | YES | NULL |
| 3 | old_varvalnum | numeric | 24,6 | YES | NULL |
| 4 | new_varid | numeric | 10 | YES | NULL |
| 5 | new_vartpvid | numeric | 5 | YES | NULL |
| 6 | new_varcnttnum | numeric | 10 | YES | NULL |
| 7 | new_varpocid | numeric | 10 | YES | NULL |
| 8 | new_varptosid | numeric | 10 | YES | NULL |
| 9 | new_varvalnum | numeric | 24,6 | YES | NULL |
| 10 | new_varvalchar | character | 20 | YES | NULL |
| 11 | new_varvalfec | date |  | YES | NULL |
| 12 | new_varvalbool | character | 1 | YES | NULL |
| 13 | new_varhstusu | character varying | 10 | YES | NULL |
| 14 | new_varhsthora | timestamp without time zone |  | YES | NULL |
| 15 | new_varfecini | date |  | YES | NULL |
| 16 | new_varfecfin | date |  | YES | NULL |

### autfirelectronica
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | afedfeid | numeric | 10 | NO | NULL |
| 2 | afeanumdoc | numeric | 5 | NO | NULL |
| 3 | afeaprsid | numeric | 10 | NO | NULL |
| 4 | afeagsaid | numeric | 5 | NO | NULL |

### aux_varscreditored_3018531
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018532
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018533
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018534
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018535
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018536
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018537
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018538
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018539
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018540
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018541
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018542
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018543
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018544
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018545
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018546
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018547
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018548
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018549
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018550
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018551
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018552
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018553
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018554
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018555
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018556
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018557
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018558
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018559
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018560
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018561
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018562
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018563
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018564
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018565
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018566
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018567
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018568
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018569
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018570
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018571
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018572
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018573
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018574
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018575
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018576
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018577
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018578
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018579
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018580
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018581
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018582
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018583
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018584
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018585
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018586
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018587
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018588
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018589
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018590
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018591
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018592
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018593
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018594
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018595
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018596
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018597
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018598
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018599
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018600
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018601
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018602
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018603
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018604
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018605
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018606
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018607
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018608
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018609
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018610
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018611
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018612
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018613
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018614
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018615
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018616
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018617
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018618
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018619
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018620
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018621
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018622
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018623
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018624
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018625
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018626
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018627
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018628
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018629
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018630
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018631
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018632
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018633
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018634
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018635
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018636
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018637
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018638
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018639
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018640
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018641
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018642
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018643
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018644
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018645
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018646
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018647
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018648
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018649
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018650
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018651
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018652
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018653
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018654
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018655
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018656
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018657
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018658
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018659
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018660
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018661
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018662
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018663
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018664
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018665
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018666
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018667
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018668
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018669
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018670
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018671
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018672
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018673
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018674
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018675
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018676
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018677
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018678
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018679
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018680
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018681
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018682
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018683
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018684
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018685
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018686
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018687
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018688
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018689
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018690
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018691
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018692
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018693
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018694
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018695
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018696
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018697
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018698
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018699
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018700
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3018702
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019091
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019116
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019163
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019168
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019179
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019192
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019198
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019201
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019282
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019289
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019298
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019656
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3019668
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3035200
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3143022
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3331594
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3331985
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3331990
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3331996
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332008
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332016
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332019
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332039
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332041
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332042
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332048
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332051
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332063
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332151
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332163
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332814
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332815
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332845
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332846
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332847
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332848
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332849
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332850
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332851
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332852
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3332853
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3334559
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3334560
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3334894
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335022
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335093
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335119
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335122
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335318
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335449
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335714
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335781
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335783
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335815
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335816
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335819
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335825
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335827
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335829
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335830
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3335833
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3336043
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3336181
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3336193
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3336208
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3336252
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3336374
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3336835
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3372226
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3372229
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3372230
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3372543
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388173
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388174
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388176
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388177
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388182
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388183
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388184
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388185
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388186
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388187
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388188
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388189
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388191
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388192
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388194
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388195
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388197
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388200
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388201
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388202
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388203
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388204
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388205
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388206
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388207
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388208
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388209
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388210
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388211
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388212
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388213
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388214
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388215
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388216
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388240
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388246
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388318
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388319
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3388321
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3473345
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3473347
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3528928
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3573240
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3573241
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3573242
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3589981
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3590020
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616310
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616311
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616354
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616357
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616374
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616376
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616377
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616378
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616379
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616380
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616381
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616383
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616386
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616387
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616388
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616389
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616392
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616397
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616405
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616413
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616417
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616420
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616422
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616424
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616425
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616426
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616430
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616435
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616436
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616441
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616452
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616482
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616502
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616561
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616563
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616567
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616621
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616629
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616633
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616661
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616664
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616670
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616674
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616676
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616688
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616711
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616713
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616714
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616720
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616725
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616727
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616746
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616747
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616750
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616761
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616765
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616778
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616786
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616787
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616790
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616792
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616799
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616801
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616809
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616871
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616872
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616886
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616892
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616904
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616905
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616931
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616932
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616934
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616935
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616942
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616943
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616946
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616947
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616949
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616961
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616964
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616966
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616967
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616970
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616979
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616985
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616990
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616993
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616997
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616998
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3616999
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617003
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617004
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617007
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617011
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617017
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617020
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617024
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617031
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617059
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617061
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617066
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617108
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617121
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617159
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617172
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617173
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617188
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617198
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617213
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617217
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617225
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617229
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617233
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617234
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617235
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617238
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617239
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617249
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617250
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617251
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617256
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617273
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617274
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617280
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617286
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617292
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617305
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617306
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617307
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617308
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617309
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617313
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617314
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617315
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617316
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617317
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617320
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617328
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617339
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617344
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617353
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617364
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617370
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617371
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617387
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617389
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617390
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617399
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617400
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617401
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617402
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617403
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617404
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617405
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617406
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617407
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617408
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617409
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617410
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617411
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617412
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617413
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617414
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617415
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617416
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617417
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3617418
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3648615
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3733372
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_3985135
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4393472
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4562601
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4564717
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4566617
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4568320
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4570041
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4570901
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4571561
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4571745
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4571746
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4571755
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4571861
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4571874
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4572126
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4572271
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### aux_varscreditored_4572346
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | integer | 32 | YES | NULL |
| 2 | impvariable | numeric | 18,2 | YES | NULL |
| 3 | impvaranterior | numeric | 18,2 | YES | NULL |

### avisopago
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | avpid | numeric | 10 | NO | NULL |
| 2 | avpcnttnum | numeric | 10 | NO | NULL |
| 3 | avpbngbanid | numeric | 5 | NO | NULL |
| 4 | avpdcpid | numeric | 10 | NO | NULL |
| 5 | avpfecha | timestamp without time zone |  | NO | NULL |
| 6 | avpbngsocprsid | numeric | 10 | NO | NULL |

