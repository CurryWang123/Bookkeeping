# 架构 (ARCHITECTURE.md)

## 记账应用架构分析

### 架构模式：前后端分离 + 服务层抽象

```
┌─────────────────────────────────────────────────────────┐
│                      View 层                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │  index.html │  │ prices.html│  │employees.html│    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘      │
└─────────┼────────────────┼────────────────┼─────────────┘
          │                │                │
          └────────────────┴────────────────┘
                           │
┌──────────────────────────┼──────────────────────────────┐
│                    Service 层                            │
│  ┌─────────────────────────────────────────────────────┐│
│  │             js/db.js (数据库操作封装)                ││
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────┐       ││
│  │  │employees │ │ products │ │ salesRecords │       ││
│  │  │  API     │ │   API    │ │     API      │       ││
│  │  └──────────┘ └──────────┘ └──────────────┘       ││
│  └─────────────────────────┬───────────────────────────┘│
└────────────────────────────┼────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────┐
│                   Data Access 层                          │
│  ┌─────────────────────────────────────────────────────┐│
│  │          js/supabase.js (Supabase SDK)             ││
│  └─────────────────────────────────────────────────────┘│
                             │
┌────────────────────────────┼────────────────────────────┐
│                    Data 层 (Supabase)                    │
│  ┌──────────┐ ┌──────────┐ ┌──────────────────┐        │
│  │employees │ │ products │ │  sales_records   │        │
│  │  TABLE   │ │  TABLE   │ │     TABLE        │        │
│  └──────────┘ └──────────┘ └──────────────────┘        │
└─────────────────────────────────────────────────────────┘
```

---

## 数据流向

### 记账流程数据流

```
用户输入表单 → 前端验证 → 调用 salesRecords.add() → Supabase API
         ↓                                            ↓
前端本地状态 ← 重新查询 ← salesRecords.list() ← Supabase响应
         ↓
渲染记录列表 → 计算总计 → 更新DOM
```

### 页面间数据依赖

```
┌────────────────┐         ┌────────────────┐
│   employees    │ ←─────  │    index.html  │
│   (人员数据)    │         │   (记账页面)    │
└────────────────┘         └────────────────┘
                                ↓
┌────────────────┐         ┌────────────────┐
│    products    │ ←──────  │  prices.html  │
│   (产品数据)    │         │  (单价管理)     │
└────────────────┘         └────────────────┘
```

---

## 关键抽象和接口

### 数据库层抽象 (db.js)

```javascript
// 员工操作接口
export const employees = {
  list(): Promise<Employee[]>,
  add(name: string): Promise<void>,
  delete(id: number): Promise<void>
}

// 产品操作接口
export const products = {
  list(): Promise<Product[]>,
  add(data: ProductData): Promise<void>,
  update(id: number, data: Partial<Product>): Promise<void>,
  delete(id: number): Promise<void>,
  importBatch(records: Product[]): Promise<void>
}

// 销售记录操作接口
export const salesRecords = {
  list(month?: string): Promise<SalesRecord[]>,
  add(data: SalesRecordData): Promise<void>,
  delete(id: number): Promise<void>
}
```

---

## 核心功能模块

| 功能 | 实现位置 | 说明 |
|-----|---------|------|
| 自动完成搜索 | index.html | 产品编码/名称模糊匹配 |
| Excel导入 | prices.html | SheetJS 解析 Excel |
| Excel导出 | index.html | 按人员分组导出 |
| 批量操作 | 各页面 | 批量删除记录/产品/人员 |
| 月份筛选 | index.html | 按月查询记录 |
| 退返标记 | index.html | is_return 布尔标记 |

---

## 状态管理

每个页面使用简单的**本地状态变量**：

| 页面 | 状态变量 | 说明 |
|-----|---------|------|
| index.html | `allRecords`, `employeeList`, `productList` | 记账页面状态 |
| prices.html | `productList` | 产品列表状态 |
| employees.html | `employeeList` | 员工列表状态 |
