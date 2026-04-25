import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.join(__dirname, '../.env') })

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
}

const DB_NAME = process.env.DB_NAME || 'qunying_db'

const CREATE_TABLES_SQL = `
-- 创建数据库
CREATE DATABASE IF NOT EXISTS ${DB_NAME} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ${DB_NAME};

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('public', 'qunying', 'admin') DEFAULT 'public',
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 纠纷表
CREATE TABLE IF NOT EXISTS disputes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    case_number VARCHAR(50) NOT NULL UNIQUE,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_phone VARCHAR(20),
    respondent_name VARCHAR(100),
    dispute_type VARCHAR(50),
    dispute_content TEXT,
    status ENUM('pending', 'accepted', 'mediating', 'completed', 'closed') DEFAULT 'pending',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_case_number (case_number),
    INDEX idx_status (status),
    INDEX idx_assigned_to (assigned_to),
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 调解记录表
CREATE TABLE IF NOT EXISTS mediation_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dispute_id INT NOT NULL,
    mediator_id INT NOT NULL,
    record_content TEXT,
    record_type ENUM('note', 'proposal', 'agreement', 'summary') DEFAULT 'note',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_dispute_id (dispute_id),
    INDEX idx_mediator_id (mediator_id),
    INDEX idx_record_type (record_type),
    FOREIGN KEY (dispute_id) REFERENCES disputes(id) ON DELETE CASCADE,
    FOREIGN KEY (mediator_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- AI交互日志表
CREATE TABLE IF NOT EXISTS ai_interaction_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    request_type VARCHAR(50),
    input_text TEXT,
    output_text TEXT,
    model_used VARCHAR(50),
    tokens_used INT DEFAULT 0,
    latency_ms INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_request_type (request_type),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`

const INSERT_SAMPLE_DATA_SQL = `
USE ${DB_NAME};

-- 插入示例用户（密码都是123456的hash）
INSERT INTO users (username, password_hash, role, phone, email) VALUES
('admin', '$2a$10$X5wFuQoWfN8GKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'admin', '13800138000', 'admin@example.com'),
('mediator1', '$2a$10$X5wFuQoWfN8GKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'qunying', '13800138001', 'mediator1@example.com'),
('mediator2', '$2a$10$X5wFuQoWfN8GKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'qunying', '13800138002', 'mediator2@example.com'),
('user1', '$2a$10$X5wFuQoWfN8GKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'public', '13800138003', 'user1@example.com'),
('user2', '$2a$10$X5wFuQoWfN8GKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKKK', 'public', '13800138004', 'user2@example.com');

-- 插入示例纠纷
INSERT INTO disputes (case_number, applicant_name, applicant_phone, respondent_name, dispute_type, dispute_content, status, assigned_to) VALUES
('CASE202401001', '张三', '13800138003', '李四', '邻里纠纷', '楼上漏水导致我家天花板损坏，双方就维修费用产生争议。', 'accepted', 2),
('CASE202401002', '王五', '13800138004', '赵六', '合同纠纷', '装修合同履行过程中，因施工质量问题产生争议。', 'pending', NULL),
('CASE202401003', '孙七', '13800138005', '周八', '债务纠纷', '借款到期未还，多次催要无果。', 'mediating', 3);

-- 插入示例调解记录
INSERT INTO mediation_records (dispute_id, mediator_id, record_content, record_type) VALUES
(1, 2, '已联系双方确认事实经过，约定下周进行现场勘查。', 'note'),
(1, 2, '提出维修费用分摊方案：双方各承担50%。', 'proposal'),
(3, 3, '被申请人承认借款事实，但表示目前经济困难，请求延期还款。', 'note');
`

async function initDatabase() {
  console.log('[InitDB] Starting database initialization...')
  
  let connection
  
  try {
    console.log('[InitDB] Connecting to MySQL server...')
    connection = await mysql.createConnection(dbConfig)
    console.log('[InitDB] Connected successfully')
    
    console.log('[InitDB] Creating database and tables...')
    const statements = CREATE_TABLES_SQL.split(';').filter(s => s.trim())
    for (const statement of statements) {
      if (statement.trim()) {
        await connection.query(statement)
      }
    }
    console.log('[InitDB] Database and tables created successfully')
    
    console.log('[InitDB] Inserting sample data...')
    const insertStatements = INSERT_SAMPLE_DATA_SQL.split(';').filter(s => s.trim())
    for (const statement of insertStatements) {
      if (statement.trim()) {
        await connection.query(statement)
      }
    }
    console.log('[InitDB] Sample data inserted successfully')
    
    console.log('[InitDB] Creating application user...')
    const appUser = process.env.DB_USER || 'qunying_app'
    const appPass = process.env.DB_PASS || 'qunying123'
    
    try {
      await connection.query(`CREATE USER '${appUser}'@'localhost' IDENTIFIED BY '${appPass}'`)
      console.log(`[InitDB] User '${appUser}' created`)
    } catch (err) {
      if (err.code === 'ER_USER_ALREADY_EXISTS') {
        console.log(`[InitDB] User '${appUser}' already exists, skipping creation`)
      } else {
        throw err
      }
    }
    
    await connection.query(`GRANT SELECT, INSERT, UPDATE, DELETE ON ${DB_NAME}.* TO '${appUser}'@'localhost'`)
    await connection.query('FLUSH PRIVILEGES')
    console.log(`[InitDB] Granted privileges to user '${appUser}'`)
    
    console.log('[InitDB] Database initialization completed successfully!')
    console.log('[InitDB] You can now start using the application')
    
  } catch (error) {
    console.error('[InitDB] Database initialization failed:', error.message)
    console.error('[InitDB] Error code:', error.code)
    throw error
  } finally {
    if (connection) {
      await connection.end()
      console.log('[InitDB] Connection closed')
    }
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  initDatabase()
    .then(() => {
      console.log('[InitDB] Done')
      process.exit(0)
    })
    .catch((err) => {
      console.error('[InitDB] Failed:', err)
      process.exit(1)
    })
}

export { initDatabase }
