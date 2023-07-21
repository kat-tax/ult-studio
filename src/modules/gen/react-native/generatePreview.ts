import CodeBlockWriter from 'code-block-writer';
import parseFigma from 'modules/fig/parse';

import {generateTheme} from './generateTheme';
import {writeStyleSheet} from './lib/writeStyleSheet';
import {writeFunction} from './lib/writeFunction';
import {writeImports} from './lib/writeImports';

import type {TargetNode, ParseData} from 'types/figma';
import type {Settings} from 'types/settings';

export async function generatePreview(data: ParseData, settings: Settings) {
  const writer = new CodeBlockWriter(settings?.writer);
  const primitives = new Set(['Text', 'Image']);
  data.meta.primitives = primitives;
  writeImports(writer, data, settings, true);
  writer.blankLine();
  writer.write(generateTheme(settings));
  writer.blankLine();
  writeFunction(writer, data, settings, 'styles', true);
  writer.blankLine();
  writeStyleSheet(writer, data, settings, 'styles', true);
  writer.blankLine();
  await writeDependencies(writer, settings, {...data.meta.components, ...data.meta.includes});
  writer.blankLine();
  return writer.toString();
}

async function writeDependencies(
  writer: CodeBlockWriter,
  settings: Settings,
  nodes?: Record<string, BaseNode>, 
  index?: Set<BaseNode>,
) {
  index = index || new Set<BaseNode>();
  for await (const [id, node] of Object.entries(nodes)) {
    const stylesPrefix = '_' + id.split(':').join('_');
    const content = (node as ComponentSetNode).defaultVariant ?? node;
    if (index.has(content)) continue;
    index.add(content);
    const data = await parseFigma(content as TargetNode, settings, true);
    writeFunction(writer, data, settings, stylesPrefix, true);
    writer.blankLine();
    writeStyleSheet(writer, data, settings, stylesPrefix, true);
    writer.blankLine();
    writeDependencies(writer, settings, data.meta.components, index);
  }
}