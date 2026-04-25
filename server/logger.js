import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const logDir = path.join(__dirname, 'logs')
const logFile = path.join(logDir, 'ai.log')

function safeJson(obj) {
  try {
    return JSON.stringify(obj)
  } catch {
    return String(obj)
  }
}

export function appendLog(entry) {
  try {
    if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true })
    const line = `${new Date().toISOString()} ${safeJson(entry)}\n`
    fs.appendFileSync(logFile, line, 'utf8')
  } catch {
    // 忽略日志失败，避免影响主流程
  }
}

