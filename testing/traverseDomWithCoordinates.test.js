import { describe, expect, jest, test } from '@jest/globals';
import { traverseDomWithCoordinates } from './pureFunctions.js';

/**
 * Builds a minimal DOM-like node compatible with traverseDomWithCoordinates.
 * @param {object} opts
 * @param {string} [opts.tagName]
 * @param {string} [opts.id]
 * @param {string} [opts.className]
 * @param {string} [opts.textContent]
 * @param {object} [opts.rect] passed to getBoundingClientRect mock
 * @param {ReturnType<createMockElement>[]} [opts.children]
 */
function createMockElement({
  tagName = 'div',
  id = '',
  className = '',
  textContent = '',
  rect = {},
  children = [],
} = {}) {
  const list = [...children];
  return {
    tagName: tagName.toUpperCase(),
    id,
    className,
    textContent,
    children: list,
    getBoundingClientRect: jest.fn(() => ({
      x: 0,
      y: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 0,
      height: 0,
      ...rect,
    })),
  };
}

describe('traverseDomWithCoordinates', () => {
  test('returns null when documentNode is undefined', () => {
    expect(traverseDomWithCoordinates(undefined)).toBeNull();
  });

  test('returns a nested description tree using mocked getBoundingClientRect', () => {
    const leaf = createMockElement({
      tagName: 'span',
      id: 'leaf',
      className: 'badge',
      textContent: '  Hello  ',
      rect: { x: 10, y: 20, width: 100, height: 24, top: 20, left: 10, right: 110, bottom: 44 },
    });
    const section = createMockElement({
      tagName: 'section',
      id: '',
      className: 'wrap',
      textContent: '',
      rect: { x: 0, y: 0, width: 200, height: 50 },
      children: [leaf],
    });
    const mockDocument = {
      documentElement: section,
    };

    const result = traverseDomWithCoordinates(mockDocument);

    expect(result).toEqual({
      tagName: 'section',
      id: null,
      className: 'wrap',
      text: '',
      coordinates: {
        x: 0,
        y: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: 200,
        height: 50,
      },
      children: [
        {
          tagName: 'span',
          id: 'leaf',
          className: 'badge',
          text: 'Hello',
          coordinates: {
            x: 10,
            y: 20,
            top: 20,
            left: 10,
            right: 110,
            bottom: 44,
            width: 100,
            height: 24,
          },
          children: [],
        },
      ],
    });
  });
});
