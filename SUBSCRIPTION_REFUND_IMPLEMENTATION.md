# 订阅退款功能实现文档

## 概述

本文档描述了订阅退款功能的完整实现，包括数据库结构、API 端点、Webhook 处理和相关的工具函数。

## 功能特性

1. **订阅退款记录** - 跟踪所有订阅退款记录
2. **Webhook 处理** - 自动处理来自 Creem 的退款 webhook 事件
3. **退款查询 API** - 允许用户查询退款历史
4. **退款请求 API** - 处理退款请求（实际处理通过 Creem webhook）

## 数据库结构

### subscription_refunds 表

新增的 `subscription_refunds` 表用于存储订阅退款记录：

- `id` - UUID 主键
- `subscription_id` - 关联的订阅 ID
- `customer_id` - 关联的客户 ID
- `creem_refund_id` - Creem 退款 ID（唯一）
- `creem_subscription_id` - Creem 订阅 ID
- `refund_amount` - 退款金额
- `refund_currency` - 退款货币（默认 USD）
- `refund_reason` - 退款原因
- `refund_status` - 退款状态（pending, processing, completed, failed, canceled）
- `refund_type` - 退款类型（full, partial, prorated）
- `period_start` - 订阅周期开始时间
- `period_end` - 订阅周期结束时间
- `refunded_period_days` - 退款的周期天数
- `metadata` - JSONB 元数据
- `created_at` - 创建时间
- `updated_at` - 更新时间

### 索引

- `subscription_refunds_subscription_id_idx` - 订阅 ID 索引
- `subscription_refunds_customer_id_idx` - 客户 ID 索引
- `subscription_refunds_creem_refund_id_idx` - Creem 退款 ID 索引（唯一）
- `subscription_refunds_creem_subscription_id_idx` - Creem 订阅 ID 索引
- `subscription_refunds_status_idx` - 状态索引
- `subscription_refunds_created_at_idx` - 创建时间索引

### RLS 策略

- 用户只能查看自己的订阅退款记录
- Service role 可以管理所有订阅退款记录

## API 端点

### GET /api/subscriptions/refund

获取当前用户的订阅退款历史记录。

**查询参数：**
- `subscription_id` (可选) - 指定订阅 ID，只返回该订阅的退款记录

**响应：**
```json
{
  "refunds": [
    {
      "id": "uuid",
      "subscription_id": "uuid",
      "customer_id": "uuid",
      "creem_refund_id": "refund_xxx",
      "creem_subscription_id": "sub_xxx",
      "refund_amount": 4.99,
      "refund_currency": "USD",
      "refund_reason": "Customer requested refund",
      "refund_status": "completed",
      "refund_type": "prorated",
      "period_start": "2024-01-01T00:00:00Z",
      "period_end": "2024-02-01T00:00:00Z",
      "refunded_period_days": 15,
      "metadata": {},
      "created_at": "2024-01-15T00:00:00Z",
      "updated_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### POST /api/subscriptions/refund

请求订阅退款。注意：实际的退款处理通过 Creem webhook 完成。

**请求体：**
```json
{
  "subscription_id": "uuid",
  "reason": "Customer requested refund" // 可选
}
```

**响应：**
```json
{
  "message": "Refund request received",
  "instructions": [
    "Refunds are typically processed through the Creem customer portal.",
    "You can access the portal via the 'Manage Plan' button in your dashboard.",
    "Alternatively, contact support for assistance with refunds."
  ],
  "subscription": {
    "id": "uuid",
    "status": "active",
    "creem_subscription_id": "sub_xxx"
  },
  "refund_eligibility": {
    "eligible": true,
    "reason": "Customer requested refund"
  }
}
```

## Webhook 处理

### 支持的事件类型

1. **refund.created** - 处理退款创建事件
   - 自动检测是否为订阅退款
   - 如果是订阅退款，调用 `handleSubscriptionRefundFromRefundEvent`
   - 如果是订单退款，处理积分退款逻辑

2. **subscription.refunded** - 处理订阅退款事件
   - 直接调用 `handleSubscriptionRefund`

### 处理流程

1. **接收 Webhook** - 验证签名
2. **解析事件** - 确定事件类型和对象
3. **处理退款** - 根据退款类型调用相应的处理函数
4. **记录退款** - 在数据库中创建退款记录
5. **更新订阅** - 更新订阅状态（如果需要）
6. **记录历史** - 在 credits_history 中记录退款操作

## 工具函数

### processSubscriptionRefund

处理订阅退款的核心函数。

**参数：**
- `subscriptionId` - 订阅 ID
- `refundData` - 退款数据对象

**功能：**
1. 获取订阅详情
2. 计算退款周期（如果未提供）
3. 创建退款记录
4. 更新退款状态为 completed
5. 在 credits_history 中记录退款操作

### getSubscriptionRefunds

获取客户的所有订阅退款记录。

**参数：**
- `customerId` - 客户 ID

**返回：** 退款记录数组

### getSubscriptionRefundsBySubscription

获取特定订阅的所有退款记录。

**参数：**
- `subscriptionId` - 订阅 ID

**返回：** 退款记录数组

## 类型定义

### CreemRefund

```typescript
export interface CreemRefund {
  id: string;
  object: "refund";
  order: string | CreemOrder;
  subscription?: string | CreemSubscription;
  amount: number;
  currency: string;
  reason?: string;
  status: "pending" | "processing" | "completed" | "failed" | "canceled";
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
  mode: string;
}
```

### CreemEventType

新增了 `subscription.refunded` 事件类型。

## 使用说明

### 用户退款流程

1. **通过客户门户**（推荐）
   - 用户点击 Dashboard 中的 "Manage Plan" 按钮
   - 在 Creem 客户门户中申请退款
   - Creem 处理退款并发送 webhook
   - 系统自动处理退款记录

2. **通过 API 请求**
   - 用户调用 `POST /api/subscriptions/refund`
   - 系统验证退款资格
   - 返回退款说明和指引

3. **通过 Webhook 自动处理**
   - Creem 处理退款后发送 webhook
   - 系统自动创建退款记录
   - 更新相关状态

### 管理员处理

管理员可以通过以下方式处理退款：

1. **Creem Dashboard** - 直接在 Creem 管理后台处理退款
2. **数据库查询** - 查询 `subscription_refunds` 表查看所有退款记录
3. **Webhook 日志** - 查看 webhook 处理日志

## 数据库迁移

运行以下迁移文件以创建退款表：

```bash
supabase db push
```

或手动应用：

```sql
-- 文件: supabase/migrations/20260304000000_add_subscription_refunds.sql
```

## 测试建议

1. **Webhook 测试**
   - 使用 Creem webhook 测试工具发送测试事件
   - 验证退款记录是否正确创建
   - 检查 credits_history 是否正确记录

2. **API 测试**
   - 测试 GET 端点获取退款历史
   - 测试 POST 端点提交退款请求
   - 验证权限控制

3. **集成测试**
   - 完整的退款流程测试
   - 验证退款后的订阅状态
   - 检查退款金额计算

## 注意事项

1. **退款金额** - Creem API 返回的金额可能是以分为单位，需要除以 100 转换为美元
2. **退款周期计算** - 自动计算未使用的订阅周期天数
3. **重复退款** - 系统会检查是否已存在完成的退款记录
4. **权限控制** - 用户只能查看自己的退款记录
5. **Webhook 签名验证** - 所有 webhook 请求都经过签名验证

## 未来改进

1. **退款通知** - 发送邮件通知用户退款状态
2. **退款分析** - 添加退款原因分析和报告
3. **自动退款** - 支持特定条件下的自动退款
4. **退款策略** - 配置退款策略（如退款期限、退款比例等）
