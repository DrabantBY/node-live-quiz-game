import type { StartGameData } from '@types';
import { objectValidator } from './object.validator';

export const startGameDataValidator = (data: unknown): data is StartGameData =>
  objectValidator<StartGameData>([['gameId', 'string']], data) &&
  data.gameId.length > 0;
