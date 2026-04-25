import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../.env') })

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'qunying_app',
  password: process.env.DB_PASS || 'qunying123',
  database: process.env.DB_NAME || 'qunying_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  timezone: '+08:00',
  dateStrings: true,
}

let pool = null

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(dbConfig)
    console.log('[DB] MySQL connection pool created')
  }
  return pool
}

export async function query(sql, params = []) {
  const pool = getPool()
  try {
    const [results] = await pool.execute(sql, params)
    return results
  } catch (error) {
    console.error('[DB] Query error:', error.message)
    throw error
  }
}

export async function getConnection() {
  const pool = getPool()
  return await pool.getConnection()
}

export async function transaction(callback) {
  const connection = await getConnection()
  try {
    await connection.beginTransaction()
    const result = await callback(connection)
    await connection.commit()
    return result
  } catch (error) {
    await connection.rollback()
    throw error
  } finally {
    connection.release()
  }
}

export async function testConnection() {
  try {
    const pool = getPool()
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    console.log('[DB] MySQL connection test successful')
    return true
  } catch (error) {
    console.error('[DB] MySQL connection test failed:', error.message)
    return false
  }
}

export async function closePool() {
  if (pool) {
    await pool.end()
    pool = null
    console.log('[DB] MySQL connection pool closed')
  }
}

export default {
  getPool,
  query,
  getConnection,
  transaction,
  testConnection,
  closePool,
}
