import { MESSAGE_TYPE } from '@const';
import {
  connectionMap,
  gameMap,
  hostMap,
  playerMap,
  websocketMap,
} from '@store';
import { parseWsPlayers, sendWsMessage } from '@utils';
import type { WebSocket } from 'ws';

export const disconnectWsService = (ws: WebSocket): void => {
  const userId = websocketMap.get(ws);
  if (!userId) return;

  websocketMap.delete(ws);
  connectionMap.delete(userId);

  if (hostMap.has(userId)) {
    hostMap.delete(userId);
    return;
  }

  const gameId = playerMap.get(userId);
  playerMap.delete(userId);
  if (!gameId) return;

  const game = gameMap.get(gameId);
  if (!game) return;

  const hostWs = hostMap.get(game.hostId);
  if (!hostWs) return;

  game.players = game.players.filter(({ index }) => index !== userId);

  const { sockets, players } = parseWsPlayers(hostWs, game);

  for (const socket of sockets) {
    sendWsMessage(socket, MESSAGE_TYPE.UPDATE_PLAYER, players);
  }
};
