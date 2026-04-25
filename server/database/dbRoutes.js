import express from 'express'
import { query, testConnection } from './db.js'
import * as userDal from './userDal.js'
import * as disputeDal from './disputeDal.js'
import * as mediationRecordDal from './mediationRecordDal.js'
import * as aiInteractionLogDal from './aiInteractionLogDal.js'

const router = express.Router()

router.get('/health', async (req, res) => {
  try {
    const ok = await testConnection()
    if (ok) {
      res.json({ ok: true, message: 'Database connection is healthy' })
    } else {
      res.status(503).json({ ok: false, message: 'Database connection failed' })
    }
  } catch (error) {
    res.status(503).json({ ok: false, message: error.message })
  }
})

router.get('/users', async (req, res) => {
  try {
    const users = await userDal.findAllUsers()
    res.json({ success: true, data: users })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/users/:id', async (req, res) => {
  try {
    const user = await userDal.findUserById(req.params.id)
    if (user) {
      res.json({ success: true, data: user })
    } else {
      res.status(404).json({ success: false, error: 'User not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/users', async (req, res) => {
  try {
    const user = await userDal.createUser(req.body)
    res.status(201).json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.put('/users/:id', async (req, res) => {
  try {
    const updated = await userDal.updateUser(req.params.id, req.body)
    res.json({ success: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const deleted = await userDal.deleteUser(req.params.id)
    res.json({ success: deleted })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/disputes', async (req, res) => {
  try {
    const disputes = await disputeDal.findAllDisputes()
    res.json({ success: true, data: disputes })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/disputes/:id', async (req, res) => {
  try {
    const dispute = await disputeDal.findDisputeById(req.params.id)
    if (dispute) {
      res.json({ success: true, data: dispute })
    } else {
      res.status(404).json({ success: false, error: 'Dispute not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/disputes', async (req, res) => {
  try {
    const dispute = await disputeDal.createDispute(req.body)
    res.status(201).json({ success: true, data: dispute })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.put('/disputes/:id', async (req, res) => {
  try {
    const updated = await disputeDal.updateDispute(req.params.id, req.body)
    res.json({ success: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.patch('/disputes/:id/status', async (req, res) => {
  try {
    const { status } = req.body
    const updated = await disputeDal.updateDisputeStatus(req.params.id, status)
    res.json({ success: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.patch('/disputes/:id/assign', async (req, res) => {
  try {
    const { userId } = req.body
    const assigned = await disputeDal.assignDispute(req.params.id, userId)
    res.json({ success: assigned })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete('/disputes/:id', async (req, res) => {
  try {
    const deleted = await disputeDal.deleteDispute(req.params.id)
    res.json({ success: deleted })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/disputes-stats/summary', async (req, res) => {
  try {
    const stats = await disputeDal.getDisputeStats()
    res.json({ success: true, data: stats })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/mediation-records', async (req, res) => {
  try {
    const records = await mediationRecordDal.findAllRecords()
    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/mediation-records/:id', async (req, res) => {
  try {
    const record = await mediationRecordDal.findRecordById(req.params.id)
    if (record) {
      res.json({ success: true, data: record })
    } else {
      res.status(404).json({ success: false, error: 'Record not found' })
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/disputes/:disputeId/mediation-records', async (req, res) => {
  try {
    const records = await mediationRecordDal.findRecordsByDisputeId(req.params.disputeId)
    res.json({ success: true, data: records })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/mediation-records', async (req, res) => {
  try {
    const record = await mediationRecordDal.createRecord(req.body)
    res.status(201).json({ success: true, data: record })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.put('/mediation-records/:id', async (req, res) => {
  try {
    const updated = await mediationRecordDal.updateRecord(req.params.id, req.body)
    res.json({ success: updated })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete('/mediation-records/:id', async (req, res) => {
  try {
    const deleted = await mediationRecordDal.deleteRecord(req.params.id)
    res.json({ success: deleted })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/ai-logs', async (req, res) => {
  try {
    const logs = await aiInteractionLogDal.findAllLogs()
    res.json({ success: true, data: logs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/ai-logs/recent', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const logs = await aiInteractionLogDal.getRecentLogs(limit)
    res.json({ success: true, data: logs })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.get('/ai-logs/stats', async (req, res) => {
  try {
    const stats = await aiInteractionLogDal.getUsageStats()
    res.json({ success: true, data: stats })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.post('/ai-logs', async (req, res) => {
  try {
    const log = await aiInteractionLogDal.createLog(req.body)
    res.status(201).json({ success: true, data: log })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

router.delete('/ai-logs/:id', async (req, res) => {
  try {
    const deleted = await aiInteractionLogDal.deleteLog(req.params.id)
    res.json({ success: deleted })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
