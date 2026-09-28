import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { CATALOG } from "../src/content/catalog.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

const SANDBOX_ALLOWED = new Set([
  "allow-scripts",
  "allow-same-origin",
  "allow-pointer-lock",
]);

const HOSTS = new Set(["caskanatomy.info", "anatomytool.org"]);

function walk(dir, files = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, files);
    else if (name.endsWith(".js") || name.endsWith(".html")) files.push(path);
  }
  return files;
}

function models() {
  const found = [];
  for (const group of CATALOG) {
    const lists = group.groups ? group.groups.map((entry) => entry.items) : [group.items];
    for (const list of lists) found.push(...list);
  }
  return found;
}

test("the embedded viewer cannot navigate this page", () => {
  const tag = html.match(/<iframe\b[^>]*>/i)?.[0];
  assert.ok(tag, "index.html needs the viewer iframe");
  const sandbox = tag.match(/\bsandbox="([^"]*)"/)?.[1];
  assert.ok(sandbox, "viewer iframe needs a sandbox attribute");
  const tokens = sandbox.split(/\s+/).filter(Boolean);
  assert.ok(tokens.includes("allow-scripts"));
  for (const token of tokens) {
    assert.ok(SANDBOX_ALLOWED.has(token), `unexpected sandbox token: ${token}`);
  }
  assert.equal(tokens.some((token) => token.startsWith("allow-top-navigation")), false);
});

test("new-tab links cannot keep a handle on this page", () => {
  const tags = html.match(/<a\b[^>]*>/gi) || [];
  assert.ok(tags.length > 0);
  for (const tag of tags) {
    if (!/\btarget="_blank"/.test(tag)) continue;
    assert.match(tag, /\brel="[^"]*\bnoopener\b/);
    assert.match(tag, /\brel="[^"]*\bnoreferrer\b/);
  }
  const appJs = walk(join(root, "src"));
  for (const file of appJs) {
    const source = readFileSync(file, "utf8");
    if (!source.includes('"_blank"') && !source.includes("'_blank'")) continue;
    assert.match(source, /noopener/);
    assert.match(source, /noreferrer/);
  }
});

test("catalog urls stay on the anatomy hosts", () => {
  for (const model of models()) {
    for (const value of [model.viewer, model.page]) {
      if (!value) continue;
      const url = new URL(value);
      assert.equal(url.protocol, "https:");
      assert.ok(HOSTS.has(url.hostname), value);
      assert.equal(url.username, "");
      assert.equal(url.password, "");
    }
  }
});

test("app source does not inject markup or run dynamic code", () => {
  const files = [join(root, "index.html"), ...walk(join(root, "src"))];
  for (const file of files) {
    const source = readFileSync(file, "utf8");
    assert.equal(/\binnerHTML\b|\bouterHTML\b|\beval\s*\(|\bdocument\.write\b|\bnew Function\b|javascript:/i.test(source), false, file);
  }
});

test("stored answers reject malformed rows", async () => {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, value),
    removeItem: (key) => store.delete(key),
  };
  store.set("anatomy-atelier-cards-v1", JSON.stringify({
    answers: [
      { id: "frontal", correct: true },
      { id: "<script>", correct: "yes" },
      { id: 12, correct: true },
      null,
    ],
  }));
  const { loadRecord } = await import("../src/stats/record.js");
  const record = loadRecord();
  assert.deepEqual(record.answers, [{ id: "frontal", correct: true }]);
});
