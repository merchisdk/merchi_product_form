import { dropzoneAccept } from '../utils/dropzoneAccept';

test('dropzoneAccept turns an extension list into mime groups', () => {
  expect(dropzoneAccept('.jpg,.jpeg,.png,.pdf,.ai,.eps')).toEqual({
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
    'application/postscript': ['.ai', '.eps'],
  });
});
