import * as React from 'react';
import { ContentState, convertFromRaw, EditorState } from 'draft-js';
import createAlignmentPlugin from '@draft-js-plugins/alignment';
import createImagePlugin from '@draft-js-plugins/image';
import Editor, { composeDecorators } from '@draft-js-plugins/editor';
import '@draft-js-plugins/text-alignment/lib/plugin.css';
import 'draft-js/dist/Draft.css';
import '@draft-js-plugins/image/lib/plugin.css';
import '@draft-js-plugins/alignment/lib/plugin.css';

import createFocusPlugin from '@draft-js-plugins/focus';
import createTextAlignmentPlugin from '@draft-js-plugins/text-alignment';

const textAlignmentPlugin = createTextAlignmentPlugin();
const alignmentPlugin = createAlignmentPlugin();
const focusPlugin = createFocusPlugin();

const decorator: any = composeDecorators(
  alignmentPlugin.decorator,
  focusPlugin.decorator,
);

const imagePlugin = createImagePlugin({
  decorator,
});

/** Read-only instructions — no video/dnd plugins (those inject iframes that
 * break positioning inside modals when the editor remounts on quote updates). */
const plugins: any = [
  focusPlugin,
  alignmentPlugin,
  imagePlugin,
  textAlignmentPlugin,
];

interface Props {
  instructions: string;
}

function buildEditorState(instructions: string) {
  try {
    return EditorState.createWithContent(
      convertFromRaw(JSON.parse(instructions))
    );
  } catch {
    const message = !instructions || instructions === '' ? '' : instructions;
    return EditorState.createWithContent(ContentState.createFromText(message));
  }
}

function VariationFieldInputInstructions({ instructions }: Props) {
  const editorState = React.useMemo(
    () => buildEditorState(instructions),
    [instructions]
  );

  return (
    <div className='variation-field-instructions'>
      <Editor
        onChange={() => null}
        editorState={editorState}
        readOnly={true}
        plugins={plugins}
      />
    </div>
  );
}

export default VariationFieldInputInstructions;
