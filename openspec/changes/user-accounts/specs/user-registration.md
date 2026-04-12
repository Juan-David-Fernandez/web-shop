# Spec: user-registration

## Description

Capability para registro de nuevos usuarios (rol Cliente) en La Salumeria Silvio. Solo usuarios con rol Cliente se registran públicamente; Owner y Staff tienen acceso pre-configurado via variables de entorno.

## Requirements

### R-REG-001: Registro público de Cliente
- El formulario de registro debe ser accesible públicamente sin autenticación
- Solo permite registro con rol `Cliente` por defecto
- Owner y Staff NO se registran via este formulario (tienen acceso via .env)

### R-REG-002: Validación de email
- Email debe cumplir formato válido (regex estándar)
- Email debe ser único en la base de datos
- Error claro si email ya existe: "Ya existe una cuenta con este email"

### R-REG-003: Validación de contraseña
- Mínimo 8 caracteres
- Al menos una letra mayúscula
- Al menos un número
- Mostrar requisitos mientras el usuario escribe

### R-REG-004: Hashing de contraseña
- Usar bcrypt con salt automático
- НЕМПГ guardar contraseña en texto plano
- Cost factor: 10 (balance seguridad/rendimiento)

### R-REG-005: Datos requeridos
- Email (único, requerido)
- Contraseña (requerida, con validación)
- Nombre completo (requerido)
- Teléfono (opcional, formato argentino: +54 9xxxxxxxx)

### R-REG-006: Después de registro exitoso
- Auto-login automático tras registro
- Redirigir a `/account/profile`
- Crear entrada en tabla `usuarios` con rol Cliente

### R-REG-007: Almacenamiento en SQLite
- Guardar en tabla `usuarios` de SQLite
- El esquema de usuarios debe tener:
  - id (INTEGER PRIMARY KEY)
  - email (TEXT UNIQUE NOT NULL)
  - password_hash (TEXT NOT NULL)
  - nombre (TEXT NOT NULL)
  - telefono (TEXT)
  - rol (TEXT DEFAULT 'Cliente')
  - created_at (DATETIME)
  - updated_at (DATETIME)

## Happy Path Scenarios

### S-REG-001: Cliente se registra exitosamente
**Given** el usuario está en la página de registro
**And** ingresa email válido no registrado
**And** ingresa contraseña que cumple requisitos
**And** ingresa nombre completo
**When** hace click en "Registrarse"
**Then** se crea el usuario en la base de datos con password hasheado
**And** se inicia sesión automáticamente
**And** es redirigido a `/account/profile`
**And** ve mensaje "¡Bienvenido a La Salumería Silvio!"

### S-REG-002: Cliente ve validación en tiempo real
**Given** el usuario está en el formulario de registro
**When** escribe una contraseña corta
**Then** ve indicador visual de requisitos no cumplidos
**And** el botón de registro está deshabilitado

### S-REG-003: Registro con teléfono opcional
**Given** el usuario completa el formulario
**And** decide no ingresar teléfono
**When** envía el formulario
**Then** el registro es exitoso (teléfono es opcional)

## Edge Case Scenarios

### S-REG-004: Email ya registrado
**Given** el usuario ingresa un email que ya existe en la DB
**When** intenta registrarse
**Then** ve error: "Ya existe una cuenta con este email. ¿Olvidaste tu contraseña?"
**And** el formulario mantiene los datos excepto el email

### S-REG-005: Email con formato inválido
**Given** el usuario ingresa un email con formato inválido (ej: "usuario@@dominio")
**When** intenta registrarse
**Then** ve error: "Ingresa un email válido"
**And** el campo email se marca en rojo

### S-REG-006: Contraseña no cumple requisitos
**Given** el usuario ingresa contraseña sin mayúsculas
**When** intenta registrarse
**Then** ve error bajo el campo: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
**And** el botón permanece deshabilitado

### S-REG-007: Nombre vacío
**Given** el usuario intenta registrarse sin nombre
**Then** ve error: "El nombre es requerido"
**And** el campo nombre se marca en rojo

### S-REG-008: Intento de registro de Owner/Staff
**Given** un usuario intenta registrar un email con rol especial via formulario público
**Then** el sistema ignora cualquier intento de especificar rol
**And** todos los registros públicos reciben rol `Cliente` por defecto
**And** no hay forma de escalar privilegios via formulario

### S-REG-009: Base de datos no disponible
**Given** la base de datos SQLite no está accesible
**When** el usuario intenta registrarse
**Then** ve error: "Error de conexión. Intenta más tarde."
**And** no se muestra información técnica al usuario

### S-REG-010: SQL Injection en campos
**Given** un usuario malicioso ingresa SQL en campos del formulario
**When** envía el formulario
**Then** el sistema sanitiza todos los inputs
**And** el código SQL se tratadas como texto literal
**And** no ocurre inyección

## Implementation Notes

- API Endpoint: `POST /api/auth/register`
- Response codes: 201 (created), 400 (validation error), 409 (email exists), 500 (server error)
- Después de registro exitoso, setear cookie de sesión
- Usar prepared statements para SQLite
- Sanitizar inputs antes de cualquier consulta