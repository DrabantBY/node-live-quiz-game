import type { CreateGameData } from '@types';
import { objectValidator, questionValidator } from '@validators';

export const createGameValidator = (data: unknown): data is CreateGameData =>
  objectValidator<CreateGameData>([['questions', 'object']], data) &&
  Array.isArray(data.questions) &&
  data.questions.length > 0 &&
  data.questions.every(questionValidator);
