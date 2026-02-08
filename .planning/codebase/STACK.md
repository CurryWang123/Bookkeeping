# 技术栈 (STACK.md)

## 记账应用项目技术栈分析

### 1. 技术栈概览

| 类别 | 技术/版本 | 说明 |
|------|----------|------|
| **前端语言** | JavaScript (ES6+) | 使用 ES6 模块化 (import/export) |
| **标记语言** | HTML5 | 响应式设计，支持移动端 |
| **样式语言** | CSS3 | 自定义样式，Flexbox 布局 |
| **运行环境** | 原生浏览器 | 无需构建工具，直接打开 HTML 即可运行 |

---

### 2. 配置文件

由于项目是纯静态网页，不存在传统的配置文件：

- **无 `package.json`** - 没有使用 Node.js/npm
- **无 `tsconfig.json`** - 没有使用 TypeScript
- **无构建工具** - 直接使用 CDN 引入依赖

---

### 3. 核心依赖

#### CDN 依赖

| 依赖包 | 版本 | 用途 |
|--------|------|------|
| **@supabase/supabase-js** | 2.39.0 | Supabase 客户端 SDK |
| **Font Awesome** | 6.4.0 | 图标库 (日历、编辑、删除等图标) |
| **SheetJS (xlsx)** | 0.18.5 | Excel 导入导出功能 |

#### 引入方式

```html
<!-- Supabase SDK -->
<script type="module">
  import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm'
</script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- SheetJS -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
```

---

### 4. 目录结构

```
E:\ideaProject\Bookkeeping\
├── index.html          # 主页面（记账）
├── prices.html         # 单价管理
├── employees.html      # 人员管理
├── css/
│   └── style.css       # 统一样式文件
├── js/
│   ├── supabase.js     # Supabase 客户端配置
│   └── db.js          # 数据库操作封装
└── docs/
    ├── supabase-tables.sql  # 数据库表结构 DDL
    └── 开发执行方案.md       # 开发文档
```

---

### 5. 入口点和启动方式

#### 入口文件

| 文件 | 用途 |
|------|------|
| `index.html` | 主入口 - 每日记账页面 |
| `prices.html` | 单价管理页面 |
| `employees.html` | 人员管理页面 |

#### 启动方式

**方式一：直接打开**
```cmd
双击 index.html 或在浏览器中打开
```

**方式二：本地服务器（推荐）**
```cmd
# 使用 Python
python -m http.server 8080

# 使用 Node.js
npx http-server -p 8080
```
