# 群英断是非

一个基于Vue 3和Express.js的智能调解平台，集成AI辅助功能，为基层纠纷调解提供数字化解决方案。

## 项目简介

群英断是非是一个面向基层调解工作的智能化平台，通过AI技术辅助调解员进行纠纷处理、法律咨询和文书生成等工作。平台支持多方角色（管理员、调解员、当事人），提供完整的调解流程管理和公开监督机制。

## 核心功能

### 前端功能
- **管理端**：数据统计、用户管理、调解员管理、法治指导
- **群英端（调解员）**：收件箱、调解工作台、法治库、法治学堂、结果发布
- **公众端**：纠纷申请、法律咨询、我的纠纷、三公开监督

### 后端功能
- RESTful API接口
- MySQL数据库管理
- AI聊天代理服务
- 用户认证与权限管理

### AI功能模块
- 案情摘要生成
- 关键信息提取
- 合规性检查
- 脱敏处理
- 法律参考建议
- 智能法律咨询

## 技术栈

### 前端
- Vue 3.5+
- Vue Router 4.5+
- Vite 5.4+
- 原生CSS（无UI框架依赖）

### 后端
- Node.js 18+
- Express.js 4.19+
- MySQL2 3.22+
- OpenAI SDK 4.56+

### AI服务
- 讯飞星火大模型（通过OpenAI兼容接口）
- Cloudflare Workers（AI代理）

### 部署平台
- GitHub（代码托管）
- Cloudflare Pages（前端部署）
- Cloudflare Workers（后端部署）

## 项目结构

```
群英断是非/
├── public/                 # 静态资源
├── server/                 # 后端代码
│   ├── database/          # 数据库访问层
│   │   ├── aiInteractionLogDal.js
│   │   ├── db.js          # 数据库连接
│   │   ├── dbRoutes.js    # 数据库路由
│   │   ├── disputeDal.js  # 纠纷数据访问
│   │   ├── initDb.js      # 数据库初始化
│   │   ├── mediationRecordDal.js
│   │   └── userDal.js     # 用户数据访问
│   ├── .env.example       # 环境变量示例
│   ├── index.js           # 后端入口
│   ├── logger.js          # 日志模块
│   ├── openaiClient.js    # AI客户端
│   ├── package.json
│   └── testAi.js          # AI测试脚本
├── src/                    # 前端代码
│   ├── components/        # 公共组件
│   │   ├── AiBoundaryNote.vue
│   │   ├── AiChatBox.vue  # AI聊天组件
│   │   └── AppHeader.vue
│   ├── data/              # 模拟数据
│   ├── layouts/           # 布局组件
│   ├── router/            # 路由配置
│   ├── services/          # 服务层
│   │   └── aiService.js   # AI服务
│   ├── styles/            # 全局样式
│   ├── views/             # 页面组件
│   │   ├── admin/         # 管理端页面
│   │   ├── public/        # 公众端页面
│   │   └── qunying/       # 群英端页面
│   ├── app.vue
│   └── main.js
├── .gitignore
├── .nvmrc                 # Node版本配置
├── build.sh               # 构建脚本
├── dev.bat                # 开发启动脚本
├── index.html
├── jsconfig.json
├── package.json
├── vercel.json            # Vercel部署配置
├── vite.config.js         # Vite配置
├── worker.js              # Cloudflare Worker脚本
└── wrangler.toml          # Cloudflare Workers配置
```

## 环境要求

- Node.js >= 18.0.0
- MySQL >= 5.7
- npm >= 9.0.0

## 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/Leo-jx/qunying.git
cd qunying
```

### 2. 安装依赖

```bash
# 安装前端依赖
npm install

# 安装后端依赖
cd server
npm install
cd ..
```

### 3. 配置环境变量

```bash
# 复制环境变量示例文件
cp server/.env.example server/.env

# 编辑 server/.env 文件，填入实际配置
```

环境变量说明：
- `AI_SERVER_PORT`: 后端服务端口（默认3001）
- `AI_HTTP_BASE_URL`: AI服务API地址
- `AI_MODEL_ID`: AI模型ID
- `AI_API_KEY`: AI服务API密钥
- `AI_API_SECRET`: AI服务API密钥
- `AI_APPID`: AI应用ID
- `DB_HOST`: 数据库主机地址
- `DB_PORT`: 数据库端口
- `DB_USER`: 数据库用户名
- `DB_PASS`: 数据库密码
- `DB_NAME`: 数据库名称

### 4. 初始化数据库

```bash
cd server
node database/initDb.js
cd ..
```

### 5. 启动开发服务器

```bash
# 同时启动前端和后端
npm run dev:all

# 或分别启动
npm run dev          # 前端（http://localhost:5173）
npm run dev:server   # 后端（http://localhost:3001）
```

### 6. 测试AI功能

```bash
npm run test:ai
```

## 构建部署

### 本地构建

```bash
npm run build
```

构建产物将生成在 `dist/` 目录。

### 部署到Cloudflare

#### 前端部署（Cloudflare Pages）

1. 安装Wrangler CLI：
```bash
npm install -g wrangler
```

2. 登录Cloudflare：
```bash
wrangler login
```

3. 构建并部署：
```bash
npm run build
wrangler pages deploy dist
```

#### 后端部署（Cloudflare Workers）

1. 配置环境变量（敏感信息）：
```bash
wrangler secret put AI_API_KEY
```

2. 部署Worker：
```bash
wrangler deploy
```

## API文档

### AI接口

#### POST /api/ai/chat
AI聊天接口

**请求体：**
```json
{
  "prompt": "用户输入",
  "messages": [{"role": "user", "content": "消息内容"}],
  "modelId": "模型ID（可选）",
  "temperature": 0.7,
  "maxTokens": 2048,
  "timeoutMs": 30000
}
```

**响应：**
```json
{
  "content": "AI回复内容",
  "modelId": "使用的模型ID",
  "usage": {
    "prompt_tokens": 100,
    "completion_tokens": 50,
    "total_tokens": 150
  }
}
```

### 健康检查

#### GET /health
检查服务状态

**响应：**
```json
{
  "ok": true,
  "time": "2024-01-01T00:00:00.000Z",
  "database": "connected"
}
```

## 开发指南

### 代码规范
- 使用ES Module（`type: "module"`）
- Vue组件使用Composition API
- 后端使用Express中间件模式
- 数据库操作使用DAL模式

### 分支管理
- `main`: 生产分支
- `develop`: 开发分支
- `feature/*`: 功能分支

### 提交规范
- `feat`: 新功能
- `fix`: 修复bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关

## 许可证

MIT License

## 联系方式

项目地址：https://github.com/Leo-jx/qunying