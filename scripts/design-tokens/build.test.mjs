import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildDesignTokens, renderTypeScript} from './build.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const snapshot = JSON.parse(fs.readFileSync(path.join(root, 'design-tokens/figma.snapshot.json'), 'utf8'));

test('retains the 105 source variables and 3 workflow modes', () => {
  const count = Object.values(snapshot.collections).reduce((sum, c) => sum + Object.keys(c.tokens).length, 0);
  assert.equal(count, 105);
  assert.deepEqual(snapshot.collections['Workflow Theme'].modes, ['Repeatable', 'Astro', 'Editor']);
});

test('resolves Figma aliases and alpha colors without losing the workflow variants', () => {
  const tokens = buildDesignTokens(snapshot);
  assert.equal(tokens.primitives.orange['500'], '#FF7A30');
  assert.equal(tokens.color.bg.repeatable, '#FF7A30');
  assert.equal(tokens.color.text.secondary, '#FFFFFFB2');
  assert.equal(tokens.dimensions.spacing.md, 16);
  assert.equal(tokens.dimensions.size.touch, 44);
  assert.equal(tokens.workflow.repeatable.theme.background, '#F7F3EE');
  assert.equal(tokens.workflow.astro.theme.background, '#03050F');
  assert.equal(tokens.workflow.editor.theme.accent, '#8B5CF6');
  assert.equal(tokens.workflow.repeatable.capture.foreground, '#FFFFFF');
});

test('rejects a missing alias rather than silently emitting an invalid token', () => {
  const broken = structuredClone(snapshot);
  broken.collections.Color.tokens['color/bg/canvas'].values.Default = {$alias: 'Primitives/not-found'};
  assert.throws(() => buildDesignTokens(broken), /Missing alias target/);
});

test('rejects a cyclic alias', () => {
  const broken = structuredClone(snapshot);
  broken.collections.Primitives.tokens['night/950'].values.Value = {$alias: 'Primitives/night/900'};
  broken.collections.Primitives.tokens['night/900'].values.Value = {$alias: 'Primitives/night/950'};
  assert.throws(() => buildDesignTokens(broken), /Alias cycle/);
});

test('generated TypeScript matches the source snapshot', () => {
  const generated = fs.readFileSync(path.join(root, 'src/design-system/tokens/generated.ts'), 'utf8');
  assert.equal(generated, renderTypeScript(snapshot));
});
