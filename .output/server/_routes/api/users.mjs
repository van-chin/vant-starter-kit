import { i as defineHandler } from "../../_libs/h3+rou3+srvx.mjs";
import { n as createDatabase, t as nodeSqlite3Connector } from "../../_libs/db0.mjs";
//#region #nitro/virtual/database
var connectionConfigs = { default: {
	connector: nodeSqlite3Connector,
	options: { "name": "db" }
} };
//#endregion
//#region node_modules/.pnpm/nitro@3.0.260610-beta_@voidzero-dev+vite-plus-core@0.2.6_@types+node@26.1.1_jiti@2.7.0__06c61db7dab0069155184729235039d8/node_modules/nitro/dist/runtime/internal/database.mjs
var instances = Object.create(null);
function useDatabase(name = "default") {
	if (instances[name]) return instances[name];
	if (!connectionConfigs[name]) throw new Error(`Database connection "${name}" not configured.`);
	return instances[name] = createDatabase(connectionConfigs[name].connector(connectionConfigs[name].options || {}));
}
//#endregion
//#region server/api/users.ts
var users_default = defineHandler(async () => {
	const db = useDatabase();
	await db.sql`CREATE TABLE IF NOT EXISTS users ("id" TEXT PRIMARY KEY, "firstName" TEXT, "lastName" TEXT, "email" TEXT)`;
	const { rows } = await db.sql`SELECT * FROM users`;
	return {
		code: 0,
		message: "success!",
		data: rows
	};
});
//#endregion
export { users_default as default };
