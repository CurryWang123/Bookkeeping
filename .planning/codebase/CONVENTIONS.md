# 代码规范 (CONVENTIONS.md)

## 代码规范和风格

### 命名规范

#### 文件命名

遵循 kebab-case 风格：

```
index.html
prices.html
employees.html
supabase.js
db.js
style.css
```

#### 变量命名

camelCase 风格：

```javascript
dateInput
productCodeInput
quantityInput
employeeList
productList
allRecords
```

#### 常量命名

全大写 + 下划线：

```javascript
SUPABASE_URL
SUPABASE_ANON_KEY
```

#### 函数命名

camelCase，动词前缀：

```javascript
loadEmployees()
loadProducts()
renderRecords()
setDefaultDate()
calculateAmount()
```

---

### 代码格式

- **缩进**: 使用 2 个空格
- **引号**: 混用单引号和双引号（ES6 模板字符串为主）
- **模块化**: 使用 ES6 模块系统 (`import`/`export`)
- **注释**: 中文注释，简洁明了

```javascript
// 设置默认日期
function setDefaultDate() { ... }
```

---

### 设计模式

#### 模块分离模式

数据访问层 (`db.js`) 与 UI 层分离：

```javascript
// db.js - 数据访问层
export const employees = { list, add, delete }
export const products = { list, add, update, delete, importBatch }
export const salesRecords = { list, add, delete }
```

#### 命名空间对象模式

API 按业务模块组织：

```javascript
export const employees = {
  list: async () => { ... },
  add: async (name) => { ... },
  delete: async (id) => { ... }
}
```

#### 事件监听模式

使用 `addEventListener` 进行 DOM 操作：

```javascript
document.addEventListener('DOMContentLoaded', () => {
  // 初始化代码
})

document.addEventListener('change', function(e) {
  if (e.target.classList.contains('record-checkbox')) {
    // 处理复选框变化
  }
})
```

---

### 错误处理方式

#### 数据层错误处理 (`db.js`)

```javascript
// 统一的错误抛出模式
if (error) throw error
```

#### UI 层错误处理

使用 `try-catch` 模式 + `console.error` + `alert` 用户提示：

```javascript
try {
  await salesRecords.add({ ... })
  alert('添加成功！')
} catch (error) {
  console.error('添加失败:', error)
  alert('添加失败，请重试')
}
```

#### 外键约束处理

```javascript
if (error.message && error.message.includes('foreign key constraint')) {
  alert('删除失败：该人员还有记账记录，请先删除相关记录后再删除人员。')
}
```

#### 表单验证

使用同步验证 + alert 提示：

```javascript
if (!dateInput.value) {
  alert('请选择日期')
  return
}
```
