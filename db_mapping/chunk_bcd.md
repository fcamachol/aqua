# Database Map - Tables B*, C*, D*
## Schema: cf_quere_pro

**Total tables in this chunk: 254**

### bajabonificacion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bbfbleid | numeric | 10,0 | NO | NULL |
| 2 | bbsbid | numeric | 10,0 | NO | NULL |
| 3 | bbcnttnum | numeric | 10,0 | NO | NULL |
| 4 | bbaplicacion | numeric | 5,0 | NO | NULL |
| 5 | bbfecini | date |  | YES | NULL |
| 6 | bbfecfin | date |  | YES | NULL |
| 7 | bbvardel | numeric | 5,0 | YES | NULL |
| 8 | bbexpdid | numeric | 5,0 | YES | NULL |
| 9 | bbcptodel | numeric | 5,0 | YES | NULL |
| 10 | bbtariddel | numeric | 5,0 | YES | NULL |
| 11 | bbctponew | numeric | 5,0 | YES | NULL |
| 12 | bbtaridnew | numeric | 5,0 | YES | NULL |
| 13 | bbfecfinbonif | date |  | YES | NULL |
| 14 | bbfecinitar | date |  | YES | NULL |

### banco
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | banid | numeric | 5,0 | NO | NULL |
| 2 | bandesc | character varying | 40 | NO | NULL |
| 3 | bandesvent | character varying | 15 | NO | NULL |
| 4 | bancaja | character | 1 | NO | NULL |
| 5 | banindblk | numeric | 5,0 | NO | NULL |
| 6 | bansnavidvtarj | character | 1 | NO | 'N'::bpchar |
| 7 | banbiccod | character | 4 | YES | NULL |
| 8 | banbabid | numeric | 5,0 | YES | NULL |
| 9 | banactivo | character | 1 | NO | 'S'::bpchar |
| 10 | banabrev | character varying | 15 | YES | NULL |

### bancogestor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bngsocprsid | numeric | 10,0 | NO | NULL |
| 2 | bngbanid | numeric | 5,0 | NO | NULL |
| 3 | bngpercont | character varying | 27 | YES | NULL |
| 4 | bngtelef | character varying | 16 | YES | NULL |
| 5 | bngsufijo | numeric | 3,0 | YES | NULL |
| 6 | bngcremesa | numeric | 18,2 | YES | NULL |
| 7 | bngcdevol | numeric | 18,2 | YES | NULL |
| 8 | bngcdomic | numeric | 18,2 | YES | NULL |
| 9 | bngcvenban | numeric | 18,2 | YES | NULL |
| 10 | bnghstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 11 | bnghsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 12 | bngsndefrem | character | 1 | NO | 'N'::bpchar |
| 13 | bngdiaspradesepa | numeric | 5,0 | NO | 0 |
| 14 | bngdiassigadesepa | numeric | 5,0 | NO | 0 |
| 15 | bngdiasemiremabono | numeric | 5,0 | NO | 0 |
| 16 | bngformxmlrem | numeric | 5,0 | NO | 0 |
| 17 | bngvalxmlrem | character | 1 | NO | 'N'::bpchar |
| 18 | bngformxmltrf | numeric | 5,0 | NO | 0 |
| 19 | bngvalxmltrf | character | 1 | NO | 'N'::bpchar |
| 20 | bngtipoplataf | numeric | 5,0 | NO | 1 |

### bancoremabono
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | brabngsocprsid | numeric | 10,0 | NO | NULL |
| 2 | brabngbanid | numeric | 5,0 | NO | NULL |
| 3 | brabanid | numeric | 5,0 | NO | NULL |

### barrio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | barrid | numeric | 5,0 | NO | NULL |
| 2 | barrlocid | numeric | 10,0 | NO | NULL |
| 3 | barrnombre | character varying | 100 | NO | NULL |
| 4 | barrhstusu | character varying | 10 | YES | NULL |
| 5 | barrhsthora | timestamp without time zone |  | YES | NULL |
| 6 | barrtipobarrio | character varying | 30 | YES | NULL |

### bitacora_beneficio_350
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_bitacora_beneficio_350 | integer | 32,0 | NO | nextval('id_bitacora_beneficio_350_seq'::regclass) |
| 2 | contrato | numeric |  | YES | NULL |
| 3 | saldobeneficioactual | numeric | 18,2 | YES | NULL |
| 4 | zona | character varying |  | YES | NULL |
| 5 | explotacion | numeric |  | YES | NULL |
| 6 | estatusbeneficio | character varying |  | YES | NULL |
| 7 | fecha_carga | timestamp without time zone |  | YES | NULL |
| 8 | fecha_aplicacion | timestamp without time zone |  | YES | NULL |
| 9 | tipo_contrato | character varying |  | YES | NULL |
| 10 | tipo_servicio | character varying |  | YES | NULL |
| 11 | colonia | character varying |  | YES | NULL |
| 12 | usuario_carga | character varying |  | YES | NULL |
| 13 | usuario_factura | character varying |  | YES | NULL |
| 14 | id_gescartera | numeric |  | YES | NULL |
| 15 | id_opecargest | numeric |  | YES | NULL |
| 16 | id_opedesglos | numeric |  | YES | NULL |
| 17 | id_movccontrato | numeric |  | YES | NULL |

### bitacora_beneficio_500
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_bitacora_beneficio_500 | integer | 32,0 | NO | nextval('id_bitacora_beneficio_500_seq'::regclass) |
| 2 | contrato | numeric |  | YES | NULL |
| 3 | saldobeneficioactual | numeric | 18,2 | YES | NULL |
| 4 | zona | character varying |  | YES | NULL |
| 5 | explotacion | numeric |  | YES | NULL |
| 6 | estatusbeneficio | character varying |  | YES | NULL |
| 7 | fecha_carga | timestamp without time zone |  | YES | NULL |
| 8 | fecha_aplicacion | timestamp without time zone |  | YES | NULL |
| 9 | tipo_contrato | character varying |  | YES | NULL |
| 10 | tipo_servicio | character varying |  | YES | NULL |
| 11 | colonia | character varying |  | YES | NULL |
| 12 | usuario_carga | character varying |  | YES | NULL |
| 13 | usuario_factura | character varying |  | YES | NULL |
| 14 | id_gescartera | numeric |  | YES | NULL |
| 15 | id_opecargest | numeric |  | YES | NULL |
| 16 | id_opedesglos | numeric |  | YES | NULL |
| 17 | id_movccontrato | numeric |  | YES | NULL |

### bitacora_facturas_reposicion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_bitacora_fact_rep | integer | 32,0 | NO | NULL |
| 2 | id_contrato | numeric |  | YES | NULL |
| 3 | id_orden | numeric |  | YES | NULL |
| 4 | id_estado_orden | numeric |  | YES | NULL |
| 5 | id_punto_servicio | numeric |  | YES | NULL |
| 6 | id_estado_punto_servicio | numeric |  | YES | NULL |
| 7 | id_gestion_reclamacion | numeric |  | YES | NULL |
| 8 | fecha_corte | date |  | YES | NULL |
| 9 | fecha_modificacion | timestamp without time zone |  | YES | NULL |
| 10 | usuario_orden | character varying |  | YES | NULL |
| 11 | id_factura | numeric |  | YES | NULL |

### bloqueofact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bqfid | numeric | 10,0 | NO | NULL |
| 2 | bqfexpid | numeric | 5,0 | NO | NULL |
| 3 | bqftconid | numeric | 5,0 | NO | NULL |
| 4 | bqfanno | numeric | 5,0 | NO | NULL |
| 5 | bqftipovar | numeric | 5,0 | YES | NULL |
| 6 | bqfestado | character | 1 | NO | 'P'::bpchar |
| 7 | bqftscreacion | timestamp without time zone |  | NO | NULL |
| 8 | bqfusucreacion | character varying | 10 | NO | NULL |
| 9 | bqftslibera | timestamp without time zone |  | YES | NULL |
| 10 | bqfusulibera | character varying | 10 | YES | NULL |
| 11 | bqftsfinpamv | timestamp without time zone |  | YES | NULL |
| 12 | bqfusufinpamv | character varying | 10 | YES | NULL |
| 13 | bqftsfinpctc | timestamp without time zone |  | YES | NULL |
| 14 | bqfusufinpctc | character varying | 10 | YES | NULL |

### bloqueofperiodo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bqpbqfid | numeric | 10,0 | NO | NULL |
| 2 | bqpperperiid | numeric | 5,0 | NO | NULL |
| 3 | bqppernumero | numeric | 5,0 | NO | NULL |

### bloqueresultadoproceso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bresid | numeric |  | NO | NULL |
| 2 | bresidentidad | numeric |  | NO | NULL |
| 3 | brestipoentidad | numeric |  | NO | NULL |
| 4 | bresresid | numeric |  | NO | NULL |

### boletin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bolid | numeric | 10,0 | NO | NULL |
| 2 | boltiin | character varying | 45 | NO | NULL |
| 3 | boldnii | character varying | 9 | NO | NULL |
| 4 | bolfebo | date |  | NO | NULL |
| 5 | bolnubo | character varying | 7 | NO | NULL |
| 6 | bolemsu | character | 4 | NO | NULL |
| 7 | bolnife | character varying | 9 | NO | NULL |
| 8 | bolnome | character varying | 50 | YES | NULL |
| 9 | bolnifi | character varying | 9 | NO | NULL |
| 10 | bolnomi | character varying | 50 | YES | NULL |
| 11 | bolprov | character | 2 | NO | NULL |
| 12 | bolmuni | character | 3 | NO | NULL |
| 13 | bolcodp | character | 2 | NO | NULL |
| 14 | bolcpos | character | 5 | NO | NULL |
| 15 | bolnomp | character varying | 45 | YES | NULL |
| 16 | boldir1 | character | 2 | YES | NULL |
| 17 | boldir2 | character varying | 45 | NO | NULL |
| 18 | boldir3 | character | 4 | YES | NULL |
| 19 | boldir4 | character | 2 | YES | NULL |
| 20 | boldir5 | character | 2 | YES | NULL |
| 21 | boldir6 | character varying | 45 | YES | NULL |
| 22 | boldir7 | character | 2 | YES | NULL |
| 23 | boldir8 | character | 2 | YES | NULL |
| 24 | boldir9 | character | 4 | YES | NULL |
| 25 | boltelf | character varying | 16 | YES | NULL |
| 26 | boltius | character | 5 | NO | NULL |
| 27 | bolnrc1 | character varying | 9 | YES | NULL |
| 28 | boldicg | character | 2 | YES | NULL |
| 29 | boldidp | character | 2 | YES | NULL |
| 30 | boldida | character | 2 | YES | NULL |
| 31 | boldita | character | 2 | YES | NULL |
| 32 | bollocg | character | 5 | YES | NULL |
| 33 | bollodp | character | 5 | YES | NULL |
| 34 | bolloda | character | 5 | YES | NULL |
| 35 | bollota | character | 5 | YES | NULL |
| 36 | bolmacg | character varying | 30 | YES | NULL |
| 37 | bolmadp | character varying | 30 | YES | NULL |
| 38 | bolmaaf | character varying | 30 | YES | NULL |
| 39 | bolmaac | character varying | 30 | YES | NULL |
| 40 | bolmata | character varying | 30 | YES | NULL |
| 41 | bolplvi | character | 3 | NO | NULL |
| 42 | bolpllo | character | 3 | NO | NULL |
| 43 | bolvipl | character | 3 | NO | NULL |
| 44 | boltotl | character | 3 | NO | NULL |
| 45 | bolsuma | character | 3 | NO | NULL |
| 46 | bolsumb | character | 3 | NO | NULL |
| 47 | bolsumc | character | 3 | NO | NULL |
| 48 | bolsumd | character | 3 | NO | NULL |
| 49 | bolsume | character | 3 | NO | NULL |
| 50 | boldibc | character | 2 | YES | NULL |
| 51 | boldicd | character | 2 | YES | NULL |
| 52 | boldias | character | 2 | YES | NULL |
| 53 | bollobc | character | 5 | YES | NULL |
| 54 | bollocd | character | 5 | YES | NULL |
| 55 | bolloas | character | 5 | YES | NULL |
| 56 | bolmabc | character varying | 30 | YES | NULL |
| 57 | bolmacd | character varying | 30 | YES | NULL |
| 58 | bolmaas | character varying | 30 | YES | NULL |
| 59 | boltisu | character | 1 | NO | NULL |
| 60 | bolliac | character varying | 100 | YES | NULL |
| 61 | bolbomo | character | 1 | YES | NULL |
| 62 | bolfecrec | timestamp without time zone |  | NO | NULL |

### bolgesttmk
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bgtid | numeric | 10,0 | NO | NULL |
| 2 | bgttgtmkid | numeric | 5,0 | NO | NULL |
| 3 | bgtpolnum | numeric | 10,0 | NO | NULL |
| 4 | bgtestado | numeric | 5,0 | NO | NULL |
| 5 | bgtfeccrea | timestamp without time zone |  | NO | NULL |
| 6 | bgtfecpxgt | timestamp without time zone |  | NO | NULL |
| 7 | bgtpriori | numeric | 5,0 | NO | NULL |
| 8 | bgtocgid | numeric | 10,0 | YES | NULL |
| 9 | bgttfbid | numeric | 5,0 | YES | NULL |
| 10 | bgtsnpago | character | 1 | NO | NULL |
| 11 | bgtfeccier | date |  | YES | NULL |
| 12 | bgtusuid | character varying | 10 | YES | NULL |
| 13 | bgtespera | timestamp without time zone |  | YES | NULL |

### bolpubtar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bptid | numeric | 5,0 | NO | NULL |
| 2 | bptexpid | numeric | 5,0 | NO | NULL |
| 3 | bptpubtexto | character | 50 | NO | NULL |
| 4 | bptfecha | date |  | NO | NULL |
| 5 | bpthstusu | character varying | 10 | NO | NULL |
| 6 | bpthsthora | timestamp without time zone |  | NO | NULL |

### bolsacambi
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | camptosid | numeric | 10,0 | NO | NULL |
| 2 | camfecpet | date |  | NO | NULL |
| 3 | camobscod | character | 2 | NO | NULL |
| 4 | camobserv | character varying | 400 | YES | NULL |
| 5 | cammesoptd | numeric | 5,0 | YES | NULL |
| 6 | cammesopth | numeric | 5,0 | YES | NULL |
| 7 | camfecsoli | date |  | YES | NULL |
| 8 | camestado | numeric | 5,0 | NO | NULL |
| 9 | camnumvisi | numeric | 5,0 | NO | NULL |
| 10 | camannocon | numeric | 5,0 | NO | NULL |
| 11 | camfeccita | date |  | YES | NULL |
| 12 | camhorcita | time without time zone |  | YES | NULL |
| 13 | camprior | numeric | 5,0 | NO | NULL |
| 14 | camfecreimp | timestamp without time zone |  | YES | NULL |
| 15 | camusureimp | character varying | 10 | YES | NULL |
| 16 | camgotid | character varying | 36 | YES | NULL |
| 17 | camtelec | character | 1 | NO | 'N'::bpchar |
| 18 | camtipotelec | numeric | 5,0 | YES | NULL |
| 19 | camtipofraude | numeric | 5,0 | YES | NULL |

### bolsacambioequipo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cameqptosid | numeric | 10,0 | NO | NULL |
| 2 | cameqfecpet | date |  | NO | NULL |
| 3 | cameqprior | numeric | 5,0 | NO | NULL |
| 4 | cameqanoeq | numeric | 5,0 | YES | NULL |
| 5 | cameqestado | numeric | 5,0 | NO | NULL |
| 6 | cameqnumvisi | numeric | 5,0 | NO | NULL |
| 7 | cameqfecsoli | date |  | YES | NULL |
| 8 | cameqfecreimp | timestamp without time zone |  | YES | NULL |
| 9 | camequsureimp | character varying | 10 | YES | NULL::character varying |
| 10 | cameqfeccita | date |  | YES | NULL |
| 11 | cameqhorcita | date |  | YES | NULL |
| 12 | cameqtipotelec | numeric | 5,0 | YES | NULL |
| 13 | cameqobserv | character varying | 400 | YES | NULL::character varying |
| 14 | cameqmantener | character | 1 | NO | 'N'::bpchar |
| 15 | cameqgotid | character varying | 36 | YES | NULL::character varying |
| 16 | cameqobscod | character | 2 | NO | NULL::bpchar |

### bolsacambioequipovisit
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bceqvptosid | numeric | 10,0 | NO | NULL |
| 2 | bceqvindice | numeric | 5,0 | NO | NULL |
| 3 | bceqvfecvisit | date |  | YES | NULL |
| 4 | bceqvcontcod | numeric | 5,0 | YES | NULL |
| 5 | bceqvoperid | numeric | 5,0 | YES | NULL |
| 6 | bceqvobserv | character varying | 400 | YES | NULL::character varying |

### bolsacambivisit
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bcvptosid | numeric | 10,0 | NO | NULL |
| 2 | bcvindice | numeric | 5,0 | NO | NULL |
| 3 | bcvfecvisit | date |  | YES | NULL |
| 4 | bcvcontcod | numeric | 5,0 | YES | NULL |
| 5 | bcvoperid | numeric | 5,0 | YES | NULL |
| 6 | bcvobserv | character varying | 400 | YES | NULL |

### bolsaconsumos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | blscpocid | numeric | 10,0 | NO | NULL |
| 2 | blsccnttnum | numeric | 10,0 | YES | NULL |
| 3 | blscfbleid | numeric | 10,0 | YES | NULL |
| 4 | blscdiaslect | numeric | 5,0 | YES | NULL |
| 5 | blscdiasconsestim | numeric | 5,0 | YES | NULL |
| 6 | blscconsreg | numeric | 10,0 | YES | NULL |
| 7 | blscconsestim | numeric | 10,0 | YES | NULL |
| 8 | blscsaldo | numeric | 10,0 | YES | NULL |
| 9 | blsccicloreg | numeric | 10,0 | YES | NULL |
| 10 | blscimpregulpdte | character | 1 | NO | 'N'::bpchar |
| 11 | blscconsreal | character | 1 | NO | 'N'::bpchar |
| 12 | blscanul | character | 1 | NO | 'N'::bpchar |
| 13 | blscsesid | numeric | 10,0 | YES | NULL |

### bolsaimportes
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | blsiblscpocid | numeric | 10,0 | NO | NULL |
| 2 | blsitconid | numeric | 5,0 | NO | NULL |
| 3 | blsicnttnum | numeric | 10,0 | YES | NULL |
| 4 | blsifacid | numeric | 10,0 | YES | NULL |
| 5 | blsiimporte | numeric | 18,2 | YES | NULL |
| 6 | blsiregpendiente | numeric | 18,2 | NO | 0 |
| 7 | blsiimpteoract | numeric | 18,2 | YES | NULL |
| 8 | blsiimpteorico | numeric | 18,2 | YES | NULL |

### bolsainspe
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bipolnum | numeric | 10,0 | NO | NULL |
| 2 | bifecha | date |  | NO | NULL |
| 3 | biobscod | character | 2 | YES | NULL |
| 4 | bipetintx | character varying | 80 | YES | NULL |
| 5 | bicontratc | numeric | 5,0 | YES | NULL |
| 6 | bioperid | numeric | 5,0 | YES | NULL |
| 7 | bipetinst | numeric | 5,0 | YES | NULL |
| 8 | biinsanno | numeric | 5,0 | NO | NULL |
| 9 | bipersoli | numeric | 5,0 | NO | NULL |
| 10 | bipromcon | numeric | 10,0 | NO | NULL |
| 11 | bigotid | character varying | 36 | YES | NULL |
| 12 | biusuario | character varying | 10 | YES | NULL |
| 13 | bisnpetman | character | 1 | NO | 'S'::bpchar |

### bonfacajen
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bfafactura | character varying | 30 | NO | NULL |
| 2 | bfaprsid | numeric | 10,0 | NO | NULL |
| 3 | bfainicio | date |  | NO | NULL |
| 4 | bfaestado | numeric | 5,0 | NO | NULL |
| 5 | bfaannofac | numeric | 5,0 | NO | NULL |
| 6 | bfaperiodo | numeric | 5,0 | NO | NULL |
| 7 | bfaimptot | numeric | 18,2 | NO | NULL |
| 8 | bfam3total | numeric | 5,0 | NO | NULL |
| 9 | bfafecemis | date |  | NO | NULL |
| 10 | bfafecpago | date |  | NO | NULL |
| 11 | bfaimpboni | numeric | 18,2 | NO | NULL |
| 12 | bfaimpubon | numeric | 18,2 | NO | NULL |
| 13 | bfam3boni | numeric | 5,0 | NO | NULL |
| 14 | bfaempresa | character varying | 10 | YES | NULL |
| 15 | bfaacreedor | character varying | 10 | YES | NULL |
| 16 | bfaanno | numeric | 5,0 | YES | NULL |
| 17 | bfames | numeric | 5,0 | YES | NULL |
| 18 | bfasesion | numeric | 10,0 | NO | NULL |

### bonfacconc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bfcfacid | numeric | 10,0 | NO | NULL |
| 2 | bfcadjudic | numeric | 5,0 | NO | NULL |
| 3 | bfcconcept | numeric | 5,0 | NO | NULL |
| 4 | bfctiptar | numeric | 5,0 | NO | NULL |
| 5 | bfcfecapl | date |  | NO | NULL |
| 6 | bfcsubcon | numeric | 5,0 | NO | NULL |
| 7 | bfccantbon | numeric | 5,0 | NO | NULL |
| 8 | bfcimpboni | numeric | 18,2 | NO | NULL |

### bonfacprop
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bfpfacid | numeric | 10,0 | NO | NULL |
| 2 | bfpprsid | numeric | 10,0 | NO | NULL |
| 3 | bfpinicio | date |  | NO | NULL |
| 4 | bfpestado | numeric | 5,0 | NO | NULL |
| 5 | bfpimpboni | numeric | 18,2 | YES | NULL |
| 6 | bfpimpubon | numeric | 18,2 | YES | NULL |
| 7 | bfpm3boni | numeric | 5,0 | YES | NULL |
| 8 | bfpempresa | character varying | 10 | YES | NULL |
| 9 | bfpacreedor | character varying | 10 | YES | NULL |
| 10 | bfpcobrnom | character | 1 | NO | NULL |
| 11 | bfpanno | numeric | 5,0 | YES | NULL |
| 12 | bfpmes | numeric | 5,0 | YES | NULL |
| 13 | bfpgescobr | numeric | 10,0 | YES | NULL |
| 14 | bfpsesion | numeric | 10,0 | NO | NULL |

### bonidef
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bndprsid | numeric | 10,0 | NO | NULL |
| 2 | bndinicio | date |  | NO | NULL |
| 3 | bndpoliza | numeric | 10,0 | YES | NULL |
| 4 | bndfin | date |  | YES | NULL |
| 5 | bndsesion | numeric | 10,0 | NO | NULL |

### bonificada
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | bnfprsid | numeric | 10,0 | NO | NULL |
| 2 | bnfcobrnom | character | 1 | NO | NULL |
| 3 | bnfplazo | numeric | 5,0 | NO | NULL |
| 4 | bnfhstusu | character varying | 10 | NO | NULL |
| 5 | bnfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### cabeceraretiroscierres
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | crcid | numeric | 10,0 | NO | NULL |
| 2 | crcfecha | date |  | YES | NULL |
| 3 | crctotal | numeric | 18,2 | NO | NULL |

### calfestcom
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cfccomid | numeric | 5,0 | NO | NULL |
| 2 | cfcfecha | date |  | NO | NULL |
| 3 | cfcdescrip | character varying | 30 | NO | NULL |

### calfestivo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cffecha | date |  | NO | NULL |
| 2 | cfdescrip | character varying | 30 | NO | NULL |
| 3 | cfindblk | numeric | 5,0 | NO | NULL |

### calfestloc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cflexpid | numeric | 5,0 | NO | NULL |
| 2 | cflfecha | date |  | NO | NULL |
| 3 | cfldescrip | character varying | 30 | NO | NULL |

### calfestofi
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cfoofiid | numeric | 5,0 | NO | NULL |
| 2 | cfofecha | date |  | NO | NULL |
| 3 | cfodescrip | character varying | 30 | NO | NULL |

### calibre
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | calimm | numeric | 5,0 | NO | NULL |
| 2 | calieqpul | character varying | 10 | YES | NULL |
| 3 | calihstusu | character varying | 10 | NO | ''::character varying |
| 4 | calihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 5 | calibaja | character | 1 | NO | 'S'::bpchar |
| 6 | calispde | character | 1 | YES | NULL |

### calibretarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cccttctcod | numeric | 10,0 | NO | NULL |
| 2 | ccctexpid | numeric | 5,0 | NO | NULL |
| 3 | ccctcptoid | numeric | 5,0 | NO | NULL |
| 4 | ccctcalibre | numeric | 5,0 | NO | NULL |
| 5 | cccttarifa | numeric | 5,0 | NO | NULL |

### calle
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | calid | numeric | 10,0 | NO | NULL |
| 2 | calparimp | numeric | 5,0 | NO | NULL |
| 3 | calnumdes | numeric | 10,0 | NO | NULL |
| 4 | calcodpost | character varying | 10 | NO | NULL |
| 5 | caltpctcid | numeric | 5,0 | YES | NULL |
| 6 | calhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 7 | calhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### cambfactu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | camftoid | numeric | 10,0 | NO | NULL |
| 2 | campocid | numeric | 10,0 | NO | NULL |
| 3 | camsesid | numeric | 10,0 | NO | NULL |

### cambpercon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpcoprid | numeric | 10,0 | NO | NULL |
| 2 | cpcopolnum | numeric | 10,0 | NO | NULL |
| 3 | cpcoestado | numeric | 5,0 | NO | NULL |
| 4 | cpcofecha | date |  | YES | NULL |
| 5 | cpcotxtanu | character varying | 30 | YES | NULL |
| 6 | cpcotopem3 | numeric | 10,0 | NO | NULL |
| 7 | cpcoperiodo | character | 9 | YES | NULL |

### cambperlibr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cplcpprprid | numeric | 10,0 | NO | NULL |
| 2 | cplexporig | numeric | 5,0 | NO | NULL |
| 3 | cplzonorig | character | 3 | NO | NULL |
| 4 | cplliborig | numeric | 5,0 | NO | NULL |
| 5 | cplexpdest | numeric | 5,0 | NO | NULL |
| 6 | cplzondest | character | 3 | NO | NULL |
| 7 | cpllibdest | numeric | 5,0 | NO | NULL |

### cambprrid
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | polnum | numeric | 10,0 | NO | NULL |
| 2 | fecha | timestamp without time zone |  | NO | NULL |
| 3 | bpolprrid | numeric | 10,0 | YES | NULL |
| 4 | polprrid | numeric | 10,0 | YES | NULL |

### cambsencomp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cscppcsid | numeric | 10,0 | NO | NULL |
| 2 | cscpcpgid | numeric | 10,0 | NO | NULL |
| 3 | cscpsencid | numeric | 10,0 | NO | NULL |

### cambsengestcob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | csgcpcsid | numeric | 10,0 | NO | NULL |
| 2 | csgcprsid | numeric | 10,0 | NO | NULL |
| 3 | csgcexpid | numeric | 5,0 | NO | NULL |
| 4 | csgcsencid | numeric | 10,0 | NO | NULL |

### camemitido
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cemifecemi | date |  | NO | NULL |
| 2 | cemidirid | numeric | 10,0 | NO | NULL |
| 3 | cemiconid | numeric | 10,0 | NO | NULL |
| 4 | cemicontra | numeric | 5,0 | YES | NULL |
| 5 | cemioperid | numeric | 5,0 | YES | NULL |
| 6 | cemifeccre | date |  | NO | NULL |
| 7 | cemiexpid | numeric | 5,0 | NO | NULL |
| 8 | cemizonid | character | 3 | NO | NULL |
| 9 | cemimotcam | character | 2 | NO | NULL |
| 10 | cemimotnoc | character | 2 | YES | NULL |
| 11 | cemiconidi | numeric | 10,0 | YES | NULL |
| 12 | cemiemplid | character | 2 | NO | NULL |
| 13 | cemifecvis | date |  | YES | NULL |
| 14 | cemiestado | numeric | 5,0 | NO | NULL |
| 15 | cemipriori | numeric | 5,0 | YES | NULL |
| 16 | cemicalib | numeric | 5,0 | NO | NULL |
| 17 | cemirepaso | numeric | 5,0 | YES | NULL |
| 18 | cemifecliq | date |  | YES | NULL |
| 19 | cemianocon | numeric | 5,0 | NO | NULL |
| 20 | cemiofiid | numeric | 5,0 | YES | NULL |
| 21 | cemifecact | timestamp without time zone |  | YES | NULL |
| 22 | cemifeccer | timestamp without time zone |  | YES | NULL |
| 23 | cemisnvalvreten | character | 1 | NO | 'N'::bpchar |
| 24 | cemiobserv | character varying | 400 | YES | NULL |

### cameqemitido
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cemieqfecemi | date |  | NO | NULL |
| 2 | cemieqdirid | numeric | 10,0 | NO | NULL |
| 3 | cemieqconid | numeric | 10,0 | NO | NULL |
| 4 | cemieqcontra | numeric | 5,0 | YES | NULL |
| 5 | cemieqoperid | numeric | 5,0 | YES | NULL |
| 6 | cemieqfeccre | date |  | NO | NULL |
| 7 | cemieqexpid | numeric | 5,0 | NO | NULL |
| 8 | cemieqzonid | character | 3 | NO | NULL::bpchar |
| 9 | cemieqmotcam | character | 2 | YES | NULL::bpchar |
| 10 | cemieqmotnoc | character | 2 | YES | NULL::bpchar |
| 11 | cemieqconidi | numeric | 10,0 | YES | NULL |
| 12 | cemieqemplid | character | 2 | YES | ' '::bpchar |
| 13 | cemieqfecvis | date |  | YES | NULL |
| 14 | cemieqestado | numeric | 5,0 | NO | NULL |
| 15 | cemieqpriori | numeric | 5,0 | YES | NULL |
| 16 | cemieqcalib | numeric | 5,0 | NO | NULL |
| 17 | cemieqrepaso | numeric | 5,0 | YES | NULL |
| 18 | cemieqfecliq | date |  | YES | NULL |
| 19 | cemieqanocon | numeric | 5,0 | YES | NULL |
| 20 | cemieqofiid | numeric | 5,0 | YES | NULL |
| 21 | cemieqfecact | timestamp without time zone |  | YES | NULL |
| 22 | cemieqfeccer | timestamp without time zone |  | YES | NULL |
| 23 | cemieqsnvalvreten | character | 1 | NO | 'N'::bpchar |
| 24 | cemieqobserv | character varying | 400 | YES | NULL::character varying |

### canalcobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | canaid | character | 1 | NO | NULL |
| 2 | canatxtid | numeric | 10,0 | NO | NULL |
| 3 | canabanco | character | 1 | NO | NULL |
| 4 | cananomina | character | 1 | NO | NULL |
| 5 | canacobro | character | 1 | NO | NULL |
| 6 | canasumacuadre | character | 1 | NO | 'N'::bpchar |
| 7 | canatransfer | character | 1 | NO | 'N'::bpchar |

### cantipclie
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttipcli | character | 1 | NO | NULL |
| 2 | cntcanal | character | 1 | NO | NULL |

### cargo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | carggscid | numeric | 10,0 | NO | NULL |
| 2 | carggcobprsid | numeric | 10,0 | YES | NULL |
| 3 | carggcobexpid | numeric | 5,0 | YES | NULL |
| 4 | cargfenvio | date |  | YES | NULL |
| 5 | cargfdecconac | date |  | YES | NULL |
| 6 | cargreferencia | character varying | 12 | YES | NULL |
| 7 | cargjuzgado | character varying | 20 | YES | NULL |
| 8 | cargfboe | date |  | YES | NULL |

### cartdesglo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cardmes | numeric | 5,0 | NO | NULL |
| 2 | cardexpid | numeric | 5,0 | NO | NULL |
| 3 | cardsocpro | numeric | 10,0 | NO | NULL |
| 4 | cardcnttnum | numeric | 10,0 | NO | NULL |
| 5 | cardimporte | numeric | 18,2 | YES | NULL |
| 6 | cardciclos | numeric | 5,0 | NO | NULL |
| 7 | cardtclicod | character | 1 | NO | NULL |

### casomuestreo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | casmid | numeric | 10,0 | NO | NULL |
| 2 | casmexpid | numeric | 5,0 | NO | NULL |
| 3 | casmfecini | timestamp without time zone |  | NO | NULL |
| 4 | casmsesfin | numeric | 10,0 | YES | NULL |
| 5 | casmtipo | numeric | 5,0 | NO | NULL |
| 6 | casmcptoid | numeric | 5,0 | YES | NULL |
| 7 | casmttarid | numeric | 5,0 | YES | NULL |
| 8 | casmfecapl | date |  | YES | NULL |
| 9 | casmsubcto | numeric | 5,0 | YES | NULL |
| 10 | casmcalimm | numeric | 5,0 | YES | NULL |
| 11 | casmcalib2 | numeric | 5,0 | YES | NULL |
| 12 | casmtralim | numeric | 10,0 | YES | NULL |
| 13 | casmtpvid | numeric | 5,0 | YES | NULL |
| 14 | casmcorid | numeric | 10,0 | YES | NULL |
| 15 | casmftoid | numeric | 10,0 | NO | NULL |
| 16 | casmcantact | double precision | 53 | YES | NULL |
| 17 | casmcantant | double precision | 53 | YES | NULL |
| 18 | casmconsmin | numeric | 10,0 | YES | NULL |

### catcalletpcon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cclltctcod | numeric | 10,0 | NO | NULL |
| 2 | ccllexpid | numeric | 5,0 | NO | NULL |
| 3 | ccllcptoid | numeric | 5,0 | NO | NULL |
| 4 | ccllcatcalle | numeric | 5,0 | NO | NULL |
| 5 | cclltarifa | numeric | 5,0 | NO | NULL |

### catcomcfdi
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cccfdiuso | character varying | 10 | NO | NULL |
| 2 | cccfdidesc | character varying | 250 | NO | NULL |
| 3 | cccfdifiv | date |  | YES | NULL |
| 4 | cccfdiffv | date |  | YES | NULL |
| 5 | cccfdiusodefp | character | 1 | NO | 'N'::bpchar |
| 6 | cccfdiusodefo | character | 1 | NO | 'N'::bpchar |

### catecontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | catconid | numeric | 5,0 | NO | NULL |
| 2 | catcontxtid | numeric | 10,0 | NO | NULL |
| 3 | catconsnintfrac | character | 1 | NO | 'N'::bpchar |
| 4 | catfmpid | numeric | 5,0 | YES | NULL |
| 5 | catfmpcanal | character | 1 | YES | NULL |

### catprodserv
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | catpconfact | numeric | 5,0 | NO | NULL |
| 2 | catpcodprod | character varying | 10 | NO | NULL |
| 3 | catpsubconfact | numeric | 5,0 | NO | NULL |
| 4 | catpclaveunidad | character varying | 10 | YES | NULL |

### catproducto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cprcodprod | character varying | 10 | NO | NULL |
| 2 | cprdescprod | character varying | 256 | NO | NULL |
| 3 | cprfecinivig | date |  | NO | NULL |
| 4 | cprfecfinvig | date |  | YES | NULL |

### catregfiscal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | crfcodigo | character varying | 10 | NO | NULL |
| 2 | crfdescrip | character varying | 256 | NO | NULL |
| 3 | crfsnfisica | character | 1 | NO | 'N'::bpchar |
| 4 | crfsnmoral | character | 1 | NO | 'N'::bpchar |
| 5 | crffechaini | date |  | NO | NULL |
| 6 | crffechafin | date |  | YES | NULL |

### cattiporel
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctrrelclave | character varying | 5 | NO | NULL |
| 2 | ctreldesc | character varying | 250 | NO | NULL |
| 3 | ctrelfiv | date |  | YES | NULL |
| 4 | ctrelffv | date |  | YES | NULL |

### causaborefac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | carorigen | numeric | 5,0 | NO | NULL |
| 2 | carcodigo | numeric | 5,0 | NO | NULL |
| 3 | cartxtid | numeric | 10,0 | NO | NULL |
| 4 | carsnerrfact | character | 1 | NO | 'S'::bpchar |
| 5 | carhstusu | character varying | 10 | NO | NULL |
| 6 | carhsthora | timestamp without time zone |  | NO | NULL |
| 7 | carsnreciva | character | 1 | NO | 'N'::bpchar |
| 8 | cartipfele | numeric | 5,0 | YES | NULL |
| 9 | carsnfuga | character | 1 | NO | 'N'::bpchar |

### causaqueja
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cauqid | numeric | 5,0 | NO | NULL |
| 2 | cauqdesc | character varying | 40 | NO | NULL |

### cbeneficio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cbecodigo | character varying | 6 | NO | NULL |
| 2 | cbevdesde | date |  | NO | NULL |
| 3 | cbevhasta | date |  | YES | NULL |
| 4 | cbedivsap | character varying | 5 | NO | NULL |
| 5 | cbedescri | character varying | 100 | NO | NULL |
| 6 | cbedbreve | character varying | 20 | NO | NULL |
| 7 | cbeaccont | character | 2 | YES | NULL |
| 8 | cbecendecsce | character varying | 3 | YES | NULL |

### ccobroquipu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ccqcod | character | 4 | NO | NULL |
| 2 | ccqdesc | character varying | 50 | NO | NULL |

### centroadmin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cadmid | numeric | 5,0 | NO | NULL |
| 2 | cadmdesc | character varying | 50 | YES | NULL |
| 3 | cadmcodcen | character varying | 25 | NO | NULL |
| 4 | cadmdirid | numeric | 10,0 | NO | NULL |
| 5 | cadmrol | numeric | 5,0 | NO | NULL |
| 6 | cadhstusu | character varying | 10 | NO | ' '::character varying |
| 7 | cadhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### centroadmincnt
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | caccnttnum | numeric | 10,0 | NO | NULL |
| 2 | cacexpid | numeric | 5,0 | NO | NULL |
| 3 | cacsocemi | numeric | 10,0 | NO | NULL |
| 4 | cacccfiscal | numeric | 5,0 | YES | NULL |
| 5 | caccreceptor | numeric | 5,0 | YES | NULL |
| 6 | caccpagador | numeric | 5,0 | YES | NULL |
| 7 | cacccomprador | numeric | 5,0 | YES | NULL |

### centrodistrib
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cdbid | numeric | 5,0 | NO | NULL |
| 2 | cdbrepid | numeric | 10,0 | NO | NULL |
| 3 | cdbdescrip | character varying | 60 | NO | NULL |
| 4 | cdbdireccion | numeric | 10,0 | YES | NULL |
| 5 | cdbcodext | character | 3 | NO | NULL |
| 6 | cdbhstusu | character varying | 10 | NO | NULL |
| 7 | cdbhsthora | timestamp without time zone |  | NO | NULL |

### chequeofact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | chfid | numeric | 5,0 | NO | NULL |
| 2 | chfdesccorta | character varying | 80 | NO | NULL |
| 3 | chfdesclarga | character varying | 1000 | NO | NULL |
| 4 | chfcondicion | character varying | 200 | YES | NULL |
| 5 | chfaccion | character varying | 200 | YES | NULL |

### ciclozona
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | czexpid | numeric | 5,0 | NO | NULL |
| 2 | czzonid | character | 3 | NO | NULL |
| 3 | czanno | numeric | 5,0 | NO | NULL |
| 4 | czperiid | numeric | 5,0 | NO | NULL |
| 5 | czpernum | numeric | 5,0 | NO | NULL |
| 6 | czmes | numeric | 5,0 | NO | NULL |
| 7 | czestado | numeric | 5,0 | NO | NULL |
| 8 | czfcielec | date |  | YES | NULL |
| 9 | czfpfact | date |  | YES | NULL |
| 10 | czfultfac | date |  | YES | NULL |
| 11 | czfciefac | date |  | YES | NULL |
| 12 | czinspsoli | numeric | 10,0 | NO | 0 |
| 13 | czinpreal | numeric | 10,0 | NO | 0 |
| 14 | czhcielec | time without time zone |  | YES | NULL |

### cierre
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cieid | numeric | 10,0 | NO | NULL |
| 2 | ciegisid | numeric | 10,0 | NO | NULL |
| 3 | cieexpid | numeric | 5,0 | NO | NULL |
| 4 | ciedesccierre | character varying | 150 | NO | NULL |
| 5 | ciecierreprog | numeric | 5,0 | NO | NULL |
| 6 | cieestado | numeric | 5,0 | NO | NULL |
| 7 | ciefinicorte | timestamp without time zone |  | NO | NULL |
| 8 | ciefinicorteant | timestamp without time zone |  | YES | NULL |
| 9 | cieffincorte | timestamp without time zone |  | NO | NULL |
| 10 | ciefrealcorte | timestamp without time zone |  | YES | NULL |
| 11 | cieactivsumin | timestamp without time zone |  | YES | NULL |
| 12 | ciemotdesco | character varying | 150 | NO | NULL |
| 13 | cieobsid | numeric | 10,0 | YES | NULL |
| 14 | cierespaprob | character varying | 60 | NO | NULL |
| 15 | cieidioma | character | 2 | NO | NULL |
| 16 | ciecalle | character varying | 150 | YES | NULL |
| 17 | ciehstusu | character | 10 | NO | NULL |
| 18 | ciehsthora | timestamp without time zone |  | YES | NULL |
| 19 | cieffincorteant | timestamp without time zone |  | YES | NULL |
| 20 | ciedifhoraria | numeric | 5,0 | YES | NULL |

### cierreacometida
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ciaacoid | numeric | 10,0 | NO | NULL |
| 2 | ciacieid | numeric | 10,0 | NO | NULL |
| 3 | ciaacoexcl | character | 1 | NO | NULL |
| 4 | ciafecinc | timestamp without time zone |  | NO | NULL |
| 5 | ciatpfid | numeric | 10,0 | YES | NULL |
| 6 | ciaacoope | character | 1 | YES | NULL |
| 7 | ciahstusu | character | 10 | NO | NULL |
| 8 | ciahsthora | timestamp without time zone |  | NO | NULL |

### cierredescartado
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cidid | numeric | 10,0 | NO | NULL |
| 2 | cidgisid | numeric | 10,0 | NO | NULL |
| 3 | cidexpid | numeric | 5,0 | YES | NULL |
| 4 | cidacoid | character varying | 200 | NO | NULL |
| 5 | ciddesccierre | character varying | 150 | NO | NULL |
| 6 | cidcierreprog | numeric | 5,0 | NO | NULL |
| 7 | cidestado | numeric | 5,0 | NO | NULL |
| 8 | cidfinicorte | timestamp without time zone |  | NO | NULL |
| 9 | cidffincorte | timestamp without time zone |  | NO | NULL |
| 10 | cidfrealcorte | timestamp without time zone |  | YES | NULL |
| 11 | cidactivsumin | timestamp without time zone |  | YES | NULL |
| 12 | cidmotdesco | character varying | 50 | NO | NULL |
| 13 | cidobsid | character varying | 80 | YES | NULL |
| 14 | cidrespaprob | character varying | 50 | NO | NULL |
| 15 | cididioma | character | 2 | YES | NULL |
| 16 | cidcalle | character varying | 200 | YES | NULL |
| 17 | cidmotdescarte | character varying | 200 | YES | NULL |
| 18 | cidfechadescarte | timestamp without time zone |  | NO | NULL |

### circuitodistrib
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctdid | numeric | 5,0 | NO | NULL |
| 2 | ctddescrip | character varying | 50 | NO | NULL |
| 3 | ctddistid | numeric | 10,0 | NO | NULL |
| 4 | ctdcdbid | numeric | 5,0 | NO | NULL |
| 5 | ctdtransid | numeric | 10,0 | YES | NULL |
| 6 | ctdimpreid | numeric | 10,0 | YES | NULL |
| 7 | ctdensobid | numeric | 10,0 | YES | NULL |
| 8 | ctdtpclasif | character | 1 | NO | NULL |
| 9 | ctdtpsid | numeric | 5,0 | YES | NULL |
| 10 | ctdexpid | numeric | 5,0 | NO | NULL |
| 11 | ctdsnimploc | character | 1 | NO | NULL |
| 12 | ctdhstusu | character varying | 10 | NO | NULL |
| 13 | ctdhsthora | timestamp without time zone |  | NO | NULL |

### clascontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | clsccod | character | 2 | NO | NULL |
| 2 | clsctxtid | numeric | 10,0 | NO | NULL |
| 3 | clscptoest | numeric | 5,0 | NO | NULL |
| 4 | clsccedcon | character | 1 | NO | NULL |
| 5 | clschstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | clschsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### clausulas
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | clauid | numeric | 5,0 | NO | NULL |
| 3 | clauxltxid | numeric | 10,0 | NO | NULL |
| 4 | clauvtocon | character | 1 | NO | NULL |
| 5 | clauptoser | character | 1 | NO | NULL |
| 6 | claufaltadoc | character | 1 | NO | 'N'::bpchar |
| 7 | claurcuid | numeric | 5,0 | NO | 0 |
| 8 | claublodifimp | numeric | 5,0 | YES | NULL |
| 9 | claudesctxtid | numeric | 10,0 | NO | '0'::numeric |

### clautipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctctctcod | numeric | 10,0 | NO | NULL |
| 2 | ctcclauid | numeric | 5,0 | NO | NULL |

### claveconta
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cvctasid | numeric | 5,0 | NO | NULL |
| 2 | cvctpcnt | character | 1 | NO | NULL |
| 3 | cvcdebhab | character | 1 | NO | NULL |
| 4 | cvcregimen | character | 1 | NO | NULL |
| 5 | cvcclave | character | 2 | NO | NULL |
| 6 | cvcsnactivo | character | 1 | NO | NULL |
| 7 | cvchstusu | character varying | 10 | NO | NULL |
| 8 | cvchsthora | timestamp without time zone |  | NO | NULL |

### cliente
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cliid | numeric | 10,0 | NO | NULL |
| 2 | clitipo | character | 1 | NO | NULL |
| 3 | cliwebuser | character varying | 15 | YES | NULL |
| 4 | cliwebpass | character varying | 10 | YES | NULL |
| 5 | cliwebconn | numeric | 10,0 | YES | NULL |
| 6 | cliwebultc | timestamp without time zone |  | YES | NULL |
| 7 | cliwebchgp | character | 1 | NO | NULL |
| 8 | cliindblk | numeric | 5,0 | NO | NULL |
| 9 | clicenfis | numeric | 5,0 | YES | NULL |
| 10 | clicenpag | numeric | 5,0 | YES | NULL |
| 11 | clicenrecp | numeric | 5,0 | YES | NULL |
| 12 | clihubid | numeric | 5,0 | YES | NULL |
| 13 | clicodcli | character varying | 10 | YES | NULL |
| 14 | clisubent | character varying | 10 | YES | NULL |
| 15 | clihstusu | character varying | 10 | NO | ' '::character varying |
| 16 | clihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 17 | clicencomp | numeric | 5,0 | YES | NULL |
| 18 | cliusocfdi | character varying | 3 | YES | 'S01'::character varying |
| 19 | clifmpcanal | character | 1 | YES | NULL |
| 20 | clifmpid | numeric | 5,0 | YES | NULL |
| 21 | clicfdpago | numeric | 5,0 | YES | NULL |
| 22 | cliregfiscal | character varying | 10 | YES | NULL |

### cnae
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnaecod | numeric | 10,0 | NO | NULL |
| 2 | cnaetxtid | numeric | 10,0 | NO | NULL |

### cnae_resp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnaecod | numeric | 10,0 | NO | NULL |
| 2 | cnaetxtid | numeric | 10,0 | NO | NULL |

### cnaeiae
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnicnae | numeric | 10,0 | NO | NULL |
| 2 | cniiaesec | numeric | 5,0 | NO | NULL |
| 3 | cniiaeepi | numeric | 5,0 | NO | NULL |

### cnaesoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnsoccnaecod | numeric | 10,0 | NO | NULL |
| 2 | cnsocprsid | numeric | 10,0 | NO | NULL |
| 3 | cnsocgraid | numeric | 5,0 | NO | NULL |
| 4 | cnsocrpcid | numeric | 5,0 | NO | NULL |

### cobropdtecfd
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpcfid | numeric | 10,0 | NO | NULL |
| 2 | cpcftipo | character | 1 | NO | NULL |
| 3 | cpcfcnttnum | numeric | 10,0 | NO | NULL |
| 4 | cpcffeccrea | timestamp without time zone |  | NO | NULL |
| 5 | cpcfsnproc | character | 1 | NO | NULL |
| 6 | cpcffecproc | timestamp without time zone |  | YES | NULL |

### codauxdir
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | auxdid | character | 4 | NO | NULL |
| 2 | auxddesc | character | 5 | NO | NULL |
| 3 | auxdbloque | character | 1 | NO | NULL |
| 4 | auxdescal | character | 1 | NO | NULL |
| 5 | auxdplanta | character | 1 | NO | NULL |
| 6 | auxdpuerta | character | 1 | NO | NULL |
| 7 | auxsnactivo | character | 1 | NO | 'S'::bpchar |

### codpobaca
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpapobid | numeric | 10,0 | NO | NULL |
| 2 | cpacodaca | numeric | 5,0 | NO | NULL |

### codsoctmtr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cssociedad | numeric | 10,0 | NO | NULL |
| 2 | cscodigo | character | 2 | NO | NULL |

### codtardomtmtr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctdtsubid | numeric | 5,0 | NO | NULL |
| 2 | ctdcodtardom | character | 3 | NO | NULL |

### colaenvcontent
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contentid | numeric | 10,0 | NO | NULL |
| 2 | contentcomeid | numeric | 10,0 | YES | NULL |
| 3 | contentcomsid | numeric | 10,0 | YES | NULL |

### colaenvpendientes
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | envid | numeric | 10,0 | NO | NULL |
| 2 | envpcsid | numeric | 10,0 | NO | NULL |
| 3 | envprioridad | numeric | 10,0 | NO | NULL |
| 4 | envtiempovida | date |  | YES | NULL |
| 5 | envestadomensaje | numeric | 5,0 | NO | NULL |
| 6 | envnumreintentos | numeric | 5,0 | NO | NULL |
| 7 | envcontentid | numeric | 10,0 | NO | NULL |
| 9 | envtpplantilla | numeric | 5,0 | YES | NULL |

### colaenvpendientesadj
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | enaid | numeric | 10,0 | NO | NULL |
| 2 | enadocadj | numeric | 10,0 | NO | NULL |

### colentmenu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cemfuncod | character varying | 50 | NO | NULL |
| 2 | cemnumcol | numeric | 5,0 | NO | NULL |
| 3 | cematributo | character varying | 20 | NO | NULL |
| 4 | cemanchura | numeric | 5,0 | YES | NULL |
| 5 | cemtiporender | numeric | 5,0 | YES | NULL |
| 6 | cemparamsrender | character varying | 80 | YES | NULL |
| 7 | cemorden | numeric | 5,0 | NO | NULL |
| 8 | cemcabtxtid | numeric | 10,0 | NO | NULL |

### comadjunto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmasalid | numeric | 10,0 | NO | NULL |
| 2 | cmanombre | character varying | 128 | NO | NULL |
| 3 | cmacontenido | bytea |  | NO | NULL |

### comcarta
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | carid | numeric | 10,0 | NO | NULL |
| 2 | carprsid | numeric | 10,0 | NO | NULL |
| 3 | carnumdir | numeric | 5,0 | NO | NULL |
| 4 | carcosid | numeric | 10,0 | NO | NULL |
| 5 | carfeccrea | timestamp without time zone |  | NO | NULL |
| 6 | carimpre | timestamp without time zone |  | YES | NULL |
| 7 | carfecdev | date |  | YES | NULL |
| 8 | carmotdev | numeric | 5,0 | YES | NULL |
| 9 | carcert | character | 1 | NO | 'N'::bpchar |
| 10 | caracuse | character | 1 | NO | 'N'::bpchar |
| 11 | carfecnot | date |  | YES | NULL |
| 12 | carresent | numeric | 5,0 | YES | NULL |
| 13 | carserade | character varying | 25 | YES | NULL |
| 14 | carsbrsid | numeric | 10,0 | YES | NULL |
| 15 | carrefsicer | character varying | 23 | YES | NULL |
| 16 | carestsicer | numeric | 5,0 | YES | NULL |
| 17 | carsitsicer | character | 2 | YES | NULL |
| 18 | carfecsitsicer | date |  | YES | NULL |
| 19 | carentrsicer | numeric | 5,0 | YES | NULL |

### comcertdig
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ccdid | numeric | 10,0 | NO | NULL |
| 2 | ccdcosid | numeric | 10,0 | YES | NULL |
| 3 | ccdtipocert | numeric | 5,0 | NO | NULL |
| 4 | ccdtelefono | character varying | 16 | YES | NULL |
| 5 | ccdmailpdprsid | numeric | 10,0 | YES | NULL |
| 6 | ccdmailpdnumdir | numeric | 5,0 | YES | NULL |
| 7 | ccdenvdig | numeric | 10,0 | YES | NULL |
| 8 | ccdprsiddest | numeric | 10,0 | NO | NULL |
| 9 | ccdvaracojson | character varying | 2000 | YES | NULL |
| 10 | ccdprefijo | character varying | 5 | YES | NULL |

### comdeudadj
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cdaliqid | numeric | 10,0 | NO | NULL |
| 2 | cdaexpid | numeric | 5,0 | NO | NULL |
| 3 | cdanumfac | numeric | 10,0 | NO | NULL |
| 4 | cdaimporte | numeric | 18,2 | NO | NULL |

### comdeudfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cdfliqid | numeric | 10,0 | NO | NULL |
| 2 | cdfadjid | numeric | 5,0 | NO | NULL |
| 3 | cdffacid | numeric | 10,0 | NO | NULL |

### comdeudor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | codliqid | numeric | 10,0 | NO | NULL |
| 2 | codsesid | numeric | 10,0 | NO | NULL |
| 3 | codpropid | numeric | 10,0 | NO | NULL |
| 4 | codfecfacd | date |  | NO | NULL |
| 5 | codfecfach | date |  | NO | NULL |
| 6 | codfecban | date |  | NO | NULL |
| 7 | codfecnban | date |  | NO | NULL |
| 8 | coddefinit | character | 1 | NO | NULL |
| 9 | codresid | numeric | 10,0 | YES | NULL |

### comemail
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmeid | numeric | 10,0 | NO | NULL |
| 2 | cmeprsid | numeric | 10,0 | NO | NULL |
| 3 | cmecosid | numeric | 10,0 | NO | NULL |
| 4 | cmeasunto | character varying | 50 | YES | NULL |
| 5 | cmecuerpo | character varying | 3000 | YES | NULL |
| 6 | cmeenvio | timestamp without time zone |  | YES | NULL |
| 7 | cmeusuenvio | character | 10 | YES | NULL |
| 8 | cmeidioma | character | 5 | NO | 'es'::bpchar |
| 9 | cmeemail | character varying | 110 | NO | ''::character varying |
| 10 | cmefechacreacion | timestamp without time zone |  | YES | NULL |
| 11 | cmeusucreacion | character | 10 | YES | NULL |
| 12 | cmefechaanulacion | timestamp without time zone |  | YES | NULL |
| 13 | cmeusuanulacion | character | 10 | YES | NULL |
| 14 | cmefecharetencion | timestamp without time zone |  | YES | NULL |
| 15 | cmeusuretencion | character | 10 | YES | NULL |
| 16 | cmeidenvio | character varying | 50 | YES | NULL |
| 17 | cmeiderrorenvio | numeric | 5,0 | YES | NULL |
| 18 | cmefechareenvio | timestamp without time zone |  | YES | NULL |
| 19 | cmepcsid | numeric | 10,0 | YES | NULL |
| 20 | cmeidpaquete | character varying | 50 | YES | NULL |
| 21 | cmeestado | numeric | 5,0 | YES | NULL |
| 22 | cmeprioridad | numeric | 5,0 | YES | NULL |
| 23 | cmetiempovida | date |  | YES | NULL |
| 24 | cmeusuario | character | 10 | YES | NULL |
| 25 | cmefechamod | timestamp without time zone |  | YES | NULL |
| 26 | cmefechaenvprov | timestamp without time zone |  | YES | NULL |
| 27 | cmeidsubestdesc | numeric | 10,0 | YES | NULL |

### comenvrecob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cercid | numeric | 10,0 | NO | NULL |
| 2 | cerctipcom | numeric | 5,0 | NO | NULL |
| 3 | cercexrcid | numeric | 10,0 | NO | NULL |
| 4 | cercenviado | character | 1 | NO | 'N'::bpchar |
| 5 | cercfecenv | date |  | YES | NULL |
| 6 | cercnomfich | character varying | 75 | YES | NULL |

### comfacenvrecob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cfercomrecid | numeric | 10,0 | NO | NULL |
| 2 | cfernumfac | character varying | 18 | NO | NULL |
| 3 | cferimporte | numeric | 18,2 | NO | NULL |
| 4 | cferfecha | date |  | NO | NULL |

### comfacrecrecob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cfrrcomrecid | numeric | 10,0 | NO | NULL |
| 2 | cfrrnumfac | character varying | 30 | NO | NULL |
| 3 | cfrrimporte | numeric | 18,2 | NO | NULL |
| 4 | cfrrfeccob | date |  | NO | NULL |
| 5 | cfrrexito | character | 1 | NO | 'N'::bpchar |

### comfacturae
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmfid | numeric | 10,0 | NO | NULL |
| 2 | cmfcosid | numeric | 10,0 | NO | NULL |
| 3 | cmfidioma | character | 5 | NO | 'es'::bpchar |
| 4 | cmfemail | character varying | 110 | YES | NULL |
| 5 | cmffechacreacion | timestamp without time zone |  | YES | NULL |
| 6 | cmfusucreacion | character | 10 | YES | NULL |
| 7 | cmfiderrorenvio | numeric | 5,0 | YES | NULL |
| 8 | cmffechareenvio | timestamp without time zone |  | YES | NULL |
| 9 | cmfpcsid | numeric | 10,0 | YES | NULL |
| 10 | cmfhubid | numeric | 5,0 | YES | NULL |
| 11 | cmfdfeid | numeric | 10,0 | NO | NULL |
| 12 | cmfsocid | numeric | 10,0 | NO | NULL |
| 13 | cmffechaact | timestamp without time zone |  | YES | NULL |
| 14 | cmfsubestado | numeric | 5,0 | YES | NULL |
| 15 | cmfenvanex | character | 1 | YES | NULL |
| 16 | cmfciclocer | character | 1 | NO | 'N'::bpchar |
| 17 | cmfdescerrorenvio | character varying | 500 | YES | NULL |

### compacvartao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cvtexpid | numeric | 5,0 | NO | NULL |
| 2 | cvttpvid | numeric | 5,0 | NO | NULL |
| 3 | cvtvalorvar | numeric | 18,6 | NO | NULL |
| 4 | cvttipocompac | numeric | 5,0 | NO | NULL |

### compcltes
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ccliid | numeric | 10,0 | NO | NULL |
| 2 | cclitrgid | numeric | 5,0 | NO | NULL |
| 3 | ccliexpid | numeric | 5,0 | NO | NULL |
| 4 | cclipolnum | numeric | 10,0 | YES | NULL |
| 5 | ccliquejid | character varying | 15 | YES | NULL |
| 6 | ccliaveria | character varying | 9 | YES | NULL |
| 7 | cclifecave | date |  | YES | NULL |
| 8 | cclirgfid | numeric | 10,0 | YES | NULL |
| 9 | ccliimporte | numeric | 18,2 | YES | NULL |
| 10 | cclifecreg | date |  | NO | NULL |
| 11 | ccliusureg | character varying | 10 | NO | NULL |
| 12 | cclisisabo | numeric | 5,0 | NO | 3 |
| 13 | cclicosid | numeric | 10,0 | YES | NULL |
| 14 | ccliquejsec | numeric | 10,0 | YES | NULL |

### comprobanteplazo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpdesid | numeric | 10,0 | NO | NULL |
| 2 | cpdesidcomp | numeric | 10,0 | YES | NULL |

### compromiso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpgid | numeric | 10,0 | NO | NULL |
| 2 | cpgprsid | numeric | 10,0 | YES | NULL |
| 3 | cpgnumdir | numeric | 5,0 | YES | NULL |
| 4 | cpgobsid | numeric | 10,0 | YES | NULL |
| 5 | cpgsnreal | character | 1 | NO | 'S'::bpchar |
| 6 | cpgocgid | numeric | 10,0 | YES | NULL |
| 7 | cpgsencid | numeric | 10,0 | YES | NULL |
| 8 | cpgrefmid | numeric | 10,0 | YES | NULL |
| 9 | cpgestorcobro | numeric | 10,0 | YES | NULL |
| 10 | cpgargo | numeric | 10,0 | YES | NULL |
| 11 | cpgencalidad | numeric |  | YES | NULL |
| 12 | cpgcanal | character | 1 | YES | NULL |
| 13 | cpgfrmpago | numeric | 5,0 | YES | NULL |
| 14 | cpgsnsencli | character | 1 | YES | NULL |
| 15 | cpgsnintdem | character | 1 | NO | 'N'::bpchar |
| 16 | cpgsnintfracc | character | 1 | NO | 'N'::bpchar |
| 17 | cpgsnplazosfac | character | 1 | NO | 'N'::bpchar |
| 18 | cpenvnot | character | 1 | NO | 'C'::bpchar |
| 19 | cptiposolic | character | 1 | NO | 'C'::bpchar |
| 20 | cpmail1prsid | numeric | 10,0 | YES | NULL |
| 21 | cpmail1numdir | numeric | 5,0 | YES | NULL |
| 22 | cpmail2prsid | numeric | 10,0 | YES | NULL |
| 23 | cpmail2numdir | numeric | 5,0 | YES | NULL |
| 24 | cpprefijo | character varying | 5 | YES | NULL |
| 25 | cpmovil | character varying | 16 | YES | NULL |
| 26 | cpgsolprsid | numeric | 10,0 | NO | NULL |
| 27 | cpgsnaplicsaldo | character | 1 | NO | 'N'::bpchar |
| 28 | cpjuicio | numeric | 10,0 | YES | NULL |

### compush
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmpid | numeric | 10,0 | NO | NULL |
| 2 | cmpcosid | numeric | 10,0 | NO | NULL |
| 3 | cmpusuario | character varying | 40 | NO | NULL |
| 4 | cmpcodsocov | character varying | 16 | NO | NULL |
| 5 | cmptmenid | numeric | 10,0 | NO | NULL |
| 6 | cmpidicodigo | character | 2 | NO | NULL |
| 7 | cmpfecenvio | date |  | YES | NULL |

### comrecrecob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | crrcid | numeric | 10,0 | NO | NULL |
| 2 | crrctipcom | numeric | 5,0 | NO | NULL |
| 3 | crrcexrcid | numeric | 10,0 | NO | NULL |
| 4 | crrcfecenv | date |  | NO | NULL |
| 5 | crrcnomfich | character varying | 75 | NO | NULL |

### comsms
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmsid | numeric | 10,0 | NO | NULL |
| 2 | cmscosid | numeric | 10,0 | NO | NULL |
| 3 | cmsidioma | character | 5 | NO | NULL |
| 4 | cmstelefono | character varying | 16 | NO | NULL |
| 5 | cmsfechacreacion | timestamp without time zone |  | YES | NULL |
| 6 | cmsusucreacion | character | 10 | YES | NULL |
| 7 | cmsfechaenvio | timestamp without time zone |  | YES | NULL |
| 8 | cmsusuenvio | character | 10 | YES | NULL |
| 9 | cmsfechanulacion | timestamp without time zone |  | YES | NULL |
| 10 | cmsusuanulacion | character | 10 | YES | NULL |
| 11 | cmsfecharetencion | timestamp without time zone |  | YES | NULL |
| 12 | cmsusuretencion | character | 10 | YES | NULL |
| 13 | cmsidenvio | character varying | 50 | YES | NULL |
| 14 | cmsiderrorenvio | numeric | 5,0 | YES | NULL |
| 15 | cmsfechareenvio | timestamp without time zone |  | YES | NULL |
| 16 | cmspcsid | numeric | 10,0 | YES | NULL |
| 17 | cmsidpaquete | character varying | 50 | YES | NULL |
| 18 | cmsestado | numeric | 5,0 | YES | NULL |
| 19 | cmsprioridad | numeric | 5,0 | YES | NULL |
| 20 | cmstiempovida | date |  | YES | NULL |
| 21 | cmsusuario | character | 10 | YES | NULL |
| 22 | cmsfechamod | timestamp without time zone |  | YES | NULL |
| 23 | cmslongitudsms | numeric | 10,0 | YES | NULL |
| 24 | cmsfechaenvprov | timestamp without time zone |  | YES | NULL |
| 25 | cmsidsubestdesc | numeric | 10,0 | YES | NULL |
| 26 | cmsprsid | numeric | 10,0 | YES | NULL |

### comsmsparams
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cspcmsid | numeric | 10,0 | NO | NULL |
| 2 | cspparamkey | character varying | 50 | NO | NULL |
| 3 | cspparamvalue | character varying | 1000 | YES | NULL |
| 4 | cspurlcorta | character | 1 | NO | 'N'::bpchar |

### comsubestadodesc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cseid | numeric | 10,0 | NO | NULL |
| 2 | cseidioma | character varying | 200 | NO | NULL |
| 3 | csedesc | character varying | 500 | YES | NULL |

### comunidad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | comid | numeric | 5,0 | NO | NULL |
| 2 | comnombre | character varying | 30 | NO | NULL |
| 3 | compaisid | numeric | 10,0 | NO | NULL |
| 4 | comindblk | numeric | 5,0 | NO | NULL |

### comunisal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cosid | numeric | 10,0 | NO | NULL |
| 2 | cospolnum | numeric | 10,0 | NO | NULL |
| 3 | cosfeccrea | timestamp without time zone |  | NO | NULL |
| 4 | cosvariable | character varying | 3900 | YES | NULL |
| 5 | cospcsid | numeric | 10,0 | NO | 0 |
| 6 | cosestado | numeric | 5,0 | NO | NULL |
| 7 | cosidtipo | numeric | 5,0 | YES | NULL |
| 8 | cosvariableb | bytea |  | YES | NULL |

### comunproccontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpcpccid | numeric | 10,0 | NO | NULL |
| 2 | cpcaltaconpcsid | numeric | 10,0 | YES | NULL |
| 3 | cpcbienvpcsid | numeric | 10,0 | YES | NULL |
| 4 | cpcdesppcsid | numeric | 10,0 | YES | NULL |

### comupermis
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmpetcmid | numeric | 5,0 | NO | NULL |
| 2 | cmpeperfid | numeric | 5,0 | NO | NULL |
| 3 | cmpesnmsg | character | 1 | NO | NULL |

### concbontao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cbtexpid | numeric | 5,0 | NO | NULL |
| 2 | cbtsoc | numeric | 10,0 | NO | NULL |
| 3 | cbtotconid | numeric | 5,0 | NO | NULL |
| 4 | cbttipobonif | numeric | 5,0 | NO | NULL |
| 5 | cbttiptid | numeric | 5,0 | NO | 1 |

### concbonvartao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cbvtexpid | numeric | 5,0 | NO | NULL |
| 2 | cbvtsoc | numeric | 10,0 | NO | NULL |
| 3 | cbvtotconid | numeric | 5,0 | NO | NULL |
| 4 | cbvttiptid | numeric | 5,0 | NO | 1 |
| 5 | cbvttipobonif | numeric | 5,0 | NO | NULL |
| 6 | cbvttipvar | numeric | 5,0 | NO | NULL |
| 7 | cbvtvalorvar | numeric | 18,6 | NO | NULL |

### conccontao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cctexpid | numeric | 5,0 | NO | NULL |
| 2 | ccttipcptoconttao | numeric | 10,0 | NO | NULL |
| 3 | ccttxtid | numeric | 10,0 | NO | NULL |

### conccontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ccclasecon | character | 2 | NO | NULL |
| 2 | cctipocon | character | 2 | NO | NULL |
| 3 | ccexpid | numeric | 5,0 | NO | NULL |
| 4 | ccconcepto | numeric | 5,0 | NO | NULL |
| 5 | cctarifa | numeric | 5,0 | NO | NULL |
| 6 | ccmodoasig | numeric | 5,0 | NO | NULL |

### conccontrptos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ccptid | numeric | 10,0 | NO | NULL |
| 2 | ccptptosid | numeric | 10,0 | NO | NULL |
| 3 | ccptclsccod | character | 2 | NO | NULL |
| 4 | ccpttarconceid | numeric | 5,0 | NO | NULL |
| 5 | ccpttarexpid | numeric | 5,0 | NO | NULL |
| 6 | ccpttartiptid | numeric | 5,0 | NO | NULL |
| 7 | ccptsnoblig | character | 1 | NO | NULL |
| 8 | ccpthstusu | character varying | 10 | NO | NULL |
| 9 | ccpthsthora | timestamp without time zone |  | NO | NULL |

### concentrador
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | conid | numeric | 10,0 | NO | NULL |
| 2 | condesc | character varying | 50 | YES | NULL |
| 3 | conexpid | numeric | 5,0 | NO | NULL |
| 4 | conhstusu | character varying | 10 | NO | NULL |
| 5 | conhsthora | timestamp without time zone |  | NO | NULL |

### conceptao
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctaoexpid | numeric | 5,0 | NO | NULL |
| 2 | ctasoc | numeric | 10,0 | NO | NULL |
| 3 | ctaotconid | numeric | 5,0 | NO | NULL |
| 4 | ctaoconctao | numeric | 5,0 | NO | NULL |
| 5 | ctaoconconttao | numeric | 10,0 | NO | NULL |
| 6 | ctaoprioridad | numeric | 5,0 | NO | NULL |
| 7 | ctatippartar | numeric | 5,0 | NO | 1 |
| 8 | ctaosnexclconsbl | character | 1 | NO | 'N'::bpchar |
| 9 | ctatipfich | numeric |  | NO | NULL |

### concepto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cptoexpid | numeric | 5,0 | NO | NULL |
| 2 | cptotconid | numeric | 5,0 | NO | NULL |
| 3 | cptoorigen | numeric | 5,0 | NO | NULL |
| 4 | cptoorden | numeric | 5,0 | NO | NULL |
| 5 | cptovigente | character | 1 | NO | NULL |
| 6 | cptosnfacalt | character | 1 | NO | NULL |
| 7 | cptosnfacbaj | character | 1 | NO | NULL |
| 8 | cptotxtid | numeric | 10,0 | YES | NULL |
| 9 | cptosnimptar | character | 1 | NO | NULL |
| 10 | cptosnimpsub | character | 1 | NO | NULL |
| 11 | cptosnimpreg | character | 1 | NO | NULL |
| 12 | cptodevclte | character | 1 | NO | 'N'::bpchar |
| 13 | cptocompdeuda | character | 1 | NO | 'N'::bpchar |
| 14 | cptotrasctit | character | 1 | NO | 'N'::bpchar |
| 15 | cptoidtxtadic | numeric | 10,0 | YES | NULL |
| 16 | cptotpvid | numeric | 5,0 | YES | NULL |
| 17 | cptotratam | numeric | 5,0 | NO | NULL |
| 18 | cptotiposub | numeric | 5,0 | YES | NULL |
| 19 | cptosocsub | numeric | 10,0 | YES | NULL |
| 20 | cptohstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 21 | cptohsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 22 | cptosnapertrns | character | 1 | NO | 'S'::bpchar |
| 23 | cptosnimpcero | character | 1 | NO | 'S'::bpchar |
| 24 | cptosncaldemora | character | 1 | NO | 'N'::bpchar |
| 25 | cptosnintdem | character | 1 | NO | 'N'::bpchar |
| 26 | cptocpvid | numeric | 5,0 | YES | NULL |
| 27 | cptosnfacunavez | character | 1 | NO | 'N'::bpchar |
| 28 | cptosbcptoregest | numeric | 5,0 | YES | NULL |

### conceptodeuda
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cncdid | numeric | 10,0 | NO | NULL |
| 2 | cncdcnttnum | numeric | 10,0 | NO | NULL |
| 3 | cncdsocprsid | numeric | 10,0 | NO | NULL |
| 4 | cncdfcambio | date |  | NO | NULL |
| 5 | cncdcptoexpid | numeric | 5,0 | NO | NULL |
| 6 | cncdcptotconid | numeric | 5,0 | NO | NULL |
| 7 | cncddeudaint | numeric | 18,2 | YES | NULL |
| 8 | cncddeudanoint | numeric | 18,2 | YES | NULL |
| 9 | cncdsaldoint | numeric | 18,2 | YES | NULL |
| 10 | cncdsaldonoint | numeric | 18,2 | YES | NULL |
| 11 | cncdsntieneint | character | 1 | NO | 'N'::bpchar |

### conceptosov
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpovid | numeric | 5,0 | NO | NULL |
| 2 | cpovtxtid | numeric | 10,0 | NO | NULL |

### conceptoszgz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cptozgztptarifa | numeric | 5,0 | NO | NULL |
| 2 | cptozgzcptoexpid | numeric | 5,0 | NO | NULL |
| 3 | cptozgzcptotconid | numeric | 5,0 | NO | NULL |

### concexpord
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | conid | numeric | 10,0 | NO | NULL |
| 2 | conexpid | numeric | 5,0 | NO | NULL |
| 3 | conorden | numeric | 5,0 | NO | NULL |
| 4 | contipolinea | numeric | 5,0 | NO | NULL |
| 5 | conidconcepto | numeric | 5,0 | YES | NULL |
| 6 | conidagrupacion | numeric | 5,0 | YES | NULL |
| 7 | conusuario | character varying | 10 | NO | NULL |
| 8 | confecha | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### concimpag
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpiexpid | numeric | 5,0 | NO | NULL |
| 2 | cpicptoid | numeric | 5,0 | NO | NULL |
| 3 | cpittarid | numeric | 5,0 | NO | NULL |
| 4 | cpifecapl | date |  | NO | NULL |
| 5 | cpisubcid | numeric | 5,0 | NO | NULL |
| 6 | cpitconid | numeric | 5,0 | NO | NULL |

### conctipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctcntctcod | numeric | 10,0 | NO | NULL |
| 2 | ctcnexpid | numeric | 5,0 | NO | NULL |
| 3 | ctcncptoid | numeric | 5,0 | NO | NULL |
| 4 | ctcnsnoblig | character | 1 | NO | NULL |
| 5 | ctcnmasigtar | numeric | 5,0 | NO | NULL |
| 6 | ctcntarbase | numeric | 5,0 | YES | NULL |
| 7 | ctcnhstusu | character varying | 10 | NO | NULL |
| 8 | ctcnhsthora | timestamp without time zone |  | NO | NULL |

### condocfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cifid | numeric | 10,0 | NO | NULL |
| 2 | cifsolhora | time without time zone |  | NO | NULL |
| 3 | cifsolsesid | numeric | 10,0 | NO | NULL |
| 4 | cifsolicitante | character varying | 50 | NO | NULL |
| 5 | cifprsid | numeric | 10,0 | YES | NULL |
| 6 | cifnumdir | numeric | 5,0 | YES | NULL |
| 7 | cifestado | numeric | 5,0 | NO | NULL |
| 8 | cifemisesid | numeric | 10,0 | YES | NULL |
| 9 | cifdcfaid | numeric | 10,0 | NO | NULL |
| 10 | ciftpenvio | numeric | 5,0 | NO | 1 |

### condpasoproced
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cppid | numeric | 10,0 | NO | NULL |
| 2 | cpppasid | numeric | 10,0 | NO | NULL |
| 3 | cpptpcond | numeric | 5,0 | NO | NULL |
| 4 | cpplistval | character | 100 | YES | NULL |
| 5 | cppvalnum | numeric | 10,0 | YES | NULL |
| 6 | cppvalnumhasta | numeric | 10,0 | YES | NULL |
| 7 | cpphstusu | character varying | 10 | YES | NULL::character varying |
| 8 | cpphsthora | timestamp without time zone |  | YES | NULL |
| 9 | cpppasomaestro | numeric | 10,0 | YES | NULL |

### conexequicont
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnxepeqid | numeric | 10,0 | NO | NULL |
| 2 | cnxcontid | numeric | 10,0 | NO | NULL |

### conexionsatelitales
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnxsatid | numeric | 10,0 | NO | NULL |
| 2 | cnxsatvalidacionid | numeric | 10,0 | NO | NULL |
| 3 | cnxsatservnombre | character varying | 128 | NO | NULL |
| 4 | cnxsatservinst | numeric | 5,0 | NO | NULL |
| 5 | cnxsatsistema | character varying | 128 | NO | NULL |
| 6 | cnxsaturlsistema | character varying | 256 | YES | NULL |
| 7 | cnxsatfecha | timestamp without time zone |  | YES | NULL |
| 8 | cnxsatusuario | character varying | 10 | YES | NULL |
| 9 | cnxsatrespuesta | numeric | 5,0 | YES | NULL |
| 10 | cnxsaterror | character varying | 1200 | YES | NULL |

### confacpcp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cfpgscid | numeric | 10,0 | NO | NULL |
| 2 | cfpprioridad | numeric | 5,0 | NO | NULL |
| 3 | cfpcfid | numeric | 10,0 | NO | NULL |
| 4 | cfpdescuento | numeric | 6,2 | NO | NULL |

### configpeticion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpservidor | character varying | 15 | NO | NULL |
| 2 | cppettipo | numeric | 5,0 | NO | NULL |
| 3 | cpnivel1 | character | 1 | NO | NULL |
| 4 | cpnivel2 | character | 1 | NO | NULL |
| 5 | cpnivel3 | character | 1 | NO | NULL |

### conmensaje
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmencodigo | numeric | 5,0 | NO | NULL |
| 2 | cmenexpid | numeric | 5,0 | NO | NULL |
| 3 | cmentmenid | numeric | 10,0 | NO | NULL |
| 4 | cmenvigdes | date |  | YES | NULL |
| 5 | cmenvighas | date |  | YES | NULL |
| 6 | cmenaplian | numeric | 5,0 | YES | NULL |
| 7 | cmenaplipd | numeric | 5,0 | YES | NULL |
| 8 | cmenaplind | numeric | 5,0 | YES | NULL |
| 9 | cmenapliah | numeric | 5,0 | YES | NULL |
| 10 | cmenapliph | numeric | 5,0 | YES | NULL |
| 11 | cmenaplinh | numeric | 5,0 | YES | NULL |
| 12 | cmenexpzonid | numeric | 5,0 | YES | NULL |
| 13 | cmenzonid | character varying | 500 | YES | NULL |
| 14 | cmenlocid | character varying | 500 | YES | NULL |
| 15 | cmencanaid | character varying | 500 | YES | NULL |
| 16 | cmenactivo | character | 1 | NO | NULL |
| 17 | cmenclaid | character varying | 500 | YES | NULL |
| 18 | cmenusocod | numeric | 5,0 | YES | NULL |
| 19 | cmeninstcont | character | 1 | YES | NULL |
| 20 | cmensocpropexpid | numeric | 5,0 | YES | NULL |
| 21 | cmensocprop | numeric | 10,0 | YES | NULL |
| 22 | cmenperiid | numeric | 5,0 | YES | NULL |
| 23 | cmenlistcontr | text |  | YES | NULL |
| 24 | cmentpvid | character varying | 500 | YES | NULL |
| 25 | cmenproducto | numeric | 5,0 | YES | NULL |
| 26 | cmenhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 27 | cmenhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 28 | cmenschid | numeric | 5,0 | YES | NULL |
| 29 | cmensshid | numeric | 10,0 | YES | NULL |
| 30 | cmenlecval | numeric | 5,0 | NO | 0 |
| 31 | cmensistelec | character varying | 50 | YES | NULL |

### consintfav
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cifcinid | numeric | 10,0 | NO | NULL |
| 2 | cifusuid | character varying | 10 | NO | NULL |

### constantes
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | consobj | character varying | 60 | NO | NULL |
| 2 | conscod | character varying | 60 | NO | NULL |
| 3 | constxtid | numeric | 10,0 | NO | NULL |
| 4 | conshstusu | character varying | 10 | NO | NULL |
| 5 | conshsthora | timestamp without time zone |  | NO | NULL |

### consuacom
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | caacoid | numeric | 10,0 | NO | NULL |
| 2 | caanno | numeric | 5,0 | NO | NULL |
| 3 | caperiodi | numeric | 5,0 | NO | NULL |
| 4 | caperiodo | numeric | 5,0 | NO | NULL |
| 5 | cafecha | date |  | NO | NULL |
| 6 | caconsumo | numeric | 10,0 | NO | NULL |
| 7 | caannoperf | numeric | 10,0 | NO | NULL |
| 8 | caannoperr | numeric | 10,0 | NO | NULL |

### consuinter
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cinid | numeric | 10,0 | NO | NULL |
| 2 | cingrupo | character varying | 40 | NO | NULL |
| 3 | cindescrip | character varying | 60 | NO | NULL |
| 4 | cindescril | character varying | 400 | YES | NULL |
| 5 | cinpermiso | character varying | 35 | NO | NULL |
| 6 | cinaplazad | character | 1 | NO | NULL |
| 7 | cinquery | text |  | NO | NULL |
| 8 | cinhorpla | time without time zone |  | YES | NULL |
| 9 | cindbcopia | character | 1 | NO | 'S'::bpchar |
| 10 | cinnombre | character varying | 20 | NO | NULL |
| 11 | cinusucrea | character varying | 30 | NO | NULL |

### consumoanual
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | csaanno | numeric | 5,0 | NO | NULL |
| 2 | csaexpid | numeric | 5,0 | NO | NULL |
| 3 | csausocod | numeric | 5,0 | NO | NULL |
| 4 | csaconsumo | numeric | 10,0 | NO | NULL |
| 5 | csanumcntts | numeric | 10,0 | NO | NULL |
| 6 | csavarnviv | numeric | 5,0 | YES | NULL |
| 7 | csanumprs | numeric | 5,0 | NO | 1 |
| 8 | csavarnprs | numeric | 5,0 | YES | NULL |

### consuparam
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpaid | numeric | 10,0 | NO | NULL |
| 2 | cpaorden | numeric | 5,0 | NO | NULL |
| 3 | cpatipo | character varying | 20 | NO | NULL |
| 4 | cpaetiquet | character varying | 30 | YES | NULL |

### consuvalfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cvfexpid | numeric | 5,0 | NO | NULL |
| 2 | cvfcptoid | numeric | 5,0 | NO | NULL |
| 3 | cvfttarid | numeric | 5,0 | NO | NULL |
| 4 | cvfperiid | numeric | 5,0 | NO | NULL |
| 5 | cvfconsmin | numeric | 10,0 | NO | NULL |
| 6 | cvfconsmax | numeric | 10,0 | NO | NULL |
| 7 | cvfporceninf | numeric | 10,2 | NO | NULL |
| 8 | cvfporcensup | numeric | 10,2 | NO | NULL |
| 9 | cvfhstusu | character varying | 10 | NO | NULL |
| 10 | cvfhsthora | timestamp without time zone |  | NO | NULL |

### contacto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctcid | numeric | 10,0 | NO | NULL |
| 2 | ctctctid | numeric | 5,0 | NO | NULL |
| 3 | ctcmtcid | numeric | 5,0 | NO | NULL |
| 4 | ctcviacod | character | 2 | NO | NULL |
| 5 | ctcexpid | numeric | 5,0 | NO | NULL |
| 6 | ctccnttnum | numeric | 10,0 | YES | NULL |
| 7 | ctccliid | numeric | 10,0 | YES | NULL |
| 8 | ctcprsid | numeric | 10,0 | NO | NULL |
| 9 | ctcsnentrada | character | 1 | NO | NULL |
| 10 | ctcsnautom | character | 1 | NO | NULL |
| 11 | ctcobsid | numeric | 10,0 | YES | NULL |
| 12 | ctcsesid | numeric | 10,0 | NO | NULL |
| 13 | ctchora | timestamp without time zone |  | NO | NULL |
| 14 | ctctxtaviso | character varying | 250 | YES | NULL |
| 15 | ctcusudest | character varying | 10 | YES | NULL |

### contador
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | contid | numeric | 10,0 | NO | NULL |
| 2 | contdirid | numeric | 10,0 | NO | NULL |
| 3 | contmarcid | numeric | 5,0 | YES | NULL |
| 4 | contmodid | numeric | 5,0 | YES | NULL |
| 5 | contcalimm | numeric | 5,0 | YES | NULL |
| 6 | contnumero | character varying | 12 | YES | NULL |
| 7 | contfecins | date |  | YES | NULL |
| 8 | contfecbaj | date |  | YES | NULL |
| 9 | contestado | numeric | 5,0 | NO | NULL |
| 10 | contnumesf | numeric | 5,0 | NO | NULL |
| 11 | contsegeid | numeric | 10,0 | YES | NULL |
| 12 | contanofab | numeric | 5,0 | YES | NULL |
| 13 | contsnprop | character | 1 | NO | NULL |
| 14 | contaveria | character | 1 | NO | NULL |
| 15 | conthstusu | character varying | 10 | NO | USER |
| 16 | conthsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 17 | contprecsusp | character | 1 | YES | NULL |
| 18 | contnumprecsusp | character | 10 | YES | NULL |
| 19 | contfecprecsusp | date |  | YES | NULL |
| 20 | contfecdprecsusp | date |  | YES | NULL |
| 21 | contprecseg | character | 1 | YES | NULL |
| 22 | contnumprecseg | character | 10 | YES | NULL |
| 23 | contmodcomunic | character varying | 20 | YES | NULL |
| 24 | contsnvalreten | character | 1 | YES | NULL |
| 25 | contindicadornhc | character | 1 | YES | NULL |
| 26 | contsistelec | numeric | 5,0 | YES | NULL |
| 27 | contsnactivarov | character | 1 | NO | 'N'::bpchar |
| 28 | conttipotelec | numeric | 5,0 | YES | NULL |
| 29 | contelec | character | 1 | NO | 'N'::bpchar |
| 30 | contpdtemdm | character | 1 | NO | 'N'::bpchar |

### contgcob
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cgcgcobprsid | numeric | 10,0 | NO | NULL |
| 2 | cgcgcobexpid | numeric | 5,0 | NO | NULL |
| 3 | cgccnttnum | numeric | 10,0 | NO | NULL |
| 4 | cgcsngestcobro | character | 1 | NO | 'S'::bpchar |
| 5 | cgcsngestcorreo | character | 1 | NO | 'S'::bpchar |
| 6 | cgchstusu | character varying | 10 | NO | NULL |
| 7 | cgchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### contmodlec
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmlcontid | numeric | 10,0 | NO | NULL |
| 2 | cmlfecini | timestamp without time zone |  | NO | NULL |
| 3 | cmlmodalidad | numeric | 5,0 | NO | NULL |
| 4 | cmlfecfin | timestamp without time zone |  | YES | NULL |

### contnivelcorte
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnccnttnum | numeric | 10,0 | NO | NULL |
| 2 | cncnconivel | numeric | 5,0 | NO | NULL |
| 3 | cnccontador | numeric | 5,0 | NO | NULL |

### contpersautgest
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpagcnttnum | numeric | 10,0 | NO | NULL |
| 2 | cpagprsid | numeric | 10,0 | NO | NULL |
| 3 | cpaggsaid | numeric | 5,0 | NO | NULL |
| 4 | cpagestado | numeric | 5,0 | YES | NULL |
| 5 | cpagfecestado | timestamp without time zone |  | YES | NULL |
| 6 | cpaghstusu | character varying | 10 | YES | NULL |
| 7 | cpaghsthora | timestamp without time zone |  | YES | NULL |

### contpersautoriz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cpacnttnum | numeric | 10,0 | NO | NULL |
| 2 | cpaprsid | numeric | 10,0 | NO | NULL |
| 4 | cpatpaid | numeric | 5,0 | YES | NULL |
| 6 | cpafecreg | timestamp without time zone |  | NO | CURRENT_DATE |
| 8 | cpahstusu | character varying | 10 | YES | NULL |
| 9 | cpahsthora | timestamp without time zone |  | YES | NULL |
| 10 | cpamovil | character varying | 16 | YES | NULL |
| 11 | cpaprfmovil | character varying | 5 | YES | NULL |
| 12 | cpamailtxt | character varying | 150 | YES | NULL |

### contprocrecl
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cprcnttnum | numeric | 10,0 | NO | NULL |
| 2 | cprproceso | numeric | 10,0 | NO | NULL |

### contratahorr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cahcnttnum | numeric | 10,0 | NO | NULL |
| 2 | cahexpid | numeric | 5,0 | NO | NULL |
| 3 | cahusoext | character varying | 2 | YES | NULL |
| 4 | cahcalimm | numeric | 5,0 | YES | NULL |
| 5 | cahorrador | character | 1 | NO | NULL |
| 6 | cahestado | character | 1 | NO | NULL |
| 7 | cahfechaini | date |  | YES | NULL |
| 8 | cahfechafin | date |  | YES | NULL |
| 9 | cahantconsumo | numeric | 10,0 | YES | NULL |
| 10 | cahultconsumo | numeric | 10,0 | YES | NULL |
| 11 | cahantdias | numeric | 5,0 | YES | NULL |
| 12 | cahultdias | numeric | 5,0 | YES | NULL |
| 13 | cahcodmotivo | numeric | 5,0 | YES | NULL |
| 14 | cahdescmotivo | character varying | 100 | YES | NULL |
| 15 | cahparte | numeric | 5,0 | YES | NULL |

### contratdoc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cdoccnttnum | numeric | 10,0 | NO | NULL |
| 2 | cdocdconid | numeric | 10,0 | NO | NULL |
| 3 | cdocorigen | numeric | 5,0 | NO | 1 |
| 4 | cdocpresen | character | 1 | NO | NULL |

### contratist
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctracod | numeric | 5,0 | NO | NULL |
| 2 | ctradesc | character varying | 80 | NO | NULL |
| 3 | ctrawebuser | character varying | 15 | YES | NULL |
| 4 | ctrawebpass | character varying | 10 | YES | NULL |
| 5 | ctrahstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 6 | ctrahsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 7 | ctrasnpropio | character | 1 | NO | 'S'::bpchar |
| 8 | ctradiasplazo | numeric | 5,0 | YES | NULL |

### contrato
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cnttnum | numeric | 10,0 | NO | NULL |
| 2 | cnttexpid | numeric | 5,0 | NO | NULL |
| 3 | cnttptosid | numeric | 10,0 | NO | NULL |
| 4 | cnttcliid | numeric | 10,0 | NO | NULL |
| 5 | cntttctcod | numeric | 10,0 | NO | NULL |
| 6 | cnttsnformal | character | 1 | NO | NULL |
| 7 | cnttorgcont | numeric | 5,0 | YES | NULL |
| 8 | cnttestado | numeric | 5,0 | NO | NULL |
| 9 | cnttfcaduci | date |  | YES | NULL |
| 10 | cnttfprdoc | date |  | YES | NULL |
| 11 | cnttscobid | numeric | 10,0 | NO | NULL |
| 12 | cnttprccams | numeric | 10,0 | NO | NULL |
| 13 | cnttfprsid | numeric | 10,0 | NO | NULL |
| 14 | cnttfnumdir | numeric | 5,0 | NO | NULL |
| 15 | cnttcprsid | numeric | 10,0 | NO | NULL |
| 16 | cnttcnumdir | numeric | 5,0 | NO | NULL |
| 17 | cnttproinq | character | 1 | NO | NULL |
| 18 | cnttpropid | numeric | 10,0 | YES | NULL |
| 19 | cnttinquid | numeric | 10,0 | YES | NULL |
| 20 | cnttusocod | numeric | 5,0 | NO | NULL |
| 21 | cnttactivid | numeric | 5,0 | NO | NULL |
| 22 | cnttcateid | numeric | 5,0 | YES | NULL |
| 23 | cnttagruid | numeric | 5,0 | YES | NULL |
| 24 | cnttidicodigo | character | 2 | YES | NULL |
| 25 | cntttipfact | numeric | 5,0 | NO | NULL |
| 26 | cnttnumcopias | numeric | 5,0 | NO | NULL |
| 27 | cnttexenfac | character | 1 | NO | NULL |
| 28 | cnttrepfac | character | 1 | NO | NULL |
| 29 | cnttdiasvto | numeric | 5,0 | YES | NULL |
| 30 | cnttumbral | numeric | 10,2 | YES | NULL |
| 31 | cnttinspecc | character | 1 | NO | NULL |
| 32 | cnttesticer | character | 1 | NO | NULL |
| 33 | cnttcortep | character | 1 | NO | NULL |
| 34 | cntttipgesd | numeric | 5,0 | NO | NULL |
| 35 | cnttprrid | numeric | 10,0 | YES | NULL |
| 36 | cnttobsid | numeric | 10,0 | YES | NULL |
| 37 | cnttdochabit | character varying | 15 | YES | NULL |
| 38 | cnttfdochabit | date |  | YES | NULL |
| 39 | cnttboletin | character varying | 9 | YES | NULL |
| 40 | cnttfboletin | date |  | YES | NULL |
| 41 | cnttpcnprsid | numeric | 10,0 | YES | NULL |
| 42 | cnttpcncnaecod | numeric | 10,0 | YES | NULL |
| 43 | cnttsnfraude | character | 1 | NO | NULL |
| 44 | cnttrefant | character | 12 | YES | NULL |
| 45 | cnttrefext | character | 15 | YES | NULL |
| 46 | cnttdiaslimpago | numeric | 5,0 | YES | NULL |
| 47 | cnttsnnotifmail | character | 1 | NO | NULL |
| 48 | cnttsnnotifsms | character | 1 | NO | NULL |
| 49 | cnttsnreclcad | character | 1 | NO | NULL |
| 50 | cnttprppid | numeric | 10,0 | YES | NULL |
| 51 | cnttsnlisrob | character | 1 | NO | NULL |
| 52 | cntthstusu | character varying | 10 | NO | NULL |
| 53 | cntthsthora | timestamp without time zone |  | NO | NULL |
| 54 | cnttnotifprsid1 | numeric | 10,0 | YES | NULL |
| 55 | cnttnotifnumdir1 | numeric | 5,0 | YES | NULL |
| 56 | cnttnotifprsid2 | numeric | 10,0 | YES | NULL |
| 57 | cnttnotifnumdir2 | numeric | 5,0 | YES | NULL |
| 58 | cnttnotifmovil | character varying | 16 | YES | NULL |
| 59 | cntttipenvfact | numeric | 5,0 | NO | 1 |
| 60 | cnttexphub | numeric | 5,0 | YES | NULL |
| 61 | cnttnumexpobra | character varying | 20 | YES | NULL |
| 62 | cnttfecexpobra | date |  | YES | NULL |
| 63 | cntttipofecescr | numeric | 5,0 | YES | NULL |
| 64 | cnttfechaescr | date |  | YES | NULL |
| 65 | cnttpermpubl | character | 1 | NO | 'X'::bpchar |
| 66 | cnttotroprsid | numeric | 10,0 | YES | NULL |
| 67 | cnttrefmid | numeric | 10,0 | YES | NULL |
| 68 | cnttsnfaspare | character | 1 | NO | 'N'::bpchar |
| 69 | cnttplataforma | character varying | 10 | YES | NULL |
| 70 | cnttsubentidad | character varying | 10 | YES | NULL |
| 71 | cnttmejdiarem | numeric | 5,0 | YES | NULL |
| 72 | cnttcpagador | numeric | 5,0 | YES | NULL |
| 73 | cnttcreceptor | numeric | 5,0 | YES | NULL |
| 74 | cnttcfiscal | numeric | 5,0 | YES | NULL |
| 75 | cnttexpcli | character varying | 20 | YES | NULL |
| 76 | cnttinfefac | character varying | 250 | YES | NULL |
| 77 | cnttccomprador | numeric | 5,0 | YES | NULL |
| 78 | cnttnumpedido | character varying | 20 | YES | NULL |
| 79 | cnttnumsecpedido | double precision | 53 | YES | NULL |
| 80 | cnttrenovautoplan | character | 1 | NO | 'N'::bpchar |
| 81 | cnttsnnotifpush | character | 1 | NO | 'N'::bpchar |
| 82 | cnttprfnotifmovil | character varying | 5 | YES | NULL |
| 83 | cnttsnenvefacmdia | character | 1 | NO | 'N'::bpchar |
| 84 | cnttsnctaemi | character | 1 | NO | 'N'::bpchar |
| 85 | cnttsnpagrec | character | 1 | NO | 'N'::bpchar |
| 86 | cnttfeccadrec | character | 4 | YES | NULL |
| 87 | cntttoken | character varying | 40 | YES | NULL |
| 88 | cnttencuestas | character | 1 | NO | 'X'::bpchar |
| 89 | cnttperfilado | character | 1 | NO | 'X'::bpchar |
| 90 | cnttsaldobloq | numeric | 18,2 | YES | 0 |
| 91 | cnttmailnopapelfprsid | numeric | 10,0 | YES | NULL |
| 92 | cnttmailnopapelnumdir | numeric | 5,0 | YES | NULL |
| 93 | cntbloquearcobro | character | 1 | NO | 'N'::bpchar |
| 94 | cnttrgpdanonim | character | 1 | NO | 'N'::bpchar |
| 95 | cnttfspprsid | numeric | 10,0 | YES | NULL |
| 96 | cnttcsbloq | character | 1 | NO | 'N'::bpchar |
| 97 | cnttnoregest | character | 1 | NO | 'N'::bpchar |
| 98 | cnttbloqrgpd | character | 1 | NO | 'N'::bpchar |
| 99 | cnttgrinid | numeric | 5,0 | YES | NULL |
| 100 | cnttnoreghastareal | character | 1 | NO | 'N'::bpchar |
| 101 | cnttsncsesp | character | 1 | NO | 'N'::bpchar |
| 102 | cnttprfmovilnopapel | character varying | 5 | YES | NULL |
| 103 | cnttmovilnopapel | character varying | 16 | YES | NULL |
| 105 | cnttconsumidor | character | 1 | NO | 'S'::bpchar |

### contratodeuda
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cntdid | numeric | 10,0 | NO | NULL |
| 2 | cntdnum | numeric | 10,0 | NO | NULL |
| 3 | cntdfcambio | date |  | YES | NULL |
| 4 | cntddeudaint | numeric | 18,2 | YES | NULL |
| 5 | cntddeudanoint | numeric | 18,2 | YES | NULL |
| 6 | cntddeudafac | numeric | 18,2 | YES | NULL |
| 7 | cntdsaldo | numeric | 18,2 | YES | NULL |
| 8 | cntdintdem | numeric | 18,2 | YES | NULL |
| 9 | cntdnumciclo | numeric | 10,0 | YES | NULL |
| 10 | cntdobserv | character varying | 100 | YES | NULL |
| 11 | cntdsocprop | numeric | 10,0 | YES | NULL |

### contratoprod
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cntpnum | numeric | 10,0 | NO | NULL |
| 2 | cntpprd | numeric | 5,0 | NO | NULL |
| 3 | cntpexpid | numeric | 5,0 | NO | NULL |
| 4 | cntpcesion | character varying | 1 | NO | 'N'::character varying |
| 5 | cntpfecces | timestamp without time zone |  | YES | NULL |
| 6 | cntpactext | character varying | 1 | NO | 'N'::character varying |
| 7 | cntpfeccom | timestamp without time zone |  | YES | NULL |
| 8 | cntpdfacenc | numeric | 10,0 | YES | NULL |
| 9 | cntpftoenc | numeric | 10,0 | YES | NULL |
| 10 | cntpfdevenc | timestamp without time zone |  | YES | NULL |
| 11 | cntpsinocumple | character varying | 1 | NO | 'N'::character varying |
| 12 | cntphstusu | character varying | 10 | NO | NULL |
| 13 | cntphsthora | timestamp without time zone |  | NO | NULL |

### contratoremesa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cntrcnttnum | numeric | 10,0 | NO | NULL |
| 2 | cntrimporte | numeric | 18,2 | YES | NULL |
| 3 | cntrfecenvio | date |  | YES | NULL |
| 4 | cntrfecvto | date |  | YES | NULL |
| 5 | cntrreferencia | numeric | 10,0 | YES | NULL |

### contratos_aplicacion_anticipo_masivo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_contrato_anticipo | integer | 32,0 | NO | nextval('contratos_aplicacion_anticipo_masivo_id_contrato_anticipo_seq'::regclass) |
| 2 | id_contrato | numeric |  | YES | NULL |
| 3 | id_operacion_cartera | numeric |  | YES | NULL |
| 4 | id_gestion_cartera | numeric |  | YES | NULL |
| 5 | id_mov_contrato | numeric |  | YES | NULL |

### contratos_aplicacion_anticipo_masivo_tmp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_contrato_anticipo | integer | 32,0 | NO | nextval('contratos_aplicacion_anticipo_masivo_t_id_contrato_anticipo_seq'::regclass) |
| 2 | id_contrato | numeric |  | YES | NULL |
| 3 | id_operacion_cartera | numeric |  | YES | NULL |
| 4 | id_gestion_cartera | numeric |  | YES | NULL |
| 5 | id_mov_contrato | numeric |  | YES | NULL |
| 6 | importe | numeric |  | YES | NULL |
| 7 | descripcion | text |  | YES | NULL |
| 8 | id_sesion | numeric |  | YES | NULL |
| 9 | fechaaplica | text |  | YES | NULL |

### contratos_saldo_favor_ws
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | no_gestion | numeric |  | YES | NULL |
| 2 | gsctermina | character varying |  | YES | NULL |
| 3 | no_operacion | numeric |  | YES | NULL |
| 4 | explotacion | character varying |  | YES | NULL |
| 5 | id_explotacion | numeric |  | YES | NULL |
| 6 | hora_definitiva | timestamp without time zone |  | YES | NULL |
| 7 | oficina | numeric |  | YES | NULL |
| 8 | contrato | numeric |  | YES | NULL |
| 9 | hora_def | time without time zone |  | YES | NULL |
| 10 | no_desgloce | numeric |  | YES | NULL |
| 11 | referenciapago | character varying |  | YES | NULL |
| 12 | opdfrmpago | numeric |  | YES | NULL |
| 13 | opdsescrea | numeric |  | YES | NULL |
| 14 | importe_pago | numeric |  | YES | NULL |
| 15 | opdfecopeb | timestamp without time zone |  | YES | NULL |
| 16 | opdfecprev | timestamp without time zone |  | YES | NULL |
| 17 | opdasiento | numeric |  | YES | NULL |
| 18 | factura | numeric |  | YES | NULL |
| 19 | facimporte | numeric |  | YES | NULL |
| 20 | facestado | numeric |  | YES | NULL |
| 21 | opdtipopecaja | numeric |  | YES | NULL |
| 22 | fecha | date |  | YES | NULL |
| 23 | bandera | character varying |  | YES | NULL |

### contratosbeneficioacueducto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_beneficio | integer | 32,0 | NO | nextval('contratosbeneficioacueducto_id_beneficio_seq'::regclass) |
| 2 | contrato | numeric |  | YES | NULL |
| 3 | saldobeneficioactual | numeric | 18,2 | YES | NULL |
| 4 | zona | character varying |  | YES | NULL |
| 5 | explotacion | numeric |  | YES | NULL |
| 6 | estatusbeneficio | character varying |  | YES | NULL |
| 7 | fecha_carga | timestamp without time zone |  | YES | NULL |
| 8 | fecha_aplicacion | timestamp without time zone |  | YES | NULL |
| 9 | tipo_contrato | character varying |  | YES | NULL |
| 10 | tipo_servicio | character varying |  | YES | NULL |
| 11 | colonia | character varying |  | YES | NULL |
| 12 | usuario_carga | character varying |  | YES | NULL |
| 13 | id_gescartera | numeric |  | YES | NULL |
| 14 | id_opecargest | numeric |  | YES | NULL |
| 15 | id_opedesglos | numeric |  | YES | NULL |
| 16 | id_movccontrato | numeric |  | YES | NULL |

### contratosbeneficioacueductonoimprime
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_beneficio | integer | 32,0 | NO | nextval('contratosbeneficioacueductonoimprime_id_beneficio_seq'::regclass) |
| 2 | contrato | numeric |  | YES | NULL |
| 3 | saldobeneficioactual | numeric | 18,2 | YES | NULL |
| 4 | zona | character varying |  | YES | NULL |
| 5 | explotacion | numeric |  | YES | NULL |
| 6 | estatusbeneficio | character varying |  | YES | NULL |
| 7 | fecha_carga | timestamp without time zone |  | YES | NULL |
| 8 | fecha_aplicacion | timestamp without time zone |  | YES | NULL |
| 9 | tipo_contrato | character varying |  | YES | NULL |
| 10 | tipo_servicio | character varying |  | YES | NULL |
| 11 | colonia | character varying |  | YES | NULL |
| 12 | usuario_carga | character varying |  | YES | NULL |
| 13 | id_gescartera | numeric |  | YES | NULL |
| 14 | id_opecargest | numeric |  | YES | NULL |
| 15 | id_opedesglos | numeric |  | YES | NULL |
| 16 | id_movccontrato | numeric |  | YES | NULL |

### contratoweb
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cntwcliid | numeric | 10,0 | NO | NULL |
| 2 | cntwcnttnum | numeric | 10,0 | NO | NULL |
| 3 | cntwhstusu | character varying | 10 | NO | 'SERVIDOR'::character varying |
| 4 | cntwhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### contremabo
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | crapraid | numeric | 10,0 | NO | NULL |
| 2 | crabanid | numeric | 5,0 | NO | NULL |
| 3 | cracnttnum | numeric | 10,0 | NO | NULL |
| 4 | cramccid | numeric | 10,0 | NO | NULL |

### contreten
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | crtid | numeric | 10,0 | NO | NULL |
| 2 | crtexpid | numeric | 5,0 | NO | NULL |
| 3 | crtcontid | numeric | 10,0 | NO | NULL |
| 4 | crtcnttnum | numeric | 10,0 | NO | NULL |
| 5 | crtmotivo | numeric | 5,0 | NO | NULL |
| 6 | crtlectura | numeric | 10,0 | NO | NULL |
| 7 | crtconsumo | numeric | 10,0 | YES | NULL |
| 8 | crtestado | numeric | 5,0 | NO | NULL |
| 9 | crtsnauditado | character | 1 | NO | 'N'::bpchar |
| 10 | crtsnqyr | character | 1 | NO | 'N'::bpchar |
| 11 | crtinisesid | numeric | 10,0 | NO | NULL |
| 12 | crtfecini | timestamp without time zone |  | NO | NULL |
| 13 | crtfeclim | date |  | YES | NULL |
| 14 | crtfinsesid | numeric | 10,0 | YES | NULL |
| 15 | crtfecfin | timestamp without time zone |  | YES | NULL |
| 16 | crthstusu | character varying | 10 | NO | NULL |
| 17 | crthsthora | timestamp without time zone |  | NO | NULL |

### control_ajuste_comercial
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_control_ajuste_comercial | numeric | 10,0 | NO | NULL |
| 2 | contrato | numeric | 10,0 | NO | NULL |
| 3 | saldo_variable | numeric | 24,6 | YES | NULL |
| 4 | saldo_pendiente | numeric | 24,6 | YES | NULL |
| 5 | fecha_creacion | timestamp without time zone |  | YES | NULL |
| 6 | fecha_actualiza | timestamp without time zone |  | YES | NULL |
| 7 | usuario | character varying | 10 | YES | NULL |
| 8 | tipo_variable | numeric | 10,0 | YES | NULL |

### control_ajuste_comercial_bitacora
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | id_control_ajuste_comercial_bitacora | numeric | 10,0 | NO | NULL |
| 2 | contrato | numeric | 10,0 | NO | NULL |
| 3 | saldo_variable | numeric | 24,6 | YES | NULL |
| 4 | saldo_aplicado | numeric | 24,6 | YES | NULL |
| 5 | saldo_pendiente | numeric | 24,6 | YES | NULL |
| 6 | fecha_creacion | timestamp without time zone |  | YES | NULL |
| 7 | fecha_aplicacion | timestamp without time zone |  | YES | NULL |
| 8 | usuario_factura | character varying | 10 | YES | NULL |
| 9 | tipo_variable | numeric | 10,0 | YES | NULL |
| 10 | periodo_fact | numeric | 10,0 | NO | NULL |
| 11 | zona_fact | character varying | 5 | YES | NULL |
| 12 | anio_fact | numeric | 10,0 | NO | NULL |
| 13 | exp_fact | numeric | 3,0 | NO | NULL |
| 14 | usuario_cargavariable | character varying | 10 | YES | NULL |

### conttipogestdeuda
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctgdcnttnum | numeric | 10,0 | NO | NULL |
| 2 | ctgdgestion | numeric | 10,0 | NO | NULL |
| 3 | ctgdtipogesdeuda | numeric | 5,0 | YES | NULL |

### convescuela
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cveid | numeric | 10,0 | NO | NULL |
| 2 | cvecnttnum | numeric | 10,0 | NO | NULL |
| 3 | cveidciclodesde | numeric | 10,0 | NO | NULL |
| 4 | cveidciclohasta | numeric | 10,0 | NO | NULL |
| 5 | cvenumpersonas | numeric | 5,0 | NO | NULL |
| 6 | cvedotacion | numeric | 5,0 | NO | NULL |
| 7 | cvedesctarif | character varying | 100 | NO | NULL |
| 8 | cveimptarif | numeric | 18,2 | NO | NULL |
| 9 | cveconsumoaut | numeric | 5,0 | NO | NULL |
| 10 | cveftoid | numeric | 10,0 | NO | NULL |

### corrsubcto
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | crsexpid | numeric | 5,0 | NO | NULL |
| 2 | crscptoid | numeric | 5,0 | NO | NULL |
| 3 | crsttarid | numeric | 5,0 | NO | NULL |
| 4 | crsfecapl | date |  | NO | NULL |
| 5 | crssubcid | numeric | 5,0 | NO | NULL |
| 6 | crscorid | numeric | 10,0 | NO | NULL |
| 7 | crsordaplic | numeric | 5,0 | NO | NULL |
| 8 | crsimpcor | character | 1 | NO | 'N'::bpchar |
| 9 | crshstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 10 | crshsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 11 | crssnseprec | character | 1 | NO | 'N'::bpchar |

### corrtarifa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | corid | numeric | 10,0 | NO | NULL |
| 2 | cordesc | character varying | 100 | NO | NULL |
| 3 | corexpid | numeric | 5,0 | NO | NULL |
| 4 | corcptoid | numeric | 5,0 | NO | NULL |
| 5 | corttarid | numeric | 5,0 | NO | NULL |
| 6 | corfecapl | date |  | NO | NULL |
| 7 | corcndfija | numeric | 5,0 | YES | NULL |
| 8 | cornotcfija | character | 1 | NO | NULL |
| 9 | corcndtpvid | numeric | 5,0 | YES | NULL |
| 10 | cornotctpvid | character | 1 | NO | NULL |
| 11 | corcndperiid | numeric | 5,0 | YES | NULL |
| 12 | cornotcperiid | character | 1 | NO | NULL |
| 13 | corcndperiodos | character | 30 | YES | NULL |
| 14 | corcndtramo | numeric | 5,0 | YES | NULL |
| 15 | cornotctramo | character | 1 | NO | NULL |
| 16 | corcndnumerica | numeric | 5,0 | YES | NULL |
| 17 | cornotcnumerica | character | 1 | NO | NULL |
| 18 | cortipoorgcond | numeric | 5,0 | YES | NULL |
| 19 | corvalorgcond | numeric | 18,6 | YES | NULL |
| 20 | cortvarorgcond | numeric | 5,0 | YES | NULL |
| 21 | corcptoorgcond | numeric | 5,0 | YES | NULL |
| 22 | cortipoprmcond | numeric | 5,0 | YES | NULL |
| 23 | corvalprmcond | numeric | 18,6 | YES | NULL |
| 24 | corvalhprmcond | numeric | 18,6 | YES | NULL |
| 25 | cortvarprmcond | numeric | 5,0 | YES | NULL |
| 26 | corobjaplic | numeric | 5,0 | NO | NULL |
| 27 | coroperacion | numeric | 5,0 | YES | NULL |
| 28 | cortipovalope | numeric | 5,0 | YES | NULL |
| 29 | corvalope | numeric | 18,6 | YES | NULL |
| 30 | cortvarope | numeric | 5,0 | YES | NULL |
| 31 | corcptoope | numeric | 5,0 | YES | NULL |
| 32 | corhstusu | character varying | 10 | NO | NULL |
| 33 | corhsthora | timestamp without time zone |  | NO | NULL |
| 34 | cordesctxtid | numeric | 10,0 | YES | NULL |
| 35 | corimpobj | character | 1 | NO | 'N'::bpchar |
| 36 | corimpres | character | 1 | NO | 'N'::bpchar |
| 37 | cortsubope | numeric | 5,0 | YES | NULL |
| 38 | cornotctpvid2 | character | 1 | NO | 'N'::bpchar |
| 39 | corcndtpvid2 | numeric | 5,0 | YES | NULL |
| 40 | coropervar | character | 1 | YES | NULL |
| 41 | cortipocortar | numeric | 5,0 | NO | 1 |
| 42 | corlistram | character varying | 50 | YES | NULL |
| 43 | cortasocial | numeric | 5,0 | YES | NULL |

### cptocobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctcid | numeric | 10,0 | NO | NULL |
| 2 | ctcpocid | numeric | 10,0 | NO | NULL |
| 3 | ctctccid | numeric | 5,0 | NO | NULL |
| 4 | ctcorigen | numeric | 5,0 | NO | NULL |
| 5 | ctcopeblo | numeric | 10,0 | YES | NULL |
| 6 | ctcopecob | numeric | 10,0 | YES | NULL |
| 7 | ctcplazocob | numeric | 10,0 | YES | NULL |

### cptocobrocobrado
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ctccid | numeric | 10,0 | NO | NULL |
| 2 | ctccctcpocid | numeric | 10,0 | NO | NULL |
| 3 | ctcctccid | numeric | 5,0 | NO | NULL |
| 4 | ctccplazocob | numeric | 10,0 | YES | NULL |

### cptomotfact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cmfmtfcodigo | numeric | 5,0 | NO | NULL |
| 2 | cmftconid | numeric | 5,0 | NO | NULL |

### csc
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | csccodigo | numeric | 5,0 | NO | NULL |
| 2 | cscnif | character varying | 12 | NO | NULL |
| 3 | cscsnactivo | character | 1 | NO | NULL |
| 4 | cscdescripcion | character varying | 60 | YES | NULL |
| 5 | csctcsid | numeric | 5,0 | YES | NULL |
| 6 | cschstusu | character varying | 10 | YES | NULL |
| 7 | cschsthora | timestamp without time zone |  | YES | NULL |

### ctabangest
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cbngsocprsid | numeric | 10,0 | NO | NULL |
| 2 | cbngbanid | numeric | 5,0 | NO | NULL |
| 3 | cbngageid | numeric | 5,0 | NO | NULL |
| 4 | cbngdigcont | character | 2 | NO | NULL |
| 5 | cbngnumcta | character varying | 20 | NO | NULL |
| 6 | cbngcbecodigo | character varying | 6 | YES | NULL |
| 7 | cbngbcrisol | character | 5 | NO | NULL |
| 8 | cbngacrisol | character | 5 | NO | NULL |
| 9 | cbngprincipal | character | 1 | NO | NULL |
| 10 | cbnghstusu | character varying | 10 | NO | NULL |
| 11 | cbnghsthora | timestamp without time zone |  | NO | NULL |
| 12 | cbngiban | character varying | 34 | YES | NULL |
| 13 | cbngcuencob | numeric | 5,0 | YES | NULL |
| 14 | cbnprevcobro | character | 15 | YES | NULL |

### ctafrmpagoban
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cfpbbngsoc | numeric | 10,0 | NO | NULL |
| 2 | cfpbbngbanid | numeric | 5,0 | NO | NULL |
| 3 | cfpbcanaid | character | 1 | NO | NULL |
| 4 | cfpbfmpid | numeric | 5,0 | NO | NULL |
| 5 | cfpbngageid | numeric | 5,0 | NO | NULL |
| 6 | cfpbnumcta | character varying | 11 | NO | ''::character varying |

### cuendestin
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cdcuencont | numeric | 5,0 | NO | NULL |
| 2 | cdexpid | numeric | 5,0 | NO | NULL |
| 3 | cdcodigo | character | 10 | NO | NULL |
| 4 | cdptjrecar | numeric | 10,8 | YES | NULL |
| 5 | cdcuenrcgo | numeric | 5,0 | YES | NULL |
| 6 | cdcontracu | numeric | 5,0 | YES | NULL |
| 7 | cddestrec | character | 10 | YES | NULL |
| 8 | cdhstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 9 | cdhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### cuentacont
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ccid | numeric | 5,0 | NO | NULL |
| 2 | ccdescrip | character varying | 60 | NO | NULL |
| 3 | cccodigo | character varying | 10 | NO | NULL |
| 4 | ccindiva | character | 1 | YES | NULL |
| 5 | cccueniva | numeric | 5,0 | YES | NULL |
| 6 | ccindivai | character | 1 | YES | NULL |
| 7 | cccueajust | numeric | 5,0 | YES | NULL |
| 8 | ccindivaca | character | 1 | YES | NULL |
| 9 | ccccueajus | numeric | 5,0 | YES | NULL |
| 10 | ccindivacc | character | 1 | YES | NULL |
| 11 | cccobdupl | character | 1 | NO | NULL |
| 12 | cccuedupli | numeric | 5,0 | YES | NULL |
| 13 | ccsncsc | character | 1 | NO | 'S'::bpchar |
| 14 | cctipo | character | 1 | NO | 'M'::bpchar |
| 15 | ccsocprsid | numeric | 10,0 | NO | NULL |
| 16 | ccsniva | character | 1 | NO | NULL |
| 17 | ccsninfant | character | 1 | NO | NULL |
| 18 | ccsnsustcsc | character | 1 | NO | NULL |
| 19 | ccsndates | character | 1 | NO | NULL |
| 20 | ccniveltes | character | 2 | YES | NULL |
| 21 | cccbecodigo | character varying | 6 | YES | NULL |
| 22 | cchstusu | character varying | 10 | NO | NULL |
| 23 | cchsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 24 | ccsninccont | character | 1 | NO | 'S'::bpchar |
| 25 | cccueivacob | numeric | 5,0 | YES | NULL |
| 26 | ccindivacob | character | 1 | YES | NULL |
| 27 | cccueexiva | numeric | 5,0 | YES | NULL |
| 28 | ccnif | character varying | 15 | YES | NULL |
| 29 | ccsnfiltro | character | 1 | NO | 'N'::bpchar |
| 30 | ccoriaccont | numeric | 5,0 | NO | 1 |
| 31 | ccsnnifexp | character | 1 | NO | 'N'::bpchar |
| 32 | cccuenivamor | numeric | 5,0 | YES | NULL |
| 33 | ccindivamor | character | 1 | YES | NULL |

### cuentasesp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | cesexpid | numeric | 5,0 | NO | NULL |
| 2 | cescamorti | numeric | 5,0 | NO | NULL |
| 3 | cescreceje | numeric | 5,0 | NO | NULL |
| 4 | cescintdem | numeric | 5,0 | NO | NULL |
| 5 | cescintcp | numeric | 5,0 | NO | NULL |
| 6 | ceshstusu | character varying | 10 | NO | NULL |
| 7 | ceshsthora | timestamp without time zone |  | NO | NULL |
| 8 | cescdesmor | numeric | 5,0 | YES | NULL |
| 9 | cescrecfac | numeric | 5,0 | YES | NULL |

### dbsemaphore
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dbsorigin | numeric | 5,0 | NO | NULL |
| 2 | dbsid | character varying | 32 | NO | NULL |
| 3 | dbsminlimit | numeric | 5,0 | NO | NULL |
| 4 | dbshora | timestamp without time zone |  | NO | NULL |

### decimpdettmtr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | didcodigo | numeric | 10,0 | YES | NULL |
| 2 | didcontrato | numeric | 10,0 | YES | NULL |
| 3 | didfeclecant | date |  | YES | NULL |
| 4 | didfeclecact | date |  | YES | NULL |
| 5 | didfecemifac | date |  | YES | NULL |
| 6 | didempresa | character | 2 | YES | NULL |
| 7 | didnumfac | character | 18 | YES | NULL |
| 8 | didestadofac | numeric | 5,0 | YES | NULL |
| 9 | didtipsubcon | character varying | 256 | YES | NULL |
| 10 | didtipcuota | character | 3 | YES | NULL |
| 11 | didcodtardom | character | 3 | YES | NULL |
| 12 | didvarfac | character varying | 256 | YES | NULL |
| 13 | didvalvarfac | numeric | 18,6 | YES | NULL |
| 14 | didcodvarfac | character | 3 | YES | NULL |
| 15 | didimporte | numeric | 18,2 | YES | NULL |
| 16 | didimpreg | numeric | 18,2 | YES | NULL |
| 17 | didannodesc | numeric | 10,0 | YES | NULL |
| 18 | difsitvulnera | character | 1 | YES | NULL |

### decimpfactmtr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | difcodigo | numeric | 10,0 | NO | NULL |
| 2 | difsocemisora | numeric | 10,0 | NO | NULL |
| 3 | difsocprop | numeric | 10,0 | NO | NULL |
| 4 | difexpid | numeric | 5,0 | NO | NULL |
| 5 | difpobid | numeric | 10,0 | NO | NULL |
| 6 | diffacnumfac | character | 18 | NO | NULL |
| 7 | difconid | numeric | 5,0 | NO | NULL |
| 8 | difttarid | numeric | 5,0 | NO | NULL |
| 9 | diftsubid | numeric | 5,0 | NO | NULL |
| 10 | difimporte | numeric | 18,2 | YES | NULL |
| 11 | difcnttnum | numeric | 10,0 | YES | NULL |

### decimptmtr
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dicodigo | numeric | 10,0 | NO | NULL |
| 2 | disocliq | numeric | 10,0 | NO | NULL |
| 3 | disocprop | numeric | 10,0 | NO | NULL |
| 4 | difecdesde | date |  | NO | NULL |
| 5 | difechasta | date |  | NO | NULL |
| 6 | didescripcion | character varying | 250 | NO | NULL |
| 7 | diestado | numeric | 5,0 | NO | NULL |
| 8 | dicreadapor | character varying | 10 | NO | NULL |
| 9 | difeccrea | timestamp without time zone |  | NO | NULL |
| 10 | dicalculadapor | character varying | 10 | YES | NULL |
| 11 | difeccalculada | timestamp without time zone |  | YES | NULL |

### decprodver
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dpvid | numeric | 10,0 | NO | NULL |
| 2 | dpvexvid | numeric | 10,0 | NO | NULL |
| 3 | dpvlabora | character varying | 50 | NO | NULL |
| 4 | dpvrefdec | character varying | 50 | NO | NULL |
| 5 | dpvfdeclar | date |  | NO | NULL |
| 6 | dpvdescrip | character varying | 30 | YES | NULL |

### defcontenedor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | NO | NULL |
| 2 | dcndescrip | character varying | 70 | NO | NULL |
| 3 | dcnversion | numeric | 5,0 | NO | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | NO | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | NO | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defcontenedortmp_1132208128
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | YES | NULL |
| 2 | dcndescrip | character varying | 70 | YES | NULL |
| 3 | dcnversion | numeric | 5,0 | YES | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | YES | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | YES | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defcontenedortmp_14221312
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | YES | NULL |
| 2 | dcndescrip | character varying | 70 | YES | NULL |
| 3 | dcnversion | numeric | 5,0 | YES | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | YES | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | YES | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defcontenedortmp_1518043136
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | YES | NULL |
| 2 | dcndescrip | character varying | 70 | YES | NULL |
| 3 | dcnversion | numeric | 5,0 | YES | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | YES | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | YES | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defcontenedortmp_1725620224
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | YES | NULL |
| 2 | dcndescrip | character varying | 70 | YES | NULL |
| 3 | dcnversion | numeric | 5,0 | YES | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | YES | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | YES | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defcontenedortmp_292978688
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | YES | NULL |
| 2 | dcndescrip | character varying | 70 | YES | NULL |
| 3 | dcnversion | numeric | 5,0 | YES | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | YES | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | YES | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defcontenedortmp_551550976
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | YES | NULL |
| 2 | dcndescrip | character varying | 70 | YES | NULL |
| 3 | dcnversion | numeric | 5,0 | YES | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | YES | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | YES | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defcontenedortmp_74219520
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcnid | numeric | 10,0 | YES | NULL |
| 2 | dcndescrip | character varying | 70 | YES | NULL |
| 3 | dcnversion | numeric | 5,0 | YES | NULL |
| 4 | dcnpadre | numeric | 10,0 | YES | NULL |
| 5 | dcnsnfuncional | character | 1 | YES | NULL |
| 6 | dcnperiod | numeric | 5,0 | YES | NULL |
| 7 | dcndia | numeric | 5,0 | YES | NULL |
| 8 | dcnmes | numeric | 5,0 | YES | NULL |
| 9 | dcnhoraini | time without time zone |  | YES | NULL |
| 10 | dcnhoralim | time without time zone |  | YES | NULL |
| 11 | dcnminper | numeric | 5,0 | YES | NULL |
| 12 | dcnsnacont | character | 1 | YES | NULL |
| 13 | dcnsrvnombre | character varying | 128 | YES | NULL |
| 14 | dcnsrvinst | numeric | 5,0 | YES | NULL |
| 15 | dcnanno | numeric | 5,0 | YES | NULL |

### defimpaplic
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dfpdfiid | numeric | 5,0 | NO | NULL |
| 2 | dfpmtfcod | numeric | 5,0 | NO | NULL |
| 3 | dfpopera | numeric | 5,0 | NO | NULL |
| 4 | dfpsnactivo | character | 1 | NO | NULL |
| 5 | dfphstusu | character varying | 10 | NO | NULL |
| 6 | dfphsthora | timestamp without time zone |  | NO | NULL |

### defimpcptos
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dfcpdfiid | numeric | 5,0 | NO | NULL |
| 2 | dfcptconid | numeric | 5,0 | NO | NULL |
| 3 | dfcphstusu | character varying | 10 | NO | NULL |
| 4 | dfcphsthora | timestamp without time zone |  | NO | NULL |

### defimpreso
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dfiid | numeric | 5,0 | NO | NULL |
| 2 | dfidesc | character varying | 30 | NO | NULL |
| 3 | dfisnperiodic | character | 1 | NO | NULL |
| 4 | dfisnperiodo | character | 1 | NO | NULL |
| 5 | dfisnnumcont | character | 1 | NO | NULL |
| 6 | dfisncalcont | character | 1 | NO | NULL |
| 7 | dfisnlecturas | character | 1 | NO | NULL |
| 8 | dfisnconsumo | character | 1 | NO | NULL |
| 9 | dfisnuso | character | 1 | NO | NULL |
| 10 | dfisntarifas | character | 1 | NO | NULL |
| 11 | dfisndetunid | character | 1 | NO | NULL |
| 12 | dfimsgfijo | character varying | 60 | YES | NULL |
| 13 | dfisnmensajes | character | 1 | NO | NULL |
| 14 | dfisngrafica | character | 1 | NO | NULL |
| 15 | dfisndiptico | character | 1 | NO | NULL |
| 16 | dfisnmsgacredi | character | 1 | NO | NULL |
| 17 | dfisnmsgnojust | character | 1 | NO | NULL |
| 18 | dfisncomplsum | character | 1 | NO | 'N'::bpchar |
| 19 | dfiexploid | numeric | 5,0 | NO | NULL |
| 20 | dfiformper | numeric | 5,0 | YES | NULL |
| 21 | dfisnreal | character | 1 | NO | 'N'::bpchar |
| 22 | dfisnnumfprop | character | 1 | NO | 'N'::bpchar |
| 23 | dfitotconcp | numeric | 5,0 | NO | NULL |
| 24 | dfitxtbaja | numeric | 10,0 | YES | NULL |
| 25 | dfisnimpvar | character | 1 | NO | 'N'::bpchar |
| 26 | dfisnivaexns | character | 1 | NO | 'N'::bpchar |
| 27 | dfitpdid | numeric | 5,0 | NO | NULL |
| 28 | dfipimid | numeric | 5,0 | NO | NULL |
| 29 | dfidescserv | numeric | 5,0 | NO | 0 |
| 30 | dfidirserv | numeric | 5,0 | NO | 0 |
| 31 | dfisntelweb | character | 1 | NO | 'S'::bpchar |
| 32 | dfisnlogos | character | 1 | NO | 'S'::bpchar |
| 33 | dfihstusu | character varying | 10 | NO | 'Conversion'::character varying |
| 34 | dfihsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 35 | dfisnimpregmer | character | 1 | NO | 'S'::bpchar |
| 36 | dfisnemiindep | character | 1 | NO | 'N'::bpchar |
| 37 | dfisnimprisecun | character | 1 | YES | 'N'::bpchar |
| 38 | dfitetid | numeric | 5,0 | YES | NULL |
| 39 | dfimaxptossecun | numeric | 5,0 | YES | NULL |
| 40 | dfisnconsval | character | 1 | YES | 'N'::bpchar |
| 41 | dfisnlitliq | character | 1 | NO | 'N'::bpchar |
| 42 | dfisnimpnuevmod | character | 1 | NO | 'N'::bpchar |
| 43 | dfiformatimp | numeric | 5,0 | NO | 1 |
| 44 | dfisngragastag | character | 1 | NO | 'N'::bpchar |
| 45 | dfinumcolgraf | numeric | 5,0 | NO | 5 |
| 46 | dfigrafgasto | numeric | 5,0 | NO | 0 |

### defmettar
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dmttreid | numeric | 10,0 | NO | NULL |
| 2 | dmtdescm1 | numeric | 10,0 | YES | NULL |
| 3 | dmtdescm2 | numeric | 10,0 | YES | NULL |
| 4 | dmtdescv1 | numeric | 10,0 | YES | NULL |
| 5 | dmtdescv2 | numeric | 10,0 | YES | NULL |

### deftareaencontenedor
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | NO | NULL |
| 2 | dtcdcnid | numeric | 10,0 | NO | NULL |
| 3 | dtctreid | numeric | 10,0 | NO | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### deftareaenconttmp_1132208128
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | YES | NULL |
| 2 | dtcdcnid | numeric | 10,0 | YES | NULL |
| 3 | dtctreid | numeric | 10,0 | YES | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### deftareaenconttmp_14221312
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | YES | NULL |
| 2 | dtcdcnid | numeric | 10,0 | YES | NULL |
| 3 | dtctreid | numeric | 10,0 | YES | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### deftareaenconttmp_1518043136
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | YES | NULL |
| 2 | dtcdcnid | numeric | 10,0 | YES | NULL |
| 3 | dtctreid | numeric | 10,0 | YES | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### deftareaenconttmp_1725620224
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | YES | NULL |
| 2 | dtcdcnid | numeric | 10,0 | YES | NULL |
| 3 | dtctreid | numeric | 10,0 | YES | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### deftareaenconttmp_292978688
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | YES | NULL |
| 2 | dtcdcnid | numeric | 10,0 | YES | NULL |
| 3 | dtctreid | numeric | 10,0 | YES | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### deftareaenconttmp_551550976
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | YES | NULL |
| 2 | dtcdcnid | numeric | 10,0 | YES | NULL |
| 3 | dtctreid | numeric | 10,0 | YES | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### deftareaenconttmp_74219520
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcid | numeric | 10,0 | YES | NULL |
| 2 | dtcdcnid | numeric | 10,0 | YES | NULL |
| 3 | dtctreid | numeric | 10,0 | YES | NULL |
| 4 | dtcparams | character varying | 200 | YES | NULL |
| 5 | dtcexpid | numeric | 5,0 | YES | NULL |
| 6 | dtcsocprsid | numeric | 10,0 | YES | NULL |
| 7 | dtcdepend | numeric | 10,0 | YES | NULL |
| 8 | dtcsnfuncional | character | 1 | YES | NULL |
| 9 | dtcsrvnombre | character varying | 128 | YES | NULL |
| 10 | dtcsrvinst | numeric | 5,0 | YES | NULL |

### defunipobara
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dupacomid | numeric | 5,0 | NO | NULL |
| 2 | dupaproid | numeric | 5,0 | NO | NULL |
| 3 | dupapobid | numeric | 10,0 | NO | NULL |
| 4 | dupalocid | numeric | 10,0 | NO | NULL |
| 5 | dupaine | numeric | 10,0 | YES | NULL |

### departamen
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dptid | numeric | 5,0 | NO | NULL |
| 2 | dptareaid | numeric | 5,0 | NO | NULL |
| 3 | dptcodigo | character | 2 | NO | NULL |
| 4 | dptdescri | character varying | 20 | NO | NULL |

### dependenciatarea
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | idtarea | numeric | 10,0 | NO | NULL |
| 2 | idtareadep | numeric | 10,0 | NO | NULL |

### desbloqsaldodevolivacanon
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | sdipocid | numeric | 10,0 | NO | NULL |
| 2 | sdicnttnum | numeric | 10,0 | NO | NULL |
| 3 | sdiimpmovim | numeric | 18,2 | NO | NULL |
| 4 | sdiimpdesbloq | numeric | 18,2 | NO | NULL |

### descripid
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | txtid | numeric | 10,0 | NO | NULL |

### desgdocupago
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ddpdcpid | numeric | 10,0 | NO | NULL |
| 2 | ddpopdid | numeric | 10,0 | NO | NULL |

### desglosinteres
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dglid | numeric | 10,0 | NO | NULL |
| 2 | dglimpint | numeric | 18,2 | YES | NULL |
| 3 | dglimpnoint | numeric | 18,2 | YES | NULL |
| 4 | dglintfrac | numeric | 18,2 | YES | NULL |
| 5 | dglimpuesfrac | numeric | 18,2 | YES | NULL |
| 6 | dglvencido | character | 1 | NO | 'N'::bpchar |
| 7 | dgltratado | character | 1 | NO | 'N'::bpchar |
| 8 | dglsalgo | numeric | 18,2 | YES | NULL |

### detallebillete
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | debid | numeric | 10,0 | NO | NULL |
| 2 | debapcid | numeric | 10,0 | YES | NULL |
| 3 | debdiaid | numeric | 10,0 | YES | NULL |
| 4 | debrciid | numeric | 10,0 | YES | NULL |
| 5 | debdenomi | numeric | 18,2 | NO | NULL |
| 6 | debcantidad | numeric | 18,2 | NO | NULL |
| 7 | debtotal | numeric | 18,2 | NO | NULL |

### detfacbgm
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dfbbgtid | numeric | 10,0 | NO | NULL |
| 2 | dfbfacid | numeric | 10,0 | NO | NULL |

### deudatmp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | deuexpid | numeric | 5,0 | NO | NULL |
| 2 | deucnttnum | numeric | 10,0 | NO | NULL |
| 3 | deuminfecf | date |  | NO | NULL |
| 4 | deuimporte | numeric | 18,2 | NO | NULL |
| 5 | deuciclos | numeric | 5,0 | NO | NULL |
| 6 | deucicloscorte | numeric | 5,0 | NO | NULL |
| 7 | deucicloslecturas | numeric | 5,0 | NO | NULL |
| 8 | deufeccarga | date |  | NO | NULL |

### devolremesa
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | drocgiddev | numeric | 10,0 | NO | NULL |
| 2 | drocgidcob | numeric | 10,0 | NO | NULL |
| 3 | drnumdevol | numeric | 5,0 | NO | NULL |
| 4 | drimporte | numeric | 18,2 | NO | NULL |

### direccion
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dirid | numeric | 10,0 | NO | NULL |
| 2 | dirtipo | numeric | 5,0 | NO | NULL |
| 3 | dircalid | numeric | 10,0 | YES | NULL |
| 4 | dirparimp | numeric | 5,0 | YES | NULL |
| 5 | dirnumdes | numeric | 10,0 | YES | NULL |
| 6 | dirfinca | numeric | 10,0 | YES | NULL |
| 7 | dircomfin | character | 10 | YES | NULL |
| 8 | dirbloque | character | 4 | YES | NULL |
| 9 | direscal | character | 4 | YES | NULL |
| 10 | dirplanta | character | 4 | YES | NULL |
| 11 | dirpuerta | character | 4 | YES | NULL |
| 12 | dircomplem | character varying | 40 | YES | NULL |
| 13 | dirtexto | character varying | 150 | YES | NULL |
| 14 | dirlocid | numeric | 10,0 | YES | NULL |
| 15 | dircodpost | character varying | 10 | YES | NULL |
| 16 | dirhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 17 | dirhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 18 | dirduplicado | character | 1 | YES | NULL |
| 19 | dirportal | character | 2 | YES | NULL |
| 20 | dirkilometro | numeric | 5,1 | YES | NULL |
| 21 | dircaltxt | character varying | 36 | YES | NULL |
| 22 | dirgeolocid | numeric | 10,0 | YES | NULL |
| 23 | dirgestor | character varying | 120 | YES | NULL |

### direccionaytozaz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dazdirid | numeric | 10,0 | NO | NULL |
| 2 | dazidayto | numeric | 10,0 | NO | NULL |
| 3 | dazhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 4 | daztipo | character | 1 | NO | NULL |

### distriapertura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | diaid | numeric | 10,0 | NO | NULL |
| 2 | diaapcid | numeric | 10,0 | NO | NULL |
| 3 | diausuid | character varying | 10 | NO | NULL |
| 4 | diamonto | numeric | 18,2 | NO | NULL |
| 5 | diafecha | date |  | YES | NULL |
| 6 | diahora | time without time zone |  | YES | NULL |
| 7 | diasaldo | numeric | 18,2 | NO | NULL |

### divnegocio
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dvnid | numeric | 5,0 | NO | NULL |
| 2 | dvndescri | character varying | 60 | NO | NULL |
| 3 | dvncfactura | numeric | 5,0 | NO | NULL |
| 4 | dvnccontf | numeric | 5,0 | NO | NULL |
| 5 | dvnccobro | numeric | 5,0 | NO | NULL |
| 6 | dvncremesa | numeric | 5,0 | NO | NULL |
| 7 | dvnccobdup | numeric | 5,0 | NO | NULL |
| 8 | dvncmoroso | numeric | 5,0 | YES | NULL |
| 9 | dvncdotmor | numeric | 5,0 | YES | NULL |
| 10 | dvnadjid | numeric | 5,0 | NO | NULL |
| 11 | dvnactccodigo | character | 2 | YES | NULL |
| 12 | dvnccperio | numeric | 5,0 | YES | NULL |
| 13 | dvnccddeuda | numeric | 5,0 | YES | NULL |
| 14 | dvnsnnif | character | 1 | NO | NULL |
| 15 | dvnhstusu | character varying | 10 | NO | NULL |
| 16 | dvnhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 17 | dvnccamorti | numeric | 5,0 | YES | NULL |
| 18 | dvnccdotmor | numeric | 5,0 | YES | NULL |
| 19 | dvncdesdotmor | numeric | 5,0 | YES | NULL |
| 20 | dvnccobdif | numeric | 5,0 | YES | NULL |
| 21 | dvncfianza | numeric | 5,0 | YES | NULL |
| 22 | dvnclitxtid | numeric | 10,0 | YES | NULL |
| 23 | dvningtxtid | numeric | 10,0 | YES | NULL |
| 24 | dvndescrisii | character varying | 500 | YES | NULL |
| 25 | dvncdescuento | numeric | 5,0 | YES | NULL |

### dmcsocliqdeu
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dsldexpid | numeric | 5,0 | NO | NULL |
| 2 | dsldsocliq | numeric | 10,0 | NO | NULL |
| 3 | dsldsocemi | numeric | 10,0 | NO | NULL |
| 4 | dsldsocliqant | numeric | 10,0 | YES | NULL |
| 5 | dsldsocemiant | numeric | 10,0 | YES | NULL |
| 6 | dsldfechaini | date |  | NO | NULL |
| 7 | dsldfechafin | date |  | YES | NULL |

### docextfirmaele
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | defeid | numeric | 10,0 | NO | NULL |
| 2 | defenumdoc | numeric | 5,0 | NO | NULL |
| 3 | defetdefeid | numeric | 5,0 | NO | NULL |
| 4 | defeextension | character varying | 10 | NO | NULL |
| 5 | defecontenido | bytea |  | YES | NULL |
| 6 | defedpiid | numeric | 10,0 | YES | NULL |

### docfirmaelectronica
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dfefecid | numeric | 10,0 | NO | NULL |
| 2 | dfenumdoc | numeric | 5,0 | NO | NULL |
| 3 | dfetipo | numeric | 5,0 | NO | NULL |
| 5 | dfedpiid | numeric | 10,0 | YES | NULL |
| 6 | dfeclausulas | character varying | 4000 | YES | NULL |
| 7 | dfetpdid | numeric | 5,0 | YES | NULL |
| 8 | dfepdf | bytea |  | YES | NULL |

### docptesimp
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dpiid | numeric | 10,0 | NO | NULL |
| 2 | dpiexpid | numeric | 5,0 | NO | NULL |
| 3 | dpicnttnum | numeric | 10,0 | NO | NULL |
| 4 | dpitipo | numeric | 5,0 | NO | NULL |
| 5 | dpisescrea | numeric | 10,0 | NO | NULL |
| 6 | dpihoracrea | timestamp without time zone |  | NO | NULL |
| 7 | dpisesimp | numeric | 10,0 | YES | NULL |
| 8 | dpihoraimp | timestamp without time zone |  | YES | NULL |
| 9 | dpidescrip | character varying | 150 | NO | NULL::character varying |
| 10 | dpiddocs | bytea |  | YES | NULL |
| 11 | dpipdf | bytea |  | YES | NULL |
| 12 | dpipccid | numeric | 10,0 | YES | NULL |
| 13 | dpidestprsid | numeric | 10,0 | YES | NULL |
| 14 | dpidestnom | character varying | 250 | YES | NULL |
| 15 | dpitpdid | numeric | 5,0 | YES | NULL |
| 16 | dpicopias | character varying | 6 | YES | NULL |
| 17 | dpirefmid | numeric | 10,0 | YES | NULL |
| 18 | dpidirenvsepa | character | 1 | YES | NULL |
| 19 | dpiautprsid | numeric | 10,0 | YES | NULL |
| 20 | dpiautgsaid | numeric | 5,0 | YES | NULL |

### docptesimp_mig
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dpiid | numeric | 10,0 | NO | NULL |
| 2 | dpiexpid | numeric | 5,0 | YES | NULL |
| 3 | dpicnttnum | numeric | 10,0 | YES | NULL |
| 4 | dpitipo | numeric | 5,0 | YES | NULL |
| 5 | dpisescrea | numeric | 10,0 | YES | NULL |
| 6 | dpihoracrea | timestamp without time zone |  | YES | NULL |
| 7 | dpisesimp | numeric | 10,0 | YES | NULL |
| 8 | dpihoraimp | timestamp without time zone |  | YES | NULL |
| 9 | dpidescrip | character varying | 75 | YES | NULL |
| 10 | dpiddocs | bytea |  | YES | NULL |
| 11 | dpipdf | bytea |  | YES | NULL |
| 12 | dpipccid | numeric | 10,0 | YES | NULL |
| 13 | dpidestprsid | numeric | 10,0 | YES | NULL |
| 14 | dpidestnom | character varying | 250 | YES | NULL |

### docptesimp_mig2
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dpiid | numeric | 10,0 | YES | NULL |
| 2 | dpiexpid | numeric | 5,0 | YES | NULL |
| 3 | dpicnttnum | numeric | 10,0 | YES | NULL |
| 4 | dpitipo | numeric | 5,0 | YES | NULL |
| 5 | dpisescrea | numeric | 10,0 | YES | NULL |
| 6 | dpihoracrea | timestamp without time zone |  | YES | NULL |
| 7 | dpisesimp | numeric | 10,0 | YES | NULL |
| 8 | dpihoraimp | timestamp without time zone |  | YES | NULL |
| 9 | dpidescrip | character varying | 75 | YES | NULL |
| 10 | dpiddocs | bytea |  | YES | NULL |
| 11 | dpipdf | bytea |  | YES | NULL |
| 12 | dpipccid | numeric | 10,0 | YES | NULL |
| 13 | dpidestprsid | numeric | 10,0 | YES | NULL |
| 14 | dpidestnom | character varying | 250 | YES | NULL |

### doctipocontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dtcntctcod | numeric | 10,0 | NO | NULL |
| 2 | dtcndconid | numeric | 10,0 | NO | NULL |
| 3 | dtcnsnactivo | character | 1 | NO | NULL |
| 4 | dtcnorden | numeric | 5,0 | NO | NULL |
| 5 | dtcnhstusu | character varying | 10 | NO | NULL |
| 6 | dtcnhsthora | timestamp without time zone |  | NO | NULL |
| 7 | dtcnsnobligat | character | 1 | NO | 'N'::bpchar |

### docucfd
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcfdcfaid | numeric | 10,0 | NO | NULL |
| 2 | dcfsocemi | numeric | 10,0 | NO | NULL |
| 3 | dcfxml | bytea |  | NO | NULL |
| 4 | dcftipo | numeric | 5,0 | NO | NULL |
| 5 | dcffecha | timestamp without time zone |  | NO | NULL |
| 6 | dcfserie | character varying | 10 | YES | NULL |
| 7 | dcfnumero | numeric | 10,0 | NO | NULL |
| 8 | dcfnumaprob | character varying | 12 | NO | NULL |
| 9 | dcfimporte | numeric | 18,2 | YES | NULL |
| 10 | dcfimpuesto | numeric | 18,2 | YES | NULL |
| 11 | dcfsnvigente | character | 1 | NO | NULL |
| 12 | dcfefecto | character | 1 | YES | NULL |
| 13 | dcfcadorig | character varying | 10000 | NO | NULL |
| 14 | dcfsellodig | character varying | 10000 | NO | NULL |
| 15 | dcfnumcertif | character varying | 50 | NO | NULL |
| 16 | dcfhstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 17 | dcfhsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |
| 18 | dcfsellosat | character varying | 10000 | YES | NULL |
| 19 | dcfnumcertifsat | character varying | 50 | YES | NULL |
| 20 | dcfuuid | character varying | 100 | YES | NULL |
| 21 | dcfcodigoqr | character varying | 200 | YES | NULL |
| 22 | dcfleyendacfdi | character varying | 200 | YES | NULL |
| 23 | dcffechatim | character varying | 40 | YES | NULL |

### docucfd_mig
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcfdcfaid | numeric | 10,0 | YES | NULL |
| 2 | dcfsocemi | numeric | 10,0 | YES | NULL |
| 3 | dcfxml | bytea |  | YES | NULL |
| 4 | dcftipo | numeric | 5,0 | YES | NULL |
| 5 | dcffecha | timestamp without time zone |  | YES | NULL |
| 6 | dcfserie | character varying | 10 | YES | NULL |
| 7 | dcfnumero | numeric | 10,0 | YES | NULL |
| 8 | dcfnumaprob | character varying | 12 | YES | NULL |
| 9 | dcfimporte | numeric | 18,2 | YES | NULL |
| 10 | dcfimpuesto | numeric | 18,2 | YES | NULL |
| 11 | dcfsnvigente | character | 1 | YES | NULL |
| 12 | dcfefecto | character | 1 | YES | NULL |
| 13 | dcfcadorig | character varying | 10000 | YES | NULL |
| 14 | dcfsellodig | character varying | 10000 | YES | NULL |
| 15 | dcfnumcertif | character varying | 50 | YES | NULL |
| 16 | dcfhstusu | character varying | 10 | YES | NULL |
| 17 | dcfhsthora | timestamp without time zone |  | YES | NULL |
| 18 | dcfsellosat | character varying | 10000 | YES | NULL |
| 19 | dcfnumcertifsat | character varying | 50 | YES | NULL |
| 20 | dcfuuid | character varying | 100 | YES | NULL |
| 21 | dcfcodigoqr | character varying | 200 | YES | NULL |
| 22 | dcfleyendacfdi | character varying | 200 | YES | NULL |
| 23 | dcffechatim | character varying | 40 | YES | NULL |

### docucfd_processed
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcfdcfaid | numeric | 10,0 | NO | NULL |
| 2 | dcfsocemi | numeric | 10,0 | NO | NULL |

### docucobrocfd
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dccfid | numeric | 10,0 | NO | NULL |
| 2 | dccfentid | numeric | 10,0 | NO | NULL |
| 3 | dccftipo | character varying | 3 | NO | NULL |
| 4 | dccfcnttnum | numeric | 10,0 | NO | NULL |
| 5 | dccfsocemi | numeric | 10,0 | NO | NULL |
| 6 | dccfentidorg | numeric | 10,0 | NO | NULL |
| 7 | dccftipoorg | character | 1 | NO | NULL |
| 8 | dccffeccrea | timestamp without time zone |  | NO | NULL |
| 9 | dccfestado | numeric | 5,0 | NO | NULL |
| 10 | dccfimporte | numeric | 18,2 | YES | NULL |
| 11 | dccfdocsdep | character varying | 10000 | YES | NULL |
| 12 | dccfxml | bytea |  | YES | NULL |
| 13 | dccfuuid | character varying | 36 | YES | NULL |
| 14 | dccffechaenv | timestamp without time zone |  | YES | NULL |
| 15 | dccffecharec | timestamp without time zone |  | YES | NULL |
| 16 | dccfreldccfid | numeric | 10,0 | YES | NULL |
| 17 | dccfficjson | bytea |  | YES | NULL |
| 18 | dccfdatjson | text |  | YES | NULL |

### docucontra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dconid | numeric | 10,0 | NO | NULL |
| 2 | dcontxtid | numeric | 10,0 | NO | NULL |
| 3 | dconvise | character | 1 | NO | NULL |
| 4 | dconevitpdid | numeric | 5,0 | YES | NULL |

### docufact
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcfaid | numeric | 10,0 | NO | NULL |
| 2 | dcfaftoid | numeric | 10,0 | NO | NULL |
| 3 | dcfaciclo | numeric | 10,0 | NO | NULL |
| 4 | dcfadfiid | numeric | 5,0 | NO | NULL |
| 5 | dcfaxml | bytea |  | YES | NULL |
| 6 | dcfasnreforg | character | 1 | NO | 'S'::bpchar |
| 7 | dcfaestado | numeric | 5,0 | NO | 2 |
| 8 | dcftipfact | numeric | 5,0 | YES | NULL |
| 9 | dcfatipenv | numeric | 5,0 | YES | NULL |
| 10 | dcfanumcopias | numeric | 5,0 | YES | NULL |

### docufacte
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dfeid | numeric | 10,0 | NO | NULL |
| 2 | dfesocid | numeric | 10,0 | NO | NULL |
| 3 | dfexmleins | bytea |  | YES | NULL |
| 4 | dfexmlefac | bytea |  | YES | NULL |
| 5 | dfecodunic | character varying | 15 | YES | NULL |
| 6 | dfecustdocid | character varying | 75 | YES | NULL |

### docufactext
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dfexid | numeric | 10,0 | NO | NULL |
| 2 | dfexbinario | bytea |  | YES | NULL |
| 3 | dfetipoorden | numeric | 5,0 | YES | NULL |
| 4 | dfetipfactext | numeric | 5,0 | YES | NULL |
| 5 | dfesnrafaga | character | 1 | NO | 'N'::bpchar |
| 6 | dferefpedido | character varying | 100 | YES | NULL |
| 7 | dfecebe | character varying | 6 | YES | NULL |

### documentoxml
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dxmid | numeric | 10,0 | NO | NULL |
| 2 | dxmtdxid | numeric | 5,0 | NO | NULL |
| 3 | dxmiddoc | numeric | 10,0 | NO | NULL |

### docupago
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dcpid | numeric | 10,0 | NO | NULL |
| 2 | dcptipo | numeric | 5,0 | NO | NULL |
| 3 | dcpusucrea | character varying | 10 | NO | NULL |
| 4 | dcphoracrea | timestamp without time zone |  | NO | NULL |
| 5 | dcpcnttnum | numeric | 10,0 | NO | NULL |
| 6 | dcpreferencia | character varying | 11 | NO | NULL |
| 7 | dcpofiid | numeric | 5,0 | YES | NULL |
| 8 | dcpsnanulado | character | 1 | NO | 'N'::bpchar |
| 9 | dcpdirenvio | numeric | 5,0 | NO | '1'::numeric |

### docusellosat
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dssnumfac | character | 18 | NO | NULL |
| 2 | dssftoid | numeric | 10,0 | NO | NULL |
| 3 | dsscomprxml | bytea |  | YES | NULL |
| 4 | dssserie | character varying | 10 | YES | NULL |
| 5 | dssfolio | numeric | 10,0 | YES | NULL |
| 6 | dssnocertif | character varying | 50 | YES | NULL |
| 7 | dssnocertifsat | character varying | 50 | YES | NULL |
| 8 | dsssellodig | character varying | 20000 | YES | NULL |
| 9 | dsssellodigsat | character varying | 20000 | YES | NULL |
| 10 | dsscadeorig | character varying | 20000 | YES | NULL |
| 11 | dsscodigoqr | character varying | 200 | YES | NULL |
| 12 | dssfoliofis | character varying | 100 | YES | NULL |
| 13 | dssfechaemi | character varying | 40 | YES | NULL |
| 14 | dssfechatim | character varying | 40 | YES | NULL |
| 15 | dssleyendaimp | character varying | 200 | YES | NULL |
| 16 | dsstotalletra | character varying | 200 | YES | NULL |
| 17 | dssestadosell | numeric | 5,0 | NO | NULL |
| 18 | dssmotiverror | character varying | 500 | YES | NULL |
| 19 | dsshstusu | character varying | 10 | NO | 'CONVERSION'::character varying |
| 20 | dsshsthora | timestamp without time zone |  | NO | CURRENT_TIMESTAMP |

### docusellosatcrt
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dscftoid | numeric | 10,0 | NO | NULL |
| 2 | dscnumfic | numeric | 10,0 | YES | NULL |
| 3 | dscnferr | numeric | 10,0 | YES | NULL |

### dual
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dummy | character varying | 1 | YES | NULL |

### dudosocobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | ductramo | numeric | 10,0 | NO | NULL |
| 2 | ductxtid | numeric | 10,0 | NO | NULL |
| 3 | ducporcentaje | numeric | 5,2 | NO | NULL |
| 4 | duchstusu | character varying | 10 | NO | NULL |
| 5 | duchsthora | timestamp without time zone |  | NO | NULL |

### duplzgz
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | zdupid | character | 1 | NO | NULL |
| 2 | zdupdesc | character | 1 | NO | NULL |

### dwffactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwffexpid | numeric | 5,0 | NO | NULL |
| 2 | dwfforigen | numeric | 5,0 | NO | NULL |
| 3 | dwffopera | numeric | 5,0 | NO | NULL |
| 4 | dwffmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwffperiid | numeric | 5,0 | NO | NULL |
| 6 | dwffanno | numeric | 5,0 | NO | NULL |
| 7 | dwffmes | numeric | 5,0 | NO | NULL |
| 8 | dwfftipcli | character | 1 | NO | NULL |
| 9 | dwffusocod | numeric | 5,0 | NO | NULL |
| 10 | dwffpropid | numeric | 10,0 | NO | NULL |
| 11 | dwffcarcod | numeric | 5,0 | YES | NULL |
| 12 | dwffconsumo | numeric | 10,0 | NO | NULL |
| 13 | dwffimport | numeric | 18,2 | NO | NULL |
| 14 | dwffimpues | numeric | 18,2 | NO | NULL |
| 15 | dwffnumfac | numeric | 10,0 | NO | NULL |
| 16 | dwffnumcic | numeric | 10,0 | NO | NULL |

### dwflincal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwfcexpid | numeric | 5,0 | NO | NULL |
| 2 | dwfcorigen | numeric | 5,0 | NO | NULL |
| 3 | dwfcopera | numeric | 5,0 | NO | NULL |
| 4 | dwfcmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwfcperiid | numeric | 5,0 | NO | NULL |
| 6 | dwfcanno | numeric | 5,0 | NO | NULL |
| 7 | dwfcmes | numeric | 5,0 | NO | NULL |
| 8 | dwfctipcli | character | 1 | NO | NULL |
| 9 | dwfcusocod | numeric | 5,0 | NO | NULL |
| 10 | dwfcpropid | numeric | 10,0 | NO | NULL |
| 11 | dwfccarcod | numeric | 5,0 | YES | NULL |
| 12 | dwfcttarid | numeric | 5,0 | NO | NULL |
| 13 | dwfccptoid | numeric | 5,0 | NO | NULL |
| 14 | dwfcfecapl | date |  | NO | NULL |
| 15 | dwfcsubcid | numeric | 5,0 | NO | NULL |
| 16 | dwfccalimm | numeric | 5,0 | NO | NULL |
| 17 | dwfccantid | double precision | 53 | NO | NULL |
| 18 | dwfcimport | numeric | 18,2 | NO | NULL |
| 19 | dwfcnumlin | numeric | 10,0 | NO | NULL |

### dwflinfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwflexpid | numeric | 5,0 | NO | NULL |
| 2 | dwflorigen | numeric | 5,0 | NO | NULL |
| 3 | dwflopera | numeric | 5,0 | NO | NULL |
| 4 | dwflmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwflperiid | numeric | 5,0 | NO | NULL |
| 6 | dwflanno | numeric | 5,0 | NO | NULL |
| 7 | dwflmes | numeric | 5,0 | NO | NULL |
| 8 | dwfltipcli | character | 1 | NO | NULL |
| 9 | dwflusocod | numeric | 5,0 | NO | NULL |
| 10 | dwflpropid | numeric | 10,0 | NO | NULL |
| 11 | dwflcarcod | numeric | 5,0 | YES | NULL |
| 12 | dwflttarid | numeric | 5,0 | NO | NULL |
| 13 | dwflcptoid | numeric | 5,0 | NO | NULL |
| 14 | dwflfecapl | date |  | NO | NULL |
| 15 | dwflsubcid | numeric | 5,0 | NO | NULL |
| 16 | dwflcantid | double precision | 53 | NO | NULL |
| 17 | dwflimport | numeric | 18,2 | NO | NULL |
| 18 | dwflnumlin | numeric | 10,0 | NO | NULL |
| 19 | dwflnumfac | numeric | 10,0 | NO | NULL |
| 20 | dwflperanno | numeric | 5,0 | YES | NULL |
| 21 | dwflperperiodo | numeric | 5,0 | YES | NULL |

### dwflintra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwftexpid | numeric | 5,0 | NO | NULL |
| 2 | dwftorigen | numeric | 5,0 | NO | NULL |
| 3 | dwftopera | numeric | 5,0 | NO | NULL |
| 4 | dwftmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwftperiid | numeric | 5,0 | NO | NULL |
| 6 | dwftanno | numeric | 5,0 | NO | NULL |
| 7 | dwftmes | numeric | 5,0 | NO | NULL |
| 8 | dwfttipcli | character | 1 | NO | NULL |
| 9 | dwftusocod | numeric | 5,0 | NO | NULL |
| 10 | dwftpropid | numeric | 10,0 | NO | NULL |
| 11 | dwftcarcod | numeric | 5,0 | YES | NULL |
| 12 | dwftttarid | numeric | 5,0 | NO | NULL |
| 13 | dwftcptoid | numeric | 5,0 | NO | NULL |
| 14 | dwftfecapl | date |  | NO | NULL |
| 15 | dwftsubcid | numeric | 5,0 | NO | NULL |
| 16 | dwfttramo | numeric | 10,0 | NO | NULL |
| 17 | dwftcantid | double precision | 53 | NO | NULL |
| 18 | dwftimport | numeric | 18,2 | NO | NULL |
| 19 | dwftnumlin | numeric | 10,0 | NO | NULL |

### dwhcanfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwcfexpid | numeric | 5,0 | NO | NULL |
| 2 | dwcforigen | numeric | 5,0 | NO | NULL |
| 3 | dwcfopera | numeric | 5,0 | NO | NULL |
| 4 | dwcfmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwcfusotip | numeric | 5,0 | NO | NULL |
| 6 | dwcfnivcon | numeric | 5,0 | NO | NULL |
| 7 | dwcfperiid | numeric | 5,0 | NO | NULL |
| 8 | dwcfcarcod | numeric | 5,0 | YES | NULL |
| 9 | dwcfttarid | numeric | 5,0 | NO | NULL |
| 10 | dwcfcptoid | numeric | 5,0 | NO | NULL |
| 11 | dwcfcalimm | numeric | 5,0 | NO | NULL |
| 12 | dwcfcantid | double precision | 53 | NO | NULL |
| 13 | dwcfimport | numeric | 18,2 | NO | NULL |
| 14 | dwcffrecue | numeric | 10,0 | NO | NULL |
| 15 | dwcfimpcuo | numeric | 18,2 | NO | NULL |
| 16 | dwcfnumcuo | double precision | 53 | NO | NULL |
| 17 | dwcfanno | numeric | 5,0 | YES | NULL |
| 18 | dwcfpernum | numeric | 5,0 | YES | NULL |

### dwhcanfaccab
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwccexpid | numeric | 5,0 | NO | NULL |
| 2 | dwccfecdesde | date |  | NO | NULL |
| 3 | dwccfechasta | date |  | NO | NULL |

### dwhcobro
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwoanno | numeric | 5,0 | NO | NULL |
| 2 | dwomes | numeric | 5,0 | NO | NULL |
| 3 | dwoexpid | numeric | 5,0 | NO | NULL |
| 4 | dwoorigen | numeric | 5,0 | NO | NULL |
| 5 | dwoopera | numeric | 5,0 | NO | NULL |
| 6 | dwomotivo | numeric | 5,0 | NO | NULL |
| 7 | dwoannoemi | numeric | 5,0 | NO | NULL |
| 8 | dwomesemi | numeric | 5,0 | NO | NULL |
| 9 | dwotipcli | character | 1 | NO | NULL |
| 10 | dwopropid | numeric | 10,0 | NO | NULL |
| 11 | dwointen | numeric | 5,0 | NO | NULL |
| 12 | dwogsctipo | numeric | 5,0 | NO | NULL |
| 13 | dwoopecart | numeric | 5,0 | NO | NULL |
| 14 | dwonumfac | numeric | 10,0 | NO | NULL |
| 15 | dwoimporte | numeric | 18,2 | NO | NULL |

### dwhconcept
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwcpanno | numeric | 5,0 | NO | NULL |
| 2 | dwcpmes | numeric | 5,0 | NO | NULL |
| 3 | dwcpexpid | numeric | 5,0 | NO | NULL |
| 4 | dwcpcanaid | character | 1 | NO | NULL |
| 5 | dwcpperiid | numeric | 5,0 | NO | NULL |
| 6 | dwcptipcli | character | 1 | NO | NULL |
| 7 | dwcpusocod | numeric | 5,0 | NO | NULL |
| 8 | dwcpcptoid | numeric | 5,0 | NO | NULL |
| 9 | dwcpttarid | numeric | 5,0 | NO | NULL |
| 10 | dwcpcantid | numeric | 10,0 | NO | NULL |

### dwhcontad
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwcnanno | numeric | 5,0 | NO | NULL |
| 2 | dwcnmes | numeric | 5,0 | NO | NULL |
| 3 | dwcnexpid | numeric | 5,0 | NO | NULL |
| 4 | dwcnemplid | character | 2 | NO | NULL |
| 5 | dwcncalimm | numeric | 5,0 | NO | NULL |
| 6 | dwcnmarcid | numeric | 5,0 | NO | NULL |
| 7 | dwcnmodid | numeric | 5,0 | NO | NULL |
| 8 | dwcnedad | numeric | 5,0 | NO | NULL |
| 9 | dwcncantid | numeric | 10,0 | NO | NULL |

### dwhcontrat
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwcoanno | numeric | 5,0 | NO | NULL |
| 2 | dwcomes | numeric | 5,0 | NO | NULL |
| 3 | dwcoexpid | numeric | 5,0 | NO | NULL |
| 4 | dwcocanaid | character | 1 | NO | NULL |
| 5 | dwcoperiid | numeric | 5,0 | NO | NULL |
| 6 | dwcotipcli | character | 1 | NO | NULL |
| 7 | dwcousocod | numeric | 5,0 | NO | NULL |
| 8 | dwcocateid | numeric | 5,0 | NO | 0 |
| 9 | dwcocantid | numeric | 10,0 | NO | NULL |

### dwhdeuda
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwdanno | numeric | 5,0 | NO | NULL |
| 2 | dwdmes | numeric | 5,0 | NO | NULL |
| 3 | dwdexpid | numeric | 5,0 | NO | NULL |
| 4 | dwdorigen | numeric | 5,0 | NO | NULL |
| 5 | dwdopera | numeric | 5,0 | NO | NULL |
| 6 | dwdmotivo | numeric | 5,0 | NO | NULL |
| 7 | dwdannoemi | numeric | 5,0 | NO | NULL |
| 8 | dwdmesemi | numeric | 5,0 | NO | NULL |
| 9 | dwdtipcli | character | 1 | NO | NULL |
| 10 | dwdpropid | numeric | 10,0 | NO | NULL |
| 11 | dwdtgesdeu | numeric | 5,0 | NO | NULL |
| 12 | dwdestado | numeric | 5,0 | NO | NULL |
| 13 | dwddotada | character | 1 | NO | NULL |
| 14 | dwdempinttext | character | 1 | NO | 'T'::bpchar |
| 15 | dwdnumfac | numeric | 10,0 | NO | NULL |
| 16 | dwdimporte | numeric | 18,2 | NO | NULL |

### dwhfactura
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwhfexpid | numeric | 5,0 | NO | NULL |
| 2 | dwhforigen | numeric | 5,0 | NO | NULL |
| 3 | dwhfopera | numeric | 5,0 | NO | NULL |
| 4 | dwhfmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwhfzonid | character | 3 | NO | NULL |
| 6 | dwhfanno | numeric | 5,0 | NO | NULL |
| 7 | dwhfmes | numeric | 5,0 | NO | NULL |
| 8 | dwhftipcli | character | 1 | NO | NULL |
| 9 | dwhfusocod | numeric | 5,0 | NO | NULL |
| 10 | dwhfpropid | numeric | 10,0 | NO | NULL |
| 11 | dwhfcarcod | numeric | 5,0 | YES | NULL |
| 12 | dwhfactipolid | numeric | 5,0 | YES | NULL |
| 13 | dwhfconsumo | numeric | 10,0 | NO | NULL |
| 14 | dwhfimport | numeric | 18,2 | NO | NULL |
| 15 | dwhfimpues | numeric | 18,2 | NO | NULL |
| 16 | dwhfnumfac | numeric | 10,0 | NO | NULL |
| 17 | dwhfnumcic | numeric | 10,0 | NO | NULL |

### dwhlincal
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwhcexpid | numeric | 5,0 | NO | NULL |
| 2 | dwhcorigen | numeric | 5,0 | NO | NULL |
| 3 | dwhcopera | numeric | 5,0 | NO | NULL |
| 4 | dwhcmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwhczonid | character | 3 | NO | NULL |
| 6 | dwhcanno | numeric | 5,0 | NO | NULL |
| 7 | dwhcmes | numeric | 5,0 | NO | NULL |
| 8 | dwhctipcli | character | 1 | NO | NULL |
| 9 | dwhcusocod | numeric | 5,0 | NO | NULL |
| 10 | dwhcpropid | numeric | 10,0 | NO | NULL |
| 11 | dwhccarcod | numeric | 5,0 | YES | NULL |
| 12 | dwhcactipolid | numeric | 5,0 | YES | NULL |
| 13 | dwhcttarid | numeric | 5,0 | NO | NULL |
| 14 | dwhccptoid | numeric | 5,0 | NO | NULL |
| 15 | dwhcfecapl | date |  | NO | NULL |
| 16 | dwhcsubcid | numeric | 5,0 | NO | NULL |
| 17 | dwhccalimm | numeric | 5,0 | NO | NULL |
| 18 | dwhccantid | double precision | 53 | NO | NULL |
| 19 | dwhcimport | numeric | 18,2 | NO | NULL |
| 20 | dwhcnumlin | numeric | 10,0 | NO | NULL |

### dwhlinfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwhlexpid | numeric | 5,0 | NO | NULL |
| 2 | dwhlorigen | numeric | 5,0 | NO | NULL |
| 3 | dwhlopera | numeric | 5,0 | NO | NULL |
| 4 | dwhlmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwhlzonid | character | 3 | NO | NULL |
| 6 | dwhlanno | numeric | 5,0 | NO | NULL |
| 7 | dwhlmes | numeric | 5,0 | NO | NULL |
| 8 | dwhltipcli | character | 1 | NO | NULL |
| 9 | dwhlusocod | numeric | 5,0 | NO | NULL |
| 10 | dwhlpropid | numeric | 10,0 | NO | NULL |
| 11 | dwhlcarcod | numeric | 5,0 | YES | NULL |
| 12 | dwhlactipolid | numeric | 5,0 | YES | NULL |
| 13 | dwhlttarid | numeric | 5,0 | NO | NULL |
| 14 | dwhlcptoid | numeric | 5,0 | NO | NULL |
| 15 | dwhlfecapl | date |  | NO | NULL |
| 16 | dwhlsubcid | numeric | 5,0 | NO | NULL |
| 17 | dwhlcantid | double precision | 53 | NO | NULL |
| 18 | dwhlimport | numeric | 18,2 | NO | NULL |
| 19 | dwhlnumlin | numeric | 10,0 | NO | NULL |
| 20 | dwhlnumfac | numeric | 10,0 | NO | NULL |
| 21 | dwhlperanno | numeric | 5,0 | YES | NULL |
| 22 | dwhlperperiodi | numeric | 5,0 | YES | NULL |
| 23 | dwhlperperiodo | numeric | 5,0 | YES | NULL |

### dwhlintra
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwhtexpid | numeric | 5,0 | NO | NULL |
| 2 | dwhtorigen | numeric | 5,0 | NO | NULL |
| 3 | dwhtopera | numeric | 5,0 | NO | NULL |
| 4 | dwhtmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwhtzonid | character | 3 | NO | NULL |
| 6 | dwhtanno | numeric | 5,0 | NO | NULL |
| 7 | dwhtmes | numeric | 5,0 | NO | NULL |
| 8 | dwhttipcli | character | 1 | NO | NULL |
| 9 | dwhtusocod | numeric | 5,0 | NO | NULL |
| 10 | dwhtpropid | numeric | 10,0 | NO | NULL |
| 11 | dwhtcarcod | numeric | 5,0 | YES | NULL |
| 12 | dwhtactipolid | numeric | 5,0 | YES | NULL |
| 13 | dwhtttarid | numeric | 5,0 | NO | NULL |
| 14 | dwhtcptoid | numeric | 5,0 | NO | NULL |
| 15 | dwhtfecapl | date |  | NO | NULL |
| 16 | dwhtsubcid | numeric | 5,0 | NO | NULL |
| 17 | dwhttramo | numeric | 10,0 | NO | NULL |
| 18 | dwhtcantid | double precision | 53 | NO | NULL |
| 19 | dwhtimport | numeric | 18,2 | NO | NULL |
| 20 | dwhtnumlin | numeric | 10,0 | NO | NULL |

### dwmcanfac
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwcmexpid | numeric | 5,0 | NO | NULL |
| 2 | dwcmorigen | numeric | 5,0 | NO | NULL |
| 3 | dwcmopera | numeric | 5,0 | NO | NULL |
| 4 | dwcmmotivo | numeric | 5,0 | NO | NULL |
| 5 | dwcmusotip | numeric | 5,0 | NO | NULL |
| 6 | dwcmnivcon | numeric | 5,0 | NO | NULL |
| 7 | dwcmperiid | numeric | 5,0 | NO | NULL |
| 8 | dwcmcarcod | numeric | 5,0 | YES | NULL |
| 9 | dwcmttarid | numeric | 5,0 | NO | NULL |
| 10 | dwcmcptoid | numeric | 5,0 | NO | NULL |
| 11 | dwcmcalimm | numeric | 5,0 | NO | NULL |
| 12 | dwcmcantid | double precision | 53 | NO | NULL |
| 13 | dwcmimport | numeric | 18,2 | NO | NULL |
| 14 | dwcmfrecue | numeric | 10,0 | NO | NULL |
| 15 | dwcmimpcuo | numeric | 18,2 | NO | NULL |
| 16 | dwcmnumcuo | double precision | 53 | NO | NULL |
| 17 | dwcmanno | numeric | 5,0 | YES | NULL |
| 18 | dwcmpernum | numeric | 5,0 | YES | NULL |

### dwmcanfaccab
| # | Column | Type | Length/Precision | Nullable | Default |
|---|--------|------|-----------------|----------|--------|
| 1 | dwmcexpid | numeric | 5,0 | NO | NULL |
| 2 | dwmcanydesde | numeric | 5,0 | NO | NULL |
| 3 | dwmcmesdesde | numeric | 5,0 | NO | NULL |
| 4 | dwmcanyhasta | numeric | 5,0 | NO | NULL |
| 5 | dwmcmeshasta | numeric | 5,0 | NO | NULL |

