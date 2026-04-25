// Cloudflare Worker 脚本
// 用于代理AI请求到MaaS API

// 配置信息
const CONFIG = {
  AI_HTTP_BASE_URL: 'https://maas-api.cn-huabei-1.xf-yun.com/v2',
  AI_MODEL_ID: 'xop3qwencodernext',
  AI_API_KEY: 'a87ffea24723ba51b2817406aa6cdf30:MjM0MTJmMjFkYTAzYjNiYWEzODA1MjMw',
  AI_TIMEOUT_MS: 30000,
};

// 处理请求
async function handleRequest(request) {
  // 只处理POST请求
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // 解析请求体
  let requestBody;
  try {
    requestBody = await request.json();
  } catch (e) {
    return new Response('Invalid JSON', { status: 400 });
  }

  // 构建AI请求
  const { prompt, messages, modelId, temperature, maxTokens, timeoutMs } = requestBody;

  const aiMessages = Array.isArray(messages) && messages.length > 0
    ? messages
    : [{ role: 'user', content: String(prompt ?? '') }];

  const body = JSON.stringify({
    model: modelId || CONFIG.AI_MODEL_ID,
    messages: aiMessages,
    temperature: typeof temperature === 'number' ? temperature : 0.7,
    max_tokens: typeof maxTokens === 'number' ? maxTokens : 2048,
    stream: false,
  });

  // 构建请求头
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${btoa(CONFIG.AI_API_KEY + ':' + Date.now())}`,
  };

  // 发送请求到MaaS API
  try {
    const response = await fetch(CONFIG.AI_HTTP_BASE_URL, {
      method: 'POST',
      headers,
      body,
    });

    // 解析响应
    const data = await response.json();

    if (!response.ok) {
      return new Response(JSON.stringify({
        error: 'AI调用失败',
        detail: data?.detail || data?.error || `HTTP ${response.status}`,
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 返回AI响应
    return new Response(JSON.stringify({
      content: data?.choices?.[0]?.message?.content || '',
      modelId: data?.model || modelId || CONFIG.AI_MODEL_ID,
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI request failed:', error);
    return new Response(JSON.stringify({
      error: 'AI调用失败',
      detail: error?.message || String(error),
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

// 导出Worker处理函数
export default {
  async fetch(request, env, ctx) {
    // 处理CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 处理API请求
    if (request.url.endsWith('/api/ai/chat')) {
      return handleRequest(request);
    }

    // 其他请求返回404
    return new Response('Not found', { status: 404 });
  },
};
