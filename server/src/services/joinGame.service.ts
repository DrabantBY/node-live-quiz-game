import { MESSAGE_TYPE } from '@const';
import { games, users, websockets } from '@store';
import type { Player, WSMessage } from '@types';
import { sendWsError, sendWsMessage } from '@utils';
import { joinGameDataValidator } from '@validators';
import type { WebSocket } from 'ws';

export const joinGameService = (ws: WebSocket, { data }: WSMessage): void => {
  if (!joinGameDataValidator(data)) {
    sendWsError(ws, 'Invalid code');
    return;
  }

  const game = games.get(data.code);

  if (!game) {
    sendWsError(ws, 'Invalid code');
    return;
  }

  const user = users.get(websockets.get(ws) ?? '');

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

  const player: Player = {
    name: user.name,
    index: user.index,
    score: 0,
    ws,
  };

  game.players.push(player);

  sendWsMessage(ws, MESSAGE_TYPE.GAME_JOINED, { gameId: game.id });

  for (const { ws } of game.players) {
    if (ws) {
      sendWsMessage(ws, MESSAGE_TYPE.PLAYER_JOINED, {
        playerName: player.name,
        playerCount: game.players.length,
      });
    }
  }
};
