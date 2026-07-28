globalThis.__nitro_main__ = import.meta.url;
import { a as defineLazyEventHandler, c as serve, i as defineHandler, n as HTTPError, o as toEventHandler, s as NodeResponse, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { i as withoutTrailingSlash, n as joinURL, r as withLeadingSlash, t as decodePath } from "./_libs/ufo.mjs";
import { promises } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
//#region node_modules/.pnpm/nitro@3.0.260610-beta_@voidzero-dev+vite-plus-core@0.2.6_@types+node@26.1.1_jiti@2.7.0__06c61db7dab0069155184729235039d8/node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.svg": {
		"type": "image/svg+xml",
		"etag": "\"2532-P1u486agW3ymimJYHS3VvIiBLK8\"",
		"mtime": "2026-07-28T08:51:10.336Z",
		"size": 9522,
		"path": "../public/favicon.svg"
	},
	"/icons.svg": {
		"type": "image/svg+xml",
		"etag": "\"13a7-+Yl6wl4T3p6mAdLxrF2TU9++/No\"",
		"mtime": "2026-07-28T08:51:10.336Z",
		"size": 5031,
		"path": "../public/icons.svg"
	},
	"/assets/TestFooter-D1J8qT0c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"527-8k0SExqgA3AVCP2vs/4XsVfX8WI\"",
		"mtime": "2026-07-28T08:51:10.326Z",
		"size": 1319,
		"path": "../public/assets/TestFooter-D1J8qT0c.js"
	},
	"/assets/TestHeader-B95aiWPm.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2e1-khJnTuuKq2MN5JdpdbvkScMm9GQ\"",
		"mtime": "2026-07-28T08:51:10.326Z",
		"size": 737,
		"path": "../public/assets/TestHeader-B95aiWPm.js"
	},
	"/assets/_plugin-vue_export-helper-BDNMzG2s.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54-MasMfSk/A98C3Gn9uIOxtFxkWNw\"",
		"mtime": "2026-07-28T08:51:10.326Z",
		"size": 84,
		"path": "../public/assets/_plugin-vue_export-helper-BDNMzG2s.js"
	},
	"/assets/admin-CNMlvaxU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"98f-HH6z0f2zF1gCBD0E7MDp91MXUiw\"",
		"mtime": "2026-07-28T08:51:10.326Z",
		"size": 2447,
		"path": "../public/assets/admin-CNMlvaxU.js"
	},
	"/assets/admin-DhIy5cUV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"120-oXKAZCI8X1wxJlOeOTX9iXGED3A\"",
		"mtime": "2026-07-28T08:51:10.326Z",
		"size": 288,
		"path": "../public/assets/admin-DhIy5cUV.js"
	},
	"/assets/cart-DZdpa1n3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"590-9JoN8dQZhVSawVo3oZEY9iqzppQ\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 1424,
		"path": "../public/assets/cart-DZdpa1n3.js"
	},
	"/assets/cart-g9mxS9Li.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"83-re1GV0cEm6wzu1J6Z6c2zDjw3n4\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 131,
		"path": "../public/assets/cart-g9mxS9Li.css"
	},
	"/assets/categories-99i2wITn.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"83-+571cjnsx762thj4K/aSsFM+TiY\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 131,
		"path": "../public/assets/categories-99i2wITn.css"
	},
	"/assets/categories-CnJtQAJB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"59b-PN7C42vmFicuavrx3BEn1+Nb8u8\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 1435,
		"path": "../public/assets/categories-CnJtQAJB.js"
	},
	"/assets/cell-DVr_ldIy.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"f7f-Q2JO/bmGqGvzgTjvvnxbYzbhi/g\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 3967,
		"path": "../public/assets/cell-DVr_ldIy.css"
	},
	"/assets/cell-rHkwHFlp.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f1-tctv/IXVTvQ7yTP2ys9h4FiVAl4\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 2033,
		"path": "../public/assets/cell-rHkwHFlp.js"
	},
	"/assets/department-Cwsl86il.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"147-ZiBebwMHK9sz/Nu8ddGWMwjtAhM\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 327,
		"path": "../public/assets/department-Cwsl86il.js"
	},
	"/assets/good copy-CFS4W5PB.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"468-ncud7Sfy7IYwwbnfC57Cum0F83U\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 1128,
		"path": "../public/assets/good copy-CFS4W5PB.js"
	},
	"/assets/good-DCrUr2EA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2af4-qq3dqoUJdRkDzJAQQtAnojSn0lw\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 10996,
		"path": "../public/assets/good-DCrUr2EA.js"
	},
	"/assets/good-DFWDgngx.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"c21-fsesoGLkQbWwjw9IDFaIxRnUXMc\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 3105,
		"path": "../public/assets/good-DFWDgngx.css"
	},
	"/assets/icon-DWxbH3C1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2a73-nUZ7JGeEcLXbxyNn5PGK6mjMpxA\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 10867,
		"path": "../public/assets/icon-DWxbH3C1.js"
	},
	"/assets/index-CuHPy7d4.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"4054-EeNZ3JPpP2Q1K3kfrix3IyXMY4Q\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 16468,
		"path": "../public/assets/index-CuHPy7d4.css"
	},
	"/assets/icon-B2zlZA97.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"ca5c-nIWsQ4BXSG+qEOg8h5Hq3vHOJn0\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 51804,
		"path": "../public/assets/icon-B2zlZA97.css"
	},
	"/assets/login-DZ3evWM8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"22a3-+pFox1Zox5o7vAEL/ff7UvtYD4Q\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 8867,
		"path": "../public/assets/login-DZ3evWM8.js"
	},
	"/assets/index-DJzTGzPs.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d8ff-WPils/gR0tdUqvXd0hdsmF/L/Qs\"",
		"mtime": "2026-07-28T08:51:10.326Z",
		"size": 55551,
		"path": "../public/assets/index-DJzTGzPs.js"
	},
	"/assets/interceptor-BegPYVZN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d0-2thhi6TBlo+M0QK5RMHp3etq2Bw\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 208,
		"path": "../public/assets/interceptor-BegPYVZN.js"
	},
	"/assets/login-pTPbrd6c.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1085-wVGrgiOgwpvnjFcFFHp/jMyaA0c\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 4229,
		"path": "../public/assets/login-pTPbrd6c.css"
	},
	"/assets/my-D00pugU9.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"83-nkM7o1w0Wh1+yMvYt7tBMa55bYU\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 131,
		"path": "../public/assets/my-D00pugU9.css"
	},
	"/assets/my-DWP3PhWd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4fd-CspLfLGsr2N4JDIABMU95SueiaQ\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 1277,
		"path": "../public/assets/my-DWP3PhWd.js"
	},
	"/assets/pages-BQU4F-9H.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"83-SDqhFVER+Og0iSj/TFYcdbQQCiM\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 131,
		"path": "../public/assets/pages-BQU4F-9H.css"
	},
	"/assets/pages-Du6tSzOf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"596-/bptlCodrL/FMasvu4a/6/Akz8c\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 1430,
		"path": "../public/assets/pages-Du6tSzOf.js"
	},
	"/assets/preload-helper-B1TkgkId.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"705-8YzobWLE3/ko4BQAjBfevEC+ykY\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 1797,
		"path": "../public/assets/preload-helper-B1TkgkId.js"
	},
	"/assets/runtime-dom.esm-bundler-DgDgLrmC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2473-tTqSGw/gD0na1vN/vHbBojOVgbU\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 9331,
		"path": "../public/assets/runtime-dom.esm-bundler-DgDgLrmC.js"
	},
	"/assets/screen-CuDA-v8e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"311-xhNCGAJo7BdRQFKlZ+3joUbTsiM\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 785,
		"path": "../public/assets/screen-CuDA-v8e.js"
	},
	"/assets/screen-Dsv-YDuA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"775-EV8I2N40ytXcdGpJ7JMc/MYlwIo\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 1909,
		"path": "../public/assets/screen-Dsv-YDuA.js"
	},
	"/assets/runtime-core.esm-bundler-BQQbKTcu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"102e5-GfcKRC68fa0DiJv4Vc5pJXcSUJQ\"",
		"mtime": "2026-07-28T08:51:10.327Z",
		"size": 66277,
		"path": "../public/assets/runtime-core.esm-bundler-BQQbKTcu.js"
	},
	"/assets/seed-BJFSHjJ3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"593-6qKC+b6RHiRmsT+TglBn6SWQfBE\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 1427,
		"path": "../public/assets/seed-BJFSHjJ3.js"
	},
	"/assets/seed-Bf17pSGE.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"83-5Dwhnpk09DtFG55qGTpfcWxuuI4\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 131,
		"path": "../public/assets/seed-Bf17pSGE.css"
	},
	"/assets/style-BZzBoauF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2aa5-ep3yKt8f2sX66UHAxHRHG0mnmUo\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 10917,
		"path": "../public/assets/style-BZzBoauF.js"
	},
	"/assets/style-Bse0B76r.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1d11-CJNfRbV4kXliw8YqjENyevsRza4\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 7441,
		"path": "../public/assets/style-Bse0B76r.css"
	},
	"/assets/style-BuXRfuAW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"be4-No/7yWpamN3Rgx7K/aqFslhmrt4\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 3044,
		"path": "../public/assets/style-BuXRfuAW.js"
	},
	"/assets/style-BvbN-_xe.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"64f-nH/sKmOlb388LgWaoel+HIFsoA8\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 1615,
		"path": "../public/assets/style-BvbN-_xe.css"
	},
	"/assets/style-CXVNnIIt.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6b7-X0WxdIFN7/smFPnnXcdQjfInKu0\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 1719,
		"path": "../public/assets/style-CXVNnIIt.js"
	},
	"/assets/style-D3_p-o-G.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"36-aCiau2c/TAprz9W1xyJqCrKZ2Vg\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 54,
		"path": "../public/assets/style-D3_p-o-G.js"
	},
	"/assets/style-qp5YXFZk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-Uvwbz0/gXwz47r+qZuA/ORf77Pw\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 60,
		"path": "../public/assets/style-qp5YXFZk.js"
	},
	"/assets/style-VWJNvpvU.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"1e6d-1QKpyNsb0FhciGz3mVHt0o6Tgvg\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 7789,
		"path": "../public/assets/style-VWJNvpvU.css"
	},
	"/assets/swipe-item-D7jInTns.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"62b-c4UMK/0Ron72mcARMlNKrnJ5yR8\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 1579,
		"path": "../public/assets/swipe-item-D7jInTns.css"
	},
	"/assets/swipe-item-DxunJIRW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1381-kpdAWSJ61zIKHXKKIm6yqFABNZQ\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 4993,
		"path": "../public/assets/swipe-item-DxunJIRW.js"
	},
	"/assets/test-BYHJo_Vc.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"e62-o2BRaDs/Qxz1seOT4eN4/b/i1Ss\"",
		"mtime": "2026-07-28T08:51:10.329Z",
		"size": 3682,
		"path": "../public/assets/test-BYHJo_Vc.css"
	},
	"/assets/test-CsiiL8In.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"136e-rxst+r18S1MCxFD277Kiw9pZL/o\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 4974,
		"path": "../public/assets/test-CsiiL8In.js"
	},
	"/assets/use-expose-xRER6ln3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-troYYoWL7J1Cbq6yE3L97jrfQKM\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 153,
		"path": "../public/assets/use-expose-xRER6ln3.js"
	},
	"/assets/use-id-CziwBaCr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"97-DiUPDkmH/6nAuWjNfwKP86jzcZQ\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 151,
		"path": "../public/assets/use-id-CziwBaCr.js"
	},
	"/assets/use-scope-id-DnzxTcDe.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"86-fuQIZm2ElCUSqJzH5BF0Ffe/juc\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 134,
		"path": "../public/assets/use-scope-id-DnzxTcDe.js"
	},
	"/assets/useApi-CROJJdhE-tpamPAat.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"33e-jtm6Gj+DhA01pPPw+lD7dq2fWqc\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 830,
		"path": "../public/assets/useApi-CROJJdhE-tpamPAat.js"
	},
	"/assets/useLayoutConfig-pcECGqMV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"253-6Si1Ia2mkpILrwS8LJWKwfFzlO8\"",
		"mtime": "2026-07-28T08:51:10.328Z",
		"size": 595,
		"path": "../public/assets/useLayoutConfig-pcECGqMV.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets-node
function readAsset(id) {
	const serverDir = dirname(fileURLToPath(globalThis.__nitro_main__));
	return promises.readFile(resolve(serverDir, public_assets_data_default[id].path));
}
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
function getAsset(id) {
	return public_assets_data_default[id];
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_@voidzero-dev+vite-plus-core@0.2.6_@types+node@26.1.1_jiti@2.7.0__06c61db7dab0069155184729235039d8/node_modules/nitro/dist/runtime/internal/static.mjs
var METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
var EncodingMap = {
	gzip: ".gz",
	br: ".br",
	zstd: ".zst"
};
var static_default = defineHandler((event) => {
	if (event.req.method && !METHODS.has(event.req.method)) return;
	let id = decodePath(withLeadingSlash(withoutTrailingSlash(event.url.pathname)));
	let asset;
	const encodings = [...(event.req.headers.get("accept-encoding") || "").split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(), ""];
	for (const encoding of encodings) for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
		const _asset = getAsset(_id);
		if (_asset) {
			asset = _asset;
			id = _id;
			break;
		}
	}
	if (!asset) {
		if (isPublicAssetURL(id)) {
			event.res.headers.delete("Cache-Control");
			throw new HTTPError({ status: 404 });
		}
		return;
	}
	if (encodings.length > 1) event.res.headers.append("Vary", "Accept-Encoding");
	if (event.req.headers.get("if-none-match") === asset.etag) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	const ifModifiedSinceH = event.req.headers.get("if-modified-since");
	const mtimeDate = new Date(asset.mtime);
	if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
		event.res.status = 304;
		event.res.statusText = "Not Modified";
		return "";
	}
	if (asset.type) event.res.headers.set("Content-Type", asset.type);
	if (asset.etag && !event.res.headers.has("ETag")) event.res.headers.set("ETag", asset.etag);
	if (asset.mtime && !event.res.headers.has("Last-Modified")) event.res.headers.set("Last-Modified", mtimeDate.toUTCString());
	if (asset.encoding && !event.res.headers.has("Content-Encoding")) event.res.headers.set("Content-Encoding", asset.encoding);
	if (asset.size > 0 && !event.res.headers.has("Content-Length")) event.res.headers.set("Content-Length", asset.size.toString());
	return readAsset(id);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_Tiwphj = defineLazyEventHandler(() => import("./_routes/api/tab_items.mjs"));
var _lazy_AApBUS = defineLazyEventHandler(() => import("./_routes/api/users.mjs"));
var _lazy_qdbN6P = defineLazyEventHandler(() => import("./_chunks/renderer-template.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const $0 = {
		route: "/api/tab-items",
		handler: _lazy_Tiwphj
	}, $1 = {
		route: "/api/users",
		handler: _lazy_AApBUS
	}, $2 = {
		route: "/**",
		handler: _lazy_qdbN6P
	};
	return (m, p) => {
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		if (p === "/api/tab-items") return { data: $0 };
		else if (p === "/api/users") return { data: $1 };
		let s = p.split("/");
		s.length;
		return {
			data: $2,
			params: { "_": s.slice(1).join("/") }
		};
	};
})();
var globalMiddleware = [toEventHandler(static_default)].filter(Boolean);
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_@voidzero-dev+vite-plus-core@0.2.6_@types+node@26.1.1_jiti@2.7.0__06c61db7dab0069155184729235039d8/node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new NodeResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~middleware"].push(...globalMiddleware);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		middleware.push(...h3App["~middleware"]);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_@voidzero-dev+vite-plus-core@0.2.6_@types+node@26.1.1_jiti@2.7.0__06c61db7dab0069155184729235039d8/node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_@voidzero-dev+vite-plus-core@0.2.6_@types+node@26.1.1_jiti@2.7.0__06c61db7dab0069155184729235039d8/node_modules/nitro/dist/runtime/internal/error/hooks.mjs
function _captureError(error, type) {
	console.error(`[${type}]`, error);
	useNitroApp().captureError?.(error, { tags: [type] });
}
function trapUnhandledErrors() {
	process.on("unhandledRejection", (error) => _captureError(error, "unhandledRejection"));
	process.on("uncaughtException", (error) => _captureError(error, "uncaughtException"));
}
//#endregion
//#region #nitro/virtual/tracing
var tracingSrvxPlugins = [];
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_@voidzero-dev+vite-plus-core@0.2.6_@types+node@26.1.1_jiti@2.7.0__06c61db7dab0069155184729235039d8/node_modules/nitro/dist/presets/node/runtime/node-server.mjs
var _parsedPort = Number.parseInt(process.env.NITRO_PORT ?? process.env.PORT ?? "");
var port = Number.isNaN(_parsedPort) ? 3e3 : _parsedPort;
var host = process.env.NITRO_HOST || process.env.HOST;
var cert = process.env.NITRO_SSL_CERT;
var key = process.env.NITRO_SSL_KEY;
var nitroApp = useNitroApp();
serve({
	port,
	hostname: host,
	tls: cert && key ? {
		cert,
		key
	} : void 0,
	fetch: nitroApp.fetch,
	plugins: [...tracingSrvxPlugins]
});
trapUnhandledErrors();
var node_server_default = {};
//#endregion
export { node_server_default as default };
