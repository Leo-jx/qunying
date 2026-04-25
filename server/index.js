import dotenv from 'dotenv'
import express from 'express'
import cors from 'cors'
import crypto from 'crypto'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { chatCompletions } from './openaiClient.js'
import { appendLog } from './logger.js'
import dbRoutes from './database/dbRoutes.js'
import { testConnection, closePool } from './database/db.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '.env') })

const app = express()
const PORT = process.env.AI_SERVER_PORT ? Number(process.env.AI_SERVER_PORT) : 3001

app.use(
  cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }),
)
app.use(express.json({ limit: '1mb' }))

app.use((req, _res, next) => {
  const requestId = crypto.randomUUID()
  req.requestId = requestId
  next()
})

app.get('/health', async (_req, res) => {
  const dbOk = await testConnection()
  res.json({ 
    ok: true, 
    time: new Date().toISOString(),
    database: dbOk ? 'connected' : 'disconnected'
  })
})

app.use('/api/db', dbRoutes)

app.post('/api/ai/chat', async (req, res) => {
  const startedAt = Date.now()
  const requestId = req.requestId

  try {
    const {
      prompt,
      messages,
      modelId,
      temperature,
      maxTokens,
      timeoutMs,
      stream,
    } = req.body || {}

    if (stream) {
      return res.status(400).json({ error: '当前代理仅支持非流式' })
    }

    const aiMessages =
      Array.isArray(messages) && messages.length > 0
        ? messages
        : [{ role: 'user', content: String(prompt ?? '') }]

    const result = await chatCompletions({
      requestId,
      modelId,
      messages: aiMessages,
      temperature,
      maxTokens,
      timeoutMs,
    })

    const latencyMs = Date.now() - startedAt
    appendLog({
      level: 'info',
      requestId,
      modelId: result.modelId,
      latencyMs,
      promptLength: (result.prompt ?? '').length,
      error: null,
    })

    return res.json({ content: result.content, modelId: result.modelId, usage: result.usage || null })
  } catch (err) {
    const latencyMs = Date.now() - startedAt
    appendLog({
      level: 'error',
      requestId,
      modelId: req.body?.modelId || process.env.AI_MODEL_ID,
      latencyMs,
      promptLength: String(req.body?.prompt ?? '').length,
      error: err?.message || String(err),
      stack: err?.stack,
    })

    return res.status(500).json({
      error: 'AI调用失败',
      detail: err?.message || String(err),
      requestId,
    })
  }
})

process.on('SIGINT', async () => {
  console.log('[Server] Received SIGINT, closing database pool...')
  await closePool()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('[Server] Received SIGTERM, closing database pool...')
  await closePool()
  process.exit(0)
})

app.listen(PORT, async () => {
  console.log(`[ai-proxy] listening on http://localhost:${PORT}`)
  console.log(`[ai-proxy] health: http://localhost:${PORT}/health`)
  console.log(`[ai-proxy] database API: http://localhost:${PORT}/api/db`)
  
  const dbOk = await testConnection()
  if (dbOk) {
    console.log('[ai-proxy] Database connection established')
  } else {
    console.warn('[ai-proxy] Database connection failed - please check DB configuration')
  }
})
