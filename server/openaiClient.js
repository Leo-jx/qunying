import { OpenAI } from 'openai'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '.env') })

const DEFAULT_TIMEOUT_MS = 30000

function getEnv(name, fallback = undefined) {
  const v = process.env[name]
  if (v === undefined || v === '') return fallback
  return v
}

function getConfig() {
  const apiKey = getEnv('AI_API_KEY')
  const baseURL = getEnv('AI_HTTP_BASE_URL')
  const defaultModelId = getEnv('AI_MODEL_ID')
  if (!apiKey) throw new Error('缺少环境变量 AI_API_KEY')
  if (!baseURL) throw new Error('缺少环境变量 AI_HTTP_BASE_URL')
  if (!defaultModelId) throw new Error('缺少环境变量 AI_MODEL_ID')
  return { apiKey, baseURL, defaultModelId }
}

export async function chatCompletions({
  requestId,
  modelId,
  messages,
  temperature,
  maxTokens,
  timeoutMs,
}) {
  const startedAt = Date.now()
  const { apiKey, baseURL, defaultModelId } = getConfig()
  const client = new OpenAI({ apiKey, baseURL })

  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), timeoutMs ?? DEFAULT_TIMEOUT_MS)

  try {
    console.log(`[openaiClient] Making request to ${baseURL} with model ${modelId || defaultModelId}`)
    console.log(`[openaiClient] Messages: ${JSON.stringify(messages)}`)
    
    const resp = await client.chat.completions.create(
      {
        model: modelId || defaultModelId,
        messages,
        temperature: typeof temperature === 'number' ? temperature : 0.7,
        max_tokens: typeof maxTokens === 'number' ? maxTokens : 2048,
        stream: false,
      },
      {
        signal: controller.signal,
      },
    )

    console.log(`[openaiClient] Response received: ${JSON.stringify(resp)}`)
    
    const content = resp?.choices?.[0]?.message?.content ?? ''

    return {
      content,
      modelId: resp?.model ?? modelId ?? defaultModelId,
      prompt: messages?.map((m) => m?.content).join('\n') ?? '',
      usage: resp?.usage ?? null,
      latencyMs: Date.now() - startedAt,
      requestId,
    }
  } catch (error) {
    console.error(`[openaiClient] Error: ${error.message}`)
    console.error(`[openaiClient] Error stack: ${error.stack}`)
    throw error
  } finally {
    clearTimeout(t)
  }
}

