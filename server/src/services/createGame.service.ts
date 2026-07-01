import { randomBytes, randomUUID } from 'node:crypto';
import { GAME_STATUS, MESSAGE_TYPE } from '@const';
import { codesMap, gamesMap, gameWsMap, socketsMap } from '@store';
import type { Game, WSMessage } from '@types';
import { sendWsError, sendWsMessage } from '@utils';
import { createGameValidator } from '@validators';
import type { WebSocket } from 'ws';

export const createGameService = (ws: WebSocket, { data }: WSMessage): void => {
  if (!createGameValidator(data)) {
    sendWsError(ws, 'Invalid create game data');
    return;
  }

  const userId = socketsMap.get(ws);

  if (!userId) {
    sendWsError(ws, 'User not found');
    return;
  }

  const game: Game = {
    id: randomUUID(),
    code: randomBytes(3).toString('hex').toUpperCase(),
    hostId: userId,
    questions: data.questions,
    players: [],
    currentQuestion: 0,
    status: GAME_STATUS.WAITING,
    questionStartTime: 0,
    questionTimer: null,
  };

  gamesMap.set(game.id, game);
  codesMap.set(game.code, game);
  gameWsMap.set(game.id, ws);

  sendWsMessage(ws, MESSAGE_TYPE.GAME_CREATED, {
    gameId: game.id,
    code: game.code,
  });
};
