import * as React from 'react';
import { ContentState, convertFromRaw, EditorState } from 'draft-js';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createImagePlugin from '@draft-js-plugins/image';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import '@draft-js-plugins/text-alignment/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/static-toolbar/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css';

import createFocusPlugin from '@draft-js-plugins/focus';
import createVideoPlugin from '@draft-js-plugins/video';
import createBlockDndPlugin from '@draft-js-plugins/drag-n-drop';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';

export interface VideoPluginTheme {
  iframeContainer: string;
  iframe: string;
  invalidVideoSrc: string;
  video: string;
}

const textAlignmentPlugin = createTextAlignmentPlugin();
const blockDndPlugin = createBlockDndPlugin();
const alignmentPlugin = createAlignmentPlugin();
const focusPlugin = createFocusPlugin();

export const defaultThemeVideo: VideoPluginTheme = {
  iframeContainer: 'rte-editor-iframeContainer',
  iframe: 'rte-editor-iframe',
  invalidVideoSrc: 'rte-editor-invalidVideoSrc',
  video: 'rte-editor-video',
};

const decorator:any = composeDecorators(
  alignmentPlugin.decorator,
  blockDndPlugin.decorator,
  focusPlugin.decorator,
);

const videoDecorator:any = composeDecorators(
  alignmentPlugin.decorator,
  focusPlugin.decorator,
);

const imagePlugin = createImagePlugin({
  decorator,
});

const videoPlugin = createVideoPlugin({
  decorator: videoDecorator,
  theme: defaultThemeVideo,
});

const plugins: any = [
  focusPlugin,
  alignmentPlugin,
  blockDndPlugin,
  imagePlugin,
  textAlignmentPlugin,
  videoPlugin,
];

interface Props {
  instructions: string;
}

function VariationFieldInputInstructions( { instructions }: Props) {
  let message;
  let content;
  try {
    content = convertFromRaw(JSON.parse(instructions));
  } catch {
    if (!instructions  || instructions === '') {
      message = '';
    } else {
      message = instructions;
    }
    content = ContentState.createFromText(message);
  }
  const initialEditorState = EditorState.createWithContent(content);
  const editorRef = React.useRef<Editor>(null);
  return (
    <div className="variation-field-instructions" style={{ width: 'auto%' }}>
      <Editor
        onChange={() => null}
        ref={editorRef}
        editorState={initialEditorState}
        readOnly={true}
        plugins={plugins}
      />
    </div>
  );
}

export default VariationFieldInputInstructions;
