# Spec: user-addresses

## Description

Capability para CRUD de direcciones de envío de usuarios. Permite guardar, editar, eliminar y seleccionar direcciones para pedidos. Solo aplica para usuarios con rol Cliente; Owner y Staff no usan este sistema.

## Requirements

### R-ADR-001: Crear dirección
- Agregar nueva dirección de envío
- Campos requeridos: calle, número, ciudad, provincia, CP
- Campos opcionales: piso/departamento, referencias, alias (ej: "Casa", "Oficina")
- Teléfono de contacto para la entrega

### R-ADR-002: Editar dirección
- Modificar cualquier campo de dirección existente
- No permite cambiar el user_id (seguridad)
- Guardar cambios con updated_at

### R-ADR-003: Eliminar dirección
- Soft delete (flag activo/inactivo) o hard delete
- Si es la última dirección, permitir eliminar
- Confirmación antes de eliminar

### R-ADR-004: Listar direcciones
- Ver todas las direcciones guardadas del usuario
- Mostrar alias o dirección completa
- Indicar cual es la dirección principal/preferida

### R-ADR-005: Selección para pedido
- Al hacer un pedido, seleccionar dirección guardada
- O crear nueva dirección en el momento
- Recordar última dirección usada

### R-ADR-006: Solo Cliente
- Solo usuarios con rol Cliente tienen direcciones
- Owner y Staff ven mensaje: "No disponible para tu rol"
- No intentar guardar/buscar en DB

### R-ADR-007: Máximo de direcciones
- Máximo 10 direcciones por usuario
- Mostrar error al llegar al límite

### R-ADR-008: Validación de campos
- Calle: requerida, mínimo 3 caracteres
- Número: requerido, numérico
- Ciudad: requerida
- Provincia: requerida (lista de provincias argentinas)
- CP: requerido, formato argentino (4 o 8 dígitos)

## Happy Path Scenarios

### S-ADR-001: Cliente agrega primera dirección
**Given** un Cliente sin direcciones
**And** navega a `/account/addresses`
**When** hace click en "Agregar Dirección"
**And** completa todos los campos requeridos
**And** guarda
**Then** ve mensaje "Dirección guardada"
**And** aparece en su lista

### S-ADR-002: Cliente edita dirección
**Given** un Cliente tiene una dirección
**When** hace click en editar
**And** cambia la calle
**And** guarda
**Then** ve mensaje "Dirección actualizada"
**And** los cambios se reflejan

### S-ADR-003: Cliente elimina dirección
**Given** un Cliente tiene más de una dirección
**When** hace click en eliminar
**And** confirma
**Then** la dirección se borra
**And** ya no aparece en la lista

### S-ADR-004: Cliente usa dirección para pedido
**Given** un Cliente está en checkout
**When** selecciona una dirección guardada
**Then** la dirección se completa automáticamente

### S-ADR-005: Cliente marca como principal
**Given** un Cliente tiene múltiples direcciones
**When** marca una como principal
**Then** aparece primero en la lista
**And** se sugiere en checkout

## Edge Case Scenarios

### S-ADR-006: Intenta eliminar última dirección
**Given** un Cliente intenta eliminar su única dirección
**Then** ve mensaje: "Elimina al menos una dirección para eliminar esta"
**And** no se elimina

### S-ADR-007: Límite de direcciones alcanzado
**Given** un Cliente tiene 10 direcciones
**When** intenta agregar otra
**Then** ve mensaje: "Máximo 10 direcciones. Elimina una para agregar otra."

### S-ADR-008: Intento de acceso de Owner
**Given** Owner navega a `/account/addresses`
**Then** ve mensaje: "No disponible para tu rol"
**And** no puede acceder a funcionalidades

### S-ADR-009: Intento de acceso de Staff
**Given** Staff navega a `/account/addresses`
**Then** ve mensaje: "No disponible para tu rol"

### S-ADR-010: Intenta editar dirección de otro
**Given** un Cliente intenta editar dirección de otro usuario (via ID manipulado)
**Then** ve error 403
**And** no puede modificar

### S-ADR-011: Campos inválidos al guardar
**Given** un usuario guarda dirección con CP inválido
**Then** ve error bajo el campo
**And** no se guarda

### S-ADR-012: Error de base de datos
**Given** hay error de DB
**When** el usuario intenta guardar
**Then** ve mensaje: "Error al guardar. Intenta más tarde."

### S-ADR-013: Sesión expirada
**Given** usuario no autenticado intenta acceder
**Then** es redirigido a login

## Implementation Notes

- API Endpoints:
  - `GET /api/account/addresses` - listar
  - `POST /api/account/addresses` - crear
  - `PUT /api/account/addresses/[id]` - editar
  - `DELETE /api/account/addresses/[id]` - eliminar
- Tabla `direcciones` en SQLite:
  - id (INTEGER PRIMARY KEY)
  - user_id (INTEGER FOREIGN KEY)
  - alias (TEXT)
  - calle (TEXT)
  - numero (TEXT)
  - piso (TEXT)
  - ciudad (TEXT)
  - provincia (TEXT)
  - cp (TEXT)
  - telefono (TEXT)
  - es_principal (BOOLEAN)
  - created_at (DATETIME)
  - updated_at (DATETIME)
- Proteger con autenticación
- Verificar user_id contra sesión
- Para Owner/Staff: denied