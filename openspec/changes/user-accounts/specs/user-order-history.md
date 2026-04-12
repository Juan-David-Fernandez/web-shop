# Spec: user-order-history

## Description

Capability para que usuarios autenticados puedan ver su historial de pedidos. Vincula los pedidos del catálogo con el usuario autenticado mostrando todos los pedidos realizados.

## Requirements

### R-ORD-001: Ver historial de pedidos
- Lista todos los pedidos del usuario autenticado
- Ordenados por fecha descendente (más reciente primero)
- Mostrar: número de pedido, fecha, estado, total, items

### R-ORD-002: Estados de pedido
- Mostrar estado: Pendiente, Confirmado, Preparando, Enviado, Entregado, Cancelado
- Solo Cliente puede ver sus propios pedidos
- Owner/Staff ven todos los pedidos si tienen acceso

### R-ORD-003: Detalle de pedido
- Al hacer click en un pedido, mostrar detalle
- Items comprados con cantidades y precios
- Dirección de envío usada
- Total del pedido
- Historial de cambios de estado

### R-ORD-004: Solo pedidos del usuario
- No permitir ver pedidos de otros usuarios
- Verificar que el pedido pertenece al usuario
- Owner/Staff tienen acceso completo

### R-ORD-005: Pedidos vacíos
- Si no hay pedidos, mostrar mensaje amigable
- "Aún no tienes pedidos. ¡Haz tu primera compra!"
- Link al catálogo

### R-ORD-006: Vinculación pedido-usuario
- Cada pedido tiene user_id vinculado
- Tabla pedidos en SQLite tiene foreign key a usuarios
- Si usuario se borra, pedidos quedan (anonimizados)

## Happy Path Scenarios

### S-ORD-001: Cliente ve su historial
**Given** un Cliente con pedidos realizados
**And** navega a `/account/orders`
Then** ve lista de pedidos ordenados por fecha
**And** cada pedido muestra número, fecha, estado, total

### S-ORD-002: Cliente ve pedido específico
**Given** un Cliente está en su historial
**When** hace click en un pedido
**Then** ve el detalle del pedido
**And** puede ver items, dirección y estado

### S-ORD-003: Cliente con pedidos vacíos
**Given** un Cliente sin pedidos
**And** navega a `/account/orders`
**Then** ve mensaje "Aún no tienes pedidos"
**And** ve link al catálogo

### S-ORD-004: Pedidos filtrados por estado
**Given** un Cliente tiene muchos pedidos
**When** filtra por estado "Enviado"
**Then** solo aparecen pedidos con ese estado

## Edge Case Scenarios

### S-ORD-005: Intento de ver pedido de otro
**Given** un Cliente intenta ver pedido de otro usuario
**Then** ve error 403 o mensaje de acceso denegado
**And** no puede ver los datos

### S-ORD-006: Sesión expirada
**Given** un usuario no autenticado intenta acceder
**Then** es redirigido a login

### S-ORD-007: Pedido de usuario borrado
**Given** un pedido tiene user_id de usuario borrado
Then** el pedido se muestra como "Usuario eliminado"
**And** los datos del cliente se anonimizan

### S-ORD-008: Error al cargar pedidos
**Given** hay error de base de datos
**When** el usuario navega a pedidos
Then** ve mensaje: "Error al cargar pedidos. Intenta más tarde."
**And** puede reintentar

## Implementation Notes

- API Endpoints:
  - `GET /api/account/orders` - lista de pedidos
  - `GET /api/account/orders/[id]` - detalle de pedido
- Proteger con autenticación
- Para Cliente: filtrar por user_id
- Para Owner/Staff: sin filtro (o filtro por query)
- Tablas existentes: `pedidos`, `pedido_items` (verificar esquema)