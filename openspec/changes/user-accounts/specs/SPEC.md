# Spec: user-accounts

## Overview

Sistema de cuentas de usuario para La Salumeria Silvio con autenticación, perfil, historial de pedidos y gestión de direcciones.

## Roles de Usuario

| Rol | Origen | Registro | Acesso |
|----|--------|----------|---------|
| Owner | .env | NO | Completo |
| Staff | .env | NO | Parcial |
| Cliente | SQLite | PÚBLICO | Propio |

## Capabilities

- [user-registration.md](user-registration.md) - Registro público de Cliente
- [user-login.md](user-login.md) - Autenticación y sesión
- [user-profile.md](user-profile.md) - Ver y editar perfil
- [user-order-history.md](user-order-history.md) - Historial de pedidos
- [user-addresses.md](user-addresses.md) - CRUD direcciones

## Additional Requirements

### AR-001: Header con indicador de sesión activa
- Cuando usuario autenticado navega por el sitio
- Mostrar en el header:
  - Avatar o inicial del nombre
  - Badge con estado de sesión (punto verde)
  - Nombre del usuario
- Click en el nombre muestra menú: Perfil, Pedidos, Direcciones, Cerrar Sesión
- Mostrar en TODAS las páginas cuando autenticado

### AR-002: Redirect a /account/profile
- Después de login exitoso: SIEMPRE redirigir a `/account/profile`
- Después de registro exitoso: SIEMPRE redirigir a `/account/profile`
- No redirigir al catálogo ni home

### AR-003: Autenticación via .env para Owner/Staff
-Owner configurado en .env:
  - OWNER_EMAIL=dueño@lasalumeria.com
  - OWNER_PASSWORD_HASH=$2b$10$...
- Staff configurado en .env:
  - STAFF_EMAILS=staff1@,staff2@
  - STAFF_PASSWORD_HASHES=hash1,hash2
- Owner y Staff NO se guardan en SQLite
- Verificar contra variables de entorno primero

### AR-004: SQLite storage
-Tabla usuarios:
  ```sql
  CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    nombre TEXT NOT NULL,
    telefono TEXT,
    rol TEXT DEFAULT 'Cliente',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  ```
- Tabla direcciones:
  ```sql
  CREATE TABLE direcciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    alias TEXT,
    calle TEXT NOT NULL,
    numero TEXT NOT NULL,
    piso TEXT,
    ciudad TEXT NOT NULL,
    provincia TEXT NOT NULL,
    cp TEXT NOT NULL,
    telefono TEXT,
    es_principal INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES usuarios(id)
  );
  ```

### AR-005: Tabla pedidos existente (asumida)
- Verificar esquema de tabla pedidos
- Debe tener user_id para vincular con usuario
- Si no existe, crear

### AR-006: Rutas de cuenta
| Ruta | Descripción | Acceso |
|------|-------------|--------|
| `/account/profile` | Perfil del usuario | Cliente, Owner, Staff |
| `/account/orders` | Historial de pedidos | Cliente, Owner*, Staff* |
| `/account/addresses` | Gestión de direcciones | Cliente |

*Owner/Staff ven todos los pedidos

## User Flows

### Flow 1: Registro y login de Cliente
1. Usuario visita página pública de registro
2. Completa formulario (email, password, nombre, teléfono)
3. Se valida y crea usuario en SQLite
4. Auto-login y cookie de sesión
5. Redirect a /account/profile
6. Header muestra indicador de sesión

### Flow 2: Login de Owner/Staff
1. Usuario visita página de login
2. Ingresa credenciales de .env
3. Verifica contra variables de entorno
4. Crea sesión con rol Owner/Staff
5. Redirect a /account/profile
6. Header muestra indicador con rol

### Flow 3: Navegación autenticada
1. Usuario autenticado navega al catálogo
2. Header siempre muestra sesión activa
3. Click en nombre muestra menú
4. Accede a perfil, pedidos, direcciones
5. Logout desde menú

## Security Requirements

### SEC-001: Contraseñas
- Never guardar en texto plano
- Usar bcrypt cost=10
- Validar requisitos mínimos

### SEC-002: Cookies
- httpOnly: true
- secure: true (producción)
- sameSite: 'strict'
- maxAge: 7 días

### SEC-003: SQL Injection
- Usar prepared statements
- Sanitizar inputs

### SEC-004: Rate Limiting
- 5 intentos fallidos por IP en 15 min

## Acceptance Criteria

- [ ] Cliente puede registrarse con email único
- [ ] Cliente puede hacer login con credenciales correctas
- [ ] Login redirige a /account/profile (no al catálogo)
- [ ] Header muestra indicación de sesión activa
- [ ] Owner puede hacer login con credenciales de .env
- [ ] Staff puede hacer login con credenciales de .env
- [ ] Cliente ve y edita su perfil
- [ ] Cliente ve su historial de pedidos
- [ ] Cliente puede CRUD sus direcciones
- [ ] Owner/Staff ven mensaje de "no disponible" en direcciones
- [ ] Sesión persiste entre refresh
- [ ] Logout borra sesión y redirige

## Implementation Priority

1. user-registration + user-login (core auth)
2. user-profile (data management)
3. user-order-history (orders integration)
4. user-addresses (shipping)