import { afterEach, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { pulseNode } from './pureFunctions.js';

function installDocumentMock() {
  const appended = [];

  const body = {
    appendChild: jest.fn((circle) => {
      circle.parentNode = body;
      appended.push(circle);
    }),
    removeChild: jest.fn((circle) => {
      if (circle.parentNode === body) {
        circle.parentNode = null;
      }
    }),
  };

  global.document = {
    createElement: jest.fn(() => ({
      classList: { add: jest.fn() },
      style: {
        left: '',
        top: '',
        setProperty: jest.fn(),
      },
      parentNode: null,
      addEventListener: jest.fn(),
    })),
    body,
  };

  return { appended, body };
}

describe('pulseNods', () => {
  let prevDocument;

  beforeEach(() => {
    prevDocument = global.document;
    jest.useFakeTimers();
  });

  afterEach(() => {
    global.document = prevDocument;
    jest.useRealTimers();
  });

 

  test('fires pulses at 100ms, 400ms, and 700ms offsets', () => {
    installDocumentMock();
    pulseNode({ x: 0, y: 0, width: 10, height: 20 });

    jest.advanceTimersByTime(99);
    expect(global.document.createElement).toHaveBeenCalledTimes(0);

    jest.advanceTimersByTime(1);
    expect(global.document.createElement).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(300);
    expect(global.document.createElement).toHaveBeenCalledTimes(2);

    jest.advanceTimersByTime(300);
    expect(global.document.createElement).toHaveBeenCalledTimes(3);
  });

  test('center uses x + width/2 and y + height/2', () => {
    const { appended } = installDocumentMock();
    pulseNode({ x: 12, y: 8, width: 6, height: 4 });
    jest.runAllTimers();
    expect(appended[0].style.left).toBe('15px');
    expect(appended[0].style.top).toBe('10px');
  });
});
