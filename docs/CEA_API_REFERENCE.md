# CEA API Reference

Esta documentación describe los servicios web disponibles para integración con el sistema CEA (Comisión Estatal de Aguas) de Querétaro.

## Tabla de Contenidos

- [Información General](#información-general)
- [Autenticación](#autenticación)
- [REST APIs](#rest-apis)
- [SOAP APIs](#soap-apis)
  - [Contratos](#contratos)
  - [Órdenes de Trabajo](#órdenes-de-trabajo)
  - [Contadores](#contadores)
  - [Gestión de Deuda](#gestión-de-deuda)
  - [Lecturas y Consumos](#lecturas-y-consumos)
  - [Recibos y Notificaciones](#recibos-y-notificaciones)

---

## Información General

### Servidores Base

| Servicio | URL Base |
|----------|----------|
| REST API | `https://appcea.ceaqueretaro.gob.mx/ceadevws/` |
| SOAP Contratación | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS` |
| SOAP Órdenes de Servicio | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS` |
| SOAP Contadores | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContadoresWS` |
| SOAP Gestión Deuda | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaGestionDeudaWS` |
| SOAP Oficina Virtual | `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS` |

### Headers Comunes para SOAP

```
Content-Type: text/xml;charset=UTF-8
SOAPAction: "" (vacío o según operación)
```

---

## Autenticación

### WS-Security Header (para endpoints que lo requieren)

```xml
<wsse:Security mustUnderstand="1"
    xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
    xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
    <wsse:UsernameToken wsu:Id="UsernameToken-{USERNAME}">
        <wsse:Username>{USERNAME}</wsse:Username>
        <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">{PASSWORD}</wsse:Password>
    </wsse:UsernameToken>
</wsse:Security>
```

**Credenciales por defecto:**
- Username: `WSGESTIONDEUDA`
- Password: `WSGESTIONDEUDA`

---

## REST APIs

### Base URL
```
https://appcea.ceaqueretaro.gob.mx/ceadevws/
```

### 1. Terminar Reporte de Caso

Cierra un caso en el sistema.

**Método:** `PUT`

**Request Body:**
```json
{
    "evento": "terminar_reporte_caso",
    "data": {
        "caso_sn": "{case_id}",
        "sn_code": "{status_code}",
        "sn_notes": "{notes}",
        "sys_id": "",
        "orden_aquacis": ""
    }
}
```

### 2. Asignar Orden Aquacis

Vincula una orden de trabajo de Aquacis a un caso.

**Método:** `PUT`

**Request Body:**
```json
{
    "evento": "asigna_orden_aquacis",
    "data": {
        "sys_id": "{case_id}",
        "orden_aquacis": "{work_order_id}",
        "caso_sn": "",
        "sn_code": "",
        "sn_notes": ""
    }
}
```

### 3. Anular Reporte de Caso

Cancela un caso existente.

**Método:** `PUT`

**Request Body:**
```json
{
    "evento": "anular_reporte_caso",
    "data": {
        "caso_sn": "{case_id}",
        "sys_id": "",
        "orden_aquacis": "",
        "sn_code": "",
        "sn_notes": ""
    }
}
```

---

## SOAP APIs

### Contratos

**Endpoint:** `InterfazGenericaContratacionWS`

**URL:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContratacionWS`

#### consultaDetalleContrato

Obtiene el detalle completo de un contrato.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:consultaDetalleContrato>
         <numeroContrato>{numero_contrato}</numeroContrato>
         <idioma>es</idioma>
      </occ:consultaDetalleContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

**Parámetros:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| numeroContrato | string | Número del contrato (ej: "523160") |
| idioma | string | Código de idioma ("es" para español) |

#### getContrato

Obtiene información básica de un contrato.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContrato>
         <numContrato>{numero_contrato}</numContrato>
         <idioma>es</idioma>
         <opciones>{opciones}</opciones>
      </occ:getContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

#### getContratos

Busca contratos con filtros.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getContratos>
         <numeroContrato>{numero_contrato}</numeroContrato>
         <actividad>{actividad}</actividad>
         <actividadSectorial>{actividad_sectorial}</actividadSectorial>
         <uso>{uso}</uso>
         <cnaeDesde>{cnae_desde}</cnaeDesde>
         <cnaeHasta>{cnae_hasta}</cnaeHasta>
         <estados>
            <string>{estado_1}</string>
            <string>{estado_2}</string>
         </estados>
      </occ:getContratos>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Órdenes de Trabajo

**Endpoint:** `InterfazGenericaOrdenesServicioWS`

**URL:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaOrdenesServicioWS`

#### crearOrdenTrabajo

Crea una nueva orden de trabajo.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:crearOrdenTrabajo>
         <idioma>es</idioma>
         <ordenTrabajo>
            <tipoOrden>{tipo_orden}</tipoOrden>
            <motivoOrden>{motivo_orden}</motivoOrden>
            <fechaCreacionOrden>{fecha_creacion}</fechaCreacionOrden>
            <numContrato>{numero_contrato}</numContrato>
            <idPtoServicio>{id_punto_servicio}</idPtoServicio>
            <fechaEstimdaFin>{fecha_estimada_fin}</fechaEstimdaFin>
            <observaciones>{observaciones}</observaciones>
            <codigoObsCambCont></codigoObsCambCont>
            <codigoReparacion>{codigo_reparacion}</codigoReparacion>
            <anyoExpediente>{anyo_expediente}</anyoExpediente>
            <numeroExpediente></numeroExpediente>
            <instalaValvulaPaso>0</instalaValvulaPaso>
         </ordenTrabajo>
         <enCurso>0</enCurso>
      </int:crearOrdenTrabajo>
   </soapenv:Body>
</soapenv:Envelope>
```

**Parámetros:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| tipoOrden | string | Tipo de orden de trabajo |
| motivoOrden | string | Motivo de la orden |
| fechaCreacionOrden | date | Fecha de creación (YYYY-MM-DD) |
| numContrato | string | Número de contrato asociado |
| idPtoServicio | string | ID del punto de servicio |
| fechaEstimdaFin | date | Fecha estimada de finalización |
| observaciones | string | Observaciones adicionales |
| codigoReparacion | string | Código de reparación |
| anyoExpediente | string | Año del expediente |

#### resolveOT

Resuelve/cierra una orden de trabajo.

**Request (requiere WS-Security):**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header>
      <!-- WS-Security Header aquí -->
   </soapenv:Header>
   <soapenv:Body>
      <int:resolveOT>
         <otResolution>
            <otResolutionData>
               <operationalSiteID>{operational_site_id}</operationalSiteID>
               <installationID>{installation_id}</installationID>
               <systemOrigin>{system_origin}</systemOrigin>
               <otClass>{ot_class}</otClass>
               <otOrigin>{ot_origin}</otOrigin>
               <endDateOt>{end_date}</endDateOt>
               <endLastTaskOt>{end_last_task}</endLastTaskOt>
               <finalSolution>{final_solution}</finalSolution>
               <nonExecutionMotive>{non_execution_motive}</nonExecutionMotive>
               <solutionDescription>{solution_description}</solutionDescription>
               <executorIdentifier>{executor_id}</executorIdentifier>
               <executorName>{executor_name}</executorName>
               <companyExecutorIdentifier>{company_executor_id}</companyExecutorIdentifier>
               <companyExecutorName>{company_executor_name}</companyExecutorName>
               <transmitterInstalled>{transmitter_installed}</transmitterInstalled>
               <language>es</language>
               <suspensionLevel>{suspension_level}</suspensionLevel>
               <geolocalization>
                  <longitude>{longitude}</longitude>
                  <latitude>{latitude}</latitude>
                  <coordinatesType>{coordinates_type}</coordinatesType>
                  <codificationType>{codification_type}</codificationType>
                  <captureDate>{capture_date}</captureDate>
               </geolocalization>
            </otResolutionData>
         </otResolution>
      </int:resolveOT>
   </soapenv:Body>
</soapenv:Envelope>
```

#### informarVisita

Registra una visita realizada.

**Request (requiere WS-Security):**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericaordenesservicio.occamcxf.occam.agbar.com/">
   <soapenv:Header>
      <!-- WS-Security Header aquí -->
   </soapenv:Header>
   <soapenv:Body>
      <int:informarVisita>
         <id>{id}</id>
         <codOrden>{codigo_orden}</codOrden>
         <fechaVisita>{fecha_visita}</fechaVisita>
         <resultado>{resultado}</resultado>
         <idOperario>{id_operario}</idOperario>
         <nombreOperario>{nombre_operario}</nombreOperario>
         <cifContratista>{cif_contratista}</cifContratista>
         <nombreContratista>{nombre_contratista}</nombreContratista>
         <codIncidencia>{codigo_incidencia}</codIncidencia>
         <descIncidencia>{descripcion_incidencia}</descIncidencia>
         <observaciones>{observaciones}</observaciones>
         <aResponsable>
            <codVinculacion>{codigo_vinculacion}</codVinculacion>
            <idDocFirma>{id_documento_firma}</idDocFirma>
            <personaVisita>
               <nombre>{nombre}</nombre>
               <apellido1>{apellido1}</apellido1>
               <apellido2>{apellido2}</apellido2>
               <telefono>{telefono}</telefono>
               <nif>{nif}</nif>
            </personaVisita>
         </aResponsable>
      </int:informarVisita>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Contadores

**Endpoint:** `InterfazGenericaContadoresWS`

**URL:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaContadoresWS`

#### getPuntoServicioPorContador

Obtiene información del punto de servicio por número de serie del contador.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericacontadores.occamcxf.occam.agbar.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <int:getPuntoServicioPorContador>
         <listaNumSerieContador>{numero_serie_contador}</listaNumSerieContador>
         <usuario>{usuario}</usuario>
         <idioma>es</idioma>
         <opciones>{opciones}</opciones>
      </int:getPuntoServicioPorContador>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Gestión de Deuda

**Endpoint:** `InterfazGenericaGestionDeudaWS`

**URL:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazGenericaGestionDeudaWS`

#### getDeuda

Obtiene información de deuda de un cliente. **Requiere WS-Security.**

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:int="http://interfazgenericagestiondeuda.occamcxf.occam.agbar.com/">
   <soapenv:Header>
      <wsse:Security mustUnderstand="1"
          xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd"
          xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
          <wsse:UsernameToken wsu:Id="UsernameToken-WSGESTIONDEUDA">
              <wsse:Username>WSGESTIONDEUDA</wsse:Username>
              <wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText">WSGESTIONDEUDA</wsse:Password>
          </wsse:UsernameToken>
      </wsse:Security>
   </soapenv:Header>
   <soapenv:Body>
      <int:getDeuda>
         <tipoIdentificador>{tipo_identificador}</tipoIdentificador>
         <valor>{valor}</valor>
         <explotacion>{explotacion}</explotacion>
         <idioma>es</idioma>
      </int:getDeuda>
   </soapenv:Body>
</soapenv:Envelope>
```

**Parámetros:**
| Campo | Tipo | Descripción |
|-------|------|-------------|
| tipoIdentificador | string | Tipo de identificador (contrato, NIF, etc.) |
| valor | string | Valor del identificador |
| explotacion | string | Código de explotación (ej: "01") |
| idioma | string | Código de idioma ("es") |

---

### Lecturas y Consumos

**Endpoint:** `InterfazOficinaVirtualClientesWS`

**URL:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS`

#### getLecturas

Obtiene historial de lecturas de un contrato. **Requiere WS-Security.**

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header>
      <!-- WS-Security Header aquí -->
   </soapenv:Header>
   <soapenv:Body>
      <occ:getLecturas>
         <explotacion>{explotacion}</explotacion>
         <contrato>{numero_contrato}</contrato>
         <idioma>es</idioma>
      </occ:getLecturas>
   </soapenv:Body>
</soapenv:Envelope>
```

#### getConsumos

Obtiene historial de consumos. **Requiere WS-Security.**

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header>
      <!-- WS-Security Header aquí -->
   </soapenv:Header>
   <soapenv:Body>
      <occ:getConsumos>
         <explotacion>{explotacion}</explotacion>
         <contrato>{numero_contrato}</contrato>
         <idioma>es</idioma>
      </occ:getConsumos>
   </soapenv:Body>
</soapenv:Envelope>
```

#### getConceptos

Obtiene catálogo de conceptos de facturación.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getConceptos>
         <explotacion>{explotacion}</explotacion>
         <idioma>es</idioma>
      </occ:getConceptos>
   </soapenv:Body>
</soapenv:Envelope>
```

#### getTarifaDeAguaPorContrato

Obtiene información de tarifa de agua para un contrato.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getTarifaDeAguaPorContrato>
         <explotacion>{explotacion}</explotacion>
         <contrato>{numero_contrato}</contrato>
         <idioma>es</idioma>
      </occ:getTarifaDeAguaPorContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

#### getConsumosParaGraficas

Obtiene datos de consumo formateados para gráficas.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:getConsumosParaGraficas>
         <explotacion>{explotacion}</explotacion>
         <contrato>{numero_contrato}</contrato>
         <idioma>es</idioma>
      </occ:getConsumosParaGraficas>
   </soapenv:Body>
</soapenv:Envelope>
```

---

### Recibos y Notificaciones

**Endpoint:** `InterfazOficinaVirtualClientesWS`

**URL:** `https://aquacis-cf.ceaqueretaro.gob.mx/Comercial/services/InterfazOficinaVirtualClientesWS`

#### cambiarEmailNotificacionPersona

Cambia el email de notificación de una persona.

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header/>
   <soapenv:Body>
      <occ:cambiarEmailNotificacionPersona>
         <nif>{nif}</nif>
         <nombre>{nombre}</nombre>
         <apellido1>{apellido1}</apellido1>
         <apellido2>{apellido2}</apellido2>
         <contrato>{numero_contrato}</contrato>
         <emailAntigo>{email_antiguo}</emailAntigo>
         <emailNuevo>{email_nuevo}</emailNuevo>
         <atencionDe>ChatBot</atencionDe>
         <codigoOficina>{codigo_oficina}</codigoOficina>
         <usuario>{usuario}</usuario>
      </occ:cambiarEmailNotificacionPersona>
   </soapenv:Body>
</soapenv:Envelope>
```

#### cambiarPersonaNotificacionContrato

Cambia la persona de notificación para un contrato. **Requiere WS-Security.**

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header>
      <!-- WS-Security Header aquí -->
   </soapenv:Header>
   <soapenv:Body>
      <occ:cambiarPersonaNotificacionContrato>
         <contrato>{numero_contrato}</contrato>
         <nif>{nif}</nif>
         <email1>{email1}</email1>
         <email2>{email2}</email2>
         <usuario>{usuario}</usuario>
      </occ:cambiarPersonaNotificacionContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

#### cambiarTipoFacturaContrato

Cambia el tipo de factura para un contrato. **Requiere WS-Security.**

**Request:**
```xml
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:occ="http://occamWS.ejb.negocio.occam.agbar.com">
   <soapenv:Header>
      <!-- WS-Security Header aquí -->
   </soapenv:Header>
   <soapenv:Body>
      <occ:cambiarTipoFacturaContrato>
         <contrato>{numero_contrato}</contrato>
         <nif>{nif}</nif>
         <tipoFactura>{tipo_factura}</tipoFactura>
         <usuario>0000004874</usuario>
      </occ:cambiarTipoFacturaContrato>
   </soapenv:Body>
</soapenv:Envelope>
```

---

## Códigos de Error Comunes

| Código | Descripción |
|--------|-------------|
| 404 | Endpoint no encontrado (verificar URL y proxy) |
| 500 | Error interno del servidor CEA |
| 401 | No autorizado (verificar credenciales WS-Security) |

---

## Notas de Implementación

### Variables de Entorno Requeridas

```env
VITE_CEA_REST_URL=/ceadevws/
VITE_CEA_SOAP_CONTRACT_URL=/aquacis-cea/services/InterfazGenericaContratacionWS
VITE_CEA_SOAP_WORKORDER_URL=/aquacis-cea/services/InterfazGenericaOrdenesServicioWS
VITE_CEA_SOAP_METER_URL=/aquacis-cea/services/InterfazGenericaContadoresWS
VITE_CEA_SOAP_DEBT_URL=/aquacis-cea/services/InterfazGenericaGestionDeudaWS
VITE_CEA_SOAP_READINGS_URL=/aquacis-cea/services/InterfazOficinaVirtualClientesWS
VITE_CEA_SOAP_RECEIPT_URL=/aquacis-cea/services/InterfazOficinaVirtualClientesWS
VITE_CEA_API_USERNAME=WSGESTIONDEUDA
VITE_CEA_API_PASSWORD=WSGESTIONDEUDA
```

### Proxy en Desarrollo (vite.config.ts)

```javascript
server: {
  proxy: {
    '/ceadevws': {
      target: 'https://appcea.ceaqueretaro.gob.mx',
      changeOrigin: true,
      secure: false,
    },
    '/aquacis-cea': {
      target: 'https://aquacis-cf.ceaqueretaro.gob.mx/Comercial',
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/aquacis-cea/, ''),
    },
  },
}
```

### ⚠️ Importante: Proxy en Producción

El proxy de Vite **solo funciona en desarrollo**. En producción necesitas:

1. **Opción A:** Configurar Traefik/Nginx para redireccionar `/aquacis-cea/*` → CEA
2. **Opción B:** Crear un Rails Proxy Controller que reenvíe las peticiones
3. **Opción C:** Usar URLs absolutas (requiere CORS en servidor CEA)

---

## Ejemplos de Uso

### JavaScript - Consultar Detalle de Contrato

```javascript
import { consultaDetalleContratoJson } from 'dashboard/api/cea';

const obtenerContrato = async (numeroContrato) => {
  try {
    const resultado = await consultaDetalleContratoJson(numeroContrato, 'es');
    console.log('Contrato:', resultado);
    return resultado;
  } catch (error) {
    console.error('Error consultando contrato:', error);
    throw error;
  }
};

// Uso
obtenerContrato('523160');
```

### JavaScript - Obtener Deuda

```javascript
import { getDeudaJson } from 'dashboard/api/cea';

const obtenerDeuda = async (contrato) => {
  try {
    const resultado = await getDeudaJson('CONTRATO', contrato, '01', 'es');
    console.log('Deuda:', resultado);
    return resultado;
  } catch (error) {
    console.error('Error consultando deuda:', error);
    throw error;
  }
};

// Uso
obtenerDeuda('523160');
```

---

## Contacto y Soporte

Para problemas con los servicios CEA, contactar al equipo de integración de CEA Querétaro.

---

*Última actualización: Enero 2026*
