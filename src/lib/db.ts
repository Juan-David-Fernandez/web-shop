/**
 * SQLite database connection and schema management
 */
import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Database file path - data/users.db
const dbPath = path.resolve(__dirname, '../../data/users.db')

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initSchema()
  }
  return db
}

function initSchema(): void {
  if (!db) return

  // Tabla usuarios (AR-004)
  db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      nombre TEXT NOT NULL,
      telefono TEXT,
      rol TEXT DEFAULT 'Cliente',
      token TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tabla direcciones (AR-004)
  db.exec(`
    CREATE TABLE IF NOT EXISTS direcciones (
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
      FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE
    )
  `)

  // Tabla pedidos (AR-005)
  db.exec(`
    CREATE TABLE IF NOT EXISTS pedidos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      total REAL NOT NULL,
      estado TEXT DEFAULT 'pendiente',
      items TEXT NOT NULL,
      direccion_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY (direccion_id) REFERENCES direcciones(id) ON DELETE SET NULL
    )
  `)

  console.log('SQLite schema initialized:', dbPath)
}

export function closeDb(): void {
  if (db) {
    db.close()
    db = null
  }
}