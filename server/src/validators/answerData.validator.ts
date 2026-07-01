import type { AnswerData } from '@types';
import { objectValidator } from './object.validator';

export const answerDataValidator = (data: unknown): data is AnswerData =>
  objectValidator<AnswerData>(
    [
      ['gameId', 'string'],
      ['questionIndex', 'number'],
      ['answerIndex', 'number'],
    ],
    data,
  ) &&
  data.gameId.length > 0 &&
  Number.isInteger(data.questionIndex) &&
  data.questionIndex >= 0 &&
  Number.isInteger(data.answerIndex) &&
  data.answerIndex >= 0;
