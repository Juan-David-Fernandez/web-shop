# Proposal: User Accounts

## Intent

Implementar sistema de cuentas de usuario para La Salumeria Silvio que permita registro/login personalizado, gestión de perfil, historial de pedidos y direcciones guardadas. Necesario para crear experiencia de e-commerce completa y capturar datos de clientes.

## Scope

### In Scope
- Registro de usuarios con email/contraseña
- Login con autenticación via cookies/jwt
- Perfil de usuario (nombre, email, teléfono)
- Historial de pedidos vinculados al usuario
- Dirección de envío guardada (múltiples)

### Out of Scope
- Payment integration (futuro)
- Carrito de compras (ya existe en feature-catalogo)
- Admin panel para gestión de usuarios
- OAuth social login

## Capabilities

### New Capabilities
- `user-registration`: Registro con email validation, hash de contraseña
- `user-login`: Autenticación con sesión persistida via cookies
- `user-profile`: Ver/edit datos personales
- `user-order-history`: Lista pedidos del usuario autenticado
- `user-addresses`: CRUD direcciones de envío

### Modified Capabilities
Ninguno - sistema nuevo

## Approach

Backend simplestore con Auth.js o custom JWT en cookies. Nano Stores para estado de sesión React island. Base de datos SQLite local o JSON file para usuarios/pedidos/direcciones. API routes en Astro para auth endpoints.

## Affected Areas

| Area | Impact | Description |
|------|--------|-------------|
| `src/pages/api/auth/*` | New | Endpoints registro/login/logout |
| `src/stores/auth.ts` | New | Nano Store para sesión |
| `src/components/auth/*` | New | React islands: LoginForm, RegisterForm, Profile |
| `src/components/account/*` | New | React islands: OrderHistory, AddressManager |
| `src/pages/account/*` | New | Rutas /account/profile, /account/orders, /account/addresses |
| `data/users.json` | New | Persistencia usuarios |
| `data/addresses.json` | New | Persistencia direcciones |

## Risks

| Risk | Likelihood | Mitigation |
|------|------------|-------------|
| Sesiones expiran inesperadamente | Medium | Refresh token + cookie flags seguros |
| Direcciones no se cargan | Low | Lazy loading con skeleton |
| Contraseñas inseguras | Low | bcrypt con salt, mínimo 8 chars |

## Rollback Plan

Revertir: git checkout HEAD~1 -- openspec/changes/user-accounts/ + eliminar rutas nuevas en /account/*

## Dependencies

- feature-catalogo (pedidos existentes)
- Nano Stores (state management)

## Success Criteria

- [ ] Usuario puede registrarse y ver perfil
- [ ] Login persiste sesión entre refresh
- [ ] Usuario ve historial de pedidos desde perfil
- [ ] Usuario puede guardar/edit/borrar direcciones
- [ ] Logout borra sesión correctamente