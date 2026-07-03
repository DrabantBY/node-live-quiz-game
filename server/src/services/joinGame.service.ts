import { GAME_STATUS, MESSAGE_TYPE } from '@const';
import {
  codeMap,
  gameMap,
  hostMap,
  playerMap,
  userMap,
  websocketMap,
} from '@store';
import type { WSMessage } from '@types';
import { parseWsPlayers, sendWsError, sendWsMessage } from '@utils';
import { joinGameDataValidator } from '@validators';
import type { WebSocket } from 'ws';

export const joinGameService = (ws: WebSocket, { data }: WSMessage): void => {
  if (!joinGameDataValidator(data)) {
    sendWsError(ws, 'Invalid code');
    return;
  }

  const user = userMap.get(websocketMap.get(ws) ?? '');

  if (!user) {
    sendWsError(ws, 'User not found');
    return;
  }

  const game = gameMap.get(codeMap.get(data.code) ?? '');

  if (!game) {
    sendWsError(ws, 'Game not found');
    return;
  }

  if (game.status !== GAME_STATUS.WAITING) {
    sendWsError(ws, 'Game has already started');
    return;
  }

  const hostWs = hostMap.get(game.hostId);

  if (!hostWs) {
    sendWsError(ws, 'Host connection not found. Start new game.');
    return;
  }

  game.players.push({
    name: user.name,
    index: user.index,
    score: 0,
    pointsEarned: 0,
    ws,
  });

  playerMap.set(user.index, game.id);

  const { sockets, players } = parseWsPlayers(hostWs, game);

  sendWsMessage(ws, MESSAGE_TYPE.GAME_JOINED, { gameId: game.id });

  for (const socket of sockets) {
    sendWsMessage(socket, MESSAGE_TYPE.PLAYER_JOINED, {
      playerName: user.name,
      playerCount: players.length,
    });

    sendWsMessage(socket, MESSAGE_TYPE.UPDATE_PLAYER, players);
  }
};
