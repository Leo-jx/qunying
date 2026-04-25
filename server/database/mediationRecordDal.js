import { query, transaction } from './db.js'

export async function findAllRecords() {
  const sql = `
    SELECT mr.*, d.case_number, u.username as mediator_username 
    FROM mediation_records mr 
    LEFT JOIN disputes d ON mr.dispute_id = d.id 
    LEFT JOIN users u ON mr.mediator_id = u.id 
    ORDER BY mr.created_at DESC
  `
  return await query(sql)
}

export async function findRecordById(id) {
  const sql = `
    SELECT mr.*, d.case_number, u.username as mediator_username 
    FROM mediation_records mr 
    LEFT JOIN disputes d ON mr.dispute_id = d.id 
    LEFT JOIN users u ON mr.mediator_id = u.id 
    WHERE mr.id = ?
  `
  const results = await query(sql, [id])
  return results[0] || null
}

export async function findRecordsByDisputeId(disputeId) {
  const sql = `
    SELECT mr.*, u.username as mediator_username 
    FROM mediation_records mr 
    LEFT JOIN users u ON mr.mediator_id = u.id 
    WHERE mr.dispute_id = ?
    ORDER BY mr.created_at ASC
  `
  return await query(sql, [disputeId])
}

export async function findRecordsByMediatorId(mediatorId) {
  const sql = `
    SELECT mr.*, d.case_number 
    FROM mediation_records mr 
    LEFT JOIN disputes d ON mr.dispute_id = d.id 
    WHERE mr.mediator_id = ?
    ORDER BY mr.created_at DESC
  `
  return await query(sql, [mediatorId])
}

export async function findRecordsByType(recordType) {
  const sql = `
    SELECT mr.*, d.case_number, u.username as mediator_username 
    FROM mediation_records mr 
    LEFT JOIN disputes d ON mr.dispute_id = d.id 
    LEFT JOIN users u ON mr.mediator_id = u.id 
    WHERE mr.record_type = ?
    ORDER BY mr.created_at DESC
  `
  return await query(sql, [recordType])
}

export async function createRecord(recordData) {
  const { dispute_id, mediator_id, record_content, record_type = 'note' } = recordData
  const sql = `
    INSERT INTO mediation_records (dispute_id, mediator_id, record_content, record_type) 
    VALUES (?, ?, ?, ?)
  `
  const result = await query(sql, [dispute_id, mediator_id, record_content, record_type])
  return { id: result.insertId, dispute_id, mediator_id, record_type }
}

export async function updateRecord(id, recordData) {
  const { record_content, record_type } = recordData
  const sql = 'UPDATE mediation_records SET record_content = ?, record_type = ? WHERE id = ?'
  const result = await query(sql, [record_content, record_type, id])
  return result.affectedRows > 0
}

export async function deleteRecord(id) {
  const sql = 'DELETE FROM mediation_records WHERE id = ?'
  const result = await query(sql, [id])
  return result.affectedRows > 0
}

export async function deleteRecordsByDisputeId(disputeId) {
  const sql = 'DELETE FROM mediation_records WHERE dispute_id = ?'
  const result = await query(sql, [disputeId])
  return result.affectedRows
}

export async function countRecords() {
  const sql = 'SELECT COUNT(*) as total FROM mediation_records'
  const results = await query(sql)
  return results[0].total
}

export async function countRecordsByDisputeId(disputeId) {
  const sql = 'SELECT COUNT(*) as total FROM mediation_records WHERE dispute_id = ?'
  const results = await query(sql, [disputeId])
  return results[0].total
}

export async function getRecentRecords(limit = 10) {
  const sql = `
    SELECT mr.*, d.case_number, u.username as mediator_username 
    FROM mediation_records mr 
    LEFT JOIN disputes d ON mr.dispute_id = d.id 
    LEFT JOIN users u ON mr.mediator_id = u.id 
    ORDER BY mr.created_at DESC 
    LIMIT ?
  `
  return await query(sql, [limit])
}

export default {
  findAllRecords,
  findRecordById,
  findRecordsByDisputeId,
  findRecordsByMediatorId,
  findRecordsByType,
  createRecord,
  updateRecord,
  deleteRecord,
  deleteRecordsByDisputeId,
  countRecords,
  countRecordsByDisputeId,
  getRecentRecords,
}
