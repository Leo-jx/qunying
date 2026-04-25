import { chatCompletions } from './openaiClient.js'

async function main() {
  const prompt = '请用一句话说明“AI 辅助与群英决策边界”。只输出答案，不要额外解释。'

  const result = await chatCompletions({
    requestId: 'local-test',
    modelId: process.env.AI_MODEL_ID,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    maxTokens: 256,
    timeoutMs: Number(process.env.AI_TIMEOUT_MS || 30000),
  })

  // eslint-disable-next-line no-console
  console.log('--- AI RESULT ---')
  console.log(result.content)
  // eslint-disable-next-line no-console
  console.log('modelId:', result.modelId, 'usage:', result.usage)
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('AI test failed:', e?.message || e)
  process.exitCode = 1
})

