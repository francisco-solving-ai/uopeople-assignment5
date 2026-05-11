import { buildRagPrompt } from './pureFunctions.js';

test('When no files are provided, buildRagPrompt should contain: No documents were attached.', () => {
  expect(buildRagPrompt([])).toContain("(No documents were attached.)");
});
test('When files are provided, buildRagPrompt should contain the files', () => {
  expect(buildRagPrompt([{ name: 'file1.txt', content: 'content1' }])).toContain("content1");
});