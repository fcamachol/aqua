# Database Map - Tables H*
## Schema: cf_quere_pro

**Total tables: 231**

### hisaccesos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hacchstusu | character varying | 10 | NO | NULL |
| 2 | hacchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 3 | hacctipo | numeric | 5,0 | NO | NULL |
| 4 | haccobjid | numeric | 10,0 | NO | NULL |

### hisacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hacoid | numeric | 10,0 | NO | NULL |
| 2 | hacodirid | numeric | 10,0 | NO | NULL |
| 3 | hacotetid | numeric | 5,0 | NO | NULL |
| 4 | hacoexpid | numeric | 5,0 | NO | NULL |
| 5 | hacomatcod | character | 4 | YES | NULL |
| 6 | hacotipvalc | character | 4 | YES | NULL |
| 7 | hacoproext | numeric | 5,0 | NO | NULL |
| 8 | hacoproint | numeric | 5,0 | NO | NULL |
| 9 | hacohojrev | numeric | 10,0 | YES | NULL |
| 10 | hacohojtra | numeric | 10,0 | YES | NULL |
| 11 | hacocalmat | numeric | 5,0 | YES | NULL |
| 12 | hacocalval | numeric | 5,0 | YES | NULL |
| 13 | hacolong | double precision | 53 | YES | NULL |
| 14 | hacofecins | date |  | NO | NULL |
| 15 | hacofectap | date |  | YES | NULL |
| 16 | hacosndig | character | 1 | NO | NULL |
| 17 | hacoobsid | numeric | 10,0 | YES | NULL |
| 18 | hacopep | character varying | 15 | YES | NULL |
| 19 | hacoestado | numeric | 5,0 | NO | NULL |
| 20 | hacotipo | numeric | 5,0 | NO | NULL |
| 21 | hacocalimm | numeric | 5,0 | YES | NULL |
| 22 | hacoschid | numeric | 5,0 | YES | NULL |
| 23 | hacopepreno | character varying | 15 | YES | NULL |
| 24 | hacopeptapo | character varying | 15 | YES | NULL |
| 25 | hacorvaid | numeric | 10,0 | YES | NULL |
| 26 | hacoacoidprov | numeric | 10,0 | YES | NULL |
| 27 | haconumviv | numeric | 5,0 | YES | NULL |
| 28 | hacocalimm2 | numeric | 5,0 | YES | NULL |
| 29 | hacocaudal | numeric | 6,2 | YES | NULL |
| 30 | hacosshid | numeric | 10,0 | YES | NULL |
| 31 | hacopresmin | numeric | 6,2 | YES | NULL |
| 32 | hacohstusu | character varying | 10 | NO | ' '::character varying |
| 33 | hacohsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 34 | hacodireccion | character varying | 110 | YES | NULL |
| 35 | hacopresmax | numeric | 6,2 | YES | NULL |
| 36 | hacoindunif | character | 1 | YES | NULL |
| 37 | hacoptosid | numeric | 10,0 | YES | NULL |

### hisactsucsif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 2 | hacssifid | numeric | 5,0 | YES | NULL |
| 3 | hacssifidioma | character | 2 | YES | NULL |
| 4 | hacssifddesc | character varying | 1000 | YES | NULL |
| 5 | hacssifhstusu | character varying | 10 | YES | 'CONVERSION'::character varying |
| 6 | hacssifhsthora | timestamp without time zone |  | YES | CURRENT_TIMESTAMP |

### hisagrcontar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hactconid | numeric | 5,0 | NO | NULL |
| 2 | hacttiptid | numeric | 5,0 | NO | NULL |
| 3 | hactagid | numeric | 5,0 | NO | NULL |
| 4 | hacthstusu | character varying | 10 | NO | NULL |
| 5 | hacthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisaltpasoproced
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | happid | numeric | 10,0 | NO | NULL |
| 2 | happpasid | numeric | 10,0 | NO | NULL |
| 3 | happorden | numeric | 10,0 | NO | NULL |
| 4 | happnumpassig | numeric | 10,0 | YES | NULL |
| 5 | happtpcond | numeric | 5,0 | NO | NULL |
| 6 | happlistval | character varying | 100 | YES | NULL |
| 7 | happvalnum | numeric | 10,0 | YES | NULL |
| 8 | happvalnumhasta | numeric | 10,0 | YES | NULL |
| 9 | happvalsn | character | 1 | YES | NULL |
| 10 | happhstusu | character varying | 10 | YES | NULL::character varying |
| 11 | happhsthora | timestamp without time zone |  | YES | NULL |
| 12 | happpasomaestro | numeric | 10,0 | YES | NULL |
| 13 | happsnvigente | character | 1 | NO | 'S'::bpchar |

### hisaolimiteconsumo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | haolexpid | numeric | 5,0 | NO | NULL |
| 2 | haolacccod | character varying | 2 | NO | NULL |
| 3 | haolobscod | character varying | 2 | NO | NULL |
| 4 | haoltiplote | character varying | 1 | NO | NULL |
| 5 | haolsntelelec | character varying | 1 | NO | 'N'::character varying |
| 6 | haolperiid | numeric | 5,0 | NO | NULL |
| 7 | haolcptoid | numeric | 5,0 | NO | NULL |
| 8 | haolfmtcod | numeric | 5,0 | NO | NULL |
| 9 | haolliminf | numeric | 10,0 | YES | NULL |
| 10 | haollimsup | numeric | 10,0 | YES | NULL |
| 11 | haolhstusu | character varying | 10 | NO | ''::character varying |
| 12 | haolhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisapliccpto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hapcexpid | numeric | 5,0 | NO | NULL |
| 2 | hapccptoid | numeric | 5,0 | NO | NULL |
| 3 | hapcfecini | date |  | NO | NULL |
| 4 | hapcfecfin | date |  | YES | NULL |
| 5 | hapcsocemi | numeric | 10,0 | NO | NULL |
| 6 | hapcsocpro | numeric | 10,0 | NO | NULL |
| 7 | hapchstusu | character varying | 10 | NO | NULL |
| 8 | hapchsthora | timestamp without time zone |  | NO | NULL |
| 9 | hapcsnaboac | character | 1 | NO | 'N'::bpchar |
| 10 | hapcsnrefac | character | 1 | NO | 'N'::bpchar |
| 11 | hapcsnaboeac | character | 1 | NO | 'N'::bpchar |
| 12 | hapcsnrefeac | character | 1 | NO | 'N'::bpchar |

### hisaplicimpues
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hapiid | numeric | 5,0 | NO | NULL |
| 2 | hapitimpuid | numeric | 5,0 | NO | NULL |
| 3 | hapifecini | date |  | NO | NULL |
| 4 | hapifecfin | date |  | YES | NULL |
| 5 | hapivalor | numeric | 5,4 | NO | NULL |
| 6 | hapihstusu | character varying | 10 | NO | NULL |
| 7 | hapihsthora | timestamp without time zone |  | NO | NULL |
| 8 | hapisnnoexe | character | 1 | NO | 'N'::bpchar |
| 9 | hapisnnosujeto | character | 1 | NO | 'N'::bpchar |

### hisaplictarif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | haptexpid | numeric | 5,0 | NO | NULL |
| 2 | haptcptoid | numeric | 5,0 | NO | NULL |
| 3 | hapttarid | numeric | 5,0 | NO | NULL |
| 4 | haptfecapl | date |  | NO | NULL |
| 5 | haptfecfin | date |  | YES | NULL |
| 6 | haptpubid | numeric | 5,0 | NO | NULL |
| 7 | haptcoment | character varying | 70 | YES | NULL |
| 8 | haptaplifecini | date |  | NO | NULL |
| 9 | hapthstusu | character varying | 10 | NO | NULL |
| 10 | hapthsthora | timestamp without time zone |  | NO | NULL |

### hisasignpolnegusoexp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hapnueid | numeric | 10,0 | NO | NULL |
| 2 | hapnueexpid | numeric | 5,0 | NO | NULL |
| 3 | hapnueusocod | numeric | 5,0 | NO | NULL |
| 4 | hapnuenumcicimpdesde | numeric | 5,0 | NO | NULL |
| 5 | hapnuenumicimphasta | numeric | 5,0 | NO | NULL |
| 6 | hapnuepneid | numeric | 10,0 | NO | NULL |
| 7 | hapnueuser | character varying | 20 | NO | NULL |
| 8 | hapnuehora | timestamp without time zone |  | NO | NULL |

### hisbancogestor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hbngsocprsid | numeric | 10,0 | NO | NULL |
| 2 | hbngbanid | numeric | 5,0 | NO | NULL |
| 3 | hbngpercont | character varying | 27 | YES | NULL |
| 4 | hbngtelef | character varying | 16 | YES | NULL |
| 5 | hbngsufijo | numeric | 3,0 | YES | NULL |
| 6 | hbngcremesa | numeric | 9,2 | YES | NULL |
| 7 | hbngcdevol | numeric | 9,2 | YES | NULL |
| 8 | hbngcdomic | numeric | 9,2 | YES | NULL |
| 9 | hbngcvenban | numeric | 9,2 | YES | NULL |
| 10 | hbnghstusu | character varying | 10 | NO | NULL |
| 11 | hbnghsthora | timestamp without time zone |  | NO | NULL |
| 12 | hbngsndefrem | character | 1 | NO | 'N'::bpchar |
| 13 | hbngdiaspradesepa | numeric | 5,0 | YES | NULL |
| 14 | hbngdiassigadesepa | numeric | 5,0 | YES | NULL |
| 15 | hbngdiasemiremabono | numeric | 5,0 | YES | NULL |
| 16 | hbngformxmlrem | numeric | 5,0 | YES | NULL |
| 17 | hbngvalxmlrem | character | 1 | YES | NULL |
| 18 | hbngformxmltrf | numeric | 5,0 | YES | NULL |
| 19 | hbngvalxmltrf | character | 1 | YES | NULL |
| 20 | hbngtipoplataf | numeric | 5,0 | NO | 1 |

### hisbarrio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hbarrid | numeric | 5,0 | NO | NULL |
| 2 | hbarrlocid | numeric | 10,0 | NO | NULL |
| 3 | hbarrnombre | character varying | 100 | NO | NULL |
| 4 | hbarrhstusu | character varying | 10 | NO | NULL |
| 5 | hbarrhsthora | timestamp without time zone |  | NO | NULL |
| 6 | hbarrtipobarrio | character varying | 30 | YES | NULL |

### hisbolpubtar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hbptid | numeric | 5,0 | NO | NULL |
| 2 | hbptexpid | numeric | 5,0 | NO | NULL |
| 3 | hbptpubtexto | character | 50 | NO | NULL |
| 4 | hbptfecha | date |  | NO | NULL |
| 5 | hbpthstusu | character varying | 10 | NO | NULL |
| 6 | hbpthsthora | timestamp without time zone |  | NO | NULL |

### hisbonific
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hbfprsid | numeric | 10,0 | NO | NULL |
| 2 | hbfcobrnom | character | 1 | NO | NULL |
| 3 | hbfplazo | numeric | 5,0 | NO | NULL |
| 4 | hbfhstusu | character varying | 10 | NO | NULL |
| 5 | hbfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hiscalle
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcalid | numeric | 10,0 | NO | NULL |
| 2 | hcalparimp | numeric | 5,0 | NO | NULL |
| 3 | hcalnumdes | numeric | 10,0 | NO | NULL |
| 4 | hcalcodpost | character varying | 10 | NO | NULL |
| 5 | hcaltpctcid | numeric | 5,0 | YES | NULL |
| 6 | hcalhstusu | character varying | 10 | NO | NULL |
| 7 | hcalhsthora | timestamp without time zone |  | NO | NULL |

### hiscausaborefac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcarorigen | numeric | 5,0 | NO | NULL |
| 2 | hcarcodigo | numeric | 5,0 | NO | NULL |
| 3 | hcartxtid | numeric | 10,0 | NO | NULL |
| 4 | hcarsnerrfact | character | 1 | NO | 'S'::bpchar |
| 5 | hcarhstusu | character varying | 10 | NO | NULL |
| 6 | hcarhsthora | timestamp without time zone |  | NO | NULL |
| 7 | hcardescrip | character varying | 1000 | NO | NULL |
| 8 | hcaridioma | character | 2 | NO | 'es'::bpchar |
| 9 | hcarsnreciva | character | 1 | NO | 'N'::bpchar |
| 10 | hcarsnfuga | character | 1 | NO | 'N'::bpchar |

### hiscentroadmin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcadmid | numeric | 5,0 | NO | NULL |
| 2 | hcadmdesc | character varying | 50 | YES | NULL |
| 3 | hcadmcodcen | character varying | 25 | NO | NULL |
| 4 | hcadmdirid | numeric | 10,0 | NO | NULL |
| 5 | hcadmrol | numeric | 5,0 | NO | NULL |
| 6 | hcadhstusu | character varying | 10 | NO | ' '::character varying |
| 7 | hcadhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hiscierre
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcieid | numeric | 10,0 | NO | NULL |
| 2 | hciegisid | numeric | 10,0 | NO | NULL |
| 3 | hcieexpid | numeric | 5,0 | NO | NULL |
| 4 | hciedesccierre | character varying | 150 | NO | NULL |
| 5 | hciecierreprog | numeric | 5,0 | NO | NULL |
| 6 | hcieestado | numeric | 5,0 | NO | NULL |
| 7 | hciefinicorte | timestamp without time zone |  | NO | NULL |
| 8 | hcieffincorte | timestamp without time zone |  | NO | NULL |
| 9 | hciefrealcorte | timestamp without time zone |  | YES | NULL |
| 10 | hcieactivsumin | timestamp without time zone |  | YES | NULL |
| 11 | hciemotdesco | character varying | 150 | NO | NULL |
| 12 | hcieobsid | numeric | 10,0 | YES | NULL |
| 13 | hcierespaprob | character varying | 60 | NO | NULL |
| 14 | hcieidioma | character | 2 | NO | NULL |
| 15 | hciecalle | character varying | 150 | YES | NULL |
| 16 | hciehstusu | character | 10 | NO | NULL |
| 17 | hciehsthora | timestamp without time zone |  | YES | NULL |
| 18 | hciedifhoraria | numeric | 5,0 | YES | NULL |

### hiscierreacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hciaacoid | numeric | 10,0 | NO | NULL |
| 2 | hciacieid | numeric | 10,0 | NO | NULL |
| 3 | hciaacoexcl | character | 1 | NO | NULL |
| 4 | hciafecinc | timestamp without time zone |  | NO | NULL |
| 5 | hciatpfid | numeric | 10,0 | YES | NULL |
| 6 | hciaacoope | character | 1 | YES | NULL |
| 7 | hciahstusu | character | 10 | NO | NULL |
| 8 | hciahsthora | timestamp without time zone |  | NO | NULL |

### hisclascontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hclsccod | character | 2 | NO | NULL |
| 2 | hclsctxtid | numeric | 10,0 | NO | NULL |
| 3 | hclscptoest | numeric | 5,0 | NO | NULL |
| 4 | hclsccedcon | character | 1 | NO | NULL |
| 5 | hclschstusu | character varying | 10 | NO | ' '::character varying |
| 6 | hclschsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | hclsctddesc | character varying | 1000 | NO | NULL |
| 8 | hclscidioma | character | 2 | NO | NULL |

### hisclaveconta
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcvctasid | numeric | 5,0 | NO | NULL |
| 2 | hcvctpcnt | character | 1 | NO | NULL |
| 3 | hcvcdebhab | character | 1 | NO | NULL |
| 4 | hcvcregimen | character | 1 | NO | NULL |
| 5 | hcvcclave | character | 2 | NO | NULL |
| 6 | hcvcsnactivo | character | 1 | NO | NULL |
| 7 | hcvchstusu | character varying | 10 | NO | NULL |
| 8 | hcvchsthora | timestamp without time zone |  | NO | NULL |

### hiscliente
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcliid | numeric | 10,0 | NO | NULL |
| 2 | hclicenfis | numeric | 5,0 | YES | NULL |
| 3 | hclicenpag | numeric | 5,0 | YES | NULL |
| 4 | hclicenrecp | numeric | 5,0 | YES | NULL |
| 5 | hclihubid | numeric | 5,0 | YES | NULL |
| 6 | hclicodcli | character varying | 10 | YES | NULL |
| 7 | hclisubent | character varying | 10 | YES | NULL |
| 8 | hclihstusu | character varying | 10 | NO | ' '::character varying |
| 9 | hclihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 10 | hclicencomp | numeric | 5,0 | YES | NULL |
| 11 | hclitipo | character | 1 | YES | NULL |
| 12 | hclifmpcanal | character | 1 | YES | NULL |
| 13 | hclifmpid | numeric | 5,0 | YES | NULL |
| 14 | hclicfdpago | numeric | 5,0 | YES | NULL |
| 15 | hcliregfiscal | character varying | 10 | YES | NULL |

### hiscomemail
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hiscmeid | numeric | 10,0 | YES | NULL |
| 2 | hiscmeprsid | numeric | 10,0 | YES | NULL |
| 3 | hiscmecosid | numeric | 10,0 | YES | NULL |
| 4 | hiscmeasunto | character varying | 50 | YES | NULL |
| 5 | hiscmecuerpo | character varying | 3000 | YES | NULL |
| 6 | hiscmeenvio | timestamp without time zone |  | YES | NULL |
| 7 | hiscmeusuenvio | character | 10 | YES | NULL |
| 8 | hiscmeidioma | character | 5 | YES | 'es'::bpchar |
| 9 | hiscmeemail | character varying | 110 | YES | ''::character varying |
| 10 | hiscmefechacreacion | timestamp without time zone |  | YES | NULL |
| 11 | hiscmeusucreacion | character | 10 | YES | NULL |
| 12 | hiscmefechaanulacion | timestamp without time zone |  | YES | NULL |
| 13 | hiscmeusuanulacion | character | 10 | YES | NULL |
| 14 | hiscmefecharetencion | timestamp without time zone |  | YES | NULL |
| 15 | hiscmeusuretencion | character | 10 | YES | NULL |
| 16 | hiscmeidenvio | character varying | 50 | YES | NULL |
| 17 | hiscmeiderrorenvio | numeric | 5,0 | YES | NULL |
| 18 | hiscmefechareenvio | timestamp without time zone |  | YES | NULL |
| 19 | hiscmepcsid | numeric | 10,0 | YES | NULL |
| 20 | hiscmeidpaquete | character varying | 50 | YES | NULL |
| 21 | hiscmeestado | numeric | 5,0 | YES | NULL |
| 22 | hiscmeprioridad | numeric | 5,0 | YES | NULL |
| 23 | hiscmetiempovida | date |  | YES | NULL |
| 24 | hiscmeusuario | character | 10 | YES | NULL |
| 25 | hiscmefechamod | timestamp without time zone |  | YES | CURRENT_TIMESTAMP |
| 26 | hiscmefechaenvprov | timestamp without time zone |  | YES | NULL |
| 27 | hiscmeidsubestdesc | numeric | 10,0 | YES | NULL |

### hiscomsms
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hiscmsid | numeric | 10,0 | YES | NULL |
| 2 | hiscmscosid | numeric | 10,0 | YES | NULL |
| 3 | hiscmsidioma | character | 5 | YES | NULL |
| 4 | hiscmstelefono | character varying | 16 | YES | NULL |
| 5 | hiscmsfechacreacion | timestamp without time zone |  | YES | NULL |
| 6 | hiscmsusucreacion | character | 10 | YES | NULL |
| 7 | hiscmsfechaenvio | timestamp without time zone |  | YES | NULL |
| 8 | hiscmsusuenvio | character | 10 | YES | NULL |
| 9 | hiscmsfechanulacion | timestamp without time zone |  | YES | NULL |
| 10 | hiscmsusuanulacion | character | 10 | YES | NULL |
| 11 | hiscmsfecharetencion | timestamp without time zone |  | YES | NULL |
| 12 | hiscmsusuretencion | character | 10 | YES | NULL |
| 13 | hiscmsidenvio | character varying | 50 | YES | NULL |
| 14 | hiscmsiderrorenvio | numeric | 5,0 | YES | NULL |
| 15 | hiscmsfechareenvio | timestamp without time zone |  | YES | NULL |
| 16 | hiscmspcsid | numeric | 10,0 | YES | NULL |
| 17 | hiscmsidpaquete | character varying | 50 | YES | NULL |
| 18 | hiscmsestado | numeric | 5,0 | YES | NULL |
| 19 | hiscmsprioridad | numeric | 5,0 | YES | NULL |
| 20 | hiscmstiempovida | date |  | YES | NULL |
| 21 | hiscmsusuario | character | 10 | YES | NULL |
| 22 | hiscmsfechamod | timestamp without time zone |  | YES | NULL |
| 23 | hiscmslongitudsms | numeric | 10,0 | YES | NULL |
| 24 | hiscmsfechaenvprov | timestamp without time zone |  | YES | NULL |
| 25 | hiscmsidsubestdesc | numeric | 10,0 | YES | NULL |
| 26 | hiscmsprsid | numeric | 10,0 | YES | NULL |

### hisconccontrptos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hccptid | numeric | 10,0 | NO | NULL |
| 2 | hccptptosid | numeric | 10,0 | NO | NULL |
| 3 | hccptclsccod | character | 2 | NO | NULL |
| 4 | hccpttarconceid | numeric | 5,0 | NO | NULL |
| 5 | hccpttarexpid | numeric | 5,0 | NO | NULL |
| 6 | hccpttartiptid | numeric | 5,0 | NO | NULL |
| 7 | hccptsnoblig | character | 1 | NO | NULL |
| 8 | hccptaccion | character | 1 | NO | NULL |
| 9 | hccpthstusu | character varying | 10 | NO | NULL |
| 10 | hccpthsthora | timestamp without time zone |  | NO | NULL |

### hisconcentrador
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hconid | numeric | 10,0 | YES | NULL |
| 2 | hcondesc | character varying | 50 | YES | NULL |
| 3 | hconexpid | numeric | 5,0 | YES | NULL |
| 4 | hconhstusu | character varying | 10 | YES | NULL |
| 5 | hconhsthora | timestamp without time zone |  | YES | NULL |

### hisconcepto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcptoexpid | numeric | 5,0 | NO | NULL |
| 2 | hcptotconid | numeric | 5,0 | NO | NULL |
| 3 | hcptoorigen | numeric | 5,0 | NO | NULL |
| 4 | hcptoorden | numeric | 5,0 | NO | NULL |
| 5 | hcptovigente | character | 1 | NO | NULL |
| 6 | hcptosnfacalt | character | 1 | NO | NULL |
| 7 | hcptosnfacbaj | character | 1 | NO | NULL |
| 8 | hcptotxtid | numeric | 10,0 | YES | NULL |
| 9 | hcptosnimptar | character | 1 | NO | NULL |
| 10 | hcptosnimpsub | character | 1 | NO | NULL |
| 11 | hcptosnimpreg | character | 1 | NO | NULL |
| 12 | hcptodevclte | character | 1 | NO | 'N'::bpchar |
| 13 | hcptocompdeuda | character | 1 | NO | 'N'::bpchar |
| 14 | hcptotrasctit | character | 1 | NO | 'N'::bpchar |
| 15 | hcptoidtxtadic | numeric | 10,0 | YES | NULL |
| 16 | hcptotpvid | numeric | 5,0 | YES | NULL |
| 17 | hcptotratam | numeric | 5,0 | NO | NULL |
| 18 | hcptotiposub | numeric | 5,0 | YES | NULL |
| 19 | hcptosocsub | numeric | 10,0 | YES | NULL |
| 20 | hcptohstusu | character varying | 10 | NO | NULL |
| 21 | hcptohsthora | timestamp without time zone |  | NO | NULL |
| 22 | hcptodesctxtadic | character varying | 1000 | YES | NULL |
| 23 | hcptodescrip | character varying | 1000 | YES | NULL |
| 24 | hcptoidioma | character | 2 | YES | NULL |
| 25 | hcptosnapertrns | character | 1 | NO | 'S'::bpchar |
| 26 | hcptosnimpcero | character | 1 | NO | 'S'::bpchar |
| 27 | hcptosncaldemora | character | 1 | YES | NULL |
| 28 | hcptosnintdem | character | 1 | NO | 'N'::bpchar |
| 29 | hcptocpovid | numeric | 5,0 | YES | NULL |
| 30 | hcptosnfacunavez | character | 1 | NO | 'N'::bpchar |
| 31 | hcptosbcptoregest | numeric | 5,0 | YES | NULL |

### hisconctipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hctcntctcod | numeric | 10,0 | NO | NULL |
| 2 | hctcnexpid | numeric | 5,0 | NO | NULL |
| 3 | hctcncptoid | numeric | 5,0 | NO | NULL |
| 4 | hctcnsnoblig | character | 1 | NO | NULL |
| 5 | hctcnmasigtar | numeric | 5,0 | NO | NULL |
| 6 | hctcntarbase | numeric | 5,0 | YES | NULL |
| 7 | hctcnhstusu | character varying | 10 | NO | NULL |
| 8 | hctcnhsthora | timestamp without time zone |  | NO | NULL |

### hiscondpasoproced
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcppid | numeric | 10,0 | NO | NULL |
| 2 | hcpppasid | numeric | 5,0 | NO | NULL |
| 3 | hcpptpcond | numeric | 5,0 | NO | NULL |
| 4 | hcpplistval | character varying | 50 | YES | NULL |
| 5 | hcppvalnum | numeric | 10,0 | YES | NULL |
| 6 | hcppvalnumhasta | numeric | 10,0 | YES | NULL |
| 7 | hcpphstusu | character varying | 10 | YES | NULL::character varying |
| 8 | hcpphsthora | timestamp without time zone |  | YES | NULL |
| 9 | hcpppasomaestro | numeric | 10,0 | YES | NULL |

### hisconmensaje
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcmencodigo | numeric | 5,0 | NO | NULL |
| 2 | hcmenexpid | numeric | 5,0 | NO | NULL |
| 3 | hcmentmenid | numeric | 10,0 | NO | NULL |
| 4 | hcmenvigdes | date |  | YES | NULL |
| 5 | hcmenvighas | date |  | YES | NULL |
| 6 | hcmenaplian | numeric | 5,0 | YES | NULL |
| 7 | hcmenaplipd | numeric | 5,0 | YES | NULL |
| 8 | hcmenaplind | numeric | 5,0 | YES | NULL |
| 9 | hcmenapliah | numeric | 5,0 | YES | NULL |
| 10 | hcmenapliph | numeric | 5,0 | YES | NULL |
| 11 | hcmenaplinh | numeric | 5,0 | YES | NULL |
| 12 | hcmenexpzonid | numeric | 5,0 | YES | NULL |
| 13 | hcmenzonid | character varying | 500 | YES | NULL |
| 14 | hcmenlocid | character varying | 500 | YES | NULL |
| 15 | hcmencanaid | character varying | 500 | YES | NULL |
| 16 | hcmenactivo | character | 1 | NO | NULL |
| 17 | hcmenclaid | character varying | 500 | YES | NULL |
| 18 | hcmenusocod | numeric | 5,0 | YES | NULL |
| 19 | hcmeninstcont | character | 1 | YES | NULL |
| 20 | hcmensocpropexpid | numeric | 5,0 | YES | NULL |
| 21 | hcmensocprop | numeric | 10,0 | YES | NULL |
| 22 | hcmenperiid | numeric | 5,0 | YES | NULL |
| 23 | hcmenlistcontr | text |  | YES | NULL |
| 24 | hcmentpvid | character varying | 500 | YES | NULL |
| 25 | hcmenproducto | numeric | 5,0 | YES | NULL |
| 26 | hcmenhstusu | character varying | 10 | NO | NULL |
| 27 | hcmenhsthora | timestamp without time zone |  | NO | NULL |
| 28 | hcmenschid | numeric | 5,0 | YES | NULL |
| 29 | hcmensshid | numeric | 10,0 | YES | NULL |
| 30 | hcmenlecval | numeric | 5,0 | NO | 0 |
| 31 | hcmensistelec | character varying | 50 | YES | NULL |

### hisconsuin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcinid | numeric | 10,0 | YES | NULL |
| 2 | hciconsuid | numeric | 10,0 | NO | NULL |
| 3 | hcisesid | numeric | 10,0 | NO | NULL |
| 4 | hciparam | character varying | 255 | YES | NULL |
| 5 | hciinicio | timestamp without time zone |  | YES | NULL |
| 6 | hcifin | timestamp without time zone |  | YES | NULL |
| 7 | hciresult | text |  | YES | NULL |
| 8 | hciexplist | character varying | 255 | YES | NULL |
| 9 | hcidbcopia | character | 1 | NO | 'N'::bpchar |
| 10 | hciestado | numeric |  | NO | 0 |
| 11 | hcisnmail | character | 1 | NO | 'N'::bpchar |
| 12 | hcimail | character varying | 100 | YES | NULL |
| 13 | hcisncsv | character | 1 | NO | 'N'::bpchar |
| 14 | hcisncabecera | character varying | 1 | NO | 'S'::character varying |
| 15 | hcisidalias | numeric | 10,0 | YES | NULL |

### hisconsuvalfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcvfexpid | numeric | 5,0 | NO | NULL |
| 2 | hcvfcptoid | numeric | 5,0 | NO | NULL |
| 3 | hcvfttarid | numeric | 5,0 | NO | NULL |
| 4 | hcvfperiid | numeric | 5,0 | NO | NULL |
| 5 | hcvfconsmin | numeric | 10,0 | NO | NULL |
| 6 | hcvfconsmax | numeric | 10,0 | NO | NULL |
| 7 | hcvfporceninf | numeric | 10,2 | NO | NULL |
| 8 | hcvfporcensup | numeric | 10,2 | NO | NULL |
| 9 | hcvfhstusu | character varying | 10 | NO | NULL |
| 10 | hcvfhsthora | timestamp without time zone |  | NO | NULL |

### hiscontado
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hccconid | numeric | 10,0 | NO | NULL |
| 2 | hccdirid | numeric | 10,0 | NO | NULL |
| 3 | hccmarcaid | numeric | 5,0 | YES | NULL |
| 4 | hccmodelid | numeric | 5,0 | YES | NULL |
| 5 | hcccalibmm | numeric | 5,0 | YES | NULL |
| 6 | hccnumcont | character varying | 12 | YES | NULL |
| 7 | hccfecinst | date |  | YES | NULL |
| 8 | hccfecbaja | date |  | YES | NULL |
| 9 | hccestado | numeric | 5,0 | NO | NULL |
| 10 | hccnumesfe | numeric | 5,0 | NO | NULL |
| 11 | hccsegesid | numeric | 10,0 | YES | NULL |
| 12 | hccanofab | numeric | 5,0 | YES | NULL |
| 13 | hccsnprop | character | 1 | NO | NULL |
| 14 | hccaveria | character | 1 | NO | NULL |
| 15 | hcchstusu | character varying | 10 | NO | USER |
| 16 | hcchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 17 | hccmarcdesc | character varying | 15 | YES | NULL |
| 18 | hccmoddesc | character varying | 30 | YES | NULL |
| 19 | hccdirtexto | character varying | 130 | YES | NULL |
| 20 | hccnumsegesf | character varying | 12 | YES | NULL |
| 21 | hccprecsusp | character | 1 | YES | NULL |
| 22 | hccnumprecsusp | character | 10 | YES | NULL |
| 23 | hccfecprecsusp | date |  | YES | NULL |
| 24 | hccfecdprecsusp | date |  | YES | NULL |
| 25 | hccprecseg | character | 1 | YES | NULL |
| 26 | hccnumprecseg | character | 10 | YES | NULL |
| 27 | hccmodcomunic | character varying | 20 | YES | NULL |
| 28 | hccsnvalreten | character | 1 | YES | NULL |
| 29 | hccindicadornhc | character | 1 | YES | NULL |
| 30 | hcontsistelec | numeric | 5,0 | YES | NULL |
| 31 | hcontsnactivarov | character | 1 | NO | 'N'::bpchar |
| 32 | hconttipotelec | numeric | 5,0 | YES | NULL |
| 33 | hcontelec | character | 1 | NO | 'N'::bpchar |
| 34 | hcontpdtemdm | character | 1 | NO | 'N'::bpchar |

### hiscontgcob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcgcgcobprsid | numeric | 10,0 | NO | NULL |
| 2 | hcgcgcobexpid | numeric | 5,0 | NO | NULL |
| 3 | hcgccnttnum | numeric | 10,0 | NO | NULL |
| 4 | hcgcsngestcobro | character | 1 | NO | NULL |
| 5 | hcgcsngestcorreo | character | 1 | NO | NULL |
| 6 | hcgchstusu | character varying | 10 | NO | NULL |
| 7 | hcgchsthora | timestamp without time zone |  | NO | NULL |

### hiscontpersautgest
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcpagcnttnum | numeric | 10,0 | YES | NULL |
| 2 | hcpagprsid | numeric | 10,0 | YES | NULL |
| 3 | hcpagprscompl | character varying | 256 | YES | NULL |
| 4 | hcpaggsaid | numeric | 5,0 | YES | NULL |
| 5 | hcpaggestdesc | character varying | 256 | YES | NULL |
| 6 | hcpagestado | numeric | 5,0 | YES | NULL |
| 7 | hcpaghstmodif | character | 1 | YES | NULL |
| 8 | hcpaghstusu | character varying | 10 | YES | NULL |
| 9 | hcpaghsthora | timestamp without time zone |  | YES | NULL |

### hiscontpersautoriz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcpacnttnum | numeric | 10,0 | NO | NULL |
| 2 | hcpaprsid | numeric | 10,0 | NO | NULL |
| 3 | hcpaprscompl | character varying | 256 | NO | NULL |
| 5 | hcpatpaid | numeric | 5,0 | YES | NULL |
| 7 | hcpahstmodif | character | 1 | NO | NULL |
| 8 | hcpahstusu | character varying | 10 | NO | NULL |
| 9 | hcpahsthora | timestamp without time zone |  | NO | NULL |
| 10 | hcpamovil | character varying | 16 | YES | NULL |
| 11 | hcpaprfmovil | character varying | 5 | YES | NULL |
| 12 | hcpamailtxt | character varying | 150 | YES | NULL |

### hiscontrato
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcnttnum | numeric | 10,0 | YES | NULL |
| 2 | hcnttexpid | numeric | 5,0 | YES | NULL |
| 3 | hcnttcliid | numeric | 10,0 | YES | NULL |
| 4 | hcnttagruid | numeric | 5,0 | YES | NULL |
| 5 | hcnttptosid | numeric | 10,0 | YES | NULL |
| 6 | hcnttfprsid | numeric | 10,0 | YES | NULL |
| 7 | hcnttfnumdir | numeric | 5,0 | YES | NULL |
| 8 | hcnttcprsid | numeric | 10,0 | YES | NULL |
| 9 | hcnttcnumdir | numeric | 5,0 | YES | NULL |
| 10 | hcnttestado | numeric | 5,0 | YES | NULL |
| 11 | hcnttcortep | character | 1 | YES | NULL |
| 12 | hcnttscobid | numeric | 10,0 | YES | NULL |
| 13 | hcnttusocod | numeric | 5,0 | YES | NULL |
| 14 | hcnttactivid | numeric | 5,0 | YES | NULL |
| 15 | hcnttnumcopias | numeric | 5,0 | YES | NULL |
| 16 | hcntttipgesd | numeric | 5,0 | YES | NULL |
| 17 | hcnttinspecc | character | 1 | YES | NULL |
| 18 | hcnttesticer | character | 1 | YES | NULL |
| 19 | hcnttumbral | numeric | 10,2 | YES | NULL |
| 20 | hcnttexenfac | character | 1 | YES | NULL |
| 21 | hcnttobsid | numeric | 10,0 | YES | NULL |
| 22 | hcnttrepfac | character | 1 | YES | NULL |
| 23 | hcnttprccams | numeric | 10,0 | YES | NULL |
| 24 | hcnttprrid | numeric | 10,0 | YES | NULL |
| 25 | hcntttipfact | numeric | 5,0 | YES | NULL |
| 26 | hcntttctcod | numeric | 10,0 | YES | NULL |
| 27 | hcnttorgcont | numeric | 5,0 | YES | NULL |
| 28 | hcnttdochabit | character varying | 15 | YES | NULL |
| 29 | hcnttfcaduci | date |  | YES | NULL |
| 30 | hcnttproinq | character | 1 | YES | NULL |
| 31 | hcnttpropid | numeric | 10,0 | YES | NULL |
| 32 | hcnttinquid | numeric | 10,0 | YES | NULL |
| 33 | hcnttfdochabit | date |  | YES | NULL |
| 34 | hcnttcateid | numeric | 5,0 | YES | NULL |
| 35 | hcntthstusu | character varying | 10 | YES | NULL |
| 36 | hcntthsthora | timestamp without time zone |  | YES | NULL |
| 37 | hcnttnomcli | character varying | 203 | YES | NULL |
| 38 | hcnttfprdoc | date |  | YES | NULL |
| 39 | hcnttrefant | character | 12 | YES | NULL |
| 40 | hcnttidicodigo | character | 2 | YES | NULL |
| 41 | hcnttdiasvto | numeric | 5,0 | YES | NULL |
| 42 | hcnttboletin | character varying | 9 | YES | NULL |
| 43 | hcnttfboletin | date |  | YES | NULL |
| 44 | hcnttpcnprsid | numeric | 10,0 | YES | NULL |
| 45 | hcnttpcncnaecod | numeric | 10,0 | YES | NULL |
| 46 | hcnttsnformal | character | 1 | YES | NULL |
| 47 | hcnttsnfraude | character | 1 | YES | NULL |
| 48 | hcnttrefext | character | 15 | YES | NULL |
| 49 | hcnttdiaslimpago | numeric | 5,0 | YES | NULL |
| 50 | hcnttsnnotifmail | character | 1 | NO | 'N'::bpchar |
| 51 | hcnttsnnotifsms | character | 1 | NO | 'N'::bpchar |
| 52 | hcnttsnreclcad | character | 1 | NO | 'S'::bpchar |
| 53 | hcnttprppid | numeric | 10,0 | YES | NULL |
| 54 | hcnttsnlisrob | character | 1 | NO | 'N'::bpchar |
| 55 | hcnttnotifprsid1 | numeric | 10,0 | YES | NULL |
| 56 | hcnttnotifnumdir1 | numeric | 5,0 | YES | NULL |
| 57 | hcnttnotifprsid2 | numeric | 10,0 | YES | NULL |
| 58 | hcnttnotifnumdir2 | numeric | 5,0 | YES | NULL |
| 59 | hcnttnotifmovil | character varying | 16 | YES | NULL |
| 60 | hcntttipenvfact | numeric | 5,0 | YES | NULL |
| 61 | hcnttexphub | numeric | 5,0 | YES | NULL |
| 62 | hcnttnumexpobra | character varying | 20 | YES | NULL |
| 63 | hcnttfecexpobra | date |  | YES | NULL |
| 64 | hcntttipofecescr | numeric | 5,0 | YES | NULL |
| 65 | hcnttfechaescr | date |  | YES | NULL |
| 66 | hcnttpermpubl | character | 1 | NO | 'X'::bpchar |
| 67 | hcnttotroprsid | numeric | 10,0 | YES | NULL |
| 68 | hcnttrefmid | numeric | 10,0 | YES | NULL |
| 69 | hcnttsnfaspare | character | 1 | NO | 'N'::bpchar |
| 70 | hcnttplataforma | character varying | 10 | YES | NULL |
| 71 | hcnttsubentidad | character varying | 10 | YES | NULL |
| 72 | hcnttmejdiarem | numeric | 5,0 | YES | NULL |
| 73 | hcnttcpagador | numeric | 5,0 | YES | NULL |
| 74 | hcnttcreceptor | numeric | 5,0 | YES | NULL |
| 75 | hcnttcfiscal | numeric | 5,0 | YES | NULL |
| 76 | hcnttexpcli | character varying | 20 | YES | NULL |
| 77 | hcnttinfefac | character varying | 250 | YES | NULL |
| 78 | hcnttccomprador | numeric | 5,0 | YES | NULL |
| 79 | hcnttnumpedido | character varying | 20 | YES | NULL |
| 80 | hcnttnumsecpedido | double precision | 53 | YES | NULL |
| 81 | hcnttrenovautoplan | character | 1 | YES | NULL |
| 82 | hcnttsnnotifpush | character | 1 | NO | 'N'::bpchar |
| 83 | hcnttprfnotifmovil | character varying | 5 | YES | NULL |
| 84 | hcnttsnenvefacmdia | character | 1 | NO | 'N'::bpchar |
| 85 | hcnttsnctaemi | character | 1 | NO | 'N'::bpchar |
| 86 | hcnttsnpagrec | character | 1 | NO | 'N'::bpchar |
| 87 | hcnttfeccadrec | character | 4 | YES | NULL |
| 88 | hcntttoken | character varying | 40 | YES | NULL |
| 89 | hcnttencuestas | character | 1 | NO | 'X'::bpchar |
| 90 | hcnttperfilado | character | 1 | NO | 'X'::bpchar |
| 91 | hcnttnotifdir1 | character varying | 110 | YES | NULL |
| 92 | hcnttnotifdir2 | character varying | 110 | YES | NULL |
| 93 | hcntsaldobloq | numeric | 18,2 | YES | NULL |
| 94 | hcnttmailnopapelfprsid | numeric | 10,0 | YES | NULL |
| 95 | hcnttmailnopapelnumdir | numeric | 5,0 | YES | NULL |
| 96 | hcntbloquearcobro | character | 1 | NO | 'N'::bpchar |
| 97 | hcnttrgpdanonim | character | 1 | NO | 'N'::bpchar |
| 98 | hcnttfspprsid | numeric | 10,0 | YES | NULL |
| 99 | hcnttcsbloq | character | 1 | NO | 'N'::bpchar |
| 100 | hcnttnoregest | character | 1 | NO | 'N'::bpchar |
| 101 | hcnttbloqrgpd | character | 1 | NO | 'N'::bpchar |
| 102 | hcnttgrinid | numeric | 5,0 | YES | NULL |
| 103 | hcnttnoreghastareal | character | 1 | YES | 'N'::bpchar |
| 104 | hcnttsncsesp | character | 1 | YES | NULL |
| 105 | hcnttprfmovilnopapel | character varying | 5 | YES | NULL |
| 106 | hcnttmovilnopapel | character varying | 16 | YES | NULL |
| 108 | hcnttconsumidor | character | 1 | YES | NULL |

### hiscontratoprod
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hiscntpnum | numeric | 10,0 | NO | NULL |
| 2 | hiscntpprd | numeric | 5,0 | NO | NULL |
| 3 | hiscntpexpid | numeric | 5,0 | NO | NULL |
| 4 | hiscntpcesion | character varying | 1 | NO | 'N'::character varying |
| 5 | hiscntpfecces | timestamp without time zone |  | YES | NULL |
| 6 | hiscntpactext | character varying | 1 | NO | 'N'::character varying |
| 7 | hiscntpfeccom | timestamp without time zone |  | YES | NULL |
| 8 | hiscntpdfacenc | numeric | 10,0 | YES | NULL |
| 9 | hiscntpftoenc | numeric | 10,0 | YES | NULL |
| 10 | hiscntpfdevenc | timestamp without time zone |  | YES | NULL |
| 11 | hiscntpsinocumple | character varying | 1 | NO | 'N'::character varying |
| 12 | hiscntphstusu | character varying | 10 | NO | NULL |
| 13 | hiscntphsthora | timestamp without time zone |  | NO | NULL |

### hiscontreten
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcrtid | numeric | 10,0 | NO | NULL |
| 2 | hcrtexpid | numeric | 5,0 | NO | NULL |
| 3 | hcrtcontid | numeric | 10,0 | NO | NULL |
| 4 | hcrtcnttnum | numeric | 10,0 | NO | NULL |
| 5 | hcrtmotivo | numeric | 5,0 | NO | NULL |
| 6 | hcrtlectura | numeric | 10,0 | NO | NULL |
| 7 | hcrtconsumo | numeric | 10,0 | YES | NULL |
| 8 | hcrtestado | numeric | 5,0 | NO | NULL |
| 9 | hcrtsnauditado | character | 1 | NO | NULL |
| 10 | hcrtsnqyr | character | 1 | NO | NULL |
| 11 | hcrtinisesid | numeric | 10,0 | NO | NULL |
| 12 | hcrtfecini | timestamp without time zone |  | NO | NULL |
| 13 | hcrtfeclim | date |  | YES | NULL |
| 14 | hcrtfinsesid | numeric | 10,0 | YES | NULL |
| 15 | hcrtfecfin | timestamp without time zone |  | YES | NULL |
| 16 | hcrthstusu | character varying | 10 | NO | NULL |
| 17 | hcrthsthora | timestamp without time zone |  | NO | NULL |

### hiscorrsubcto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcrsexpid | numeric | 5,0 | NO | NULL |
| 2 | hcrscptoid | numeric | 5,0 | NO | NULL |
| 3 | hcrsttarid | numeric | 5,0 | NO | NULL |
| 4 | hcrsfecapl | date |  | NO | NULL |
| 5 | hcrssubcid | numeric | 5,0 | NO | NULL |
| 6 | hcrscorid | numeric | 10,0 | NO | NULL |
| 7 | hcrsordaplic | numeric | 5,0 | NO | NULL |
| 8 | hcrsimpcor | character | 1 | NO | 'N'::bpchar |
| 9 | hcrshstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 10 | hcrshsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 11 | hcrshstmodif | character | 1 | NO | NULL |
| 12 | hcrssnseprec | character | 1 | NO | 'N'::bpchar |

### hiscorrtarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcorid | numeric | 10,0 | NO | NULL |
| 2 | hcordesc | character varying | 100 | NO | NULL |
| 3 | hcorexpid | numeric | 5,0 | NO | NULL |
| 4 | hcorcptoid | numeric | 5,0 | NO | NULL |
| 5 | hcorttarid | numeric | 5,0 | NO | NULL |
| 6 | hcorfecapl | date |  | NO | NULL |
| 7 | hcorcndfija | numeric | 5,0 | YES | NULL |
| 8 | hcornotcfija | character | 1 | NO | NULL |
| 9 | hcorcndtpvid | numeric | 5,0 | YES | NULL |
| 10 | hcornotctpvid | character | 1 | NO | NULL |
| 11 | hcorcndperiid | numeric | 5,0 | YES | NULL |
| 12 | hcornotcperiid | character | 1 | NO | NULL |
| 13 | hcorcndperiodos | character | 30 | YES | NULL |
| 14 | hcorcndtramo | numeric | 5,0 | YES | NULL |
| 15 | hcornotctramo | character | 1 | NO | NULL |
| 16 | hcorcndnumerica | numeric | 5,0 | YES | NULL |
| 17 | hcornotcnumerica | character | 1 | NO | NULL |
| 18 | hcortipoorgcond | numeric | 5,0 | YES | NULL |
| 19 | hcorvalorgcond | numeric | 18,6 | YES | NULL |
| 20 | hcortvarorgcond | numeric | 5,0 | YES | NULL |
| 21 | hcorcptoorgcond | numeric | 5,0 | YES | NULL |
| 22 | hcortipoprmcond | numeric | 5,0 | YES | NULL |
| 23 | hcorvalprmcond | numeric | 18,6 | YES | NULL |
| 24 | hcorvalhprmcond | numeric | 18,6 | YES | NULL |
| 25 | hcortvarprmcond | numeric | 5,0 | YES | NULL |
| 26 | hcorobjaplic | numeric | 5,0 | NO | NULL |
| 27 | hcoroperacion | numeric | 5,0 | YES | NULL |
| 28 | hcortipovalope | numeric | 5,0 | YES | NULL |
| 29 | hcorvalope | numeric | 18,6 | YES | NULL |
| 30 | hcortvarope | numeric | 5,0 | YES | NULL |
| 31 | hcorcptoope | numeric | 5,0 | YES | NULL |
| 32 | hcorhstusu | character varying | 10 | NO | NULL |
| 33 | hcorhsthora | timestamp without time zone |  | NO | NULL |
| 34 | hcordesctxtid | numeric | 10,0 | YES | NULL |
| 35 | hcortxtdesc | character varying | 100 | YES | NULL |
| 36 | hcordescidicod | character | 2 | YES | NULL |
| 37 | hcorimpobj | character | 1 | NO | 'N'::bpchar |
| 38 | hcorimpres | character | 1 | NO | 'N'::bpchar |
| 39 | hcortsubope | numeric | 5,0 | YES | NULL |
| 40 | hcornotctpvid2 | character | 1 | NO | 'N'::bpchar |
| 41 | hcorcndtpvid2 | numeric | 5,0 | YES | NULL |
| 42 | hcoropervar | character | 1 | YES | NULL |
| 43 | hcortipocortar | numeric | 5,0 | NO | 1 |
| 44 | hcorlistatramos | character varying | 50 | YES | NULL |
| 45 | hcortasocial | numeric | 10,0 | YES | NULL |

### hiscptomotfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcmffini | timestamp without time zone |  | NO | NULL |
| 2 | hcmfusuini | character | 10 | NO | NULL |
| 3 | hcmfmtfcodigo | numeric | 5,0 | NO | NULL |
| 4 | hcmftconid | numeric | 5,0 | NO | NULL |
| 5 | hcmffin | timestamp without time zone |  | YES | NULL |
| 6 | hcmfusufin | character | 10 | YES | NULL |

### hiscsc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcsccodigo | numeric | 5,0 | NO | NULL |
| 2 | hcscnif | character varying | 12 | NO | NULL |
| 3 | hcscsnactivo | character | 1 | NO | NULL |
| 4 | hcscdescripcion | character varying | 60 | YES | NULL |
| 5 | hcsctcsid | numeric | 5,0 | YES | NULL |
| 6 | hcschstusu | character varying | 10 | YES | NULL |
| 7 | hcschsthora | timestamp without time zone |  | YES | NULL |

### hisctabangest
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcbngsocprsid | numeric | 10,0 | NO | NULL |
| 2 | hcbngbanid | numeric | 5,0 | NO | NULL |
| 3 | hcbngageid | numeric | 5,0 | NO | NULL |
| 4 | hcbngdigcont | character | 2 | NO | NULL |
| 5 | hcbngnumcta | character varying | 20 | NO | NULL |
| 6 | hcbngcbecodigo | character varying | 6 | YES | NULL |
| 7 | hcbngbcrisol | character | 5 | NO | NULL |
| 8 | hcbngacrisol | character | 5 | NO | NULL |
| 9 | hcbngprincipal | character | 1 | NO | NULL |
| 10 | hcbnghstusu | character varying | 10 | NO | NULL |
| 11 | hcbnghsthora | timestamp without time zone |  | NO | NULL |
| 12 | hcbngiban | character varying | 34 | YES | NULL |
| 13 | hcbngcuencob | numeric | 5,0 | YES | NULL |
| 14 | hcbnprevcobro | character | 15 | YES | NULL |

### hiscuendestin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcdcuencont | numeric | 5,0 | NO | NULL |
| 2 | hcdexpid | numeric | 5,0 | NO | NULL |
| 3 | hcdcodigo | character | 10 | NO | NULL |
| 4 | hcdptjrecar | numeric | 10,8 | YES | NULL |
| 5 | hcdcuenrcgo | numeric | 5,0 | YES | NULL |
| 6 | hcdcontracu | numeric | 5,0 | YES | NULL |
| 7 | hcddestrec | character | 10 | YES | NULL |
| 8 | hcdhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 9 | hcdhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hiscuentacont
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hccid | numeric | 5,0 | NO | NULL |
| 2 | hccdescrip | character varying | 60 | NO | NULL |
| 3 | hcccodigo | character varying | 10 | NO | NULL |
| 4 | hccindiva | character | 1 | YES | NULL |
| 5 | hcccueniva | numeric | 5,0 | YES | NULL |
| 6 | hccindivai | character | 1 | YES | NULL |
| 7 | hcccueajust | numeric | 5,0 | YES | NULL |
| 8 | hccindivaca | character | 1 | YES | NULL |
| 9 | hccccueajus | numeric | 5,0 | YES | NULL |
| 10 | hccindivacc | character | 1 | YES | NULL |
| 11 | hcccobdupl | character | 1 | NO | NULL |
| 12 | hcccuedupli | numeric | 5,0 | YES | NULL |
| 13 | hccsncsc | character | 1 | NO | 'S'::bpchar |
| 14 | hcctipo | character | 1 | NO | 'M'::bpchar |
| 15 | hccsocprsid | numeric | 10,0 | NO | NULL |
| 16 | hccsniva | character | 1 | NO | NULL |
| 17 | hccsninfant | character | 1 | NO | NULL |
| 18 | hccsnsustcsc | character | 1 | NO | NULL |
| 19 | hccsndates | character | 1 | NO | NULL |
| 20 | hccniveltes | character | 2 | YES | NULL |
| 21 | hcccbecodigo | character varying | 6 | YES | NULL |
| 22 | hcchstusu | character varying | 10 | NO | NULL |
| 23 | hcchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 24 | hccsninccont | character | 1 | NO | 'S'::bpchar |
| 25 | hcccueivacob | numeric | 5,0 | YES | NULL |
| 26 | hccindivacob | character | 1 | YES | NULL |
| 27 | hcccueexiva | numeric | 5,0 | YES | NULL |
| 28 | hccnif | character varying | 15 | YES | NULL |
| 29 | hccsnfiltro | character | 1 | NO | 'N'::bpchar |
| 30 | hccoriaccont | numeric | 5,0 | NO | 1 |
| 31 | hccsnnifexp | character | 1 | NO | 'N'::bpchar |
| 32 | hcccuenivamor | numeric | 5,0 | YES | NULL |
| 33 | hccindivamor | character | 1 | YES | NULL |

### hiscuentasesp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hcesexpid | numeric | 5,0 | NO | NULL |
| 2 | hcescamorti | numeric | 5,0 | NO | NULL |
| 3 | hcescreceje | numeric | 5,0 | NO | NULL |
| 4 | hcescintdem | numeric | 5,0 | NO | NULL |
| 5 | hcescintcp | numeric | 5,0 | NO | NULL |
| 6 | hceshstusu | character varying | 10 | NO | NULL |
| 7 | hceshsthora | timestamp without time zone |  | NO | NULL |
| 8 | hcescdesmor | numeric | 5,0 | YES | NULL |
| 9 | hcescrecfac | numeric | 5,0 | YES | NULL |

### hisdefimpaplic
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hdfpdfiid | numeric | 5,0 | NO | NULL |
| 2 | hdfpmtfcod | numeric | 5,0 | NO | NULL |
| 3 | hdfpopera | numeric | 5,0 | NO | NULL |
| 4 | hdfpsnactivo | character | 1 | NO | NULL |
| 5 | hdfphstusu | character varying | 10 | NO | NULL |
| 6 | hdfphsthora | timestamp without time zone |  | NO | NULL |

### hisdefimpcptos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hdfcpdfiid | numeric | 5,0 | NO | NULL |
| 2 | hdfcptconid | numeric | 5,0 | NO | NULL |
| 3 | hdfcphstmodif | character | 1 | NO | NULL |
| 4 | hdfcphstusu | character varying | 10 | NO | NULL |
| 5 | hdfcphsthora | timestamp without time zone |  | NO | NULL |

### hisdefimpreso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hdfiid | numeric | 5,0 | NO | NULL |
| 2 | hdfidesc | character varying | 30 | NO | NULL |
| 3 | hdfisnperiodic | character | 1 | NO | NULL |
| 4 | hdfisnperiodo | character | 1 | NO | NULL |
| 5 | hdfisnnumcont | character | 1 | NO | NULL |
| 6 | hdfisncalcont | character | 1 | NO | NULL |
| 7 | hdfisnlecturas | character | 1 | NO | NULL |
| 8 | hdfisnconsumo | character | 1 | NO | NULL |
| 9 | hdfisnuso | character | 1 | NO | NULL |
| 10 | hdfisntarifas | character | 1 | NO | NULL |
| 11 | hdfisndetunid | character | 1 | NO | NULL |
| 12 | hdfimsgfijo | character varying | 60 | YES | NULL |
| 13 | hdfisnmensajes | character | 1 | NO | NULL |
| 14 | hdfisngrafica | character | 1 | NO | NULL |
| 15 | hdfisndiptico | character | 1 | NO | NULL |
| 16 | hdfisnmsgacredi | character | 1 | NO | NULL |
| 17 | hdfisnmsgnojust | character | 1 | NO | NULL |
| 18 | hdfisncomplsum | character | 1 | NO | NULL |
| 19 | hdfiexploid | numeric | 5,0 | NO | NULL |
| 20 | hdfiformper | numeric | 5,0 | YES | NULL |
| 21 | hdfisnreal | character | 1 | NO | NULL |
| 22 | hdfisnnumfprop | character | 1 | NO | NULL |
| 23 | hdfitotconcp | numeric | 5,0 | NO | NULL |
| 24 | hdfisnimpvar | character | 1 | NO | NULL |
| 25 | hdfisnivaexns | character | 1 | NO | NULL |
| 26 | hdfitpdid | numeric | 5,0 | NO | NULL |
| 27 | hdfipimid | numeric | 5,0 | NO | NULL |
| 28 | hdfidescserv | numeric | 5,0 | NO | 0 |
| 29 | hdfidirserv | numeric | 5,0 | NO | 0 |
| 30 | hdfisntelweb | character | 1 | NO | 'S'::bpchar |
| 31 | hdfisnlogos | character | 1 | NO | 'S'::bpchar |
| 32 | hdfihstusu | character varying | 10 | NO | NULL |
| 33 | hdfihsthora | timestamp without time zone |  | NO | NULL |
| 34 | hdfisnimpregmer | character | 1 | NO | 'S'::bpchar |
| 35 | hdfisnemiindep | character | 1 | NO | 'N'::bpchar |
| 36 | hdfisnimprisecun | character | 1 | YES | 'N'::bpchar |
| 37 | hdfitetid | numeric | 5,0 | YES | NULL |
| 38 | hdfimaxptossecun | numeric | 5,0 | YES | NULL |
| 39 | hdfisnconsval | character | 1 | YES | 'N'::bpchar |
| 40 | hdfisnlitliq | character | 1 | NO | 'N'::bpchar |
| 41 | hdfisnimpnuevmod | character | 1 | NO | 'N'::bpchar |
| 42 | hdfiformatimp | numeric | 5,0 | NO | 1 |
| 43 | hdfisngragastag | character | 1 | NO | 'N'::bpchar |
| 44 | hdfinumcolgraf | numeric | 5,0 | NO | 5 |
| 45 | hdfitxtbaja | character varying | 1000 | YES | NULL |
| 46 | hdfiidioma | character | 2 | YES | NULL |
| 47 | hdfigrafgasto | numeric | 5,0 | NO | 0 |

### hisdirec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hdirid | numeric | 10,0 | NO | NULL |
| 2 | hdirtipo | numeric | 5,0 | YES | NULL |
| 3 | hdircodid | numeric | 10,0 | YES | NULL |
| 4 | hdirparimp | numeric | 5,0 | YES | NULL |
| 5 | hdirnumdes | numeric | 10,0 | YES | NULL |
| 6 | hdirfinca | numeric | 10,0 | YES | NULL |
| 7 | hdircomfin | character | 10 | YES | NULL |
| 8 | hdirbloque | character | 4 | YES | NULL |
| 9 | hdirescal | character | 4 | YES | NULL |
| 10 | hdirplanta | character | 4 | YES | NULL |
| 11 | hdirpuerta | character | 4 | YES | NULL |
| 12 | hdircomplem | character varying | 36 | YES | NULL |
| 13 | hdirtexto | character varying | 150 | YES | NULL |
| 14 | hdirlocid | numeric | 10,0 | YES | NULL |
| 15 | hdircodpost | character varying | 10 | YES | NULL |
| 16 | hdirhstusu | character varying | 10 | NO | NULL |
| 17 | hdirhsthora | timestamp without time zone |  | NO | NULL |
| 18 | hdirduplicado | character | 1 | YES | NULL |
| 19 | hdirportal | character | 2 | YES | NULL |
| 20 | hdirkilometro | numeric | 5,1 | YES | NULL |
| 21 | hdircaltxt | character varying | 36 | YES | NULL |
| 22 | hdirgeolocid | numeric | 10,0 | YES | NULL |
| 23 | hdirgestor | character varying | 120 | YES | NULL |
| 24 | hgeolongitud | character varying | 30 | YES | NULL |
| 25 | hgeolatitud | character varying | 30 | YES | NULL |
| 26 | hgeoaltitud | character varying | 30 | YES | NULL |
| 27 | hgeoorigen | numeric | 5,0 | YES | NULL |

### hisdivnegocio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hdvnid | numeric | 5,0 | NO | NULL |
| 2 | hdvndescri | character varying | 60 | NO | NULL |
| 3 | hdvncfactura | numeric | 5,0 | NO | NULL |
| 4 | hdvnccontf | numeric | 5,0 | NO | NULL |
| 5 | hdvnccobro | numeric | 5,0 | NO | NULL |
| 6 | hdvncremesa | numeric | 5,0 | NO | NULL |
| 7 | hdvnccobdup | numeric | 5,0 | NO | NULL |
| 8 | hdvncmoroso | numeric | 5,0 | YES | NULL |
| 9 | hdvncdotmor | numeric | 5,0 | YES | NULL |
| 10 | hdvnadjid | numeric | 5,0 | NO | NULL |
| 11 | hdvnactccodigo | character | 2 | YES | NULL |
| 12 | hdvnccperio | numeric | 5,0 | YES | NULL |
| 13 | hdvnccddeuda | numeric | 5,0 | YES | NULL |
| 14 | hdvnsnnif | character | 1 | NO | NULL |
| 15 | hdvnhstusu | character varying | 10 | NO | NULL |
| 16 | hdvnhsthora | timestamp without time zone |  | NO | NULL |
| 17 | hdvnccamorti | numeric | 5,0 | YES | NULL |
| 18 | hdvnccdotmor | numeric | 5,0 | YES | NULL |
| 19 | hdvncdesdotmor | numeric | 5,0 | YES | NULL |
| 20 | hdvnccobdif | numeric | 5,0 | YES | NULL |
| 21 | hdvncfianza | numeric | 5,0 | YES | NULL |
| 22 | hdvnclitxtid | character varying | 1000 | YES | NULL |
| 23 | hdvningtxtid | character varying | 1000 | YES | NULL |
| 24 | hdvnidicod | character | 2 | YES | NULL |
| 25 | hdvndescrisii | character varying | 500 | YES | NULL |
| 26 | hdvncdescuento | numeric | 5,0 | YES | NULL |

### hisdoctipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hdtcntctcod | numeric | 10,0 | NO | NULL |
| 2 | hdtcndconid | numeric | 10,0 | NO | NULL |
| 3 | hdtcnsnactivo | character | 1 | NO | NULL |
| 4 | hdtcnorden | numeric | 5,0 | NO | NULL |
| 5 | hdtcnhstusu | character varying | 10 | NO | NULL |
| 6 | hdtcnhsthora | timestamp without time zone |  | NO | NULL |
| 7 | hdtcnsnobligat | character | 1 | NO | 'N'::bpchar |

### hiselemestruc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | helsid | numeric | 5,0 | NO | NULL |
| 2 | helsdescrip | character varying | 50 | NO | NULL |
| 3 | helsdescabr | character varying | 5 | NO | NULL |
| 4 | helstlmcod | character varying | 5 | NO | NULL |
| 5 | helsnieid | numeric | 5,0 | NO | NULL |
| 6 | helselsid | numeric | 5,0 | YES | NULL |
| 7 | helshstusu | character varying | 10 | NO | NULL |
| 8 | helshsthora | timestamp without time zone |  | NO | NULL |

### hisemisordefimp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hediexpid | numeric | 5,0 | NO | NULL |
| 2 | hedisocemi | numeric | 10,0 | NO | NULL |
| 3 | hedidfiid | numeric | 5,0 | NO | NULL |
| 4 | hedimtfcod | numeric | 5,0 | NO | NULL |
| 5 | hediopera | numeric | 5,0 | NO | NULL |
| 6 | hedisnactivo | character | 1 | NO | NULL |
| 7 | hedihstusu | character varying | 10 | NO | NULL |
| 8 | hedihsthora | timestamp without time zone |  | NO | NULL |
| 9 | hediprior | numeric | 5,0 | YES | NULL |

### hisemisorventban
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hevbemisoid | numeric | 10,0 | NO | NULL |
| 2 | hevbsufijo | numeric | 3,0 | NO | NULL |
| 3 | hevbsocprsid | numeric | 10,0 | NO | NULL |
| 4 | hevbofiid | numeric | 5,0 | NO | NULL |
| 5 | hevbhstusu | character varying | 10 | NO | NULL |
| 6 | hevbhsthora | timestamp without time zone |  | NO | NULL |
| 7 | hevbformato | numeric | 5,0 | NO | 57 |
| 8 | hevbcodtributo | character varying | 3 | YES | NULL |
| 9 | hevbsnrafmig | character | 1 | YES | NULL |

### hisestexpesif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | heexid | numeric | 10,0 | NO | NULL |
| 2 | heexexsid | numeric | 10,0 | NO | NULL |
| 3 | heexefrcod | numeric | 5,0 | NO | NULL |
| 4 | heexfechacambio | timestamp without time zone |  | NO | NULL |
| 5 | heexusuid | character | 10 | NO | NULL |

### hisexpccobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | heccexpid | numeric | 5,0 | NO | NULL |
| 2 | hecccanaid | character | 1 | NO | NULL |
| 3 | heccsnimpdip | character | 1 | NO | NULL |
| 4 | hecctxtdesc | character varying | 1000 | YES | NULL |
| 5 | heccidicod | character | 2 | YES | NULL |
| 6 | heccsnenvimp | character | 1 | NO | NULL |
| 7 | heccsnimpmsj | character | 1 | NO | NULL |
| 8 | heccsnimpgraf | character | 1 | NO | NULL |
| 9 | hecchstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 10 | hecchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisexpctafrmpago
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hecfpexpid | numeric | 5,0 | NO | NULL |
| 2 | hecfpbngsoc | numeric | 10,0 | NO | NULL |
| 3 | hecfpbngbanid | numeric | 5,0 | NO | NULL |
| 4 | hecfpcanaid | character | 1 | NO | NULL |
| 5 | hecfpfmpid | numeric | 5,0 | NO | NULL |
| 6 | hecfpbngageid | numeric | 5,0 | NO | NULL |
| 7 | hecfpcbecodigo | character varying | 6 | YES | NULL |
| 8 | hecfphstusu | character varying | 10 | NO | NULL |
| 9 | hecfphsthora | timestamp without time zone |  | NO | NULL |
| 10 | hecfpnumcta | character varying | 11 | YES | NULL |
| 11 | hecfpcuentaapp | character | 1 | NO | 'N'::bpchar |

### hisexpedrecobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexrcrid | numeric | 10,0 | NO | NULL |
| 2 | hexrcfecven | date |  | NO | NULL |
| 3 | hexrcestado | numeric | 5,0 | NO | NULL |
| 4 | hexrcfeccierre | timestamp without time zone |  | YES | NULL |
| 5 | hexrcmotfin | numeric | 5,0 | YES | NULL |
| 6 | hexrchstusu | character varying | 10 | NO | ' '::character varying |
| 7 | hexrchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisexpedsif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexsid | numeric | 10,0 | NO | NULL |
| 2 | hexsfsigins | date |  | YES | NULL |
| 3 | hexsnumact | numeric | 5,0 | NO | NULL |
| 4 | hexsestado | numeric | 5,0 | NO | NULL |
| 5 | hexssnaseso | character | 1 | NO | NULL |
| 6 | hexssnespdf | character | 1 | NO | NULL |
| 7 | hexsdirecio | numeric | 10,0 | NO | NULL |
| 8 | hexspolnum | numeric | 10,0 | YES | NULL |
| 9 | hexspersona | numeric | 10,0 | YES | NULL |
| 10 | hexsperndir | numeric | 5,0 | YES | NULL |
| 11 | hexssnpropi | character | 1 | NO | NULL |
| 12 | hexsfaviso | date |  | YES | NULL |
| 13 | hexstxtavis | character varying | 80 | YES | NULL |
| 14 | hexsnpolnum | numeric | 10,0 | YES | NULL |
| 15 | hexsexpid | numeric | 5,0 | NO | NULL |
| 16 | hexsorifraid | numeric | 5,0 | NO | NULL |
| 17 | hexstipfraid | numeric | 5,0 | YES | NULL |
| 18 | hexscontcod | numeric | 5,0 | YES | NULL |
| 19 | hexsoperid | numeric | 5,0 | YES | NULL |
| 20 | hexssnproce | character | 1 | YES | NULL |
| 21 | hexsestadoant | numeric | 5,0 | YES | NULL |
| 22 | hexssnreincidente | character | 1 | YES | NULL |
| 23 | hexsusuidaper | character varying | 10 | NO | NULL |
| 24 | hexsfechaaper | date |  | NO | NULL |
| 25 | hexsusuidsol | character varying | 10 | YES | NULL |
| 26 | hexsfechasol | date |  | YES | NULL |
| 27 | hexsofiidaper | numeric | 5,0 | NO | NULL |
| 28 | hexsofiidsol | numeric | 5,0 | YES | NULL |
| 29 | hexssncorte | character | 1 | NO | 'N'::bpchar |
| 30 | hexsimporte | numeric | 18,2 | YES | NULL |
| 31 | hexsinfraccion | character varying | 16 | YES | NULL |
| 32 | hexsfeccamest | date |  | NO | NULL |
| 33 | hexshstusu | character | 10 | NO | 'CONVERSION'::bpchar |
| 34 | hexshsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 35 | hexsmotnofto | numeric | 5,0 | YES | NULL |
| 36 | hexscaudal | numeric | 18,2 | YES | NULL |
| 37 | hexshoras | numeric | 18,2 | YES | NULL |
| 38 | hexsdescuentom3 | numeric | 10,0 | YES | NULL |
| 39 | hexsfechainiliq | date |  | YES | NULL |
| 40 | hexsfechafinliq | date |  | YES | NULL |
| 41 | hexsfecprevcorte | date |  | YES | NULL |
| 44 | hexsestadoblq | character | 1 | YES | NULL |
| 45 | hexsimportesimulacion | numeric | 18,2 | YES | NULL |
| 46 | hexsgcobprsid | numeric | 10,0 | YES | NULL |
| 47 | hexsgcobexpid | numeric | 5,0 | YES | NULL |
| 48 | hexsreabierto | character | 1 | YES | NULL |
| 49 | hexsfentradaworkflow | date |  | YES | NULL |
| 50 | hexsfsalidaworkflow | date |  | YES | NULL |
| 51 | hexsfaperturaalegacion | date |  | YES | NULL |
| 52 | hexsfcierrealegacion | date |  | YES | NULL |
| 53 | hexsfeccadest | date |  | YES | NULL |
| 54 | hexsfecenviomen | date |  | YES | NULL |
| 55 | hexssnbonosocial | character | 1 | NO | 'N'::bpchar |
| 56 | hexsjuid | numeric | 10,0 | YES | NULL |
| 57 | hexssnctoficticio | character | 1 | YES | NULL |
| 58 | hexsimportesifconsim | numeric | 18,2 | YES | NULL |
| 59 | hexsimportesifvarsim | numeric | 18,2 | YES | NULL |
| 60 | hexscalsifvar | character varying | 200 | YES | NULL |
| 61 | hexsdatospolicia | character varying | 500 | YES | NULL |

### hisexpgestofi
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hegoofiid | numeric | 5,0 | NO | NULL |
| 2 | hegoexpid | numeric | 5,0 | NO | NULL |
| 3 | hegosnactiva | character | 1 | NO | NULL |
| 4 | hegosncat | character | 1 | NO | NULL |
| 5 | hegosnpropia | character | 1 | NO | NULL |
| 6 | hegosnboquejas | character | 1 | NO | NULL |
| 7 | hegohstusu | character varying | 10 | NO | NULL |
| 8 | hegohsthora | timestamp without time zone |  | NO | NULL |

### hisexpintervalido
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | heivexpid | numeric | 5,0 | NO | NULL |
| 2 | heivcptoid | numeric | 5,0 | NO | NULL |
| 3 | heivttarid | numeric | 5,0 | NO | NULL |
| 4 | heivsubcid | numeric | 5,0 | NO | NULL |
| 5 | heivfecini | date |  | NO | NULL |
| 6 | heivfecfin | date |  | YES | NULL |
| 7 | heivactivo | character | 1 | NO | 'N'::bpchar |
| 8 | heivhstusu | character varying | 10 | NO | NULL |
| 9 | heivhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisexplcentdist
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hecdexpid | numeric | 5,0 | NO | NULL |
| 2 | hecdcdbid | numeric | 5,0 | NO | NULL |
| 3 | hecdccfact | character | 8 | YES | NULL |
| 4 | hecdccsera | character | 8 | YES | NULL |
| 5 | hecdcontrato | character varying | 50 | YES | NULL |
| 6 | hecdhstusu | character varying | 10 | NO | NULL |
| 7 | hecdhsthora | timestamp without time zone |  | NO | NULL |

### hisexplociclinc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexciexpid | numeric | 5,0 | NO | NULL |
| 2 | hexcifdcontr | date |  | YES | NULL |
| 3 | hexcifhcontr | date |  | YES | NULL |
| 4 | hexcifdmantcont | date |  | YES | NULL |
| 5 | hexcifhmantcont | date |  | YES | NULL |
| 6 | hexcifdlecper | date |  | YES | NULL |
| 7 | hexcifhlecper | date |  | YES | NULL |
| 8 | hexcifdcalcons | date |  | YES | NULL |
| 9 | hexcifhcalcons | date |  | YES | NULL |
| 10 | hexcifdfacper | date |  | YES | NULL |
| 11 | hexcifhfacper | date |  | YES | NULL |
| 12 | hexcifdimpfac | date |  | YES | NULL |
| 13 | hexcifhimpfac | date |  | YES | NULL |
| 14 | hexcifdgestcob | date |  | YES | NULL |
| 15 | hexcifhgestcob | date |  | YES | NULL |
| 16 | hexcifdrembanc | date |  | YES | NULL |
| 17 | hexcifhrembanc | date |  | YES | NULL |
| 18 | hexcifdctarest | date |  | YES | NULL |
| 19 | hexcifhctarest | date |  | YES | NULL |
| 20 | hexcifddevbanc | date |  | YES | NULL |
| 21 | hexcifhdevbanc | date |  | YES | NULL |
| 22 | hexcifdventban | date |  | YES | NULL |
| 23 | hexcifhventban | date |  | YES | NULL |
| 24 | hexcifdgestdeu | date |  | YES | NULL |
| 25 | hexcifhgestdeu | date |  | YES | NULL |
| 26 | hexcihstusu | character varying | 10 | NO | NULL |
| 27 | hexcihsthora | timestamp without time zone |  | NO | NULL |
| 28 | hexcifdfinprefac | date |  | YES | NULL |
| 29 | hexcifhfinprefac | date |  | YES | NULL |
| 30 | hexcifdfacext | date |  | YES | NULL |
| 31 | hexcifhfacext | date |  | YES | NULL |

### hisexploclausula
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexclexpid | numeric | 5,0 | NO | NULL |
| 2 | hexclclauid | numeric | 5,0 | NO | NULL |
| 3 | hexclsnactiva | character | 1 | NO | NULL |
| 4 | hexcldiasvto | numeric | 5,0 | YES | NULL |
| 5 | hexclhstusu | character varying | 10 | NO | NULL |
| 6 | hexclhsthora | timestamp without time zone |  | NO | NULL |

### hisexploestim
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | heexpexpid | numeric | 5,0 | NO | NULL |
| 2 | heexptipest | character | 1 | NO | NULL |
| 3 | heexpusocod | numeric | 5,0 | NO | NULL |
| 4 | heexpmestid | numeric | 5,0 | NO | NULL |
| 5 | heexpsnaplint | character | 1 | NO | NULL |
| 6 | heexpsnaplext | character | 1 | NO | NULL |
| 7 | heexpordenapl | numeric | 10,0 | NO | NULL |
| 8 | heexpfiniapl | date |  | NO | NULL |
| 9 | heexpffinapl | date |  | YES | NULL |
| 10 | heexpm3min | numeric | 5,0 | YES | NULL |
| 11 | heexpvalor | numeric | 10,2 | YES | NULL |
| 12 | heexpconsudiario | numeric | 10,3 | YES | NULL |
| 13 | heexpminm3trim | numeric | 5,0 | YES | NULL |
| 14 | heexpmaxm3trim | numeric | 5,0 | YES | NULL |
| 15 | heexpporcpen | numeric | 5,0 | YES | NULL |
| 16 | heexppersup | numeric | 5,0 | YES | NULL |
| 17 | heexppernosup | numeric | 5,0 | YES | NULL |
| 18 | heexphstusu | character varying | 10 | NO | NULL |
| 19 | heexphsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 20 | heexpnumlectreal | numeric | 5,0 | YES | NULL |
| 21 | heexpsnproconfijo | character | 1 | YES | NULL |
| 22 | heexplecval | character | 1 | NO | 'N'::bpchar |
| 23 | heexpdescartar | character | 1 | NO | 'N'::bpchar |
| 24 | heexpnummesespost | numeric | 5,0 | YES | NULL |
| 25 | heexpestimcero | character | 1 | NO | 'N'::bpchar |
| 26 | heexpsnproconfijoab | character | 1 | YES | NULL |

### hisexplomensaje
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexptmenid | numeric | 10,0 | NO | NULL |
| 2 | hexptmenexpid | numeric | 5,0 | NO | NULL |
| 3 | hexptmenprio | numeric | 5,0 | NO | NULL |
| 4 | hexptmenactivo | character | 1 | NO | NULL |
| 5 | hexptmenhstusu | character varying | 10 | NO | NULL |
| 6 | hexptmenhsthora | timestamp without time zone |  | NO | NULL |

### hisexplomotorden
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexmoexpid | numeric | 5,0 | NO | NULL |
| 2 | hexmomvoid | numeric | 5,0 | NO | NULL |
| 3 | hexmoplzoprev | numeric | 5,0 | NO | NULL |
| 4 | hexmotdmodel | numeric | 5,0 | YES | NULL |
| 5 | hexmotdocum | numeric | 5,0 | YES | NULL |
| 6 | hexmosnformpropio | character | 1 | NO | NULL |
| 7 | hexmohabnat | character | 1 | NO | NULL |
| 8 | hexmohstusu | character varying | 10 | NO | NULL |
| 9 | hexmohsthora | timestamp without time zone |  | NO | NULL |
| 10 | hexmosnpermbaja | character | 1 | YES | NULL |
| 11 | hexmosncertauto | character | 1 | NO | 'N'::bpchar |
| 12 | hexmosncertautofraude | character | 1 | NO | 'N'::bpchar |

### hisexploperiodic
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | heperexpid | numeric | 5,0 | NO | NULL |
| 2 | heperperiid | numeric | 5,0 | NO | NULL |
| 3 | heperdmrglecper | numeric | 5,0 | NO | NULL |
| 4 | heperdfecvtofac | numeric | 5,0 | NO | NULL |
| 5 | heperdfecpagfac | numeric | 5,0 | NO | NULL |
| 6 | heperdfecpagdev | numeric | 5,0 | NO | NULL |
| 7 | hepersnhabitual | character | 1 | NO | 'N'::bpchar |
| 8 | hepersncanon | character | 1 | NO | 'S'::bpchar |
| 9 | heperhstusu | character varying | 10 | NO | NULL |
| 10 | heperhsthora | timestamp without time zone |  | NO | NULL |
| 11 | heperdfeclimc60 | numeric | 5,0 | YES | NULL |
| 12 | heperdprorrtel | numeric | 5,0 | YES | NULL |

### hisexploperiodo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexpperexpid | numeric | 5,0 | NO | NULL |
| 2 | hexpperperiid | numeric | 5,0 | NO | NULL |
| 3 | hexppernumero | numeric | 5,0 | NO | NULL |
| 4 | hexppermesd | numeric | 5,0 | NO | NULL |
| 5 | hexppermesh | numeric | 5,0 | NO | NULL |
| 6 | hexppertxtid | numeric | 10,0 | NO | NULL |
| 7 | hexpperhstusu | character varying | 10 | NO | NULL |
| 8 | hexpperhsthora | timestamp without time zone |  | NO | NULL |
| 9 | hexpperdescrip | character varying | 1000 | NO | NULL |
| 10 | hexpperidioma | character | 2 | NO | NULL |

### hisexplorapro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexrexpid | numeric | 5,0 | NO | NULL |
| 2 | hexrprsid | numeric | 10,0 | NO | NULL |
| 3 | hexrdiaspl | numeric | 5,0 | NO | NULL |
| 4 | hexropcion | numeric | 5,0 | NO | NULL |
| 5 | hexrhstusu | character varying | 10 | NO | NULL |
| 6 | hexrhsthora | timestamp without time zone |  | NO | NULL |
| 7 | hexrcontrat | character | 1 | NO | 'S'::bpchar |
| 8 | hexrbonif | character | 1 | NO | 'N'::bpchar |
| 9 | hexrmtbid | numeric | 5,0 | YES | NULL |

### hisexplosocemi
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexseexpid | numeric | 5,0 | NO | NULL |
| 2 | hexsesocemi | numeric | 10,0 | NO | NULL |
| 3 | hexsesocprem | numeric | 10,0 | NO | NULL |
| 4 | hexsesocorem | numeric | 10,0 | NO | NULL |
| 5 | hexseepigraf | character varying | 30 | YES | NULL |
| 6 | hexsesndifcob | character | 1 | NO | 'N'::bpchar |
| 7 | hexsediasvto | numeric | 5,0 | YES | NULL |
| 8 | hexsepriemi | numeric | 5,0 | NO | NULL |
| 9 | hexsehstusu | character varying | 10 | NO | NULL |
| 10 | hexsehsthora | timestamp without time zone |  | NO | NULL |
| 11 | hexsesnrafdeu | character | 1 | YES | NULL |
| 12 | hexsenumimpag | numeric | 5,0 | YES | NULL |
| 13 | hexseemisoid | numeric | 10,0 | YES | NULL |
| 14 | hexsesufijo | numeric | 3,0 | YES | NULL |
| 15 | hexsesndelfirma | character | 1 | NO | 'N'::bpchar |
| 16 | hexsesocfirma | numeric | 10,0 | YES | NULL |
| 17 | hexsesndistfirm | character | 1 | NO | 'N'::bpchar |
| 18 | hexsesndifimp | character | 1 | NO | 'N'::bpchar |
| 19 | hexsebngbanid | numeric | 5,0 | YES | NULL |
| 20 | hexsebngageid | numeric | 5,0 | YES | NULL |
| 21 | hexsenumcta | character varying | 11 | YES | NULL |
| 22 | hexsesndifcobfac | character varying | 1 | YES | NULL |

### hisexplosocpro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexspexpid | numeric | 5,0 | NO | NULL |
| 2 | hexspsocprop | numeric | 10,0 | NO | NULL |
| 3 | hexspfultliq | date |  | YES | NULL |
| 4 | hexspctaper | numeric | 5,0 | YES | NULL |
| 5 | hexspsndotmor | character | 1 | NO | NULL |
| 6 | hexspsnfac | character | 1 | NO | 'N'::bpchar |
| 7 | hexspsnabo | character | 1 | NO | 'N'::bpchar |
| 8 | hexspsnref | character | 1 | NO | 'N'::bpchar |
| 9 | hexsporden | numeric | 5,0 | NO | NULL |
| 10 | hexsptxtccor | numeric | 10,0 | YES | NULL |
| 11 | hexspvarccor | numeric | 5,0 | YES | NULL |
| 12 | hexspsnimpccor | character | 1 | NO | NULL |
| 13 | hexsptxtcvol | numeric | 10,0 | YES | NULL |
| 14 | hexspvarcvol | numeric | 5,0 | YES | NULL |
| 15 | hexspsnimpcvol | character | 1 | NO | NULL |
| 16 | hexsphstusu | character varying | 10 | NO | NULL |
| 17 | hexsphsthora | timestamp without time zone |  | NO | NULL |
| 18 | hexspdesccorr | character varying | 1000 | YES | NULL |
| 19 | hexspdescvol | character varying | 1000 | YES | NULL |
| 20 | hexspidioma | character | 2 | YES | NULL |
| 21 | hexspsncomrec | character | 1 | NO | 'N'::bpchar |
| 22 | hexspsngenfacneg | character | 1 | NO | 'N'::bpchar |
| 23 | hexspsngenlotsii | character | 1 | NO | 'N'::bpchar |
| 24 | hexsptipolotsii | numeric | 5,0 | YES | NULL |
| 25 | hexspsnenvlotsii | character | 1 | NO | 'N'::bpchar |
| 26 | hexspsnenvfacsinsim | character | 1 | NO | 'N'::bpchar |
| 27 | hexspvarimpintfrac | numeric | 5,0 | YES | NULL |
| 28 | hexpsnlineg | character | 1 | YES | NULL |
| 29 | hexspsnaseo | character | 1 | YES | NULL |
| 30 | hexspsnalcan | character | 1 | YES | NULL |
| 31 | hexspperliqsii | character | 1 | YES | NULL |

### hisexplotacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexpid | numeric | 5,0 | NO | NULL |
| 2 | hexpdescri | character varying | 70 | NO | ''::character varying |
| 3 | hexpfecha | date |  | YES | NULL |
| 4 | hexpcodigo | character | 4 | NO | '0000'::bpchar |
| 5 | hexpfecbaja | date |  | YES | NULL |
| 6 | hexpregimen | character | 1 | YES | NULL |
| 7 | hexpelsid | numeric | 5,0 | NO | NULL |
| 8 | hexpemail | character varying | 128 | YES | NULL |
| 9 | hexpnohabile | character | 15 | NO | 'HHHHHHN'::bpchar |
| 10 | hexpnohabils | character | 15 | NO | 'HHHHHHN'::bpchar |
| 11 | hexpciclocom | character | 1 | NO | 'S'::bpchar |
| 12 | hexppropcont | character | 1 | NO | 'C'::bpchar |
| 13 | hexpdiasdevc | numeric | 5,0 | YES | NULL |
| 14 | hexpimpdocb | character | 1 | NO | 'S'::bpchar |
| 15 | hexpimpcat | character | 1 | NO | 'S'::bpchar |
| 16 | hexpmaxdiaspr | numeric | 5,0 | YES | NULL |
| 17 | hexpcontext | character | 1 | NO | 'N'::bpchar |
| 18 | hexpcielpv | character | 1 | NO | 'S'::bpchar |
| 19 | hexpreglfpi | character | 1 | NO | 'N'::bpchar |
| 20 | hexplotespl | character | 1 | NO | 'N'::bpchar |
| 21 | hexpestimnl | numeric | 5,0 | NO | 2 |
| 22 | hexpbolsaest | numeric | 5,0 | NO | 3 |
| 23 | hexpmaxestim | numeric | 5,0 | NO | 1 |
| 24 | hexpinccorrep | character | 1 | NO | 'S'::bpchar |
| 25 | hexpexclfact | character | 1 | NO | 'N'::bpchar |
| 26 | hexpimpuid | numeric | 5,0 | NO | 1 |
| 27 | hexpcalfecv | character | 1 | NO | 'S'::bpchar |
| 28 | hexpcobpprop | character | 1 | NO | 'N'::bpchar |
| 29 | hexpnplazoscp | numeric | 5,0 | NO | 2 |
| 30 | hexpcartacdup | character | 1 | NO | 'N'::bpchar |
| 31 | hexpdiasreminc | numeric | 5,0 | YES | NULL |
| 32 | hexpdiasvencfact | numeric | 5,0 | NO | NULL |
| 33 | hexpdiasproxgts | numeric | 5,0 | YES | NULL |
| 34 | hexpdiasproxgtn | numeric | 5,0 | YES | NULL |
| 35 | hexpcartadbint | numeric | 5,0 | NO | 1 |
| 36 | hexpcartadbext | numeric | 5,0 | NO | 3 |
| 37 | hexpgesttlf | numeric | 5,0 | NO | 1 |
| 38 | hexpmindiasgt | numeric | 5,0 | NO | NULL |
| 39 | hexpemisoid | numeric | 10,0 | YES | NULL |
| 40 | hexpsufijo | numeric | 3,0 | YES | NULL |
| 41 | hexpcbecodigo | character varying | 6 | NO | NULL |
| 42 | hexpidiid | character | 2 | NO | NULL |
| 43 | hexprembloq | character | 1 | NO | 'N'::bpchar |
| 44 | hexpplazoemrem | numeric | 5,0 | NO | 4 |
| 45 | hexpplazotpdia | character | 1 | NO | 'H'::bpchar |
| 46 | hexpfremesa | date |  | YES | NULL |
| 47 | hexpsocgest | numeric | 10,0 | NO | 0 |
| 48 | hexpsnperiodificar | character | 1 | NO | 'N'::bpchar |
| 49 | hexpsncalrecargo | character | 1 | NO | 'N'::bpchar |
| 50 | hexpfeccomagr | date |  | YES | NULL |
| 51 | hexpfeccomesp | date |  | YES | NULL |
| 52 | hexpdiasfacmanu | numeric | 5,0 | YES | NULL |
| 53 | hexpncpcerobest | numeric | 5,0 | YES | NULL |
| 54 | hexpanorefacaut | numeric | 5,0 | NO | NULL |
| 55 | hexpdescserv1 | character varying | 50 | NO | NULL |
| 56 | hexpdescserv2 | character varying | 50 | YES | NULL |
| 57 | hexpdirweb | character varying | 128 | YES | NULL |
| 58 | hexpfecoccam | timestamp without time zone |  | NO | NULL |
| 59 | hexpm3promanual | numeric | 10,0 | YES | NULL |
| 60 | hexpplazoretdeuda | numeric | 5,0 | YES | NULL |
| 61 | hexpplazoretsindeuda | numeric | 5,0 | YES | NULL |
| 62 | hexpsngestsan | character | 1 | NO | NULL |
| 63 | hexpdiasextcontr | numeric | 5,0 | YES | NULL |
| 64 | hexpdiasrectarj | numeric | 5,0 | YES | NULL |
| 65 | hexpfrmfeccambcont | numeric | 5,0 | NO | NULL |
| 66 | hexpformctrtecont | numeric | 5,0 | NO | NULL |
| 67 | hexpmaxmensfact | numeric | 5,0 | YES | NULL |
| 68 | hexpdiascortesum | numeric | 5,0 | YES | NULL |
| 69 | hexppresdiascorsum | numeric | 5,0 | YES | NULL |
| 70 | hexpsocayuprovapr | numeric | 10,0 | YES | NULL |
| 71 | hexpcobejeprovapr | numeric | 5,0 | YES | NULL |
| 72 | hexpofiayuntejec | numeric | 5,0 | YES | NULL |
| 73 | hexpsecnotprovapr | numeric | 10,0 | NO | NULL |
| 74 | hexpsncorteprovapr | character | 1 | NO | NULL |
| 75 | hexpsncontdup | character | 1 | NO | NULL |
| 76 | hexpsnhistlectpl | character | 1 | NO | NULL |
| 77 | hexpsnimpotr | character | 1 | NO | NULL |
| 78 | hexpantefirma | character | 1 | YES | NULL |
| 79 | hexpfirma | numeric | 5,0 | YES | NULL |
| 80 | hexpsnrecce | character | 1 | NO | 'N'::bpchar |
| 81 | hexptlcatcomer | numeric | 11,0 | YES | NULL |
| 82 | hexptlcataveria | numeric | 11,0 | YES | NULL |
| 83 | hexpdiasvtolimpag | numeric | 5,0 | NO | NULL |
| 84 | hexpsncortevisperas | character | 1 | NO | NULL |
| 85 | hexpsnnotmultimedia | character | 1 | NO | NULL |
| 86 | hexpgestord | numeric | 5,0 | NO | 1 |
| 87 | hexpsngendocacept | character | 1 | NO | NULL |
| 88 | hexpsninsitu | character | 1 | NO | NULL |
| 89 | hexphstusu | character varying | 10 | NO | ''::character varying |
| 90 | hexphsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 91 | hexpnolopd | character | 1 | NO | 'N'::bpchar |
| 92 | hexpurlofivirtual | character varying | 100 | YES | NULL |
| 93 | hexpsncuenbancat | character | 1 | NO | 'N'::bpchar |
| 94 | hexptxtoossrepo | numeric | 5,0 | YES | NULL |
| 95 | hexpuniliqbaja | character | 1 | NO | 'N'::bpchar |
| 96 | hexpsncopjust | character | 1 | NO | 'S'::bpchar |
| 97 | hexpsocpremcp | numeric | 10,0 | NO | 0 |
| 98 | hexpsocoremcp | numeric | 10,0 | NO | 0 |
| 99 | hexpncnlmsjfac | numeric | 5,0 | NO | 2 |
| 100 | hexpfecenlcont | date |  | YES | NULL |
| 101 | hexpdiaslotcamb | numeric | 5,0 | NO | 0 |
| 102 | hexpsndeufact | character | 1 | NO | 'N'::bpchar |
| 103 | hexpgestdoc | smallint | 16,0 | NO | 1 |
| 104 | hexpestimarnmeses | numeric | 5,0 | YES | NULL |
| 105 | hexpcntnvm3cons | numeric | 10,0 | YES | NULL |
| 106 | hexpcntnvantig | numeric | 5,0 | YES | NULL |
| 107 | hexpsnoperarsoloot | character | 1 | YES | NULL |
| 108 | hexpsngestopergot | character | 1 | YES | NULL |
| 109 | hexpsncontinstbajlot | character | 1 | YES | NULL |
| 110 | hexptipcambcont | numeric | 5,0 | YES | NULL |
| 111 | hexpsncertifauto | character | 1 | YES | NULL |
| 112 | hexpsngestfallidos | character | 1 | YES | NULL |
| 113 | hexpsncobconjmulorg | character | 1 | NO | 'N'::bpchar |
| 114 | hexpsnsegcont | character | 1 | YES | NULL |
| 115 | hexpsegcttpvid | numeric | 5,0 | YES | NULL |
| 116 | hexpsegcttconid | numeric | 5,0 | YES | NULL |
| 117 | hexpdiasvenccp | numeric | 5,0 | NO | 10 |
| 118 | hexpsnemirecexp | character | 1 | NO | 'S'::bpchar |
| 119 | hexpgeoorden | numeric | 5,0 | YES | NULL |
| 120 | hexpgeoconf | text |  | YES | NULL |
| 121 | hexpcoordporce | numeric | 5,0 | NO | 0 |
| 122 | hexpcoordcopia | character | 1 | NO | 'S'::bpchar |
| 123 | hexpsnnoconsecutivos | character | 1 | YES | NULL |
| 124 | hexpcptofiltxtid | numeric | 10,0 | YES | NULL |
| 125 | hexpcptofinltxtid | numeric | 10,0 | YES | NULL |
| 126 | hexpcptocptxtid | numeric | 10,0 | YES | NULL |
| 127 | hexpcptototaltxtid | numeric | 10,0 | YES | NULL |
| 128 | hexpcptoidioma | character | 2 | YES | NULL |
| 129 | hexpcptofildesc | character varying | 500 | YES | NULL |
| 130 | hexpcptofinldesc | character varying | 500 | YES | NULL |
| 131 | hexpcptocpdesc | character varying | 500 | YES | NULL |
| 132 | hexpcptototaldesc | character varying | 500 | YES | NULL |
| 133 | hexpsncobfacblqofi | character | 1 | YES | NULL |
| 134 | hisexpcadrafpago | numeric | 5,0 | YES | NULL |
| 135 | hexpsnsmsbienv | character | 1 | NO | 'N'::bpchar |
| 136 | hexpsnestimarcontador | character | 1 | YES | NULL |
| 137 | hexpsnconsvalidoini | character | 1 | YES | NULL |
| 138 | hexpupdid | numeric | 5,0 | NO | 0 |
| 139 | hexpimpcambsenba | character | 1 | NO | 'N'::bpchar |
| 140 | hisexpctracod | numeric | 5,0 | YES | NULL |
| 141 | hisexpolcoperid | numeric | 5,0 | YES | NULL |
| 142 | hexpsnasigbonif | character | 1 | NO | 'N'::bpchar |
| 143 | hexpestimnlval | numeric | 5,0 | NO | 2 |
| 144 | hexpobligvalvret | character | 1 | NO | 'N'::bpchar |
| 145 | hexpnumpladifdef | numeric | 5,0 | NO | 0 |
| 146 | hexpsnediremabo | character | 1 | NO | 'S'::bpchar |
| 147 | hexpsnalconrefext | character | 1 | NO | 'N'::bpchar |
| 148 | hexpsnsacofacext | character | 1 | NO | 'N'::bpchar |
| 149 | hexpsnordenfacext | character | 1 | NO | 'N'::bpchar |
| 150 | hexpsnregbaja | character | 1 | NO | 'S'::bpchar |
| 151 | hexpsntitularpagdef | character | 1 | NO | 'N'::bpchar |
| 152 | hexpsncobfaccon | character | 1 | NO | 'N'::bpchar |
| 153 | hexptipvar | numeric | 5,0 | YES | NULL |
| 154 | hexpnummeses | numeric | 5,0 | YES | NULL |
| 155 | hexpsnloteauto | character | 1 | NO | 'N'::bpchar |
| 156 | hexpformlote | numeric | 5,0 | YES | NULL |
| 157 | hexpsnarchivarlote | character | 1 | NO | 'N'::bpchar |
| 158 | hexpsnfaceprop | character | 1 | NO | 'N'::bpchar |
| 159 | hexpsnbloqcob | character | 1 | NO | 'N'::bpchar |
| 160 | hexpplazoemremsinp | numeric | 5,0 | YES | 3 |
| 161 | hexpdiasavideu | numeric | 5,0 | YES | NULL |
| 162 | hexptlfivr | numeric | 11,0 | YES | NULL |
| 163 | hexptpmodel | numeric | 5,0 | YES | 1 |
| 164 | hexptpdocum | numeric | 5,0 | YES | 3 |
| 165 | hexpnotifauto | character | 1 | NO | 'N'::bpchar |
| 166 | hexptipcliente | character varying | 20 | YES | NULL |
| 167 | hexpnotxhoras | numeric | 5,0 | NO | 0 |
| 168 | hexpnotxmin | numeric | 5,0 | YES | NULL |
| 169 | hexpnotxminanu | numeric | 5,0 | YES | NULL |
| 170 | hexpdifminhorprev | numeric | 5,0 | YES | NULL |
| 171 | hexpdifmininiobra | numeric | 5,0 | YES | NULL |
| 172 | hexpperprohini | time without time zone |  | YES | NULL |
| 173 | hexpperprohfin | time without time zone |  | YES | NULL |
| 174 | hexptipvarcor | numeric | 5,0 | YES | NULL |
| 175 | hexptipoperac | numeric | 5,0 | YES | NULL |
| 176 | hexpjexendesc | character varying | 423 | YES | NULL |
| 177 | hexpjnosujdesc | character varying | 423 | YES | NULL |
| 178 | hexpnotalect | character varying | 2 | YES | NULL |
| 179 | hexpoperariocod | numeric | 5,0 | YES | NULL |
| 180 | hexpoperarioperid | numeric | 5,0 | YES | NULL |
| 181 | hexplogosoc | character varying | 20 | YES | NULL |
| 182 | hexpsngendocrecap | character | 1 | NO | 'S'::bpchar |
| 183 | hexpprohminant | numeric | 5,0 | YES | NULL |
| 184 | hexpsnfaceinfoadicon | character | 1 | NO | 'N'::bpchar |
| 185 | hexpmesantmin | numeric | 5,0 | NO | 12 |
| 186 | hexpimprdiredoc | character | 1 | NO | 'N'::bpchar |
| 187 | hexpnumdevcancel | numeric | 5,0 | NO | 2 |
| 188 | hexpnumdiarem | numeric | 5,0 | NO | 1 |
| 189 | hexpexcfacobsfug | character | 1 | NO | 'S'::bpchar |
| 190 | hexpexcfaclecest | character | 1 | NO | 'S'::bpchar |
| 191 | hexpobsexcfac | character varying | 105 | YES | NULL |
| 192 | hexpxcientoinc | numeric | 5,2 | NO | 0.00 |
| 193 | hexpdiamesreme | numeric | 5,0 | NO | 0 |
| 194 | hexpcconscero | numeric | 5,0 | YES | NULL |
| 195 | hexpcodsgo | character varying | 5 | YES | NULL |
| 196 | hexpdiasnuevaremesa | numeric | 5,0 | YES | NULL |
| 197 | hexpsnenvsicer | character | 1 | NO | 'N'::bpchar |
| 198 | hexpsnestnolei | character | 1 | NO | 'N'::bpchar |
| 199 | hexpsncieciclec | character | 1 | NO | 'N'::bpchar |
| 200 | hexpsnpercerravi | character | 1 | NO | 'N'::bpchar |
| 201 | hexpsncrearfact | character | 1 | NO | 'N'::bpchar |
| 202 | hexpsnprefact | character | 1 | NO | 'N'::bpchar |
| 203 | hexpsngenmens | character | 1 | NO | 'N'::bpchar |
| 204 | hexpsnaceptfact | character | 1 | NO | 'N'::bpchar |
| 205 | hexpsngendoc | character | 1 | NO | 'N'::bpchar |
| 206 | hexpsngenefact | character | 1 | NO | 'N'::bpchar |
| 207 | hexpnumdiaestlei | numeric | 5,0 | YES | NULL |
| 208 | hexpnumdiaciecic | numeric | 5,0 | YES | NULL |
| 209 | hexpnumdiacrefact | numeric | 5,0 | YES | NULL |
| 210 | hexpnumdiaprefact | numeric | 5,0 | YES | NULL |
| 211 | hexpnumdiagenmens | numeric | 5,0 | YES | NULL |
| 212 | hexpnumdiaacepfact | numeric | 5,0 | YES | NULL |
| 213 | hexpnumdiagendoc | numeric | 5,0 | YES | NULL |
| 214 | hexpnumdiagenefact | numeric | 5,0 | YES | NULL |
| 215 | hexpporcdifdom | numeric | 5,2 | YES | NULL |
| 216 | hexpporcdifind | numeric | 5,2 | YES | NULL |
| 217 | hexpcuotasadiplan | numeric | 5,0 | YES | NULL |
| 218 | hexpsnmodfpag | character | 1 | NO | 'S'::bpchar |
| 219 | hexpsngenpadron | character | 1 | NO | 'N'::bpchar |
| 220 | hexpmodpadron | numeric | 5,0 | YES | NULL |
| 221 | hexpurlpago | character varying | 200 | YES | NULL |
| 222 | hexpsngenrefsal | character | 1 | NO | 'N'::bpchar |
| 223 | hexpsnnousarsaldeu | character | 1 | NO | 'N'::bpchar |
| 224 | hexptraaprobgest | numeric | 5,0 | NO | 1 |
| 225 | hexpsnrepautsum | character | 1 | NO | 'N'::bpchar |
| 226 | hexpsnlotrepman | character | 1 | NO | 'N'::bpchar |
| 227 | hexpsngastreap | character | 1 | NO | 'N'::bpchar |
| 228 | hexpm3ptoe | numeric | 10,0 | YES | NULL |
| 229 | hexpagrcon | character varying | 256 | YES | NULL |
| 230 | hexpconexcl | character varying | 256 | YES | NULL |
| 231 | hexptipsumexcl | character varying | 256 | YES | NULL |
| 232 | hexppernotifind | numeric | 10,0 | YES | NULL |
| 233 | hexpnifcont | character varying | 15 | YES | NULL |
| 234 | hexpdirenvcont | character | 1 | NO | 'P'::bpchar |
| 235 | hexpsncaldemoracobro | character | 1 | YES | NULL |
| 236 | hexpporcdemora | numeric | 6,3 | YES | NULL |
| 237 | hexpvardemora | numeric | 5,0 | YES | NULL |
| 238 | hexpcarconauto | character | 1 | NO | 'N'::bpchar |
| 239 | hexpcarconpernoleido | numeric | 5,0 | YES | NULL |
| 240 | hexpcarconanno | numeric | 5,0 | YES | NULL |
| 241 | hexpcarconobs | character varying | 256 | YES | NULL |
| 242 | hexpsnusarsaldo | character | 1 | NO | 'N'::bpchar |
| 243 | hexpsnrecfianza | character | 1 | NO | 'N'::bpchar |
| 244 | hexpsncomunilotecamb | character | 1 | YES | NULL |
| 245 | hexpsnlotecambauto | character | 1 | YES | NULL |
| 246 | hexpmotivoscomunica | character varying | 256 | YES | NULL |
| 247 | hexptipcliavvenfac | character varying | 20 | YES | NULL |
| 248 | hexpdiasintdem | numeric | 5,0 | YES | NULL |
| 249 | hexpciclosrefcobro | numeric | 5,0 | YES | NULL |
| 250 | hexpintfracccp | numeric | 5,2 | YES | NULL |
| 251 | hexpsncptocobroant | character | 1 | NO | 'N'::bpchar |
| 252 | hexpvarintfracc | numeric | 5,0 | YES | NULL |
| 253 | hexpcobrocpfac | numeric | 5,0 | NO | 0 |
| 254 | hexpformapagocanal | character | 1 | YES | NULL |
| 255 | hexpformapagoid | numeric | 5,0 | YES | NULL |
| 256 | hexpcobprimerplazo | character | 1 | NO | 'N'::bpchar |
| 257 | hexpsngencpagoprop | character | 1 | NO | 'N'::bpchar |
| 258 | hexpsncofactrecla | character | 1 | NO | 'N'::bpchar |
| 259 | hexpsnsecgis | character | 1 | NO | 'N'::bpchar |
| 260 | hexpsnincleins | character | 1 | NO | 'N'::bpchar |
| 261 | hexptipdocesc | character varying | 256 | YES | NULL |
| 262 | hexpedadmaxcarcp | numeric | 5,0 | YES | NULL |
| 263 | hexpvigcot | numeric | 5,0 | YES | NULL |
| 264 | hexpsocpropdeudaprop | numeric | 10,0 | YES | NULL |
| 265 | hexpsninfextrareclam | character varying | 1 | YES | NULL |
| 266 | hexpsnvarfacturado | character varying | 1 | YES | NULL |
| 267 | hexpsndotcargo | character | 1 | NO | 'N'::bpchar |
| 268 | hexpsndeudasocprop | character varying | 1 | YES | NULL |
| 269 | hexpsnplazosintdemora | character varying | 1 | YES | NULL |
| 270 | hexpsocsaldosfavor | numeric | 10,0 | YES | NULL |
| 271 | hexppormaxintfrac | numeric | 5,2 | YES | NULL |
| 272 | hexpmotivosfto | character varying | 256 | YES | NULL |
| 273 | hexpprfid | numeric | 5,0 | YES | NULL |
| 274 | hexpencsuezlopd | character varying | 1 | YES | NULL |
| 275 | hexpsoctratdato | numeric | 10,0 | YES | NULL |
| 276 | hexpdiasprevavisocp | numeric | 5,0 | YES | NULL |
| 277 | hexpsnwaterc | character varying | 1 | YES | NULL |
| 278 | hexpsnfactrepoauto | character | 1 | YES | NULL |
| 279 | hexpcptofactdifrepo | numeric | 5,0 | YES | NULL |
| 280 | hexpexclfactsubr | character | 1 | YES | NULL |
| 281 | hexpsnauditoria | character | 1 | YES | NULL |
| 282 | hexpsnauditoriaext | character | 1 | YES | NULL |
| 283 | hexpcatcntnopto | character varying | 50 | YES | NULL |
| 284 | hexpagprodatostxtid | numeric | 10,0 | YES | NULL |
| 285 | hexpagprodatosdesc | character varying | 100 | YES | NULL |
| 286 | hexpwebagprodatos | character varying | 100 | YES | NULL |
| 287 | hexpimprimpconsent | character | 1 | YES | NULL |
| 288 | hexpnumordanthis | numeric | 5,0 | YES | NULL |
| 289 | hexpsnenvobslecser | character | 1 | NO | 'N'::bpchar |
| 290 | hexpsnenvordgestor | character | 1 | NO | 'S'::bpchar |
| 291 | hexpvarredondeofto | numeric | 5,0 | YES | NULL |
| 292 | hexpsnusarsaldoant | character | 1 | NO | 'N'::bpchar |
| 293 | hexptlcatcomer2 | numeric | 11,0 | YES | NULL |
| 294 | hexpsnfeccobalt | character | 1 | NO | 'N'::bpchar |
| 295 | hexpcontaller | numeric | 5,0 | YES | NULL |
| 296 | hexpidplataf | character varying | 36 | YES | NULL |
| 297 | hexpsndigital | character | 1 | YES | 'N'::bpchar |
| 298 | hexpsnbiom | character | 1 | YES | 'N'::bpchar |
| 299 | hexpsnacortarurl | character | 1 | NO | 'N'::bpchar |
| 300 | hexpremisms | character varying | 11 | YES | NULL |
| 301 | hexpremimail | character varying | 110 | YES | NULL |
| 302 | hexpsistregest | numeric | 5,0 | YES | NULL |
| 303 | hexpanregest | numeric | 5,0 | YES | NULL |
| 304 | hexpsndrop | character | 1 | NO | 'N'::bpchar |
| 305 | hexpsndatossensible | character | 1 | NO | 'N'::bpchar |
| 306 | hexpdatossensibles | character varying | 90 | YES | NULL |
| 307 | hexpsnllavecerrada | character | 1 | NO | 'N'::bpchar |
| 308 | hexpmesescllave | numeric | 5,0 | YES | '0'::numeric |
| 309 | hexpobsexccllave | character varying | 256 | YES | ''::character varying |
| 310 | hexpsncertdig | character | 1 | NO | 'N'::bpchar |
| 311 | hexpdigfluid | character varying | 50 | YES | NULL |
| 312 | hexpbiofluid | character varying | 50 | YES | NULL |
| 313 | hexpcerfluid | character varying | 50 | YES | NULL |
| 314 | hexpmesesmaxcllave | numeric | 5,0 | YES | '0'::numeric |
| 315 | hexpzonascllave | character varying | 256 | YES | ''::character varying |
| 316 | hexpsnservdeuda | character | 1 | YES | NULL |
| 317 | hexpdoccortedeuda | character varying | 256 | YES | NULL |
| 318 | hexpordencortedeuda | character varying | 256 | YES | NULL |
| 319 | hexpsisgesficlot | numeric | 5,0 | NO | '1'::numeric |
| 320 | hexpsnmodleccont | character | 1 | NO | 'N'::bpchar |
| 322 | hexpnmaxdocspago | numeric | 5,0 | YES | NULL |
| 323 | hexppermaxvalid | numeric | 5,0 | YES | NULL |
| 324 | hexptlwhatsapp | numeric | 11,0 | YES | NULL |
| 325 | hexpsnusarsaldamor | character | 1 | YES | NULL |
| 326 | hexpsnumdr | character | 1 | YES | NULL |
| 327 | hexptippuntexccllave | character varying | 256 | YES | NULL |
| 328 | hexptipcliexccllave | character varying | 256 | YES | NULL |
| 329 | hexpdiasexccllave | numeric | 5,0 | YES | NULL |
| 330 | hexpcadrafpagocp | numeric | 5,0 | YES | NULL |
| 331 | hexpfecdesajudicacion | date |  | YES | NULL |
| 332 | hexpsntimbrarabonos | character | 1 | YES | 'S'::bpchar |
| 333 | hexpmarcasoc | character varying | 50 | YES | NULL |
| 334 | hexpcontarco | character varying | 90 | YES | NULL |
| 335 | hexpsnrblergpd | character | 1 | YES | NULL |
| 336 | hexpidsocdm | character varying | 36 | YES | NULL |
| 337 | hexpmodelocp | numeric | 5,0 | YES | NULL |
| 338 | hexpsnexcfacqueja | character | 1 | NO | 'N'::bpchar |
| 339 | hexpsocpropcreajuifrau | character varying | 200 | YES | NULL |
| 340 | hexpsnrecestsalaut | character | 1 | YES | NULL |
| 341 | hexpmomrecestsalaut | numeric | 5,0 | YES | NULL |
| 342 | hexpzonasrecsalaut | character varying | 256 | YES | NULL |
| 343 | hexpdiasvencsaldobolsa | numeric | 5,0 | YES | NULL |
| 344 | hexpsngenfragasfra | character | 1 | YES | NULL |
| 345 | hexpsnjuiciofacdef | character | 1 | NO | 'N'::bpchar |
| 346 | hexpsnjuiciofacprov | character | 1 | NO | 'N'::bpchar |
| 347 | hexpndiasprimeracom | numeric | 4,0 | YES | NULL |
| 348 | hexpndiasjuridico | numeric | 4,0 | YES | NULL |
| 349 | hexpndiasalegacionnoatend | numeric | 4,0 | YES | NULL |
| 350 | hexpcambcontant | character | 1 | YES | NULL |
| 351 | hexpmaxdeuda12gotas | numeric | 18,2 | YES | NULL |
| 352 | hexpmaxfacimp12gotas | numeric | 5,0 | YES | NULL |
| 353 | hexplitdiacanon | numeric | 5,0 | YES | NULL |

### hisexplotiposubrog
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hextsexpid | numeric | 5,0 | NO | NULL |
| 2 | hextstsrgid | numeric | 5,0 | NO | NULL |
| 3 | hextshstusu | character varying | 10 | NO | NULL |
| 4 | hextshsthora | timestamp without time zone |  | NO | NULL |
| 5 | hextsgeneradoc | character | 1 | YES | NULL |
| 6 | hextsclauid | numeric | 5,0 | YES | NULL |

### hisexplotipvar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hetpvexpid | numeric | 5,0 | NO | NULL |
| 2 | hetpvtpvid | numeric | 5,0 | NO | NULL |
| 3 | hetpvvaldef | character | 10 | YES | NULL |
| 4 | hetpvperidic | numeric | 5,0 | YES | NULL |
| 5 | hetpvsnajustepi | character | 1 | NO | NULL |
| 6 | hetpvsnimpfact | character | 1 | NO | 'S'::bpchar |
| 7 | hetpvhstusu | character varying | 10 | NO | NULL |
| 8 | hetpvhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 9 | hetpvsnparamk | character | 1 | NO | 'N'::bpchar |
| 10 | hetpvtxtid | numeric | 10,0 | YES | NULL |
| 11 | hetpvsngesbonif | character | 1 | NO | 'N'::bpchar |
| 12 | hetpvsnimpot | character | 1 | NO | 'N'::bpchar |
| 13 | hetpvsnimpcntt | character | 1 | NO | 'N'::bpchar |
| 14 | hetpvtxtdesc | character varying | 1000 | YES | NULL |
| 15 | hetpvidioma | character | 2 | YES | NULL |

### hisexplotloc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexlexpid | numeric | 5,0 | NO | NULL |
| 2 | hexllocid | numeric | 10,0 | NO | NULL |
| 3 | hexlofiid | numeric | 5,0 | NO | NULL |
| 4 | hexlescudo | numeric | 10,0 | YES | NULL |
| 5 | hexlcertcal | numeric | 10,0 | YES | NULL |
| 6 | hexlcertgma | numeric | 10,0 | YES | NULL |
| 7 | hexlsn_dirtxt | character | 1 | NO | NULL |
| 8 | hexlpobid | numeric | 10,0 | YES | NULL |
| 9 | hexltxtayunt | numeric | 10,0 | YES | NULL |
| 10 | hexlsnlocprinc | character | 1 | NO | NULL |
| 11 | hexlhstusu | character varying | 10 | NO | NULL |
| 12 | hexlhsthora | timestamp without time zone |  | NO | NULL |
| 13 | hexlsocayunt | numeric | 10,0 | YES | NULL |

### hisexplotxtcnt
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hetxtexpid | numeric | 5,0 | NO | NULL |
| 2 | hetxtclsccod | character | 2 | NO | NULL |
| 3 | hetxtviacod | character | 2 | NO | NULL |
| 4 | hetxtsnactivo | character | 1 | NO | NULL |
| 5 | hetxttxtid | numeric | 10,0 | NO | NULL |
| 6 | hetxthstusu | character varying | 10 | NO | NULL |
| 7 | hetxthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 8 | hetxttddesc | character varying | 1000 | NO | NULL |
| 9 | hetxtidioma | character | 2 | NO | NULL |

### hisexplotxtfunc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hetxfexpid | numeric | 5,0 | NO | NULL |
| 2 | hetxffuncod | character varying | 50 | NO | NULL |
| 3 | hetxfviacod | character | 2 | NO | NULL |
| 4 | hetxfsnactivo | character | 1 | NO | NULL |
| 5 | hetxftxtid | numeric | 10,0 | NO | NULL |
| 6 | hetxfhstusu | character varying | 10 | NO | NULL |
| 7 | hetxfhsthora | timestamp without time zone |  | NO | NULL |
| 8 | hetxftddesc | character varying | 1000 | NO | NULL |
| 9 | hetxfidioma | character | 2 | NO | NULL |

### hisexpservcentral
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hescexpid | numeric | 5,0 | NO | NULL |
| 2 | hescsecid | numeric | 10,0 | NO | NULL |
| 3 | hescrscid | numeric | 10,0 | NO | NULL |
| 4 | hescfechaini | date |  | NO | NULL |
| 5 | hescfechafin | date |  | YES | NULL |
| 6 | hescindicadorsn | character | 1 | NO | NULL |
| 7 | heschstusu | character varying | 10 | NO | ' '::character varying |
| 8 | heschsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 9 | heschstmodif | character | 1 | NO | NULL |

### hisexptipdocumento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hetcexpid | numeric | 5,0 | NO | NULL |
| 2 | hetctcmid | numeric | 5,0 | NO | NULL |
| 3 | hetcsnenvps | character | 1 | NO | NULL |
| 4 | hetcsnenvdf | character | 1 | NO | NULL |
| 5 | hetcncoplis | numeric | 5,0 | NO | NULL |
| 6 | hetctxtlibre | numeric | 10,0 | YES | NULL |
| 7 | hetchstusu | character varying | 10 | NO | NULL |
| 8 | hetchsthora | timestamp without time zone |  | NO | NULL |
| 9 | htcmtddesc | character varying | 1000 | YES | NULL |
| 10 | htcmidioma | character | 2 | YES | NULL |
| 11 | hetcsncarta | character | 1 | YES | 'S'::bpchar |
| 12 | hetcsnemail | character | 1 | YES | 'N'::bpchar |
| 13 | hetcsnsms | character | 1 | YES | 'N'::bpchar |
| 14 | hetcnumcopiassepa | numeric | 5,0 | NO | 0 |
| 15 | hetcsnfirma | character | 1 | NO | 'S'::bpchar |
| 16 | hetcsnpush | character | 1 | NO | 'N'::bpchar |
| 17 | hetctipofirma | character | 1 | NO | 'F'::bpchar |
| 18 | hetcsnincnomfir | character | 1 | NO | 'N'::bpchar |
| 19 | hetctipofirmante | character | 1 | NO | 'A'::bpchar |
| 20 | hetcfirid | numeric | 10,0 | YES | NULL |
| 21 | hetccargo | character | 1 | YES | NULL |
| 22 | hetcaprid | numeric | 10,0 | YES | 0 |
| 23 | hetcsnimpraf | character | 1 | NO | 'N'::bpchar |
| 24 | hetcsncertdig | character | 1 | NO | 'N'::bpchar |
| 25 | hetcsndestcli | character | 1 | NO | 'N'::bpchar |
| 26 | hetcestgesrec | character varying | 80 | YES | NULL |
| 27 | hetcestentregasicer | character varying | 50 | YES | NULL |
| 28 | hetcsncontigo | character | 1 | NO | 'N'::bpchar |
| 29 | hetcsnemailysms | character | 1 | NO | 'N'::bpchar |

### hisexptipsubdoccontr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hetsdcexpid | numeric | 5,0 | NO | NULL |
| 2 | hetsdctsrgid | numeric | 5,0 | NO | NULL |
| 3 | hetsdcdconid | numeric | 10,0 | NO | NULL |
| 4 | hetsdcordenimp | numeric | 5,0 | NO | NULL |
| 5 | hetsdcsnactivo | character | 1 | NO | NULL |
| 6 | hetsdchstusu | character varying | 10 | NO | NULL |
| 7 | hetsdchsthora | timestamp without time zone |  | NO | NULL |

### hisexpvertido
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexvid | numeric | 10,0 | NO | NULL |
| 2 | hexvpolnum | numeric | 10,0 | NO | NULL |
| 3 | hexvempresa | character varying | 100 | YES | NULL |
| 4 | hexvestado | numeric | 5,0 | NO | NULL |
| 5 | hexvclavecvi | character varying | 10 | YES | NULL |
| 6 | hexvexpid | numeric | 5,0 | YES | NULL |
| 7 | hexvpolcod | character varying | 50 | YES | NULL |
| 8 | hexvcaduca | date |  | YES | NULL |
| 9 | hexvobsid | numeric | 10,0 | YES | NULL |
| 10 | hexvobserva | character varying | 500 | YES | NULL |
| 11 | hexvobsdecl | character varying | 500 | YES | NULL |
| 12 | hexvsnemedida | character | 1 | NO | NULL |
| 13 | hexvsnamedida | character | 1 | NO | NULL |
| 14 | hexvmedidas | character varying | 500 | YES | NULL |
| 15 | hexvsncanon | character | 1 | NO | NULL |
| 16 | hexvdesccan | character varying | 500 | YES | NULL |
| 17 | hexvobsdepu | character varying | 100 | YES | NULL |
| 18 | hexvhstusu | character varying | 10 | NO | NULL |
| 19 | hexvhsthora | timestamp without time zone |  | NO | NULL |
| 20 | hexvsituacion | numeric | 5,0 | NO | 2 |
| 21 | hexvpprsidd | numeric | 10,0 | YES | NULL |
| 22 | hexvpcnaecodd | numeric | 10,0 | YES | NULL |
| 23 | hexvpprsida | numeric | 10,0 | YES | NULL |
| 24 | hexvpcnaecoda | numeric | 10,0 | YES | NULL |
| 25 | hexvsndist | character | 1 | NO | 'N'::bpchar |
| 26 | hexvsnpdteact | character | 1 | NO | 'N'::bpchar |
| 27 | hexvtsacod | character | 5 | YES | NULL |
| 28 | hexvsafecha | date |  | YES | NULL |
| 29 | hexvcaudal | numeric | 10,0 | NO | 0 |

### hisexsubcontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hexscnttnum | numeric | 10,0 | NO | NULL |
| 2 | hexstconid | numeric | 5,0 | NO | NULL |
| 3 | hexstsubid | numeric | 5,0 | NO | NULL |
| 4 | hexsmotivo | character varying | 50 | NO | NULL |
| 5 | hexshstusu | character varying | 10 | NO | NULL |
| 6 | hexshsthora | timestamp without time zone |  | NO | NULL |
| 7 | hexshstmodif | character | 1 | NO | NULL |

### hisextracto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hextrid | numeric | 10,0 | YES | NULL |
| 2 | hextrobserv | character varying | 80 | YES | NULL |
| 3 | hextrhstusu | character varying | 10 | YES | NULL |
| 4 | hextrhsthora | timestamp without time zone |  | YES | NULL |

### hisfacbi
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hfbifacid | numeric |  | NO | NULL |
| 2 | hfbifeccamb | date |  | NO | NULL |
| 3 | hfbiestcamb | numeric | 5,0 | NO | 0 |

### hisfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hfacid | numeric | 10,0 | NO | NULL |
| 2 | hfacfecvto | date |  | NO | NULL |
| 3 | hfachstusu | character varying | 10 | NO | NULL |
| 4 | hfachsthora | timestamp without time zone |  | NO | NULL |

### hisfecdesglos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hopdid | numeric | 10,0 | NO | NULL |
| 2 | hopdfecprevold | date |  | NO | NULL |
| 3 | hopdfecprevnew | date |  | NO | NULL |
| 4 | hopdhstusu | character varying | 30 | NO | NULL |
| 5 | hopdhsthora | timestamp without time zone |  | NO | NULL |

### hisficherosborrados
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hfbfichero | character varying | 200 | NO | NULL |
| 2 | hfbhora | timestamp without time zone |  | NO | NULL |
| 3 | hfbusuid | character varying | 10 | NO | NULL |

### hisfirmaelectronica
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hfecid | numeric | 10,0 | NO | NULL |
| 2 | hfecmovil | character varying | 20 | YES | NULL |
| 3 | hfecestado | numeric | 5,0 | YES | NULL |
| 4 | hfecdetalle | character varying | 256 | YES | NULL |
| 5 | hfechsthora | timestamp without time zone |  | NO | NULL |
| 6 | hfechstusu | character varying | 10 | NO | NULL |
| 7 | hfecemail | character varying | 150 | YES | NULL |
| 8 | hfecsnadjrev | character | 1 | YES | NULL |
| 9 | hfecgestionado | character | 1 | YES | NULL |
| 10 | hfecprefijo | character varying | 5 | YES | NULL |

### hisfrmpagoban
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hfpbbngsoc | numeric | 10,0 | NO | NULL |
| 2 | hfpbbngbanid | numeric | 5,0 | NO | NULL |
| 3 | hfpbcanaid | character | 1 | NO | NULL |
| 4 | hfpbfmpid | numeric | 5,0 | NO | NULL |
| 5 | hfpbccuecon | numeric | 5,0 | NO | NULL |
| 6 | hfpbcuegast | numeric | 5,0 | NO | NULL |
| 7 | hfpbtimpuid | numeric | 5,0 | YES | NULL |
| 8 | hfpbhstusu | character varying | 10 | YES | NULL |
| 9 | hfpbhsthora | timestamp without time zone |  | YES | NULL |
| 10 | hfpbnif | character varying | 15 | YES | NULL |

### hisgesrecl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hgesid | numeric | 10,0 | NO | NULL |
| 2 | hgesestado | numeric | 5,0 | YES | NULL |
| 3 | hgesfvento | date |  | YES | NULL |
| 4 | hgesfeccar | date |  | YES | NULL |
| 5 | hgespcsid | numeric | 10,0 | YES | NULL |
| 6 | hgeshstusu | character varying | 10 | YES | NULL |
| 7 | hgeshsthora | timestamp without time zone |  | YES | NULL |
| 8 | hgesaprobada | character | 1 | YES | NULL |
| 9 | hgesnoaprobada | character | 1 | YES | NULL |

### hisgestcobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hgcobprsid | numeric | 10,0 | NO | NULL |
| 2 | hgcobexpid | numeric | 5,0 | NO | NULL |
| 3 | hgcobtgcid | numeric | 5,0 | NO | NULL |
| 4 | hgcobdiasplazo | numeric | 5,0 | NO | NULL |
| 5 | hgcobcomision | numeric | 6,2 | NO | NULL |
| 6 | hgcobhstusu | character varying | 10 | NO | NULL |
| 7 | hgcobhsthora | timestamp without time zone |  | NO | NULL |
| 8 | hgcobforaplicom | numeric | 5,0 | YES | NULL |
| 9 | hgcobcomalta | numeric | 6,2 | YES | NULL |
| 10 | hgcobcombaja | numeric | 6,2 | YES | NULL |

### hisgestreccprov
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hgespid | numeric | 10,0 | NO | NULL |
| 2 | hgespprppid | numeric | 10,0 | NO | NULL |
| 3 | hgesppaspid | numeric | 5,0 | NO | NULL |
| 4 | hgesporigen | character | 1 | NO | NULL |
| 5 | hgespsesini | numeric | 10,0 | NO | NULL |
| 6 | hgespfvento | date |  | NO | NULL |
| 7 | hgespestado | numeric | 5,0 | NO | NULL |
| 8 | hgespresid | numeric | 10,0 | YES | NULL |
| 9 | hgesppcsid | numeric | 10,0 | YES | NULL |
| 10 | hgesphstusu | character varying | 10 | NO | NULL |
| 11 | hgesphsthora | timestamp without time zone |  | NO | NULL |

### hisgesttramos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hgsttprsid | numeric | 10,0 | NO | NULL |
| 2 | hgsttexpid | numeric | 5,0 | NO | NULL |
| 3 | hgsttlimite | numeric | 5,0 | NO | NULL |
| 4 | hgsttdescripcion | character varying | 50 | NO | NULL |
| 5 | hgsttcomision | numeric | 6,2 | NO | NULL |
| 6 | hgstthstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 7 | hgstthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 8 | hgstthstmodif | character | 1 | NO | 'M'::bpchar |

### hisgrupovarcontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hgvctctcod | numeric | 10,0 | NO | NULL |
| 2 | hgvcgrupo | numeric | 5,0 | NO | NULL |
| 3 | hgvcdesc | character varying | 30 | NO | NULL |
| 4 | hgvcminvars | numeric | 5,0 | NO | NULL |
| 5 | hgvcmaxvars | numeric | 5,0 | NO | NULL |
| 6 | hgvchstusu | character varying | 10 | NO | NULL |
| 7 | hgvchsthora | timestamp without time zone |  | NO | NULL |

### hisimpvalfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hivfexpid | numeric | 5,0 | NO | NULL |
| 2 | hivfperiid | numeric | 5,0 | NO | NULL |
| 3 | hivfusocod | numeric | 5,0 | NO | NULL |
| 4 | hivfimpmin | numeric | 18,2 | NO | NULL |
| 5 | hivfimpmax | numeric | 18,2 | NO | NULL |
| 6 | hivfsnactiva | character | 1 | NO | NULL |
| 7 | hivfhstusu | character varying | 10 | NO | NULL |
| 8 | hivfhsthora | timestamp without time zone |  | NO | NULL |
| 9 | hivfsnaltas | character | 1 | NO | 'S'::bpchar |

### hisimpvalfacact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hivfaexpid | numeric | 5,0 | NO | NULL |
| 2 | hivfaperiid | numeric | 5,0 | NO | NULL |
| 3 | hivfausocod | numeric | 5,0 | NO | NULL |
| 4 | hivfaactivid | numeric | 5,0 | NO | NULL |
| 5 | hivfaimpmin | numeric | 18,2 | NO | NULL |
| 6 | hivfaimpmax | numeric | 18,2 | NO | NULL |
| 7 | hivfasnactiva | character | 1 | NO | NULL |
| 8 | hivfahstusu | character varying | 10 | NO | NULL |
| 9 | hivfahsthora | timestamp without time zone |  | NO | NULL |

### hisjuicio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hjuid | numeric | 10,0 | NO | NULL |
| 2 | hjuestado | numeric | 5,0 | NO | NULL |
| 3 | hjudemanda1 | numeric | 10,0 | YES | NULL |
| 4 | hjudemanda2 | numeric | 10,0 | YES | NULL |
| 5 | hjudemanda3 | numeric | 10,0 | YES | NULL |
| 6 | hjujuzgado | character varying | 30 | YES | NULL |
| 7 | hjufecjuici | date |  | YES | NULL |
| 8 | hjunumero | character varying | 30 | YES | NULL |
| 9 | hjusitcobro | numeric | 5,0 | NO | NULL |
| 10 | hjucaducado | character | 1 | NO | NULL |
| 11 | hjufaborabl | character | 1 | NO | NULL |
| 12 | hjuobsid | numeric | 10,0 | YES | NULL |
| 13 | hjuexterno | character | 1 | NO | NULL |
| 14 | hjufecpresentacion | date |  | YES | NULL |
| 15 | hjufecresolucion | date |  | YES | NULL |
| 16 | hjufecanulacion | date |  | YES | NULL |
| 17 | hjumonitorio | character | 1 | NO | NULL |
| 18 | hjuhstusu | character varying | 10 | NO | NULL |
| 19 | hjuhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 20 | hjusnconciliacion | character | 1 | NO | 'N'::bpchar |
| 21 | hjusnnotarial | character | 1 | NO | 'N'::bpchar |
| 22 | hjusndesfavorable | character | 1 | NO | 'N'::bpchar |
| 23 | hjusnverbal | character | 1 | NO | 'N'::bpchar |
| 24 | hjusnordinario | character | 1 | NO | 'N'::bpchar |
| 25 | hjufecejecucion | date |  | YES | NULL |
| 26 | hjufecrevpatrimon | date |  | YES | NULL |
| 27 | hjudemanda4 | numeric | 10,0 | YES | NULL |
| 28 | hjusubestado | numeric | 5,0 | YES | NULL |
| 29 | hjuabogado | numeric | 10,0 | YES | NULL |
| 30 | hjucargo | numeric | 10,0 | YES | NULL |
| 31 | hjugestorcobro | numeric | 10,0 | YES | NULL |
| 32 | hjufecliqtasas | date |  | YES | NULL |
| 33 | hjufecliqfija | date |  | YES | NULL |
| 34 | hjufecliqtotal | date |  | YES | NULL |
| 35 | hjusnorigenfraude | character | 1 | NO | 'N'::bpchar |
| 36 | hjusnpenal | character | 1 | NO | 'N'::bpchar |
| 37 | hjusncivil | character | 1 | NO | 'N'::bpchar |

### hisleclote
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlexpid | numeric | 5,0 | NO | NULL |
| 2 | hlzonid | character | 3 | NO | NULL |
| 3 | hlanno | numeric | 5,0 | NO | NULL |
| 4 | hlperid | numeric | 5,0 | NO | NULL |
| 5 | hlpernum | numeric | 5,0 | NO | NULL |
| 6 | hllottipo | character | 1 | NO | NULL |
| 7 | hllotnum | numeric | 5,0 | NO | NULL |
| 8 | hlcontrcod | numeric | 5,0 | NO | NULL |
| 9 | hloperid | numeric | 5,0 | NO | NULL |
| 10 | hlfeclect | date |  | NO | NULL |
| 11 | hllibcod | numeric | 5,0 | NO | NULL |
| 12 | hlnumabo | numeric | 5,0 | YES | NULL |
| 13 | hltotbat | numeric | 5,0 | YES | NULL |
| 14 | hltotnobat | numeric | 5,0 | YES | NULL |
| 15 | hlnoleido | numeric | 5,0 | YES | NULL |
| 16 | hlinspec | numeric | 5,0 | YES | NULL |
| 17 | hlparado | numeric | 5,0 | YES | NULL |
| 18 | hlrecd | numeric | 14,0 | NO | NULL |
| 19 | hlrech | numeric | 14,0 | NO | NULL |
| 20 | hlestado | numeric | 5,0 | NO | NULL |
| 21 | hlnumconti | numeric | 5,0 | YES | NULL |
| 22 | hlnumconte | numeric | 5,0 | YES | NULL |
| 23 | hlfecrecep | timestamp without time zone |  | YES | NULL |
| 24 | hlnumcontbat | numeric | 5,0 | YES | NULL |
| 25 | hlnumcontintnl | numeric | 5,0 | YES | NULL |
| 26 | hlsntelelec | character | 1 | NO | 'N'::bpchar |
| 27 | hlpromintent | numeric | 5,2 | YES | NULL |
| 28 | hlnumcontsupints | numeric | 5,0 | YES | NULL |
| 29 | hlcontsinlectura | numeric | 5,0 | YES | NULL |
| 30 | hlcontlecfuermargen | numeric | 5,0 | YES | NULL |
| 31 | hlfechnplanificada | numeric | 5,0 | YES | NULL |
| 32 | hlnumconesp | numeric | 5,0 | YES | NULL |
| 33 | hlsntelelecexterna | character | 1 | NO | 'N'::bpchar |
| 34 | hlfeccrea | date |  | YES | NULL |
| 35 | hlfecemis | date |  | YES | NULL |

### hislecloterech
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlrexpid | numeric | 5,0 | NO | NULL |
| 2 | hlrzonid | character | 3 | NO | NULL |
| 3 | hlranno | numeric | 5,0 | NO | NULL |
| 4 | hlrperid | numeric | 5,0 | NO | NULL |
| 5 | hlrpernum | numeric | 5,0 | NO | NULL |
| 6 | hlrlottipo | character | 1 | NO | NULL |
| 7 | hlrlotnum | numeric | 5,0 | NO | NULL |
| 8 | hlrcontrcod | numeric | 5,0 | NO | NULL |
| 9 | hlroperid | numeric | 5,0 | NO | NULL |
| 10 | hlrfeclect | date |  | NO | NULL |
| 11 | hlrlibcod | numeric | 5,0 | NO | NULL |
| 12 | hlrnumabo | numeric | 5,0 | YES | NULL |
| 13 | hlrtotbat | numeric | 5,0 | YES | NULL |
| 14 | hlrtotnobat | numeric | 5,0 | YES | NULL |
| 15 | hlrnoleido | numeric | 5,0 | YES | NULL |
| 16 | hlrinspec | numeric | 5,0 | YES | NULL |
| 17 | hlrparado | numeric | 5,0 | YES | NULL |
| 18 | hlrrecd | numeric | 14,0 | NO | NULL |
| 19 | hlrrech | numeric | 14,0 | NO | NULL |
| 20 | hlrestado | numeric | 5,0 | NO | NULL |
| 21 | hlrnumconti | numeric | 5,0 | YES | NULL |
| 22 | hlrnumconte | numeric | 5,0 | YES | NULL |
| 23 | hlrfecrecep | timestamp without time zone |  | YES | NULL |
| 24 | hlrnumcontbat | numeric | 5,0 | YES | NULL |
| 25 | hlrnumcontintnl | numeric | 5,0 | YES | NULL |
| 26 | hlrsntelelec | character | 1 | NO | 'N'::bpchar |
| 27 | hlrpromintent | numeric | 5,2 | YES | NULL |
| 28 | hlrnumcontsupints | numeric | 5,0 | YES | NULL |
| 29 | hlrcontsinlectura | numeric | 5,0 | YES | NULL |
| 30 | hlrcontlecfuermargen | numeric | 5,0 | YES | NULL |
| 31 | hlrfechnplanificada | numeric | 5,0 | YES | NULL |
| 32 | hlrnumrech | numeric | 5,0 | NO | NULL |
| 33 | hlrnumconesp | numeric | 5,0 | YES | NULL |
| 34 | hlrfeccrea | date |  | YES | NULL |
| 35 | hlrfecemis | date |  | YES | NULL |

### hislibreta
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlibexpid | numeric | 5,0 | NO | NULL |
| 2 | hlibzonid | character | 3 | NO | NULL |
| 3 | hlibcod | numeric | 5,0 | NO | NULL |
| 4 | hlibdesc | character varying | 50 | YES | NULL |
| 5 | hlibsnrep | character | 1 | NO | NULL |
| 6 | hlibnabolot | numeric | 5,0 | NO | NULL |
| 7 | hlibmulabob | numeric | 5,0 | NO | NULL |
| 8 | hlibdiasgenlot | numeric | 5,0 | NO | NULL |
| 9 | hlibcascoid | numeric | 5,0 | NO | NULL |
| 10 | hlibbateria | numeric | 5,0 | NO | NULL |
| 11 | hlibnobateria | numeric | 5,0 | NO | NULL |
| 12 | hlibcerrados | numeric | 5,0 | NO | NULL |
| 13 | hlibnumjorn | numeric | 5,0 | NO | 1 |
| 14 | hlibcoefcorr | numeric | 5,3 | YES | NULL |
| 15 | hlibdestino | character varying | 10 | YES | NULL |
| 16 | hlibsnestimnl | character | 1 | NO | 'N'::bpchar |
| 17 | hlibhstusu | character varying | 10 | NO | NULL |
| 18 | hlibhsthora | timestamp without time zone |  | NO | NULL |
| 19 | hlibsnagfich | character | 1 | NO | 'N'::bpchar |

### hislicexpver
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlcvid | numeric | 10,0 | NO | NULL |
| 2 | hlcvexvid | numeric | 10,0 | NO | NULL |
| 3 | hlcvtlvid | numeric | 5,0 | NO | NULL |
| 4 | hlcvtsvid | numeric | 5,0 | NO | NULL |
| 6 | hlcvnumref | character | 20 | YES | NULL |
| 7 | hlcvfeclim | date |  | NO | NULL |
| 8 | hlcvsnflimdef | character | 1 | NO | NULL |
| 9 | hlcvsnactiva | character | 1 | NO | NULL |
| 10 | hlcvobserv | character varying | 256 | YES | NULL |
| 11 | hlcvfecasign | timestamp without time zone |  | NO | NULL |
| 12 | hlcvhstusu | character varying | 10 | NO | NULL |
| 13 | hlcvhsthora | timestamp without time zone |  | NO | NULL |
| 14 | hlcvdescactv | character varying | 150 | YES | NULL |

### hislineadistrib
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hldtid | numeric | 5,0 | NO | NULL |
| 2 | hldtexpid | numeric | 5,0 | NO | NULL |
| 3 | hldtdescrip | character varying | 50 | NO | NULL |
| 4 | hldtsndefecto | character | 1 | NO | NULL |
| 5 | hldtsnactiva | character | 1 | NO | NULL |
| 6 | hldthstusu | character varying | 10 | NO | NULL |
| 7 | hldthsthora | timestamp without time zone |  | NO | NULL |

### hisliqbloquetramo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlbtcodigo | numeric | 10,0 | NO | NULL |
| 2 | hlbtsocprop | numeric | 10,0 | NO | NULL |
| 3 | hlbtbloque | character varying | 10 | NO | NULL |
| 4 | hlbttramo | character varying | 10 | NO | NULL |
| 5 | hlbtdescrip | character varying | 80 | YES | NULL |
| 6 | hlbthstusu | character varying | 10 | NO | NULL |
| 7 | hlbthsthora | timestamp without time zone |  | NO | NULL |

### hisliqblotramtar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlbttcodigo | numeric | 10,0 | NO | NULL |
| 2 | hlbtttiptid | numeric | 5,0 | NO | NULL |
| 3 | hlbttsnactivo | character | 1 | NO | NULL |
| 4 | hlbtthstusu | character varying | 10 | NO | NULL |
| 5 | hlbtthsthora | timestamp without time zone |  | NO | NULL |

### hisliqtarifmd101
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlqttiptid | numeric | 5,0 | NO | NULL |
| 2 | hlqttipreg | numeric | 5,0 | NO | NULL |
| 3 | hlqtsnfijoreg | character | 1 | NO | NULL |
| 4 | hlqthstmodif | character | 1 | NO | NULL |
| 5 | hlqthstusu | character varying | 10 | NO | NULL |
| 6 | hlqthsthora | timestamp without time zone |  | NO | NULL |

### hisliqtipotamer
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlitcod | numeric | 10,0 | NO | NULL |
| 2 | hlitsocemi | numeric | 10,0 | NO | NULL |
| 3 | hlitsocprop | numeric | 10,0 | NO | NULL |
| 4 | hlitpobid | numeric | 10,0 | NO | NULL |
| 5 | hlitfecdesde | date |  | NO | NULL |
| 6 | hlitfechasta | date |  | NO | NULL |
| 7 | hlitfecliq | date |  | NO | NULL |
| 8 | hlitestado | numeric | 5,0 | NO | NULL |
| 9 | hlitimppremio | numeric | 10,2 | YES | NULL |
| 10 | hlitivapremio | numeric | 10,2 | YES | NULL |
| 11 | hlitmoterror | character varying | 255 | YES | NULL |
| 12 | hlitusucrea | character varying | 10 | NO | NULL |
| 13 | hlitfeccrea | timestamp without time zone |  | NO | NULL |
| 14 | hlitusucalc | character varying | 10 | YES | NULL |
| 15 | hlitfeccalc | timestamp without time zone |  | YES | NULL |
| 16 | hlitusulistado | character varying | 10 | YES | NULL |
| 17 | hlitfeclistado | timestamp without time zone |  | YES | NULL |
| 18 | hlitusuficcsv | character varying | 10 | YES | NULL |
| 19 | hlitfecficcsv | timestamp without time zone |  | YES | NULL |
| 20 | hlithstusu | character varying | 10 | NO | NULL |
| 21 | hlithsthora | timestamp without time zone |  | NO | NULL |
| 22 | hlitporccobro | numeric | 12,2 | NO | 0.00 |
| 23 | hlitporcaplicado | numeric | 12,2 | NO | 0.00 |

### hislocalidad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hlocid | numeric | 10,0 | NO | NULL |
| 2 | hlocnombre | character varying | 40 | NO | NULL |
| 3 | hlocpobid | numeric | 10,0 | NO | NULL |
| 4 | hloccodpost | character varying | 10 | YES | NULL |
| 5 | hlocindblk | numeric | 5,0 | NO | NULL |
| 6 | hlochstusu | character varying | 10 | NO | NULL |
| 7 | hlochsthora | timestamp without time zone |  | NO | NULL |
| 8 | hlocclaveloc | character varying | 10 | YES | NULL |

### hismagnitud
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hmagcod | character | 10 | NO | NULL |
| 2 | hmagtpmes | character | 1 | NO | NULL |
| 3 | hmagtxtid | numeric | 10,0 | NO | NULL |
| 4 | hmagsnactiva | character | 1 | NO | NULL |
| 5 | hmaghstusu | character varying | 10 | NO | NULL |
| 6 | hmaghsthora | timestamp without time zone |  | NO | NULL |
| 7 | hmagtddesc | character varying | 1000 | YES | NULL |
| 8 | hmagtdidicod | character | 2 | YES | NULL |

### hismodestimac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hmestid | numeric | 5,0 | NO | NULL |
| 2 | hmesttxtid | numeric | 10,0 | NO | NULL |
| 3 | hmestprog | character varying | 10 | NO | NULL |
| 4 | hmestsnactivo | character | 1 | NO | NULL |
| 5 | hmesthstusu | character varying | 10 | NO | NULL |
| 6 | hmesthsthora | timestamp without time zone |  | NO | NULL |
| 7 | hmestdescrip | character varying | 1000 | NO | NULL |
| 8 | hmestidioma | character | 2 | NO | NULL |
| 9 | hmestutlect | character | 1 | NO | 'R'::bpchar |
| 10 | hmestaplicaxlectval | character | 1 | NO | 'N'::bpchar |

### hismotbajacontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hmtbcid | numeric | 5,0 | NO | NULL |
| 2 | hmtbctxtid | numeric | 10,0 | NO | NULL |
| 3 | hmtbcsnoficio | character | 1 | NO | NULL |
| 4 | hmtbcsncambtit | character | 1 | NO | NULL |
| 5 | hmtbchstusu | character varying | 10 | NO | NULL |
| 6 | hmtbchsthora | timestamp without time zone |  | NO | NULL |
| 7 | hmtbcdescrip | character varying | 1000 | YES | NULL::character varying |
| 8 | hmtbcidioma | character | 2 | NO | 'es'::bpchar |
| 9 | hmtbcsnmasiva | character | 1 | NO | 'N'::bpchar |
| 10 | hmtbcsnrecfianza | character | 1 | NO | 'N'::bpchar |

### hismotfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hmtfcodigo | numeric | 5,0 | NO | NULL |
| 2 | hmtforigen | numeric | 5,0 | NO | NULL |
| 3 | hmtftxtid | numeric | 10,0 | NO | NULL |
| 4 | hmtfsnmanual | character | 1 | NO | NULL |
| 5 | hmtftsumid | numeric | 5,0 | YES | NULL |
| 6 | hmtfsnselcon | character | 1 | NO | NULL |
| 7 | hmtftpvid | numeric | 5,0 | YES | NULL |
| 8 | hmtftccid | numeric | 5,0 | YES | NULL |
| 9 | hmtfsnfuga | character | 1 | NO | NULL |
| 10 | hmtfhstusu | character varying | 10 | NO | NULL |
| 11 | hmtfhsthora | timestamp without time zone |  | NO | NULL |
| 12 | hmtftddesc | character varying | 1000 | NO | NULL |
| 13 | hmtfidicod | character | 2 | NO | NULL |
| 14 | hmtfsnfraude | character | 1 | NO | 'N'::bpchar |
| 15 | hmtfsnbajas | character | 1 | YES | NULL |

### hismotnoftofraude
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 2 | hmnffid | numeric | 5,0 | YES | NULL |
| 3 | hmnffidioma | character | 2 | YES | NULL |
| 4 | hmnfftddesc | character varying | 1000 | YES | NULL |
| 5 | hmnffhstusu | character varying | 10 | YES | 'CONVERSION'::character varying |
| 6 | hmnffhsthora | timestamp without time zone |  | YES | CURRENT_TIMESTAMP |

### hismovccontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hmcmccid | numeric | 10,0 | NO | NULL |
| 2 | hmccdesc | character varying | 50 | YES | NULL |
| 3 | hmchstusu | character varying | 10 | NO | NULL |
| 4 | hmchsthora | timestamp without time zone |  | NO | NULL |
| 5 | hmccsntratado | character | 1 | YES | NULL |
| 6 | hmccsaldoact | numeric | 18,2 | YES | NULL |
| 7 | hmccsaldoant | numeric | 18,2 | YES | NULL |
| 8 | hmccgesid | numeric | 18,2 | YES | NULL |
| 9 | hmccporcivaant | numeric | 5,4 | YES | NULL |
| 10 | hmcctipodesctoant | numeric | 5,0 | YES | NULL |
| 11 | hmccsaldopdteant | numeric | 18,2 | YES | NULL |

### hisnivelcritptoserv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hncpsid | numeric | 5,0 | YES | NULL |
| 2 | hncpscodigo | numeric | 5,0 | YES | NULL |
| 3 | hncpsdesccorta | character varying | 1000 | YES | NULL |
| 4 | hncpsdesclarga | character varying | 1000 | YES | NULL |
| 5 | hncpsidioma | character varying | 2 | YES | NULL |
| 6 | hncpstusu | character varying | 10 | YES | NULL |
| 7 | hncpsthora | timestamp without time zone |  | YES | NULL |

### hisnivestruc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hnieid | numeric | 5,0 | NO | NULL |
| 2 | hniedescripcion | character varying | 10 | NO | NULL |
| 3 | hniehstusu | character varying | 10 | NO | NULL |
| 4 | hniehsthora | timestamp without time zone |  | NO | NULL |

### hisnomcalle
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hnccalid | numeric | 10,0 | NO | NULL |
| 2 | hncnombre | character varying | 80 | NO | NULL |
| 3 | hnctviaid | numeric | 5,0 | NO | NULL |
| 4 | hncbarrid | numeric | 5,0 | YES | NULL |
| 5 | hnctpstcid | numeric | 5,0 | YES | NULL |
| 6 | hnccodext | character varying | 15 | YES | NULL |
| 7 | hnchstusu | character varying | 10 | NO | NULL |
| 8 | hnchsthora | timestamp without time zone |  | NO | NULL |
| 9 | hncalactiva | character | 1 | NO | 'S'::bpchar |
| 10 | hncallocid | numeric | 10,0 | YES | NULL |

### hisnormativa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hnorid | numeric | 5,0 | NO | NULL |
| 2 | hnorexpid | numeric | 5,0 | NO | NULL |
| 3 | hnortxtid | numeric | 10,0 | NO | NULL |
| 4 | hnorfecpub | date |  | YES | NULL |
| 5 | hnorhstusu | character varying | 10 | NO | NULL |
| 6 | hnorhsthora | timestamp without time zone |  | NO | NULL |
| 7 | hnordesc | character varying | 1000 | NO | ''::character varying |
| 8 | hnoridioma | character | 2 | NO | ' '::bpchar |

### hisnumfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hnfacexpid | numeric | 5,0 | NO | NULL |
| 2 | hnfacsocemi | numeric | 10,0 | NO | NULL |
| 3 | hnfacsrfcod | character | 1 | NO | NULL |
| 4 | hnfacanno | numeric | 5,0 | NO | NULL |
| 5 | hnfaccodigo | character | 1 | NO | NULL |
| 6 | hnfacconta | numeric | 10,0 | NO | NULL |
| 7 | hnfachstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 8 | hnfachsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisobsaccion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hobaexpid | numeric | 5,0 | NO | NULL |
| 2 | hobaacccod | character | 2 | NO | NULL |
| 3 | hobaobscod | character | 2 | NO | NULL |
| 4 | hobatiplote | character | 1 | NO | NULL |
| 5 | hobainterio | character | 1 | NO | NULL |
| 6 | hobaexterio | character | 1 | NO | NULL |
| 7 | hobatmenid | numeric | 10,0 | YES | NULL |
| 8 | hobaetqid | numeric | 5,0 | YES | NULL |
| 9 | hobalibnorep | character | 1 | NO | 'N'::bpchar |
| 10 | hobahstusu | character varying | 10 | NO | ' '::character varying |
| 11 | hobahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 12 | hobatcmid | numeric | 5,0 | YES | NULL |
| 13 | hobasntelelec | character | 1 | NO | 'N'::bpchar |
| 14 | hisobasnauto | character | 1 | YES | NULL |
| 15 | hisobamodcampo | numeric | 5,0 | YES | NULL |
| 16 | hisobatipoobs | numeric | 5,0 | YES | NULL |
| 17 | hisobatiporden | numeric | 5,0 | YES | NULL |
| 18 | hisobamotorden | numeric | 5,0 | YES | NULL |
| 19 | hisobamotcambio | character | 2 | YES | NULL |
| 20 | hisobasnlimite | character | 1 | NO | 'N'::bpchar |

### hisobservac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hobscod | character | 2 | NO | NULL |
| 2 | hobstxtid | numeric | 10,0 | NO | NULL |
| 3 | hobstipocal | character | 1 | NO | NULL |
| 4 | hobslecreal | character | 1 | NO | NULL |
| 5 | hobsesfuga | character | 1 | NO | NULL |
| 6 | hobsmotnoca | character | 1 | NO | NULL |
| 7 | hobsmotcamb | character | 1 | NO | NULL |
| 8 | hobsactivo | character | 1 | NO | 'S'::bpchar |
| 9 | hobsdiascambio | numeric | 5,0 | YES | NULL |
| 10 | hobshstusu | character varying | 10 | NO | NULL |
| 11 | hobshsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 12 | hobstddesc | character varying | 1000 | NO | ' '::character varying |
| 13 | hobsidioma | character | 2 | NO | 'es'::bpchar |
| 14 | hobsagrucam | character | 2 | YES | NULL |
| 15 | hobsperirep | character varying | 30 | YES | NULL |
| 16 | hobsnumperrep | numeric | 5,0 | YES | NULL |
| 17 | hobssnaltnuerep | character | 1 | NO | 'S'::bpchar |
| 18 | hobsesauto | character | 1 | NO | 'N'::bpchar |
| 19 | hisobsnota | character | 1 | YES | NULL |
| 20 | hobslectvalida | character | 1 | YES | NULL |
| 21 | hobsaveria | character | 1 | NO | 'N'::bpchar |
| 22 | hobsdesmarcaraveria | character | 1 | NO | 'N'::bpchar |
| 23 | hobsnoestimar | character | 1 | NO | 'N'::bpchar |
| 24 | hobsestadollave | numeric | 5,0 | YES | NULL |
| 25 | hobsgenerarcom | character | 1 | NO | 'N'::bpchar |

### hisobspermiso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hobpexpid | numeric | 5,0 | NO | NULL |
| 2 | hobpobscod | character | 2 | NO | NULL |
| 3 | hobppermitz | character | 1 | NO | NULL |
| 4 | hobppltant | character | 1 | NO | NULL |
| 5 | hobppeqant | character | 1 | NO | NULL |
| 6 | hobppltesp | character | 1 | NO | NULL |
| 7 | hobppgtesp | character | 1 | NO | NULL |
| 8 | hobphstusu | character varying | 10 | NO | NULL |
| 9 | hobphsthora | timestamp without time zone |  | NO | NULL |
| 10 | hobpsnnoenvtpl | character | 1 | NO | 'N'::bpchar |
| 11 | hobpsnconsumcor | character | 1 | NO | 'N'::bpchar |
| 12 | hobpsnconigcerosumcor | character | 1 | NO | 'N'::bpchar |
| 13 | hobpprorrtel | character | 1 | NO | 'N'::bpchar |
| 14 | hobpvalcerrar | character | 1 | NO | 'N'::bpchar |
| 15 | hobpvalrevisar | character | 1 | NO | 'N'::bpchar |

### hisoficina
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hofiid | numeric | 5,0 | NO | NULL |
| 2 | hofiviacod | character | 2 | NO | NULL |
| 3 | hofidescrip | character varying | 25 | NO | NULL |
| 4 | hofidirid | numeric | 10,0 | YES | NULL |
| 5 | hofitelef1 | character varying | 16 | YES | NULL |
| 6 | hofitelef2 | character varying | 16 | YES | NULL |
| 7 | hofitelef3 | character varying | 16 | YES | NULL |
| 8 | hofifax | character varying | 16 | YES | NULL |
| 9 | hofirespon | character varying | 36 | YES | NULL |
| 10 | hofihorvera | character varying | 100 | YES | NULL |
| 11 | hofihorinvi | character varying | 100 | YES | NULL |
| 12 | hofiadmitot | character | 1 | YES | NULL |
| 13 | hofiprsid | numeric | 10,0 | NO | NULL |
| 14 | hofitofid | numeric | 5,0 | NO | NULL |
| 15 | hoficbecodigo | character varying | 6 | NO | NULL |
| 16 | hoficodcrisol | character | 3 | YES | NULL |
| 17 | hofisnincfdoc | character | 1 | NO | NULL |
| 18 | hofisnregcto | character | 1 | NO | NULL |
| 19 | hofisnimpord | character | 1 | NO | 'S'::bpchar |
| 20 | hofihstusu | character varying | 10 | NO | ''::character varying |
| 21 | hofihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 22 | hofisnanadircobro | character | 1 | NO | 'N'::bpchar |
| 23 | hofisnvermsgconf | character | 1 | NO | 'S'::bpchar |
| 24 | hofisnvermsgrecibicob | character | 1 | NO | 'S'::bpchar |
| 25 | hofisnmoddatfacaltcon | character | 1 | NO | 'S'::bpchar |
| 26 | hofisnrealgrab | character | 1 | YES | NULL |
| 27 | hofisnfirelec | character | 1 | NO | 'N'::bpchar |
| 28 | hofisndifdoc | character | 1 | NO | 'N'::bpchar |
| 29 | hofisopfirele | numeric | 5,0 | NO | '1'::numeric |

### hisofisocgest
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hosgofiid | numeric | 5,0 | NO | NULL |
| 2 | hosgsocid | numeric | 10,0 | NO | NULL |
| 3 | hosgcbecodigo | character varying | 6 | NO | NULL |
| 4 | hosgsnactivo | character | 1 | NO | NULL |
| 5 | hosghstusu | character varying | 10 | NO | NULL |
| 6 | hosghsthora | timestamp without time zone |  | NO | NULL |

### hisorifraude
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | horifraid | numeric | 5,0 | NO | NULL |
| 2 | horifratxtid | numeric | 10,0 | NO | NULL |
| 3 | horifrahstusu | character varying | 10 | NO | ''::character varying |
| 4 | horifrahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | horifratddesc | character varying | 1000 | NO | NULL |
| 6 | horifraidioma | character | 2 | NO | 'es'::bpchar |

### hispadron
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpadexpid | numeric | 5,0 | NO | NULL |
| 2 | hpadpobid | numeric | 10,0 | NO | NULL |
| 3 | hpadanno | numeric | 5,0 | NO | NULL |
| 4 | hpadperiodi | numeric | 5,0 | NO | NULL |
| 5 | hpadperiodo | numeric | 5,0 | NO | NULL |
| 6 | hpadfecaprob | date |  | NO | NULL |
| 7 | hpadfecpubl | date |  | NO | NULL |
| 8 | hpadfecvcto | date |  | NO | NULL |
| 9 | hpadliqid | numeric | 5,0 | YES | NULL |
| 10 | hpadusu | character | 10 | NO | 'CONVERSION'::bpchar |
| 11 | hpadhora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisparfunaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpfaid | numeric | 5,0 | NO | NULL |
| 2 | hpfasocprsid | numeric | 10,0 | NO | NULL |
| 3 | hpfatconid | numeric | 5,0 | NO | NULL |
| 4 | hpfatiptid | numeric | 5,0 | NO | NULL |
| 5 | hpfatpvid | numeric | 5,0 | NO | NULL |
| 6 | hpfaliminfvar | numeric | 5,0 | NO | NULL |
| 7 | hpfahstusu | character varying | 10 | NO | NULL |
| 8 | hpfahsthora | timestamp without time zone |  | NO | NULL |
| 9 | hpfatpvbonif | numeric | 5,0 | YES | NULL |
| 10 | hpfaporcpregen | numeric | 5,0 | NO | 20 |
| 11 | hpfatpvexen | numeric | 5,0 | YES | NULL |
| 12 | hpfaimpjuicio | numeric | 18,2 | YES | NULL |
| 13 | hpfatpvbonvul | numeric | 5,0 | YES | NULL |
| 14 | hpfatpgesdeuda | numeric | 5,0 | YES | NULL |
| 15 | hpfatpvbonvulad | character varying | 150 | YES | NULL |
| 16 | hpfatpvnumuni | numeric | 5,0 | YES | NULL |
| 17 | hpfavalnumuni | numeric | 10,0 | YES | NULL |
| 18 | hpfaatlid | numeric | 5,0 | YES | NULL |
| 19 | hpfatipidexcl | character varying | 150 | YES | NULL |
| 20 | hpfatpvaguaalta | numeric | 5,0 | YES | NULL |
| 21 | hpfadiasactat | numeric | 3,0 | YES | '90'::numeric |
| 22 | hpfatpsvbonvulad | numeric | 5,0 | YES | NULL |
| 23 | hpfaimpejecutiva | numeric | 18,2 | NO | '0'::numeric |

### hispartlectfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hplfid | numeric | 5,0 | NO | NULL |
| 2 | hplfexpid | numeric | 5,0 | YES | NULL |
| 3 | hplfzonas | character varying | 400 | YES | NULL |
| 4 | hplftipo | numeric | 5,0 | YES | NULL |
| 5 | hplfdescrip | character varying | 1000 | YES | NULL |
| 6 | hplfactiva | character | 1 | YES | NULL |
| 7 | hplfhstusu | character varying | 10 | YES | NULL |
| 8 | hplfhsthora | timestamp without time zone |  | YES | NULL |

### hispasoproccp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpaspid | numeric | 5,0 | NO | NULL |
| 2 | hpaspprdpid | numeric | 5,0 | NO | NULL |
| 3 | hpasporden | numeric | 5,0 | NO | NULL |
| 4 | hpaspdescri | character varying | 50 | NO | NULL |
| 5 | hpaspduracion | numeric | 5,0 | NO | NULL |
| 6 | hpasptipodias | character | 1 | NO | NULL |
| 7 | hpaspsnvigente | character | 1 | NO | NULL |
| 8 | hpasptiporde | numeric | 5,0 | YES | NULL |
| 9 | hpaspmotorde | numeric | 5,0 | YES | NULL |
| 10 | hpasptpdid | numeric | 5,0 | YES | NULL |
| 11 | hpaspcopias | numeric | 5,0 | YES | NULL |
| 12 | hpaspformfcorte | numeric | 5,0 | NO | NULL |
| 13 | hpasphstusu | character varying | 10 | NO | NULL |
| 14 | hpasphsthora | timestamp without time zone |  | NO | NULL |

### hispasoproced
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpasid | numeric | 10,0 | NO | NULL |
| 2 | hpasprocedi | numeric | 5,0 | NO | NULL |
| 3 | hpasposicio | numeric | 5,0 | NO | NULL |
| 4 | hpasdescri | character varying | 40 | NO | NULL |
| 5 | hpasduracio | numeric | 5,0 | NO | NULL |
| 6 | hpastiporde | numeric | 5,0 | YES | NULL |
| 7 | hpasmotorde | numeric | 5,0 | YES | NULL |
| 8 | hpascopiasr | numeric | 5,0 | NO | NULL |
| 9 | hpasvigente | character | 1 | NO | NULL |
| 10 | hpasnecaprob | character | 1 | NO | NULL |
| 11 | hpasfacrecla | character | 1 | NO | NULL |
| 12 | hpascanccambd | character | 1 | NO | NULL |
| 13 | hpasintdemora | character | 1 | NO | NULL |
| 14 | hpasporcrec | numeric | 6,2 | YES | NULL |
| 15 | hpassndercob | character | 1 | NO | NULL |
| 16 | hpastccid | numeric | 5,0 | YES | NULL |
| 17 | hpastpdid | numeric | 5,0 | YES | NULL |
| 18 | hpastipodias | character | 1 | NO | NULL |
| 19 | hpasformfcorte | numeric | 5,0 | NO | NULL |
| 20 | hpashstusu | character varying | 10 | NO | NULL |
| 21 | hpashsthora | timestamp without time zone |  | NO | NULL |
| 22 | hpasfacreclcar | character | 1 | NO | 'N'::bpchar |
| 23 | hpastipovar1 | numeric | 5,0 | YES | NULL |
| 24 | hpasaccionvar1 | numeric | 5,0 | YES | NULL |
| 25 | hpasvalorvar1 | character varying | 10 | YES | NULL |
| 26 | hpaslimitevar1 | character varying | 10 | YES | NULL |
| 27 | hpastipovar2 | numeric | 5,0 | YES | NULL |
| 28 | hpasvalorvar2 | character varying | 10 | YES | NULL |
| 29 | hpasambitacc | numeric | 5,0 | YES | NULL |
| 30 | hispasmaxim | numeric | 18,2 | YES | NULL |
| 31 | hispasminim | numeric | 18,2 | YES | NULL |
| 32 | hpaspersjur | character | 1 | YES | 'N'::bpchar |
| 33 | hpaspersfis | character | 1 | YES | 'N'::bpchar |
| 34 | hpassnbajacontrato | character | 1 | NO | 'N'::bpchar |
| 35 | hpassnrecobro | character | 1 | NO | 'N'::bpchar |
| 36 | hpasfecrefvto | numeric | 5,0 | NO | 1 |
| 37 | hpassnconfsic | character | 1 | YES | 'N'::bpchar |
| 38 | hpassigpaso | numeric | 10,0 | YES | NULL |
| 39 | hpasaplsignoaprob | numeric | 10,0 | YES | NULL |
| 40 | hpasaplsigaprob | numeric | 10,0 | YES | NULL |
| 41 | hpastipcomvenc | numeric | 5,0 | YES | NULL |
| 42 | hpasdiasprevenc | numeric | 10,0 | YES | NULL |
| 43 | hpastipogesdeuda | numeric | 5,0 | YES | NULL |
| 44 | hpaspasomaestro | numeric | 10,0 | YES | NULL |
| 45 | hpassnactdeud | character | 1 | YES | 'N'::bpchar |
| 46 | hpasconsum | character | 1 | YES | NULL |
| 47 | hpasnoconsum | character | 1 | YES | NULL |
| 48 | hpasimpdeuda | numeric | 18,2 | YES | NULL |
| 49 | hpasidioma | character | 2 | YES | NULL |

### hisperfil
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hperfid | numeric | 5,0 | NO | NULL |
| 2 | hperfmodcod | character varying | 15 | NO | NULL |
| 3 | hperfnom | character varying | 10 | NO | NULL |
| 4 | hperftxtid | numeric | 10,0 | NO | NULL |
| 5 | hperfhstusu | character varying | 10 | NO | NULL |
| 6 | hperfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | hperftddesc | character varying | 1000 | NO | ''::character varying |
| 8 | hperfidioma | character | 2 | NO | 'es'::bpchar |
| 9 | hperfsnmodofi | character | 1 | NO | 'N'::bpchar |

### hisperiaplictarif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpaptperiid | numeric | 5,0 | NO | NULL |
| 2 | hpaptexpid | numeric | 5,0 | NO | NULL |
| 3 | hpaptcptoid | numeric | 5,0 | NO | NULL |
| 4 | hpapttarid | numeric | 5,0 | NO | NULL |
| 5 | hpaptfecapl | date |  | NO | NULL |
| 6 | hpaptannoini | numeric | 5,0 | NO | NULL |
| 7 | hpaptpernumini | numeric | 5,0 | NO | NULL |
| 8 | hpaptannofin | numeric | 5,0 | YES | NULL |
| 9 | hpaptpernumfin | numeric | 5,0 | YES | NULL |
| 10 | hpapthstusu | character varying | 10 | NO | NULL |
| 11 | hpapthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisperiodic
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hperiid | numeric | 5,0 | NO | NULL |
| 2 | hperitxtid | numeric | 10,0 | NO | NULL |
| 3 | hperinumper | numeric | 5,0 | NO | NULL |
| 4 | hperinumdia | double precision | 53 | NO | NULL |
| 5 | hperhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | hperhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | hperitddesc | character varying | 1000 | NO | NULL |
| 8 | hperiidioma | character | 2 | NO | NULL |

### hispermisos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprmfuncod | character varying | 50 | NO | NULL |
| 2 | hprmperfid | numeric | 5,0 | NO | NULL |
| 3 | hprmmodif | character | 1 | NO | NULL |
| 4 | hprmhstmodif | character | 1 | NO | NULL |
| 5 | hprmhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 6 | hprmhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hispersona
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprsid | numeric | 10,0 | NO | NULL |
| 2 | hpnombre | character varying | 40 | YES | NULL |
| 3 | hppriapel | character varying | 120 | YES | NULL |
| 4 | hpsegapel | character varying | 40 | YES | NULL |
| 5 | hptelef | character varying | 16 | YES | NULL |
| 6 | hptelef2 | character varying | 16 | YES | NULL |
| 7 | hptelef3 | character varying | 16 | YES | NULL |
| 8 | hpnif | character varying | 15 | YES | NULL |
| 9 | hpjubilad | character | 1 | YES | NULL |
| 10 | hpjuridic | character | 1 | YES | NULL |
| 11 | hppassweb | character varying | 10 | YES | NULL |
| 12 | hpcodextran | character varying | 12 | YES | NULL |
| 13 | hphstusu | character varying | 10 | YES | NULL |
| 14 | hphsthora | timestamp without time zone |  | YES | NULL |
| 15 | hprstelef4 | character varying | 16 | YES | NULL |
| 16 | hprsfax | character varying | 16 | YES | NULL |
| 17 | hprsfeccrea | date |  | YES | NULL |
| 18 | hprsofiid | numeric | 5,0 | YES | NULL |
| 19 | hprsidicodigo | character | 2 | NO | 'es'::bpchar |
| 20 | hprsindunif | character | 1 | YES | NULL |
| 22 | hprsfecnac | date |  | YES | NULL |
| 23 | hprsrcuid | numeric | 5,0 | YES | NULL |
| 24 | hprstxtdirfisc | character varying | 150 | YES | NULL |
| 25 | hprsprftelef2 | character varying | 5 | YES | NULL |
| 26 | hprspaiscodigo | numeric | 10,0 | YES | NULL |
| 27 | hprsfiporcli | character | 1 | YES | NULL |
| 28 | hprsmvporcli | character | 1 | YES | NULL |
| 29 | hprsgestor | character varying | 120 | YES | NULL |
| 30 | hprgpdanonim | character | 1 | NO | 'N'::bpchar |
| 31 | hprsupd | numeric | 5,0 | YES | NULL |
| 32 | hpbloqrgpd | character | 1 | NO | 'N'::bpchar |
| 33 | hprsfecrevfijo | timestamp without time zone |  | YES | NULL |
| 34 | hprsinteraccionfijo | character varying | 100 | YES | NULL |
| 35 | hprsfecrevmovil | timestamp without time zone |  | YES | NULL |
| 36 | hprsinteraccionmovil | character varying | 100 | YES | NULL |

### hispersonadir
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpersonaid | numeric | 10,0 | NO | NULL |
| 2 | hperdirecid | numeric | 10,0 | NO | NULL |
| 3 | hpertelf | character varying | 15 | YES | NULL |
| 4 | hperaatenc | character varying | 100 | YES | NULL |
| 5 | hperdatapor | character | 1 | YES | NULL |
| 6 | hperdirfiscal | character varying | 200 | YES | NULL |
| 7 | hperemailov | character varying | 100 | YES | NULL |
| 8 | hperdiractiva | character varying | 200 | YES | NULL |
| 9 | hperofimodif | character varying | 100 | YES | NULL |
| 10 | hperfechamodif | timestamp without time zone |  | YES | NULL |
| 11 | hperusumodif | character varying | 50 | YES | NULL |
| 12 | hpdnumdir | numeric | 5,0 | YES | NULL |
| 13 | hpdgestor | character varying | 120 | YES | NULL |
| 14 | hpersona | character varying | 203 | YES | NULL |
| 15 | hperdirec | character varying | 250 | YES | NULL |
| 16 | hpdfecrev | timestamp without time zone |  | YES | NULL |
| 17 | hpdinteraccion | character varying | 100 | YES | NULL |

### hispersonatel
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprtlprtlid | numeric | 10,0 | NO | NULL |
| 2 | hprtlprsid | numeric | 10,0 | NO | NULL |
| 3 | hprtltelefono | character varying | 16 | NO | NULL |
| 4 | hprtlprefijo | character varying | 5 | YES | NULL |
| 5 | hprtlautorizado | character | 1 | YES | NULL |
| 6 | hprtlhstusu | character varying | 10 | YES | NULL |
| 7 | hprtlhsthora | timestamp without time zone |  | YES | NULL |
| 8 | hprtlhstmodif | character | 1 | YES | NULL |
| 9 | hprtlfecrev | timestamp without time zone |  | YES | NULL |
| 10 | hprtlinteraccion | character varying | 100 | YES | NULL |

### hisplanleclib
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hplecexpid | numeric | 5,0 | NO | NULL |
| 2 | hpleczonid | character | 3 | NO | NULL |
| 3 | hpleclibcod | numeric | 5,0 | NO | NULL |
| 4 | hplecanno | numeric | 5,0 | NO | NULL |
| 5 | hplecperiid | numeric | 5,0 | NO | NULL |
| 6 | hplecpernum | numeric | 5,0 | NO | NULL |
| 7 | hplecestado | numeric | 5,0 | NO | NULL |
| 8 | hplecfpinilec | date |  | YES | NULL |
| 9 | hplecfpfinlec | date |  | YES | NULL |
| 10 | hplecfrinilec | date |  | YES | NULL |
| 11 | hplecfrfinlec | date |  | YES | NULL |
| 12 | hplecfcrealot | date |  | YES | NULL |
| 13 | hplecfestnl | date |  | YES | NULL |
| 14 | hplecsngenaut | character | 1 | NO | 'N'::bpchar |
| 15 | hplechstusu | character varying | 10 | NO | NULL |
| 16 | hplechsthora | timestamp without time zone |  | NO | NULL |

### hispoblacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpobid | numeric | 10,0 | NO | NULL |
| 2 | hpobnombre | character varying | 40 | NO | NULL |
| 3 | hpobproid | numeric | 5,0 | NO | NULL |
| 4 | hpobcodine | numeric | 10,0 | YES | NULL |
| 5 | hpobhstusu | character varying | 10 | NO | NULL |
| 6 | hpobhsthora | timestamp without time zone |  | NO | NULL |

### hispolclaus
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpclapolnum | numeric | 10,0 | NO | NULL |
| 2 | hpclaid | numeric | 5,0 | NO | NULL |
| 3 | hpclafecalt | date |  | NO | NULL |
| 4 | hpclafecbaj | date |  | YES | NULL |
| 5 | hpclahstusu | character varying | 10 | NO | ' '::character varying |
| 6 | hpclahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hispolcontar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpctexpid | numeric | 5,0 | NO | NULL |
| 2 | hpctcptoid | numeric | 5,0 | NO | NULL |
| 3 | hpctttarid | numeric | 5,0 | NO | NULL |
| 4 | hpctcnttnum | numeric | 10,0 | NO | NULL |
| 5 | hpctfecini | date |  | NO | NULL |
| 6 | hpctfecfin | date |  | YES | NULL |
| 7 | hpcthstusu | character varying | 10 | NO | NULL |
| 8 | hpcthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 9 | hpcthstmodif | character | 1 | NO | NULL |

### hispolcorrect
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpcoradjid | numeric | 5,0 | NO | NULL |
| 2 | hpcorcptoid | numeric | 5,0 | NO | NULL |
| 3 | hpcorttarid | numeric | 5,0 | NO | NULL |
| 4 | hpcorpolnum | numeric | 10,0 | NO | NULL |
| 5 | hpcorsubcid | numeric | 5,0 | NO | NULL |
| 6 | hpcorcanfij | numeric | 5,0 | YES | NULL |
| 7 | hpcorcanpro | double precision | 53 | YES | NULL |
| 8 | hpcorprefij | double precision | 53 | YES | NULL |
| 9 | hpcorprepro | double precision | 53 | YES | NULL |
| 10 | hpcorimpfij | double precision | 53 | YES | NULL |
| 11 | hpcorimppro | double precision | 53 | YES | NULL |
| 12 | hpcorminimo | numeric | 10,0 | YES | NULL |
| 13 | hpcorunidad | numeric | 5,0 | YES | NULL |
| 14 | hpcorexesub | character | 1 | NO | NULL |
| 15 | hpcorexeimp | character | 1 | NO | NULL |
| 16 | hpcorfecini | date |  | NO | NULL |
| 17 | hpcorrefer | numeric | 10,0 | YES | NULL |
| 18 | hpcordesc | character varying | 30 | YES | NULL |
| 19 | hpcorftoid | numeric | 10,0 | YES | NULL |
| 20 | hpcorftoope | numeric | 5,0 | YES | NULL |
| 21 | hpcorparcial | character | 1 | NO | NULL |
| 22 | hpcornocons | character | 1 | NO | NULL |
| 23 | hpcorhstusu | character varying | 10 | NO | NULL |
| 24 | hpcorhsthora | timestamp without time zone |  | NO | NULL |
| 25 | hpcorhstfin | date |  | YES | NULL |

### hispolnegexp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpneid | numeric | 10,0 | NO | NULL |
| 2 | hpneexpid | numeric | 5,0 | NO | NULL |
| 3 | hpnedescripcion | character varying | 256 | NO | NULL |
| 4 | hpneimpdeumax | numeric | 20,2 | YES | NULL |
| 5 | hpnenumplaunpro | numeric | 5,0 | NO | NULL |
| 6 | hpnenumplamulpro | numeric | 5,0 | NO | NULL |
| 7 | hpnenumfaccuoini | numeric | 5,0 | NO | NULL |
| 8 | hpnedesrecom | numeric | 6,2 | NO | NULL |
| 9 | hpnecondescmayor | character varying | 256 | YES | NULL |
| 10 | hpnecondescmenor | character varying | 256 | YES | NULL |
| 11 | hpnetasfin | numeric | 6,2 | NO | NULL |
| 12 | hpneuser | character varying | 20 | NO | NULL |
| 13 | hpnehora | timestamp without time zone |  | NO | NULL |

### hisprcdlotinsfrau
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpifid | numeric | 5,0 | NO | NULL |
| 2 | hpifexpid | numeric | 5,0 | NO | NULL |
| 3 | hpifdescrip | character varying | 50 | NO | NULL |
| 4 | hpifsnvigente | character | 1 | NO | 'S'::bpchar |
| 5 | hpifsnautomat | character | 1 | NO | 'N'::bpchar |
| 6 | hpifsnacegestauto | character | 1 | NO | 'N'::bpchar |
| 7 | hpifautorde | numeric | 5,0 | YES | NULL |
| 8 | hpiftpestrtec | numeric | 5,0 | YES | NULL |
| 9 | hpifsechidra | character varying | 200 | YES | NULL |
| 10 | hpifsubsechidra | character varying | 200 | YES | NULL |
| 11 | hpifperiodic | numeric | 5,0 | YES | NULL |
| 12 | hpifzonas | character varying | 200 | YES | NULL |
| 13 | hpifcodrecordesde | numeric | 14,0 | YES | NULL |
| 14 | hpifcodrecorhasta | numeric | 14,0 | YES | NULL |
| 15 | hpiftpcliente | character varying | 30 | YES | NULL |
| 16 | hpiftpcptoid | numeric | 5,0 | YES | NULL |
| 17 | hpiftarifa | character varying | 200 | YES | NULL |
| 18 | hpifactividad | character varying | 200 | YES | NULL |
| 19 | hpifusos | character varying | 256 | YES | NULL |
| 20 | hpifcnae | character varying | 200 | YES | NULL |
| 21 | hpifsnexclsifraude | character | 1 | NO | 'S'::bpchar |
| 22 | hpifsnexclsiinspec | character | 1 | NO | 'S'::bpchar |
| 23 | hpifsninclfrauotrodom | character | 1 | NO | 'N'::bpchar |
| 24 | hpifestadofraude | character varying | 200 | YES | NULL |
| 25 | hpiforiglect | character varying | 200 | YES | NULL |
| 26 | hpifobslectincl | character varying | 200 | YES | NULL |
| 27 | hpifobslectexcl | character varying | 200 | YES | NULL |
| 28 | hpifnumperiodos | numeric | 5,0 | YES | NULL |
| 29 | hpifestadoptoserv | character varying | 200 | YES | NULL |
| 30 | hpifnumdiascort | numeric | 5,0 | YES | NULL |
| 31 | hpifestadocntt | character varying | 200 | YES | NULL |
| 32 | hpifnumdiasbaja | numeric | 5,0 | YES | NULL |
| 33 | hpifnumdiasalta | numeric | 5,0 | YES | NULL |
| 34 | hpifemplazconta | character varying | 200 | YES | NULL |
| 35 | hpifporcdebajomedia | numeric | 5,0 | YES | NULL |
| 36 | hpifdifanualmcub | numeric | 5,0 | YES | NULL |
| 37 | hpifnumanios | numeric | 5,0 | YES | NULL |
| 38 | hpifmaxptoserv | numeric | 5,0 | YES | NULL |
| 39 | hpifhstusu | character varying | 10 | YES | NULL |
| 40 | hpifphsthora | timestamp without time zone |  | YES | NULL |
| 41 | hpiftipofrecu | numeric | 5,0 | YES | NULL |
| 42 | hpiffrecu | numeric | 5,0 | YES | NULL |
| 43 | hpifsnlunes | character | 1 | NO | 'S'::bpchar |
| 44 | hpifsnmartes | character | 1 | NO | 'S'::bpchar |
| 45 | hpifsnmiercoles | character | 1 | NO | 'S'::bpchar |
| 46 | hpifsnjueves | character | 1 | NO | 'S'::bpchar |
| 47 | hpifsnviernes | character | 1 | NO | 'S'::bpchar |
| 48 | hpifsnsabado | character | 1 | NO | 'S'::bpchar |
| 49 | hpifsndomingo | character | 1 | NO | 'S'::bpchar |
| 50 | hpiftipodia | numeric | 5,0 | YES | NULL |
| 51 | hpifdiames | numeric | 5,0 | YES | NULL |
| 52 | hpifdiasemana | character | 1 | YES | NULL |
| 53 | hpifordendia | numeric | 5,0 | YES | NULL |
| 54 | hpifmes | numeric | 5,0 | YES | NULL |
| 55 | hpiffecinicio | date |  | YES | NULL |

### hisprcdpclaus
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprdcprdpid | numeric | 5,0 | NO | NULL |
| 2 | hprdcclauid | numeric | 5,0 | NO | NULL |
| 3 | hprdcsnactivo | character | 1 | NO | NULL |
| 4 | hprdchstusu | character varying | 10 | NO | NULL |
| 5 | hprdchsthora | timestamp without time zone |  | NO | NULL |

### hisprcdpdocs
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprddprdpid | numeric | 5,0 | NO | NULL |
| 2 | hprdddconid | numeric | 10,0 | NO | NULL |
| 3 | hprddsnactivo | character | 1 | NO | NULL |
| 4 | hprddhstusu | character varying | 10 | NO | NULL |
| 5 | hprddhsthora | timestamp without time zone |  | NO | NULL |

### hisprcdreccprov
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprdpid | numeric | 5,0 | NO | NULL |
| 2 | hprdpexpid | numeric | 5,0 | NO | NULL |
| 3 | hprdpdescri | character varying | 50 | NO | NULL |
| 4 | hprdpsnvigente | character | 1 | NO | NULL |
| 5 | hprdpsnautomat | character | 1 | NO | NULL |
| 6 | hprdporden | numeric | 5,0 | YES | NULL |
| 7 | hprdptipclie | character varying | 30 | YES | NULL |
| 8 | hprdpcortable | numeric | 5,0 | NO | NULL |
| 9 | hprdpcortado | numeric | 5,0 | NO | NULL |
| 10 | hprdpsnreclvenc | character | 1 | NO | NULL |
| 11 | hprdpmindiasvenc | numeric | 5,0 | YES | NULL |
| 12 | hprdpsnreclnvenc | character | 1 | NO | NULL |
| 13 | hprdpdiasvtocont | numeric | 5,0 | YES | NULL |
| 14 | hprdptipgesd | character varying | 30 | YES | NULL |
| 15 | hprdpmaxcontratos | numeric | 10,0 | NO | NULL |
| 16 | hprdpsnsolodocpend | character | 1 | NO | NULL |
| 17 | hprdphstusu | character varying | 10 | NO | NULL |
| 18 | hprdphsthora | timestamp without time zone |  | NO | NULL |
| 19 | hprdpsnacepauto | character | 1 | YES | NULL |
| 20 | hprdpestadocntt | numeric | 5,0 | YES | NULL |

### hisprcdrecla
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprdid | numeric | 5,0 | NO | NULL |
| 2 | hprdtipo | numeric | 5,0 | NO | NULL |
| 3 | hprdfuncion | character varying | 30 | NO | NULL |
| 4 | hprddescri | character varying | 30 | NO | NULL |
| 5 | hprdpropie | numeric | 10,0 | YES | NULL |
| 6 | hprdperiodi | numeric | 5,0 | YES | NULL |
| 7 | hprdtipclie | character varying | 30 | YES | NULL |
| 8 | hprdcliente | numeric | 10,0 | YES | NULL |
| 9 | hprdminanti | numeric | 5,0 | YES | NULL |
| 10 | hprdmaxanti | numeric | 5,0 | YES | NULL |
| 11 | hprdminimpo | numeric | 18,2 | YES | NULL |
| 12 | hprdmaximpo | numeric | 18,2 | YES | NULL |
| 13 | hprdcortabl | numeric | 5,0 | YES | NULL |
| 14 | hprdcortado | numeric | 5,0 | YES | NULL |
| 15 | hprdestpol | numeric | 5,0 | YES | NULL |
| 16 | hprdtipgesd | character varying | 100 | YES | NULL |
| 17 | hprdvigente | character | 1 | NO | NULL |
| 18 | hprdnmaxpol | numeric | 5,0 | YES | NULL |
| 19 | hprdautomat | character | 1 | NO | NULL |
| 20 | hprdautorde | numeric | 5,0 | YES | NULL |
| 21 | hprdorifact | character varying | 30 | YES | NULL |
| 22 | hprdordenac | numeric | 5,0 | NO | NULL |
| 23 | hprdexpid | numeric | 5,0 | NO | NULL |
| 24 | hprdusos | character varying | 256 | YES | NULL |
| 25 | hprdpropieta | character varying | 30 | YES | NULL |
| 26 | hprdnumcicld | numeric | 5,0 | YES | NULL |
| 27 | hprdnumciclh | numeric | 5,0 | YES | NULL |
| 28 | hprdsololect | character | 1 | NO | NULL |
| 29 | hprdnumciclc | numeric | 5,0 | YES | NULL |
| 30 | hprdhstusu | character varying | 10 | NO | ' '::character varying |
| 31 | hprdhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 32 | hprdsnexcfacque | character | 1 | NO | 'N'::bpchar |
| 33 | hprdmotfact | character varying | 256 | YES | NULL |
| 34 | hprdcanalc | character varying | 30 | YES | NULL |
| 35 | hprdminantianyos | numeric | 5,0 | YES | NULL |
| 36 | hprdmaxantianyos | numeric | 5,0 | YES | NULL |
| 37 | hprdconemail | character | 1 | NO | 'N'::bpchar |
| 38 | hprdcontelefono | character | 1 | NO | 'N'::bpchar |
| 39 | hprdsnexcfacpago | character | 1 | NO | 'N'::bpchar |
| 40 | hprdsnexcfacjui | character | 1 | NO | 'N'::bpchar |
| 41 | hprdantcortdes | numeric | 5,0 | YES | NULL |
| 42 | hprdantcorthas | numeric | 5,0 | YES | NULL |
| 43 | hprdminnumcnt | numeric | 5,0 | YES | NULL |
| 44 | hprdacegestauto | character | 1 | NO | 'N'::bpchar |
| 45 | hprdtipofrecu | numeric | 5,0 | YES | NULL |
| 46 | hprdfrecu | numeric | 5,0 | YES | NULL |
| 47 | hprdsnlunes | character | 1 | YES | NULL |
| 48 | hprdsnmartes | character | 1 | YES | NULL |
| 49 | hprdsnmiercoles | character | 1 | YES | NULL |
| 50 | hprdsnjueves | character | 1 | YES | NULL |
| 51 | hprdsnviernes | character | 1 | YES | NULL |
| 52 | hprdsnsabado | character | 1 | YES | NULL |
| 53 | hprdsndomingo | character | 1 | YES | NULL |
| 54 | hprdtipodia | numeric | 5,0 | YES | NULL |
| 55 | hprddiames | numeric | 5,0 | YES | NULL |
| 56 | hprddiasemana | character | 1 | YES | NULL |
| 57 | hprdordendia | numeric | 5,0 | YES | NULL |
| 58 | hprdmes | numeric | 5,0 | YES | NULL |
| 59 | hprdfecinicio | date |  | YES | NULL |
| 60 | hprdsnexcctocur | character | 1 | YES | 'S'::bpchar |
| 61 | hprdzonid | character varying | 2000 | YES | NULL |
| 62 | hprdexcctocobrobloq | character | 1 | NO | 'N'::bpchar |
| 63 | hprdantigtipo | numeric | 5,0 | NO | '1'::numeric |
| 64 | hprdcategoria | numeric | 5,0 | NO | '1'::numeric |
| 65 | hprdprocmaestro | numeric | 5,0 | YES | NULL |
| 66 | hprddescritxtid | numeric | 10,0 | NO | '0'::numeric |
| 67 | hprdidioma | character | 2 | YES | NULL |

### hispreccal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpcadjid | numeric | 5,0 | NO | NULL |
| 2 | hpccptoid | numeric | 5,0 | NO | NULL |
| 3 | hpcttarid | numeric | 5,0 | NO | NULL |
| 4 | hpcfecapl | date |  | NO | NULL |
| 5 | hpcsubcid | numeric | 5,0 | NO | NULL |
| 6 | hpccalibm | numeric | 5,0 | NO | NULL |
| 7 | hpcprefij | double precision | 53 | YES | NULL |
| 8 | hpcprepro | double precision | 53 | YES | NULL |
| 9 | hpcprefc | double precision | 53 | YES | NULL |
| 10 | hpcprepc | double precision | 53 | YES | NULL |
| 11 | hpcusado | character | 1 | YES | NULL |
| 12 | hpchstusu | character varying | 10 | YES | NULL |
| 13 | hpchsthora | timestamp without time zone |  | YES | NULL |

### hisprecmulvar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpmvexpid | numeric | 5,0 | NO | NULL |
| 2 | hpmvcptoid | numeric | 5,0 | NO | NULL |
| 3 | hpmvttarid | numeric | 5,0 | NO | NULL |
| 4 | hpmvfecapl | date |  | NO | NULL |
| 5 | hpmvsubcid | numeric | 5,0 | NO | NULL |
| 6 | hpmvtpvid | numeric | 5,0 | NO | NULL |
| 7 | hpmvprefij | double precision | 53 | NO | NULL |
| 8 | hpmvprepro | double precision | 53 | NO | NULL |
| 9 | hpmvhstusu | character varying | 10 | NO | NULL |
| 10 | hpmvhsthora | timestamp without time zone |  | NO | NULL |

### hisprecsubcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsubexpid | numeric | 5,0 | NO | NULL |
| 2 | hsubcptoid | numeric | 5,0 | NO | NULL |
| 3 | hsubttarid | numeric | 5,0 | NO | NULL |
| 4 | hsubfecapl | date |  | NO | NULL |
| 5 | hsubsubcid | numeric | 5,0 | NO | NULL |
| 6 | hsubperid | numeric | 5,0 | NO | NULL |
| 7 | hsubtimpid | numeric | 5,0 | YES | NULL |
| 8 | hsubfaccor | character | 1 | NO | NULL |
| 9 | hsubforapl | numeric | 5,0 | NO | NULL |
| 10 | hsubprefij | double precision | 53 | YES | NULL |
| 11 | hsubprepro | double precision | 53 | YES | NULL |
| 12 | hsubobtcal | character | 1 | NO | NULL |
| 13 | hsubcalib | numeric | 5,0 | YES | NULL |
| 14 | hsubpropre | character | 1 | NO | NULL |
| 15 | hsubsispro | character | 1 | NO | NULL |
| 16 | hsubobtcan | numeric | 5,0 | NO | 1 |
| 17 | hsuborden | numeric | 5,0 | NO | NULL |
| 18 | hsubobtfec | numeric | 5,0 | NO | 1 |
| 19 | hsubsndmargen | character | 1 | NO | 'N'::bpchar |
| 20 | hsubcorpera | numeric | 5,0 | NO | 1 |
| 21 | hsubcorperb | numeric | 5,0 | NO | 1 |
| 22 | hpsubtpvid | numeric | 5,0 | YES | NULL |
| 23 | hpsubsnconsreal | character | 1 | NO | 'S'::bpchar |
| 24 | hpsubsnestim | character | 1 | NO | 'S'::bpchar |
| 25 | hpsubsnreparto | character | 1 | NO | 'S'::bpchar |
| 26 | hpsubsnotros | character | 1 | NO | 'S'::bpchar |
| 27 | hpsubtxtid | numeric | 10,0 | YES | NULL |
| 28 | hpsubsnimpfec | character | 1 | NO | 'N'::bpchar |
| 29 | hpsubsnimplin0 | character | 1 | NO | 'N'::bpchar |
| 30 | hpsubimptramos | numeric | 5,0 | NO | 2 |
| 31 | hpsubsnptran | character | 1 | NO | NULL |
| 32 | hsubsnmrgaltas | character | 1 | NO | NULL |
| 33 | hsubhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 34 | hsubhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 35 | hpsubtddesc | character varying | 1000 | YES | NULL |
| 36 | hpsubidicod | character | 2 | YES | NULL |
| 37 | hpsubsnimplincnt0 | character | 1 | NO | 'N'::bpchar |
| 38 | hpsubsnimpsbtr | character | 1 | NO | 'S'::bpchar |
| 39 | hsubumtramos | numeric | 5,0 | NO | 1 |
| 40 | hsubsnajustprec | character | 1 | NO | 'N'::bpchar |
| 41 | hpsubsnimplinlecnoval | character | 1 | NO | 'N'::bpchar |
| 42 | hsubcheckfecalta | character | 1 | NO | 'N'::bpchar |
| 43 | hpsubsnseprec | character | 1 | NO | 'N'::bpchar |
| 44 | hpsubtipaplicrec | numeric | 5,0 | YES | NULL |
| 45 | hpsubscpovid | numeric | 5,0 | YES | NULL |
| 46 | hpsubsnimptramosagrup | character | 1 | NO | 'N'::bpchar |
| 47 | hpsubagrupsubcto | numeric | 5,0 | YES | NULL |
| 48 | hpsubregestimbolsa | character | 1 | NO | 'N'::bpchar |

### hisprecsubdvng
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpsudexpid | numeric | 5,0 | NO | NULL |
| 2 | hpsudcptoid | numeric | 5,0 | NO | NULL |
| 3 | hpsudttarid | numeric | 5,0 | NO | NULL |
| 4 | hpsudfecapl | date |  | NO | NULL |
| 5 | hpsudsubcid | numeric | 5,0 | NO | NULL |
| 6 | hpsudfiapdv | date |  | NO | NULL |
| 7 | hpsudffapdv | date |  | YES | NULL |
| 8 | hpsuddvnid | numeric | 5,0 | NO | NULL |
| 9 | hpsudhstusu | character varying | 10 | NO | NULL |
| 10 | hpsudhsthora | timestamp without time zone |  | NO | NULL |

### hisprectracal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hptcexpid | numeric | 5,0 | NO | NULL |
| 2 | hptccptoid | numeric | 5,0 | NO | NULL |
| 3 | hptcttarid | numeric | 5,0 | NO | NULL |
| 4 | hptcfecapli | date |  | NO | NULL |
| 5 | hptcsubcid | numeric | 5,0 | NO | NULL |
| 6 | hptclimite | numeric | 10,0 | NO | NULL |
| 7 | hptccalib | numeric | 5,0 | NO | NULL |
| 8 | hptcprefij | double precision | 53 | NO | NULL |
| 9 | hptcprepro | double precision | 53 | NO | NULL |
| 10 | hptcincremento | numeric | 5,0 | NO | NULL |
| 11 | hptchstusu | character varying | 10 | NO | NULL |
| 12 | hptchsthora | timestamp without time zone |  | NO | NULL |
| 13 | hptcsnproincr | character | 1 | NO | 'N'::bpchar |

### hisprectramos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htraadjid | numeric | 5,0 | NO | NULL |
| 2 | htracptoid | numeric | 5,0 | NO | NULL |
| 3 | htrattarid | numeric | 5,0 | NO | NULL |
| 4 | htrafaplic | date |  | NO | NULL |
| 5 | htrasubcid | numeric | 5,0 | NO | NULL |
| 6 | htralimite | numeric | 10,0 | NO | NULL |
| 7 | htradesc | character varying | 30 | NO | NULL |
| 8 | htraprefij | double precision | 53 | NO | NULL |
| 9 | htraprepro | double precision | 53 | NO | NULL |
| 10 | htrausado | character | 1 | NO | NULL |
| 11 | hptraincremento | numeric | 5,0 | NO | 1 |
| 12 | htrahstusu | character varying | 10 | NO | NULL |
| 13 | htrahsthora | timestamp without time zone |  | NO | NULL |
| 14 | hptrasnproincr | character | 1 | NO | 'N'::bpchar |
| 15 | htranumtra | numeric | 5,0 | YES | NULL |

### hisprefacext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpfeid | numeric | 5,0 | NO | NULL |
| 2 | hpfefacextid | numeric | 5,0 | NO | NULL |
| 3 | hpfeexpid | numeric | 5,0 | NO | NULL |
| 4 | hpfesocid | numeric | 10,0 | NO | NULL |
| 5 | hpfeprefijo | character | 2 | NO | NULL |
| 6 | hpfehstusu | character varying | 10 | NO | NULL |
| 7 | hpfehsthora | timestamp without time zone |  | NO | NULL |

### hispreotrc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpotadjid | numeric | 5,0 | NO | NULL |
| 2 | hpotcptoid | numeric | 5,0 | NO | NULL |
| 3 | hpotttarid | numeric | 5,0 | NO | NULL |
| 4 | hpotfecapl | date |  | NO | NULL |
| 5 | hpotsubcid | numeric | 5,0 | NO | NULL |
| 6 | hpotoconid | numeric | 5,0 | NO | NULL |
| 7 | hpotporcen | numeric | 4,2 | YES | NULL |
| 8 | hpotaplimp | numeric | 5,0 | YES | NULL |
| 9 | hpotusado | character | 1 | YES | NULL |
| 10 | hpothstusu | character varying | 10 | YES | NULL |
| 11 | hpothsthora | timestamp without time zone |  | YES | NULL |

### hispresremesa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hprmsocprsid | numeric | 10,0 | NO | NULL |
| 2 | hprmofiid | numeric | 5,0 | NO | NULL |
| 3 | hprmhstusu | character varying | 10 | NO | NULL |
| 4 | hprmhsthora | timestamp without time zone |  | NO | NULL |
| 5 | hprmsnremmigc19 | character | 1 | NO | 'N'::bpchar |
| 6 | hprmsnremmigc1914 | character | 1 | NO | 'N'::bpchar |
| 7 | prmc1914mascfic | character varying | 35 | YES | NULL |

### hisptoserclau
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpscptosid | numeric | 10,0 | NO | NULL |
| 2 | hpscclauid | numeric | 5,0 | NO | NULL |
| 3 | hpscsesalt | numeric | 10,0 | NO | NULL |
| 4 | hpscsesbaj | numeric | 10,0 | YES | NULL |
| 5 | hpschstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | hpschsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hisptoserv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hptosid | numeric | 10,0 | YES | NULL |
| 2 | hptosdirid | numeric | 10,0 | NO | NULL |
| 3 | hptostetid | numeric | 5,0 | NO | NULL |
| 4 | hptosexpid | numeric | 5,0 | YES | NULL |
| 5 | hptoszonid | character | 3 | YES | NULL |
| 6 | hptoslibcod | numeric | 5,0 | YES | NULL |
| 7 | hptosemplid | character | 2 | YES | NULL |
| 8 | hptoscodrec | numeric | 14,0 | YES | NULL |
| 9 | hptostipsum | numeric | 5,0 | YES | NULL |
| 10 | hptosobserv | character | 80 | YES | NULL |
| 11 | hptosestado | numeric | 5,0 | YES | NULL |
| 12 | hptosfsucod | numeric | 5,0 | YES | NULL |
| 13 | hptosservid | numeric | 10,0 | YES | NULL |
| 14 | hptosfilbat | numeric | 5,0 | YES | NULL |
| 15 | hptoscolbat | numeric | 5,0 | YES | NULL |
| 16 | hptosobsid | numeric | 10,0 | YES | NULL |
| 17 | hptosconcom | character | 1 | YES | NULL |
| 18 | hptocortpos | character | 1 | YES | NULL |
| 19 | hptopccid | numeric | 10,0 | YES | NULL |
| 20 | hptosllaves | numeric | 5,0 | YES | NULL |
| 21 | hptostpsid | numeric | 5,0 | YES | NULL |
| 22 | hptosndesha | character | 1 | YES | 'N'::bpchar |
| 23 | hptosnbocas | numeric | 5,0 | YES | NULL |
| 24 | hptosnmang | numeric | 5,0 | YES | NULL |
| 25 | hptosfeccorte | date |  | YES | NULL |
| 26 | hptosaltcalimm | numeric | 5,0 | YES | NULL |
| 27 | hptosmtbcid | numeric | 5,0 | YES | NULL |
| 28 | hptoslic2aocup | character varying | 20 | YES | NULL |
| 29 | hptosflic2aocup | date |  | YES | NULL |
| 30 | hptosrefcat | character varying | 30 | YES | NULL |
| 31 | hptossncortdeud | character | 1 | NO | 'N'::bpchar |
| 32 | hptossncortprov | character | 1 | NO | 'N'::bpchar |
| 33 | hptossncortman | character | 1 | NO | 'N'::bpchar |
| 34 | hptoscalcontra1 | numeric | 5,0 | YES | NULL |
| 35 | hptoscalcontra2 | numeric | 5,0 | YES | NULL |
| 36 | hptoshstusu | character varying | 10 | YES | 'Conversion'::character varying |
| 37 | hptoshsthora | timestamp without time zone |  | YES | CURRENT_TIMESTAMP |
| 38 | hptosfecreac | date |  | YES | NULL |
| 39 | hptosnoinsemisor | character | 1 | YES | NULL |
| 40 | hptosnnoaccess | character | 1 | NO | 'N'::bpchar |
| 41 | hptosnmalest | character | 1 | NO | 'N'::bpchar |
| 42 | hptosvalvret | character | 1 | YES | NULL |
| 43 | hptossncontrat | character | 1 | NO | 'S'::bpchar |
| 44 | hptosmotcont | numeric | 5,0 | YES | NULL |
| 45 | hptosposfraude | character | 1 | NO | 'N'::bpchar |
| 46 | hptosestrategico | character | 1 | YES | NULL |
| 47 | hptosfecfoto | date |  | YES | NULL |
| 48 | ptosnconivel | numeric | 5,0 | YES | NULL |
| 49 | hptosllavecerrada | character | 1 | NO | 'N'::bpchar |
| 50 | hptossnnoleerprl | character | 1 | YES | NULL |
| 51 | hptoscompunt | character | 80 | YES | NULL |
| 52 | hptoscompuntfini | date |  | YES | NULL |
| 53 | hptoscompuntffin | date |  | YES | NULL |
| 54 | hptosnivcrit | numeric | 5,0 | YES | NULL |

### hisptoservsecun
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpssptosid | numeric | 10,0 | NO | NULL |
| 2 | hpssrpsid | numeric | 10,0 | NO | NULL |
| 3 | hpsscoefrep | numeric | 6,3 | YES | NULL |
| 4 | hpssfecini | timestamp without time zone |  | NO | NULL |
| 5 | hpssfecfin | timestamp without time zone |  | YES | NULL |
| 6 | hpsssnrecibir | character | 1 | NO | 'S'::bpchar |
| 7 | hpsshstusu | character varying | 10 | NO | NULL |
| 8 | hpsshsthora | timestamp without time zone |  | NO | NULL |
| 9 | hpssnumrel | numeric | 5,0 | NO | 1 |
| 10 | hpsstipovariableps | numeric | 5,0 | YES | NULL |

### hispubliconc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hpubid | numeric | 5,0 | NO | NULL |
| 2 | hpubadjid | numeric | 5,0 | NO | NULL |
| 3 | hpubcptoid | numeric | 5,0 | NO | NULL |
| 4 | hpubtexto | character varying | 50 | NO | NULL |
| 5 | hpubfecha | date |  | NO | NULL |
| 6 | hpubbptid | numeric | 5,0 | YES | NULL |
| 7 | hpubhstusu | character varying | 10 | NO | NULL |
| 8 | hpubhsthora | timestamp without time zone |  | NO | NULL |

### hisqmotreclam
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hmtrid | numeric | 5,0 | NO | NULL |
| 2 | hmtrdescrip | numeric | 10,0 | NO | NULL |
| 3 | hmtrsncreaord | character | 1 | NO | NULL |
| 4 | hmtrhstusu | character varying | 10 | NO | NULL |
| 5 | hmtrhsthora | timestamp without time zone |  | NO | NULL |
| 6 | hmtrsnactivo | character | 1 | NO | 'S'::bpchar |
| 7 | hmtrtipo | numeric | 5,0 | NO | 1 |

### hisqtplgrecl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htplid | numeric | 5,0 | NO | NULL |
| 2 | htpldescrip | numeric | 10,0 | NO | NULL |
| 3 | htplmtrid | numeric | 5,0 | NO | NULL |
| 4 | htplhstusu | character varying | 10 | NO | NULL |
| 5 | htplhsthora | timestamp without time zone |  | NO | NULL |
| 6 | htplsnactivo | character | 1 | NO | 'S'::bpchar |
| 7 | htplrcuid | numeric | 5,0 | NO | 0 |
| 8 | htplsnrfactura | character | 1 | YES | NULL |
| 9 | htplsnrdanyos | character | 1 | YES | NULL |
| 10 | htplsnreapertura | character | 1 | NO | 'N'::bpchar |
| 11 | htpldiasplazo | numeric | 5,0 | YES | NULL |

### hisqtxtcomunica
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htxcexpid | numeric | 5,0 | NO | NULL |
| 2 | htxctxtlibre | numeric | 10,0 | NO | NULL |
| 3 | htxctctid | numeric | 5,0 | NO | NULL |
| 4 | htxcmtcid | numeric | 5,0 | NO | NULL |
| 5 | htxchstusu | character varying | 10 | NO | NULL |
| 6 | htxchsthora | timestamp without time zone |  | NO | NULL |

### hisrecargo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hrcgid | numeric | 10,0 | NO | NULL |
| 2 | hrcgfacid | numeric | 10,0 | NO | NULL |
| 3 | hrcggesid | numeric | 10,0 | NO | NULL |
| 4 | hrcgpctrec | numeric | 6,2 | NO | NULL |
| 5 | hrcgimporte | numeric | 18,2 | NO | NULL |
| 6 | hrcgestado | numeric | 5,0 | NO | NULL |
| 7 | hrcgsnintdem | character | 1 | NO | NULL |
| 8 | hrcghstusu | character varying | 10 | NO | NULL |
| 9 | hrcghsthora | timestamp without time zone |  | NO | NULL |
| 10 | hrcgasnid | numeric | 10,0 | YES | NULL |
| 11 | hrcgocgid | numeric | 10,0 | YES | NULL |

### hisrefmsepa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hrefmid | numeric | 10,0 | NO | NULL |
| 2 | hrefmhsthora | timestamp without time zone |  | NO | NULL |
| 3 | hrefmhstusu | character varying | 10 | NO | NULL |
| 4 | hrefmfecfirma | date |  | YES | NULL |
| 5 | hrefmsndocadj | character | 1 | YES | NULL |
| 6 | hrefmsocprsid | numeric | 10,0 | YES | NULL |
| 7 | hrefmsencid | numeric | 10,0 | YES | NULL |
| 8 | hrefmenvprsid | numeric | 10,0 | YES | NULL |
| 9 | hrefmenvnumdir | numeric | 5,0 | YES | NULL |
| 10 | hrefmenvprs | character varying | 200 | YES | NULL |
| 11 | hrefmenvdir | character varying | 200 | YES | NULL |

### hisregulfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hrgfid | numeric | 10,0 | NO | NULL |
| 2 | hrgfpolnum | numeric | 10,0 | NO | NULL |
| 3 | hrgftconid | numeric | 5,0 | NO | NULL |
| 4 | hrgftsubid | numeric | 5,0 | NO | NULL |
| 5 | hrgfimporte | numeric | 18,2 | NO | NULL |
| 6 | hrgfestado | numeric | 5,0 | NO | NULL |
| 7 | hrgftrgid | numeric | 5,0 | NO | NULL |
| 8 | hrgffecintro | date |  | YES | NULL |
| 9 | hrgffecini | date |  | YES | NULL |
| 10 | hrgffecfin | date |  | YES | NULL |
| 11 | hrgfhstusu | character varying | 10 | NO | NULL |
| 12 | hrgfhsthora | timestamp without time zone |  | NO | NULL |
| 13 | hrgfperiidd | numeric | 5,0 | YES | NULL |
| 14 | hrgfpernumd | numeric | 5,0 | YES | NULL |
| 15 | hrgfannod | numeric | 5,0 | YES | NULL |
| 16 | hrgfperiidh | numeric | 5,0 | YES | NULL |
| 17 | hrgfpernumh | numeric | 5,0 | YES | NULL |
| 18 | hrgfannoh | numeric | 5,0 | YES | NULL |

### hisrelacionps
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hrpsid | numeric | 10,0 | NO | NULL |
| 2 | hrpsptosid | numeric | 10,0 | NO | NULL |
| 3 | hrpstrpid | numeric | 5,0 | NO | NULL |
| 4 | hrpsdescrip | character varying | 100 | YES | NULL |
| 5 | hrpscoefprincipal | numeric | 6,3 | YES | NULL |
| 6 | hrpscoefreduccion | numeric | 6,3 | YES | NULL |
| 7 | hrpsfecini | timestamp without time zone |  | NO | NULL |
| 8 | hrpsfecfin | timestamp without time zone |  | YES | NULL |
| 9 | hrpsm3pdtes | numeric | 10,0 | NO | 0 |
| 10 | hrpssnrepartoppal | character | 1 | NO | 'N'::bpchar |
| 11 | hrpstpvid | numeric | 5,0 | YES | NULL |
| 12 | hrpstetid | numeric | 5,0 | NO | NULL |
| 13 | hrpstipreduc | numeric | 5,0 | YES | NULL |
| 14 | hrpssncconsumo | character | 1 | NO | NULL |
| 15 | hrpssnnegpte | character | 1 | NO | 'S'::bpchar |
| 16 | hrpshstusu | character varying | 10 | NO | NULL |
| 17 | hrpshsthora | timestamp without time zone |  | NO | NULL |
| 18 | hrpssnrestacon | character | 1 | NO | 'S'::bpchar |
| 19 | hrpssnnorepm3pdtes | character | 1 | NO | 'N'::bpchar |
| 20 | hrpstrpid2 | numeric | 5,0 | YES | NULL |
| 21 | hrpstetid2 | numeric | 5,0 | YES | NULL |
| 22 | hrpssnbloqcont | character | 1 | NO | 'N'::bpchar |
| 23 | hrpssndetectarcont | character | 1 | NO | 'N'::bpchar |
| 24 | hrpsrefvarreq | numeric | 5,0 | YES | NULL |
| 25 | hrpssnestimsecund | character | 1 | NO | 'S'::bpchar |
| 26 | hrpsm3reduccion | numeric | 10,0 | YES | NULL |
| 27 | hrpsminm3deduccion | numeric | 10,0 | YES | NULL |

### hisresnotacuse
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hrnaid | numeric | 5,0 | NO | NULL |
| 2 | hrnatxtid | numeric | 10,0 | NO | NULL |
| 3 | hrnahstusu | character varying | 10 | NO | NULL |
| 4 | hrnahsthora | timestamp without time zone |  | NO | NULL |
| 5 | hrnatddesc | character varying | 1000 | NO | NULL |
| 6 | hrnaidioma | character | 2 | NO | NULL |

### hisrevacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hrvaid | numeric | 10,0 | NO | NULL |
| 2 | hrvaestado | numeric | 5,0 | NO | NULL |
| 3 | hrvaconforme | numeric | 5,0 | NO | NULL |
| 4 | hrvaobsid | numeric | 10,0 | YES | NULL |
| 5 | hrvapromot | character varying | 50 | YES | NULL |
| 6 | hrvadirobra | character varying | 50 | YES | NULL |
| 7 | hrvainstprsid | numeric | 10,0 | YES | NULL |
| 8 | hrvaexpid | numeric | 5,0 | NO | NULL |
| 9 | hrvahstusu | character varying | 10 | NO | ' '::character varying |
| 10 | hrvahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 11 | hrvanominst | character varying | 125 | YES | NULL |

### hisrutadalttpdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hradid | numeric | 5,0 | NO | NULL |
| 2 | hradrtdid | numeric | 5,0 | NO | NULL |
| 3 | hradtpdid | numeric | 5,0 | NO | NULL |
| 4 | hradncalcalid | numeric | 10,0 | NO | NULL |
| 5 | hradfindes | numeric | 5,0 | NO | NULL |
| 6 | hradfinhas | numeric | 5,0 | NO | NULL |
| 7 | hradctdid | numeric | 5,0 | NO | NULL |
| 8 | hradsnactivo | character | 1 | NO | NULL |
| 9 | hradhstusu | character varying | 10 | NO | NULL |
| 10 | hradhsthora | timestamp without time zone |  | NO | NULL |

### hissechidraulico
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hschid | numeric | 5,0 | NO | NULL |
| 2 | hschdesc | character varying | 50 | NO | NULL |
| 3 | hschexpid | numeric | 5,0 | NO | NULL |
| 4 | hschsngestint | character | 1 | NO | NULL |
| 5 | hschhstusu | character varying | 10 | NO | ' '::character varying |
| 6 | hschhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | hschcodgis | character varying | 50 | YES | NULL |

### hissencob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsenid | numeric | 10,0 | NO | NULL |
| 2 | hsenprsid | numeric | 10,0 | NO | NULL |
| 3 | hsencanaid | character | 1 | NO | NULL |
| 4 | hsenactiva | character | 1 | NO | NULL |
| 5 | hsenageid | numeric | 5,0 | YES | NULL |
| 6 | hsenbanid | numeric | 5,0 | YES | NULL |
| 7 | hsennumcta | character varying | 20 | YES | NULL |
| 8 | hsendigcon | character | 2 | YES | NULL |
| 9 | hsenprccam | numeric | 10,0 | NO | NULL |
| 10 | hsenhstusu | character varying | 10 | NO | NULL |
| 11 | hsenhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 12 | hsennomcompleto | character varying | 200 | YES | NULL |
| 13 | hsenciban | character varying | 34 | YES | NULL |
| 14 | hsencformat | character varying | 50 | YES | NULL |
| 15 | hsencusucrea | character varying | 10 | YES | NULL |
| 16 | hsencimplim | numeric | 18,2 | YES | NULL |
| 17 | hsencformatocta | numeric | 5,0 | YES | NULL |

### hisserverprops
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hspservidor | character varying | 128 | NO | NULL |
| 2 | hspprop | character varying | 100 | NO | NULL |
| 3 | hspvalor_from | character varying | 400 | YES | NULL |
| 4 | hspgrupo_from | character varying | 20 | YES | NULL |
| 5 | hspvalor_to | character varying | 400 | YES | NULL |
| 6 | hspgrupo_to | character varying | 20 | YES | NULL |
| 7 | hspaccion | character | 1 | NO | NULL |
| 8 | hspusuid | character varying | 10 | YES | NULL |
| 9 | hsphora | timestamp without time zone |  | NO | NULL |

### hisservicio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hserid | numeric | 10,0 | NO | NULL |
| 2 | hserdirid | numeric | 10,0 | NO | NULL |
| 3 | hsertetid | numeric | 5,0 | NO | NULL |
| 4 | hserexpid | numeric | 5,0 | NO | NULL |
| 5 | hseracoid | numeric | 10,0 | NO | NULL |
| 6 | hserproext | numeric | 5,0 | NO | NULL |
| 7 | hserproint | numeric | 5,0 | NO | NULL |
| 8 | hseredif | character varying | 25 | YES | NULL |
| 9 | hseraport | double precision | 53 | NO | NULL |
| 10 | hserindced | character | 1 | NO | NULL |
| 11 | hserindbol | character | 1 | NO | NULL |
| 12 | hsercorte | character | 1 | NO | NULL |
| 13 | hserfsumcod | numeric | 5,0 | YES | NULL |
| 14 | hserempzid | character | 2 | NO | NULL |
| 15 | hsernumviv | numeric | 10,0 | NO | NULL |
| 16 | hsersncontrat | character | 1 | NO | NULL |
| 17 | hsermotcont | numeric | 5,0 | YES | NULL |
| 18 | hserobsid | numeric | 10,0 | YES | NULL |
| 19 | hsertipo | numeric | 5,0 | YES | NULL |
| 20 | hsersnactivo | character | 1 | NO | NULL |
| 21 | hsersnretaltas | character | 1 | NO | NULL |
| 22 | hserfecprevmas | date |  | YES | NULL |
| 23 | hserhorprevmas | time without time zone |  | YES | NULL |
| 24 | hserfecrealmas | date |  | YES | NULL |
| 25 | hserhorrealmas | time without time zone |  | YES | NULL |
| 26 | hsercaldef | character varying | 15 | YES | NULL |
| 27 | hserfcaldef | date |  | YES | NULL |
| 28 | hsernumfil | numeric | 5,0 | YES | NULL |
| 29 | hsernumcol | numeric | 5,0 | YES | NULL |
| 30 | hserllaves | numeric | 5,0 | YES | NULL |
| 31 | hsersncartel | character | 1 | NO | 'N'::bpchar |
| 32 | hserlic1aocup | character varying | 20 | YES | NULL |
| 33 | hserflic1aocup | date |  | YES | NULL |
| 34 | hserfeccontra | date |  | YES | NULL |
| 35 | hserhstusu | character varying | 10 | NO | ' '::character varying |
| 36 | hserhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 37 | hserdireccion | character varying | 110 | YES | NULL |
| 38 | hserrefcat | character varying | 14 | YES | NULL |
| 39 | hserconid | numeric | 10,0 | YES | NULL |
| 40 | hsertpllave | character varying | 15 | YES | NULL |
| 41 | hserobserv | character | 80 | YES | NULL |
| 42 | hsertipotelec | numeric | 5,0 | YES | NULL |
| 43 | hsertelec | character | 1 | NO | 'N'::bpchar |
| 44 | hserptosid | numeric | 10,0 | YES | NULL |

### hissocflujofirma
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsffsocid | numeric | 10,0 | NO | NULL |
| 2 | hsfffluid | character varying | 50 | NO | NULL |
| 3 | hsffnombre | character varying | 100 | NO | NULL |
| 4 | hsfftipofirma | numeric | 5,0 | NO | NULL |
| 5 | hsffsnprinc | character | 1 | NO | NULL |
| 6 | hsffcaduc | numeric | 5,0 | YES | NULL |
| 7 | hsfftipoenvdig | numeric | 5,0 | NO | NULL |
| 8 | hsffhsthora | timestamp without time zone |  | NO | NULL |
| 9 | hsffhstusu | character varying | 10 | NO | NULL |
| 10 | hsffnumautcad | numeric | 5,0 | YES | NULL |
| 11 | hsffnumaudblq | numeric | 5,0 | YES | NULL |
| 12 | hsffsnenvcli | character | 1 | NO | 'N'::bpchar |

### hissocfpcuent
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsfpsocid | numeric | 10,0 | NO | NULL |
| 2 | hsfpcanal | character | 1 | NO | NULL |
| 3 | hsfpfmid | numeric | 5,0 | NO | NULL |
| 4 | hsfpccid | numeric | 5,0 | NO | NULL |
| 5 | hsfpdestes | character | 4 | YES | NULL |
| 6 | hsfpbcr | character | 3 | YES | NULL |
| 7 | hsfpcgastos | numeric | 5,0 | YES | NULL |
| 8 | hsfptpimp | numeric | 5,0 | YES | NULL |
| 9 | hsfphstusu | character varying | 10 | NO | NULL |
| 10 | hsfphsthora | timestamp without time zone |  | NO | NULL |

### hissochub
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hshbsocprsid | numeric | 10,0 | NO | NULL |
| 2 | hshbhubid | numeric | 5,0 | NO | NULL |
| 3 | hshbplat | character varying | 10 | NO | NULL |
| 4 | hshbsubent | character varying | 10 | NO | NULL |
| 5 | hshbemail | character varying | 40 | YES | NULL |
| 6 | hshbatrib1 | character varying | 20 | YES | NULL |
| 7 | hshbatrib2 | character varying | 20 | YES | NULL |
| 8 | hshbhstusu | character varying | 10 | NO | ' '::character varying |
| 9 | hshbhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### hissociedad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsocprsid | numeric | 10,0 | NO | NULL |
| 2 | hsoccodigo | character | 4 | NO | NULL |
| 3 | hsocdescri | character varying | 50 | NO | NULL |
| 4 | hsoctsocid | numeric | 5,0 | NO | NULL |
| 5 | hsocsngestora | character | 1 | NO | NULL |
| 6 | hsocdiasdb | numeric | 5,0 | NO | NULL |
| 7 | hsoctxtid | numeric | 10,0 | NO | NULL |
| 8 | hsoccodmansap | character | 3 | YES | NULL |
| 9 | hsoccodsocsap | character | 4 | YES | NULL |
| 10 | hsoccodentsum | character varying | 10 | YES | NULL |
| 11 | hsocsnremdef | character | 1 | NO | NULL |
| 12 | hsoctipoterm | numeric | 5,0 | YES | NULL |
| 13 | hsocnumcomer | character varying | 15 | YES | NULL |
| 14 | hsocnumterm | character varying | 15 | YES | NULL |
| 15 | hsocpwdterm | character varying | 20 | YES | NULL |
| 16 | hsoclimvalapte | numeric | 10,0 | YES | NULL |
| 17 | hsocdirlopd | character varying | 100 | YES | NULL |
| 18 | hsoccrisol | character | 2 | YES | NULL |
| 19 | hsochstusu | character varying | 10 | NO | NULL |
| 20 | hsochsthora | timestamp without time zone |  | NO | NULL |
| 21 | hsocdescrip | character varying | 1000 | YES | NULL |
| 22 | hsocidioma | character | 2 | YES | NULL |
| 23 | hsocurlofivirtual | character varying | 100 | YES | NULL |
| 24 | hsocnumdiremail | numeric | 5,0 | YES | NULL |
| 25 | hsocfipropfac | date |  | YES | NULL |
| 26 | hsocffpropfac | date |  | YES | NULL |
| 27 | hsocsnfforref | character | 1 | NO | 'N'::bpchar |
| 28 | hsocsnfforabo | character | 1 | NO | 'N'::bpchar |
| 29 | hsoctipagruimp | numeric | 5,0 | NO | 1 |
| 30 | hsoccodapo | numeric | 10,0 | YES | NULL |
| 31 | hsocsnmod340 | character | 1 | NO | 'N'::bpchar |
| 32 | hsocmaxlinidoc | numeric | 5,0 | YES | NULL |
| 33 | hsocususms | character varying | 200 | YES | NULL |
| 34 | hsocpwdsms | character varying | 200 | YES | NULL |
| 35 | hsocurllogo | character varying | 200 | YES | NULL |
| 36 | hsocsmsremi | character varying | 11 | YES | NULL |
| 37 | hsocemailremi | character varying | 110 | YES | NULL |
| 38 | hsocformfichintcont | character varying | 4 | YES | NULL |
| 39 | hsocsnsite | character | 1 | YES | NULL |
| 40 | hsocsistdeudext | character varying | 3 | YES | NULL |
| 41 | hsocsngensedig | character | 1 | NO | 'N'::bpchar |
| 42 | hsoccfdcompr | numeric | 5,0 | YES | NULL |
| 43 | hsoccfdversion | character varying | 10 | YES | NULL |
| 44 | hsoccfdpago | numeric | 5,0 | YES | NULL |
| 45 | hsoccfdcondpago | numeric | 5,0 | YES | NULL |
| 46 | hsoccfdpobid | numeric | 10,0 | YES | NULL |
| 47 | hsoccfdregimen | numeric | 5,0 | YES | NULL |
| 48 | hsocprerefsepa | character | 2 | YES | NULL |
| 49 | hsocreurefsepa | numeric | 5,0 | NO | 0 |
| 50 | hsocsnactfacov | character | 1 | NO | 'S'::bpchar |
| 51 | hsocsnreffirm | character | 1 | NO | 'N'::bpchar |
| 52 | hsocsncertifdig | character | 1 | NO | 'S'::bpchar |
| 53 | hsocsnfacamojui | character | 1 | NO | 'N'::bpchar |
| 54 | hsoccodunico | character varying | 2 | YES | NULL |
| 55 | hsoccptoidrec | numeric | 5,0 | YES | NULL |
| 56 | hsocsnreagestor | character | 1 | NO | 'N'::bpchar |
| 57 | hsocfirid | numeric | 5,0 | YES | NULL |
| 58 | hsocagrucoc | numeric | 5,0 | YES | NULL |
| 59 | hsocremirmailaddress | character varying | 320 | YES | NULL |
| 60 | hsocsnfacurl | character | 1 | NO | 'N'::bpchar |
| 61 | hsocdiasfacurl | numeric | 5,0 | YES | NULL |
| 62 | hsoctwitter | character varying | 15 | YES | NULL |
| 63 | hsocnomfirma | character varying | 60 | YES | NULL |
| 64 | hsocaliascert | character varying | 25 | YES | NULL |
| 65 | hsocpwdcert | character varying | 100 | YES | NULL |
| 66 | hsoccomurlautlec | character varying | 100 | YES | NULL |
| 67 | hsonomdpo | character varying | 200 | YES | NULL |
| 68 | hsomaildpo | character varying | 200 | YES | NULL |
| 69 | hsotelfdto | numeric | 11,0 | YES | NULL |
| 70 | hsocontacarco | character varying | 90 | YES | NULL |
| 71 | hsocurldescfacov | numeric | 5,0 | YES | '1'::numeric |
| 72 | hsocconsintid | numeric | 10,0 | YES | NULL |
| 73 | hsocagprodatostxtid | numeric | 10,0 | YES | NULL |
| 74 | hsocagprodatosdesc | character varying | 100 | YES | NULL |
| 75 | hsocwebagprodatos | character varying | 100 | YES | NULL |
| 76 | hsocnomgraftxtid | numeric | 10,0 | YES | NULL |
| 77 | hsocnomgrafico | character varying | 100 | YES | NULL |
| 78 | hsocnvasalertas | character | 1 | NO | 'N'::bpchar |
| 79 | hsocsistelelec | numeric | 5,0 | NO | 1 |
| 80 | hsocidsocacua | character varying | 36 | YES | NULL |
| 81 | hsocidappplat | character varying | 36 | YES | NULL |
| 82 | hsoctokenacua | character varying | 65 | YES | NULL |
| 83 | hsocsndocpagourl | character | 1 | NO | 'N'::bpchar |
| 84 | hsocurlcortaofivirt | character varying | 100 | YES | NULL |
| 85 | hsocusrfirma | character varying | 50 | YES | NULL |
| 86 | hsocpwdfirma | character varying | 90 | YES | NULL |
| 87 | hsoccertid | character varying | 50 | YES | NULL |
| 88 | hsocpincertid | character varying | 90 | YES | NULL |

### hissocopecuent
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hscosocid | numeric | 10,0 | NO | NULL |
| 2 | hscotpope | numeric | 5,0 | NO | NULL |
| 3 | hscoccid | numeric | 5,0 | NO | NULL |
| 4 | hscohstusu | character varying | 10 | NO | NULL |
| 5 | hscohsthora | timestamp without time zone |  | NO | NULL |
| 6 | hscoactccodigo | character | 2 | YES | NULL |

### hissolacoestec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsaetsacid | numeric | 10,0 | NO | NULL |
| 2 | hsaetrefcat | character varying | 30 | YES | NULL |
| 3 | hsaetcnttnum | numeric | 10,0 | YES | NULL |
| 4 | hsaettetid | numeric | 5,0 | YES | NULL |
| 5 | hsaetexpid | numeric | 5,0 | YES | NULL |
| 6 | hsaetschid | numeric | 5,0 | YES | NULL |
| 7 | hsaetsshid | numeric | 10,0 | YES | NULL |
| 8 | hsaetinsalc | date |  | YES | NULL |
| 9 | hsaetafealc | date |  | YES | NULL |
| 10 | hsaettipovar | numeric | 5,0 | YES | NULL |
| 11 | hsaetsnprov | character varying | 1 | NO | 'N'::character varying |
| 12 | hsaetcodrec | numeric | 14,0 | YES | NULL |
| 13 | hsaethstusu | character varying | 10 | NO | NULL |
| 14 | hsaethsthora | timestamp without time zone |  | NO | NULL |

### hissolacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsacid | numeric | 10,0 | NO | NULL |
| 2 | hsacexpid | numeric | 5,0 | NO | NULL |
| 3 | hsactsaid | numeric | 5,0 | NO | NULL |
| 4 | hsacestado | numeric | 5,0 | NO | NULL |
| 5 | hsacfecest | date |  | NO | NULL |
| 6 | hsachorcresol | timestamp without time zone |  | NO | NULL |
| 7 | hsachorcomcli | timestamp without time zone |  | YES | NULL |
| 8 | hsachorrspcli | timestamp without time zone |  | YES | NULL |
| 9 | hsactextrech | character varying | 80 | YES | NULL |
| 10 | hsacdirid | numeric | 10,0 | NO | NULL |
| 11 | hsacobsdir | character varying | 60 | YES | NULL |
| 12 | hsacviacod | character | 2 | NO | NULL |
| 13 | hsacfecprvini | date |  | YES | NULL |
| 14 | hsacfecprvfin | date |  | YES | NULL |
| 15 | hsacpeticionario | numeric | 10,0 | NO | NULL |
| 16 | hsacpetnumdir | numeric | 5,0 | NO | NULL |
| 17 | hsacpetcalid | numeric | 5,0 | NO | NULL |
| 18 | hsacpetcalobj | numeric | 5,0 | NO | NULL |
| 19 | hsacpropietario | numeric | 10,0 | NO | NULL |
| 20 | hsacpropnumdir | numeric | 5,0 | NO | NULL |
| 21 | hsacperscont | numeric | 10,0 | NO | NULL |
| 22 | hsacinstalador | numeric | 10,0 | NO | NULL |
| 23 | hsacnuminst | character varying | 15 | YES | NULL |
| 24 | hsacinstreci | character varying | 15 | YES | NULL |
| 25 | hsacdestofer | numeric | 5,0 | NO | NULL |
| 26 | hsacfecimpsol | date |  | YES | NULL |
| 27 | hsacftoid | numeric | 10,0 | YES | NULL |
| 28 | hsacdescserv | character varying | 80 | YES | NULL |
| 29 | hsacdescserv2 | character varying | 80 | YES | NULL |
| 30 | hsacobssol | character varying | 80 | YES | NULL |
| 31 | hsacobssol2 | character varying | 80 | YES | NULL |
| 32 | hsactipinst | numeric | 5,0 | NO | NULL |
| 33 | hsacacotipo | numeric | 5,0 | NO | NULL |
| 34 | hsactipotrab | numeric | 5,0 | NO | NULL |
| 35 | hsacnumplantas | numeric | 5,0 | YES | NULL |
| 36 | hsacsngrpres | character | 1 | NO | NULL |
| 37 | hsacplgrpres | numeric | 5,0 | YES | NULL |
| 38 | hsacusocod | numeric | 5,0 | NO | NULL |
| 39 | hsaccarinst | character varying | 80 | YES | NULL |
| 40 | hsacsnagpot | character | 1 | NO | NULL |
| 41 | hsacsnsan | character | 1 | NO | NULL |
| 42 | hsacnumsprin | numeric | 5,0 | YES | NULL |
| 43 | hsacsitbocinc | character varying | 15 | YES | NULL |
| 44 | hsacfecfinaco | date |  | YES | NULL |
| 45 | hsacfecfinobra | date |  | YES | NULL |
| 46 | hsacacocaudal | numeric | 6,2 | YES | NULL |
| 47 | hsacobsid | numeric | 10,0 | YES | NULL |
| 48 | hsacptosid | numeric | 10,0 | YES | NULL |
| 49 | hsaccnttnum | numeric | 10,0 | YES | NULL |
| 50 | hsacfeccadclau | date |  | YES | NULL |
| 51 | hsacdirplanta | character | 4 | YES | NULL |
| 52 | hsacdirpuerta | character | 4 | YES | NULL |
| 53 | hsachstusu | character varying | 10 | NO | NULL |
| 54 | hsachsthora | timestamp without time zone |  | NO | NULL |
| 55 | hsacnumfacti | character varying | 20 | YES | NULL |
| 56 | hsacnumoficio | character varying | 50 | YES | NULL |
| 57 | hsacfolio | character varying | 20 | YES | NULL |
| 58 | hsacfecoficio | timestamp without time zone |  | YES | NULL |
| 59 | hsacstatus | character varying | 20 | YES | NULL |
| 60 | hsaccosto | numeric | 18,2 | YES | NULL |
| 61 | hsacgasto | double precision | 53 | YES | NULL |
| 62 | hsacunidades | numeric | 5,0 | YES | NULL |

### hissolbonif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsbid | numeric | 10,0 | NO | NULL |
| 2 | hsbcnttnum | numeric | 10,0 | NO | NULL |
| 3 | hsbtbid | numeric | 5,0 | NO | NULL |
| 4 | hsbfeccrea | date |  | NO | NULL |
| 5 | hsbusucrea | character varying | 10 | NO | NULL |
| 6 | hsbfecaplic | date |  | YES | NULL |
| 7 | hsbusuaplic | character varying | 10 | YES | NULL |
| 8 | hsbfecini | date |  | NO | NULL |
| 9 | hsbfecfin | date |  | YES | NULL |
| 10 | hsbestado | numeric | 5,0 | NO | NULL |
| 11 | hsbfecestado | date |  | NO | NULL |
| 12 | hsbdiasavisovenc | numeric | 5,0 | YES | NULL |
| 13 | hsbviacod | character | 2 | YES | NULL |
| 14 | hsbpenalizado | character | 1 | YES | NULL |
| 15 | htbconceid | numeric | 5,0 | YES | NULL |
| 16 | htbtiptid | numeric | 5,0 | YES | NULL |
| 17 | hsbhstusu | character varying | 10 | NO | NULL |
| 18 | hsbhsthora | timestamp without time zone |  | NO | NULL |
| 19 | hsbexpid | numeric | 5,0 | NO | NULL |
| 20 | hsbpcidavi | numeric |  | YES | NULL |
| 21 | hsbpcidre | numeric |  | YES | NULL |

### hissolicitudaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hsacaid | numeric | 10,0 | NO | NULL |
| 2 | hsacaestado | numeric | 5,0 | NO | NULL |
| 3 | hsacaorigen | character | 1 | NO | NULL |
| 4 | hsacaprocinc | numeric | 10,0 | YES | NULL |
| 5 | hsacaproccom | numeric | 10,0 | YES | NULL |
| 6 | hsacarestram | character | 2 | NO | NULL |
| 7 | hsacafeccrea | date |  | NO | NULL |
| 8 | hsacafeciniaplic | date |  | NO | NULL |
| 9 | hsacafecfinaplic | date |  | YES | NULL |
| 10 | hsacanumhabreal | numeric | 5,0 | NO | NULL |
| 11 | hsacanumhabvirt | numeric | 5,0 | YES | NULL |
| 12 | hsacarevcenso | character | 1 | NO | NULL |
| 13 | hsacacensoval | numeric | 5,0 | NO | NULL |
| 14 | hsacatpdoc | numeric | 5,0 | NO | NULL |
| 15 | hsacanumdoc | character varying | 15 | NO | NULL |
| 16 | hsacacnttnum | numeric | 10,0 | YES | NULL |
| 17 | hsacacodentsum | numeric | 10,0 | YES | NULL |
| 18 | hsacacodine | character varying | 6 | YES | NULL |
| 19 | hsacapolaca | numeric | 10,0 | YES | NULL |
| 20 | hsacamotanultxtid | numeric | 10,0 | YES | NULL |
| 21 | hsacamotres | numeric | 5,0 | YES | NULL |
| 22 | hsacaapel1 | character varying | 25 | NO | NULL |
| 23 | hsacaapel2 | character varying | 25 | YES | NULL |
| 24 | hsacanombre | character varying | 20 | NO | NULL |
| 25 | hsacatfno | character varying | 16 | YES | NULL |
| 26 | hsacamovil | character varying | 16 | YES | NULL |
| 27 | hsacaemail | character varying | 100 | YES | NULL |
| 28 | hsacatipovia | character | 2 | YES | NULL |
| 29 | hsacanomvia | character varying | 50 | YES | NULL |
| 30 | hsacanumvia | character varying | 4 | YES | NULL |
| 31 | hsacaletra | character | 1 | YES | NULL |
| 32 | hsacabloque | character | 2 | YES | NULL |
| 33 | hsacaescalera | character | 2 | YES | NULL |
| 34 | hsacaplanta | character | 3 | YES | NULL |
| 35 | hsacapuerta | character | 4 | YES | NULL |
| 36 | hsacacodpostal | character | 5 | YES | NULL |
| 37 | hsacahstusu | character varying | 10 | NO | NULL |
| 38 | hsacahsthora | timestamp without time zone |  | NO | NULL |
| 39 | hsacatddesc | character varying | 1000 | NO | NULL |
| 40 | hsacaidioma | character | 2 | NO | 'es'::bpchar |
| 41 | hsacaclaseproc | numeric | 5,0 | NO | 1 |
| 42 | hsacasituabo | numeric | 5,0 | YES | NULL |

### histarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htarexpid | numeric | 5,0 | NO | NULL |
| 2 | htarcptoid | numeric | 5,0 | NO | NULL |
| 3 | htarttarid | numeric | 5,0 | NO | NULL |
| 4 | htarfamcod | numeric | 5,0 | NO | NULL |
| 5 | htarvigent | character | 1 | NO | NULL |
| 6 | htarsnapliper | character | 1 | NO | 'N'::bpchar |
| 7 | htarperiidf | numeric | 5,0 | YES | NULL |
| 8 | htarsnadelfto | character | 1 | NO | NULL |
| 9 | htarhstusu | character varying | 10 | NO | NULL |
| 10 | htarhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 11 | htarsngesbonif | character | 1 | NO | 'N'::bpchar |
| 12 | htarvarimporte | numeric | 5,0 | YES | NULL |
| 13 | htartiptarsoc | numeric | 5,0 | YES | NULL |

### histcscsustcu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htcsutcsid | numeric | 5,0 | NO | NULL |
| 2 | htcsuprsid | numeric | 10,0 | NO | NULL |
| 3 | htcsucuorig | numeric | 5,0 | NO | NULL |
| 4 | htcsucusust | numeric | 5,0 | NO | NULL |
| 5 | htcsusnactiva | character | 1 | NO | NULL |
| 6 | htcsuhstusu | character varying | 10 | NO | NULL |
| 7 | htcsuhsthora | timestamp without time zone |  | NO | NULL |

### histipasiento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htasid | numeric | 5,0 | NO | NULL |
| 2 | htastxtid | numeric | 10,0 | NO | NULL |
| 3 | htastextotxtid | numeric | 10,0 | NO | NULL |
| 4 | htasdh | character | 1 | NO | NULL |
| 5 | htassnrecar | character | 1 | NO | NULL |
| 6 | htassnperio | character | 1 | NO | NULL |
| 7 | htasclsdoc | character | 2 | NO | NULL |
| 8 | htashstusu | character varying | 10 | NO | NULL |
| 9 | htashsthora | timestamp without time zone |  | NO | NULL |
| 10 | htascatsisext | character varying | 25 | YES | NULL |

### histipfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htpforigen | numeric | 5,0 | NO | NULL |
| 2 | htpfopera | numeric | 5,0 | NO | NULL |
| 3 | htpfdescri | character varying | 30 | NO | NULL |
| 4 | htpfsrfcod | character | 1 | NO | NULL |
| 5 | htpftipasie | numeric | 5,0 | NO | NULL |
| 6 | htpfhstusu | character varying | 10 | NO | ' '::character varying |
| 7 | htpfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### histipfraude
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htipfraid | numeric | 5,0 | NO | NULL |
| 2 | htipfratxtid | numeric | 10,0 | NO | NULL |
| 3 | htipfrahstusu | character varying | 10 | NO | ''::character varying |
| 4 | htipfrahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | htipfratddesc | character varying | 1000 | NO | NULL |
| 6 | htipfraidioma | character | 2 | NO | 'es'::bpchar |
| 7 | histipclandes | character | 1 | YES | NULL |

### histipobonif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htbid | numeric | 5,0 | NO | NULL |
| 2 | htbexpid | numeric | 5,0 | NO | NULL |
| 3 | htbtxtid | numeric | 10,0 | NO | NULL |
| 4 | htbfecini | date |  | NO | NULL |
| 5 | htbfecfin | date |  | YES | NULL |
| 6 | htbdiasbonif | numeric | 5,0 | YES | NULL |
| 7 | htbdiasnotifvenc | numeric | 5,0 | YES | NULL |
| 8 | htbfacimpagadas | numeric | 5,0 | YES | NULL |
| 9 | htbprsid | numeric | 10,0 | YES | NULL |
| 10 | htbdiasaprob | numeric | 5,0 | YES | NULL |
| 11 | htbsniniaprob | character | 1 | NO | 'N'::bpchar |
| 12 | htbusocod | numeric | 5,0 | YES | NULL |
| 13 | htbconceidmod | numeric | 5,0 | YES | NULL |
| 14 | htbtiptidmod | numeric | 5,0 | YES | NULL |
| 15 | htbaplicacion | numeric | 5,0 | NO | 0 |
| 16 | htbconceidasig | numeric | 5,0 | YES | NULL |
| 17 | htbtiptidasig | numeric | 5,0 | YES | NULL |
| 18 | htbsncambtarif | character | 1 | NO | 'N'::bpchar |
| 19 | htbhstusu | character varying | 10 | NO | NULL |
| 20 | htbhsthora | timestamp without time zone |  | NO | NULL |
| 21 | htbnumvar | numeric | 10,0 | YES | NULL |
| 22 | htbdesc | character varying | 1000 | NO | ''::character varying |
| 23 | htbidioma | character | 2 | NO | ' '::bpchar |

### histipobonifdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htbdtbid | numeric | 5,0 | NO | NULL |
| 2 | htbddconid | numeric | 10,0 | NO | NULL |
| 3 | htbdsnactivo | character | 1 | NO | NULL |
| 4 | htbdsnobligat | character | 1 | NO | NULL |
| 5 | htbdhstusu | character varying | 10 | NO | NULL |
| 6 | htbdhsthora | timestamp without time zone |  | NO | NULL |

### histipoconcep
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htconid | numeric | 5,0 | NO | NULL |
| 2 | htcontxtid | numeric | 10,0 | NO | NULL |
| 3 | htconhstusu | character varying | 10 | NO | ' '::character varying |
| 4 | htconhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | htcontddesc | character varying | 1000 | NO | NULL |
| 6 | htconidioma | character | 2 | NO | 'es'::bpchar |
| 7 | htconrcuid | numeric | 5,0 | YES | 0 |
| 8 | htconsncargodemora | character | 1 | YES | NULL |
| 9 | htconsnintdem | character | 1 | NO | 'N'::bpchar |
| 10 | htconsnintfrac | character | 1 | NO | 'N'::bpchar |
| 11 | htconsnfacdiferida | character varying | 1 | YES | NULL |
| 12 | htconsncargored | character | 1 | YES | NULL |
| 13 | htconsncreditored | character | 1 | YES | NULL |

### histipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htctclsccod | character | 2 | NO | NULL |
| 2 | htctcod | character | 2 | NO | NULL |
| 3 | htctdesc | character varying | 30 | NO | NULL |
| 4 | htctcalimm | numeric | 5,0 | YES | NULL |
| 5 | htctmarca | numeric | 5,0 | NO | NULL |
| 6 | htctmodelo | numeric | 5,0 | NO | NULL |
| 7 | htctformato | numeric | 5,0 | NO | NULL |
| 8 | htcttipclie | character varying | 30 | YES | NULL |
| 9 | htctperid | character varying | 30 | YES | NULL |
| 10 | htctactivo | character | 1 | NO | NULL |
| 11 | htctobras | character | 1 | NO | NULL |
| 12 | htcttpsid | numeric | 5,0 | YES | NULL |
| 13 | htctcedula | character | 1 | NO | NULL |
| 14 | htctcontcedido | character | 1 | NO | NULL |
| 15 | htctdocsubr | character | 1 | NO | NULL |
| 16 | htcthstusu | character varying | 10 | NO | ' '::character varying |
| 17 | htcthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 18 | htctmoddesc | character varying | 30 | NO | NULL |
| 19 | htcttpsdesc | character varying | 40 | NO | NULL |

### histipocontratcn
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htctcod | numeric | 10,0 | NO | NULL |
| 2 | htcttxtid | numeric | 10,0 | NO | NULL |
| 3 | htctsnactivo | character | 1 | NO | NULL |
| 4 | htctexpid | numeric | 5,0 | NO | NULL |
| 5 | htctclsccod | character | 2 | NO | NULL |
| 6 | htctsncontcedido | character | 1 | NO | NULL |
| 7 | htcttpsid | numeric | 5,0 | NO | NULL |
| 8 | htcttetid | numeric | 5,0 | NO | NULL |
| 9 | htctcodsperi | character | 30 | YES | NULL |
| 10 | htctcodstcli | character | 30 | YES | NULL |
| 11 | htctsnformal | character | 1 | NO | NULL |
| 12 | htctsnobras | character | 1 | NO | NULL |
| 13 | htctmarcid | numeric | 5,0 | YES | NULL |
| 14 | htctmodid | numeric | 5,0 | YES | NULL |
| 15 | htctcalimm | numeric | 5,0 | YES | NULL |
| 16 | htctprsid | numeric | 10,0 | YES | NULL |
| 17 | htctdiasaprob | numeric | 5,0 | YES | NULL |
| 18 | htctcntrtpdid | numeric | 5,0 | YES | NULL |
| 19 | htctcntrcopias | numeric | 5,0 | YES | NULL |
| 20 | htctsubrtpdid | numeric | 5,0 | YES | NULL |
| 21 | htctsubrcopias | numeric | 5,0 | YES | NULL |
| 22 | htctbajatpdid | numeric | 5,0 | YES | NULL |
| 23 | htctbajacopias | numeric | 5,0 | YES | NULL |
| 24 | htcthstusu | character varying | 10 | NO | NULL |
| 25 | htcthsthora | timestamp without time zone |  | NO | NULL |
| 26 | htctactidef | numeric | 5,0 | YES | NULL |
| 27 | htctsndatosexp | character | 1 | NO | 'N'::bpchar |
| 28 | htctsnfecescr | character | 1 | NO | 'N'::bpchar |
| 29 | htctsnmostrcntant | character | 1 | NO | 'N'::bpchar |
| 30 | htctsnesticer | character | 1 | NO | 'S'::bpchar |
| 31 | htctsnfactalta | character | 1 | NO | 'N'::bpchar |
| 32 | htctidioma | character | 2 | YES | NULL |
| 33 | htctdesc | character varying | 500 | YES | NULL |
| 34 | htctsnmsjalta | character | 1 | NO | 'N'::bpchar |
| 35 | htctsnmsjbaja | character | 1 | NO | 'N'::bpchar |
| 36 | htctsolcontrato | character | 1 | NO | 'N'::bpchar |
| 37 | htctsoltpdid | numeric | 5,0 | YES | NULL |
| 38 | htctsoltpoid | numeric | 5,0 | YES | NULL |
| 39 | htctsoldiascaduca | numeric | 5,0 | YES | NULL |

### histipocptocobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htccid | numeric | 5,0 | NO | NULL |
| 2 | htcctxtid | numeric | 10,0 | NO | NULL |
| 3 | htcchstusu | character varying | 10 | NO | NULL |
| 4 | htcchsthora | timestamp without time zone |  | NO | NULL |
| 5 | hccobdescrip | character varying | 1000 | YES | NULL |
| 6 | htccidioma | character | 2 | YES | NULL |

### histipocsc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htcsid | numeric | 5,0 | NO | NULL |
| 2 | htcstxtid | numeric | 10,0 | NO | NULL |
| 3 | htcstpnif | numeric | 5,0 | NO | NULL |
| 4 | htcshstusu | character varying | 10 | NO | NULL |
| 5 | htcshsthora | timestamp without time zone |  | NO | NULL |
| 6 | htcstddesc | character varying | 1000 | YES | NULL |
| 7 | htcstdidicod | character | 2 | YES | NULL |

### histipodocumento
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htpdid | numeric | 5,0 | NO | NULL |
| 2 | htpddescri | character varying | 60 | NO | NULL |
| 3 | htpdtipo | numeric | 5,0 | NO | NULL |
| 4 | htpdsnimpext | character | 1 | NO | NULL |
| 5 | htpdgdoid | numeric | 5,0 | NO | NULL |
| 6 | htpdplantilla | character | 30 | NO | NULL |
| 7 | htpdsnarchivar | character | 1 | NO | NULL |
| 8 | htpdhstusu | character varying | 10 | NO | NULL |
| 9 | htpdhsthora | timestamp without time zone |  | NO | NULL |
| 10 | htpdidioma | character | 2 | YES | NULL |
| 11 | htpdplantillasms | character varying | 100 | YES | NULL |
| 12 | htpdplantillaemail | character varying | 100 | YES | NULL |
| 13 | htpdplantillapush | character varying | 30 | YES | NULL |
| 14 | htpdsnfirelec | character | 1 | NO | 'N'::bpchar |
| 15 | htpdsnadjdig | character | 1 | NO | 'N'::bpchar |
| 17 | htpdtpmodel | numeric | 5,0 | YES | NULL |
| 18 | htpdtpdocum | numeric | 5,0 | YES | NULL |
| 19 | htpdenvscorr | character | 1 | NO | 'N'::bpchar |
| 20 | htpdsncertdig | character | 1 | NO | 'N'::bpchar |
| 21 | htpdsnalarmatelelect | character | 1 | YES | NULL |
| 22 | htpdsncarsnarec | character | 1 | YES | NULL |
| 23 | htpdsndirenvnstd | character | 1 | YES | NULL |

### histipoelem
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htlmcod | character varying | 5 | NO | NULL |
| 2 | htlmdescrip | character varying | 30 | NO | NULL |
| 3 | htlmhstusu | character varying | 10 | NO | NULL |
| 4 | htlmhsthora | timestamp without time zone |  | NO | NULL |

### histipolicver
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htlvid | numeric | 5,0 | NO | NULL |
| 2 | htlvtxtid | numeric | 10,0 | NO | NULL |
| 3 | htlvmesesflim | numeric | 5,0 | NO | NULL |
| 4 | htlvsnrefer | character | 1 | NO | NULL |
| 5 | htlvhstusu | character varying | 10 | NO | NULL |
| 6 | htlvhsthora | timestamp without time zone |  | NO | NULL |

### histipomensaj
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htmenid | numeric | 10,0 | NO | NULL |
| 2 | htmentddesc | character varying | 1000 | YES | NULL |
| 3 | htmenidicod | character | 2 | YES | NULL |
| 4 | htmenfaplic | numeric | 5,0 | NO | NULL |
| 5 | htmenactivo | character | 1 | NO | 'S'::bpchar |
| 6 | htmensectorial | character | 1 | NO | 'S'::bpchar |
| 7 | htmensdesccort | character varying | 30 | NO | NULL::character varying |
| 8 | htmensexpid | numeric | 5,0 | YES | NULL |
| 9 | htmensnpubl | character | 1 | NO | 'N'::bpchar |
| 10 | htmensncontad | character | 1 | NO | 'N'::bpchar |
| 11 | htmensncesiond | character | 1 | NO | 'N'::bpchar |
| 12 | htmencodenc | numeric | 5,0 | YES | NULL |
| 13 | htmensnasociar | character | 1 | NO | 'N'::bpchar |
| 14 | htmenhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 15 | htmenhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 16 | htmensnfacturabaja | character | 1 | NO | 'N'::bpchar |

### histipooficina
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htofid | numeric | 5,0 | NO | NULL |
| 2 | htofdescri | character varying | 20 | NO | NULL |
| 3 | htofsnpresen | character | 1 | NO | NULL |
| 4 | htofsngestpda | character | 1 | NO | NULL |
| 5 | htofhstusu | character varying | 10 | NO | NULL |
| 6 | htofhsthora | timestamp without time zone |  | NO | NULL |
| 7 | htofidioma | character | 2 | YES | NULL |

### histiporegulf
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htrgid | numeric | 5,0 | NO | NULL |
| 2 | htrgdesc | character varying | 50 | NO | NULL |
| 3 | htrgcompcli | numeric | 5,0 | YES | NULL |
| 4 | htrgtconid | numeric | 5,0 | YES | NULL |
| 5 | htrgtsubid | numeric | 5,0 | YES | NULL |
| 6 | htrgtmenid | numeric | 10,0 | YES | NULL |
| 7 | htrgimporte | numeric | 18,2 | YES | NULL |
| 8 | htrgcantidad | numeric | 5,0 | YES | NULL |
| 9 | htrgbonificar | character | 1 | NO | NULL |
| 10 | htrgsnparcial | character | 1 | NO | NULL |
| 11 | htrgsnnocons | character | 1 | NO | NULL |
| 12 | htrghstusu | character varying | 10 | NO | NULL |
| 13 | htrghsthora | timestamp without time zone |  | NO | NULL |
| 14 | htrgexpid | numeric | 5,0 | NO | NULL |
| 15 | htrgtxtestandar | character | 1 | NO | 'S'::bpchar |
| 16 | htrgtxtid | numeric | 10,0 | YES | NULL |
| 17 | htrgsnfichext | character | 1 | NO | NULL |
| 18 | htrgtddesc | character varying | 1000 | YES | NULL |
| 19 | htrgtdidicod | character | 2 | YES | NULL |

### histiporelps
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htrpid | numeric | 5,0 | NO | NULL |
| 2 | htrpmetodo | character varying | 512 | NO | NULL |
| 3 | htrptxtid | numeric | 10,0 | NO | NULL |
| 4 | htrpsnrepcons | character | 1 | NO | NULL |
| 5 | htrptmenid | numeric | 10,0 | YES | NULL |
| 6 | htrptpmendet | numeric | 10,0 | YES | NULL |
| 7 | htrphstusu | character varying | 10 | NO | NULL |
| 8 | htrphsthora | timestamp without time zone |  | NO | NULL |
| 9 | htrpdescrip | character varying | 1000 | YES | NULL |
| 10 | htrpidioma | character | 2 | YES | NULL |

### histiposoci
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htsocid | numeric | 5,0 | NO | NULL |
| 2 | htsocdescri | character varying | 60 | NO | NULL |
| 3 | htsocsiglas | character varying | 10 | YES | NULL |
| 4 | htsochstusu | character varying | 10 | NO | NULL |
| 5 | htsochsthora | timestamp without time zone |  | NO | NULL |
| 6 | htsocidioma | character | 2 | YES | NULL |

### histiposubcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htsubid | numeric | 5,0 | NO | NULL |
| 2 | htsubtxtid | numeric | 10,0 | NO | NULL |
| 3 | tsubsnconsumo | character | 1 | NO | 'S'::bpchar |
| 4 | htsubhstusu | character varying | 10 | NO | ' '::character varying |
| 5 | htsubhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 6 | htsubdescrip | character varying | 1000 | NO | NULL |
| 7 | htsubidioma | character | 2 | NO | 'es'::bpchar |
| 8 | htsubsnnosumacons | character | 1 | NO | 'S'::bpchar |
| 9 | htsubfactlectvalidas | character | 1 | YES | NULL |
| 10 | htsubrcuid | numeric | 5,0 | YES | 0 |

### histiposucsif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htssifpkhis | numeric | 10,0 | YES | NULL |
| 2 | htssifid | numeric | 5,0 | YES | NULL |
| 3 | htssiftipo | numeric | 5,0 | YES | NULL |
| 4 | htssifidioma | character | 2 | YES | NULL |
| 5 | htssiftddesc | character varying | 1000 | YES | NULL |
| 6 | htssifhstusu | character varying | 10 | YES | 'CONVERSION'::character varying |
| 7 | htssifhsthora | timestamp without time zone |  | YES | CURRENT_TIMESTAMP |

### histiposumin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htsumid | numeric | 5,0 | NO | NULL |
| 2 | htsumtxtid | numeric | 10,0 | NO | NULL |
| 3 | htsumlecper | character | 1 | NO | NULL |
| 4 | htsuminscon | character | 1 | NO | NULL |
| 5 | htsumcaedad | character | 1 | NO | NULL |
| 6 | htsumhstusu | character varying | 10 | NO | ' '::character varying |
| 7 | htsumhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 8 | htsumfactper | character | 1 | NO | NULL |
| 9 | htsumneccons | character | 1 | NO | NULL |
| 10 | htsumtpuid | numeric | 5,0 | YES | NULL |
| 11 | htsusngestint | character | 1 | NO | 'N'::bpchar |
| 12 | htsumtddesc | character varying | 1000 | YES | NULL |
| 13 | htsumtdidicod | character | 2 | YES | NULL |
| 14 | htsumsncortepos | character | 1 | NO | 'S'::bpchar |

### histipotarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htiptid | numeric | 5,0 | NO | NULL |
| 2 | htipttxtid | numeric | 10,0 | NO | NULL |
| 3 | htipthstusu | character varying | 10 | NO | ' '::character varying |
| 4 | htipthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | htipttddesc | character varying | 1000 | YES | NULL |
| 6 | htiptidicod | character | 2 | YES | NULL |
| 7 | htiptrcuid | numeric | 5,0 | NO | 0 |
| 8 | htipvarid | numeric | 5,0 | YES | NULL |

### histipounidad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htpuid | numeric | 5,0 | NO | NULL |
| 2 | htputxtid | numeric | 10,0 | NO | NULL |
| 3 | htpudesccort | numeric | 10,0 | NO | NULL |
| 4 | htputipodato | numeric | 5,0 | NO | NULL |
| 5 | htpudecimales | numeric | 5,0 | YES | NULL |
| 6 | htpuorigen | numeric | 5,0 | NO | NULL |
| 7 | htpuoperacion | numeric | 5,0 | YES | NULL |
| 8 | htpuoperando1 | numeric | 5,0 | YES | NULL |
| 9 | htpuoperando2 | numeric | 5,0 | YES | NULL |
| 10 | htpuhstusu | character varying | 10 | NO | NULL |
| 11 | htpuhsthora | timestamp without time zone |  | NO | NULL |
| 12 | htpudescrip | character varying | 1000 | NO | NULL |
| 13 | htpudescripcort | character varying | 1000 | NO | NULL |
| 14 | htpuidioma | character | 2 | NO | NULL |

### histipovarbonif
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htvbtbid | numeric | 5,0 | NO | NULL |
| 2 | htvbtpvid | numeric | 5,0 | NO | NULL |
| 3 | htvbvaldef | character | 10 | NO | NULL |
| 4 | htvbhstusu | character varying | 10 | NO | NULL |
| 5 | htvbhsthora | timestamp without time zone |  | NO | NULL |

### histipovarcontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htvctctcod | numeric | 10,0 | NO | NULL |
| 2 | htvctpvid | numeric | 5,0 | NO | NULL |
| 3 | htvcsnoblig | character | 1 | NO | NULL |
| 4 | htvcvaldef | character | 10 | YES | NULL |
| 5 | htvcgvcgrupo | numeric | 5,0 | YES | NULL |
| 6 | htvchstusu | character varying | 10 | NO | NULL |
| 7 | htvchsthora | timestamp without time zone |  | NO | NULL |

### histipovariable
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htpvid | numeric | 5,0 | NO | NULL |
| 2 | htpvtxtid | numeric | 10,0 | NO | NULL |
| 3 | htpvdesccort | numeric | 10,0 | NO | NULL |
| 4 | htpvtipodato | numeric | 5,0 | NO | NULL |
| 5 | htpvdecimales | numeric | 5,0 | YES | NULL |
| 6 | htpvorigen | numeric | 5,0 | NO | NULL |
| 7 | htpvoperacion | numeric | 5,0 | YES | NULL |
| 8 | htpvoperando1 | numeric | 5,0 | YES | NULL |
| 9 | htpvoperando2 | numeric | 5,0 | YES | NULL |
| 10 | htpventsan | numeric | 10,0 | YES | NULL |
| 11 | htpvrefentsan | numeric | 5,0 | YES | NULL |
| 12 | htpvhstusu | character varying | 10 | NO | NULL |
| 13 | htpvhsthora | timestamp without time zone |  | NO | NULL |
| 14 | htpvdescrip | character varying | 1000 | NO | NULL |
| 15 | htpvdescripcort | character varying | 1000 | NO | NULL |
| 16 | htpvidioma | character | 2 | NO | NULL |
| 17 | htpvconfecaplic | character | 1 | NO | 'N'::bpchar |

### histipovia
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htviaid | numeric | 5,0 | NO | NULL |
| 2 | htviacod | character | 4 | NO | NULL |
| 3 | htviadesc | character varying | 25 | NO | NULL |
| 4 | htviaposicion | character | 1 | NO | 'A'::bpchar |
| 5 | htviahstusu | character varying | 10 | NO | NULL |
| 6 | htviahsthora | timestamp without time zone |  | NO | NULL |
| 7 | htviaidioma | character | 2 | YES | NULL |

### histmptx
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | txidreg | numeric | 10,0 | NO | NULL |
| 2 | txidregpadre | numeric | 10,0 | YES | NULL |
| 3 | txdesc | character varying | 100 | NO | NULL |
| 4 | txparams | character varying | 1000 | YES | NULL |
| 5 | txhorareg | timestamp without time zone |  | NO | NULL |
| 6 | txsnproc | character | 1 | NO | NULL |
| 7 | txclasegp | character varying | 200 | YES | NULL |
| 8 | txmetodogp | character varying | 100 | YES | NULL |
| 9 | txparamsundo | character varying | 3000 | YES | NULL |
| 10 | txestado | numeric | 5,0 | NO | 0 |
| 11 | txusuario | character | 10 | YES | NULL |

### histpcontacto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htctid | numeric | 5,0 | NO | NULL |
| 2 | htcttxtid | numeric | 10,0 | NO | NULL |
| 3 | htcthstusu | character varying | 10 | NO | NULL |
| 4 | htcthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | htcttddesc | character varying | 1000 | NO | NULL |
| 6 | htctidioma | character | 2 | NO | 'es'::bpchar |

### histpfaccnt
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htfcnttnum | numeric | 10,0 | NO | NULL |
| 2 | htftipfact | numeric | 5,0 | NO | NULL |
| 3 | htfusuario | character | 10 | NO | NULL |
| 4 | htffecha | timestamp without time zone |  | NO | NULL |
| 5 | htfacciocod | character varying | 1 | NO | 'A'::character varying |
| 6 | htfcanal | character varying | 2 | NO | 'AQ'::character varying |
| 7 | htftipenv | numeric | 5,0 | YES | NULL |

### histpimpusoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htisapiid | numeric | 5,0 | NO | NULL |
| 2 | htissocid | numeric | 10,0 | NO | NULL |
| 3 | htiswtipo | character | 1 | NO | NULL |
| 4 | htiscodigo | character | 2 | NO | NULL |
| 5 | htishstusu | character varying | 10 | NO | NULL |
| 6 | htishsthora | timestamp without time zone |  | NO | NULL |

### histpofccquipu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htoqtofid | numeric | 5,0 | NO | NULL |
| 2 | htoqtgcar | numeric | 5,0 | NO | NULL |
| 3 | htoqccqcod | character | 4 | NO | NULL |
| 4 | htoqusuario | character varying | 10 | NO | NULL |
| 5 | htoqfecha | timestamp without time zone |  | NO | NULL |

### histraduccion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htrdtipo | numeric | 5,0 | NO | NULL |
| 2 | htrdclave | character varying | 100 | NO | NULL |
| 3 | htrdforma | character varying | 20 | NO | NULL |
| 4 | htrdidicod | character | 2 | NO | NULL |
| 5 | htrdtexto | character varying | 50 | NO | ' '::character varying |
| 6 | htrdhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 7 | htrdhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### histramoestim
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | htrmeexpid | numeric | 5,0 | NO | NULL |
| 2 | htrmeperiid | numeric | 5,0 | NO | NULL |
| 3 | htrmeliminf | numeric | 10,0 | NO | NULL |
| 4 | htrmelimsup | numeric | 10,0 | YES | NULL |
| 5 | htrmeporcinf | numeric | 5,0 | NO | NULL |
| 6 | htrmeporcsup | numeric | 5,0 | NO | NULL |
| 7 | htrmeacosup | numeric | 10,0 | YES | NULL |
| 8 | htrmehstusu | character varying | 10 | NO | NULL |
| 9 | htrmehsthora | timestamp without time zone |  | NO | NULL |

### hisusuario
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | husuid | character varying | 10 | NO | NULL |
| 2 | husudptid | numeric | 5,0 | NO | NULL |
| 3 | husudesc | character varying | 40 | NO | NULL |
| 4 | husuvent | numeric | 5,0 | YES | NULL |
| 5 | husuactivo | character | 1 | NO | NULL |
| 6 | husuemail | character varying | 100 | YES | NULL |
| 7 | husuidioma | character | 2 | NO | NULL |
| 8 | hususnprmof | character | 1 | NO | NULL |
| 9 | husulogin | character varying | 30 | NO | NULL |
| 10 | husutipo | numeric | 5,0 | NO | NULL |
| 11 | husubloqueado | character | 1 | NO | NULL |
| 12 | husuhstusu | character varying | 10 | NO | NULL |
| 13 | husuhsthora | timestamp without time zone |  | NO | NULL |
| 14 | husunumempl | character varying | 20 | YES | NULL |
| 15 | husupuesto | character varying | 40 | YES | NULL |
| 16 | husutipohojacalculo | numeric | 5,0 | NO | '1'::numeric |
| 17 | husudobleauten | character | 1 | NO | 'N'::bpchar |
| 18 | husuemailauten | character varying | 100 | YES | NULL |

### hisusuexplo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | huexusuid | character varying | 10 | NO | NULL |
| 2 | huexexpid | numeric | 5,0 | NO | NULL |
| 3 | huexaccion | character | 1 | NO | NULL |
| 4 | huexhstusu | character varying | 10 | NO | NULL |
| 5 | huexhsthora | timestamp without time zone |  | NO | NULL |

### hisusuoficina
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | huofiusuid | character varying | 10 | NO | NULL |
| 2 | huofiofiid | numeric | 5,0 | NO | NULL |
| 3 | huofiaccion | character | 1 | NO | NULL |
| 4 | huofihstusu | character varying | 10 | NO | NULL |
| 5 | huofihsthora | timestamp without time zone |  | NO | NULL |

### hisusuperfil
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | huperusuid | character varying | 10 | NO | NULL |
| 2 | huperperfid | numeric | 5,0 | NO | NULL |
| 3 | huperaccion | character | 1 | NO | NULL |
| 4 | huperhstusu | character varying | 10 | NO | NULL |
| 5 | huperhsthora | timestamp without time zone |  | NO | NULL |

### hisusupermiso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | huspusuid | character varying | 10 | NO | NULL |
| 2 | huspfuncod | character varying | 50 | NO | NULL |
| 3 | husptipoper | numeric | 5,0 | YES | NULL |
| 4 | huspaccion | character | 1 | NO | NULL |
| 5 | husptipoperant | numeric | 5,0 | YES | NULL |
| 6 | husphstusu | character varying | 10 | NO | NULL |
| 7 | husphsthora | timestamp without time zone |  | NO | NULL |

### hisususociedad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | husocusuid | character varying | 10 | NO | NULL |
| 2 | husocsocid | numeric | 10,0 | NO | NULL |
| 3 | husocaccion | character | 1 | NO | NULL |
| 4 | husochstusu | character varying | 10 | NO | NULL |
| 5 | husochsthora | timestamp without time zone |  | NO | NULL |

### hisvariable
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hvarid | numeric | 10,0 | NO | NULL |
| 2 | hvartpvid | numeric | 5,0 | NO | NULL |
| 3 | hvarcnttnum | numeric | 10,0 | YES | NULL |
| 4 | hvarpocid | numeric | 10,0 | YES | NULL |
| 5 | hvarptosid | numeric | 10,0 | YES | NULL |
| 6 | hvarvalnum | numeric | 24,6 | YES | NULL |
| 7 | hvarvalchar | character | 20 | YES | NULL |
| 8 | hvarvalfec | date |  | YES | NULL |
| 9 | hvarvalbool | character | 1 | YES | NULL |
| 10 | hvarhstusu | character varying | 10 | NO | NULL |
| 11 | hvarhsthora | timestamp without time zone |  | NO | NULL |
| 12 | hvarhstmodif | character | 1 | NO | 'M'::bpchar |
| 13 | hvarfecini | date |  | YES | NULL |
| 14 | hvarfecfin | date |  | YES | NULL |

### hisviatipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hvtctctcod | numeric | 10,0 | NO | NULL |
| 2 | hvtcviacod | character | 2 | NO | NULL |
| 3 | hvtcsnselccont | character | 1 | NO | NULL |
| 4 | hvtcsnselclec | character | 1 | NO | NULL |
| 5 | hvtctpdid | numeric | 5,0 | YES | NULL |
| 6 | hvtchstusu | character varying | 10 | NO | NULL |
| 7 | hvtchsthora | timestamp without time zone |  | NO | NULL |
| 8 | hvtctpoidsc | numeric | 5,0 | YES | NULL |
| 9 | hvtctpoidcnv | numeric | 5,0 | YES | NULL |
| 10 | hvtctpoidprec | numeric | 5,0 | YES | NULL |
| 11 | hvtctpoidnprec | numeric | 5,0 | YES | NULL |
| 12 | hvtcsnhabit | character | 1 | NO | 'N'::bpchar |
| 13 | hvtcsncaldef | character | 1 | NO | 'N'::bpchar |
| 14 | hvtcsnlicpriocu | character | 1 | NO | 'N'::bpchar |
| 15 | hvtcsnboletin | character | 1 | NO | 'N'::bpchar |
| 16 | hvtcsnlicsegocu | character | 1 | NO | 'N'::bpchar |
| 17 | hvtcsnrefcat | character | 1 | NO | 'N'::bpchar |
| 18 | hvtcsnhabitobl | character | 1 | NO | 'N'::bpchar |
| 19 | hvtcsncaldefobl | character | 1 | NO | 'N'::bpchar |
| 20 | hvtcsnlicpriocuobl | character | 1 | NO | 'N'::bpchar |
| 21 | hvtcsnboletinobl | character | 1 | NO | 'N'::bpchar |
| 22 | hvtcsnlicsegocuobl | character | 1 | NO | 'N'::bpchar |
| 23 | hvtcsnrefcatobl | character | 1 | NO | 'N'::bpchar |
| 24 | hvtcsnselvar | character | 1 | NO | 'S'::bpchar |
| 25 | hvtcsnselclau | character | 1 | NO | 'S'::bpchar |
| 26 | hvtcsnactfactpdf | character | 1 | NO | 'N'::bpchar |

### hub
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|---------|
| 1 | hubid | numeric | 5,0 | NO | NULL |
| 2 | hubdesc | character varying | 100 | NO | NULL |
| 3 | hubactivo | character | 1 | NO | 'N'::bpchar |
| 4 | hubtipo | character varying | 10 | NO | ' '::character varying |
| 5 | hubincrustarpdf | character | 1 | NO | 'N'::bpchar |
