## 目标

GitHub 推送后自动构建并部署到 Cloudflare Workers，替代手动 `vp dlx wrangler deploy`。

## 方案：GitHub Actions + cloudflare/wrangler-action（官方 Action）

复用项目现有的手动部署链路：`pnpm install → pnpm build（tsc && vp build）→ wrangler deploy`。Nitro `cloudflare_module` 预设构建产物 `.output/server/wrangler.json` + `../public` 静态资源（含 PWA sw.js、version.json）由同一次 `wrangler deploy` 发布，无需额外步骤。

### 新建文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy to Cloudflare Workers

on:
  push:
    branches: [main]
  workflow_dispatch:            # 支持手动触发

concurrency:
  group: deploy
  cancel-in-progress: false     # 防止并发部署竞争

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: pnpm/action-setup@v4
        with:
          version: 11.18.0      # 与 devEngines 一致

      - uses: actions/setup-node@v4
        with:
          node-version-file: .node-version   # 24.18.0
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Build
        run: pnpm build
        env:
          VITE_ENV_NAME: production
          # 其他构建期变量可按需追加，例如：
          # VITE_TCC_APP_ID: ${{ secrets.VITE_TCC_APP_ID }}

      - name: Deploy to Cloudflare Workers
        uses: cloudflare/wrangler-action@v4
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}   # wrangler.json 无此字段，必须显式传
          command: deploy
          workingDirectory: .output/server                  # 相对路径 ../public 在此解析
          wranglerVersion: '4.116.0'                        # 与本地 catalog 版本一致，避免行为漂移
```

### 关键设计点

1. **全量构建**：`.output/`、`.wrangler/` 均被 gitignore，CI 每次全新构建；Linux 上 Nitro 生成的 wrangler.json 自动使用平台正确路径（`../public`），部署 cwd 为 `.output/server`（配置自动发现 + 相对路径正确解析）
2. **版本确定性**：wrangler 固定 `4.116.0`（与 `pnpm-workspace.yaml` catalog 一致）；Node 24.18.0 读 `.node-version` 文件；pnpm 11.18.0 与 `devEngines` 一致
3. **密钥最少化**：项目环境变量全部是 `VITE_*` 构建期变量（无服务端密钥），仅需 2 个 GitHub Actions secrets：`CLOUDFLARE_API_TOKEN`（Cloudflare 控制台创建，权限模板 "Edit Cloudflare Workers"）、`CLOUDFLARE_ACCOUNT_ID`（账户 ID）
4. **版本检测兼容**：`version.json` 构建期生成时间戳，每次部署前端自动检测到新版本并提示刷新，与现有 `useAppUpdate` 逻辑天然契合

### 同时更新：`README.md`

新增「🚀 CI/CD 自动部署」章节，说明：
- 工作原理（push main → Actions 构建 → wrangler deploy）
- 2 个 secrets 的获取方法（Cloudflare 控制台 → My Profile → API Tokens）
- 注意事项：**先配置 secrets 再推送 workflow 文件**（否则首次运行会因无 token 失败）

### 实施步骤

1. 创建 `.github/workflows/deploy.yml`
2. 更新 README.md 部署章节
3. 提交并推送（`feat: 添加 GitHub Actions 自动部署到 Cloudflare Workers`）
4. 告知用户需要手动完成的 secrets 配置步骤（无法代劳，需其 Cloudflare 账号）

### 验证方式

推送后在 GitHub Actions 页面查看工作流运行结果；运行失败时日志会给出明确错误（如 token 未配置、权限不足）