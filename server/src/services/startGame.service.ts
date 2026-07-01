import { GAME_STATUS } from '@const';
import { gamesMap } from '@store';
import type { WSMessage } from '@types';
import { sendWsError, sendWsQuestions } from '@utils';
import { startGameDataValidator } from '@validators';
import type { WebSocket } from 'ws';

export const startGameService = (hostWs: WebSocket, { data }: WSMessage) => {
  if (!startGameDataValidator(data)) {
    sendWsError(hostWs, 'Invalid gameId');
    return;
  }

  const game = gamesMap.get(data.gameId);

  if (!game) {
    sendWsError(hostWs, 'Game not found');
    return;
  }

  game.status = GAME_STATUS.PROGRESS;

  sendWsQuestions(hostWs, game);
};
