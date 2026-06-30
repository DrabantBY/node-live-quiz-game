import { MESSAGE_TYPE } from '@const';
import { codesMap, gameWsMap, socketsMap, usersMap } from '@store';
import type { Player, WSMessage } from '@types';
import { sendWsError, sendWsMessage } from '@utils';
import { joinGameDataValidator } from '@validators';
import type { WebSocket } from 'ws';

interface SendMap {
  sockets: WebSocket[];
  players: Player[];
}

export const joinGameService = (ws: WebSocket, { data }: WSMessage): void => {
  if (!joinGameDataValidator(data)) {
    sendWsError(ws, 'Invalid code');
    return;
  }

  const game = codesMap.get(data.code);

  if (!game) {
    sendWsError(ws, 'Game not found');
    return;
  }

  const gameWs = gameWsMap.get(game.id);

  if (!gameWs) {
    sendWsError(ws, 'Websocket not found');
    return;
  }

  const user = usersMap.get(socketsMap.get(ws) ?? '');

  if (!user) {
    sendWsError(ws, 'User not found');
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

  game.players.push({
    name: user.name,
    index: user.index,
    score: 0,
    ws,
  });

  const sendMap = game.players.reduce<SendMap>(
    (acc, { ws, ...player }) => {
      acc.sockets.push(ws as WebSocket);
      acc.players.push(player as Player);
      return acc;
    },
    {
      sockets: [gameWs],
      players: [],
    },
  );

  sendWsMessage(ws, MESSAGE_TYPE.GAME_JOINED, { gameId: game.id });

  for (const socket of sendMap.sockets) {
    sendWsMessage(socket, MESSAGE_TYPE.PLAYER_JOINED, {
      playerName: user.name,
      playerCount: sendMap.players.length,
    });

    sendWsMessage(socket, MESSAGE_TYPE.UPDATE_PLAYER, sendMap.players);
  }
};
