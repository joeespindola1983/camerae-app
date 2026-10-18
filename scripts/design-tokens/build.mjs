#!/usr/bin/env node
/**
 * Camerae Figma variable snapshot -> typed React Native tokens.
 * No npm dependencies, network access, or Figma paid API needed.
 * Source is the checked-in snapshot exported from Figma.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(here, '../..');
const defaultSource = path.join(projectRoot, 'design-tokens/figma.snapshot.json');
const defaultTarget = path.join(projectRoot, 'src/design-system/tokens/generated.ts');

function nest(target, rawPath, value) {
  const names = rawPath.split('/');
  if (names.some(name => !name)) {
    throw new Error(`Malformed token path: ${rawPath}`);
  }
  let branch = target;
  for (const name of names.slice(0, -1)) {
    if (Object.hasOwn(branch, name) && (typeof branch[name] !== 'object' || branch[name] === null)) {
      throw new Error(`Conflicting token paths: ${rawPath}`);
    }
    branch[name] ??= {};
    branch = branch[name];
  }
  const leaf = names.at(-1);
  if (Object.hasOwn(branch, leaf)) {
    throw new Error(`Duplicate token: ${rawPath}`);
  }
  branch[leaf] = value;
}

export function buildDesignTokens(snapshot) {
  if (snapshot?.format !== 'camerae.figma.variables.v1') {
    throw new Error('Unsupported Figma token export format.');
  }
  const collections = snapshot.collections;
  if (!collections || typeof collections !== 'object') {
    throw new Error('Missing collections.');
  }
  const definitions = new Map();
  for (const [collectionName, collection] of Object.entries(collections)) {
    if (!Array.isArray(collection.modes) || !collection.modes.length || !collection.tokens) {
      throw new Error(`Invalid collection: ${collectionName}`);
    }
    for (const [name, token] of Object.entries(collection.tokens)) {
      const key = `${collectionName}/${name}`;
      if (definitions.has(key)) throw new Error(`Duplicate token: ${key}`);
      if (!['COLOR', 'FLOAT', 'STRING', 'BOOLEAN'].includes(token.type)) {
        throw new Error(`Unknown token type: ${key}`);
      }
      for (const mode of collection.modes) {
        if (!Object.hasOwn(token.values ?? {}, mode)) {
          throw new Error(`Missing value for ${key} in mode ${mode}`);
        }
      }
      definitions.set(key, {token, collection, collectionName});
    }
  }

  function resolve(key, requestedMode, visiting = []) {
    if (visiting.includes(`${key}@${requestedMode}`)) {
      throw new Error(`Alias cycle: ${[...visiting, `${key}@${requestedMode}`].join(' -> ')}`);
    }
    const def = definitions.get(key);
    if (!def) throw new Error(`Missing alias target: ${key}`);
    // Aliases spanning collections with a single mode use that mode.
    // Aliases inside multi-mode collections must reference an identical mode name.
    const mode = def.collection.modes.includes(requestedMode)
      ? requestedMode
      : def.collection.modes.length === 1
        ? def.collection.modes[0]
        : null;
    if (!mode) throw new Error(`Cannot resolve mode '${requestedMode}' for ${key}`);
    const value = def.token.values[mode];
    if (value && typeof value === 'object' && Object.hasOwn(value, '$alias')) {
      const target = definitions.get(value.$alias);
      if (target && target.token.type !== def.token.type) {
        throw new Error(`Alias type mismatch: ${key} -> ${value.$alias}`);
      }
      return resolve(value.$alias, requestedMode, [...visiting, `${key}@${requestedMode}`]);
    }
    if (def.token.type === 'COLOR' && (typeof value !== 'string' || !/^#[0-9A-Fa-f]{6}([0-9A-Fa-f]{2})?$/.test(value))) {
      throw new Error(`Invalid color: ${key} (${mode})`);
    }
    if (def.token.type === 'FLOAT' && (typeof value !== 'number' || !Number.isFinite(value))) {
      throw new Error(`Invalid dimension: ${key} (${mode})`);
    }
    if (def.token.type === 'STRING' && typeof value !== 'string') throw new Error(`Invalid string: ${key}`);
    if (def.token.type === 'BOOLEAN' && typeof value !== 'boolean') throw new Error(`Invalid boolean: ${key}`);
    return value;
  }

  const get = (collectionName, prefix = '') => {
    const output = {};
    for (const name of Object.keys(collections[collectionName]?.tokens ?? {}).sort()) {
      if (prefix && !name.startsWith(prefix)) continue;
      const cleanName = prefix ? name.slice(prefix.length) : name;
      nest(output, cleanName, resolve(`${collectionName}/${name}`, collections[collectionName].modes[0]));
    }
    return output;
  };
  const workflow = {};
  for (const mode of collections['Workflow Theme']?.modes ?? []) {
    const themed = {};
    for (const name of Object.keys(collections['Workflow Theme'].tokens).sort()) {
      nest(themed, name, resolve(`Workflow Theme/${name}`, mode));
    }
    workflow[mode.toLowerCase().replace(/\s+/g, '-')] = themed;
  }
  return {
    primitives: get('Primitives'),
    color: get('Color', 'color/'),
    dimensions: get('Dimensions'),
    workflow,
  };
}

export function renderTypeScript(snapshot) {
  const tokens = buildDesignTokens(snapshot);
  return [
    '/** AUTO-GENERATED by scripts/design-tokens/build.mjs. DO NOT EDIT. */',
    `/** Figma: https://www.figma.com/design/${snapshot.figmaFileKey}/Camerae */`,
    `export const designTokens = ${JSON.stringify(tokens, null, 2)} as const;`,
    '',
    'export type CameraeWorkflow = keyof typeof designTokens.workflow;',
    '',
  ].join('\n');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const checked = process.argv.includes('--check');
  const sourceArg = process.argv.indexOf('--source');
  const source = sourceArg === -1 ? defaultSource : path.resolve(process.argv[sourceArg + 1]);
  const snapshot = JSON.parse(fs.readFileSync(source, 'utf8'));
  const rendered = renderTypeScript(snapshot);
  if (checked) {
    if (!fs.existsSync(defaultTarget) || fs.readFileSync(defaultTarget, 'utf8') !== rendered) {
      console.error('Design tokens are out of date. Run: node scripts/design-tokens/build.mjs');
      process.exitCode = 1;
    } else {
      console.log('Design tokens match the Figma snapshot.');
    }
  } else {
    fs.mkdirSync(path.dirname(defaultTarget), {recursive: true});
    fs.writeFileSync(defaultTarget, rendered);
    console.log(`Generated ${path.relative(projectRoot, defaultTarget)}.`);
  }
}
