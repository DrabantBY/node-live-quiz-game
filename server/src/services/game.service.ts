import { randomBytes, randomUUID } from 'node:crypto';
import { games } from '@store';
import type { Game, WSMessage } from '@types';
import { sendWsMessage } from '@utils';
import { createGameValidator } from '@validators';
import type { WebSocket } from 'ws';

export const gameService = (ws: WebSocket, { data, id }: WSMessage): void => {
  if (!createGameValidator(data)) {
    sendWsMessage(ws, {
      type: 'error',
      data: { message: 'Invalid create game data' },
      id,
    });

    return;
  }

  const game: Game = {
    id: randomUUID(),
    code: randomBytes(3).toString('hex').toUpperCase(),
    hostId: '',
    questions: data.questions,
    players: [],
    currentQuestion: 0,
    status: 'waiting',
    playerAnswers: new Map(),
  };

  games.set(game.code, game);

  sendWsMessage(ws, {
    type: 'game_created',
    data: { gameId: game.id, code: game.code },
    id,
  });
};
