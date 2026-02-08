# 目录结构 (STRUCTURE.md)

## 项目目录结构

```
E:\ideaProject\Bookkeeping\
├── .git/                      # Git版本控制
├── .idea/                     # IntelliJ IDEA项目配置
├── .claude/                   # Claude AI配置
├── css/
│   └── style.css              # 公共样式文件
├── js/
│   ├── supabase.js            # Supabase客户端配置
│   └── db.js                  # 数据库操作封装
├── docs/
│   ├── supabase-tables.sql    # 数据库表结构DDL
│   └── 开发执行方案.md         # 开发文档
├── index.html                 # 记账主页面
├── prices.html                # 计件单价管理页面
├── employees.html             # 人员信息管理页面
└── nul                        # 临时文件
```

---

## 主要文件和模块布局

| 文件路径 | 功能描述 |
|---------|---------|
| `index.html` | 核心记账页面，包含记录添加、列表展示、Excel导出、批量操作 |
| `prices.html` | 产品单价管理，支持增删改、Excel导入 |
| `employees.html` | 人员信息管理，支持增删操作 |
| `js/supabase.js` | Supabase 客户端初始化 |
| `js/db.js` | 数据库操作 API 封装 |
| `css/style.css` | 统一样式，适配移动端 |
| `docs/supabase-tables.sql` | 数据库 Schema 定义 |

---

## 代码组织结构

```
├── index.html          # 主记账页面
├── employees.html       # 人员管理
├── prices.html         # 产品单价管理
├── css/
│   └── style.css       # 公共样式
├── js/
│   ├── supabase.js     # Supabase 客户端配置
│   └── db.js           # 数据库操作封装
└── docs/               # 文档目录
```

---

## 命名规范

### 文件命名

| 类型 | 风格 | 示例 |
|-----|------|------|
| HTML 文件 | kebab-case | `index.html`, `prices.html`, `employees.html` |
| JS 文件 | kebab-case | `supabase.js`, `db.js` |
| CSS 文件 | kebab-case | `style.css` |

### 变量命名

| 类型 | 风格 | 示例 |
|-----|------|------|
| 普通变量 | camelCase | `dateInput`, `productCodeInput`, `quantityInput` |
| 状态变量 | camelCase | `employeeList`, `productList`, `allRecords` |
| 常量 | UPPER_SNAKE_CASE | `SUPABASE_URL`, `SUPABASE_ANON_KEY` |
| 函数 | camelCase (动词前缀) | `loadEmployees()`, `loadProducts()`, `renderRecords()` |
