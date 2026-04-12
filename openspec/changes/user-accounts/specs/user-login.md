# Spec: user-login

## Description

Capability para autenticación de usuarios en La Salumeria Silvio. Soporta tres tipos de usuario: Cliente (Desde DB), Owner y Staff (Desde .env). Usa cookies persistidas para mantener sesión.

## Requirements

### R-LOG-001: Autenticación de Cliente desde DB
- Cliente puede iniciar sesión con email + contraseña
- Contraseña verificada contra hash bcrypt en SQLite
- Sesión persistida en cookie httpOnly

### R-LOG-002: Autenticación de Owner desde .env
- Owner tiene acceso pre-configurado via variables de entorno
- No requiere registro en base de datos
- Credenciales en .env: `OWNER_EMAIL` y `OWNER_PASSWORD` (plain) o `OWNER_PASSWORD_HASH` (bcrypt)
- Si existe `OWNER_EMAIL` y `OWNER_PASSWORD_HASH` en .env, usar hash para verificar
- El password plain en .env solo para desarrollo/testing

### R-LOG-003: Autenticación de Staff desde .env
- Staff tiene acceso pre-configurado via variables de entorno
- Múltiples staff separados por coma en .env
- Variables: `STAFF_EMAILS` (lista de emails separados por coma)
- Staff usa su password de Owner o password propio si se define `STAFF_PASSWORDS`
- Formato .env: `STAFF_EMAILS=email1@,email2@` y `STAFF_PASSWORD_HASHES=hash1,hash2`

### R-LOG-004: Login exitoso redirect a /account/profile
- Después de login exitoso, SIEMPRE redirigir a `/account/profile`
- NO redirigir al catálogo ni a otra página
- Esta règle aplica para Cliente, Owner y Staff

### R-LOG-005: Sesión persistida en cookies
- Cookie de sesión con httpOnly, secure (en producción), sameSite=strict
- Duración: 7 días desde último uso (sliding expiration)
- Regenerar token de sesión en cada request válido
- Cookie nombre: `session_token`

### R-LOG-006: Fallback para email no encontrado
- Mostrar mensaje genérico: "Email o contraseña incorrectos"
- NO revelar si el email existe o no (seguridad)

### R-LOG-007: Intentos fallidos
- Limitar a 5 intentos fallidos por IP en 15 minutos
- Después del límite: mostrar CAPTCHA o esperar 15 minutos
- No bloquear cuenta permanentemente por seguridad

### R-LOG-008: Logout
- Endpoint `POST /api/auth/logout`
- Borra cookie de sesión
- Redirige a página principal
- Invalida token en servidor (blacklist opcional)

## Happy Path Scenarios

### S-LOG-001: Cliente inicia sesión exitosamente
**Given** un Cliente registrado en la base de datos
**And** está en la página de login
**When** ingresa email y contraseña correctos
**And** hace click en "Iniciar Sesión"
**Then** la sesión se crea en cookie
**And** es redirigido a `/account/profile`
**And** ve su nombre en el header

### S-LOG-002: Owner inicia sesión
**Given** las credenciales de Owner están en .env
**And** Owner está en la página de login
**When** ingresa las credenciales de Owner
**And** hace click en "Iniciar Sesión"
**Then** se crea sesión con rol Owner
**And** es redirigido a `/account/profile`
**And** tiene acceso completo al sistema

### S-LOG-003: Staff inicia sesión
**Given** el email del staff está en STAFF_EMAILS
**And** Staff está en la página de login
**When** ingresa credenciales de staff
**And** hace click en "Iniciar Sesión"
**And** es redirigido a `/account/profile`
**And** tiene acceso parcial (configurable)

### S-LOG-004: Sesión persiste en refresh
**Given** un usuario logueado
**When** cierra el navegador y vuelve a abrir
**Then** la sesión sigue activa
**And** puede acceder sin login nuevamente

### S-LOG-005: Sesión se renueva automáticamente
**Given** un usuario con sesión activa
**When** hace requests válidos
**Then** el token de sesión se renueva
**And** la expiración se extiende 7 días

## Edge Case Scenarios

### S-LOG-006: Contraseña incorrecta
**Given** un usuario ingresa wrong password
**When** intenta login
**Then** ve mensaje: "Email o contraseña incorrectos"
**And** el campo contraseña se limpia
**And** el email permanece

### S-LOG-007: Email no existe
**Given** un usuario ingresa email no registrado
**When** intenta login
**Then** ve mensaje genérico: "Email o contraseña incorrectos"
**And** NO se revela que el email no existe

### S-LOG-008: Campo email vacío
**Given** un usuario intenta login sin email
**Then** ve error: "El email es requerido"
**And** el campo se marca en rojo

### S-LOG-009: Cuenta deshabilitada (futuro)
**Given** un Cliente tiene cuenta deshabilitada
**When** intenta login
**Then** ve mensaje: "Cuenta deshabilitada. Contacta al administrador."

### S-LOG-010: Cookie bloqueada por navegador
**Given** el navegador tiene cookies bloqueadas
**When** intenta login
**Then** ve mensaje: "Habilita las cookies para iniciar sesión"

### S-LOG-011: Sesión expirada
**Given** un usuario con sesión expirada
**When** accede a página protegida
**Then** es redirigido a login
**And** al hacer login es redirigido a `/account/profile`

### S-LOG-012: Owner no configurado en .env
**Given** no hay variables OWNER en .env
**When** se intenta usar credenciales de Owner
**Then** el sistema funciona normalmente (Owner no existe)
**And** solo Cliente puede loguearse

### S-LOG-013: Intento de acceso directo a API sin sesión
**Given** un request a endpoint protegido sin cookie
**Then** retorna 401 Unauthorized
**And** no revela información del endpoint

### S-LOG-014: Cookie adulterada
**Given** un usuario modifica la cookie de sesión
**Then** la cookie se invalida
**And** el usuario debe hacer login nuevamente

### S-LOG-015: Máximo intentos superado
**Given** un usuario excede 5 intentos fallidos
**Then** ve mensaje: "Demasiados intentos. Intenta en 15 minutos."
**And** debe esperar para intentar nuevamente

## Implementation Notes

- API Endpoints: 
  - `POST /api/auth/login` - autenticación
  - `POST /api/auth/logout` - cerrar sesión  
  - `GET /api/auth/session` - verificar sesión actual
- Verificar sesión en middleware para rutas protegidas
- Owner/Staff verificado antes de consulta a DB
- Cookie config: `httpOnly: true`, `secure: true` (production), `sameSite: 'strict'`, `maxAge: 7d`
- Rate limiting por IP en endpoint login