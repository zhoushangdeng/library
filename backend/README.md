# 图书管理系统------

## 运行项目

- 安装依赖 `npm install`
- 启动项目 `npm run dev`
- 运行测试 `npm run test`

.env 配置样例：
```
NODE_ENV=production
DEBUG = server,Router:blacklist,-follow-redirects
DEBUG_SHOW_HIDDEN = true
DEBUG_DEPTH = 7
DEBUG_COMPACT = true
DEBUG_BREAK_LENGTH = 80

SERVER_PORT = 6006
NM_PUBLIC_KEY = "jwtSecret"
TOKEEN_EXPRIES = 684000

LOG_HTTP_LEVEL = notice
LOG_LOCAL_LEVEL = debug
```