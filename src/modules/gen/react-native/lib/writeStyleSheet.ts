import CodeBlockWriter from 'code-block-writer';
import {createIdentifierCamel} from 'common/string';

import type {ParseData} from 'types/figma';
import type {Settings} from 'types/settings';

export function writeStyleSheet(
  writer: CodeBlockWriter,
  data: ParseData,
  _settings: Settings,
  stylePrefix: string,
  isPreviewMode?: boolean,
) {
  const _writeStyleSheet = () => {
    const define = isPreviewMode ? '' : 'const ';
    writer.write(`${define}${stylePrefix} = StyleSheet.create(`).inlineBlock(() => {
      // Root styles
      writeStyle(writer, 'root', data.root.styles);
      if (data.variants.root) {
        Object.keys(data.variants.root).forEach(key => {
          const className = createIdentifierCamel(`root_${key}`.split(', ').join('_'));
          //console.log('writeStyleSheet:', className, data.variants.root[key]);
          writeStyle(writer, className, data.variants.root[key]);
        });
      }
      // Children styles
      for (const child of data.children) {
        if (child.styles) {
          writeStyle(writer, child.slug, child.styles);
          if (data.variants[child.slug]) {
            Object.keys(data.variants[child.slug]).forEach(key => {
              if (data.variants[child.slug][key]) {
                const className = createIdentifierCamel(`${child.slug}_${key}`.split(', ').join('_'));
                //console.log('writeStyleSheet:', className, data.variants[child.slug][key]);
                writeStyle(writer, className, data.variants[child.slug][key]);
              }
            });
          }
        }
      }
    });
    writer.write(');');
  };
  if (isPreviewMode) {
    writer.writeLine(`let ${stylePrefix} = {}`);
    writer.write('try ').inlineBlock(() => {
      _writeStyleSheet();
    });
    writer.write(' catch (e) ').inlineBlock(() => {
      const lines = [
        'logtail.error(e)',
        'logtail.flush()',
        'console.error("[preview] [styles]", e)',
        // 'alert("Figma -> React Native: Preview Styles Error. Check the console for details.")',
      ];
      writer.writeLine(lines.join('; '));
    });
  } else {
    _writeStyleSheet();
  }
}

export function writeStyle(writer: CodeBlockWriter, slug: string, styles: any) {
  const props = Object.keys(styles)
  if (props.length > 0) {
    writer.write(`${slug}: {`).indent(() => {
      props.forEach(prop => {
        const value = styles[prop];
        writer.write(`${prop}: `);
        if (typeof value === 'undefined') {
          writer.quote('unset');
        } else if (typeof value === 'number') {
          writer.write(value.toString());
        } else if (value.startsWith('theme.')) {
          writer.write(value);
        } else {
          writer.quote(value);
        }
        writer.write(',');
        writer.newLine();
      });
    });
    writer.writeLine('},');
  }
}