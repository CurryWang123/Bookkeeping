# 技术债务和concerns (CONCERNS.md)

## 代码库问题分析报告

---

## 1. 安全问题（严重）

### 1.1 敏感凭证硬编码在前端

**文件**: `js/supabase.js`

```javascript
const SUPABASE_URL = 'https://ccivqpgntdotgpswmdnp.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_jp0yMSee57xUEMPIFKmPVA_BG1qs3s3'
```

- **问题**: Supabase URL 和 Anon Key 直接硬编码在客户端代码中
- **影响**:
  - 所有凭证信息在浏览器开发者工具中完全暴露
  - 即使是 Anon Key，暴露也不是最佳实践
- **建议**: 使用环境变量或 Supabase Edge Functions 隐藏敏感配置

### 1.2 XSS 安全风险

**文件**: `index.html` (第 382-391 行)

```javascript
row.innerHTML = `
    <td><input type="checkbox" class="record-checkbox" data-id="${record.id}"></td>
    <td>${record.record_date}</td>
    <td>${employeeName}</td>
    <td>${productName}</td>
    ...
`
```

- **问题**: 直接使用变量拼接 HTML，未进行 XSS 转义
- **风险**: 如果数据库中的员工名或产品名包含恶意脚本，将被注入执行
- **建议**: 使用 `textContent` 替代 innerHTML，或创建安全的 HTML 转义函数

---

## 2. 技术债务

### 2.1 文档与代码不一致

**文件**: `docs/开发执行方案.md`

| 文档描述 | 实际情况 |
|---------|---------|
| 应使用 `.env` 文件存储敏感信息 | 实际硬编码在 supabase.js 中 |
| 需要创建 `js/app.js` | 该文件不存在 |
| 使用 `LIKE` 进行月份筛选 | 实际改用 `gte/lte` 范围查询 |

### 2.2 代码重复问题

- 三个 HTML 页面各自包含完整的 JavaScript 逻辑
- 批量操作逻辑、表单处理、复选框同步逻辑等代码重复
- 缺少统一的模块化架构

---

## 3. 数据库设计问题

### 3.1 外键约束不完整

**文件**: `docs/supabase-tables.sql`

```sql
CREATE TABLE sales_records (
  employee_id BIGINT REFERENCES employees(id),
  product_id BIGINT REFERENCES products(id),
  ...
);
```

- **问题**: 外键未设置 `ON DELETE CASCADE`
- **影响**:
  - 删除员工或产品时需要先删除所有关联记录
  - 代码中需要额外处理外键约束错误
- **建议**: 添加 `ON DELETE CASCADE` 或 `ON DELETE SET NULL`

### 3.2 缺少唯一性约束

- `products` 表的 `code` 字段应该添加 `UNIQUE` 约束
- 当前只能通过数据库错误提示知道编码重复

### 3.3 缺少复合索引

- 没有创建 `(employee_id, record_date)` 的复合索引
- 按员工+月份查询时性能可能受影响

---

## 4. 代码质量问题

### 4.1 错误处理不完善

**文件**: `js/db.js`

```javascript
if (error) throw error
```

- **问题**: 所有数据库操作失败时直接抛出原始错误
- **影响**:
  - 用户看到技术性错误信息，无法理解
  - 没有网络错误处理
- **建议**: 封装错误，转换为友好的用户提示

### 4.2 浮点数精度问题

**文件**: `index.html` (第 457-461 行)

```javascript
function calculateAmount() {
    const quantity = parseFloat(quantityInput.value) || 0
    const price = parseFloat(priceInput.value) || 0
    amountInput.value = (quantity * price).toFixed(2)
}
```

- **问题**: JavaScript 浮点数计算可能产生精度误差
- **示例**: `0.1 + 0.2 = 0.30000000000000004`
- **建议**: 使用整数运算或 `decimal.js` 等精确计算库

### 4.3 事件监听器冗余

**文件**: `index.html` (第 649-661 行)

- **问题**: 每个页面的事件委托逻辑重复
- **问题**: 缺少事件解绑逻辑，页面切换可能导致内存泄漏

### 4.4 DOM 查询效率低

**文件**: `index.html` (多处)

```javascript
document.getElementById('select-all-header').addEventListener(...)
document.getElementById('select-all').addEventListener(...)
```

- **问题**: 重复查询同一个 DOM 元素
- **建议**: 缓存 DOM 元素引用

### 4.5 缺少输入验证

**文件**: `index.html` (第 469-470 行)

```javascript
const quantity = parseFloat(quantityInput.value)
const price = parseFloat(priceInput.value)
```

- **问题**: 允许负数输入
- **问题**: 数量和价格没有最大值的限制

---

## 5. 性能问题

### 5.1 批量操作逐条请求

**文件**: `index.html` (第 444-447 行)

```javascript
for (const id of selectedIds) {
    await salesRecords.delete(id)
}
```

- **问题**: 批量删除时逐条请求数据库
- **影响**: N 条记录需要 N 次网络请求
- **建议**: 使用 Supabase 的 `.in()` 批量删除

### 5.2 产品列表每次都重新加载

**文件**: `index.html` (第 235-242 行)

```javascript
async function loadProducts() {
    productList = await products.list()
    loadProductsToDatalist()
}
```

- **问题**: 每次加载页面都从数据库获取完整产品列表
- **建议**: 添加缓存机制或本地存储

### 5.3 Excel 导入无进度反馈

**文件**: `prices.html` (第 286 行)

```javascript
await products.importBatch(records)
```

- **问题**: 大量数据导入时没有进度提示
- **建议**: 实现分批导入和进度条

---

## 6. 用户体验问题

### 6.1 加载状态显示不一致

- 三个页面的加载状态处理方式略有不同
- 部分操作完成后没有明确成功提示

### 6.2 确认对话框不够友好

**文件**: `index.html` (第 404 行)

```javascript
if (confirm('确定要删除这条记录吗？')) {
```

- **问题**: 使用浏览器原生 confirm 对话框，样式不统一
- **建议**: 使用自定义确认弹窗

### 6.3 表格列宽固定可能溢出

**文件**: `index.html` (第 135-143 行)

```html
<th style="width: 65px;">日期</th>
<th style="width: 50px;">姓名</th>
```

- **问题**: 长名称或长产品名可能导致显示问题
- **建议**: 使用更灵活的布局或添加文本截断

---

## 优先级建议

| 优先级 | 问题 | 影响 |
|-------|------|------|
| 高 | 敏感凭证硬编码 | 安全风险 |
| 高 | XSS 漏洞 | 安全风险 |
| 中 | 外键约束不完整 | 数据一致性 |
| 中 | 错误处理不完善 | 用户体验 |
| 中 | 批量操作性能 | 网络请求过多 |
| 低 | 代码重复 | 维护成本 |
| 低 | 浮点数精度 | 数据准确性 |
| 低 | DOM 缓存 | 性能优化 |
