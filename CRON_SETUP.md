# Cron Job 配置指南

## 问题分析

如果遇到 `307 Temporary Redirect` 错误，通常是因为：

1. **使用了 HTTP 而不是 HTTPS** - Vercel 会自动将 HTTP 重定向到 HTTPS
2. **请求方法不正确** - 确保使用 POST 或 GET 方法
3. **缺少必要的认证头** - API 需要 `Authorization` header

## cron-job.org 配置步骤

### 1. 基本配置

- **URL**: `https://mindfulpenpal.com/api/cron/process-emails`
  - ⚠️ **重要**: 必须使用 `https://`，不能使用 `http://`
  
- **请求方法**: 选择 `POST` 或 `GET`（API 支持两种方法）

- **执行间隔**: 每 5 分钟

### 2. 请求头配置

在 cron-job.org 的 "Request Settings" 或 "Headers" 部分添加：

```
Authorization: Bearer YOUR_CRON_SECRET
Content-Type: application/json
```

**重要**: 
- 将 `YOUR_CRON_SECRET` 替换为 Vercel 环境变量中设置的 `CRON_SECRET` 值
- 格式必须是 `Bearer <secret>`，注意 Bearer 后面有一个空格

### 3. 完整配置示例

在 cron-job.org 中的配置应该如下：

```
URL: https://mindfulpenpal.com/api/cron/process-emails
Method: POST
Headers:
  Authorization: Bearer your-actual-cron-secret-here
  Content-Type: application/json
Schedule: */5 * * * * (每 5 分钟)
```

### 4. 验证配置

配置完成后，可以：

1. **手动测试**: 在 cron-job.org 中点击 "Test" 按钮
2. **检查响应**: 应该返回 JSON 格式的响应，而不是 307 错误
3. **查看日志**: 在 Vercel Dashboard 的 Functions 日志中查看执行情况

### 5. 常见问题排查

#### 问题 1: 仍然返回 307
- ✅ 确认 URL 使用 `https://` 而不是 `http://`
- ✅ 确认域名拼写正确：`mindfulpenpal.com`
- ✅ 确认没有多余的斜杠：`/api/cron/process-emails`（不是 `/api/cron/process-emails/`）

#### 问题 2: 返回 401 Unauthorized
- ✅ 检查 `Authorization` header 格式：`Bearer <secret>`
- ✅ 确认 Vercel 环境变量中 `CRON_SECRET` 已正确设置
- ✅ 确认 header 名称大小写正确：`Authorization`（不是 `authorization`）

#### 问题 3: 返回 500 Server Error
- ✅ 检查 Vercel 环境变量是否都已正确配置
- ✅ 查看 Vercel Functions 日志获取详细错误信息

## 替代方案：使用 Vercel Cron

如果外部 cron 服务仍有问题，可以考虑使用 Vercel 的内置 Cron 功能：

在 `vercel.json` 中添加：

```json
{
  "crons": [
    {
      "path": "/api/cron/process-emails",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

然后在 API 路由中检查 `x-vercel-cron` header 来验证请求来源。

## 环境变量检查清单

确保在 Vercel 项目设置中配置了以下环境变量：

- ✅ `CRON_SECRET` - 用于验证 cron 请求的密钥
- ✅ `GMAIL_CLIENT_ID` - Gmail API 客户端 ID
- ✅ `GMAIL_CLIENT_SECRET` - Gmail API 客户端密钥
- ✅ `GMAIL_REFRESH_TOKEN` - Gmail API 刷新令牌
- ✅ `BREVO_API_KEY` - Brevo 发送邮件 API 密钥
- ✅ `SUPABASE_URL` - Supabase 项目 URL
- ✅ `SUPABASE_SERVICE_ROLE_KEY` - Supabase 服务角色密钥
- ✅ 其他必要的环境变量
