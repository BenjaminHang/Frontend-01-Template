import assert from 'assert';

import { add } from '../src/test.example.js';

it('add test', () => {
  assert(add(1, 2), 3);
});
