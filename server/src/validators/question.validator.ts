import type { Question } from '@types';
import { objectValidator } from '@validators';

export const questionValidator = (data: unknown): data is Question =>
  objectValidator<Question>(
    [
      ['text', 'string'],
      ['options', 'object'],
      ['correctIndex', 'number'],
      ['timeLimitSec', 'number'],
    ],
    data,
  ) &&
  Array.isArray(data.options) &&
  data.options.length === 4 &&
  data.options.every((option) => typeof option === 'string');
