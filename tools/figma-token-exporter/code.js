/* global figma, __html__ */

/* Camerae Design Tokens - local development plugin.
 * Uses Figma Plugin API only; no internet requests or paid REST API.
 */

figma.showUI(__html__, {width: 440, height: 340, title: 'Camerae Token Exporter'});

figma.ui.onmessage = async message => {
  if (message?.type === 'CLOSE') {
    figma.closePlugin();
    return;
  }
  if (message?.type !== 'EXPORT') return;
  try {
    const collections = await figma.variables.getLocalVariableCollectionsAsync();
    const variables = await figma.variables.getLocalVariablesAsync();
    const byId = new Map(variables.map(variable => [variable.id, variable]));
    const collectionById = new Map(collections.map(collection => [collection.id, collection]));

    function serializeValue(value, type) {
      if (value?.type === 'VARIABLE_ALIAS') {
        const target = byId.get(value.id);
        const parent = target && collectionById.get(target.variableCollectionId);
        if (!target || !parent) {
          throw new Error(`Unresolved Figma variable alias: ${value.id}`);
        }
        return {$alias: `${parent.name}/${target.name}`};
      }
      if (type === 'COLOR' && value) {
        const channel = n => Math.round(n * 255).toString(16).padStart(2, '0').toUpperCase();
        return `#${channel(value.r)}${channel(value.g)}${channel(value.b)}${value.a === 1 ? '' : channel(value.a)}`;
      }
      return value;
    }

    const snapshot = {
      format: 'camerae.figma.variables.v1',
      figmaFileKey: figma.fileKey || '',
      collections: {},
    };

    for (const collection of collections) {
      const modes = collection.modes.map(mode => mode.name);
      const tokens = {};
      for (const variable of variables.filter(v => v.variableCollectionId === collection.id)) {
        const values = {};
        for (const mode of collection.modes) {
          values[mode.name] = serializeValue(variable.valuesByMode[mode.modeId], variable.resolvedType);
        }
        tokens[variable.name] = {
          type: variable.resolvedType,
          values,
          scopes: Array.from(variable.scopes),
        };
      }
      snapshot.collections[collection.name] = {modes, tokens};
    }
    figma.ui.postMessage({type: 'DONE', payload: snapshot});
  } catch (error) {
    figma.ui.postMessage({type: 'ERROR', message: String(error)});
  }
};
