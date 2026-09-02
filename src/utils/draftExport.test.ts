import {
  applyKonvaObjectTransform,
  captureStageArtboard,
  templateImageSources,
  wrapLines,
} from './draftExport';

test('templateImageSources prefers the public file view and resolves relative URLs', () => {
  expect(templateImageSources({
    file: {
      id: 44,
      viewUrl: '/testfiles/abc/',
      cachedViewUrl: 'https://cdn.example/template.png',
    },
  }, 'http://127.0.0.1:5000/v6/')).toEqual([
    'http://127.0.0.1:5000/v6/public-files/44/view/',
    'http://127.0.0.1:5000/testfiles/abc/',
    'https://cdn.example/template.png',
  ]);
});

test('wrapLines keeps a short phrase on one line', () => {
  expect(wrapLines('James was here', 400, (value) => value.length * 10)).toEqual([
    'James was here',
  ]);
});

test('wrapLines breaks on word boundaries like the designer canvas', () => {
  expect(wrapLines('James was here', 80, (value) => value.length * 10)).toEqual([
    'James',
    'was here',
  ]);
});

test('applyKonvaObjectTransform uses the top-left origin like Konva', () => {
  const calls: Array<[string, number[]]> = [];
  const ctx = {
    translate: (...args: number[]) => calls.push(['translate', args]),
    rotate: (...args: number[]) => calls.push(['rotate', args]),
    scale: (...args: number[]) => calls.push(['scale', args]),
  };
  applyKonvaObjectTransform(ctx, {
    x: 40,
    y: 80,
    rotation: 90,
    scaleX: 2,
    scaleY: 1,
  });
  expect(calls[0]).toEqual(['translate', [40, 80]]);
  expect(calls[1][0]).toBe('rotate');
  expect(calls[1][1][0]).toBeCloseTo(Math.PI / 2);
  expect(calls[2]).toEqual(['scale', [2, 1]]);
});

test('captureStageArtboard crops the fitted artboard at native resolution', () => {
  const stage = {
    toDataURL: jest.fn(() => 'data:image/png;artboard'),
  };
  expect(captureStageArtboard(
    stage,
    { x: 12, y: 24, scale: 0.5 },
    { width: 2000, height: 800 },
  )).toBe('data:image/png;artboard');
  expect(stage.toDataURL).toHaveBeenCalledWith({
    mimeType: 'image/png',
    pixelRatio: 2,
    x: 12,
    y: 24,
    width: 1000,
    height: 400,
  });
});
