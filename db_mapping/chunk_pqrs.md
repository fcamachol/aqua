# Database Map - Tables P*, Q*, R*, S*
## Schema: cf_quere_pro

Total tables: 294

### padron
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | padexpid | numeric | 5 | NO | NULL |
| 2 | padpobid | numeric | 10 | NO | NULL |
| 3 | padanno | numeric | 5 | NO | NULL |
| 4 | padperiodi | numeric | 5 | NO | NULL |
| 5 | padperiodo | numeric | 5 | NO | NULL |
| 6 | padfecaprob | date |  | NO | NULL |
| 7 | padfecpubl | date |  | NO | NULL |
| 8 | padfecvcto | date |  | NO | NULL |
| 9 | padliqid | numeric | 5 | YES | NULL |
| 10 | padusu | character | 10 | NO | 'CONVERSION'::bpchar |
| 11 | padhora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### padroncpto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pacexpid | numeric | 5 | NO | NULL |
| 2 | pacpobid | numeric | 10 | NO | NULL |
| 3 | pacanno | numeric | 5 | NO | NULL |
| 4 | pacperiodi | numeric | 5 | NO | NULL |
| 5 | pacperiodo | numeric | 5 | NO | NULL |
| 6 | paccptoid | numeric | 5 | NO | NULL |
| 7 | pacimpcuofij | numeric | 18,2 | YES | NULL |
| 8 | pacimpcuovar | numeric | 18,2 | YES | NULL |

### pais
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | paisid | numeric | 10 | NO | NULL |
| 2 | paisnombre | character varying | 40 | NO | NULL |
| 3 | paismascp1 | character varying | 10 | YES | NULL |
| 4 | paismascp2 | character varying | 10 | YES | NULL |
| 5 | paismascp3 | character varying | 10 | YES | NULL |
| 6 | paismascp4 | character varying | 10 | YES | NULL |
| 7 | paiscodint | character | 2 | NO | NULL |
| 8 | paissnsepa | character | 1 | NO | 'N'::bpchar |
| 9 | paissncuentaiban | character | 1 | NO | 'N'::bpchar |
| 10 | paisloniban | numeric | 5 | YES | NULL |
| 11 | paissncuentalocal | character | 1 | NO | 'N'::bpchar |
| 12 | paiscodintiso3 | character | 3 | YES | NULL |
| 13 | paissneea | character | 1 | NO | 'N'::bpchar |

### paqcontratist
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pqcctracod | numeric | 5 | NO | NULL |
| 2 | pqcpaqnom | character varying | 10 | NO | NULL |

### paqdocdest
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pddpaqid | numeric | 10 | NO | NULL |
| 2 | pddtipo | numeric | 5 | NO | NULL |
| 3 | pdddocgen | numeric | 10 | NO | NULL |
| 4 | pdddocrep | numeric | 10 | NO | NULL |

### paqdocorg
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pdoorgid | numeric | 5 | NO | NULL |
| 2 | pdotxtid | numeric | 10 | NO | NULL |
| 3 | pdoproceso | character | 1 | NO | NULL |
| 4 | pdomanual | character | 1 | NO | NULL |

### paqdocumr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pdrpaqid | numeric | 10 | NO | NULL |
| 2 | pdrsescrea | numeric | 10 | NO | NULL |
| 3 | pdrtipdoc | numeric | 5 | NO | NULL |
| 4 | pdrgesrecl | numeric | 10 | YES | NULL |
| 5 | pdrsesenv | numeric | 10 | NO | NULL |
| 6 | pdrprsimp | numeric | 10 | NO | NULL |
| 7 | pdrensob | numeric | 10 | NO | NULL |
| 8 | pdrobserv | character varying | 30 | YES | NULL |
| 9 | pdrentid | numeric | 10 | YES | NULL |
| 10 | pdrgenauto | character | 1 | NO | NULL |
| 11 | pdrorgid | numeric | 5 | NO | NULL |

### paramsfunc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prfgrupo | character varying | 60 | NO | NULL |
| 2 | prfparam | character varying | 100 | NO | NULL |
| 3 | prfsncliente | character varying | 1 | NO | NULL |
| 4 | prfvalordef | character varying | 200 | NO | NULL |
| 5 | prftxtid | numeric | 10 | NO | NULL |
| 6 | prfvalor | character varying | 200 | YES | NULL |

### paramsfuncident
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pfigrupo | character varying | 60 | NO | NULL |
| 2 | pfiparam | character varying | 100 | NO | NULL |
| 3 | pfinum | numeric | 5 | NO | NULL |
| 4 | pfitconid | numeric | 5 | YES | NULL |
| 5 | pfitpvid | numeric | 5 | YES | NULL |
| 6 | pfitsubid | numeric | 5 | YES | NULL |
| 7 | pfitiptid | numeric | 5 | YES | NULL |
| 8 | pfiexpid | numeric | 5 | YES | NULL |
| 9 | pfitpmodel | numeric | 5 | YES | NULL |
| 10 | pfitpdocum | numeric | 5 | YES | NULL |

### paramsfuncvis
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pfvgrupo | character varying | 60 | NO | NULL |
| 2 | pfvparam | character varying | 100 | NO | NULL |

### paramspadron
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prpadid | numeric | 10 | NO | NULL |
| 2 | prpadexpid | numeric | 5 | NO | NULL |
| 3 | prpadabono | character | 1 | NO | 'N'::bpchar |
| 4 | prpadfactura | character | 1 | NO | 'S'::bpchar |
| 5 | prpadrefact | character | 1 | NO | 'N'::bpchar |
| 6 | prpadbajas | numeric | 5 | NO | NULL |
| 7 | prpadcnttnofac | character | 1 | NO | 'S'::bpchar |
| 8 | prpaddetfto | character | 1 | NO | 'S'::bpchar |
| 9 | prpaddettarifa | character | 1 | NO | 'N'::bpchar |
| 10 | prpaddettipocob | character | 1 | NO | 'S'::bpchar |
| 11 | prpadtiposal | numeric | 5 | NO | NULL |
| 12 | prpadvariables | character | 1 | NO | 'N'::bpchar |
| 13 | prpadtramos | character | 1 | NO | 'N'::bpchar |
| 14 | prpadorden | numeric | 5 | NO | NULL |
| 15 | prpadagrupacion | numeric | 5 | NO | NULL |
| 16 | prpadsnfactmanual | character | 1 | YES | NULL |
| 17 | prpadmtfmanual | character | 90 | YES | NULL |
| 18 | prpadsndirfiscsv | character | 1 | NO | 'N'::bpchar |
| 19 | prpadsndatossensible | character | 1 | NO | 'N'::bpchar |
| 20 | prpaddatossensibles | character varying | 90 | YES | NULL |

### paramtelelect
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ptesistema | numeric | 5 | NO | NULL |
| 2 | pteintentos | numeric | 5 | NO | NULL |
| 3 | ptehoras | numeric | 5 | NO | NULL |

### parfunaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pfaid | numeric | 5 | NO | NULL |
| 2 | pfasocprsid | numeric | 10 | NO | NULL |
| 3 | pfatconid | numeric | 5 | NO | NULL |
| 4 | pfatiptid | numeric | 5 | NO | NULL |
| 5 | pfatpvid | numeric | 5 | NO | NULL |
| 6 | pfaliminfvar | numeric | 5 | NO | NULL |
| 7 | pfahstusu | character varying | 10 | NO | NULL |
| 8 | pfahsthora | timestamp without time zone |  | NO | NULL |
| 9 | pfatpvbonif | numeric | 5 | YES | NULL |
| 10 | pfaporcpregen | numeric | 5 | NO | 20 |
| 11 | pfatpvexen | numeric | 5 | YES | NULL |
| 12 | pfaimpjuicio | numeric | 18,2 | NO | 0 |
| 13 | pfatpvbonvul | numeric | 5 | YES | NULL |
| 14 | pfatpgesdeuda | numeric | 5 | YES | NULL |
| 15 | pfatpvbonvulad | character varying | 150 | YES | NULL |
| 16 | pfatpvnumuni | numeric | 5 | YES | NULL |
| 17 | pfavalnumuni | numeric | 10 | YES | NULL |
| 18 | pfaatlid | numeric | 5 | YES | NULL |
| 19 | pfatipidexcl | character varying | 150 | YES | NULL |
| 20 | pfatpvaguaalta | numeric | 5 | YES | NULL |
| 21 | pfadiasactat | numeric | 3 | YES | '90'::numeric |
| 22 | pfatpsvbonvulad | numeric | 5 | YES | NULL |
| 23 | pfaimpejecutiva | numeric | 18,2 | NO | '0'::numeric |

### partelec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | partid | numeric | 10 | NO | NULL |
| 2 | partexpid | numeric | 5 | NO | NULL |
| 3 | partzonid | character | 3 | NO | NULL |
| 4 | partlibcod | numeric | 5 | YES | NULL |
| 5 | partperiid | numeric | 5 | NO | NULL |
| 6 | partpernum | numeric | 5 | NO | NULL |
| 7 | partconcod | numeric | 5 | NO | NULL |
| 8 | partoperid | numeric | 5 | NO | NULL |
| 9 | partfecha | date |  | NO | NULL |
| 10 | partscodid | numeric | 5 | NO | NULL |
| 11 | partlotnum | numeric | 5 | YES | NULL |
| 12 | partcantid | numeric | 5 | NO | NULL |
| 13 | partdestin | character varying | 10 | YES | NULL |
| 14 | partfecreg | date |  | NO | NULL |
| 15 | partuser | character varying | 10 | NO | NULL |
| 16 | parttipmov | character | 1 | NO | NULL |

### partlectfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | plfid | numeric | 5 | NO | NULL |
| 2 | plfexpid | numeric | 5 | NO | NULL |
| 3 | plfzonas | character varying | 400 | YES | NULL |
| 4 | plftipo | numeric | 5 | NO | NULL |
| 5 | plfdescrip | character varying | 1000 | NO | NULL |
| 6 | plfactiva | character | 1 | NO | 'N'::bpchar |
| 7 | plfhstusu | character varying | 10 | NO | NULL |
| 8 | plfhsthora | timestamp without time zone |  | NO | NULL |

### pasochecfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcfftoid | numeric | 10 | NO | NULL |
| 2 | pcforden | numeric | 5 | NO | NULL |
| 3 | pcfdesccorta | character varying | 80 | NO | NULL |
| 4 | pcfdesclarga | character varying | 1000 | NO | NULL |
| 5 | pcfcondicion | character varying | 200 | YES | NULL |
| 6 | pcfaccion | character varying | 200 | YES | NULL |
| 7 | pcfchequeado | character | 1 | NO | 'N'::bpchar |
| 8 | pcfusu | character varying | 10 | YES | NULL |
| 9 | pcfhora | timestamp without time zone |  | YES | NULL |

### pasoproccp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | paspid | numeric | 5 | NO | NULL |
| 2 | paspprdpid | numeric | 5 | NO | NULL |
| 3 | pasporden | numeric | 5 | NO | NULL |
| 4 | paspdescri | character varying | 50 | NO | NULL |
| 5 | paspduracion | numeric | 5 | NO | NULL |
| 6 | pasptipodias | character | 1 | NO | NULL |
| 7 | paspsnvigente | character | 1 | NO | NULL |
| 8 | pasptiporde | numeric | 5 | YES | NULL |
| 9 | paspmotorde | numeric | 5 | YES | NULL |
| 10 | pasptpdid | numeric | 5 | YES | NULL |
| 11 | paspcopias | numeric | 5 | YES | NULL |
| 12 | paspformfcorte | numeric | 5 | NO | NULL |
| 13 | pasphstusu | character varying | 10 | NO | NULL |
| 14 | pasphsthora | timestamp without time zone |  | NO | NULL |

### pasoproced
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pasid | numeric | 10 | NO | NULL |
| 2 | pasprocedi | numeric | 5 | NO | NULL |
| 3 | pasposicio | numeric | 5 | NO | NULL |
| 5 | pasduracio | numeric | 5 | NO | NULL |
| 6 | pastiporde | numeric | 5 | YES | NULL |
| 7 | pasmotorde | numeric | 5 | YES | NULL |
| 8 | pascopiasr | numeric | 5 | NO | NULL |
| 9 | pasvigente | character | 1 | NO | NULL |
| 10 | pasnecaprob | character | 1 | NO | 'N'::bpchar |
| 11 | pasfacrecla | character | 1 | NO | 'N'::bpchar |
| 12 | pascanccambd | character | 1 | NO | 'N'::bpchar |
| 13 | pasintdemora | character | 1 | NO | 'N'::bpchar |
| 14 | pasporcrec | numeric | 6,2 | YES | NULL |
| 15 | passndercob | character | 1 | NO | 'N'::bpchar |
| 16 | pastccid | numeric | 5 | YES | NULL |
| 17 | pastpdid | numeric | 5 | YES | NULL |
| 18 | pastipodias | character | 1 | NO | NULL |
| 19 | pasformfcorte | numeric | 5 | NO | NULL |
| 20 | pashstusu | character varying | 10 | NO | NULL |
| 21 | pashsthora | timestamp without time zone |  | NO | NULL |
| 22 | pasfacreclcar | character | 1 | NO | 'N'::bpchar |
| 23 | pastmenid | numeric | 10 | YES | NULL |
| 24 | pastipovar1 | numeric | 5 | YES | NULL |
| 25 | pasaccionvar1 | numeric | 5 | YES | NULL |
| 26 | pasvalorvar1 | character varying | 10 | YES | NULL |
| 27 | paslimitevar1 | character varying | 10 | YES | NULL |
| 28 | pastipovar2 | numeric | 5 | YES | NULL |
| 29 | pasvalorvar2 | character varying | 10 | YES | NULL |
| 30 | pasambitacc | numeric | 5 | YES | NULL |
| 31 | pasrecmax | numeric | 18,2 | YES | NULL |
| 32 | pasrecmin | numeric | 18,2 | YES | NULL |
| 33 | paspersjur | character | 1 | NO | 'N'::bpchar |
| 34 | paspersfis | character | 1 | NO | 'N'::bpchar |
| 35 | passnbajacontrato | character | 1 | NO | 'N'::bpchar |
| 36 | passnrecobro | character | 1 | NO | 'N'::bpchar |
| 37 | pasfecrefvto | numeric | 5 | NO | 1 |
| 38 | passnconfsic | character | 1 | NO | 'N'::bpchar |
| 39 | passigpaso | numeric | 10 | YES | NULL |
| 40 | pasaplsignoaprob | numeric | 10 | YES | NULL |
| 41 | pasaplsigaprob | numeric | 10 | YES | NULL |
| 42 | pastipcomvenc | numeric | 5 | YES | NULL |
| 43 | pasdiasprevenc | numeric | 10 | YES | NULL |
| 44 | pastipogesdeuda | numeric | 5 | YES | NULL |
| 45 | paspasomaestro | numeric | 10 | YES | NULL |
| 46 | passnactdeud | character | 1 | YES | 'N'::bpchar |
| 47 | pasconsum | character | 1 | NO | 'N'::bpchar |
| 48 | pasnoconsum | character | 1 | NO | 'N'::bpchar |
| 49 | pasimpdeuda | numeric | 18,2 | YES | NULL |
| 50 | pasdescritxtid | numeric | 10 | NO | '0'::numeric |

### pasoprocfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ppfprfid | numeric | 5 | NO | NULL |
| 2 | ppfchfid | numeric | 5 | NO | NULL |
| 3 | ppforden | numeric | 5 | NO | NULL |

### pdteliquid
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pliqanno | numeric | 5 | NO | NULL |
| 2 | pliqmes | numeric | 5 | NO | NULL |
| 3 | pliqpropie | numeric | 10 | NO | NULL |
| 4 | pliqorigen | numeric | 5 | NO | NULL |
| 5 | pliqannemi | numeric | 5 | NO | NULL |
| 6 | pliqfaccob | numeric | 10 | YES | NULL |
| 7 | pliqimpcob | numeric | 18,2 | YES | NULL |
| 8 | pliqfacdev | numeric | 10 | YES | NULL |
| 9 | pliqimpdev | numeric | 18,2 | YES | NULL |
| 10 | pliqfacced | numeric | 10 | YES | NULL |
| 11 | pliqimpced | numeric | 18,2 | YES | NULL |
| 12 | pliqfeccrea | timestamp without time zone |  | YES | NULL |

### perfil
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | perfid | numeric | 5 | NO | NULL |
| 2 | perfmodcod | character varying | 15 | NO | NULL |
| 3 | perfnom | character varying | 10 | NO | NULL |
| 4 | perftxtid | numeric | 10 | NO | NULL |
| 5 | perfhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 6 | perfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | perfsnmodofi | character | 1 | NO | 'N'::bpchar |

### periaplictarif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | paptperiid | numeric | 5 | NO | NULL |
| 2 | paptexpid | numeric | 5 | NO | NULL |
| 3 | paptcptoid | numeric | 5 | NO | NULL |
| 4 | papttarid | numeric | 5 | NO | NULL |
| 5 | paptfecapl | date |  | NO | NULL |
| 6 | paptannoini | numeric | 5 | NO | NULL |
| 7 | paptpernumini | numeric | 5 | NO | NULL |
| 8 | paptannofin | numeric | 5 | YES | NULL |
| 9 | paptpernumfin | numeric | 5 | YES | NULL |
| 10 | papthstusu | character varying | 10 | NO | NULL |
| 11 | papthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### periodic
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | periid | numeric | 5 | NO | NULL |
| 2 | peritxtid | numeric | 10 | NO | NULL |
| 3 | perinumper | numeric | 5 | NO | NULL |
| 4 | perinumdia | double precision | 53 | NO | NULL |
| 5 | perhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | perhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### periodo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | perperiid | numeric | 5 | NO | NULL |
| 2 | pernumero | numeric | 5 | NO | NULL |

### permisos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prmfuncod | character varying | 50 | NO | NULL |
| 2 | prmperfid | numeric | 5 | NO | NULL |
| 3 | prmmodif | character | 1 | NO | NULL |
| 4 | prmhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 5 | prmhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### permisosweb
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pwcliid | numeric | 10 | NO | NULL |
| 2 | pwsnacceso | character | 1 | NO | NULL |
| 3 | pwusuario | character varying | 10 | NO | NULL |
| 4 | pwfecha | timestamp without time zone |  | NO | NULL |
| 5 | pwofiid | numeric | 5 | NO | NULL |

### persona
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prsid | numeric | 10 | NO | NULL |
| 2 | prsnombre | character varying | 40 | YES | NULL |
| 3 | prspriapel | character varying | 120 | NO | NULL |
| 4 | prssegapel | character varying | 40 | YES | NULL |
| 5 | prstelef | character varying | 16 | YES | NULL |
| 6 | prstelef2 | character varying | 16 | YES | NULL |
| 7 | prstelef3 | character varying | 16 | YES | NULL |
| 8 | prsnif | character varying | 15 | YES | NULL |
| 9 | prsjubilad | character | 1 | NO | NULL |
| 10 | prsjuridic | character | 1 | NO | NULL |
| 11 | prspassweb | character varying | 10 | YES | NULL |
| 12 | prscodextran | character varying | 12 | YES | NULL |
| 13 | prshstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 14 | prshsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 15 | prstelef4 | character varying | 16 | YES | NULL |
| 16 | prsfax | character varying | 16 | YES | NULL |
| 17 | prsfeccrea | date |  | NO | trunc(CURRENT_DATE) |
| 18 | prsofiid | numeric | 5 | NO | 0 |
| 19 | prsidicodigo | character | 2 | NO | 'es'::bpchar |
| 20 | prsnomcpto | character varying | 203 | NO | NULL |
| 22 | prsfecnac | date |  | YES | NULL |
| 23 | prsrcuid | numeric | 5 | YES | 0 |
| 24 | prstxtdirfisc | character varying | 150 | YES | NULL |
| 25 | prsprftelef2 | character varying | 5 | YES | NULL |
| 26 | prspaiscodigo | numeric | 10 | YES | NULL |
| 27 | prsfiporcli | character | 1 | NO | 'N'::bpchar |
| 28 | prsmvporcli | character | 1 | NO | 'N'::bpchar |
| 29 | prsgestor | character varying | 120 | YES | NULL |
| 30 | prsrgpdanonim | character | 1 | NO | 'N'::bpchar |
| 31 | prsupd | numeric | 5 | YES | NULL |
| 32 | prsnifnum | numeric | 15 | YES | NULL |
| 33 | prsbloqrgpd | character | 1 | NO | 'N'::bpchar |
| 34 | prsfecrevfijo | timestamp without time zone |  | YES | NULL |
| 35 | prsinteraccionfijo | character varying | 100 | YES | NULL |
| 36 | prsfecrevmovil | timestamp without time zone |  | YES | NULL |
| 37 | prsinteraccionmovil | character varying | 100 | YES | NULL |

### personacnae
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcnprsid | numeric | 10 | NO | NULL |
| 2 | pcncnaecod | numeric | 10 | NO | NULL |
| 3 | pcnsnasig | character | 1 | NO | 'N'::bpchar |

### personadir
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pdprsid | numeric | 10 | NO | NULL |
| 2 | pdnumdir | numeric | 5 | NO | NULL |
| 3 | pddirid | numeric | 10 | NO | NULL |
| 4 | pddirdefec | character | 1 | NO | NULL |
| 5 | pdsesid | numeric | 10 | NO | NULL |
| 6 | pdtelefono | character varying | 16 | YES | NULL |
| 7 | pdatttxt | character varying | 75 | YES | NULL |
| 8 | pdsnactiva | character | 1 | NO | 'S'::bpchar |
| 9 | pdusucrea | character varying | 10 | YES | NULL |
| 10 | pdsnaporcli | character | 1 | NO | 'N'::bpchar |
| 11 | pdgestor | character varying | 120 | YES | NULL |
| 12 | pdfecrev | timestamp without time zone |  | YES | NULL |
| 13 | pdinteraccion | character varying | 100 | YES | NULL |

### personaiae
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | piaeprsid | numeric | 10 | NO | NULL |
| 2 | piaesec | numeric | 5 | NO | NULL |
| 3 | piaeepi | numeric | 5 | NO | NULL |
| 4 | piaesnasig | character | 1 | NO | 'N'::bpchar |

### personatel
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prtlid | numeric | 10 | NO | NULL |
| 2 | prtlprsid | numeric | 10 | NO | NULL |
| 3 | prtltelefono | character varying | 16 | NO | NULL |
| 4 | prtlprefijo | character varying | 5 | NO | NULL |
| 5 | prtlautorizado | character | 1 | YES | 'S'::bpchar |
| 6 | prtlhstusu | character varying | 10 | NO | NULL |
| 7 | prtlhsthora | timestamp without time zone |  | NO | NULL |
| 8 | prtlfecrev | timestamp without time zone |  | YES | NULL |
| 9 | prtlinteraccion | character varying | 100 | YES | NULL |

### petextcontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pexcid | numeric | 10 | NO | NULL |
| 2 | pexcexpid | numeric | 5 | NO | NULL |
| 3 | pexccnttnum | numeric | 10 | NO | NULL |
| 4 | pexcptosid | numeric | 10 | NO | NULL |
| 5 | pexcprstit | numeric | 10 | NO | NULL |
| 6 | pexcmailtit | character varying | 150 | NO | NULL |
| 7 | pexcmoviltit | character varying | 16 | NO | NULL |
| 8 | pexcprfmovtit | character varying | 5 | NO | NULL |
| 9 | pexcprssol | numeric | 10 | NO | NULL |
| 10 | pexcmailsol | character varying | 150 | NO | NULL |
| 11 | pexcmovilsol | character varying | 16 | NO | NULL |
| 12 | pexcprfmovsol | character varying | 5 | NO | NULL |
| 13 | pexcvia | character | 2 | NO | NULL |
| 14 | pexclectura | numeric | 10 | YES | NULL |
| 15 | pexcfeclectura | date |  | YES | NULL |
| 16 | pexccuenta | character varying | 50 | NO | NULL |
| 17 | pexcbanco | numeric | 5 | YES | NULL |
| 18 | pexcagencia | numeric | 5 | YES | NULL |
| 19 | pexcsnfactdig | character | 1 | NO | NULL |
| 20 | pexcdestdigital | numeric | 5 | NO | NULL |
| 21 | pexcidioma | character | 2 | NO | NULL |
| 22 | pexcsncesion | character | 1 | NO | NULL |
| 23 | pexctipocli | character | 1 | NO | NULL |
| 24 | pexctipoptosrv | numeric | 5 | NO | NULL |
| 25 | pexcperiod | numeric | 5 | NO | NULL |
| 26 | pexctipocontr | numeric | 10 | NO | NULL |
| 27 | pexctratfianza | character | 1 | NO | NULL |
| 28 | pexcaltaov | character | 1 | NO | NULL |
| 29 | pexcfeccrea | timestamp without time zone |  | NO | NULL |
| 30 | pexcusucrea | character varying | 10 | NO | NULL |
| 31 | pexcsolproccontid | numeric | 10 | YES | NULL |
| 32 | pexcproccontid | numeric | 10 | YES | NULL |
| 33 | pexctxterror | character varying | 1000 | YES | NULL |
| 34 | pexcidcaso | character varying | 40 | YES | NULL |
| 35 | pexcuuidcaso | character varying | 36 | YES | NULL |
| 36 | pexcestado | character | 1 | NO | NULL |
| 37 | pexcjsonpet | character varying | 2000 | NO | NULL |

### peticion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | petid | numeric | 10 | NO | NULL |
| 2 | pettipo | numeric | 5 | NO | NULL |
| 3 | petusuid | character varying | 10 | NO | NULL |
| 4 | petip | character varying | 15 | NO | NULL |
| 5 | petserver | character varying | 128 | NO | NULL |
| 6 | petfecha | timestamp without time zone |  | NO | NULL |
| 7 | pettiempo | numeric | 10 | NO | NULL |
| 8 | petfinalizado | character | 1 | NO | NULL |
| 9 | petlonres | numeric | 10 | NO | NULL |
| 10 | pettimcom | numeric | 10 | NO | NULL |
| 11 | petsesionid | numeric | 10 | YES | NULL |
| 12 | petinstancia | text |  | YES | NULL |
| 13 | petmenu | character varying | 100 | YES | NULL |
| 14 | petorigen | character varying | 100 | YES | NULL |
| 15 | petdestino | character varying | 100 | YES | NULL |

### peticionesresultadomdm
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prmdmid | numeric | 10 | NO | NULL |
| 2 | prmdmnrsistorigen | numeric | 10 | NO | NULL |
| 3 | prmdmfechsincro | timestamp without time zone |  | YES | NULL |
| 4 | prmdmresultreg | character | 2 | YES | NULL |
| 5 | prmdmresultsincro | character | 2 | YES | NULL |
| 6 | prmdmidexpl | numeric | 5 | YES | NULL |
| 7 | prmdmcodpntsumn | character varying | 100 | YES | NULL |
| 8 | prmdmdenpntsumn | character varying | 100 | YES | NULL |
| 9 | prmdmnumpol | character varying | 60 | YES | NULL |
| 10 | prmdmtiptec | numeric | 5 | YES | NULL |
| 11 | prmdmnumseriecont | character varying | 20 | YES | NULL |
| 12 | prmdmmodeloeq | character varying | 20 | YES | NULL |
| 13 | prmdmmodradiovhf | character varying | 9 | YES | NULL |
| 14 | prmdmimetereq | character varying | 50 | YES | NULL |
| 15 | prmdmoptions | character varying | 20 | YES | NULL |
| 16 | prmdmbusvhfns | character varying | 7 | YES | NULL |
| 17 | prmdmbusvhfnshex | character varying | 8 | YES | NULL |
| 18 | prmdmfechaltaps | character varying | 20 | YES | NULL |
| 19 | prmdmsitps | numeric | 5 | YES | NULL |
| 20 | prmdmestadops | character varying | 50 | YES | NULL |
| 21 | prmdmsector | character varying | 70 | YES | NULL |
| 22 | prmdmsubsector | character varying | 70 | YES | NULL |
| 23 | prmdmgranconsumid | numeric | 5 | YES | NULL |
| 24 | prmdmfhaltapol | character varying | 20 | YES | NULL |
| 25 | prmdmfhbajapol | character varying | 20 | YES | NULL |
| 26 | prmdmsitpol | numeric | 5 | YES | NULL |
| 27 | prmdmestpol | character varying | 50 | YES | NULL |
| 28 | prmdmfacturable | numeric | 5 | YES | NULL |
| 29 | prmdmusoagua | character varying | 30 | YES | NULL |
| 30 | prmdmfrecfact | character varying | 30 | YES | NULL |
| 31 | prmdmtipcontador | numeric | 5 | YES | NULL |
| 32 | prmdmaliascont | character varying | 50 | YES | NULL |
| 33 | prmdmcontcontrol | numeric | 5 | YES | NULL |
| 34 | prmdmestcontador | character varying | 50 | YES | NULL |
| 35 | prmdmidmarca | character varying | 10 | YES | NULL |
| 36 | prmdmmarca | character varying | 20 | YES | NULL |
| 37 | prmdmidmodelo | character varying | 10 | YES | NULL |
| 38 | prmdmmodelo | character varying | 20 | YES | NULL |
| 39 | prmdmidcalibre | numeric | 5 | YES | NULL |
| 40 | prmdmfechinscont | character varying | 20 | YES | NULL |
| 41 | prmdmfechbajacont | character varying | 20 | YES | NULL |
| 42 | prmdmfechsuspcont | character varying | 20 | YES | NULL |
| 43 | prmdmvhfindpremont | numeric | 5 | YES | NULL |
| 44 | prmdmfilecini | character varying | 20 | YES | NULL |
| 45 | prmdmindlecini | numeric | 10 | YES | NULL |
| 46 | prmdmfilec | character varying | 20 | YES | NULL |
| 47 | prmdmindlec | numeric | 10 | YES | NULL |
| 48 | prmdmpulsoemi | numeric | 5,1 | YES | NULL |
| 49 | prdmlwindpremont | numeric | 5 | YES | NULL |
| 50 | prdmlwmodemis | character varying | 50 | YES | NULL |
| 51 | prdmlwmodulo | character varying | 50 | YES | NULL |
| 52 | prdmmarcaeqtelec | numeric | 5 | YES | NULL |
| 53 | prdmmodeleqtelec | numeric | 5 | YES | NULL |
| 54 | prdmlwclaveadic | character varying | 50 | YES | NULL |
| 55 | prdmbnbnumserie | character varying | 50 | YES | NULL |
| 56 | prdmlwinddeport | numeric | 5 | YES | NULL |
| 57 | prdmintegrado | character | 1 | YES | NULL |
| 58 | prdmmarcaeqtelecdesc | character varying | 50 | YES | NULL |
| 59 | prdmmodeleqtelecdesc | character varying | 50 | YES | NULL |

### peticionmdm
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pmdmid | numeric | 10 | NO | NULL |
| 2 | pmdmnumorden | numeric | 5 | NO | NULL |
| 3 | pmdmaccionps | character | 1 | YES | NULL |
| 4 | pmdmcodigops | character varying | 60 | YES | NULL |
| 5 | pmdmdenomps | character varying | 250 | YES | NULL |
| 6 | pmdmfhaltaps | timestamp without time zone |  | YES | NULL |
| 7 | pmdmsituacionps | numeric | 5 | YES | NULL |
| 8 | pmdmestadops | character varying | 50 | YES | NULL |
| 9 | pmdmsector | character varying | 70 | YES | NULL |
| 10 | pmdmsubsector | character varying | 70 | YES | NULL |
| 11 | pmdmgrncons | character | 1 | YES | 0 |
| 12 | pmdmservicio | numeric | 10 | YES | NULL |
| 13 | pmdmaccpoliza | character | 1 | YES | NULL |
| 14 | pmdmnumpoliza | character varying | 10 | YES | NULL |
| 15 | pmdmfhaltapol | timestamp without time zone |  | YES | NULL |
| 16 | pmdmfhbajapol | timestamp without time zone |  | YES | NULL |
| 17 | pmdmsitpoliza | character | 2 | YES | NULL |
| 18 | pmdmestpoliza | character varying | 50 | YES | NULL |
| 19 | pmdmfacturable | numeric | 5 | YES | 1 |
| 20 | pmdmfreqfact | character varying | 30 | YES | NULL |
| 21 | pmdmacclecini | character | 1 | YES | NULL |
| 22 | pmdmfecindlecini | timestamp without time zone |  | YES | NULL |
| 23 | pmdmindlecini | numeric | 10 | YES | NULL |
| 24 | pmdmacccontador | character | 1 | YES | NULL |
| 25 | pmdmidcontador | numeric | 10 | YES | NULL |
| 26 | pmdmnscontador | character varying | 20 | YES | NULL |
| 27 | pmdmtipcontador | numeric | 5 | YES | NULL |
| 28 | pmdmestcontador | character varying | 50 | YES | NULL |
| 29 | pmdmidmarca | character varying | 10 | YES | NULL |
| 30 | pmdmmarca | character varying | 20 | YES | NULL |
| 31 | pmdmidmodelo | character varying | 10 | YES | NULL |
| 32 | pmdmmodelo | character varying | 50 | YES | NULL |
| 33 | pmdmidcalibre | numeric | 5 | YES | NULL |
| 34 | pmdmfhinstal | timestamp without time zone |  | YES | NULL |
| 35 | pmdmfhbaja | timestamp without time zone |  | YES | NULL |
| 36 | pmdmfhsusp | timestamp without time zone |  | YES | NULL |
| 37 | pmdmpesopulso | numeric | 11,4 | YES | NULL |
| 38 | pmdmmostov | numeric | 5 | YES | NULL |
| 39 | pmdmaccequipo | character | 1 | YES | NULL |
| 40 | pmdmidtiptecn | numeric | 5 | YES | NULL |
| 41 | pmdmacclectura | character | 1 | YES | NULL |
| 42 | pmdmfhlectura | timestamp without time zone |  | YES | NULL |
| 43 | pmdmindlectura | numeric | 10 | YES | NULL |
| 44 | pmdmrecalchis | numeric | 5 | YES | 0 |
| 45 | pmdmvhfmodrad | character varying | 50 | YES | NULL |
| 46 | pmdmvhfindpremont | numeric | 5 | YES | NULL |
| 47 | pmdmvhfmodemis | character varying | 50 | YES | NULL |
| 48 | pmdmimetereqp | character varying | 50 | YES | NULL |
| 49 | pmdmimeteropt | numeric | 5 | YES | NULL |
| 50 | pmdmimetermod | character varying | 50 | YES | NULL |
| 51 | pmdmbvhfnumserie | character | 7 | YES | NULL |
| 52 | pmdmbrelacionpto | character | 1 | YES | 0 |
| 53 | pmdmbtiporelacion | character | 1 | YES | 0 |
| 54 | pmdmbaccioncorte | character | 1 | YES | NULL |
| 55 | pmdmbfechacorte | timestamp without time zone |  | YES | NULL |
| 56 | pmdmblecturacorte | numeric | 10 | YES | NULL |
| 57 | pmdmfhbajaeq | timestamp without time zone |  | YES | NULL |
| 58 | pmdmfhaltaeq | timestamp without time zone |  | YES | NULL |
| 59 | pmdmnumesf | numeric | 5 | NO | 1 |
| 60 | pmdmpulsoemi | numeric | 5,1 | YES | NULL |
| 61 | pmdmlwindpremont | numeric | 5 | YES | NULL |
| 62 | pmdmlwmodemis | character varying | 50 | YES | NULL |
| 63 | pmdmlwmodulo | character varying | 50 | YES | NULL |
| 64 | pmdmmarcaeqtelec | numeric | 5 | YES | NULL |
| 65 | pmdmmodeleqtelec | numeric | 5 | YES | NULL |
| 66 | pmdmlwclaveadic | character varying | 50 | YES | NULL |
| 67 | pmdmbnbnumserie | character varying | 50 | YES | NULL |
| 68 | pmdmlwinddeport | numeric | 5 | YES | NULL |
| 69 | pmdmintegrado | character | 1 | YES | NULL |
| 70 | pmdmmarcaeqtelecdesc | character varying | 20 | YES | NULL |
| 71 | pmdmmodeleqtelecdesc | character varying | 30 | YES | NULL |

### petordext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | poeid | numeric | 10 | NO | NULL |
| 2 | poefecrec | date |  | NO | CURRENT_DATE |
| 3 | poeestado | numeric | 5 | NO | 0 |
| 4 | poecoderror | numeric | 5 | YES | NULL |
| 5 | poetrzerror | character varying | 100 | YES | NULL |
| 6 | poeexpsgo | character varying | 5 | YES | NULL |
| 7 | poeexpidord | numeric | 5 | YES | NULL |
| 8 | poefeccreord | timestamp without time zone |  | YES | NULL |
| 9 | poeptosid | numeric | 10 | YES | NULL |
| 10 | poecnttnum | numeric | 10 | YES | NULL |
| 11 | poecontnumero | character varying | 20 | YES | NULL |
| 12 | poeidsgo | character varying | 50 | YES | NULL |
| 13 | poetipoord | numeric | 5 | YES | NULL |
| 14 | poemotnores | character varying | 50 | YES | NULL |
| 15 | poetelelectura | character | 1 | YES | NULL |
| 16 | poepobid | numeric | 10 | YES | NULL |
| 17 | poelocid | numeric | 10 | YES | NULL |
| 18 | poecalid | numeric | 10 | YES | NULL |
| 19 | poefinca | numeric | 10 | YES | NULL |
| 20 | poedireccion | character varying | 100 | YES | NULL |
| 21 | poeexpid | numeric | 5 | YES | NULL |
| 22 | poenivcorte | numeric | 5 | YES | NULL |
| 23 | poemotcamcont | character varying | 50 | YES | NULL |
| 24 | poetipofraude | numeric | 5 | YES | NULL |

### petordextres
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | poerid | numeric | 10 | NO | NULL |
| 2 | poernumres | numeric | 5 | NO | NULL |
| 3 | poersncontret | character | 1 | YES | NULL |
| 4 | poernumesfera | numeric | 5 | YES | NULL |
| 5 | poermarca | character varying | 50 | YES | NULL |
| 6 | poermodelo | character varying | 50 | YES | NULL |
| 7 | poercalibre | numeric | 5 | YES | NULL |
| 8 | poernumserie | character varying | 50 | YES | NULL |
| 9 | poermodcomun | character varying | 50 | YES | NULL |
| 10 | poerannofab | numeric | 5 | YES | NULL |
| 11 | poerfecinstal | date |  | YES | NULL |
| 12 | poeremplazam | character | 2 | YES | NULL |
| 13 | poernumllave | numeric | 5 | YES | NULL |
| 14 | poerbatfila | numeric | 5 | YES | NULL |
| 15 | poerbatcoluma | numeric | 5 | YES | NULL |
| 16 | poerfeclec | timestamp without time zone |  | YES | NULL |
| 17 | poerlecreg | numeric | 10,2 | YES | NULL |
| 18 | poernifeje | character varying | 10 | YES | NULL |
| 19 | poernomeje | character varying | 50 | YES | NULL |
| 20 | poersnvalret | character | 1 | YES | NULL |
| 21 | poernohaycont | character | 1 | YES | NULL |
| 22 | poercifempeje | character varying | 10 | YES | NULL |
| 23 | poernomempeje | character varying | 50 | YES | NULL |
| 24 | poersnspde | character | 1 | YES | NULL |

### petordextvis
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | poevid | numeric | 10 | NO | NULL |
| 2 | poevnumvis | numeric | 5 | NO | NULL |
| 3 | poevfecvis | timestamp without time zone |  | YES | NULL |
| 4 | poevnifope | character varying | 10 | YES | NULL |
| 5 | poevnomope | character varying | 50 | YES | NULL |
| 6 | poevnomcont | character varying | 80 | YES | NULL |
| 7 | poevobserva | character varying | 300 | YES | NULL |
| 8 | poevcodvin | character varying | 30 | YES | NULL |
| 9 | poeviddocfir | character varying | 30 | YES | NULL |
| 10 | poevresnom | character varying | 30 | YES | NULL |
| 11 | poevresape1 | character varying | 60 | YES | NULL |
| 12 | poevresape2 | character varying | 30 | YES | NULL |
| 13 | poevrestelf | character varying | 12 | YES | NULL |
| 14 | poevresnif | character varying | 10 | YES | NULL |
| 15 | poevcodinc | numeric | 5 | YES | NULL |

### planleclib
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | plecexpid | numeric | 5 | NO | NULL |
| 2 | pleczonid | character | 3 | NO | NULL |
| 3 | pleclibcod | numeric | 5 | NO | NULL |
| 4 | plecanno | numeric | 5 | NO | NULL |
| 5 | plecperiid | numeric | 5 | NO | NULL |
| 6 | plecpernum | numeric | 5 | NO | NULL |
| 7 | plecestado | numeric | 5 | NO | NULL |
| 8 | plecfpinilec | date |  | YES | NULL |
| 9 | plecfpfinlec | date |  | YES | NULL |
| 10 | plecfrinilec | date |  | YES | NULL |
| 11 | plecfrfinlec | date |  | YES | NULL |
| 12 | plecfcrealot | date |  | YES | NULL |
| 13 | plecfestnl | date |  | YES | NULL |
| 14 | plecsngenaut | character | 1 | NO | 'N'::bpchar |
| 15 | plechstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 16 | plechsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### planpago
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | plpid | numeric | 19 | NO | NULL |
| 2 | plpcnttnum | numeric | 10 | NO | NULL |
| 3 | plpfeccrea | date |  | NO | NULL |
| 4 | plpfecultima | date |  | YES | NULL |
| 5 | plpfecfin | date |  | YES | NULL |
| 6 | plpimpbase | numeric | 18,2 | YES | NULL |
| 7 | plpincremento | numeric | 5,2 | YES | NULL |
| 8 | plpimporte | numeric | 18,2 | YES | NULL |
| 9 | plpfeccuota | date |  | YES | NULL |
| 10 | plpcuota | numeric | 18,2 | YES | NULL |
| 11 | plpnumdev | numeric | 5 | YES | NULL |
| 12 | plpfecmodifgl | date |  | YES | NULL |
| 13 | plpfecfinprov | date |  | YES | NULL |
| 14 | plprenovado | character | 1 | NO | 'N'::bpchar |
| 15 | plpmotnorenova | numeric | 5 | YES | NULL |
| 16 | plpsndocadhesion | character | 1 | NO | 'N'::bpchar |
| 17 | plpsndocregula | character | 1 | NO | 'N'::bpchar |
| 18 | plpsndoccancela | character | 1 | NO | 'N'::bpchar |
| 19 | plpsncuotasad | character | 1 | NO | 'N'::bpchar |
| 20 | plpimportdeuda | numeric | 18,2 | YES | NULL |
| 21 | plpperiodoimp | character varying | 200 | YES | NULL |

### plantareas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ptaid | numeric | 10 | NO | NULL |
| 2 | ptatreid | numeric | 10 | NO | NULL |
| 3 | ptaparams | character varying | 1024 | YES | ''::character varying |
| 4 | ptahorplan | timestamp without time zone |  | NO | NULL |
| 5 | ptademora | numeric | 10 | YES | NULL |
| 6 | ptaperiod | numeric | 5 | NO | NULL |
| 7 | ptausuario | character varying | 10 | NO | NULL |
| 8 | ptahorins | timestamp without time zone |  | NO | NULL |
| 9 | ptaestado | numeric | 5 | NO | NULL |
| 10 | ptahorini | timestamp without time zone |  | YES | NULL |
| 11 | ptahorfin | timestamp without time zone |  | YES | NULL |
| 12 | ptaresultado | text |  | YES | NULL |
| 13 | ptaipnotif | character varying | 15 | YES | NULL |
| 14 | ptaptonotif | numeric | 10 | YES | NULL |
| 15 | ptaservidor | character varying | 128 | NO | NULL |
| 16 | ptaexpid | numeric | 5 | YES | NULL |
| 17 | ptaptaid | numeric | 10 | YES | NULL |

### plantillaplafirma
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ppfid | character varying | 64 | NO | NULL |
| 2 | ppftipo | numeric | 1 | NO | NULL |
| 3 | ppftipomail | numeric | 5 | YES | NULL |

### plazosremesa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | plrocgid | numeric | 10 | NO | NULL |
| 2 | plropdid | numeric | 10 | NO | NULL |

### poblacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pobid | numeric | 10 | NO | NULL |
| 2 | pobnombre | character varying | 40 | NO | NULL |
| 3 | pobproid | numeric | 5 | NO | NULL |
| 4 | pobcodine | numeric | 10 | YES | NULL |
| 5 | pobhstusu | character varying | 10 | YES | NULL |
| 6 | pobhsthora | timestamp without time zone |  | YES | NULL |

### polapunlec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | leclotcod | character | 12 | NO | NULL |
| 2 | lecconid | numeric | 10 | NO | NULL |
| 3 | lecnumesfe | numeric | 5 | NO | NULL |
| 4 | lecpocid | numeric | 10 | NO | NULL |
| 5 | lecptosid | numeric | 10 | NO | NULL |
| 6 | lecoriid | character | 2 | YES | NULL |
| 7 | leccnttnum | numeric | 10 | NO | NULL |
| 8 | lecoperid | numeric | 5 | YES | NULL |
| 9 | leccontrat | numeric | 5 | YES | NULL |
| 10 | lecobscod | character | 2 | YES | NULL |
| 11 | lecvallect | numeric | 10 | YES | NULL |
| 12 | lecfeclect | timestamp without time zone |  | YES | NULL |
| 13 | lecespsup | numeric | 10 | YES | NULL |
| 14 | lecespinf | numeric | 10 | YES | NULL |
| 15 | lecanterio | numeric | 10 | YES | NULL |
| 16 | lecptocodr | numeric | 14 | NO | NULL |
| 17 | lectexto | numeric | 10 | YES | NULL |
| 18 | lectipolec | character | 1 | YES | NULL |
| 19 | lecsncartel | character | 1 | NO | 'N'::bpchar |
| 20 | lecsnlectcartel | character | 1 | NO | 'N'::bpchar |
| 21 | lecfecgot | timestamp without time zone |  | YES | NULL |
| 22 | lecestado | numeric | 5 | NO | 1 |
| 23 | lechstusu | character varying | 10 | YES | NULL |
| 24 | lecanomalia | numeric | 5 | YES | NULL |
| 25 | lecsnlecambos | character | 1 | NO | 'N'::bpchar |
| 26 | lecnumint | numeric | 5 | YES | NULL |
| 27 | lectradio | character | 1 | YES | NULL |
| 28 | lecaccionllave | numeric | 5 | YES | NULL |

### polcartas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcarpolnum | numeric | 10 | NO | NULL |
| 2 | pcartcarid | numeric | 5 | NO | NULL |
| 3 | pcarfecadd | timestamp without time zone |  | NO | NULL |
| 4 | pcarorigen | numeric | 10 | NO | NULL |
| 5 | pcartexto | character varying | 250 | NO | NULL |
| 6 | pcarocgid | numeric | 10 | YES | NULL |
| 7 | pcaropdid | numeric | 10 | YES | NULL |
| 8 | pcarfecemi | date |  | YES | NULL |
| 9 | pcarfecdev | date |  | YES | NULL |
| 10 | pcarmotdev | numeric | 5 | YES | NULL |
| 11 | pcarrefer | character varying | 20 | YES | NULL |

### polciclo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pocid | numeric | 10 | NO | NULL |
| 2 | pocptoserv | numeric | 10 | NO | NULL |
| 3 | pocpolnum | numeric | 10 | NO | NULL |
| 4 | pocnciclo | numeric | 5 | NO | NULL |
| 5 | poctipo | numeric | 5 | NO | NULL |
| 6 | pocestado | numeric | 5 | NO | NULL |
| 7 | pocexpid | numeric | 5 | NO | NULL |
| 8 | poczonid | character | 3 | NO | NULL |
| 9 | pocanno | numeric | 5 | NO | NULL |
| 10 | pocperiodi | numeric | 5 | NO | NULL |
| 11 | pocperiodo | numeric | 5 | NO | NULL |
| 12 | pocsnperinc | character | 1 | NO | 'N'::bpchar |

### polcicloconsesp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pccepocid | numeric | 10 | NO | NULL |
| 2 | pcceesfera | numeric | 5 | NO | NULL |
| 3 | pcceminimo | numeric | 16,6 | YES | NULL |
| 4 | pccemaximo | numeric | 16,6 | YES | NULL |

### polclaus
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pclapolnum | numeric | 10 | NO | NULL |
| 2 | pclaid | numeric | 5 | NO | NULL |
| 3 | pclafecalt | date |  | NO | NULL |
| 4 | pclafecbaj | date |  | YES | NULL |
| 5 | pclahstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | pclahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### polcontar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pctexpid | numeric | 5 | NO | NULL |
| 2 | pctcptoid | numeric | 5 | NO | NULL |
| 3 | pctttarid | numeric | 5 | NO | NULL |
| 4 | pctcnttnum | numeric | 10 | NO | NULL |
| 5 | pctfecini | date |  | NO | NULL |
| 6 | pctfecfin | date |  | YES | NULL |
| 7 | pcthstusu | character varying | 10 | NO | NULL |
| 8 | pcthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### polcorrect
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcoradjid | numeric | 5 | NO | NULL |
| 2 | pcorcptoid | numeric | 5 | NO | NULL |
| 3 | pcorttarid | numeric | 5 | NO | NULL |
| 4 | pcorpolnum | numeric | 10 | NO | NULL |
| 5 | pcorsubcid | numeric | 5 | NO | NULL |
| 6 | pcorcanfij | numeric | 5 | YES | NULL |
| 7 | pcorcanpro | double precision | 53 | YES | NULL |
| 8 | pcorprefij | double precision | 53 | YES | NULL |
| 9 | pcorprepro | double precision | 53 | YES | NULL |
| 10 | pcorimpfij | double precision | 53 | YES | NULL |
| 11 | pcorimppro | double precision | 53 | YES | NULL |
| 12 | pcorminimo | numeric | 10 | YES | NULL |
| 13 | pcorunidad | numeric | 5 | YES | NULL |
| 14 | pcorexesub | character | 1 | NO | NULL |
| 15 | pcorexeimp | character | 1 | NO | NULL |
| 16 | pcorfecini | date |  | NO | NULL |
| 17 | pcorrefer | numeric | 10 | YES | NULL |
| 18 | pcordesc | character varying | 30 | YES | NULL |
| 19 | pcorftoid | numeric | 10 | YES | NULL |
| 20 | pcorftoope | numeric | 5 | YES | NULL |
| 21 | pcorparcial | character | 1 | NO | NULL |
| 22 | pcornocons | character | 1 | NO | NULL |
| 23 | pcorhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 24 | pcorhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### poldetmodif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pdmpocid | numeric | 10 | NO | NULL |
| 2 | pdmesfera | numeric | 5 | NO | NULL |
| 3 | pdmfechale | timestamp without time zone |  | NO | NULL |
| 4 | pdmoriid | character | 2 | NO | NULL |
| 5 | pdmlectori | numeric | 10 | NO | NULL |
| 6 | pdmhstusu | character varying | 10 | NO | NULL |
| 7 | pdmhsthora | timestamp without time zone |  | NO | NULL |

### poldetsum
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | detpocid | numeric | 10 | NO | NULL |
| 2 | detesfera | numeric | 5 | NO | NULL |
| 3 | detfechale | timestamp without time zone |  | NO | NULL |
| 4 | detoriid | character | 2 | NO | NULL |
| 5 | detmestid | numeric | 5 | YES | NULL |
| 6 | detcontrac | numeric | 5 | YES | NULL |
| 7 | detoperid | numeric | 5 | YES | NULL |
| 8 | detobscod | character | 2 | YES | NULL |
| 9 | dettipo | character | 1 | NO | NULL |
| 10 | detlectura | numeric | 10 | NO | NULL |
| 11 | detconsumo | numeric | 10 | NO | NULL |
| 12 | detfechare | timestamp without time zone |  | NO | NULL |
| 13 | detsesid | numeric | 10 | NO | NULL |
| 14 | detnumlote | numeric | 5 | YES | NULL |
| 15 | dettexto | numeric | 10 | YES | NULL |
| 16 | detajusteest | numeric | 10 | NO | 0 |
| 17 | detsaldobolsaest | numeric | 10 | NO | 0 |
| 18 | detsnlectcartel | character | 1 | NO | 'N'::bpchar |
| 19 | detcontid | numeric | 10 | YES | NULL |
| 20 | detajuste | numeric | 10 | NO | 0 |
| 21 | detotrosajustes | numeric | 10 | NO | 0 |
| 22 | detsntelelec | character | 1 | NO | 'N'::bpchar |
| 23 | detconsumoval | numeric | 10 | NO | 0 |
| 24 | detajusteestval | numeric | 10 | NO | 0 |
| 25 | detbolsaestval | numeric | 10 | NO | 0 |
| 26 | detajusteval | numeric | 10 | NO | 0 |
| 27 | detotrosajusval | numeric | 10 | NO | 0 |
| 28 | detmestidval | numeric | 5 | YES | NULL |
| 29 | detnumint | numeric | 5 | YES | NULL |
| 30 | detlectradio | character | 1 | YES | NULL |

### polestados
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pstapolnum | numeric | 10 | NO | NULL |
| 2 | pstafeccam | timestamp without time zone |  | NO | NULL |
| 3 | pstaestado | numeric | 5 | NO | NULL |
| 4 | pstafecfin | date |  | YES | NULL |

### polhissum
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hispocid | numeric | 10 | NO | NULL |
| 2 | hisesfera | numeric | 5 | NO | NULL |
| 3 | hisoriid | character | 2 | NO | NULL |
| 4 | hisobscod | character | 2 | YES | NULL |
| 5 | hisfecha | date |  | NO | NULL |
| 6 | hislectura | numeric | 10 | NO | NULL |
| 7 | hisconsumo | numeric | 10 | NO | NULL |
| 8 | hisaveriac | character | 1 | NO | NULL |
| 9 | hisajuste | numeric | 10 | NO | NULL |
| 10 | hismestid | numeric | 5 | YES | NULL |
| 11 | hisveriid | numeric | 5 | YES | NULL |
| 12 | hissesver | numeric | 10 | YES | NULL |
| 13 | hisajusteest | numeric | 10 | NO | NULL |
| 14 | hissaldobolsaest | numeric | 10 | NO | NULL |
| 15 | hisotrosajustes | numeric | 10 | NO | 0 |
| 16 | hissntelelec | character | 1 | NO | 'N'::bpchar |
| 17 | hisfecvalant | date |  | YES | NULL |
| 18 | hissnestimaver | character | 1 | NO | 'N'::bpchar |
| 19 | hisconsestave | numeric | 10 | NO | 0 |
| 20 | hismestidave | numeric | 5 | YES | NULL |
| 21 | hislecturaval | character | 1 | YES | NULL |
| 22 | hisconsumoval | numeric | 10 | NO | 0 |
| 23 | hisajusteestval | numeric | 10 | NO | 0 |
| 24 | hisajusteval | numeric | 10 | NO | 0 |
| 25 | hissaldobolsaestval | numeric | 10 | NO | 0 |
| 26 | hisotrosajusval | numeric | 10 | NO | 0 |
| 27 | hismestidval | numeric | 5 | YES | NULL |
| 28 | hisconsestaveval | numeric | 10 | NO | 0 |
| 29 | hismetestaveval | numeric | 5 | YES | NULL |
| 30 | hispocidval | numeric | 10 | YES | NULL |
| 31 | hisajustestfuga | numeric | 10 | NO | 0 |
| 32 | hismetestfuga | numeric | 5 | YES | NULL |
| 33 | hisaccllave | numeric | 5 | YES | NULL |

### poligonoind
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | polexpid | numeric | 5 | NO | NULL |
| 2 | polcod | character | 2 | NO | NULL |
| 3 | poldescri | character varying | 60 | NO | NULL |

### polnegexp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pneid | numeric | 10 | NO | NULL |
| 2 | pneexpid | numeric | 5 | NO | NULL |
| 3 | pnedescripcion | character varying | 256 | NO | NULL |
| 4 | pneimpdeumax | numeric | 18,2 | YES | NULL |
| 5 | pnenumplaunpro | numeric | 5 | NO | NULL |
| 6 | pnenumplamulpro | numeric | 5 | NO | NULL |
| 7 | pnenumfaccuoini | numeric | 5 | NO | NULL |
| 8 | pnedesrecom | numeric | 6,2 | NO | NULL |
| 9 | pnecondescmayor | character varying | 256 | YES | NULL |
| 10 | pnecondescmenor | character varying | 256 | YES | NULL |
| 11 | pnetasfin | numeric | 6,2 | NO | NULL |
| 12 | pneuser | character varying | 20 | NO | NULL |
| 13 | pnehora | timestamp without time zone |  | NO | NULL |

### polregfich
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prfbangeid | numeric | 5 | YES | NULL |
| 2 | prfbanid | numeric | 5 | YES | NULL |
| 3 | prfnumcta | character varying | 20 | YES | NULL |
| 4 | prfcnttnum | numeric | 10 | YES | NULL |
| 5 | prfnombape | character varying | 30 | YES | NULL |
| 6 | prfrcatastral | character varying | 30 | YES | NULL |
| 7 | prfnrodocupago | character varying | 11 | YES | NULL |
| 8 | prfimpfac | numeric | 10,2 | YES | NULL |
| 9 | prfimpcom | numeric | 18,2 | YES | NULL |
| 10 | prffecvenc | date |  | YES | NULL |
| 11 | prffecgen | date |  | YES | NULL |
| 12 | prftipofac | numeric | 5 | YES | NULL |
| 13 | prffaccioid | numeric | 10 | NO | NULL |
| 14 | prfnrofact | character | 18 | YES | NULL |
| 15 | prfdocupagoid | numeric | 10 | NO | NULL |

### prccambper
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cpprprid | numeric | 10 | NO | NULL |
| 2 | cpprperiid | numeric | 5 | NO | NULL |
| 3 | cpprdesc | character varying | 30 | NO | NULL |
| 4 | cpprsesnew | numeric | 10 | NO | NULL |
| 5 | cpprsesdef | numeric | 10 | YES | NULL |
| 6 | cpprestado | numeric | 5 | NO | NULL |
| 7 | cpprresid | numeric | 10 | YES | NULL |
| 8 | cpprpcsid | numeric | 10 | YES | NULL |
| 9 | cpprexpid | numeric | 5 | NO | NULL |

### prccambsen
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcsid | numeric | 10 | NO | NULL |
| 2 | pcssesion | numeric | 10 | NO | NULL |
| 3 | pcssolprs | numeric | 10 | YES | NULL |
| 4 | pcssolban | numeric | 5 | YES | NULL |
| 5 | pcsvia | character | 2 | NO | NULL |
| 6 | pcsresid | numeric | 10 | YES | NULL |

### prccambtit
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prctid | numeric | 10 | NO | NULL |
| 2 | prcttipo | character | 1 | NO | NULL |
| 3 | prctsocemio | numeric | 10 | NO | NULL |
| 4 | prctsocproo | numeric | 10 | YES | NULL |
| 5 | prctsocemin | numeric | 10 | NO | NULL |
| 6 | prctsocpron | numeric | 10 | YES | NULL |
| 7 | prctorigenes | character varying | 20 | NO | NULL |
| 8 | prctestados | character varying | 20 | NO | NULL |
| 9 | prctfecfacd | date |  | YES | NULL |
| 10 | prctfecfach | date |  | YES | NULL |
| 11 | prctperiid | numeric | 5 | YES | NULL |
| 12 | prctannod | numeric | 5 | YES | NULL |
| 13 | prctpernumerod | numeric | 5 | YES | NULL |
| 14 | prctannoh | numeric | 5 | YES | NULL |
| 15 | prctpernumeroh | numeric | 5 | YES | NULL |
| 16 | prctfechacrea | timestamp without time zone |  | NO | NULL |
| 17 | prctusucrea | character varying | 10 | NO | NULL |
| 18 | prctfechaejec | timestamp without time zone |  | YES | NULL |
| 19 | prctresid | numeric | 10 | YES | NULL |
| 20 | prctexpids | character varying | 1000 | NO | NULL |
| 21 | prctultfac | numeric | 10 | NO | 0 |
| 22 | prctnumfac | numeric | 10 | NO | 0 |

### prccamcpto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prccid | numeric | 10 | NO | NULL |
| 2 | prcctipo | numeric | 5 | NO | NULL |
| 3 | prccexpid | numeric | 5 | NO | NULL |
| 4 | prcctconid | numeric | 5 | NO | NULL |
| 5 | prcctiptid | numeric | 5 | YES | NULL |
| 6 | prccfecalta | date |  | YES | NULL |
| 7 | prccfecbaja | date |  | YES | NULL |
| 8 | prccnumcambios | numeric | 10 | NO | NULL |
| 9 | prccopcion | numeric | 5 | NO | NULL |
| 10 | prccresid | numeric | 10 | YES | NULL |
| 11 | prccusuid | character varying | 10 | NO | NULL |
| 12 | prccfecha | timestamp without time zone |  | NO | NULL |

### prccammas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcmid | numeric | 10 | NO | NULL |
| 2 | pcmexpid | numeric | 5 | NO | NULL |
| 3 | pcmtipo | numeric | 5 | NO | NULL |
| 4 | pcmdescri | character varying | 100 | NO | NULL |
| 5 | pcmcond | character varying | 1000 | NO | NULL |
| 6 | pcmnumcam | numeric | 10 | NO | NULL |
| 7 | pcmresid | numeric | 10 | YES | NULL |
| 8 | pcmusuid | character varying | 10 | NO | NULL |
| 9 | pcmfecha | timestamp without time zone |  | NO | NULL |

### prccamtar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pctid | numeric | 10 | NO | NULL |
| 2 | pctcptoexpid | numeric | 5 | NO | NULL |
| 3 | pctcptotconid | numeric | 5 | NO | NULL |
| 4 | pcttartiptido | numeric | 5 | YES | NULL |
| 5 | pcttartiptidd | numeric | 5 | YES | NULL |
| 6 | pctsnigncons | character | 1 | YES | NULL |
| 7 | pctusocod | numeric | 5 | YES | NULL |
| 8 | pctconsumod | numeric | 10 | YES | NULL |
| 9 | pctconsumoh | numeric | 10 | YES | NULL |
| 10 | pctfecfacd | date |  | YES | NULL |
| 11 | pctfecfach | date |  | YES | NULL |
| 12 | pctannod | numeric | 5 | YES | NULL |
| 13 | pctannoh | numeric | 5 | YES | NULL |
| 14 | pctperiid | numeric | 5 | YES | NULL |
| 15 | pctpernumd | numeric | 5 | YES | NULL |
| 16 | pctpernumh | numeric | 5 | YES | NULL |
| 17 | pctbqfid | numeric | 10 | YES | NULL |
| 18 | pcttpvidprinc | numeric | 5 | YES | NULL |
| 19 | pctvalordprin | character varying | 20 | YES | NULL |
| 20 | pctvalorhprin | character varying | 20 | YES | NULL |
| 21 | pcttpvidrel | numeric | 5 | YES | NULL |
| 22 | pctvalordrel | character varying | 20 | YES | NULL |
| 23 | pctvalorhrel | character varying | 20 | YES | NULL |

### prccamvar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcvid | numeric | 10 | NO | NULL |
| 2 | pcvtipo | character | 1 | NO | NULL |
| 3 | pcvexpid | numeric | 5 | NO | NULL |
| 4 | pcvtpvid | numeric | 5 | NO | NULL |
| 5 | pcvsnactvarrel | character | 1 | NO | 'S'::bpchar |
| 6 | pcvsnaddvar | character | 1 | NO | 'S'::bpchar |
| 7 | pcvperiid | numeric | 5 | NO | NULL |
| 8 | pcvbloqueofac | numeric | 10 | YES | NULL |
| 9 | pcvtconid | numeric | 5 | YES | NULL |
| 10 | pcvtiposcli | character varying | 30 | YES | NULL |
| 11 | pcvusos | character varying | 80 | YES | NULL |
| 12 | pcvtipossum | character varying | 100 | YES | NULL |
| 13 | pcvcontratos | character varying | 2000 | YES | NULL |
| 14 | pcvorigenvalv | numeric | 5 | NO | NULL |
| 15 | pcvorigenvalr | numeric | 5 | NO | NULL |
| 16 | pcvannodesde | numeric | 5 | YES | NULL |
| 17 | pcvperiododesde | numeric | 5 | YES | NULL |
| 18 | pcvannohasta | numeric | 5 | YES | NULL |
| 19 | pcvperiodohasta | numeric | 5 | YES | NULL |
| 20 | pcvm3defecto | numeric | 5 | YES | NULL |
| 21 | pcvvalorfvprin | character varying | 20 | YES | NULL |
| 22 | pcvvalorfvrel | character varying | 20 | YES | NULL |
| 23 | pcvncontratos | numeric | 10 | YES | NULL |
| 24 | pcvnpuntos | numeric | 10 | YES | NULL |
| 25 | pcvresid | numeric | 10 | YES | NULL |
| 26 | pcvtsejecucion | timestamp without time zone |  | NO | NULL |
| 27 | pcvusuario | character varying | 10 | NO | NULL |
| 28 | pcvtipoact | numeric | 5 | NO | 1 |
| 29 | pcvnomfichero | character varying | 30 | YES | NULL |
| 30 | pcvfichero | bytea |  | YES | NULL |
| 31 | pcvfechadesde | date |  | YES | NULL |
| 32 | pcvfechahasta | date |  | YES | NULL |

### prcconpaso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcppccid | numeric | 10 | NO | NULL |
| 2 | pcppaso | numeric | 5 | NO | NULL |
| 3 | pcpsesid | numeric | 10 | NO | NULL |

### prcdfianza
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pdfiaid | numeric | 5 | NO | NULL |
| 2 | pdfitipo | numeric | 5 | NO | NULL |
| 3 | pdfidesc | character varying | 50 | NO | NULL |
| 4 | pdfitasid | numeric | 5 | NO | NULL |
| 5 | pdficuenta | numeric | 5 | NO | NULL |
| 6 | pdficontrc | numeric | 5 | NO | NULL |
| 7 | pdfitconid | numeric | 5 | NO | NULL |
| 8 | pdfitarifa | numeric | 5 | NO | NULL |
| 9 | pdfsocgest | numeric | 10 | NO | NULL |

### prcdivcart
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prdcid | numeric | 10 | NO | NULL |
| 2 | prdcexpid | numeric | 5 | NO | NULL |
| 3 | prdctipo | character | 1 | NO | NULL |
| 4 | prdcsocemio | numeric | 10 | NO | NULL |
| 5 | prdcsocproo | numeric | 10 | NO | NULL |
| 6 | prdcsocpron | numeric | 10 | NO | NULL |
| 7 | prdcconcepto | numeric | 5 | NO | NULL |
| 8 | prdcorigenes | character varying | 20 | NO | NULL |
| 9 | prdcfecfacd | date |  | YES | NULL |
| 10 | prdcfecfach | date |  | YES | NULL |
| 11 | prdcperiid | numeric | 5 | YES | NULL |
| 12 | prdcannod | numeric | 5 | YES | NULL |
| 13 | prdcpernumerod | numeric | 5 | YES | NULL |
| 14 | prdcannoh | numeric | 5 | YES | NULL |
| 15 | prdcpernumeroh | numeric | 5 | YES | NULL |
| 16 | prdcfechacrea | timestamp without time zone |  | NO | NULL |
| 17 | prdcusucrea | character varying | 10 | NO | NULL |
| 18 | prdcfechaejec | timestamp without time zone |  | YES | NULL |
| 19 | prdcresid | numeric | 10 | YES | NULL |

### prcdlotinsfrau
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pifid | numeric | 5 | NO | NULL |
| 2 | pifexpid | numeric | 5 | NO | NULL |
| 3 | pifdescrip | character varying | 50 | NO | NULL |
| 4 | pifsnvigente | character | 1 | NO | 'S'::bpchar |
| 5 | pifsnautomat | character | 1 | NO | 'N'::bpchar |
| 6 | pifsnacegestauto | character | 1 | NO | 'N'::bpchar |
| 7 | pifautorde | numeric | 5 | YES | NULL |
| 8 | piftpestrtec | numeric | 5 | YES | NULL |
| 9 | pifsechidra | character varying | 200 | YES | NULL |
| 10 | pifsubsechidra | character varying | 200 | YES | NULL |
| 11 | pifperiodic | numeric | 5 | YES | NULL |
| 12 | pifzonas | character varying | 200 | YES | NULL |
| 13 | pifcodrecordesde | numeric | 14 | YES | NULL |
| 14 | pifcodrecorhasta | numeric | 14 | YES | NULL |
| 15 | piftpcliente | character varying | 30 | YES | NULL |
| 16 | piftpcptoid | numeric | 5 | YES | NULL |
| 17 | piftarifa | character varying | 200 | YES | NULL |
| 18 | pifactividad | character varying | 200 | YES | NULL |
| 19 | pifusos | character varying | 256 | YES | NULL |
| 20 | pifcnae | character varying | 200 | YES | NULL |
| 21 | pifsnexclsifraude | character | 1 | NO | 'S'::bpchar |
| 22 | pifsnexclsiinspec | character | 1 | NO | 'S'::bpchar |
| 23 | pifsninclfrauotrodom | character | 1 | NO | 'N'::bpchar |
| 24 | pifestadofraude | character varying | 200 | YES | NULL |
| 25 | piforiglect | character varying | 200 | YES | NULL |
| 26 | pifobslectincl | character varying | 200 | YES | NULL |
| 27 | pifobslectexcl | character varying | 200 | YES | NULL |
| 28 | pifnumperiodos | numeric | 5 | YES | NULL |
| 29 | pifestadoptoserv | character varying | 200 | YES | NULL |
| 30 | pifnumdiascort | numeric | 5 | YES | NULL |
| 31 | pifestadocntt | character varying | 200 | YES | NULL |
| 32 | pifnumdiasbaja | numeric | 5 | YES | NULL |
| 33 | pifnumdiasalta | numeric | 5 | YES | NULL |
| 34 | pifemplazconta | character varying | 200 | YES | NULL |
| 35 | pifporcdebajomedia | numeric | 5 | YES | NULL |
| 36 | pifdifanualmcub | numeric | 5 | YES | NULL |
| 37 | pifnumanios | numeric | 5 | YES | NULL |
| 38 | pifmaxptoserv | numeric | 5 | YES | NULL |
| 39 | pifhstusu | character varying | 10 | YES | NULL |
| 40 | pifphsthora | timestamp without time zone |  | YES | NULL |
| 41 | piftipofrecu | numeric | 5 | YES | NULL |
| 42 | piffrecu | numeric | 5 | YES | NULL |
| 43 | pifsnlunes | character | 1 | NO | 'S'::bpchar |
| 44 | pifsnmartes | character | 1 | NO | 'S'::bpchar |
| 45 | pifsnmiercoles | character | 1 | NO | 'S'::bpchar |
| 46 | pifsnjueves | character | 1 | NO | 'S'::bpchar |
| 47 | pifsnviernes | character | 1 | NO | 'S'::bpchar |
| 48 | pifsnsabado | character | 1 | NO | 'S'::bpchar |
| 49 | pifsndomingo | character | 1 | NO | 'S'::bpchar |
| 50 | piftipodia | numeric | 5 | YES | NULL |
| 51 | pifdiames | numeric | 5 | YES | NULL |
| 52 | pifdiasemana | character | 1 | YES | NULL |
| 53 | pifordendia | numeric | 5 | YES | NULL |
| 54 | pifmes | numeric | 5 | YES | NULL |
| 55 | piffecinicio | date |  | YES | NULL |

### prcdpclaus
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prdcprdpid | numeric | 5 | NO | NULL |
| 2 | prdcclauid | numeric | 5 | NO | NULL |
| 3 | prdcsnactivo | character | 1 | NO | NULL |
| 4 | prdchstusu | character varying | 10 | NO | NULL |
| 5 | prdchsthora | timestamp without time zone |  | NO | NULL |

### prcdpdocs
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prddprdpid | numeric | 5 | NO | NULL |
| 2 | prdddconid | numeric | 10 | NO | NULL |
| 3 | prddsnactivo | character | 1 | NO | NULL |
| 4 | prddhstusu | character varying | 10 | NO | NULL |
| 5 | prddhsthora | timestamp without time zone |  | NO | NULL |

### prcdreccprov
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prdpid | numeric | 5 | NO | NULL |
| 2 | prdpexpid | numeric | 5 | NO | NULL |
| 3 | prdpdescri | character varying | 50 | NO | NULL |
| 4 | prdpsnvigente | character | 1 | NO | NULL |
| 5 | prdpsnautomat | character | 1 | NO | NULL |
| 6 | prdporden | numeric | 5 | YES | NULL |
| 7 | prdptipclie | character varying | 30 | YES | NULL |
| 8 | prdpcortable | numeric | 5 | NO | NULL |
| 9 | prdpcortado | numeric | 5 | NO | NULL |
| 10 | prdpsnreclvenc | character | 1 | NO | NULL |
| 11 | prdpmindiasvenc | numeric | 5 | YES | NULL |
| 12 | prdpsnreclnvenc | character | 1 | NO | NULL |
| 13 | prdpdiasvtocont | numeric | 5 | YES | NULL |
| 14 | prdptipgesd | character varying | 30 | YES | NULL |
| 15 | prdpmaxcontratos | numeric | 10 | NO | NULL |
| 16 | prdpsnsolodocpend | character | 1 | NO | NULL |
| 17 | prdphstusu | character varying | 10 | NO | NULL |
| 18 | prdphsthora | timestamp without time zone |  | NO | NULL |
| 19 | prdpsnacepauto | character | 1 | NO | 'N'::bpchar |
| 20 | prdpestadocntt | numeric | 5 | YES | '1'::numeric |

### prcdrecla
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prdid | numeric | 5 | NO | NULL |
| 2 | prdtipo | numeric | 5 | NO | NULL |
| 3 | prdfuncion | character varying | 30 | NO | NULL |
| 5 | prdpropie | numeric | 10 | YES | NULL |
| 6 | prdperiodi | numeric | 5 | YES | NULL |
| 7 | prdtipclie | character varying | 30 | YES | NULL |
| 8 | prdcliente | numeric | 10 | YES | NULL |
| 9 | prdminanti | numeric | 5 | YES | NULL |
| 10 | prdmaxanti | numeric | 5 | YES | NULL |
| 11 | prdminimpo | numeric | 18,2 | YES | NULL |
| 12 | prdmaximpo | numeric | 18,2 | YES | NULL |
| 13 | prdcortabl | numeric | 5 | YES | NULL |
| 14 | prdcortado | numeric | 5 | YES | NULL |
| 15 | prdestpol | numeric | 5 | YES | NULL |
| 16 | prdtipgesd | character varying | 100 | YES | NULL |
| 17 | prdvigente | character | 1 | NO | NULL |
| 18 | prdnmaxpol | numeric | 5 | YES | NULL |
| 19 | prdautomat | character | 1 | NO | NULL |
| 20 | prdautorde | numeric | 5 | YES | NULL |
| 21 | prdorifact | character varying | 30 | YES | NULL |
| 22 | prdordenac | numeric | 5 | NO | NULL |
| 23 | prdexpid | numeric | 5 | NO | NULL |
| 24 | prdusos | character varying | 256 | YES | NULL |
| 25 | prdpropieta | character varying | 30 | YES | NULL |
| 26 | prdnumcicld | numeric | 5 | YES | NULL |
| 27 | prdnumciclh | numeric | 5 | YES | NULL |
| 28 | prdsololect | character | 1 | NO | 'N'::bpchar |
| 29 | prdnumciclc | numeric | 5 | YES | NULL |
| 30 | prdhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 31 | prdhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 32 | prdsnexcfacque | character | 1 | NO | 'N'::bpchar |
| 33 | prdmotfact | character varying | 256 | YES | NULL |
| 34 | prdcanalc | character varying | 30 | YES | NULL |
| 35 | prdminantianyos | numeric | 5 | YES | NULL |
| 36 | prdmaxantianyos | numeric | 5 | YES | NULL |
| 37 | prdconemail | character | 1 | NO | 'N'::bpchar |
| 38 | prdcontelefono | character | 1 | NO | 'N'::bpchar |
| 39 | prdsnexcfacpago | character | 1 | NO | 'N'::bpchar |
| 40 | prdsnexcfacjui | character | 1 | NO | 'N'::bpchar |
| 41 | prdantcortdes | numeric | 5 | YES | NULL |
| 42 | prdantcorthas | numeric | 5 | YES | NULL |
| 43 | prdminnumcnt | numeric | 5 | YES | NULL |
| 44 | prdacegestauto | character | 1 | NO | 'N'::bpchar |
| 45 | prdtipofrecu | numeric | 5 | YES | NULL |
| 46 | prdfrecu | numeric | 5 | YES | NULL |
| 47 | prdsnlunes | character | 1 | YES | NULL |
| 48 | prdsnmartes | character | 1 | YES | NULL |
| 49 | prdsnmiercoles | character | 1 | YES | NULL |
| 50 | prdsnjueves | character | 1 | YES | NULL |
| 51 | prdsnviernes | character | 1 | YES | NULL |
| 52 | prdsnsabado | character | 1 | YES | NULL |
| 53 | prdsndomingo | character | 1 | YES | NULL |
| 54 | prdtipodia | numeric | 5 | YES | NULL |
| 55 | prddiames | numeric | 5 | YES | NULL |
| 56 | prddiasemana | character | 1 | YES | NULL |
| 57 | prdordendia | numeric | 5 | YES | NULL |
| 58 | prdmes | numeric | 5 | YES | NULL |
| 59 | prdfecinicio | date |  | YES | NULL |
| 60 | prdsnexcctocur | character | 1 | YES | 'S'::bpchar |
| 61 | prdzonid | character varying | 2000 | YES | NULL |
| 62 | prdexcctocobrobloq | character | 1 | NO | 'N'::bpchar |
| 63 | prdantigtipo | numeric | 5 | NO | '1'::numeric |
| 64 | prdcategoria | numeric | 5 | NO | '1'::numeric |
| 65 | prdprocmaestro | numeric | 5 | YES | NULL |
| 66 | prddescritxtid | numeric | 10 | NO | '0'::numeric |

### prcsreccprov
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prppid | numeric | 10 | NO | NULL |
| 2 | prpprdpid | numeric | 5 | NO | NULL |
| 3 | prpcondcrea | character varying | 1000 | NO | NULL |

### prcsrecla
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prrid | numeric | 10 | NO | NULL |
| 2 | prrprdid | numeric | 5 | NO | NULL |
| 3 | prrcondcrea | character varying | 1000 | NO | NULL |
| 4 | prrsnporcond | character | 1 | NO | 'N'::bpchar |
| 5 | prrobsid | numeric | 10 | YES | NULL |

### prcsubroga
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | psbid | numeric | 10 | NO | NULL |
| 2 | psbexpid | numeric | 5 | NO | NULL |
| 3 | psbtsrgid | numeric | 5 | NO | NULL |
| 4 | psbcnttnum | numeric | 10 | NO | NULL |
| 5 | psbclivie | numeric | 10 | NO | NULL |
| 6 | psbclinue | numeric | 10 | NO | NULL |
| 7 | psbsesid | numeric | 10 | NO | NULL |
| 8 | psbhora | time without time zone |  | NO | NULL |
| 9 | psbcoment | character varying | 50 | YES | NULL |

### prcvarcsv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pvcid | numeric | 10 | NO | NULL |
| 2 | pvcexpid | numeric | 5 | NO | NULL |
| 3 | pvctpvid | numeric | 5 | YES | NULL |
| 4 | pvcanno | numeric | 5 | NO | NULL |
| 5 | pvcperiid | numeric | 5 | NO | NULL |
| 6 | pvcpernum | numeric | 5 | NO | NULL |
| 7 | pvcnumok | numeric | 10 | NO | NULL |
| 8 | pvcnumerr | numeric | 10 | NO | NULL |
| 9 | pvcfecproc | timestamp without time zone |  | NO | NULL |
| 10 | pvcresid | numeric | 10 | YES | NULL |
| 11 | pvcusuid | character varying | 10 | NO | NULL |

### preccalib
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcaladjid | numeric | 5 | NO | NULL |
| 2 | pcalcptoid | numeric | 5 | NO | NULL |
| 3 | pcalttarid | numeric | 5 | NO | NULL |
| 4 | pcalfecapl | date |  | NO | NULL |
| 5 | pcalsubcid | numeric | 5 | NO | NULL |
| 6 | pcalcalibm | numeric | 5 | NO | NULL |
| 7 | pcalprefij | double precision | 53 | NO | NULL |
| 8 | pcalprepro | double precision | 53 | NO | NULL |
| 9 | pcalprefc | double precision | 53 | YES | NULL |
| 10 | pcalprepc | double precision | 53 | YES | NULL |
| 11 | pcalusado | character | 1 | NO | NULL |
| 12 | pcalindblk | numeric | 5 | NO | NULL |
| 13 | pcalhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 14 | pcalhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### precgenespcat
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pgecexpid | numeric | 5 | NO | NULL |
| 2 | pgecfecini | date |  | NO | NULL |
| 3 | pgecfecfin | date |  | YES | NULL |
| 4 | pgecpregen | double precision | 53 | NO | NULL |
| 5 | pgecpreesp | double precision | 53 | NO | NULL |

### precmulvar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pmvexpid | numeric | 5 | NO | NULL |
| 2 | pmvcptoid | numeric | 5 | NO | NULL |
| 3 | pmvttarid | numeric | 5 | NO | NULL |
| 4 | pmvfecapl | date |  | NO | NULL |
| 5 | pmvsubcid | numeric | 5 | NO | NULL |
| 6 | pmvtpvid | numeric | 5 | NO | NULL |
| 7 | pmvprefij | double precision | 53 | NO | NULL |
| 8 | pmvprepro | double precision | 53 | NO | NULL |
| 9 | pmvhstusu | character varying | 10 | NO | NULL |
| 10 | pmvhsthora | timestamp without time zone |  | NO | NULL |

### precompago
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcpgscid | numeric | 10 | NO | NULL |
| 2 | pcpfeccrea | timestamp without time zone |  | YES | NULL |
| 3 | pcpusucrea | character varying | 20 | YES | NULL |
| 4 | pcpfecfinval | timestamp without time zone |  | YES | NULL |
| 5 | pcpfeccorte | timestamp without time zone |  | YES | NULL |
| 6 | pcpnumcp | numeric | 10 | YES | NULL |
| 7 | pcpdescripcion | character varying | 256 | YES | NULL |
| 8 | pcpimportemax | numeric | 18,2 | YES | NULL |
| 9 | pcpnumplazos | numeric | 5 | NO | NULL |
| 10 | pcpnumfaccuoini | numeric | 5 | NO | NULL |
| 11 | pcptasfin | numeric | 6,2 | NO | NULL |
| 12 | pcpvalido | character varying | 1 | NO | 'S'::character varying |
| 13 | pcpperiodi | numeric | 5 | YES | NULL |

### precotrcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | potradjid | numeric | 5 | NO | NULL |
| 2 | potrcptoid | numeric | 5 | NO | NULL |
| 3 | potrttarid | numeric | 5 | NO | NULL |
| 4 | potrfecapl | date |  | NO | NULL |
| 5 | potrsubcid | numeric | 5 | NO | NULL |
| 6 | potroconid | numeric | 5 | NO | NULL |
| 7 | potrporcen | numeric | 4,2 | NO | NULL |
| 8 | potraplimp | numeric | 5 | NO | NULL |
| 9 | potrusado | character | 1 | NO | NULL |
| 10 | potrindblk | numeric | 5 | NO | NULL |
| 11 | potrhstusu | character varying | 10 | NO | NULL |
| 12 | potrhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### precsubcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | psubexpid | numeric | 5 | NO | NULL |
| 2 | psubcptoid | numeric | 5 | NO | NULL |
| 3 | psubttarid | numeric | 5 | NO | NULL |
| 4 | psubfecapl | date |  | NO | NULL |
| 5 | psubsubcid | numeric | 5 | NO | NULL |
| 6 | psubperid | numeric | 5 | NO | NULL |
| 7 | psubtimpid | numeric | 5 | YES | NULL |
| 8 | psubfaccor | character | 1 | NO | NULL |
| 9 | psubforapl | numeric | 5 | NO | NULL |
| 10 | psubprefij | double precision | 53 | YES | NULL |
| 11 | psubprepro | double precision | 53 | YES | NULL |
| 12 | psubobtcal | character | 1 | NO | NULL |
| 13 | psubcalib | numeric | 5 | YES | NULL |
| 14 | psubpropre | character | 1 | NO | NULL |
| 15 | psubsispro | character | 1 | NO | NULL |
| 16 | psubobtcan | numeric | 5 | NO | 1 |
| 17 | psuborden | numeric | 5 | NO | NULL |
| 18 | psubobtfec | numeric | 5 | NO | 1 |
| 19 | psubsndmargen | character | 1 | NO | 'N'::bpchar |
| 20 | psubcorpera | numeric | 5 | NO | 1 |
| 21 | psubcorperb | numeric | 5 | NO | 1 |
| 22 | psubtpvid | numeric | 5 | YES | NULL |
| 23 | psubsnconsreal | character | 1 | NO | 'S'::bpchar |
| 24 | psubsnestim | character | 1 | NO | 'S'::bpchar |
| 25 | psubsnreparto | character | 1 | NO | 'S'::bpchar |
| 26 | psubsnotros | character | 1 | NO | 'S'::bpchar |
| 27 | psubtxtid | numeric | 10 | YES | NULL |
| 28 | psubsnimpfec | character | 1 | NO | 'N'::bpchar |
| 29 | psubsnimplin0 | character | 1 | NO | 'N'::bpchar |
| 30 | psubimptramos | numeric | 5 | NO | 2 |
| 31 | psubsnptran | character | 1 | NO | NULL |
| 32 | psubsnmrgaltas | character | 1 | NO | NULL |
| 33 | psubhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 34 | psubhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 35 | psubsnimplincnt0 | character | 1 | NO | 'N'::bpchar |
| 36 | psubsnimpsbtr | character | 1 | NO | 'S'::bpchar |
| 37 | psubumtramos | numeric | 5 | NO | 1 |
| 38 | psubsnajustprec | character | 1 | NO | 'N'::bpchar |
| 39 | psubsnimplinlecnoval | character | 1 | NO | 'N'::bpchar |
| 40 | psubcheckfecalta | character | 1 | NO | 'N'::bpchar |
| 41 | psubsnseprec | character | 1 | NO | 'N'::bpchar |
| 42 | psubtipaplicrec | numeric | 5 | YES | NULL |
| 43 | psubscpovid | numeric | 5 | YES | NULL |
| 44 | psubsnimptramosagrup | character | 1 | NO | 'N'::bpchar |
| 45 | psubagrupsubcto | numeric | 5 | YES | NULL |
| 46 | psubregestimbolsa | character | 1 | NO | 'N'::bpchar |

### precsubdvng
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | psudexpid | numeric | 5 | NO | NULL |
| 2 | psudcptoid | numeric | 5 | NO | NULL |
| 3 | psudttarid | numeric | 5 | NO | NULL |
| 4 | psudfecapl | date |  | NO | NULL |
| 5 | psudsubcid | numeric | 5 | NO | NULL |
| 6 | psudfiapdv | date |  | NO | NULL |
| 7 | psudffapdv | date |  | YES | NULL |
| 8 | psuddvnid | numeric | 5 | NO | NULL |
| 9 | psudhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 10 | psudhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### prectracal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ptcexpid | numeric | 5 | NO | NULL |
| 2 | ptccptoid | numeric | 5 | NO | NULL |
| 3 | ptcttarid | numeric | 5 | NO | NULL |
| 4 | ptcfecapli | date |  | NO | NULL |
| 5 | ptcsubcid | numeric | 5 | NO | NULL |
| 6 | ptclimite | numeric | 10 | NO | NULL |
| 7 | ptccalib | numeric | 5 | NO | NULL |
| 8 | ptcprefij | double precision | 53 | NO | NULL |
| 9 | ptcprepro | double precision | 53 | NO | NULL |
| 10 | ptcincremento | numeric | 5 | NO | NULL |
| 11 | ptchstusu | character varying | 10 | NO | NULL |
| 12 | ptchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 13 | ptcsnproincr | character | 1 | NO | 'N'::bpchar |

### prectramos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ptraadjid | numeric | 5 | NO | NULL |
| 2 | ptracptoid | numeric | 5 | NO | NULL |
| 3 | ptrattarid | numeric | 5 | NO | NULL |
| 4 | ptrafecapl | date |  | NO | NULL |
| 5 | ptrasubcid | numeric | 5 | NO | NULL |
| 6 | ptralimite | numeric | 10 | NO | NULL |
| 7 | ptradesc | character varying | 30 | NO | NULL |
| 8 | ptraprefij | double precision | 53 | NO | NULL |
| 9 | ptraprepro | double precision | 53 | NO | NULL |
| 10 | ptrausado | character | 1 | NO | NULL |
| 11 | ptraincremento | numeric | 5 | NO | 1 |
| 12 | ptrahstusu | character varying | 10 | NO | NULL |
| 13 | ptrahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 14 | ptrasnproincr | character | 1 | NO | 'N'::bpchar |
| 15 | ptranumtra | numeric | 5 | YES | NULL |

### prefacext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pfeid | numeric | 5 | NO | NULL |
| 2 | pfefacextid | numeric | 5 | NO | NULL |
| 3 | pfeexpid | numeric | 5 | NO | NULL |
| 4 | pfesocid | numeric | 10 | NO | NULL |
| 5 | pfeprefijo | character | 2 | NO | NULL |
| 6 | pfehstusu | character varying | 10 | NO | NULL |
| 7 | pfehsthora | timestamp without time zone |  | NO | NULL |

### preimpreso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pimid | numeric | 5 | NO | NULL |
| 2 | pimdesc | character varying | 50 | NO | NULL |
| 3 | pimhstusu | character varying | 10 | NO | NULL |
| 4 | pimhsthora | timestamp without time zone |  | NO | NULL |

### premcobranza
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pczlimite | numeric | 12,2 | NO | NULL |
| 2 | pczdescri | character varying | 100 | NO | NULL |
| 3 | pczpremio | numeric | 12,2 | NO | NULL |

### premcobtmtr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | precsociedad | numeric | 10 | NO | NULL |
| 2 | precfijo | numeric | 10,2 | YES | NULL |
| 3 | precporcentaje | numeric | 5,2 | YES | NULL |

### presremesa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prmsocprsid | numeric | 10 | NO | NULL |
| 2 | prmofiid | numeric | 5 | NO | NULL |
| 3 | prmhstusu | character varying | 10 | NO | NULL |
| 4 | prmhsthora | timestamp without time zone |  | NO | NULL |
| 5 | prmsnremmigc19 | character | 1 | NO | 'N'::bpchar |
| 6 | prmsnremmigc1914 | character | 1 | NO | 'N'::bpchar |
| 7 | prmc1914mascfic | character varying | 35 | YES | NULL |

### prm13cntt
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | p13cid | numeric | 10 | NO | NULL |
| 2 | p13cpm13id | numeric | 10 | NO | NULL |
| 3 | p13ccnttnum | numeric | 10 | NO | NULL |
| 4 | p13csocprsid | numeric | 10 | YES | NULL |
| 5 | p13ccptoexpid | numeric | 5 | YES | NULL |
| 6 | p13ccptotconid | numeric | 5 | YES | NULL |
| 7 | p13ctsubid | numeric | 5 | YES | NULL |
| 8 | p13cexpid | numeric | 5 | YES | NULL |
| 9 | p13czonid | character | 3 | YES | NULL |
| 10 | p13ccalimm | numeric | 5 | YES | NULL |
| 11 | p13ccantidad | numeric | 10,3 | YES | NULL |
| 12 | p13cimporte | numeric | 18,2 | YES | NULL |
| 13 | p13cflecdesde | date |  | YES | NULL |
| 14 | p13cflechasta | date |  | YES | NULL |
| 15 | p13csnmed12 | character | 1 | NO | NULL |
| 16 | p13csnexcl | character | 1 | NO | NULL |

### prmes13
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pm13id | numeric | 10 | NO | NULL |
| 2 | pm13expid | numeric | 5 | NO | NULL |
| 3 | pm13estado | numeric | 5 | NO | NULL |
| 4 | pm13fhasta | date |  | NO | NULL |
| 5 | pm13descrip | character varying | 60 | NO | NULL |
| 6 | pm13variacion | numeric | 6,3 | YES | NULL |
| 7 | pm13hstusu | character varying | 10 | NO | NULL |
| 8 | pm13hsthora | timestamp without time zone |  | NO | NULL |

### prmes13zona
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | p13zpm13id | numeric | 10 | NO | NULL |
| 2 | p13zexpid | numeric | 5 | NO | NULL |
| 3 | p13zzonid | character | 3 | NO | NULL |
| 4 | p13zestado | numeric | 5 | NO | NULL |
| 5 | p13zresprocid | numeric | 10 | YES | NULL |

### procautorizgest
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | proautgesid | numeric | 5 | NO | NULL |
| 2 | proautgesidgestion | numeric | 5 | NO | NULL |
| 3 | proautgesorden | numeric | 5 | NO | NULL |
| 4 | proautgestxtid | numeric | 10 | NO | NULL |

### proccomcierre
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pccacoid | numeric | 10 | NO | NULL |
| 2 | pcccieid | numeric | 10 | NO | NULL |
| 3 | pccpcsid | numeric | 10 | NO | NULL |
| 4 | pccestado | numeric | 5 | YES | NULL |
| 5 | pccfeccom | timestamp without time zone |  | NO | NULL |

### proccontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pccid | numeric | 10 | NO | NULL |
| 2 | pccexpid | numeric | 5 | NO | NULL |
| 3 | pcctctcod | numeric | 10 | NO | NULL |
| 4 | pccptosid | numeric | 10 | NO | NULL |
| 5 | pccprssol | numeric | 10 | NO | NULL |
| 6 | pccvia | character | 2 | NO | NULL |
| 7 | pccfecsol | date |  | NO | NULL |
| 8 | pccvalidez | numeric | 5 | NO | NULL |
| 9 | pccperiid | numeric | 5 | NO | NULL |
| 10 | pcctclicod | character | 1 | NO | NULL |
| 11 | pccestado | numeric | 5 | NO | NULL |
| 12 | pccpaso | numeric | 5 | NO | NULL |
| 13 | pccpasosig | numeric | 5 | YES | NULL |
| 14 | pccordid | numeric | 10 | YES | NULL |
| 15 | pccopecob | numeric | 10 | YES | NULL |
| 16 | pccobsid | numeric | 10 | YES | NULL |
| 17 | pccpolvie | numeric | 10 | YES | NULL |
| 18 | pcccontvie | numeric | 10 | YES | NULL |
| 19 | pccmtbcid | numeric | 5 | YES | NULL |
| 20 | pccorglecbaj | numeric | 5 | YES | NULL |
| 21 | pccftobaja | numeric | 10 | YES | NULL |
| 22 | pccftopdte | numeric | 10 | YES | NULL |
| 23 | pccpolnue | numeric | 10 | YES | NULL |
| 24 | pcccontnue | numeric | 10 | YES | NULL |
| 25 | pccorgcont | numeric | 5 | YES | NULL |
| 26 | pccftoalta | numeric | 10 | YES | NULL |
| 27 | pccsolacometida | numeric | 10 | YES | NULL |
| 29 | pccasignado | character varying | 10 | YES | NULL |

### proccontraseguimasignado
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcsaid | numeric | 10 | NO | NULL |
| 2 | pcsaproccontraid | numeric | 10 | YES | NULL |
| 3 | pcsausuario | character varying | 10 | YES | NULL |
| 4 | pcsafechor | timestamp without time zone |  | YES | NULL |
| 5 | pcsaasignado | character varying | 10 | YES | NULL |

### procedfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prfid | numeric | 5 | NO | NULL |
| 2 | prfdescrip | character varying | 80 | NO | NULL |

### proceso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | procid | numeric | 5 | NO | NULL |
| 2 | procnametxtid | numeric | 10 | NO | NULL |
| 3 | procdesctxtid | numeric | 10 | NO | NULL |
| 4 | procvisible | character | 1 | YES | 'S'::bpchar |
| 5 | procelimperiodica | character | 1 | YES | 'S'::bpchar |
| 6 | procsolodetalle | character | 1 | NO | 'N'::bpchar |

### procesoauto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prcaid | numeric | 10 | NO | NULL |
| 2 | prcaexpid | numeric | 5 | NO | NULL |
| 3 | prcazonid | character | 3 | NO | NULL |
| 4 | prcaanno | numeric | 5 | NO | NULL |
| 5 | prcaperiid | numeric | 5 | NO | NULL |
| 6 | prcapernum | numeric | 5 | NO | NULL |
| 7 | prcalibcod | numeric | 5 | YES | NULL |
| 8 | prcaftoid | numeric | 10 | YES | NULL |
| 9 | prcatippro | numeric | 5 | NO | NULL |
| 10 | prcafecprev | date |  | NO | NULL |
| 11 | prcafeclanz | date |  | YES | NULL |
| 12 | prcatcnid | numeric | 10 | YES | NULL |
| 13 | prcaestado | numeric | 5 | NO | NULL |
| 14 | prcamotanu | numeric | 5 | YES | NULL |
| 15 | prcafeccrea | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### procgen952
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pg952id | numeric | 10 | NO | NULL |
| 2 | pg952fecjejec | timestamp without time zone |  | NO | NULL |
| 3 | pg952estado | numeric | 5 | NO | NULL |
| 4 | pg952socemiid | numeric | 10 | NO | NULL |
| 5 | pg952numdec | numeric | 13 | YES | NULL |
| 6 | pg952codasnt | character varying | 15 | YES | NULL |
| 7 | pg952anyo | numeric | 5 | YES | NULL |
| 8 | pg952mes | numeric | 5 | YES | NULL |
| 9 | pg952pers | character varying | 40 | YES | NULL |
| 10 | pg952telf | numeric | 9 | YES | NULL |

### procgenfacrec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pgfrid | numeric | 10 | NO | NULL |
| 2 | pgfrfecjejec | timestamp without time zone |  | NO | NULL |
| 3 | pgfrestado | numeric | 5 | NO | NULL |
| 4 | pgfrsocemiid | numeric | 10 | NO | NULL |
| 5 | pgfrexpid | numeric | 5 | YES | NULL |
| 6 | pgfrfecjvtodesde | timestamp without time zone |  | NO | NULL |
| 7 | pgfrfecjvtohasta | timestamp without time zone |  | NO | NULL |
| 8 | pgfrimpmincons | numeric | 18,2 | NO | NULL |
| 9 | pgfrnumfactotal | numeric | 5 | NO | NULL |
| 10 | pgfrimptotal | numeric | 18,2 | NO | NULL |
| 11 | pgfrid952 | numeric | 10 | YES | NULL |

### procgeslot
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pglid | numeric | 10 | NO | NULL |
| 2 | pglestado | numeric | 5 | NO | NULL |
| 3 | pgllotvacio | bytea |  | NO | NULL |
| 4 | pgldatospda | bytea |  | YES | NULL |
| 5 | pgllistado | bytea |  | YES | NULL |
| 6 | pglhojaruta | bytea |  | YES | NULL |
| 7 | pglfeccrea | timestamp without time zone |  | NO | NULL |
| 8 | pglfecasig | timestamp without time zone |  | YES | NULL |
| 9 | pglfecdesc | timestamp without time zone |  | YES | NULL |
| 10 | pgllotproc | bytea |  | YES | NULL |
| 11 | pglfecproc | timestamp without time zone |  | YES | NULL |
| 12 | pglpqcctracod | numeric | 5 | YES | NULL |
| 13 | pglpqcpaqnom | character varying | 10 | YES | NULL::character varying |
| 14 | pgllotcod | character | 12 | NO | NULL |
| 15 | pglesrepgen | character | 1 | NO | 'N'::bpchar |

### procomdesg
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcdpcsid | numeric | 10 | NO | NULL |
| 2 | pcdopdid | numeric | 10 | NO | NULL |

### procomusal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcsid | numeric | 10 | NO | NULL |
| 2 | pcsdesc | character varying | 100 | NO | NULL |
| 3 | pcstcmid | numeric | 5 | NO | NULL |
| 4 | pcsorigen | numeric | 5 | NO | NULL |
| 5 | pcsestado | numeric | 5 | NO | NULL |
| 6 | pcsusuario | character | 10 | NO | NULL |
| 7 | pcsfeccrea | timestamp without time zone |  | NO | NULL |
| 8 | pcsresumen | bytea |  | YES | NULL |
| 9 | pcspaquete | numeric | 10 | YES | NULL |
| 10 | pcsexpid | numeric | 5 | NO | NULL |
| 11 | pcsfmeid | numeric | 5 | YES | NULL |
| 12 | pcsftoid | numeric | 10 | YES | NULL |
| 13 | pcspocid | numeric | 10 | YES | NULL |
| 14 | pcsofiid | numeric | 5 | YES | NULL |

### procomusalxml
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pcsxid | numeric | 10 | NO | NULL |
| 2 | pcsxxml | bytea |  | NO | NULL |
| 3 | pcsxfecsal | date |  | YES | NULL |

### procremabo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | praid | numeric | 10 | NO | NULL |
| 2 | praexpid | numeric | 5 | NO | NULL |
| 3 | pratiporem | character | 1 | NO | NULL |
| 4 | prahoracrea | timestamp without time zone |  | NO | NULL |
| 5 | prausuario | character | 10 | NO | NULL |
| 6 | praimporte | numeric | 18,2 | YES | NULL |
| 7 | pracliid | numeric | 10 | YES | NULL |
| 8 | pranlistcontr | text |  | YES | NULL |
| 9 | praocgid | numeric | 10 | YES | NULL |
| 10 | prahorafin | timestamp without time zone |  | YES | NULL |
| 11 | praresid | numeric | 10 | YES | NULL |
| 12 | prahoraval | timestamp without time zone |  | YES | NULL |
| 13 | prausuval | character | 10 | YES | NULL |
| 14 | prahoraeditran | timestamp without time zone |  | YES | NULL |
| 15 | prausueditran | character | 10 | YES | NULL |
| 16 | prahorafichero | timestamp without time zone |  | YES | NULL |
| 17 | prausufichero | character | 10 | YES | NULL |
| 18 | praidrelval | numeric | 10 | YES | NULL |

### procsolaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | psaid | numeric | 10 | NO | NULL |
| 2 | psatipo | numeric | 5 | NO | NULL |
| 3 | psaruta | character varying | 150 | NO | NULL |
| 4 | psanomfich | character varying | 23 | NO | NULL |
| 5 | psafecproc | timestamp without time zone |  | NO | NULL |
| 6 | psausuproc | character | 10 | NO | NULL |
| 7 | psafecacept | timestamp without time zone |  | YES | NULL |
| 8 | psausuacept | character | 10 | YES | NULL |
| 9 | psaclaseproc | numeric | 5 | NO | 1 |

### producto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prdid | numeric | 5 | NO | NULL |
| 2 | prddescid | numeric | 10 | NO | NULL |

### propaplic
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prpacodigo | numeric | 5 | NO | NULL |
| 2 | prpatxtid | numeric | 10 | NO | NULL |
| 3 | prpavalor | character varying | 20 | NO | NULL |

### propfpago
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pfpexpid | numeric | 5 | NO | NULL |
| 2 | pfppropid | numeric | 10 | NO | NULL |
| 3 | pfpfmpcanal | character | 1 | NO | NULL |
| 4 | pfpfmpid | numeric | 5 | NO | NULL |

### proptipges
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ptgexpid | numeric | 5 | NO | NULL |
| 2 | ptgpropid | numeric | 10 | NO | NULL |
| 3 | ptggsctipo | numeric | 5 | NO | NULL |

### prorrat
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | expid | numeric | 5 | NO | NULL |
| 2 | anno | numeric | 5 | NO | NULL |
| 3 | periodo | numeric | 5 | NO | NULL |
| 4 | zonid | character | 3 | NO | NULL |
| 5 | polnum | numeric | 10 | NO | NULL |
| 6 | aplicarprorrateo | numeric | 5 | YES | NULL |
| 7 | importeprorrateo | numeric | 18,2 | YES | NULL |

### prorrat_desglose
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | expid | numeric | 5 | NO | NULL |
| 2 | anno | numeric | 5 | NO | NULL |
| 3 | periodo | numeric | 5 | NO | NULL |
| 4 | zonid | character | 3 | NO | NULL |
| 5 | polnum | numeric | 10 | NO | NULL |
| 6 | periodo_prorrateo | numeric | 5 | NO | NULL |
| 7 | anno_prorrateo | numeric | 5 | NO | NULL |
| 8 | lectura | numeric | 5 | YES | NULL |
| 9 | consumo | numeric | 5 | YES | NULL |
| 10 | lecturainicial | numeric | 5 | YES | NULL |
| 11 | consumoinicial | numeric | 5 | YES | NULL |
| 12 | lecturafinal | numeric | 5 | YES | NULL |
| 13 | consumofinal | character varying |  | YES | NULL |
| 14 | lecturasumarizada | numeric | 5 | YES | NULL |
| 15 | consumosumarizado | numeric | 5 | YES | NULL |
| 16 | importe_agua_facturado | numeric | 18,2 | YES | NULL |
| 17 | importe_alcantarillado_facturado | numeric | 18,2 | YES | NULL |
| 18 | importe_saneamiento_facturado | numeric | 18,2 | YES | NULL |
| 19 | importe_agua_prorrateo | numeric | 18,2 | YES | NULL |
| 20 | importe_alcantarillado_prorrateo | numeric | 18,2 | YES | NULL |
| 21 | importe_saneamiento_prorrateo | numeric | 18,2 | YES | NULL |
| 22 | importe_diferencia_agua | numeric | 18,2 | YES | NULL |
| 23 | importe_diferencia_alcantarillado | numeric | 18,2 | YES | NULL |
| 24 | importe_diferencia_saneamiento | numeric | 18,2 | YES | NULL |
| 25 | consumo_a_cobrar | numeric | 18,2 | YES | NULL |
| 26 | consecutivo | numeric | 5 | YES | NULL |
| 27 | ttarid | numeric | 5 | YES | NULL |
| 28 | pocid | numeric | 10 | YES | NULL |
| 29 | importe_agua_corrector | numeric | 18,2 | YES | NULL |
| 30 | facid | numeric | 10 | YES | NULL |
| 31 | unidadesservidas | numeric | 5 | YES | NULL |
| 32 | importe_agua_corrector_aplicar_en_el_ciclo | numeric | 18,2 | YES | NULL |
| 33 | prorrateable | character | 1 | YES | NULL |
| 34 | nota | character | 15 | YES | NULL |
| 35 | saldobolsaest | numeric | 10 | YES | NULL |

### prorrat_plazos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | expid | numeric | 5 | NO | NULL |
| 2 | anno | numeric | 5 | NO | NULL |
| 3 | periodo | numeric | 5 | NO | NULL |
| 4 | zonid | character | 3 | NO | NULL |
| 5 | polnum | numeric | 10 | NO | NULL |
| 6 | aplicarprorrateo | numeric | 5 | YES | NULL |
| 7 | aplicadoprorrateo | numeric | 5 | YES | NULL |
| 8 | importeprorrateo | numeric | 18,2 | YES | NULL |

### provincia
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | proid | numeric | 5 | NO | NULL |
| 2 | pronombre | character varying | 30 | NO | NULL |
| 3 | procomid | numeric | 5 | NO | NULL |
| 4 | proindblk | numeric | 5 | NO | NULL |

### prsfianzas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pfiaid | numeric | 10 | NO | NULL |
| 2 | pfiaprcdid | numeric | 5 | NO | NULL |
| 3 | pfiafeccre | timestamp without time zone |  | NO | NULL |
| 4 | pfiaasnid | numeric | 10 | YES | NULL |

### prsfiapol
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pfpfiaid | numeric | 10 | NO | NULL |
| 2 | pfppolnum | numeric | 10 | NO | NULL |
| 3 | pfpimporte | numeric | 18,2 | NO | NULL |

### prsrecdestmp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prdestpoliza | numeric | 10 | NO | NULL |
| 2 | prdestsocprop | numeric | 10 | NO | NULL |
| 3 | prdestimporte | numeric | 18,2 | NO | NULL |
| 4 | prdestciclos | numeric | 5 | NO | NULL |

### prsrectmp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prtpoliza | numeric | 10 | NO | NULL |
| 2 | prtminfecf | date |  | NO | NULL |
| 3 | prtimporte | numeric | 18,2 | NO | NULL |
| 4 | prtciclos | numeric | 5 | NO | NULL |
| 5 | prtcicloscorte | numeric | 5 | NO | NULL |
| 6 | prttipproc | numeric | 5 | YES | NULL |
| 7 | prtproceso | numeric | 10 | YES | NULL |
| 8 | prtmotivo | numeric | 5 | YES | NULL |
| 9 | prtcodreco | numeric | 14 | YES | NULL |
| 10 | prtcicloslecturas | numeric | 5 | NO | 0 |

### ptosbajlec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pbllotcod | character | 12 | NO | NULL |
| 2 | pblptosid | numeric | 10 | NO | NULL |
| 3 | pblcontcod | numeric | 5 | YES | NULL |
| 4 | pbloperid | numeric | 5 | YES | NULL |
| 5 | pblptocodr | numeric | 14 | NO | NULL |
| 6 | pblcoment | character varying | 160 | YES | NULL |
| 7 | pblfeclec | timestamp without time zone |  | YES | NULL |

### ptoscoment
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ptcptosid | numeric | 10 | NO | NULL |
| 2 | ptcfecha | timestamp without time zone |  | NO | NULL |
| 3 | ptccontcod | numeric | 5 | NO | NULL |
| 4 | ptcoperid | numeric | 5 | NO | NULL |
| 5 | ptccoment | character varying | 160 | NO | NULL |
| 6 | ptcestado | numeric | 5 | YES | 0 |
| 7 | ptcexpid | numeric | 5 | YES | NULL |
| 8 | ptcacccod | character | 2 | YES | NULL |
| 9 | ptcobscod | character | 2 | YES | NULL |
| 10 | ptctiplote | character | 1 | YES | NULL |
| 11 | ptcsntelelec | character | 1 | YES | NULL |
| 12 | ptcposicion | character | 1 | YES | 'N'::bpchar |
| 13 | ptcptosrefid | numeric | 10 | YES | NULL |
| 14 | ptcpocid | numeric | 10 | YES | NULL |

### ptoserclau
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pscptosid | numeric | 10 | NO | NULL |
| 2 | pscclauid | numeric | 5 | NO | NULL |
| 3 | pscsesalt | numeric | 10 | NO | NULL |
| 4 | pscsesbaj | numeric | 10 | YES | NULL |
| 5 | pschstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | pschsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### ptoserv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ptosid | numeric | 10 | NO | NULL |
| 2 | ptosdirid | numeric | 10 | NO | NULL |
| 3 | ptostetid | numeric | 5 | NO | NULL |
| 4 | ptosexpid | numeric | 5 | NO | NULL |
| 5 | ptoszonid | character | 3 | YES | NULL |
| 6 | ptoslibcod | numeric | 5 | YES | NULL |
| 7 | ptosemplid | character | 2 | NO | NULL |
| 8 | ptoscodrec | numeric | 14 | YES | NULL |
| 9 | ptostipsum | numeric | 5 | NO | NULL |
| 10 | ptosobserv | character | 80 | YES | NULL |
| 11 | ptosestado | numeric | 5 | NO | NULL |
| 12 | ptosfsucod | numeric | 5 | YES | NULL |
| 13 | ptosservid | numeric | 10 | NO | NULL |
| 14 | ptosfilbat | numeric | 5 | NO | NULL |
| 15 | ptoscolbat | numeric | 5 | NO | NULL |
| 16 | ptosobsid | numeric | 10 | YES | NULL |
| 17 | ptosconcom | character | 1 | NO | NULL |
| 18 | ptocortpos | character | 1 | NO | NULL |
| 19 | ptopccid | numeric | 10 | YES | NULL |
| 20 | ptosllaves | numeric | 5 | YES | NULL |
| 21 | ptostpsid | numeric | 5 | YES | NULL |
| 22 | ptosndesha | character | 1 | NO | 'N'::bpchar |
| 23 | ptosnbocas | numeric | 5 | YES | NULL |
| 24 | ptosnmang | numeric | 5 | YES | NULL |
| 25 | ptosfeccorte | date |  | YES | NULL |
| 26 | ptosaltcalimm | numeric | 5 | YES | NULL |
| 27 | ptosmtbcid | numeric | 5 | YES | NULL |
| 28 | ptoslic2aocup | character varying | 20 | YES | NULL |
| 29 | ptosflic2aocup | date |  | YES | NULL |
| 30 | ptosrefcat | character varying | 30 | YES | NULL |
| 31 | ptossncortdeud | character | 1 | NO | 'N'::bpchar |
| 32 | ptossncortprov | character | 1 | NO | 'N'::bpchar |
| 33 | ptossncortman | character | 1 | NO | 'N'::bpchar |
| 34 | ptoscalcontra1 | numeric | 5 | YES | NULL |
| 35 | ptoscalcontra2 | numeric | 5 | YES | NULL |
| 36 | ptoshstusu | character varying | 10 | NO | NULL |
| 37 | ptoshsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 38 | ptosfecreac | date |  | YES | NULL |
| 39 | ptosnoinsemisor | character | 1 | YES | NULL |
| 40 | ptosnnoaccess | character | 1 | NO | 'N'::bpchar |
| 41 | ptosnmalest | character | 1 | NO | 'N'::bpchar |
| 42 | ptosvalvret | character | 1 | YES | NULL |
| 43 | ptossncontrat | character | 1 | NO | 'S'::bpchar |
| 44 | ptosmotcont | numeric | 5 | YES | NULL |
| 45 | ptosposfraude | character | 1 | NO | 'N'::bpchar |
| 46 | ptosestrategico | character | 1 | NO | 'N'::bpchar |
| 47 | ptosfecfoto | date |  | YES | NULL |
| 48 | ptosnconivel | numeric | 5 | YES | NULL |
| 49 | ptossnprovisoria | character | 1 | YES | NULL |
| 50 | ptosllavecerrada | character | 1 | NO | 'N'::bpchar |
| 51 | ptossnnoleerprl | character | 1 | NO | 'N'::bpchar |
| 52 | ptoscompunt | character | 80 | YES | NULL |
| 53 | ptoscompuntfini | date |  | YES | NULL |
| 54 | ptoscompuntffin | date |  | YES | NULL |
| 55 | ptosnivcrit | numeric | 5 | YES | NULL |

### ptoservdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | psdptosid | numeric | 10 | NO | NULL |
| 2 | psddconid | numeric | 10 | NO | NULL |
| 3 | psdhstusu | character varying | 10 | NO | NULL |
| 4 | psdhsthora | timestamp without time zone |  | NO | NULL |

### ptoservsecun
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pssptosid | numeric | 10 | NO | NULL |
| 2 | pssrpsid | numeric | 10 | NO | NULL |
| 3 | psscoefrep | numeric | 6,3 | YES | NULL |
| 4 | pssfecini | timestamp without time zone |  | NO | NULL |
| 5 | pssfecfin | timestamp without time zone |  | YES | NULL |
| 6 | psssnrecibir | character | 1 | NO | 'S'::bpchar |
| 7 | psshstusu | character varying | 10 | NO | NULL |
| 8 | psshsthora | timestamp without time zone |  | NO | NULL |
| 9 | pssnumrel | numeric | 5 | NO | 1 |
| 10 | psstipovariableps | numeric | 5 | YES | NULL |

### publiconc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pubid | numeric | 5 | NO | NULL |
| 2 | pubadjid | numeric | 5 | NO | NULL |
| 3 | pubcptoid | numeric | 5 | NO | NULL |
| 4 | pubtexto | character varying | 50 | NO | NULL |
| 5 | pubfecha | date |  | NO | NULL |
| 6 | pubbptid | numeric | 5 | YES | NULL |
| 7 | pubhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 8 | pubhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### qaccionqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qaqid | numeric | 10 | NO | NULL |
| 2 | qaqqejid | numeric | 10 | NO | NULL |
| 3 | qaqtacid | numeric | 5 | NO | NULL |
| 4 | qaqfecha | date |  | NO | NULL |
| 5 | qaqestado | numeric | 5 | NO | NULL |
| 6 | qaqobserv | numeric | 10 | YES | NULL |
| 7 | qaqexpid | numeric | 5 | YES | NULL |
| 8 | qaqaexpid | numeric | 5 | YES | NULL |
| 9 | qaqareaid | numeric | 5 | YES | NULL |
| 10 | qaqdexpid | numeric | 5 | YES | NULL |
| 11 | qaqdareaid | numeric | 5 | YES | NULL |
| 12 | qaqdptid | numeric | 5 | YES | NULL |
| 13 | qaqusuario | character varying | 10 | YES | NULL |
| 14 | qaqviaresp | character | 2 | YES | NULL |
| 15 | qaqmtaid | numeric | 5 | YES | NULL |
| 16 | qaqmtreid | numeric | 5 | YES | NULL |
| 17 | qaqsesid | numeric | 10 | NO | NULL |
| 18 | qaqhora | timestamp without time zone |  | NO | NULL |

### qareadpto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exdexpid | numeric | 5 | NO | NULL |
| 2 | exdadareaid | numeric | 5 | NO | NULL |
| 3 | exddptid | numeric | 5 | NO | NULL |
| 4 | exdsnotrosmen | character | 1 | NO | NULL |
| 5 | exdhstusu | character varying | 10 | NO | NULL |
| 6 | exdhsthora | timestamp without time zone |  | NO | NULL |
| 7 | exdsnavisreinc | character | 1 | NO | 'N'::bpchar |
| 8 | exdsnaviordnoan | character | 1 | NO | 'N'::bpchar |

### qcumplcldad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cccexpid | numeric | 5 | NO | NULL |
| 2 | cccmtrid | numeric | 5 | NO | NULL |
| 3 | cccdpz1ares | numeric | 5 | NO | NULL |
| 4 | cccdpzresol | numeric | 5 | NO | NULL |
| 5 | cccdav1ares | numeric | 5 | NO | NULL |
| 6 | cccdavresol | numeric | 5 | NO | NULL |
| 7 | cccimpsuppz | numeric | 9,2 | NO | NULL |
| 8 | ccctrgid | numeric | 5 | NO | NULL |
| 9 | ccchstusu | character varying | 10 | NO | ''::character varying |
| 10 | ccchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### qexploarea
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | exaexpid | numeric | 5 | NO | NULL |
| 2 | exaadareaid | numeric | 5 | NO | NULL |
| 3 | exahstusu | character varying | 10 | NO | NULL |
| 4 | exahsthora | timestamp without time zone |  | NO | NULL |

### qfacturaqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qfqqejid | numeric | 10 | NO | NULL |
| 2 | qfqfacid | numeric | 10 | NO | NULL |
| 3 | qfqsesid | numeric | 10 | NO | NULL |
| 4 | qfqhora | timestamp without time zone |  | NO | NULL |

### qmedcorr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mcrid | numeric | 5 | NO | NULL |
| 2 | mcrdescrip | numeric | 10 | NO | NULL |
| 3 | mcrhstusu | character varying | 10 | NO | NULL |
| 4 | mcrhsthora | timestamp without time zone |  | NO | NULL |

### qmedidaqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qmqqejid | numeric | 10 | NO | NULL |
| 2 | qmqmcrid | numeric | 5 | NO | NULL |
| 3 | qmqfecha | date |  | NO | NULL |
| 4 | qmqsesid | numeric | 10 | NO | NULL |
| 5 | qmqhora | timestamp without time zone |  | NO | NULL |

### qmensaje
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qmsid | numeric | 10 | NO | NULL |
| 2 | qmsusuorg | character varying | 10 | NO | NULL |
| 3 | qmsfcrea | timestamp without time zone |  | NO | NULL |
| 4 | qmsusudest | character varying | 10 | NO | NULL |
| 5 | qmsexpid | numeric | 5 | NO | NULL |
| 6 | qmsqejid | numeric | 10 | YES | NULL |
| 7 | qmsctcid | numeric | 10 | YES | NULL |
| 8 | qmsmensaje | character varying | 500 | NO | NULL |
| 9 | qmsorigen | character varying | 50 | YES | NULL |
| 10 | qmssnenviado | character | 1 | NO | NULL |
| 11 | qmscnttnum | numeric | 10 | YES | NULL |
| 12 | qmsusulec | character varying | 10 | YES | NULL |
| 13 | qmsexsid | numeric | 10 | YES | NULL |

### qmotanula
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtaid | numeric | 5 | NO | NULL |
| 2 | mtadescrip | numeric | 10 | NO | NULL |

### qmotrechazo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtreid | numeric | 5 | NO | NULL |
| 2 | mtredescrip | numeric | 10 | NO | NULL |

### qmotreclam
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtrid | numeric | 5 | NO | NULL |
| 2 | mtrdescrip | numeric | 10 | NO | NULL |
| 3 | mtrsncreaord | character | 1 | NO | NULL |
| 4 | mtrhstusu | character varying | 10 | NO | NULL |
| 5 | mtrhsthora | timestamp without time zone |  | NO | NULL |
| 6 | mtrsnactivo | character | 1 | NO | 'S'::bpchar |
| 7 | mtrtipo | numeric | 5 | NO | 1 |

### qmtreapertura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | mtrid | numeric | 5 | NO | NULL |
| 2 | mtrtxtid | numeric | 10 | NO | NULL |

### qordenqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qoqqejid | numeric | 10 | NO | NULL |
| 2 | qoqordid | numeric | 10 | NO | NULL |
| 3 | qoqsesid | numeric | 10 | NO | NULL |
| 4 | qoqhora | timestamp without time zone |  | NO | NULL |

### qqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qejid | numeric | 10 | NO | NULL |
| 2 | qejexpid | numeric | 5 | NO | NULL |
| 3 | qejmotini | numeric | 5 | NO | NULL |
| 4 | qejmotfin | numeric | 5 | YES | NULL |
| 5 | qejtipolog | numeric | 5 | YES | NULL |
| 6 | qejvia | character | 2 | NO | NULL |
| 7 | qejcliid | numeric | 10 | YES | NULL |
| 8 | qejpercto | numeric | 10 | NO | NULL |
| 9 | qejcnttnum | numeric | 10 | YES | NULL |
| 10 | qejestado | numeric | 5 | NO | NULL |
| 11 | qejppal | numeric | 10 | YES | NULL |
| 12 | qejsncdif | character | 1 | NO | NULL |
| 13 | qejdescrip | character varying | 200 | YES | NULL |
| 14 | qejtxtcom | character varying | 1200 | YES | NULL |
| 15 | qejtxt1res | character varying | 1200 | YES | NULL |
| 16 | qejfecha | date |  | NO | NULL |
| 17 | qejsesid | numeric | 10 | NO | NULL |
| 18 | qejhora | timestamp without time zone |  | NO | NULL |
| 19 | qejtncid | numeric | 5 | YES | NULL |
| 20 | qejaccor | character varying | 20 | YES | NULL |
| 21 | qejsnrev | character | 1 | NO | 'N'::bpchar |
| 22 | qejsnind | character | 1 | NO | 'N'::bpchar |
| 23 | qejcprsid | numeric | 10 | YES | NULL |
| 24 | qejcnumdir | numeric | 5 | YES | NULL |
| 25 | qejinfdanyos | character | 1 | NO | 'N'::bpchar |
| 26 | qejimpdanyos | numeric | 18,2 | YES | NULL |
| 27 | qejsnprcdnte | character | 1 | NO | 'S'::bpchar |
| 28 | qejmotreap | numeric | 5 | YES | NULL |
| 29 | qejasignado | character varying | 10 | YES | NULL |
| 30 | qejpcsid | numeric | 10 | YES | NULL |

### qquejaseguimasignado
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qesaid | numeric | 10 | NO | NULL |
| 2 | qesaqejid | numeric | 10 | YES | NULL |
| 3 | qesausuario | character varying | 10 | YES | NULL |
| 4 | qesafechor | timestamp without time zone |  | YES | NULL |
| 5 | qesaasignado | character varying | 10 | YES | NULL |

### qrelacionqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qrqqejidppal | numeric | 10 | NO | NULL |
| 2 | qrqqejidrel | numeric | 10 | NO | NULL |
| 3 | qrqsesid | numeric | 10 | NO | NULL |
| 4 | qrqhora | timestamp without time zone |  | NO | NULL |

### qtipoaccion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tacid | numeric | 5 | NO | NULL |
| 2 | tacdescrip | numeric | 10 | NO | NULL |
| 3 | tacsnimpfor | character | 1 | NO | NULL |
| 4 | tacsnvispant | character | 1 | NO | NULL |
| 5 | tacentsal | character | 1 | YES | NULL |
| 6 | tacvia | character | 2 | YES | NULL |

### qtpalarma
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpaid | numeric | 5 | NO | NULL |
| 2 | tpatxtid | numeric | 10 | NO | NULL |

### qtplgrecl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tplid | numeric | 5 | NO | NULL |
| 2 | tpldescrip | numeric | 10 | NO | NULL |
| 3 | tplmtrid | numeric | 5 | NO | NULL |
| 4 | tplhstusu | character varying | 10 | NO | NULL |
| 5 | tplhsthora | timestamp without time zone |  | NO | NULL |
| 6 | tplsnactivo | character | 1 | NO | 'S'::bpchar |
| 7 | tplrcuid | numeric | 5 | NO | 0 |
| 8 | tplsnrfactura | character | 1 | NO | 'N'::bpchar |
| 9 | tplsnrdanyos | character | 1 | NO | 'N'::bpchar |
| 10 | tplsnreapertura | character | 1 | NO | 'N'::bpchar |
| 11 | tpldiasplazo | numeric | 5 | YES | NULL |

### qtpnoconfor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tncid | numeric | 5 | NO | NULL |
| 2 | tnctxtid | numeric | 10 | NO | NULL |

### qtranfdfto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | tpdexpid | numeric | 5 | NO | NULL |
| 2 | tpdmtrid | numeric | 5 | NO | NULL |
| 3 | tpdadareaid | numeric | 5 | YES | NULL |
| 4 | tpddptid | numeric | 5 | YES | NULL |
| 5 | tpdhstusu | character varying | 10 | NO | NULL |
| 6 | tpdhsthora | timestamp without time zone |  | NO | NULL |

### qtxtcomunica
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | txcexpid | numeric | 5 | NO | NULL |
| 2 | txctxtlibre | numeric | 10 | NO | NULL |
| 3 | txctctid | numeric | 5 | NO | NULL |
| 4 | txcmtcid | numeric | 5 | NO | NULL |
| 5 | txchstusu | character varying | 10 | NO | NULL |
| 6 | txchsthora | timestamp without time zone |  | NO | NULL |

### quejas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | quejid | character varying | 15 | NO | NULL |
| 2 | quejpolnum | numeric | 10 | YES | NULL |
| 3 | quejestado | numeric | 5 | NO | NULL |
| 4 | quejtipo | numeric | 5 | YES | NULL |
| 5 | quejsubtip | numeric | 5 | YES | NULL |
| 6 | quejcausa | numeric | 5 | YES | NULL |
| 7 | quejfecha | date |  | YES | NULL |
| 8 | quejfecfin | date |  | YES | NULL |
| 9 | quejfecres | date |  | YES | NULL |
| 10 | quejobserv | character varying | 35 | YES | NULL |
| 11 | quejgestor | character varying | 35 | YES | NULL |

### qusuarea
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | usaexpid | numeric | 5 | NO | NULL |
| 2 | usaadareaid | numeric | 5 | NO | NULL |
| 3 | usausuid | character varying | 10 | NO | NULL |
| 4 | usasnresp | character | 1 | NO | NULL |
| 5 | usaorden | numeric | 5 | NO | NULL |
| 6 | usasnenvc | character | 1 | NO | 'N'::bpchar |
| 7 | usasnenvm | character | 1 | NO | 'N'::bpchar |

### qusudpto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | usdexpid | numeric | 5 | NO | NULL |
| 2 | usdadareaid | numeric | 5 | NO | NULL |
| 3 | usddptid | numeric | 5 | NO | NULL |
| 4 | usdusuid | character varying | 10 | NO | NULL |
| 5 | usdsnresp | character | 1 | NO | NULL |
| 6 | usdorden | numeric | 5 | NO | NULL |
| 7 | usdsnenvc | character | 1 | NO | 'N'::bpchar |
| 8 | usdsnenvm | character | 1 | NO | 'N'::bpchar |

### qusuexp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | useexpid | numeric | 5 | NO | NULL |
| 2 | useusuid | character varying | 10 | NO | NULL |
| 3 | usesnresp | character | 1 | NO | NULL |
| 4 | useorden | numeric | 5 | NO | NULL |
| 5 | usesnenvc | character | 1 | NO | 'N'::bpchar |
| 6 | usesnenvm | character | 1 | NO | 'N'::bpchar |

### rangonumfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rnfacexpid | numeric | 5 | NO | NULL |
| 2 | rnfacsocemi | numeric | 10 | NO | NULL |
| 3 | rnfacsrfcod | character | 1 | NO | NULL |
| 4 | rnfacanno | numeric | 5 | NO | NULL |
| 5 | rnfacnumdesde | numeric | 10 | NO | NULL |
| 6 | rnfacnumhasta | numeric | 10 | NO | NULL |
| 7 | rnfacannoap | numeric | 5 | NO | NULL |
| 8 | rnfacnumap | character varying | 12 | NO | NULL |
| 9 | rnfachstusu | character varying | 10 | NO | NULL |
| 10 | rnfachsthora | timestamp without time zone |  | NO | NULL |

### rdeudasif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rdssusid | numeric | 10 | NO | NULL |
| 2 | rdsrecibos | numeric | 5 | NO | NULL |
| 3 | rdsdeuda | numeric | 18,2 | NO | NULL |
| 4 | rdsm3estim | numeric | 5 | NO | NULL |
| 5 | rdscuotas | numeric | 5 | NO | NULL |
| 6 | rdsfactura | numeric | 18,2 | NO | NULL |
| 7 | rdscmppago | numeric | 10 | YES | NULL |

### recargo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rcgid | numeric | 10 | NO | NULL |
| 2 | rcgfacid | numeric | 10 | NO | NULL |
| 3 | rcggesid | numeric | 10 | NO | NULL |
| 4 | rcgpctrec | numeric | 6,2 | NO | NULL |
| 5 | rcgimporte | numeric | 18,2 | NO | NULL |
| 6 | rcgestado | numeric | 5 | NO | NULL |
| 7 | rcgsnintdem | character | 1 | NO | NULL |
| 8 | rcghstusu | character varying | 10 | NO | NULL |
| 9 | rcghsthora | timestamp without time zone |  | NO | NULL |
| 10 | rcgasnid | numeric | 10 | YES | NULL |
| 11 | rcgocgid | numeric | 10 | YES | NULL |

### refacturacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rftoid | numeric | 10 | NO | NULL |
| 2 | rftoaboid | numeric | 10 | NO | NULL |
| 3 | rftousuabo | character | 10 | NO | NULL |
| 4 | rftofecabo | timestamp without time zone |  | NO | NULL |
| 5 | rftorefid | numeric | 10 | YES | NULL |
| 6 | rftousuref | character | 10 | YES | NULL |
| 7 | rftofecref | timestamp without time zone |  | YES | NULL |
| 8 | rftincmsgrefac | character | 1 | NO | 'N'::bpchar |

### referencia
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | refid | numeric | 10 | NO | NULL |
| 2 | refnumfac | character varying | 18 | YES | NULL |
| 3 | refpolnum | numeric | 10 | YES | NULL |
| 4 | refgesid | numeric | 10 | YES | NULL |
| 5 | refocgid | numeric | 10 | YES | NULL |
| 6 | reffcrea | date |  | NO | NULL |
| 7 | refimporte | numeric | 18,2 | NO | NULL |
| 8 | refmccid | numeric | 10 | YES | NULL |
| 9 | reffeclimitec | date |  | YES | NULL |
| 10 | refmcciddev | numeric | 10 | YES | NULL |
| 11 | refdcfaid | numeric | 10 | YES | NULL |
| 12 | refdcpid | numeric | 10 | YES | NULL |
| 13 | refocdev | numeric | 10 | YES | NULL |
| 15 | refformato | numeric | 5 | NO | 57 |
| 16 | reffecinivol | date |  | YES | NULL |
| 17 | refreferencia | character varying | 25 | YES | NULL |
| 18 | refrafaga | character varying | 46 | YES | NULL |
| 19 | refsocprsid | numeric | 10 | YES | NULL |
| 20 | refsnblosalban | character | 1 | NO | 'N'::bpchar |
| 21 | refcomban | numeric | 18,2 | YES | 0 |
| 22 | refsnfactura | character varying | 1 | NO | 'S'::character varying |
| 23 | refreldeuda | numeric | 10 | YES | NULL |

### referfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | reffrefid | numeric | 10 | NO | NULL |
| 2 | refffacid | numeric | 10 | NO | NULL |

### referplazo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | refprefid | numeric | 10 | NO | NULL |
| 2 | refpopdid | numeric | 10 | NO | NULL |

### refmsepa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | refmid | numeric | 10 | NO | NULL |
| 2 | refmprefij | character | 2 | NO | NULL |
| 3 | refmref | character varying | 35 | NO | NULL |
| 4 | refmsnmigrada | character | 1 | NO | NULL |
| 5 | refmsocprsid | numeric | 10 | NO | NULL |
| 6 | refmexpid | numeric | 5 | NO | NULL |
| 7 | refmsencid | numeric | 10 | NO | NULL |
| 8 | refmfeccrea | date |  | NO | NULL |
| 9 | refmusucrea | character varying | 10 | NO | NULL |
| 10 | refmentidad | character | 1 | NO | NULL |
| 11 | refmcnttnum | numeric | 10 | YES | NULL |
| 12 | refmprsid | numeric | 10 | YES | NULL |
| 13 | refmfecfirma | date |  | YES | NULL |
| 14 | refmusufirma | character varying | 10 | YES | NULL |
| 15 | refmfeccancel | date |  | YES | NULL |
| 16 | refmusucancel | character varying | 10 | YES | NULL |
| 17 | refmfecultrem | date |  | YES | NULL |
| 18 | refmusuultrem | character varying | 10 | YES | NULL |
| 19 | refmsocrem | numeric | 10 | YES | NULL |
| 20 | refmbangest | numeric | 5 | YES | NULL |
| 21 | refmfecinfbanc | date |  | YES | NULL |
| 22 | refmsndocadj | character | 1 | NO | 'N'::bpchar |
| 23 | refmhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 24 | refmhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 25 | refmenvprsid | numeric | 10 | YES | NULL |
| 26 | refmenvnumdir | numeric | 5 | YES | NULL |

### refmsepaant
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | refmantid | numeric | 10 | NO | NULL |
| 2 | refmantref | character varying | 35 | NO | NULL |
| 3 | refantsocrem | numeric | 10 | NO | NULL |
| 4 | refantbangest | numeric | 5 | NO | NULL |
| 5 | refmantsencid | numeric | 10 | NO | NULL |
| 6 | refmantenv | character | 1 | NO | 'N'::bpchar |

### regcamdataytozgz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rcdnomfichero | character varying | 20 | NO | NULL |
| 2 | rcdcnttnum | numeric | 10 | NO | NULL |
| 3 | rcdtipoactual | numeric | 5 | NO | NULL |
| 4 | rcdprsid | numeric | 10 | NO | NULL |
| 5 | rcdfecfichero | date |  | NO | NULL |
| 6 | rcdvalahoaant | character varying | 80 | YES | NULL |
| 7 | rcdvalahomod | character varying | 80 | YES | NULL |
| 8 | rcdfecfallec | date |  | YES | NULL |
| 9 | rcddiridant | numeric | 10 | YES | NULL |
| 10 | rcddiridmod | numeric | 10 | YES | NULL |
| 11 | rcdnompersant | character varying | 30 | YES | NULL |
| 12 | rcdnompersmod | character varying | 30 | YES | NULL |
| 13 | rcdprapperant | character varying | 60 | YES | NULL |
| 14 | rcdprappermod | character varying | 60 | YES | NULL |
| 15 | rcdseapperant | character varying | 30 | YES | NULL |
| 16 | rcdseappermod | character varying | 30 | YES | NULL |
| 17 | rcdusuario | character varying | 10 | NO | NULL |
| 18 | rcdfecha | date |  | NO | NULL |

### regulapli
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rgargfid | numeric | 10 | NO | NULL |
| 2 | rgafacid | numeric | 10 | NO | NULL |
| 3 | rgaimporte | numeric | 18,2 | NO | NULL |

### regulfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rgfid | numeric | 10 | NO | NULL |
| 2 | rgfpolnum | numeric | 10 | NO | NULL |
| 3 | rgftconid | numeric | 5 | NO | NULL |
| 4 | rgftsubid | numeric | 5 | NO | NULL |
| 5 | rgfimporte | numeric | 18,2 | NO | NULL |
| 6 | rgfestado | numeric | 5 | NO | 1 |
| 7 | rgftrgid | numeric | 5 | NO | 0 |
| 8 | rgffecintro | date |  | NO | trunc(CURRENT_DATE) |
| 9 | rgffecini | date |  | YES | NULL |
| 10 | rgffecfin | date |  | YES | NULL |
| 11 | rgfhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 12 | rgfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 13 | rgfperiidd | numeric | 5 | YES | NULL |
| 14 | rgfpernumd | numeric | 5 | YES | NULL |
| 15 | rgfannod | numeric | 5 | YES | NULL |
| 16 | rgfperiidh | numeric | 5 | YES | NULL |
| 17 | rgfpernumh | numeric | 5 | YES | NULL |
| 18 | rgfannoh | numeric | 5 | YES | NULL |

### relacionps
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rpsid | numeric | 10 | NO | NULL |
| 2 | rpsptosid | numeric | 10 | NO | NULL |
| 3 | rpstrpid | numeric | 5 | NO | NULL |
| 4 | rpsdescrip | character varying | 100 | YES | NULL |
| 5 | rpscoefprincipal | numeric | 6,3 | YES | NULL |
| 6 | rpscoefreduccion | numeric | 6,3 | YES | NULL |
| 7 | rpsfecini | timestamp without time zone |  | NO | NULL |
| 8 | rpsfecfin | timestamp without time zone |  | YES | NULL |
| 9 | rpsm3pdtes | numeric | 10 | NO | 0 |
| 10 | rpssnrepartoppal | character | 1 | NO | 'N'::bpchar |
| 11 | rpstpvid | numeric | 5 | YES | NULL |
| 12 | rpstetid | numeric | 5 | NO | NULL |
| 13 | rpstipreduc | numeric | 5 | YES | NULL |
| 14 | rpssncconsumo | character | 1 | NO | NULL |
| 15 | rpssnnegpte | character | 1 | NO | 'S'::bpchar |
| 16 | rpshstusu | character varying | 10 | NO | NULL |
| 17 | rpshsthora | timestamp without time zone |  | NO | NULL |
| 18 | rpssnrestacon | character | 1 | NO | 'S'::bpchar |
| 19 | rpssnnorepm3pdtes | character | 1 | NO | 'N'::bpchar |
| 20 | rpstrpid2 | numeric | 5 | YES | NULL |
| 21 | rpstetid2 | numeric | 5 | YES | NULL |
| 22 | rpssnbloqcont | character | 1 | NO | 'N'::bpchar |
| 23 | rpssndetectarcont | character | 1 | NO | 'N'::bpchar |
| 24 | rpsrefvarreq | numeric | 5 | YES | NULL |
| 25 | rpssnestimsecund | character | 1 | NO | 'S'::bpchar |
| 26 | rpsm3reduccion | numeric | 10 | YES | NULL |
| 27 | rpsminm3deduccion | numeric | 10 | YES | NULL |

### relacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | racexpl | character varying | 10 | NO | NULL |
| 2 | racacom | character varying | 18 | NO | NULL |
| 3 | racacoid | numeric | 10 | NO | NULL |

### relconfiupd
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rcuid | numeric | 5 | NO | NULL |
| 3 | rcudescorta | character varying | 10 | NO | NULL |
| 4 | rcudescritxtid | numeric | 10 | NO | '0'::numeric |

### relcsb19
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | r19emisor | character | 8 | NO | NULL |
| 2 | r19cobid | character varying | 21 | NO | NULL |
| 3 | r19refant | character | 12 | NO | NULL |
| 4 | r19gesid | numeric | 10 | NO | NULL |
| 5 | r19ocgid | numeric | 10 | NO | NULL |
| 6 | r19fact | numeric | 10 | NO | NULL |

### relcsb19plr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | r19emisor | character | 8 | NO | NULL |
| 2 | r19cobid | character varying | 21 | NO | NULL |
| 3 | r19refant | character | 12 | NO | NULL |
| 4 | r19gesid | numeric | 10 | NO | NULL |
| 5 | r19ocgid | numeric | 10 | NO | NULL |
| 6 | r19opdid | numeric | 10 | NO | NULL |

### relcsb57
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | r57anyo | numeric | 5 | NO | NULL |
| 2 | r57emisor | character | 8 | NO | NULL |
| 3 | r57rafaga | character | 15 | NO | NULL |
| 4 | r57limite | character | 6 | NO | NULL |
| 5 | r57numfac | character | 18 | NO | NULL |

### relestfirmaelectronica
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | refecodigo | numeric | 5 | NO | NULL |
| 2 | refecodope | numeric | 5 | NO | NULL |
| 3 | refecodest | numeric | 5 | YES | NULL |

### relfacimpgastos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rfigimpfacid | numeric | 10 | NO | NULL |
| 2 | rfiggasfacid | numeric | 10 | NO | NULL |

### relfacrecap
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rfrprofacid | numeric | 10 | NO | NULL |
| 2 | rfrrecfacid | numeric | 10 | NO | NULL |

### relfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rfaorigen | numeric | 10 | NO | NULL |
| 2 | rfarelac | numeric | 10 | NO | NULL |
| 3 | rfatiprel | numeric | 5 | NO | NULL |
| 4 | rfasnreffacori | character | 1 | NO | 'S'::bpchar |

### relgesrecftogas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rgrfggesid | numeric | 10 | NO | NULL |
| 2 | rgrfgftoid | numeric | 10 | NO | NULL |

### relmovanticipo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rmamoveid | numeric | 10 | NO | NULL |
| 2 | rmamovsid | numeric | 10 | NO | NULL |
| 3 | rmaimporte | numeric | 18,2 | NO | NULL |

### relprocfacrectif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rpfrprocid | numeric | 10 | NO | NULL |
| 2 | rpfrfacid | numeric | 10 | NO | NULL |
| 3 | rpfrrectfid | numeric | 10 | NO | NULL |
| 4 | rpfrfecid | numeric | 10 | NO | NULL |
| 5 | rpfrfacanuid | numeric | 10 | YES | NULL |

### relrefcobfacgas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rrcfgrefcobid | numeric | 10 | NO | NULL |
| 2 | rrcfggasfacid | numeric | 10 | NO | NULL |

### relsubconagru
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rsaaatlid | numeric | 5 | NO | NULL |
| 2 | rsaidsubconc | numeric | 5 | NO | NULL |
| 3 | rsatsubid | numeric | 5 | NO | NULL |
| 4 | rsasnm3fact | character | 1 | NO | NULL |
| 5 | rsaclasub | numeric | 5 | YES | NULL |

### reltaragru
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rtaatlid | numeric | 5 | NO | NULL |
| 2 | rtasocemis | numeric | 10 | NO | NULL |
| 3 | rtatarid | numeric | 5 | NO | NULL |
| 4 | rtacodliq | character varying | 10 | YES | NULL |

### reltiposalarmatel
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rtacodigo | numeric | 5 | NO | NULL |
| 2 | rtaid | numeric | 5 | NO | NULL |

### reltramagru
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rtraatlid | numeric | 5 | NO | NULL |
| 2 | rtrantramo | numeric | 5 | NO | NULL |
| 3 | rtradesc | character varying | 50 | NO | NULL |
| 4 | rtralim | numeric | 10 | NO | NULL |

### relusuws
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ruwuswsid | numeric | 10 | NO | NULL |
| 2 | ruwwsid | numeric | 10 | NO | NULL |
| 3 | ruwtoken | character varying | 200 | YES | NULL |
| 4 | ruwsfecexp | timestamp without time zone |  | YES | NULL |

### remabono
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rapraid | numeric | 10 | NO | NULL |
| 2 | rabanid | numeric | 5 | NO | NULL |
| 3 | raasnid | numeric | 10 | YES | NULL |
| 4 | raresid | numeric | 10 | YES | NULL |
| 5 | rasocpro | numeric | 10 | YES | NULL |

### remesasicer
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rmsid | numeric | 10 | NO | NULL |
| 2 | rmstipenv | numeric | 5 | NO | NULL |
| 3 | rmscodserade | character varying | 8 | NO | NULL |
| 4 | rmsimpdid | numeric | 10 | NO | NULL |
| 5 | rmsnumero | character varying | 4 | YES | NULL |
| 6 | rmsestado | numeric | 5 | NO | NULL |
| 7 | rmsnomficenv | character varying | 30 | YES | NULL |
| 8 | rmsfeccrea | date |  | NO | CURRENT_DATE |
| 9 | rmsusucrea | character varying | 10 | NO | 'CONVERSION'::character varying |
| 10 | rmsfecenv | date |  | YES | NULL |
| 11 | rmsfecacept | date |  | YES | NULL |
| 12 | rmsfeccierre | date |  | YES | NULL |

### repartidor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | repcprsid | numeric | 10 | NO | NULL |
| 2 | repcfecult | date |  | NO | NULL |
| 3 | repcorden | numeric | 5 | YES | NULL |
| 4 | repcactivo | character | 1 | NO | NULL |
| 5 | repccodcont | numeric | 10 | NO | 0 |
| 6 | repctpclasif | character varying | 20 | NO | 'P'::character varying |
| 7 | repchstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 8 | repchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 9 | repcsnsicer | character | 1 | NO | 'N'::bpchar |

### repentrega
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ecorentid | numeric | 10 | NO | NULL |
| 2 | ecorsesid | numeric | 10 | NO | NULL |
| 3 | ecorprsrep | numeric | 10 | NO | NULL |
| 4 | ecorfecent | date |  | NO | NULL |
| 5 | ecorhorent | time without time zone |  | YES | NULL |
| 6 | ecornumord | numeric | 5 | NO | NULL |
| 7 | ecordocent | numeric | 10 | NO | NULL |

### repo_columna
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | table_name | character varying | 128 | NO | NULL |
| 2 | column_name | character varying | 128 | NO | NULL |
| 3 | seudonimiza | numeric | 5 | YES | 0 |
| 4 | orden | numeric |  | YES | NULL |
| 5 | pk_orden | numeric |  | YES | NULL |
| 6 | fec_creacion | timestamp without time zone |  | YES | now() |
| 7 | fec_modificacion | timestamp without time zone |  | YES | now() |

### reptpsobre
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rtsprsid | numeric | 10 | NO | NULL |
| 2 | rtstpsid | numeric | 5 | NO | NULL |
| 3 | rtshstusu | character varying | 10 | NO | NULL |
| 4 | rtshsthora | timestamp without time zone |  | NO | NULL |

### requestcolamdm
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rcmdmnrsistorigen | numeric | 10 | NO | NULL |
| 2 | rcmdmprioridad | numeric | 5 | NO | NULL |

### requestmdm
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rmdmnrsistorigen | numeric | 10 | NO | NULL |
| 2 | rmdmestado | numeric | 5 | NO | NULL |
| 3 | rmdmidexplotacion | numeric | 5 | NO | NULL |
| 4 | rmdmidmotpeticion | numeric | 5 | NO | NULL |
| 5 | rmdmusrpeticion | character varying | 50 | NO | NULL |
| 6 | rmdmusranula | character varying | 50 | YES | NULL |
| 7 | rmdmfecanula | timestamp without time zone |  | YES | NULL |
| 8 | rmdmsistele | numeric | 5 | NO | 2 |
| 9 | rmdmfeccrea | timestamp without time zone |  | NO | clock_timestamp() |
| 10 | rmdmfecenvautval | timestamp without time zone |  | YES | NULL |
| 11 | rmdmnumautval | numeric | 5 | NO | '0'::numeric |

### resgesttmk
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rgtid | numeric | 5 | NO | NULL |
| 2 | rgttxtid | numeric | 10 | NO | NULL |

### resids
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | resid | numeric | 10 | NO | NULL |

### resnotacuse
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rnaid | numeric | 5 | NO | NULL |
| 2 | rnatxtid | numeric | 10 | NO | NULL |
| 3 | rnahstusu | character varying | 10 | NO | NULL |
| 4 | rnahsthora | timestamp without time zone |  | NO | NULL |

### respettele
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rptid | numeric | 10 | NO | NULL |
| 2 | rptfecresp | timestamp without time zone |  | NO | NULL |
| 3 | rptrmdmsistorig | numeric | 10 | NO | NULL |
| 4 | rptiddatahubcf | character varying | 36 | YES | NULL |
| 5 | rptestdatahubcf | character varying | 36 | YES | NULL |
| 6 | rptsisext | numeric | 5 | NO | NULL |
| 7 | rptidsisext | character varying | 36 | YES | NULL |
| 8 | rptcontnum | character varying | 16 | YES | NULL |
| 9 | rptequiponum | character varying | 16 | YES | NULL |
| 10 | rptfecasoccont | character varying | 24 | YES | NULL |
| 11 | rptfecasoceq | character varying | 24 | YES | NULL |
| 12 | rpttipocont | character varying | 16 | YES | NULL |
| 13 | rpttipoeq | character varying | 16 | YES | NULL |
| 14 | rpttiptec | numeric | 5 | YES | NULL |
| 15 | rptdenpntsumn | character varying | 100 | YES | NULL |
| 16 | rptidexpl | numeric | 5 | YES | NULL |
| 17 | rptcodpntsumn | character varying | 100 | YES | NULL |
| 18 | rptsector | character varying | 70 | YES | NULL |
| 19 | rptsubsector | character varying | 70 | YES | NULL |
| 20 | rptgranconsumid | numeric | 5 | YES | NULL |
| 21 | rptnumpol | character varying | 60 | YES | NULL |
| 22 | rptfhaltapol | character varying | 26 | YES | NULL |
| 23 | rptfacturable | numeric | 5 | YES | NULL |
| 24 | rptestcontador | numeric | 5 | YES | NULL |
| 25 | rptidmarca | character varying | 10 | YES | NULL |
| 26 | rptmarca | character varying | 20 | YES | NULL |
| 27 | rptidmodelo | character varying | 10 | YES | NULL |
| 28 | rptmodelo | character varying | 30 | YES | NULL |
| 29 | rptidcalibre | numeric | 5 | YES | NULL |
| 30 | rptfechinscont | character varying | 26 | YES | NULL |
| 31 | rptfechbajacont | character varying | 26 | YES | NULL |
| 32 | rptmodradiovhf | character varying | 9 | YES | NULL |
| 33 | rptimetereq | character varying | 50 | YES | NULL |
| 34 | rptbusvhfns | character varying | 7 | YES | NULL |
| 35 | rptfilecini | character varying | 26 | YES | NULL |
| 36 | rptmodeloeq | character varying | 50 | YES | NULL |
| 37 | rptoptions | character varying | 20 | YES | NULL |
| 38 | rptindlecini | numeric | 10 | YES | NULL |
| 39 | rptpulsoemi | numeric | 5,1 | YES | NULL |
| 40 | rptaddkey | character varying | 50 | YES | NULL |
| 41 | rptmodradiolw | character varying | 50 | YES | NULL |
| 42 | rptsnbusnbiot | character varying | 50 | YES | NULL |
| 43 | rptmarcaeq | character varying | 50 | YES | NULL |
| 44 | rptmodelmaeq | character varying | 50 | YES | NULL |

### resprcdivcart
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rprdccid | numeric | 10 | NO | NULL |
| 2 | rprdcperiid | numeric | 5 | NO | NULL |
| 3 | rprdcannod | numeric | 5 | NO | NULL |
| 4 | rprdcpernumero | numeric | 5 | NO | NULL |
| 5 | rprdcfacestado | numeric | 5 | NO | NULL |
| 6 | rprdcnumfac | numeric | 10 | NO | NULL |
| 7 | rprdcimporte | numeric | 18,2 | NO | NULL |

### respservcentral
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rscid | numeric | 10 | NO | NULL |
| 2 | rsctxtid | numeric | 10 | NO | NULL |
| 3 | rscactivosn | character | 1 | NO | NULL |

### resultadoapantallamiento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | raid | numeric | 10 | NO | NULL |
| 2 | ratipo | numeric | 5 | NO | NULL |
| 3 | raidcf | numeric | 10 | NO | NULL |
| 4 | raidatencion | character varying | 40 | YES | NULL |
| 5 | radfecharegistro | date |  | NO | NULL |
| 6 | raestado | numeric | 5 | NO | NULL |
| 7 | raidcaso | character varying | 40 | YES | NULL |
| 8 | rafechacaso | date |  | YES | NULL |
| 9 | ralocator | numeric | 10 | YES | NULL |
| 10 | raestadocrm | numeric | 5 | YES | NULL |

### resultadoproceso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | resid | numeric | 10 | NO | NULL |
| 2 | resresid | numeric | 10 | NO | NULL |
| 3 | restipid | numeric | 5 | NO | NULL |
| 4 | resnivel | numeric | 5 | NO | NULL |
| 5 | resexpid | numeric | 5 | YES | NULL |
| 6 | ressocid | numeric | 10 | YES | NULL |
| 7 | resdescrip | character varying | 100 | YES | NULL |
| 8 | resbinario | bytea |  | YES | NULL |
| 9 | resfeccrea | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 10 | resusucrea | character varying | 12 | YES | NULL |
| 11 | resfecacep | timestamp without time zone |  | YES | NULL |
| 12 | resusuacep | character varying | 12 | YES | NULL |
| 13 | resfecimp | timestamp without time zone |  | YES | NULL |
| 14 | resusuimp | character varying | 12 | YES | NULL |
| 15 | resformatofichero | numeric | 5 | NO | 0 |

### retiroscierres
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rciid | numeric | 10 | NO | NULL |
| 2 | rciapcid | numeric | 10 | YES | NULL |
| 3 | rcicrcid | numeric | 10 | NO | NULL |
| 4 | rciusuario | character varying | 10 | NO | NULL |
| 5 | rcifecha | date |  | YES | NULL |
| 6 | rcihora | time without time zone |  | YES | NULL |
| 7 | rcitipo | numeric | 5 | NO | NULL |
| 8 | rciimporte | numeric | 18,2 | NO | NULL |
| 9 | rciobservacion | character varying | 50 | YES | NULL |
| 10 | rcisaldo | numeric | 18,2 | YES | NULL |
| 11 | rciprovisional | character varying | 1 | NO | 'S'::character varying |
| 12 | rcidefinitivousuario | character varying | 10 | YES | NULL |
| 13 | rcidesfinitivofecha | date |  | YES | NULL |
| 14 | rcidesfinitivohora | time without time zone |  | YES | NULL |

### revacoestado
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rvervaid | numeric | 10 | NO | NULL |
| 2 | rveestado | numeric | 5 | NO | NULL |
| 3 | rvehstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 4 | rvehsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### revacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rvaid | numeric | 10 | NO | NULL |
| 2 | rvaestado | numeric | 5 | NO | NULL |
| 3 | rvaconforme | numeric | 5 | NO | NULL |
| 4 | rvaobsid | numeric | 10 | YES | NULL |
| 5 | rvapromot | character varying | 50 | YES | NULL |
| 6 | rvadirobra | character varying | 50 | YES | NULL |
| 7 | rvainstprsid | numeric | 10 | YES | NULL |
| 8 | rvaexpid | numeric | 5 | NO | NULL |
| 9 | rvahstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 10 | rvahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### revcambsen
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | revcsid | numeric | 10 | NO | NULL |
| 2 | revproccsid | numeric | 10 | YES | NULL |
| 3 | revusuario | character | 10 | NO | NULL |
| 4 | revsocpresent | numeric | 10 | YES | NULL |
| 5 | revbancosolic | numeric | 5 | YES | NULL |
| 6 | revnomfich | character varying | 100 | YES | NULL |
| 7 | revfichero | bytea |  | YES | NULL |
| 8 | revnumsegnfich | numeric | 5 | YES | NULL |
| 9 | revnumsegnmod | numeric | 5 | YES | NULL |
| 10 | revfechahora | timestamp without time zone |  | NO | NULL |

### revispartic
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rvpid | numeric | 10 | NO | NULL |
| 2 | rvpexpid | numeric | 5 | YES | NULL |
| 3 | rvpzonid | character | 3 | YES | NULL |
| 4 | rvpanno | numeric | 5 | YES | NULL |
| 5 | rvpperiid | numeric | 5 | YES | NULL |
| 6 | rvppernum | numeric | 5 | YES | NULL |
| 7 | rvpftoid | numeric | 10 | YES | NULL |
| 8 | rvpdescrip | character varying | 4000 | NO | NULL |
| 9 | rvprevisado | character | 1 | NO | 'N'::bpchar |
| 10 | rvpusu | character varying | 10 | YES | NULL |
| 11 | rvphora | timestamp without time zone |  | YES | NULL |

### rgpd_agrucontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | agruid | numeric | 10 | NO | NULL |
| 2 | agrucliid | numeric | 10 | NO | NULL |
| 3 | agruprsid | numeric | 10 | NO | NULL |
| 4 | agrunumdir | numeric | 5 | NO | NULL |
| 5 | agrucntppal | numeric | 10 | YES | NULL |

### rgpd_comcarta
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | carid | numeric | 10 | NO | NULL |
| 2 | carprsid | numeric | 10 | NO | NULL |
| 3 | carnumdir | numeric | 5 | NO | NULL |
| 4 | carcosid | numeric | 10 | NO | NULL |

### rgpd_comemail
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cmeid | numeric | 10 | NO | NULL |
| 2 | cmeprsid | numeric | 10 | NO | NULL |
| 3 | cmecosid | numeric | 10 | NO | NULL |
| 4 | cmeidioma | character varying | 5 | NO | NULL |
| 5 | cmeemail | character varying | 110 | NO | NULL |

### rgpd_comfacturae
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cmfid | numeric | 10 | NO | NULL |
| 2 | cmfcosid | numeric | 10 | NO | NULL |
| 3 | cmfidioma | character varying | 5 | NO | NULL |
| 4 | cmfemail | character varying | 110 | YES | NULL |

### rgpd_compromiso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cpgid | numeric | 10 | NO | NULL |
| 2 | cpgsolprsid | numeric | 10 | NO | NULL |
| 3 | cpgprsid | numeric | 10 | YES | NULL |
| 4 | cpgnumdir | numeric | 5 | YES | NULL |

### rgpd_comsms
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cmsid | numeric | 10 | NO | NULL |
| 2 | cmscosid | numeric | 10 | NO | NULL |
| 3 | cmsidioma | character varying | 5 | NO | NULL |
| 4 | cmstelefono | character varying | 16 | NO | NULL |

### rgpd_contacto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | ctcid | numeric | 10 | NO | NULL |
| 2 | ctcexpid | numeric | 5 | NO | NULL |
| 3 | ctccnttnum | numeric | 10 | YES | NULL |
| 4 | ctccliid | numeric | 10 | YES | NULL |
| 5 | ctcprsid | numeric | 10 | NO | NULL |

### rgpd_contrato
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cnttnum | numeric | 10 | NO | NULL |
| 2 | cnttexpid | numeric | 5 | NO | NULL |
| 3 | cnttcliid | numeric | 10 | NO | NULL |
| 4 | cnttscobid | numeric | 10 | NO | NULL |
| 5 | cnttprccams | numeric | 10 | NO | NULL |
| 6 | cnttfprsid | numeric | 10 | NO | NULL |
| 7 | cnttfnumdir | numeric | 5 | NO | NULL |
| 8 | cnttcprsid | numeric | 10 | NO | NULL |
| 9 | cnttcnumdir | numeric | 5 | NO | NULL |
| 10 | cnttpropid | numeric | 10 | YES | NULL |
| 11 | cnttinquid | numeric | 10 | YES | NULL |
| 12 | cnttidicodigo | character varying | 2 | YES | NULL::character varying |
| 13 | cnttpcnprsid | numeric | 10 | YES | NULL |
| 14 | cnttpcncnaecod | numeric | 10 | YES | NULL |
| 15 | cnttsnnotifmail | character varying | 1 | NO | NULL |
| 16 | cnttsnnotifsms | character varying | 1 | NO | NULL |
| 17 | cnttnotifprsid1 | numeric | 10 | YES | NULL |
| 18 | cnttnotifnumdir1 | numeric | 5 | YES | NULL |
| 19 | cnttnotifprsid2 | numeric | 10 | YES | NULL |
| 20 | cnttnotifnumdir2 | numeric | 5 | YES | NULL |
| 21 | cnttnotifmovil | character varying | 16 | YES | NULL::character varying |
| 22 | cnttotroprsid | numeric | 10 | YES | NULL |
| 23 | cnttprfnotifmovil | character varying | 5 | YES | NULL::character varying |
| 24 | cnttfspprsid | numeric | 10 | YES | NULL |
| 25 | cnttmailnopapelfprsid | numeric | 10 | YES | NULL |
| 26 | cnttmailnopapelnumdir | numeric | 5 | YES | NULL |
| 27 | cntttratado | character varying | 1 | YES | 'N'::character varying |
| 28 | cnttprfmovilnopapel | character varying | 5 | YES | NULL |
| 29 | cnttmovilnopapel | character varying | 16 | YES | NULL |

### rgpd_contrato_personas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | cnttnum | numeric | 10 | YES | NULL |
| 2 | new_prsid | numeric | 10 | YES | NULL |
| 3 | cnttcliid | numeric | 10 | YES | NULL |
| 4 | cnttpropid | numeric | 10 | YES | NULL |
| 5 | cnttinquid | numeric | 10 | YES | NULL |
| 6 | cnttotroprsid | numeric | 10 | YES | NULL |

### rgpd_facimpnorecl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | facid | numeric | 10 | NO | NULL |
| 2 | faccnttnum | numeric | 10 | NO | NULL |
| 3 | faccliid | numeric | 10 | NO | NULL |

### rgpd_factura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | facid | numeric | 10 | NO | NULL |
| 2 | facpocid | numeric | 10 | NO | NULL |
| 3 | faccnttnum | numeric | 10 | NO | NULL |
| 4 | faccliid | numeric | 10 | NO | NULL |
| 5 | facclinif | character varying | 15 | YES | NULL |

### rgpd_juicio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | juid | numeric | 10 | NO | NULL |
| 2 | judemanda1 | numeric | 10 | YES | NULL |
| 3 | judemanda2 | numeric | 10 | YES | NULL |
| 4 | judemanda3 | numeric | 10 | YES | NULL |
| 5 | judemanda4 | numeric | 10 | YES | NULL |
| 6 | juabogado | numeric | 10 | YES | NULL |

### rgpd_ordenvisit
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | orvid | numeric | 10 | NO | NULL |
| 2 | orvordid | numeric | 10 | NO | NULL |
| 3 | orvnomresp | character varying | 30 | YES | NULL |
| 4 | orvape1resp | character varying | 60 | YES | NULL |
| 5 | orvape2resp | character varying | 30 | YES | NULL |
| 6 | orvnifresp | character varying | 15 | YES | NULL |
| 7 | orvtelresp | character varying | 11 | YES | NULL |

### rgpd_persona
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | prsid | numeric | 10 | NO | NULL |
| 2 | prsid_new | numeric | 10 | NO | NULL |
| 3 | prsupd | numeric | 5 | NO | NULL |
| 4 | prsid_new_creado | character varying | 1 | YES | 'N'::character varying |
| 5 | prsid_tratado | character varying | 1 | YES | 'N'::character varying |

### rgpd_qqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | qejid | numeric | 10 | NO | NULL |
| 2 | qejexpid | numeric | 5 | NO | NULL |
| 3 | qejcliid | numeric | 10 | YES | NULL |
| 4 | qejpercto | numeric | 10 | NO | NULL |
| 5 | qejcnttnum | numeric | 10 | YES | NULL |
| 6 | qejcprsid | numeric | 10 | YES | NULL |
| 7 | qejcnumdir | numeric | 5 | YES | NULL |

### rgpd_senasestados
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sstacnttnum | numeric | 10 | NO | NULL |
| 2 | sstafecinicio | timestamp without time zone |  | NO | NULL |
| 3 | sstasencid | numeric | 10 | NO | NULL |
| 4 | sstapcsid | numeric | 10 | YES | NULL |

### rgpd_solacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sacid | numeric | 10 | NO | NULL |
| 2 | sacexpid | numeric | 5 | NO | NULL |
| 3 | sacpeticionario | numeric | 10 | NO | NULL |
| 4 | sacpetnumdir | numeric | 5 | NO | NULL |
| 5 | sacpropietario | numeric | 10 | NO | NULL |
| 6 | sacpropnumdir | numeric | 5 | NO | NULL |
| 7 | sacperscont | numeric | 10 | NO | NULL |
| 8 | sacinstalador | numeric | 10 | NO | NULL |
| 9 | saccnttnum | numeric | 10 | YES | NULL |
| 10 | sacid_tratado | character varying | 1 | YES | 'S'::character varying |

### rgpd_solicitudaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sacaid | numeric | 10 | NO | NULL |
| 2 | sacanumdoc | character varying | 15 | NO | NULL |
| 3 | sacacnttnum | numeric | 10 | YES | NULL |
| 4 | sacaapel1 | character varying | 25 | NO | NULL |
| 5 | sacaapel2 | character varying | 25 | YES | NULL |
| 6 | sacanombre | character varying | 20 | NO | NULL |
| 7 | sacatfno | character varying | 16 | YES | NULL |
| 8 | sacamovil | character varying | 16 | YES | NULL |
| 9 | sacaemail | character varying | 100 | YES | NULL |
| 10 | sacatipovia | character varying | 2 | YES | NULL |
| 11 | sacanomvia | character varying | 50 | YES | NULL |
| 12 | sacanumvia | character varying | 4 | YES | NULL |
| 13 | sacaletra | character varying | 1 | YES | NULL |
| 14 | sacabloque | character varying | 2 | YES | NULL |
| 15 | sacaescalera | character varying | 2 | YES | NULL |
| 16 | sacaplanta | character varying | 3 | YES | NULL |
| 17 | sacapuerta | character varying | 4 | YES | NULL |
| 18 | sacacodpostal | character varying | 5 | YES | NULL |

### rgpd_sucrevcambsen
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sucrcsid | numeric | 10 | NO | NULL |
| 2 | sucrrevid | numeric | 10 | NO | NULL |
| 3 | sucrexpid | numeric | 5 | YES | NULL |
| 4 | sucrsegnasfich | character varying | 34 | YES | NULL |
| 5 | sucrsegnasant | character varying | 34 | YES | NULL |
| 6 | sucrcnttnum | numeric | 10 | YES | NULL |

### rpccontrat
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rcctctcod | numeric | 10 | NO | NULL |
| 2 | rccexpid | numeric | 5 | NO | NULL |
| 3 | rcccptoid | numeric | 5 | NO | NULL |
| 4 | rccrpcid | numeric | 5 | NO | NULL |
| 5 | rcctarifa | numeric | 5 | NO | NULL |

### rpcvertido
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rpcid | numeric | 5 | NO | NULL |
| 2 | rpcgrupo | numeric | 5 | NO | NULL |
| 3 | rpcdesc | character varying | 100 | NO | NULL |
| 4 | rpcsnexp | character | 1 | NO | 'N'::bpchar |
| 5 | rpctipdoc | numeric | 5 | YES | NULL |
| 6 | rpcprsid | numeric | 10 | NO | NULL |
| 7 | rpcsnocucre | character | 1 | NO | 'N'::bpchar |
| 8 | rpcsnmarpdte | character | 1 | NO | 'N'::bpchar |

### rutadalttpdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | radid | numeric | 5 | NO | NULL |
| 2 | radrtdid | numeric | 5 | NO | NULL |
| 3 | radtpdid | numeric | 5 | NO | NULL |
| 4 | radncalcalid | numeric | 10 | NO | NULL |
| 5 | radfindes | numeric | 5 | NO | NULL |
| 6 | radfinhas | numeric | 5 | NO | NULL |
| 7 | radctdid | numeric | 5 | NO | NULL |
| 8 | radsnactivo | character | 1 | NO | NULL |
| 9 | radhstusu | character varying | 10 | NO | NULL |
| 10 | radhsthora | timestamp without time zone |  | NO | NULL |

### rutadistrib
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rtdid | numeric | 5 | NO | NULL |
| 2 | rtdldtid | numeric | 5 | NO | NULL |
| 3 | rtddescrip | character varying | 50 | NO | NULL |
| 4 | rtdcpdesde | character varying | 10 | NO | NULL |
| 5 | rtdcphasta | character varying | 10 | NO | NULL |
| 6 | rtdsnnacional | character | 1 | NO | 'S'::bpchar |
| 7 | rtdhstusu | character varying | 10 | NO | NULL |
| 8 | rtdhsthora | timestamp without time zone |  | NO | NULL |
| 9 | rtdsocemi | numeric | 10 | YES | NULL |

### rutadtpdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | rdtrtdid | numeric | 5 | NO | NULL |
| 2 | rdttpdid | numeric | 5 | NO | NULL |
| 3 | rdtctdid | numeric | 5 | NO | NULL |
| 4 | rdthstusu | character varying | 10 | NO | NULL |
| 5 | rdthsthora | timestamp without time zone |  | NO | NULL |
| 6 | rdtsncertif | character | 1 | NO | 'N'::bpchar |
| 7 | rdtsnacuse | character | 1 | NO | 'N'::bpchar |
| 8 | rdtcersicer | numeric | 5 | YES | NULL |
| 9 | rdtsncertps | character | 1 | NO | 'N'::bpchar |
| 10 | rdtsnacups | character | 1 | NO | 'N'::bpchar |
| 11 | rdtcersicerps | numeric | 5 | YES | NULL |
| 12 | rdtsncertfac | character | 1 | NO | 'N'::bpchar |
| 13 | rdtsnacufac | character | 1 | NO | 'N'::bpchar |
| 14 | rdtcersicerfac | numeric | 5 | YES | NULL |

### saldoredondeo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sdrid | numeric | 10 | NO | NULL |
| 2 | sdrrefid | numeric | 10 | YES | NULL |
| 3 | sdrcnttnum | numeric | 10 | NO | NULL |
| 4 | sdrcntorden | numeric | 10 | NO | NULL |
| 5 | sdrredondeo | numeric | 18,2 | NO | 0 |
| 6 | sdrsaldoajuste | numeric | 18,2 | NO | 0 |
| 7 | sdrestado | numeric | 5 | NO | 0 |

### sechidraulico
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | schid | numeric | 5 | NO | NULL |
| 2 | schdesc | character varying | 50 | NO | NULL |
| 3 | schexpid | numeric | 5 | NO | NULL |
| 4 | schsngestint | character | 1 | NO | NULL |
| 5 | schhstusu | character varying | 10 | NO | NULL |
| 6 | schhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | schcodgis | character varying | 50 | YES | NULL |

### senascobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sencid | numeric | 10 | NO | NULL |
| 2 | sencprsid | numeric | 10 | NO | NULL |
| 3 | senccanaid | character | 1 | NO | NULL |
| 4 | sencactiva | character | 1 | NO | NULL |
| 5 | sencageid | numeric | 5 | YES | NULL |
| 6 | sencbanid | numeric | 5 | YES | NULL |
| 7 | sencnumcta | character varying | 20 | YES | NULL |
| 8 | sencdigcon | character | 2 | YES | NULL |
| 9 | sencprccam | numeric | 10 | NO | NULL |
| 10 | senchstusu | character varying | 10 | NO | NULL |
| 11 | senchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 12 | senciban | character varying | 34 | YES | NULL |
| 13 | sencformat | character varying | 50 | YES | NULL |
| 14 | sencusucrea | character varying | 10 | YES | NULL |
| 15 | sencimplim | numeric | 18,2 | YES | NULL |
| 16 | sencformatocta | numeric | 5 | YES | NULL |

### senasestados
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sstacnttnum | numeric | 10 | NO | NULL |
| 2 | sstafecinicio | timestamp without time zone |  | NO | NULL |
| 3 | sstasencid | numeric | 10 | NO | NULL |
| 4 | sstapcsid | numeric | 10 | YES | NULL |
| 5 | sstafecfin | timestamp without time zone |  | YES | NULL |
| 6 | sstahstusu | character varying | 10 | NO | ' '::character varying |
| 7 | sstarefmid | numeric | 10 | YES | NULL |

### senasgestcobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sengcprsid | numeric | 10 | NO | NULL |
| 2 | sengcexpid | numeric | 5 | NO | NULL |
| 3 | sengcsencid | numeric | 10 | NO | NULL |
| 4 | sencgcrefmid | numeric | 10 | YES | NULL |
| 5 | sencgcsnremesa | character | 1 | NO | NULL |

### senasremesa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | srmocgid | numeric | 10 | NO | NULL |
| 2 | srmcnttnum | numeric | 10 | NO | NULL |
| 3 | srmcuenta | character varying | 50 | NO | NULL |
| 4 | srmbanid | numeric | 5 | YES | NULL |
| 5 | srmageid | numeric | 5 | YES | NULL |
| 6 | srmtipcta | character | 1 | YES | NULL |

### serfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | srfcod | character | 1 | NO | NULL |
| 2 | srfdescri | character varying | 30 | NO | NULL |

### servcentral
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | secid | numeric | 10 | NO | NULL |
| 2 | sectxtid | numeric | 10 | NO | NULL |
| 3 | secactivosn | character | 1 | NO | NULL |

### servcomp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | scomid | numeric | 5 | NO | NULL |
| 2 | scomtxtid | numeric | 10 | NO | NULL |
| 3 | scomnleido | character | 1 | NO | NULL |
| 4 | scosnactivo | character | 1 | NO | 'S'::bpchar |

### serverprops
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sprpservidor | character varying | 128 | NO | NULL |
| 2 | sprpprop | character varying | 100 | NO | NULL |
| 3 | sprpvalor | character varying | 400 | NO | NULL |
| 4 | sprpgrupo | character varying | 20 | NO | NULL |
| 5 | sprpusuid | character varying | 10 | YES | 'SERVIDOR'::character varying |

### serverpropslista
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | splnom | character varying | 100 | NO | NULL |
| 2 | spldescription | character varying | 500 | NO | NULL |
| 3 | splvalores | character varying | 500 | YES | NULL |
| 4 | splnecesitareiniciar | character | 1 | NO | NULL |
| 5 | splvalordef | character varying | 200 | YES | NULL |
| 6 | splrequerida | character | 1 | NO | NULL |
| 7 | srvlencriptar | character | 1 | NO | 'N'::bpchar |

### servicio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | serid | numeric | 10 | NO | NULL |
| 2 | serdirid | numeric | 10 | NO | NULL |
| 3 | sertetid | numeric | 5 | NO | NULL |
| 4 | serexpid | numeric | 5 | NO | NULL |
| 5 | seracoid | numeric | 10 | NO | NULL |
| 6 | serproext | numeric | 5 | NO | NULL |
| 7 | serproint | numeric | 5 | NO | NULL |
| 8 | seredif | character varying | 25 | YES | NULL |
| 9 | seraport | double precision | 53 | NO | NULL |
| 10 | serindced | character | 1 | NO | NULL |
| 11 | serindbol | character | 1 | NO | NULL |
| 12 | sercorte | character | 1 | NO | NULL |
| 13 | serfsumcod | numeric | 5 | YES | NULL |
| 14 | serempzid | character | 2 | NO | NULL |
| 15 | sernumviv | numeric | 10 | NO | NULL |
| 16 | sersncontrat | character | 1 | NO | NULL |
| 17 | sermotcont | numeric | 5 | YES | NULL |
| 18 | serobsid | numeric | 10 | YES | NULL |
| 19 | sertipo | numeric | 5 | YES | NULL |
| 20 | sersnactivo | character | 1 | NO | NULL |
| 21 | sersnretaltas | character | 1 | NO | NULL |
| 22 | serfecprevmas | date |  | YES | NULL |
| 23 | serhorprevmas | time without time zone |  | YES | NULL |
| 24 | serfecrealmas | date |  | YES | NULL |
| 25 | serhorrealmas | time without time zone |  | YES | NULL |
| 26 | sercaldef | character varying | 15 | YES | NULL |
| 27 | serfcaldef | date |  | YES | NULL |
| 28 | sernumfil | numeric | 5 | YES | NULL |
| 29 | sernumcol | numeric | 5 | YES | NULL |
| 30 | serllaves | numeric | 5 | YES | NULL |
| 31 | sersncartel | character | 1 | NO | 'N'::bpchar |
| 32 | serlic1aocup | character varying | 20 | YES | NULL |
| 33 | serflic1aocup | date |  | YES | NULL |
| 34 | serfeccontra | date |  | YES | NULL |
| 35 | serhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 36 | serhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 37 | serrefcat | character varying | 14 | YES | NULL |
| 38 | serconid | numeric | 10 | YES | NULL |
| 39 | sertpllave | character varying | 15 | YES | NULL |
| 40 | serobserv | character | 80 | YES | NULL |
| 41 | sertipotelec | numeric | 5 | YES | NULL |
| 42 | sertelec | character | 1 | NO | 'N'::bpchar |
| 43 | serptosid | numeric | 10 | YES | NULL |

### servicioweb
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | wsid | numeric | 10 | NO | NULL |
| 2 | wsnombre | character varying | 50 | NO | NULL |
| 3 | wstipo | numeric | 5 | NO | NULL |
| 4 | wsauth | character | 1 | NO | 'S'::bpchar |
| 5 | wskey | bytea |  | YES | NULL |
| 6 | wsexptoken | numeric | 10 | YES | NULL |

### servidor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | servnombre | character varying | 128 | NO | NULL |
| 2 | servinst | numeric | 5 | NO | NULL |
| 3 | servpuerto | numeric | 10 | NO | NULL |
| 4 | servpuertohttps | numeric | 10 | NO | NULL |
| 5 | servactivo | character | 1 | NO | NULL |
| 6 | servtipo | numeric | 5 | NO | 1 |

### sesion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sesid | numeric | 10 | NO | NULL |
| 2 | sesusuid | character varying | 10 | NO | NULL |
| 3 | sesofiid | numeric | 5 | NO | NULL |
| 4 | sesfecha | date |  | NO | NULL |

### simpolcontar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | pctexpid | numeric | 5 | NO | NULL |
| 2 | pctcptoid | numeric | 5 | NO | NULL |
| 3 | pctttarid | numeric | 5 | NO | NULL |
| 4 | pctcnttnum | numeric | 10 | NO | NULL |
| 5 | pctfecini | date |  | NO | NULL |
| 6 | pctfecfin | date |  | YES | NULL |
| 7 | pcthstusu | character varying | 10 | NO | NULL |
| 8 | pcthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### sistemassatelitales
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sissatsistema | character varying | 128 | NO | NULL |
| 2 | sissatsnvalidar | character | 1 | NO | 'S'::bpchar |
| 3 | sissatpropiedad | character varying | 128 | NO | NULL |
| 4 | sissattipo | numeric | 5 | NO | NULL |

### site
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | siteanno | numeric | 5 | NO | NULL |
| 2 | sitemes | numeric | 5 | NO | NULL |
| 3 | siteexpid | numeric | 5 | NO | NULL |
| 4 | sitetipo | character | 1 | NO | NULL |
| 5 | sitecliagu | numeric | 10 | YES | NULL |
| 6 | sitem3agal | numeric | 10 | YES | NULL |
| 7 | sitem3agbj | numeric | 10 | YES | NULL |
| 8 | sitem3agbm | numeric | 10 | YES | NULL |
| 9 | sitem3fact | numeric | 10 | YES | NULL |
| 10 | sitecontad | numeric | 10 | YES | NULL |
| 11 | siteconint | numeric | 10 | YES | NULL |
| 12 | siteedacon | double precision | 53 | YES | NULL |
| 13 | siteclialc | numeric | 10 | YES | NULL |
| 14 | sitem3alc | numeric | 10 | YES | NULL |
| 15 | sitecontiv | numeric | 10 | YES | NULL |
| 16 | sitenlect | numeric | 10 | YES | NULL |
| 17 | sitenfactu | numeric | 10 | YES | NULL |
| 18 | siteclidom | numeric | 10 | YES | NULL |
| 19 | sitemagalc | numeric | 10 | YES | NULL |
| 20 | sitemagbjc | numeric | 10 | YES | NULL |
| 21 | sitemagbmc | numeric | 10 | YES | NULL |
| 22 | sitemfactc | numeric | 10 | YES | NULL |
| 23 | sitemagalf | numeric | 10 | YES | NULL |
| 24 | sitemagbjf | numeric | 10 | YES | NULL |
| 25 | sitemagbmf | numeric | 10 | YES | NULL |
| 26 | sitesndefinit | character | 1 | NO | 'S'::bpchar |
| 27 | siteclidepur | numeric | 10 | YES | NULL |
| 28 | sitefecalc | date |  | YES | NULL |
| 29 | sitecontnopres | numeric |  | YES | NULL |
| 30 | sitecontpres | numeric |  | YES | NULL |
| 31 | sitecontfsp0 | numeric | 10 | YES | NULL |
| 32 | sitesuspsum | numeric | 10 | YES | NULL |
| 33 | siterecsum | numeric | 10 | YES | NULL |

### situacioncobrojuicio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | scjcod | numeric | 5 | NO | NULL |
| 2 | scjtxtid | numeric | 10 | NO | NULL |

### socconcntramobl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sntsocpro | numeric | 10 | NO | NULL |
| 2 | sntcptoid | numeric | 5 | NO | NULL |

### socescision
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sessocidfin | numeric | 10 | NO | NULL |
| 2 | sessocidori | numeric | 10 | NO | NULL |

### socffcemail
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sfcsocid | numeric | 10 | NO | NULL |
| 2 | sfcfluid | character varying | 50 | NO | NULL |
| 3 | sfctipmail | numeric | 5 | NO | NULL |
| 4 | sfctipdocid | numeric | 5 | NO | NULL |
| 5 | sfcsubjmailid | numeric | 10 | NO | NULL |
| 6 | sfchtmlmailid | numeric | 10 | NO | NULL |

### socfftemail
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sffsocid | numeric | 10 | NO | NULL |
| 2 | sfffluid | character varying | 50 | NO | NULL |
| 3 | sfftipmail | numeric | 5 | NO | NULL |
| 4 | sffsubjmailid | numeric | 10 | NO | NULL |
| 5 | sffhtmlmailid | numeric | 10 | YES | NULL |
| 6 | sffppfid | character varying | 64 | YES | NULL |

### socfftsms
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sfssocid | numeric | 10 | NO | NULL |
| 2 | sfsfluid | character varying | 50 | NO | NULL |
| 3 | sfstiposms | numeric | 5 | NO | NULL |
| 4 | sfstipdocid | numeric | 5 | NO | NULL |
| 5 | sfssmsid | numeric | 10 | NO | NULL |

### socffviacom
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sffsocid | numeric | 10 | NO | NULL |
| 2 | sfffluid | character varying | 50 | NO | NULL |
| 3 | sffviacom | character | 2 | NO | NULL |

### socflujofirma
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sffsocid | numeric | 10 | NO | NULL |
| 2 | sfffluid | character varying | 50 | NO | NULL |
| 3 | sffnombre | character varying | 100 | NO | NULL |
| 4 | sfftipofirma | numeric | 5 | NO | NULL |
| 5 | sffsnprinc | character | 1 | NO | 'N'::bpchar |
| 6 | sffcaduc | numeric | 5 | YES | NULL |
| 7 | sfftipoenvdig | numeric | 5 | NO | 0 |
| 8 | sffhstusu | character varying | 10 | YES | NULL |
| 9 | sffhsthora | timestamp without time zone |  | YES | NULL |
| 10 | sffnumautcad | numeric | 5 | NO | '0'::numeric |
| 11 | sffnumaudblq | numeric | 5 | NO | '0'::numeric |
| 12 | sffsnenvcli | character | 1 | NO | 'N'::bpchar |

### socfpcuent
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sfpsocid | numeric | 10 | NO | NULL |
| 2 | sfpcanal | character | 1 | NO | NULL |
| 3 | sfpfmid | numeric | 5 | NO | NULL |
| 4 | sfpccid | numeric | 5 | NO | NULL |
| 5 | sfpdestes | character | 4 | YES | NULL |
| 6 | sfpbcr | character | 3 | YES | NULL |
| 7 | sfpcgastos | numeric | 5 | YES | NULL |
| 8 | sfptpimp | numeric | 5 | YES | NULL |
| 9 | sfphstusu | character varying | 10 | NO | NULL |
| 10 | sfphsthora | timestamp without time zone |  | NO | NULL |

### socgescob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sgcsocid | numeric | 10 | NO | NULL |
| 2 | sgcgesid | numeric | 10 | NO | NULL |
| 3 | sgcorden | numeric | 5 | NO | NULL |
| 4 | sgcalta | character | 1 | NO | 'S'::bpchar |

### sochub
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | shbsocprsid | numeric | 10 | NO | NULL |
| 2 | shbhubid | numeric | 5 | NO | NULL |
| 3 | shbplat | character varying | 10 | NO | NULL |
| 4 | shbsubent | character varying | 10 | NO | NULL |
| 5 | shbemail | character varying | 40 | YES | NULL |
| 6 | shbatrib1 | character varying | 20 | YES | NULL |
| 7 | shbatrib2 | character varying | 20 | YES | NULL |
| 8 | shbhstusu | character varying | 10 | NO | ' '::character varying |
| 9 | shbhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### sociedad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | socprsid | numeric | 10 | NO | NULL |
| 2 | soccodigo | character | 4 | NO | NULL |
| 3 | socdescri | character varying | 50 | NO | NULL |
| 4 | soctsocid | numeric | 5 | NO | NULL |
| 5 | socsngestora | character | 1 | NO | NULL |
| 6 | socdiasdb | numeric | 5 | NO | NULL |
| 7 | soctxtid | numeric | 10 | NO | NULL |
| 8 | soccodmansap | character | 3 | YES | NULL |
| 9 | soccodsocsap | character | 4 | YES | NULL |
| 10 | soccodentsum | character varying | 10 | YES | NULL |
| 11 | socsnremdef | character | 1 | NO | NULL |
| 12 | soctipoterm | numeric | 5 | YES | NULL |
| 13 | socnumcomer | character varying | 15 | YES | NULL |
| 14 | socnumterm | character varying | 15 | YES | NULL |
| 15 | socpwdterm | character varying | 20 | YES | NULL |
| 16 | soclimvalapte | numeric | 10 | YES | NULL |
| 17 | socdirlopd | character varying | 100 | YES | NULL |
| 18 | soccrisol | character | 2 | YES | NULL |
| 19 | sochstusu | character varying | 10 | NO | NULL |
| 20 | sochsthora | timestamp without time zone |  | NO | NULL |
| 21 | socurlofivirtual | character varying | 100 | YES | NULL |
| 22 | socnumdiremail | numeric | 5 | YES | NULL |
| 23 | socfipropfac | date |  | YES | NULL |
| 24 | socffpropfac | date |  | YES | NULL |
| 25 | socsnfforref | character | 1 | NO | 'N'::bpchar |
| 26 | socsnfforabo | character | 1 | NO | 'N'::bpchar |
| 27 | soctipagruimp | numeric | 5 | NO | 1 |
| 28 | soccodapo | numeric | 10 | YES | NULL |
| 29 | socsnmod340 | character | 1 | NO | 'N'::bpchar |
| 30 | socmaxlinidoc | numeric | 5 | YES | NULL |
| 31 | socususms | character varying | 200 | YES | NULL |
| 32 | socpwdsms | character varying | 200 | YES | NULL |
| 33 | socurllogo | character varying | 200 | YES | NULL |
| 34 | socsmsremi | character varying | 11 | YES | NULL |
| 35 | socemailremi | character varying | 110 | YES | NULL |
| 36 | socformfichintcont | character varying | 4 | NO | 'IDOC'::character varying |
| 37 | socsnsite | character | 1 | NO | 'S'::bpchar |
| 38 | socsistdeudext | character varying | 3 | NO | 'FRG'::character varying |
| 39 | socsngensedig | character | 1 | NO | 'N'::bpchar |
| 40 | soccfdcompr | numeric | 5 | YES | NULL |
| 41 | soccfdversion | character varying | 10 | YES | NULL |
| 42 | soccfdpago | numeric | 5 | YES | NULL |
| 43 | soccfdcondpago | numeric | 5 | YES | NULL |
| 44 | soccfdpobid | numeric | 10 | YES | NULL |
| 45 | soccfdregimen | numeric | 5 | YES | NULL |
| 46 | socprerefsepa | character | 2 | YES | NULL |
| 47 | socreurefsepa | numeric | 5 | NO | 0 |
| 48 | socsnactfacov | character | 1 | NO | 'S'::bpchar |
| 49 | socsnreffirm | character | 1 | NO | 'N'::bpchar |
| 50 | socsncertifdig | character | 1 | NO | 'S'::bpchar |
| 51 | socsnfacamojui | character | 1 | NO | 'N'::bpchar |
| 52 | soccodunico | character varying | 2 | NO | NULL |
| 53 | soccptoidrec | numeric | 5 | YES | NULL |
| 54 | socsnreagestor | character | 1 | NO | 'N'::bpchar |
| 55 | socfirid | numeric | 5 | YES | NULL |
| 56 | socagrucoc | numeric | 5 | YES | NULL |
| 57 | socremiemailaddress | character varying | 320 | YES | NULL |
| 58 | socsnfacurl | character | 1 | NO | 'N'::bpchar |
| 59 | socdiasfacurl | numeric | 5 | YES | NULL |
| 60 | soctwitter | character varying | 15 | YES | NULL |
| 61 | socnomfirma | character varying | 60 | YES | NULL |
| 62 | socaliascert | character varying | 25 | YES | NULL |
| 63 | socpwdcert | character varying | 100 | YES | NULL |
| 64 | soccomurlautlec | character varying | 100 | YES | NULL |
| 65 | socnomdpo | character varying | 200 | YES | NULL |
| 66 | socmaildpo | character varying | 200 | YES | NULL |
| 67 | soctelfdpo | numeric | 11 | YES | NULL |
| 68 | soccontarco | character varying | 90 | YES | NULL |
| 69 | socurldescfacov | numeric | 5 | YES | NULL |
| 70 | socconsintid | numeric | 10 | YES | NULL |
| 71 | socagprodatostxtid | numeric | 10 | YES | NULL |
| 72 | socwebagprodatos | character varying | 100 | YES | NULL |
| 73 | socnomgrafico | numeric | 10 | YES | NULL |
| 74 | socnvasalertas | character | 1 | NO | 'N'::bpchar |
| 75 | socsistelelec | numeric | 5 | NO | 1 |
| 76 | socidsocacua | character varying | 36 | YES | NULL |
| 77 | socidappplat | character varying | 36 | YES | NULL |
| 78 | soctokenacua | character varying | 65 | YES | NULL |
| 79 | socsndocpagourl | character | 1 | NO | 'N'::bpchar |
| 80 | socurlcortaofivirt | character varying | 100 | YES | NULL |
| 81 | socusrfirma | character varying | 50 | YES | NULL |
| 82 | socpwdfirma | character varying | 90 | YES | NULL |
| 83 | soccertid | character varying | 50 | YES | NULL |
| 84 | socpincertid | character varying | 90 | YES | NULL |

### socliquid
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | slqsocemis | numeric | 10 | NO | NULL |
| 2 | slqsocliq | numeric | 10 | NO | NULL |

### socopecuent
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | scosocid | numeric | 10 | NO | NULL |
| 2 | scotpope | numeric | 5 | NO | NULL |
| 3 | scoccid | numeric | 5 | NO | NULL |
| 4 | scohstusu | character varying | 10 | NO | NULL |
| 5 | scohsthora | timestamp without time zone |  | NO | NULL |
| 6 | scoactccodigo | character | 2 | YES | NULL |

### socpropliquid
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | splsocprop | numeric | 10 | NO | NULL |
| 2 | splsocliq | numeric | 10 | NO | NULL |

### socregmerc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | srmsocprsid | numeric | 10 | NO | NULL |
| 2 | srmlibro | character varying | 20 | YES | NULL |
| 3 | srmlocalidad | character varying | 20 | YES | NULL |
| 4 | srmhoja | character varying | 20 | YES | NULL |
| 5 | srmfolio | character varying | 20 | YES | NULL |
| 6 | srmseccion | character varying | 20 | YES | NULL |
| 7 | srmtomo | character varying | 20 | YES | NULL |
| 8 | srmotros | character varying | 20 | YES | NULL |

### socultsolacua
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 2 | sustippet | numeric | 5 | NO | NULL |
| 3 | susfecha | timestamp without time zone |  | NO | NULL |
| 4 | susparams | text |  | YES | NULL |
| 5 | susidsocdm | character varying | 36 | NO | NULL |

### socusutelec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sutsocid | numeric | 10 | NO | NULL |
| 2 | sutusu | character varying | 35 | NO | NULL |
| 3 | sutpwd | character varying | 256 | NO | NULL |
| 4 | sutcontcod | numeric | 5 | NO | NULL |
| 5 | sutoperid | numeric | 5 | NO | NULL |

### solacoaco
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | saasacid | numeric | 10 | NO | NULL |
| 2 | saaacoid | numeric | 10 | NO | NULL |

### solacocalibre
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sacasacid | numeric | 10 | NO | NULL |
| 2 | sacacalimm | numeric | 5 | NO | NULL |
| 3 | sacanumboc | numeric | 5 | NO | NULL |

### solacoclau
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | saclsacid | numeric | 10 | NO | NULL |
| 2 | saclclauid | numeric | 5 | NO | NULL |
| 3 | saclfecalta | date |  | NO | NULL |
| 4 | saclfecbaja | date |  | YES | NULL |

### solacodoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sadsacid | numeric | 10 | NO | NULL |
| 2 | saddconid | numeric | 10 | NO | NULL |
| 3 | sadsnreq | character | 1 | NO | NULL |
| 4 | sadsnpres | character | 1 | NO | NULL |
| 5 | sadfecpres | date |  | YES | NULL |

### solacoestado
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | saesacid | numeric | 10 | NO | NULL |
| 2 | saehorest | timestamp without time zone |  | NO | NULL |
| 3 | saeestado | numeric | 5 | NO | NULL |
| 4 | saeusuid | character varying | 10 | NO | NULL |

### solacoestec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | saetsacid | numeric | 10 | NO | NULL |
| 2 | saetrefcat | character varying | 30 | YES | NULL |
| 3 | saetcnttnum | numeric | 10 | YES | NULL |
| 4 | saettetid | numeric | 5 | YES | NULL |
| 5 | saetexpid | numeric | 5 | YES | NULL |
| 6 | saetschid | numeric | 5 | YES | NULL |
| 7 | saetsshid | numeric | 10 | YES | NULL |
| 8 | saetinsalc | date |  | YES | NULL |
| 9 | saetafealc | date |  | YES | NULL |
| 10 | saettipovar | numeric | 5 | YES | NULL |
| 11 | saetsnprov | character varying | 1 | NO | 'N'::character varying |
| 12 | saetcodrec | numeric | 14 | YES | NULL |
| 13 | saethstusu | character varying | 10 | YES | NULL |
| 14 | saethsthora | timestamp without time zone |  | YES | NULL |

### solacofto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | safsacid | numeric | 10 | NO | NULL |
| 2 | safftoid | numeric | 10 | NO | NULL |

### solacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sacid | numeric | 10 | NO | NULL |
| 2 | sacexpid | numeric | 5 | NO | NULL |
| 3 | sactsaid | numeric | 5 | NO | NULL |
| 4 | sacestado | numeric | 5 | NO | NULL |
| 5 | sacfecest | date |  | NO | NULL |
| 6 | sachorcresol | timestamp without time zone |  | NO | NULL |
| 7 | sachorcomcli | timestamp without time zone |  | YES | NULL |
| 8 | sachorrspcli | timestamp without time zone |  | YES | NULL |
| 9 | sactextrech | character varying | 80 | YES | NULL |
| 10 | sacdirid | numeric | 10 | NO | NULL |
| 11 | sacobsdir | character varying | 60 | YES | NULL |
| 12 | sacviacod | character | 2 | NO | NULL |
| 13 | sacfecprvini | date |  | YES | NULL |
| 14 | sacfecprvfin | date |  | YES | NULL |
| 15 | sacpeticionario | numeric | 10 | NO | NULL |
| 16 | sacpetnumdir | numeric | 5 | NO | NULL |
| 17 | sacpetcalid | numeric | 5 | NO | NULL |
| 18 | sacpetcalobj | numeric | 5 | NO | NULL |
| 19 | sacpropietario | numeric | 10 | NO | NULL |
| 20 | sacpropnumdir | numeric | 5 | NO | NULL |
| 21 | sacperscont | numeric | 10 | NO | NULL |
| 22 | sacinstalador | numeric | 10 | NO | NULL |
| 23 | sacnuminst | character varying | 15 | YES | NULL |
| 24 | sacinstreci | character varying | 15 | YES | NULL |
| 25 | sacdestofer | numeric | 5 | NO | NULL |
| 26 | sacfecimpsol | date |  | YES | NULL |
| 27 | sacftoid | numeric | 10 | YES | NULL |
| 28 | sacdescserv | character varying | 80 | YES | NULL |
| 29 | sacdescserv2 | character varying | 80 | YES | NULL |
| 30 | sacobssol | character varying | 80 | YES | NULL |
| 31 | sacobssol2 | character varying | 80 | YES | NULL |
| 32 | sactipinst | numeric | 5 | NO | NULL |
| 33 | sacacotipo | numeric | 5 | NO | NULL |
| 34 | sactipotrab | numeric | 5 | NO | NULL |
| 35 | sacnumplantas | numeric | 5 | YES | NULL |
| 36 | sacsngrpres | character | 1 | NO | NULL |
| 37 | sacplgrpres | numeric | 5 | YES | NULL |
| 38 | sacusocod | numeric | 5 | NO | NULL |
| 39 | saccarinst | character varying | 80 | YES | NULL |
| 40 | sacsnagpot | character | 1 | NO | NULL |
| 41 | sacsnsan | character | 1 | NO | NULL |
| 42 | sacnumsprin | numeric | 5 | YES | NULL |
| 43 | sacsitbocinc | character varying | 15 | YES | NULL |
| 44 | sacfecfinaco | date |  | YES | NULL |
| 45 | sacfecfinobra | date |  | YES | NULL |
| 46 | sacacocaudal | numeric | 6,2 | YES | NULL |
| 47 | sacobsid | numeric | 10 | YES | NULL |
| 48 | sacptosid | numeric | 10 | YES | NULL |
| 49 | saccnttnum | numeric | 10 | YES | NULL |
| 50 | sacfeccadclau | date |  | YES | NULL |
| 51 | sacdirplanta | character | 4 | YES | NULL |
| 52 | sacdirpuerta | character | 4 | YES | NULL |
| 53 | sachstusu | character varying | 10 | NO | NULL |
| 54 | sachsthora | timestamp without time zone |  | NO | NULL |
| 55 | sacnumfacti | character varying | 20 | YES | NULL |
| 56 | sacnumoficio | character varying | 50 | YES | NULL |
| 57 | sacfolio | character varying | 20 | YES | NULL |
| 58 | sacfecoficio | timestamp without time zone |  | YES | NULL |
| 59 | sacstatus | character varying | 20 | YES | NULL |
| 60 | saccosto | numeric | 18,2 | YES | NULL |
| 61 | sacgasto | double precision | 53 | YES | NULL |
| 62 | sacunidades | numeric | 5 | YES | NULL |

### solacoorden
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | saopsacid | numeric | 10 | NO | NULL |
| 2 | saoordid | numeric | 10 | NO | NULL |

### solacopres
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sapsacid | numeric | 10 | NO | NULL |
| 2 | sapnumpres | numeric | 5 | NO | NULL |
| 3 | sapfecpres | date |  | NO | NULL |
| 4 | saporganismo | numeric | 10 | NO | NULL |
| 5 | sapsnayunt | character | 1 | NO | NULL |
| 6 | sapfecprev | date |  | NO | NULL |
| 7 | sapfecresp | date |  | YES | NULL |
| 8 | sapresult | numeric | 5 | YES | NULL |
| 9 | saptextresult | character varying | 80 | YES | NULL |

### solacotptoserv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | satpsacid | numeric | 10 | NO | NULL |
| 2 | satptpsid | numeric | 5 | NO | NULL |
| 3 | satpnumsum | numeric | 5 | NO | NULL |
| 4 | satptsumid | numeric | 5 | YES | NULL |
| 5 | satpfsumcod | numeric | 5 | YES | NULL |

### solbonif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sbid | numeric | 10 | NO | NULL |
| 2 | sbcnttnum | numeric | 10 | NO | NULL |
| 3 | sbtbid | numeric | 5 | NO | NULL |
| 4 | sbfeccrea | date |  | NO | NULL |
| 5 | sbusucrea | character varying | 10 | NO | NULL |
| 6 | sbfecaplic | date |  | YES | NULL |
| 7 | sbusuaplic | character varying | 10 | YES | NULL |
| 8 | sbfecini | date |  | NO | NULL |
| 9 | sbfecfin | date |  | YES | NULL |
| 10 | sbestado | numeric | 5 | NO | NULL |
| 11 | sbfecestado | date |  | NO | NULL |
| 12 | sbdiasavisovenc | numeric | 5 | YES | NULL |
| 13 | sbviacod | character | 2 | YES | NULL |
| 14 | sbpenalizado | character | 1 | NO | 'N'::bpchar |
| 15 | tbconceid | numeric | 5 | YES | NULL |
| 16 | tbtiptid | numeric | 5 | YES | NULL |
| 17 | sbhstusu | character varying | 10 | NO | NULL |
| 18 | sbhsthora | timestamp without time zone |  | NO | NULL |
| 19 | sbexpid | numeric | 5 | NO | NULL |
| 20 | sbpcidavi | numeric |  | YES | NULL |
| 21 | sbpcidre | numeric |  | YES | NULL |

### solbonifdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sbdsbid | numeric | 10 | NO | NULL |
| 2 | sbddconid | numeric | 10 | NO | NULL |
| 3 | sbdsnreq | character | 1 | NO | NULL |
| 4 | sbdsnpres | character | 1 | NO | NULL |
| 5 | sbdsnobligat | character | 1 | NO | NULL |
| 6 | sbdfecpres | date |  | YES | NULL |

### solbonifpres
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sbpsbid | numeric | 10 | NO | NULL |
| 2 | sbpnumpres | numeric | 5 | NO | NULL |
| 3 | sbpprsid | numeric | 10 | YES | NULL |
| 4 | sbpfecprev | date |  | YES | NULL |
| 5 | sbpfecpres | date |  | YES | NULL |
| 6 | sbpfecresp | date |  | YES | NULL |
| 7 | sbpresult | numeric | 5 | YES | NULL |
| 8 | sbptextresult | character varying | 80 | YES | NULL |
| 9 | sbpmotrechazo | numeric | 5 | YES | NULL |
| 10 | sbpusuario | character varying | 10 | NO | NULL |
| 11 | sbphora | timestamp without time zone |  | NO | NULL |

### solbonifvar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sbvsbid | numeric | 10 | NO | NULL |
| 2 | sbvtpvid | numeric | 5 | NO | NULL |
| 3 | sbvvaldef | character | 10 | NO | NULL |
| 4 | sbvhstusu | character varying | 10 | NO | NULL |
| 5 | sbvhsthora | timestamp without time zone |  | NO | NULL |

### solicitudaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sacaid | numeric | 10 | NO | NULL |
| 2 | sacaestado | numeric | 5 | NO | NULL |
| 3 | sacaorigen | character | 1 | NO | NULL |
| 4 | sacaprocinc | numeric | 10 | YES | NULL |
| 5 | sacaproccom | numeric | 10 | YES | NULL |
| 6 | sacarestram | character | 2 | NO | NULL |
| 7 | sacafeccrea | date |  | NO | NULL |
| 8 | sacafeciniaplic | date |  | NO | NULL |
| 9 | sacafecfinaplic | date |  | YES | NULL |
| 10 | sacanumhabreal | numeric | 5 | NO | NULL |
| 11 | sacanumhabvirt | numeric | 5 | YES | NULL |
| 12 | sacarevcenso | character | 1 | NO | 'S'::bpchar |
| 13 | sacacensoval | numeric | 5 | NO | 3 |
| 14 | sacatpdoc | numeric | 5 | NO | NULL |
| 15 | sacanumdoc | character varying | 15 | NO | NULL |
| 16 | sacacnttnum | numeric | 10 | YES | NULL |
| 17 | sacacodentsum | numeric | 10 | YES | NULL |
| 18 | sacacodine | character varying | 6 | YES | NULL |
| 19 | sacapolaca | numeric | 10 | YES | NULL |
| 20 | sacamotanultxtid | numeric | 10 | YES | NULL |
| 21 | sacamotres | numeric | 5 | YES | NULL |
| 22 | sacaapel1 | character varying | 25 | NO | NULL |
| 23 | sacaapel2 | character varying | 25 | YES | NULL |
| 24 | sacanombre | character varying | 20 | NO | NULL |
| 25 | sacatfno | character varying | 16 | YES | NULL |
| 26 | sacamovil | character varying | 16 | YES | NULL |
| 27 | sacaemail | character varying | 100 | YES | NULL |
| 28 | sacatipovia | character | 2 | YES | NULL |
| 29 | sacanomvia | character varying | 50 | YES | NULL |
| 30 | sacanumvia | character varying | 4 | YES | NULL |
| 31 | sacaletra | character | 1 | YES | NULL |
| 32 | sacabloque | character | 2 | YES | NULL |
| 33 | sacaescalera | character | 2 | YES | NULL |
| 34 | sacaplanta | character | 3 | YES | NULL |
| 35 | sacapuerta | character | 4 | YES | NULL |
| 36 | sacacodpostal | character | 5 | YES | NULL |
| 37 | sacahstusu | character varying | 10 | NO | NULL |
| 38 | sacahsthora | timestamp without time zone |  | NO | NULL |
| 39 | sacaclaseproc | numeric | 5 | NO | 1 |
| 40 | sacasituabo | numeric | 5 | YES | NULL |

### solproccontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | spcid | numeric | 10 | NO | NULL |
| 2 | spcexpid | numeric | 5 | NO | NULL |
| 3 | spctctcod | numeric | 10 | NO | NULL |
| 4 | spcptosid | numeric | 10 | NO | NULL |
| 5 | spcprssol | numeric | 10 | NO | NULL |
| 6 | spcvia | character | 2 | NO | NULL |
| 7 | spcdiascaduca | numeric | 5 | YES | NULL |
| 8 | spcperiid | numeric | 5 | NO | NULL |
| 9 | spctclicod | character | 1 | NO | NULL |
| 10 | spcordid | numeric | 10 | YES | NULL |
| 11 | spcpccid | numeric | 10 | YES | NULL |
| 20 | spcfeccrea | timestamp without time zone |  | NO | NULL |
| 21 | spcusucrea | character varying | 10 | NO | NULL |
| 22 | spcoficrea | numeric | 5 | NO | NULL |
| 23 | spcfeccanul | timestamp without time zone |  | YES | NULL |
| 24 | spcusuanul | character varying | 10 | YES | NULL |
| 25 | spcfecnotif | timestamp without time zone |  | YES | NULL |
| 26 | spcvianotif | character | 2 | YES | NULL |
| 27 | spctipotelec | numeric | 5 | YES | NULL |
| 28 | spccnttnum | numeric | 10 | NO | NULL |
| 29 | spcpcsid | numeric | 10 | YES | NULL |

### solproccontradoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | spcdspcid | numeric | 10 | NO | NULL |
| 2 | spcddconid | numeric | 10 | NO | NULL |
| 4 | spcdprs | character | 1 | NO | 'N'::bpchar |

### spdemarca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | smamid | numeric | 5 | NO | NULL |
| 2 | smadesdes | numeric | 5 | NO | NULL |
| 3 | smahasta | numeric | 5 | YES | NULL |
| 4 | smacodigo | character | 1 | NO | NULL |
| 5 | smahstusu | character | 10 | NO | 'SERVIDOR'::bpchar |
| 6 | smahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | smaactivo | character | 1 | NO | 'S'::bpchar |

### spdemodelo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | smomaid | numeric | 5 | NO | NULL |
| 2 | smomoid | numeric | 5 | NO | NULL |
| 3 | smodesdes | numeric | 5 | NO | NULL |
| 4 | smohasta | numeric | 5 | YES | NULL |
| 5 | smocodigo | character | 1 | NO | NULL |
| 6 | smohstusu | character | 10 | NO | 'SERVIDOR'::bpchar |
| 7 | smohsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 8 | smoactivo | character | 1 | NO | 'S'::bpchar |

### srvcprec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | scpexpid | numeric | 5 | NO | NULL |
| 2 | scpcodid | numeric | 5 | NO | NULL |
| 3 | scpcontcod | numeric | 5 | NO | NULL |
| 4 | scpfecapli | date |  | NO | NULL |
| 5 | scpprecio | numeric | 8,5 | NO | NULL |

### stipoqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | stquid | numeric | 5 | NO | NULL |
| 2 | stqudesc | character varying | 30 | NO | NULL |

### subconceptosov
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | scpovid | numeric | 5 | NO | NULL |
| 2 | scpovtxtid | numeric | 10 | NO | NULL |

### subestadosjuicio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sbjcod | numeric | 5 | NO | NULL |
| 2 | sbjtxtid | numeric | 10 | NO | NULL |

### subremsicer
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sbrsid | numeric | 10 | NO | NULL |
| 2 | sbrspcsid | numeric | 10 | NO | NULL |
| 3 | sbrstipenv | numeric | 5 | NO | NULL |
| 4 | sbrscodserade | character varying | 8 | NO | NULL |
| 5 | sbrsimpdid | numeric | 10 | NO | NULL |
| 6 | sbrsrmsid | numeric | 10 | YES | NULL |
| 7 | sbrsestado | numeric | 5 | NO | NULL |
| 8 | sbrsfeccrea | date |  | NO | CURRENT_DATE |
| 9 | sbrsusucrea | character varying | 10 | NO | 'CONVERSION'::character varying |

### subsechidra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sshid | numeric | 10 | NO | NULL |
| 2 | sshdesc | character varying | 50 | NO | NULL |
| 3 | sshexpid | numeric | 5 | NO | NULL |
| 4 | sshcodgis | character varying | 50 | YES | NULL |

### sucesosif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | susid | numeric | 10 | NO | NULL |
| 2 | susexpid | numeric | 10 | NO | NULL |
| 3 | sustpsuces | numeric | 5 | NO | NULL |
| 4 | susfsuceso | date |  | NO | NULL |
| 5 | sustexto | character varying | 250 | YES | NULL |
| 6 | susaccion1 | numeric | 5 | YES | NULL |
| 7 | susaccion2 | numeric | 5 | YES | NULL |
| 8 | susfenvcap | date |  | YES | NULL |
| 9 | susnumacci | numeric | 5 | YES | NULL |
| 10 | sususuidses | character varying | 10 | NO | NULL |
| 11 | susfechases | date |  | NO | NULL |
| 12 | susofiid | numeric | 5 | NO | NULL |
| 13 | suspcsid | numeric | 10 | YES | NULL |
| 14 | suspdf | bytea |  | YES | NULL |

### sucrevcambsen
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | sucrcsid | numeric | 10 | NO | NULL |
| 2 | sucrrevid | numeric | 10 | NO | NULL |
| 3 | sucrnotifid | numeric | 5 | YES | NULL |
| 4 | sucrmensaje | character varying | 200 | YES | NULL |
| 5 | sucrexpid | numeric | 5 | YES | NULL |
| 6 | sucrbandestfich | character | 16 | YES | NULL |
| 7 | sucrbandestid | numeric | 5 | YES | NULL |
| 8 | sucrreffich | character varying | 35 | YES | NULL |
| 9 | sucrrefmid | numeric | 10 | YES | NULL |
| 10 | sucrsegnasfich | character varying | 34 | YES | NULL |
| 11 | sucrsegnasant | character varying | 34 | YES | NULL |
| 12 | sucrcnttnum | numeric | 10 | YES | NULL |
| 13 | sucrgescprsid | numeric | 10 | YES | NULL |
| 14 | sucrcompgid | numeric | 10 | YES | NULL |
