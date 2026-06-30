import type { JoinGameData } from '@types';
import { objectValidator } from '@validators';

export const joinGameDataValidator = (data: unknown): data is JoinGameData =>
  objectValidator<JoinGameData>([['code', 'string']], data) &&
  /^[A-Z\d]{6}$/.test(data.code);
