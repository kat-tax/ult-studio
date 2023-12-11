// @ts-ignore No types
import {constrainedEditor} from 'constrained-editor-plugin';
import {AutoTypings, LocalStorageCache} from 'monaco-editor-auto-typings/custom-editor';
import {emit} from '@create-figma-plugin/utilities';
import {F2RN_EDITOR_NS} from 'config/env';

import schema from './schemas/settings.json';
import types from './types';

import type * as monaco from 'monaco-editor';
import type {Settings} from 'types/settings';
import type {EventFocusNode} from 'types/events';
import type {ComponentLinks} from 'types/component';

const sourceCache = new LocalStorageCache();

export type Editor = monaco.editor.IStandaloneCodeEditor;
export type Monaco = typeof monaco;

export function initComponentEditor(
  editor: Editor,
  monaco: Monaco,
  onTriggerGPT: () => void,
) {
  // Automatically import package types
  AutoTypings.create(editor, {
    monaco,
    sourceCache,
    shareCache: true,
    preloadPackages: true,
    fileRootPath: F2RN_EDITOR_NS,
    versions: {
      '@types/react': '17.0.2',
      '@types/react-native': '0.72.6',
      'react-native-svg': '13.14.0',
    },
  });

  // Setup constrained editor to limit user input
  const constraint = constrainedEditor(monaco);
  constraint.initializeIn(editor);

  // Setup custom commands
  editor.addAction({
    id: 'f2rn-gpt',
    label: 'Patch with GPT-4',
    contextMenuGroupId: '1_modification',
    contextMenuOrder: 99,
    precondition: null,
    keybindingContext: null,
    keybindings: [
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG,
    ],
    run: () => {
      onTriggerGPT();
    },
  });

  return constraint;
}

export function initTypescript(monaco: Monaco, settings: Settings) {
  const ts = monaco.languages.typescript.typescriptDefaults;
  ts?.setInlayHintsOptions(settings.monaco.inlayHints);
  ts?.setDiagnosticsOptions(settings.monaco.diagnostics);
  ts?.setCompilerOptions({
    ...settings.monaco.compiler,
    jsx: monaco.languages.typescript.JsxEmit.ReactNative,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    target: monaco.languages.typescript.ScriptTarget.ESNext,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    paths: {
      ['components/*']: [`${F2RN_EDITOR_NS}*`],
    }
  });

  const libs = Object.keys(types);
  libs.forEach((key) => {
    monaco.editor.createModel(
      types[key],
      'typescript',
      monaco.Uri.parse(key),
    );
  });
  ts?.setExtraLibs(libs.map((key) => ({
    filePath: key,
    content: types[key],
  })));
}

export function initFileOpener(monaco: Monaco, links?: ComponentLinks) {
  return monaco.editor.registerEditorOpener({
    openCodeEditor(_source, resource, _selectionOrPosition) {
      const base = `${resource.scheme}://${resource.authority}/`;
      if (base === F2RN_EDITOR_NS) {
        const name = resource.path.match(/\/([^\/]+)\.[^.]+$/)?.[1];
        const link = links?.[name];
        console.debug('[open file]', resource, name, links, link);
        if (link) {
          emit<EventFocusNode>('FOCUS', link);
        }
      }
      return false;
    }
  }).dispose;
}

export function initSettingsSchema(monaco: Monaco) {
  const json = monaco.languages.json.jsonDefaults;
  json?.setDiagnosticsOptions({
    validate: true,
    schemas: [{
      schema,
      uri: 'http://fig.run/schema-settings.json',
      fileMatch: [
        monaco?.Uri.parse(`${F2RN_EDITOR_NS}settings.json`).toString(),
      ],
    }],
  });
}