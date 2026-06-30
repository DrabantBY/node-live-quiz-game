import { randomBytes, randomUUID } from 'node:crypto';
import { MESSAGE_TYPE } from '@const';
import { games, websockets } from '@store';
import type { Game, WSMessage } from '@types';
import { sendWsError, sendWsMessage } from '@utils';
import { createGameValidator } from '@validators';
import type { WebSocket } from 'ws';

export const createGameService = (ws: WebSocket, { data }: WSMessage): void => {
  if (!createGameValidator(data)) {
    sendWsError(ws, 'Invalid create game data');
    return;
  }

  const userId = websockets.get(ws);

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
    status: 'waiting',
    playerAnswers: new Map(),
  };

  games.set(game.code, game);

  sendWsMessage(ws, MESSAGE_TYPE.GAME_CREATED, {
    gameId: game.id,
    code: game.code,
  });
};
