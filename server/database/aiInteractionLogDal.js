import { query, transaction } from './db.js'

export async function findAllLogs() {
  const sql = `
    SELECT l.*, u.username 
    FROM ai_interaction_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    ORDER BY l.created_at DESC
  `
  return await query(sql)
}

export async function findLogById(id) {
  const sql = `
    SELECT l.*, u.username 
    FROM ai_interaction_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    WHERE l.id = ?
  `
  const results = await query(sql, [id])
  return results[0] || null
}

export async function findLogsByUserId(userId) {
  const sql = `
    SELECT l.*, u.username 
    FROM ai_interaction_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    WHERE l.user_id = ?
    ORDER BY l.created_at DESC
  `
  return await query(sql, [userId])
}

export async function findLogsByRequestType(requestType) {
  const sql = `
    SELECT l.*, u.username 
    FROM ai_interaction_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    WHERE l.request_type = ?
    ORDER BY l.created_at DESC
  `
  return await query(sql, [requestType])
}

export async function findLogsByModel(modelUsed) {
  const sql = `
    SELECT l.*, u.username 
    FROM ai_interaction_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    WHERE l.model_used = ?
    ORDER BY l.created_at DESC
  `
  return await query(sql, [modelUsed])
}

export async function createLog(logData) {
  const {
    user_id = null,
    request_type,
    input_text,
    output_text = '',
    model_used,
    tokens_used = 0,
    latency_ms = 0,
  } = logData
  
  const sql = `
    INSERT INTO ai_interaction_logs 
    (user_id, request_type, input_text, output_text, model_used, tokens_used, latency_ms) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `
  const result = await query(sql, [
    user_id,
    request_type,
    input_text,
    output_text,
    model_used,
    tokens_used,
    latency_ms,
  ])
  return { id: result.insertId, user_id, request_type }
}

export async function deleteLog(id) {
  const sql = 'DELETE FROM ai_interaction_logs WHERE id = ?'
  const result = await query(sql, [id])
  return result.affectedRows > 0
}

export async function deleteLogsByUserId(userId) {
  const sql = 'DELETE FROM ai_interaction_logs WHERE user_id = ?'
  const result = await query(sql, [userId])
  return result.affectedRows
}

export async function countLogs() {
  const sql = 'SELECT COUNT(*) as total FROM ai_interaction_logs'
  const results = await query(sql)
  return results[0].total
}

export async function countLogsByUserId(userId) {
  const sql = 'SELECT COUNT(*) as total FROM ai_interaction_logs WHERE user_id = ?'
  const results = await query(sql, [userId])
  return results[0].total
}

export async function getTotalTokensUsed() {
  const sql = 'SELECT SUM(tokens_used) as total FROM ai_interaction_logs'
  const results = await query(sql)
  return results[0].total || 0
}

export async function getAverageLatency() {
  const sql = 'SELECT AVG(latency_ms) as average FROM ai_interaction_logs'
  const results = await query(sql)
  return results[0].average || 0
}

export async function getUsageStats() {
  const sql = `
    SELECT 
      request_type,
      COUNT(*) as count,
      SUM(tokens_used) as total_tokens,
      AVG(latency_ms) as avg_latency
    FROM ai_interaction_logs 
    GROUP BY request_type
  `
  return await query(sql)
}

export async function getRecentLogs(limit = 20) {
  const sql = `
    SELECT l.*, u.username 
    FROM ai_interaction_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    ORDER BY l.created_at DESC 
    LIMIT ?
  `
  return await query(sql, [limit])
}

export async function getLogsByDateRange(startDate, endDate) {
  const sql = `
    SELECT l.*, u.username 
    FROM ai_interaction_logs l 
    LEFT JOIN users u ON l.user_id = u.id 
    WHERE l.created_at BETWEEN ? AND ?
    ORDER BY l.created_at DESC
  `
  return await query(sql, [startDate, endDate])
}

export default {
  findAllLogs,
  findLogById,
  findLogsByUserId,
  findLogsByRequestType,
  findLogsByModel,
  createLog,
  deleteLog,
  deleteLogsByUserId,
  countLogs,
  countLogsByUserId,
  getTotalTokensUsed,
  getAverageLatency,
  getUsageStats,
  getRecentLogs,
  getLogsByDateRange,
}
