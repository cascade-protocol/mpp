import * as fs from "node:fs";
import * as path from "node:path";

const serverDir = "dist/server";
const visited = new Set<string>();

function traceStaticImports(file: string) {
	const resolved = path.resolve(file);
	if (visited.has(resolved)) return;
	visited.add(resolved);
	if (!fs.existsSync(resolved)) return;
	const content = fs.readFileSync(resolved, "utf8");

	const staticImports = content.match(/from\s+["']([^"']+)["']/g) || [];
	for (const imp of staticImports) {
		const m = imp.match(/["']([^"']+)["']/);
		if (!m || !m[1].startsWith(".")) continue;
		let target = path.resolve(path.dirname(file), m[1]);
		if (!target.endsWith(".js") && !target.endsWith(".wasm")) target += ".js";
		traceStaticImports(target);
	}
}

traceStaticImports(path.join(serverDir, "serve-cloudflare.js"));

const ssrAssetsDir = path.join(serverDir, "ssr", "assets");
let removed = 0;
let savedBytes = 0;

if (fs.existsSync(ssrAssetsDir)) {
	for (const file of fs.readdirSync(ssrAssetsDir)) {
		const filePath = path.resolve(path.join(ssrAssetsDir, file));
		if (!visited.has(filePath)) {
			const size = fs.statSync(filePath).size;
			fs.unlinkSync(filePath);
			removed++;
			savedBytes += size;
		}
	}
}

console.log(
	`Pruned ${removed} unreachable SSR files (${(savedBytes / 1024).toFixed(0)} KiB)`,
);
