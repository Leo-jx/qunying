# Cloudflare 部署指南

本文档提供通过Cloudflare Dashboard部署"群英断是非"应用的详细步骤。

## 前置要求

- Cloudflare账户（已登录）
- GitHub仓库：https://github.com/Leo-jx/qunying
- AI服务API密钥和配置信息
- MySQL数据库（可使用Cloudflare D1或其他云数据库）

## 一、部署前端应用到Cloudflare Pages

### 1.1 创建Pages项目

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在左侧菜单中选择 **Workers & Pages**
3. 点击 **Create application**
4. 选择 **Pages** 标签
5. 点击 **Connect to Git**

### 1.2 连接GitHub仓库

1. 选择 **GitHub** 作为Git提供商
2. 如果是首次使用，点击 **Connect GitHub** 授权Cloudflare访问您的GitHub账户
3. 选择 **Only select repositories**
4. 选择 `Leo-jx/qunying` 仓库
5. 点击 **Install** 或 **Save**

### 1.3 配置项目

1. 回到Cloudflare Dashboard，选择 `qunying` 仓库
2. 点击 **Begin setup**
3. 配置构建设置：
   - **Project name**: `qunying`（或您喜欢的名称）
   - **Production branch**: `main`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Root directory**: `/`（保持默认）

### 1.4 配置环境变量

在 **Environment variables** 部分，点击 **Add variable**，添加以下变量：

```
VITE_API_BASE_URL=https://qunying-ai-proxy.你的账户.workers.dev
```

注意：这里的URL是后端Worker的地址，需要在部署Worker后更新。

### 1.5 部署

1. 点击 **Save and Deploy**
2. 等待构建完成（约1-2分钟）
3. 部署成功后，您将获得一个 `.pages.dev` 域名

## 二、部署后端应用到Cloudflare Workers

### 2.1 创建Worker

1. 在Cloudflare Dashboard中，选择 **Workers & Pages**
2. 点击 **Create application**
3. 选择 **Workers** 标签
4. 点击 **Create Worker**
5. 输入Worker名称：`qunying-ai-proxy`
6. 点击 **Deploy**

### 2.2 上传Worker代码

#### 方法一：通过Dashboard编辑器

1. 点击刚创建的Worker
2. 点击 **Quick Edit**
3. 删除默认代码
4. 复制项目中的 `worker.js` 文件内容并粘贴
5. 点击 **Save and Deploy**

#### 方法二：通过GitHub Actions自动部署（推荐）

1. 在项目根目录创建 `.github/workflows/deploy-worker.yml` 文件
2. 配置GitHub Actions自动部署（详见下方）

### 2.3 配置环境变量

1. 在Worker页面，点击 **Settings**
2. 选择 **Variables**
3. 点击 **Add variable**，添加以下变量：

**加密变量（Secrets）：**
```
AI_API_KEY=your_api_key_here
AI_API_SECRET=your_api_secret_here
```

**普通变量：**
```
AI_HTTP_BASE_URL=https://maas-api.cn-huabei-1.xf-yun.com/v2
AI_MODEL_ID=xop3qwencodernext
AI_TIMEOUT_MS=30000
```

注意：敏感信息（如API密钥）必须使用 **Encrypt** 选项加密存储。

### 2.4 获取Worker URL

部署完成后，Worker的URL格式为：
```
https://qunying-ai-proxy.你的账户名.workers.dev
```

将此URL更新到前端的环境变量 `VITE_API_BASE_URL` 中。

## 三、配置数据库

### 3.1 使用Cloudflare D1（推荐）

1. 在Cloudflare Dashboard中，选择 **Workers & Pages**
2. 点击 **D1 SQL Database**
3. 点击 **Create database**
4. 输入数据库名称：`qunying-db`
5. 点击 **Create**

#### 初始化数据库

1. 点击创建的数据库
2. 选择 **Console**
3. 执行 `server/database/initDb.js` 中的SQL语句创建表结构

#### 配置Worker访问D1

1. 在Worker的 `wrangler.toml` 中添加：
```toml
[[d1_databases]]
binding = "DB"
database_name = "qunying-db"
database_id = "你的数据库ID"
```

2. 更新Worker代码以使用D1数据库

### 3.2 使用外部MySQL数据库

如果使用外部MySQL数据库（如阿里云RDS、腾讯云MySQL等）：

1. 确保数据库允许远程连接
2. 配置数据库连接信息到Worker环境变量
3. 注意：Worker中需要使用HTTP API访问MySQL，或使用支持Workers的数据库客户端

## 四、配置自定义域名（可选）

### 4.1 为Pages配置自定义域名

1. 在Pages项目中，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入您的域名（如 `qunying.example.com`）
4. 按照提示添加DNS记录
5. 等待SSL证书自动配置

### 4.2 为Worker配置自定义域名

1. 在Worker页面，点击 **Triggers**
2. 点击 **Add route** 或 **Custom Domains**
3. 输入自定义域名
4. 配置DNS记录

## 五、验证部署

### 5.1 验证前端

1. 访问前端URL（`https://qunying.pages.dev` 或自定义域名）
2. 检查页面是否正常加载
3. 测试各功能模块是否正常工作

### 5.2 验证后端Worker

1. 使用curl或Postman测试健康检查接口：
```bash
curl https://qunying-ai-proxy.你的账户.workers.dev/health
```

2. 测试AI聊天接口：
```bash
curl -X POST https://qunying-ai-proxy.你的账户.workers.dev/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt":"测试消息"}'
```

### 5.3 验证AI功能

1. 在前端应用中测试AI聊天功能
2. 测试案情摘要生成
3. 测试法律咨询功能
4. 检查日志和错误处理

## 六、持续部署

### 6.1 自动部署配置

项目已配置GitHub集成，每次推送到main分支都会自动触发部署：
- 前端：自动构建和部署到Pages
- 后端：需要配置GitHub Actions自动部署Worker

### 6.2 GitHub Actions配置（Worker自动部署）

创建 `.github/workflows/deploy-worker.yml`：

```yaml
name: Deploy Worker

on:
  push:
    branches:
      - main
    paths:
      - 'worker.js'
      - 'wrangler.toml'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install Wrangler
        run: npm install -g wrangler
      
      - name: Deploy Worker
        run: wrangler deploy
        env:
          CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

### 6.3 配置GitHub Secrets

在GitHub仓库设置中添加：
- `CLOUDFLARE_API_TOKEN`: 从Cloudflare Dashboard生成

生成API Token步骤：
1. 访问 https://dash.cloudflare.com/profile/api-tokens
2. 点击 **Create Token**
3. 使用 **Edit Cloudflare Workers** 模板
4. 复制生成的Token

## 七、监控和日志

### 7.1 查看部署日志

1. 在Pages或Worker页面，点击 **Deployments**
2. 选择具体部署记录查看详细日志

### 7.2 查看运行日志

1. 在Worker页面，点击 **Logs**
2. 点击 **Begin log stream** 实时查看日志
3. 或使用 **Logpush** 将日志推送到外部服务

### 7.3 性能监控

1. 使用 **Analytics** 查看请求统计
2. 监控错误率和响应时间
3. 设置告警规则

## 八、故障排查

### 常见问题

1. **前端无法访问后端API**
   - 检查CORS配置
   - 确认Worker URL正确
   - 检查环境变量配置

2. **AI功能无响应**
   - 检查API密钥是否正确配置
   - 查看Worker日志排查错误
   - 确认AI服务配额和限制

3. **数据库连接失败**
   - 检查数据库连接配置
   - 确认数据库允许远程访问
   - 检查网络和防火墙设置

4. **部署失败**
   - 查看构建日志
   - 检查依赖版本
   - 确认构建命令正确

## 九、安全建议

1. **环境变量管理**
   - 所有敏感信息使用Secrets加密
   - 定期轮换API密钥
   - 不要在代码中硬编码密钥

2. **访问控制**
   - 配置IP白名单（如需要）
   - 使用Cloudflare Access进行身份验证
   - 启用WAF（Web应用防火墙）

3. **HTTPS配置**
   - 强制使用HTTPS
   - 配置HSTS
   - 使用Cloudflare的SSL/TLS功能

## 十、优化建议

1. **性能优化**
   - 启用Cloudflare CDN缓存
   - 配置页面规则优化缓存策略
   - 使用Workers KV缓存频繁访问的数据

2. **成本优化**
   - 监控Workers使用量
   - 优化代码减少执行时间
   - 合理配置自动扩缩容

3. **可用性优化**
   - 配置健康检查
   - 设置告警通知
   - 准备灾备方案

---

## 支持与帮助

如遇问题，可参考以下资源：
- [Cloudflare Pages文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers文档](https://developers.cloudflare.com/workers/)
- [项目GitHub Issues](https://github.com/Leo-jx/qunying/issues)
