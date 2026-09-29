import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { CATALOG, modelById } from "../src/content/catalog.js";
import { QUESTIONS } from "../src/content/questions.js";
import { stageView } from "../src/scene/stageView.js";

const root = fileURLToPath(new URL("..", import.meta.url));

function catalogItems() {
  const items = [];
  for (const group of CATALOG) {
    const lists = group.groups ? group.groups.map((entry) => entry.items) : [group.items];
    for (const list of lists) items.push(...list);
  }
  return items;
}

function skeletonNames() {
  const file = readFileSync(join(root, "public/models/overview-skeleton.glb"));
  const view = new DataView(file.buffer, file.byteOffset, file.byteLength);
  assert.equal(view.getUint32(0, true), 0x46546c67);
  const length = view.getUint32(8, true);
  let offset = 12;
  while (offset + 8 <= length) {
    const chunkLength = view.getUint32(offset, true);
    const chunkType = view.getUint32(offset + 4, true);
    const chunk = file.subarray(offset + 8, offset + 8 + chunkLength);
    if (chunkType === 0x4e4f534a) {
      const json = JSON.parse(new TextDecoder().decode(chunk));
      return new Set((json.nodes || []).map((node) => node.name).filter(Boolean));
    }
    offset += 8 + chunkLength;
  }
  throw new Error("The skeleton file has no JSON chunk.");
}

test("every flashcard bone exists on the skeleton", () => {
  const names = skeletonNames();
  const missing = [];
  for (const question of QUESTIONS) {
    for (const mesh of question.meshes || []) {
      if (!names.has(mesh)) missing.push(`${question.id}: ${mesh}`);
    }
  }
  assert.deepEqual(missing, []);
});

test("every catalog id opens one model", () => {
  for (const item of catalogItems()) {
    const found = modelById(item.id);
    assert.ok(found, item.id);
    assert.equal(found.local, item.local);
    if (item.local) {
      assert.equal(found.viewer, null);
    } else {
      assert.equal(found.viewer, item.viewer);
      assert.match(found.viewer, /^https:\/\/caskanatomy\.info\/open3dviewer\/\?model=/);
    }
  }
});

test("the skeleton and the embedded viewer are never on screen together", () => {
  for (const mode of ["skeleton", "embed"]) {
    const view = stageView(mode);
    const canvasShown = !view.canvasHidden;
    const viewerShown = !view.viewerHidden;
    assert.equal(canvasShown && viewerShown, false, mode);
    assert.equal(canvasShown || viewerShown, true, mode);
  }

  const css = readFileSync(join(root, "src/styles/stage.css"), "utf8");
  const embedCanvas = css.match(/\.stage\.is-embed canvas\s*\{[^}]*\}/)?.[0];
  assert.ok(embedCanvas);
  assert.match(embedCanvas, /visibility:\s*hidden/);
  assert.doesNotMatch(embedCanvas, /display:\s*none/);
  assert.match(css, /\.stage:not\(\.is-embed\) #viewer\s*\{[^}]*display:\s*none !important/);

  const main = readFileSync(join(root, "src/main.js"), "utf8");
  assert.match(main, /stageView\(/);
  assert.match(main, /classList\.toggle\("is-embed", view\.embed\)/);
  assert.match(main, /root\.rotation\.y = 0/);
});
