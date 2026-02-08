# 测试 (TESTING.md)

## 测试框架和结构

### 当前状态：完全缺失

| 类别 | 状态 | 说明 |
|------|------|------|
| 测试框架 | **无** | 未配置任何测试框架 |
| 测试配置文件 | **无** | 无 jest.config.js / vitest.config.js |
| ESLint 配置 | **无** | 无 .eslintrc |
| Prettier 配置 | **无** | 无 .prettierrc |
| package.json | **无** | 未使用 npm 管理依赖 |

---

### 测试文件

**完全没有任何测试文件**：

- 无 `__tests__` 目录
- 无 `.test.js` / `.spec.js` 文件
- 无测试相关的 HTML 文件
- 无 E2E 测试配置

---

### 建议的测试策略

#### 1. 单元测试（推荐：Vitest）

```
npm install -D vitest

# vite.config.js
import { defineConfig } from 'vite'
export default defineConfig({
  test: {
    environment: 'jsdom'
  }
})
```

#### 2. 测试示例

```javascript
// tests/calculate.test.js
import { describe, it, expect } from 'vitest'

describe('金额计算', () => {
  it('应该正确计算总金额', () => {
    const quantity = 10
    const price = 5.5
    const total = quantity * price
    expect(total).toBe(55)
  })
})
```

#### 3. E2E 测试（推荐：Playwright）

```javascript
// tests/app.spec.js
import { test, expect } from '@playwright/test'

test('添加记账记录', async ({ page }) => {
  await page.goto('/index.html')
  // ... 测试步骤
})
```

---

### 建议改进

| 优先级 | 改进项 | 说明 |
|-------|-------|------|
| 高 | 引入 Vitest | 为核心业务逻辑添加单元测试 |
| 中 | 添加 ESLint + Prettier | 保证代码风格统一 |
| 中 | E2E 测试 | 使用 Playwright 测试关键流程 |
| 低 | 核心函数测试 | 测试金额计算、日期处理等 |

---

### 核心业务逻辑建议测试

1. `calculateAmount()` - 金额计算
2. `setDefaultDate()` - 默认日期设置
3. 数据库操作函数 - employees/products/salesRecords CRUD
4. Excel 导入导出功能
