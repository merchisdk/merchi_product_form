import {
  collectDesignerInputs,
  packDesignInputNotes,
} from './designerInputs';
import { DraftTemplateData } from './types';

const groupedProduct = { groupVariationFields: [{ id: 9 }] };
const plainProduct = { groupVariationFields: [] };

function drafts(): DraftTemplateData[] {
  return [{
    groupIndex: 0,
    productId: 4,
    previews: [],
    templateData: [{
      templateId: 1,
      draft: 'draft',
      canvasPreview: 'preview',
      canvasJson: {
        width: 100,
        height: 100,
        objects: [
          {
            id: 'linked',
            type: 'text',
            merchiFieldId: 9,
            text: 'From the form',
            x: 0, y: 0, width: 10, height: 10, rotation: 0, scaleX: 1, scaleY: 1,
          },
          {
            id: 'added',
            type: 'text',
            text: 'Team night',
            fill: '#112233',
            fontSize: 56,
            fontFamily: 'Oswald',
            align: 'center',
            x: 12, y: 20, width: 240, height: 64, rotation: 0, scaleX: 1, scaleY: 1,
          },
          {
            id: 'logo',
            type: 'image',
            src: 'data:image/png;base64,aaa',
            x: 0, y: 0, width: 10, height: 10, rotation: 0, scaleX: 1, scaleY: 1,
          },
          {
            id: 'fill',
            type: 'rect',
            fill: '#111111',
            x: 0, y: 0, width: 10, height: 10, rotation: 0, scaleX: 1, scaleY: 1,
          },
        ],
      },
    }],
  }];
}

test('collectDesignerInputs keeps only text and images the customer added', () => {
  expect(collectDesignerInputs(plainProduct, drafts())).toEqual([
    {
      kind: 'text',
      name: 'Team night',
      value: 'Team night',
      textStyle: {
        colour: '#112233',
        textSize: 56,
        font: 'Oswald',
        align: 'center',
        x: 12,
        y: 20,
        width: 240,
        height: 64,
        rotation: 0,
        scaleX: 1,
        scaleY: 1,
      },
    },
    { kind: 'file', name: 'Custom image', src: 'data:image/png;base64,aaa' },
  ]);
});

test('collectDesignerInputs drops extra text and images when the product disallows them', () => {
  expect(collectDesignerInputs(
    { ...plainProduct, allowAdditionalDesignObjects: false },
    drafts(),
  )).toEqual([]);
});

test('collectDesignerInputs records the variation group when the product has groups', () => {
  const [text] = collectDesignerInputs(groupedProduct, drafts());
  expect(text.groupIndex).toBe(0);
});

test('packDesignInputNotes hides the checkout payload in the cart marker', () => {
  const notes = packDesignInputNotes([
    {
      kind: 'text',
      name: 'Team night',
      value: 'Team night',
      textStyle: {
        colour: '#112233',
        textSize: 56,
        font: 'Oswald',
        align: 'center',
      },
    },
    { kind: 'file', name: 'Custom image', file: { id: 'file-1' } },
  ]);
  expect(notes?.startsWith('[[client-design-inputs:')).toBe(true);
  expect(notes?.includes('data:image')).toBe(false);
  const encoded = notes!.slice('[[client-design-inputs:'.length, -2);
  const parsed = JSON.parse(new TextDecoder().decode(
    Uint8Array.from(atob(encoded), (char) => char.charCodeAt(0)),
  ));
  expect(parsed).toEqual([
    {
      kind: 'text',
      name: 'Team night',
      value: 'Team night',
      textStyle: {
        colour: '#112233',
        textSize: 56,
        font: 'Oswald',
        align: 'center',
      },
    },
    { kind: 'file', name: 'Custom image', file: { id: 'file-1' } },
  ]);
});
