import { query, transaction } from './db.js'

export async function findAllDisputes() {
  const sql = `
    SELECT d.*, u.username as assigned_username 
    FROM disputes d 
    LEFT JOIN users u ON d.assigned_to = u.id 
    ORDER BY d.created_at DESC
  `
  return await query(sql)
}

export async function findDisputeById(id) {
  const sql = `
    SELECT d.*, u.username as assigned_username 
    FROM disputes d 
    LEFT JOIN users u ON d.assigned_to = u.id 
    WHERE d.id = ?
  `
  const results = await query(sql, [id])
  return results[0] || null
}

export async function findDisputeByCaseNumber(caseNumber) {
  const sql = 'SELECT * FROM disputes WHERE case_number = ?'
  const results = await query(sql, [caseNumber])
  return results[0] || null
}

export async function findDisputesByStatus(status) {
  const sql = `
    SELECT d.*, u.username as assigned_username 
    FROM disputes d 
    LEFT JOIN users u ON d.assigned_to = u.id 
    WHERE d.status = ?
    ORDER BY d.created_at DESC
  `
  return await query(sql, [status])
}

export async function findDisputesByApplicant(applicantName) {
  const sql = `
    SELECT d.*, u.username as assigned_username 
    FROM disputes d 
    LEFT JOIN users u ON d.assigned_to = u.id 
    WHERE d.applicant_name LIKE ?
    ORDER BY d.created_at DESC
  `
  return await query(sql, [`%${applicantName}%`])
}

export async function findDisputesByAssignedUser(userId) {
  const sql = `
    SELECT d.*, u.username as assigned_username 
    FROM disputes d 
    LEFT JOIN users u ON d.assigned_to = u.id 
    WHERE d.assigned_to = ?
    ORDER BY d.created_at DESC
  `
  return await query(sql, [userId])
}

export async function createDispute(disputeData) {
  const {
    case_number,
    applicant_name,
    applicant_phone,
    respondent_name,
    dispute_type,
    dispute_content,
  } = disputeData
  
  const sql = `
    INSERT INTO disputes 
    (case_number, applicant_name, applicant_phone, respondent_name, dispute_type, dispute_content, status) 
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `
  const result = await query(sql, [
    case_number,
    applicant_name,
    applicant_phone,
    respondent_name,
    dispute_type,
    dispute_content,
  ])
  return { id: result.insertId, case_number, status: 'pending' }
}

export async function updateDispute(id, disputeData) {
  const {
    applicant_name,
    applicant_phone,
    respondent_name,
    dispute_type,
    dispute_content,
    status,
    assigned_to,
  } = disputeData
  
  const sql = `
    UPDATE disputes SET 
    applicant_name = ?, 
    applicant_phone = ?, 
    respondent_name = ?, 
    dispute_type = ?, 
    dispute_content = ?,
    status = ?,
    assigned_to = ?
    WHERE id = ?
  `
  const result = await query(sql, [
    applicant_name,
    applicant_phone,
    respondent_name,
    dispute_type,
    dispute_content,
    status,
    assigned_to,
    id,
  ])
  return result.affectedRows > 0
}

export async function updateDisputeStatus(id, status) {
  const sql = 'UPDATE disputes SET status = ? WHERE id = ?'
  const result = await query(sql, [status, id])
  return result.affectedRows > 0
}

export async function assignDispute(disputeId, userId) {
  const sql = 'UPDATE disputes SET assigned_to = ?, status = ? WHERE id = ?'
  const result = await query(sql, [userId, 'accepted', disputeId])
  return result.affectedRows > 0
}

export async function deleteDispute(id) {
  const sql = 'DELETE FROM disputes WHERE id = ?'
  const result = await query(sql, [id])
  return result.affectedRows > 0
}

export async function countDisputes() {
  const sql = 'SELECT COUNT(*) as total FROM disputes'
  const results = await query(sql)
  return results[0].total
}

export async function countDisputesByStatus(status) {
  const sql = 'SELECT COUNT(*) as total FROM disputes WHERE status = ?'
  const results = await query(sql, [status])
  return results[0].total
}

export async function getDisputeStats() {
  const sql = `
    SELECT 
      status,
      COUNT(*) as count 
    FROM disputes 
    GROUP BY status
  `
  return await query(sql)
}

export async function getDisputesByDateRange(startDate, endDate) {
  const sql = `
    SELECT d.*, u.username as assigned_username 
    FROM disputes d 
    LEFT JOIN users u ON d.assigned_to = u.id 
    WHERE d.created_at BETWEEN ? AND ?
    ORDER BY d.created_at DESC
  `
  return await query(sql, [startDate, endDate])
}

export default {
  findAllDisputes,
  findDisputeById,
  findDisputeByCaseNumber,
  findDisputesByStatus,
  findDisputesByApplicant,
  findDisputesByAssignedUser,
  createDispute,
  updateDispute,
  updateDisputeStatus,
  assignDispute,
  deleteDispute,
  countDisputes,
  countDisputesByStatus,
  getDisputeStats,
  getDisputesByDateRange,
}
