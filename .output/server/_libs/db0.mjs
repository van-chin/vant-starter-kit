import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
//#region node_modules/.pnpm/db0@0.3.4/node_modules/db0/dist/index.mjs
function sqlTemplate(strings, ...values) {
	if (!isTemplateStringsArray(strings) || !Array.isArray(values)) throw new Error("[db0] invalid template invocation");
	const staticIndexes = [];
	let result = strings[0] || "";
	for (let i = 1; i < strings.length; i++) {
		if (result.endsWith("{") && strings[i].startsWith("}")) {
			result = result.slice(0, -1) + values[i - 1] + strings[i].slice(1);
			staticIndexes.push(i - 1);
			continue;
		}
		result += `?${strings[i] ?? ""}`;
	}
	const dynamicValues = values.filter((_, i) => !staticIndexes.includes(i));
	return [result.trim(), dynamicValues];
}
function isTemplateStringsArray(strings) {
	return Array.isArray(strings) && "raw" in strings && Array.isArray(strings.raw);
}
var SQL_SELECT_RE = /^select/i;
var SQL_RETURNING_RE = /[\s]returning[\s]/i;
var DIALECTS_WITH_RET = /* @__PURE__ */ new Set(["postgresql", "sqlite"]);
var DISPOSED_ERR = "This database instance has been disposed and cannot be used.";
/**
* Creates and returns a database interface using the specified connector.
* This interface allows you to execute raw SQL queries, prepare SQL statements,
* and execute SQL queries with parameters using tagged template literals.
*
* @param {Connector} connector - The database connector used to execute and prepare SQL statements. See {@link Connector}.
* @returns {Database} The database interface that allows SQL operations. See {@link Database}.
*/
function createDatabase(connector) {
	let _disposed = false;
	const checkDisposed = () => {
		if (_disposed) {
			const err = /* @__PURE__ */ new Error(DISPOSED_ERR);
			Error.captureStackTrace?.(err, checkDisposed);
			throw err;
		}
	};
	return {
		get dialect() {
			return connector.dialect;
		},
		get disposed() {
			return _disposed;
		},
		getInstance() {
			checkDisposed();
			return connector.getInstance();
		},
		exec: (sql) => {
			checkDisposed();
			return Promise.resolve(connector.exec(sql));
		},
		prepare: (sql) => {
			checkDisposed();
			return connector.prepare(sql);
		},
		sql: async (strings, ...values) => {
			checkDisposed();
			const [sql, params] = sqlTemplate(strings, ...values);
			if (SQL_SELECT_RE.test(sql) || DIALECTS_WITH_RET.has(connector.dialect) && SQL_RETURNING_RE.test(sql)) return {
				rows: await connector.prepare(sql).all(...params),
				success: true
			};
			else return await connector.prepare(sql).run(...params);
		},
		dispose: () => {
			if (_disposed) return Promise.resolve();
			_disposed = true;
			try {
				return Promise.resolve(connector.dispose?.());
			} catch (error) {
				return Promise.reject(error);
			}
		},
		[Symbol.asyncDispose]() {
			return this.dispose();
		}
	};
}
Object.freeze({
	"better-sqlite3": "db0/connectors/better-sqlite3",
	"bun-sqlite": "db0/connectors/bun-sqlite",
	"bun": "db0/connectors/bun-sqlite",
	"cloudflare-d1": "db0/connectors/cloudflare-d1",
	"cloudflare-hyperdrive-mysql": "db0/connectors/cloudflare-hyperdrive-mysql",
	"cloudflare-hyperdrive-postgresql": "db0/connectors/cloudflare-hyperdrive-postgresql",
	"libsql-core": "db0/connectors/libsql/core",
	"libsql-http": "db0/connectors/libsql/http",
	"libsql-node": "db0/connectors/libsql/node",
	"libsql": "db0/connectors/libsql/node",
	"libsql-web": "db0/connectors/libsql/web",
	"mysql2": "db0/connectors/mysql2",
	"node-sqlite": "db0/connectors/node-sqlite",
	"sqlite": "db0/connectors/node-sqlite",
	"pglite": "db0/connectors/pglite",
	"planetscale": "db0/connectors/planetscale",
	"postgresql": "db0/connectors/postgresql",
	"sqlite3": "db0/connectors/sqlite3"
});
//#endregion
//#region node_modules/.pnpm/db0@0.3.4/node_modules/db0/dist/connectors/_internal/statement.mjs
var BoundableStatement = class {
	_statement;
	constructor(rawStmt) {
		this._statement = rawStmt;
	}
	bind(...params) {
		return new BoundStatement(this, params);
	}
};
var BoundStatement = class BoundStatement {
	#statement;
	#params;
	constructor(statement, params) {
		this.#statement = statement;
		this.#params = params;
	}
	bind(...params) {
		return new BoundStatement(this.#statement, params);
	}
	all() {
		return this.#statement.all(...this.#params);
	}
	run() {
		return this.#statement.run(...this.#params);
	}
	get() {
		return this.#statement.get(...this.#params);
	}
};
//#endregion
//#region node_modules/.pnpm/db0@0.3.4/node_modules/db0/dist/connectors/node-sqlite.mjs
function nodeSqlite3Connector(opts) {
	let _db;
	const getDB = () => {
		if (_db) return _db;
		const nodeSqlite = globalThis.process?.getBuiltinModule?.("node:sqlite");
		if (!nodeSqlite) throw new Error("`node:sqlite` module is not available. Please ensure you are running in Node.js >= 22.5 or Deno >= 2.2.");
		if (opts.name === ":memory:") {
			_db = new nodeSqlite.DatabaseSync(":memory:");
			return _db;
		}
		const filePath = resolve(opts.cwd || ".", opts.path || `.data/${opts.name || "db"}.sqlite`);
		mkdirSync(dirname(filePath), { recursive: true });
		_db = new nodeSqlite.DatabaseSync(filePath);
		return _db;
	};
	return {
		name: "node-sqlite",
		dialect: "sqlite",
		getInstance: () => getDB(),
		exec(sql) {
			getDB().exec(sql);
			return { success: true };
		},
		prepare: (sql) => new StatementWrapper(() => getDB().prepare(sql)),
		dispose: () => {
			_db?.close?.();
			_db = void 0;
		}
	};
}
var StatementWrapper = class extends BoundableStatement {
	async all(...params) {
		return this._statement().all(...params);
	}
	async run(...params) {
		return {
			success: true,
			...this._statement().run(...params)
		};
	}
	async get(...params) {
		return this._statement().get(...params);
	}
};
//#endregion
export { createDatabase as n, nodeSqlite3Connector as t };
