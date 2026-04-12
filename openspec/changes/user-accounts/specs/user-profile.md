# Spec: user-profile

## Description

Capability para que usuarios autenticados (Cliente, Owner, Staff) puedan ver y editar sus datos personales. Muestra información del perfil y permite actualización de datos.

## Requirements

### R-PROF-001: Ver datos del perfil
- Mostrar nombre completo actual
- Mostrar email (no editable)
- Mostrar teléfono (si existe)
- Mostrar rol de usuario
- Mostrar fecha de registro

### R-PROF-002: Editar datos personales
- Editar nombre completo
- Editar teléfono
- NO permitir cambio de email (por seguridad)
- NO permitir cambio de rol

### R-PROF-003: Validación al guardar
- Nombre: requerido, mínimo 2 caracteres
- Teléfono: formato argentino opcional (+54 9xxxxxxxx)
- Si teléfono está vacío, permitir guardar (es opcional)

### R-PROF-004: Solo usuarios autenticados
- Verificar sesión antes de mostrar datos
- No exponer datos de otros usuarios
- Owner y Staff ven su perfil pero tienen roles diferentes

### R-PROF-005: Perfil de Owner/Staff
- Owner y Staff también tienen perfil
- Sus datos NO vienen de DB (vienen de .env)
- Mostrar datos configurados en variables
- Owner/Staff pueden editar teléfono solo (nombre desde .env)

### R-PROF-006: Página accesible tras login
- URL: `/account/profile`
- Es la ruta por defecto tras login exitoso
- Visible en menú de cuenta del header

## Happy Path Scenarios

### S-PROF-001: Cliente ve su perfil
**Given** un Cliente está autenticado
**And** navega a `/account/profile`
**Then** ve su nombre, email, teléfono, rol y fecha de registro

### S-PROF-002: Cliente modifica su nombre
**Given** un Cliente está en su perfil
**When** cambia su nombre y guarda
**Then** ve mensaje "Perfil actualizado"
**And** el nuevo nombre aparece

### S-PROF-003: Cliente agrega teléfono
**Given** un Cliente no tiene teléfono
**When** ingresa un teléfono válido y guarda
**Then** el teléfono se guarda
**And** aparece en su perfil

### S-PROF-004: Owner ve su perfil
**Given** Owner está autenticado
**And** navega a `/account/profile`
**Then** ve "Owner" como rol
**And** ve sus datos pre-configurados

### S-PROF-005: Staff ve su perfil
**Given** Staff está autenticado
**And** navega a `/account/profile`
**Then** ve "Staff" como rol
**And** ve sus datos pre-configurados

## Edge Case Scenarios

### S-PROF-006: Nombre muy corto
**Given** un usuario intenta poner nombre de 1 carácter
**Then** ve error: "El nombre debe tener al menos 2 caracteres"
**And** no se guarda

### S-PROF-007: Teléfono con formato inválido
**Given** un usuario ingresa teléfono incorrecto
**Then** ve error: "Formato válido: +54 9xxxxxxxx"
**And** el campo se marca en rojo

### S-PROF-008: Sesión expirada al acceder
**Given** un usuario no autenticado intenta acceder
**Then** es redirigido a `/login`
**And** al hacer login vuelve a `/account/profile`

### S-PROF-009: Intento de acceso a otro usuario
**Given** un usuario intenta acceder a /account/profile?id=otro
**Then** siempre ve su propio perfil
**And** el parámetro se ignora

### S-PROF-010: Intento de cambio de email
**Given** un usuario intenta cambiar su email desde API
**Then** el cambio se ignora
**And** el email original permanece

### S-PROF-011: Error de base de datos al guardar
**Given** hay error de DB al guardar
**Then** ve mensaje: "Error al guardar. Intenta más tarde."
**And** sus datos no se pierden del formulario

### S-PROF-012: Owner sin .env configurado
**Given** Owner no está configurado en .env
**When** intenta ver su perfil
**Then** es tratada como Cliente (si tiene sesión de DB)
**And** el sistema funciona normalmente

## Implementation Notes

- API Endpoints:
  - `GET /api/auth/profile` - obtener datos del perfil
  - `PUT /api/auth/profile` - actualizar perfil
- Proteger con middleware de autenticación
- Para Owner/Staff: leer datos de process.env
- Para Cliente: leer de SQLite