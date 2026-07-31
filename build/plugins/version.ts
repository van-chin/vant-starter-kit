import type { PluginOption } from 'vite';
import { writeFileSync, appendFileSync, existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * 生成 version.json 和对应的 Cloudflare _headers 规则，用于前端检测新版本发布。
 *
 * - version.json: 写入构建时间戳，前端轮询比对
 * - _headers: 禁止 Cloudflare CDN 缓存 version.json（否则永远返回旧版本）
 *
 * 适用场景：
 *   - H5（非 PWA）：轮询 /version.json 检测新版本
 *   - PWA：Service Worker 更新 + version.json 双重保障
 */

const VERSION_FILE = 'version.json';
const HEADERS_FILE = '_headers';
const HEADERS_RULE = `/${VERSION_FILE}
  cache-control: no-store
`;

function generateVersion(dir: string): void {
  const versionData = {
    v: Date.now().toString(),
    t: new Date().toISOString(),
  };
  writeFileSync(resolve(dir, VERSION_FILE), JSON.stringify(versionData));
  console.log(`[version] ${VERSION_FILE} → ${versionData.t}`);

  // 追加 _headers 规则（禁止 CDN 缓存 version.json）
  const headersPath = resolve(dir, HEADERS_FILE);
  const existing = existsSync(headersPath) ? readFileSync(headersPath, 'utf-8') : '';
  if (!existing.includes(`/${VERSION_FILE}`)) {
    appendFileSync(headersPath, `\n${HEADERS_RULE}`);
    console.log(`[version] ${HEADERS_FILE} → added no-store rule for ${VERSION_FILE}`);
  }
}

export function createVersionPlugin(): PluginOption {
  return {
    name: 'vite-plugin-version-json',

    // 开发服务器启动时写入 public/
    configureServer() {
      const publicDir = resolve(process.cwd(), 'public');
      generateVersion(publicDir);
    },

    // 构建时写入 output dir
    writeBundle(_options) {
      const outDir = resolve(_options.dir || 'dist');
      generateVersion(outDir);
    },
  };
}
