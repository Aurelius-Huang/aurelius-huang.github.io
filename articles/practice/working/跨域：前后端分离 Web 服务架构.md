---
id: cross-domain
sidebar_position: 4
title: 跨域：前后端分离 Web 服务架构
description: 跨域：前后端分离 Web 服务架构
last_update:
  author: Aurelius
  date: 2024-08-09
tags:
  - 跨域
---

> Prompt: 介绍并分析一下前后端分离 Web 服务架构中存在的 “跨域” 问题，以及相关的最佳实践。
>
> Prompt: 简要介绍”同源策略“的含义；当前后端之间存在一个网管层（比如 Kong），跨域问题会演变成怎样？又有哪些应对的最佳实践？

在前后端分离的 Web 服务架构中，跨域（Cross-Origin Resource Sharing，CORS）问题是一个常见的问题。这里介绍一下跨域问题及其解决方案和最佳实践。

### 什么是跨域问题？

跨域问题发生在浏览器的同源策略（Same-Origin Policy）限制下。当一个域上的网页试图访问另一个域上的资源时，浏览器会阻止这些操作以保护用户的安全。这种限制包括但不限于 Ajax 请求、读取 Cookie 等。例如，位于 `http://example.com` 的网页试图发出一个 Ajax 请求到 `http://api.example.com` 的时候，就会遇到跨域问题。

### 为什么会有同源策略？

同源策略是为了防范恶意网站获取用户信息和不受信任的代码执行提供的一种安全机制。它阻止了某些攻击（如跨站脚本攻击）。

### 解决跨域问题的几种方法及最佳实践

#### 1. CORS（跨域资源共享）

最常见的解决跨域问题的方法是使用 CORS，它允许服务器端设置响应头，告诉浏览器允许跨源请求。

服务器端配置例子（使用 Flask）：

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/example")
def example():
    return "Hello, World!"

if __name__ == "__main__":
    app.run()
```

具体来说，CORS 通过 HTTP 头信息来开启浏览器的跨域请求权限，例如：

- `Access-Control-Allow-Origin`: 指定允许访问的域。
- `Access-Control-Allow-Methods`: 指定允许的 HTTP 请求方法（如 GET, POST, PUT）。
- `Access-Control-Allow-Headers`: 指定可以使用的自定义请求头。
- `Access-Control-Allow-Credentials`: 是否允许发送 Cookie 等认证信息。

示例响应头：

```http
Access-Control-Allow-Origin: http://example.com
Access-Control-Allow-Methods: GET,POST,PUT
Access-Control-Allow-Headers: Content-Type
Access-Control-Allow-Credentials: true
```

#### 2. JSONP (JSON with Padding)

JSONP 通过 `<script>` 标签不受同源策略限制的特点，实现跨域请求。它不是真正的 Ajax 请求，适用于 GET 请求。

前端示例：

```html
<script>
  function handleResponse(data) {
    console.log(data);
  }
</script>
<script src="http://api.example.com/data?callback=handleResponse"></script>
```

服务器端返回示例（注意 JSONP 已不被推荐，具有安全风险）：

```javascript
handleResponse({ key: 'value' });
```

#### 3. 服务器端代理

通过服务器端代理请求来解决跨域问题。前端发送请求到与其同源的服务器，服务器再向目标服务器发送请求并返回结果。

示例（使用 Node.js 和 Express）：

```javascript
const express = require('express');
const request = require('request');
const app = express();

app.get('/api', (req, res) => {
  request('http://api.example.com/data', function (error, response, body) {
    if (error) {
      res.status(500).send(error);
    } else {
      res.send(body);
    }
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

#### 4. 同源策略配置

有时也可以通过适当地组织前端和后端的部署在同个域或子域下，从而避免跨域问题。

### 最佳实践

1. 安全第一：严格设置 `Access-Control-Allow-Origin` 头，只允许信任的域名访问，避免设置为 `*`。
2. 最小权限：仅在需要的请求方法、请求头等上设置 CORS。
3. 认证处理：确保在 CORS 中正确处理 `Access-Control-Allow-Credentials` 和 Cookie 传递，以防止 CSRF 攻击。
4. 监控和日志：记录跨域请求日志，监控不正常的跨域请求行为。

通过这些方法和最佳实践，可以有效地解决跨域问题，同时保持系统的安全性和灵活性。

---

### 同源策略的含义

同源策略（Same-Origin Policy）是一种浏览器的安全机制，用于限制从一个源（域、协议、端口）加载的脚本如何与来自另一个源的资源进行互动。具体来说，同源策略要求以下三个条件都相同：

1. 协议（例如 http、https）
2. 域名（例如 www.example.com）
3. 端口（例如 80、443）

如果协议、域名或端口中的任何一个不同，就会被视为“跨源”。

同源策略的重点在于：

- 保护用户数据安全，防止恶意网站获取用户信息。
- 防止跨站脚本攻击（XSS）和数据窃取。

### 跨域问题与网关层

当在前后端之间引入一个网关层（例如 Kong），跨域问题的处理方式会有所变化。

演变情况：

- 网关层可以集中管理和转发请求，并作为一个中介处理跨域相关的设置。
- 网关层可以直接配置 CORS 头信息，统一管理来自不同前端的跨域请求，从而简化后端服务的配置工作。

### 应对跨域问题的最佳实践

#### 1. 在网关层配置 CORS

通过在网关层（例如 Kong、Nginx）统一配置 CORS 相关的请求头，集中控制跨域策略。

Kong 配置示例：

```bash
# 启用CORS插件
curl -i -X POST http://localhost:8001/services/{service}/plugins \
    --data "name=cors" \
    --data "config.origins=http://example.com,http://another.com" \
    --data "config.methods=GET, POST, OPTIONS" \
    --data "config.headers=Accept,Authorization,Content-Type" \
    --data "config.exposed_headers=X-Total-Count" \
    --data "config.credentials=true" \
    --data "config.max_age=3600"
```

#### 2. 使用反向代理解决跨域问题

网关（如 Kong 或 Nginx）可以作为反向代理，处理来自前端的请求并转发给后端服务，前端只需要与网关进行通信，避免了跨域问题。

Nginx 配置示例：

```nginx
server {
    listen 80;
    server_name example.com;

    location /api/ {
        proxy_pass http://backend_service;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 配置CORS
    location / {
        if ($request_method = OPTIONS) {
            add_header Access-Control-Allow-Origin "*";
            add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
            add_header Access-Control-Allow-Headers "Authorization, Content-Type";
            add_header Content-Length 0;
            add_header Content-Type text/plain;
            return 204;
        }
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, POST, OPTIONS";
        add_header Access-Control-Allow-Headers "Authorization, Content-Type";
    }
}
```

#### 3. 服务网格架构

在微服务架构中可以使用服务网格（如 Istio）管理服务间通信，并在这里配置跨域策略，统一处理跨域请求。

Istio 配置 CORS：

```yaml
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: my-service
spec:
  hosts:
    - '*'
  gateways:
    - my-gateway
  http:
    - match:
        - uri:
            prefix: /api/
      route:
        - destination:
            host: backend-service
          headers:
            response:
              add:
                access-control-allow-origin: '*'
                access-control-allow-methods: 'OPTIONS, GET, POST, PUT, DELETE'
                access-control-allow-headers: 'Authorization, Content-Type'
```

### 最佳实践

1. 集中管理：在一个统一的网关层配置跨域策略，提高管理效率，降低复杂度。
2. 安全配置：严密控制允许的源、方法和头，避免过于宽泛的策略，如 `Access-Control-Allow-Origin: *`。
3. 日志和监控：监控所有跨域请求，记录日志以便审计和问题排查。
4. 最小权限：只允许必要的跨域请求方法和头，最小化潜在的安全风险。

通过在网关层集中管理跨域配置，可以有效地简化跨域问题的处理，同时确保系统安全和灵活性。
