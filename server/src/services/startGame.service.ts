import { MESSAGE_TYPE } from '@const';
import { gamesMap, gameWsMap } from '@store';
import type { WSMessage } from '@types';
import { getQuestionData, sendWsError, sendWsMessage } from '@utils';
import { startGameDataValidator } from '@validators';
import type { WebSocket } from 'ws';

export const startGameService = (ws: WebSocket, { data }: WSMessage) => {
  if (!startGameDataValidator(data)) {
    sendWsError(ws, 'Invalid gameId');
    return;
  }

  const game = gamesMap.get(data.gameId);
  const gameWs = gameWsMap.get(data.gameId);

  if (!game) {
    sendWsError(ws, 'Game not found');
    return;
  }

  if (!gameWs) {
    sendWsError(ws, 'Websocket not found');
    return;
  }

  const questionData = getQuestionData(game);

  sendWsMessage(gameWs, MESSAGE_TYPE.QUESTION, questionData);

  for (const { ws } of game.players) {
    if (ws) {
      sendWsMessage(ws, MESSAGE_TYPE.QUESTION, questionData);
    }
  }
};
