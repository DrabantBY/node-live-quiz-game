import { GAME_STATUS, MESSAGE_TYPE } from '@const';
import { codesMap, gameWsMap, socketsMap, usersMap } from '@store';
import type { Player, WSMessage } from '@types';
import { sendWsError, sendWsMessage } from '@utils';
import { joinGameDataValidator } from '@validators';
import type { WebSocket } from 'ws';

interface WsJoinParams {
  sockets: WebSocket[];
  players: Player[];
}

export const joinGameService = (ws: WebSocket, { data }: WSMessage): void => {
  if (!joinGameDataValidator(data)) {
    sendWsError(ws, 'Invalid code');
    return;
  }

  const user = usersMap.get(socketsMap.get(ws) ?? '');

  if (!user) {
    sendWsError(ws, 'User not found');
    return;
  }

  const game = codesMap.get(data.code);

  if (!game) {
    sendWsError(ws, 'Game not found');
    return;
  }

  if (game.status !== GAME_STATUS.WAITING) {
    sendWsError(ws, 'Game has already started');
    return;
  }

  if (game.hostId === user.index) {
    sendWsError(ws, 'User is the host');
    return;
  }

  if (game.players.some(({ index }) => index === user.index)) {
    sendWsError(ws, 'Player already joined');
    return;
  }

  const hostWs = gameWsMap.get(game.id);

  if (!hostWs) {
    sendWsError(ws, 'Host connection not found');
    return;
  }

  game.players.push({
    name: user.name,
    index: user.index,
    score: 0,
    pointsEarned: 0,
    ws,
  });

  const { sockets, players } = game.players.reduce<WsJoinParams>(
    (acc, { ws, ...player }) => {
      if (ws) {
        acc.sockets.push(ws);
      }
      acc.players.push(player);
      return acc;
    },
    {
      sockets: [hostWs],
      players: [],
    },
  );

  sendWsMessage(ws, MESSAGE_TYPE.GAME_JOINED, { gameId: game.id });

  for (const socket of sockets) {
    sendWsMessage(socket, MESSAGE_TYPE.PLAYER_JOINED, {
      playerName: user.name,
      playerCount: players.length,
    });

    sendWsMessage(socket, MESSAGE_TYPE.UPDATE_PLAYER, players);
  }
};
