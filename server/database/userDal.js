import { query, transaction } from './db.js'

export async function findAllUsers() {
  const sql = 'SELECT id, username, role, phone, email, created_at FROM users ORDER BY created_at DESC'
  return await query(sql)
}

export async function findUserById(id) {
  const sql = 'SELECT id, username, role, phone, email, created_at FROM users WHERE id = ?'
  const results = await query(sql, [id])
  return results[0] || null
}

export async function findUserByUsername(username) {
  const sql = 'SELECT id, username, password_hash, role, phone, email, created_at FROM users WHERE username = ?'
  const results = await query(sql, [username])
  return results[0] || null
}

export async function findUsersByRole(role) {
  const sql = 'SELECT id, username, role, phone, email, created_at FROM users WHERE role = ? ORDER BY created_at DESC'
  return await query(sql, [role])
}

export async function createUser(userData) {
  const { username, password_hash, role = 'public', phone, email } = userData
  const sql = 'INSERT INTO users (username, password_hash, role, phone, email) VALUES (?, ?, ?, ?, ?)'
  const result = await query(sql, [username, password_hash, role, phone, email])
  return { id: result.insertId, username, role, phone, email }
}

export async function updateUser(id, userData) {
  const { username, role, phone, email } = userData
  const sql = 'UPDATE users SET username = ?, role = ?, phone = ?, email = ? WHERE id = ?'
  const result = await query(sql, [username, role, phone, email, id])
  return result.affectedRows > 0
}

export async function updateUserPassword(id, passwordHash) {
  const sql = 'UPDATE users SET password_hash = ? WHERE id = ?'
  const result = await query(sql, [passwordHash, id])
  return result.affectedRows > 0
}

export async function deleteUser(id) {
  const sql = 'DELETE FROM users WHERE id = ?'
  const result = await query(sql, [id])
  return result.affectedRows > 0
}

export async function countUsers() {
  const sql = 'SELECT COUNT(*) as total FROM users'
  const results = await query(sql)
  return results[0].total
}

export async function countUsersByRole(role) {
  const sql = 'SELECT COUNT(*) as total FROM users WHERE role = ?'
  const results = await query(sql, [role])
  return results[0].total
}

export default {
  findAllUsers,
  findUserById,
  findUserByUsername,
  findUsersByRole,
  createUser,
  updateUser,
  updateUserPassword,
  deleteUser,
  countUsers,
  countUsersByRole,
}
