/**
 * AI服务模块
 * 通过后端API调用AI模型
 */

const DEFAULT_TIMEOUT_MS = 30000
// 确保API_BASE_URL在不同环境下都能正确工作
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
                    (import.meta.env.DEV ? '/api' : 'https://qunying-ai-proxy.cloudflareworkers.com')

function normalizeErrorMessage(err) {
  if (!err) return '未知错误'
  if (typeof err === 'string') return err
  return err?.message || err?.detail || JSON.stringify(err)
}

export async function callAI(prompt, options = {}) {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const resp = await fetch(`${API_BASE_URL}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        prompt: String(prompt ?? ''),
        modelId: options.modelId,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        timeoutMs,
        stream: false,
      }),
    })

    const data = await resp.json().catch(() => ({}))

    if (!resp.ok) {
      throw new Error(data?.detail || data?.error || `AI调用失败（HTTP ${resp.status}）`)
    }

    return data?.content || ''
  } catch (err) {
    console.error('[aiService] callAI failed:', err)
    throw err instanceof Error ? err : new Error(normalizeErrorMessage(err))
  } finally {
    clearTimeout(timeoutId)
  }
}

// 目前代理仅提供非流式能力：如需流式可继续扩展后端与前端。
export function callAIStream() {
  throw new Error('callAIStream 当前不支持（请先使用 callAI）')
}

export async function generateSummary(text, maxLength = 200) {
  const prompt = `请把以下调解案情要点总结为不超过${maxLength}字的摘要，要求：仅整理事实与争议焦点，不作裁决、不替代群英判断。\n\n案情：${text}`
  return callAI(prompt)
}

export async function extractKeyInfo(text) {
  const prompt = `请从以下文本中提取关键信息：人物、时间地点、事实经过、诉求/争议焦点。要求：不推断责任结论，不替代群英裁断。\n\n文本：${text}`
  return callAI(prompt)
}

export async function checkCompliance(text) {
  const prompt = `请检查以下文本中可能包含的敏感个人信息与不当表述风险，并给出合规改写建议（不改变调解实质）。\n\n文本：${text}`
  return callAI(prompt)
}

export async function batchProcess(texts, instruction) {
  const jobs = texts.map((t) => callAI(`${instruction}\n\n文本：${t}`))
  return Promise.all(jobs)
}

export async function redactForPublic(rawText) {
  const prompt = `请对下面“调解结论/协议内容”做脱敏处理，生成用于“三公开”的公示文本。\n要求：\n1) 仅替换/隐藏敏感个人信息（姓名、手机号、身份证、精确住址等）；\n2) 不改变事实与法律约束的含义；\n3) 生成一段可以公开发布的文本。\n\n原文：${rawText}`
  return callAI(prompt, { temperature: 0.2, maxTokens: 1024, timeoutMs: 30000 })
}

export async function complianceCheckForPublic(publicText) {
  const prompt = `请对下面拟公开文本做合规检查，并列出风险点（若无风险也说明“未发现明显合规风险”）。\n要求：\n- 仅做风险提示，不给出裁决。\n- 输出格式：\n【合规结论】...\n【风险清单】(无则写“无”)\n【建议改写】...\n\n文本：${publicText}`
  return callAI(prompt, { temperature: 0.2, maxTokens: 800, timeoutMs: 30000 })
}

export async function legalReferenceSuggestions(caseText) {
  const prompt = `请根据以下“纠纷案情/争点描述”给出法治参考：可能涉及的法条类别、相近案例要点、程序提醒。\n要求：\n1) 只输出“参考建议”，不作裁决；\n2) 不要编造不存在的具体条文编号；可以写“相关法条（可核对原文）”；\n3) 用要点形式输出。\n\n案情：${caseText}`
  return callAI(prompt, { temperature: 0.2, maxTokens: 900, timeoutMs: 30000 })
}

export async function aiLegalConsult(questionText) {
  const prompt = `你是基层调解的法治助理。请基于以下问题给出“通俗解释 + 调解程序提醒 + 风险提示”。\n要求：\n- 不替代律师意见；不作裁决；建议在必要时咨询法律顾问或走司法确认。\n- 输出用小标题与要点。\n\n问题：${questionText}`
  return callAI(prompt, { temperature: 0.3, maxTokens: 900, timeoutMs: 30000 })
}