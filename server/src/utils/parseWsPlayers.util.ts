import type { Game, Player } from '@types';
import type { WebSocket } from 'ws';

interface WsJoinParams {
  sockets: WebSocket[];
  players: Player[];
}

export const parseWsPlayers = (hostWs: WebSocket, game: Game): WsJoinParams =>
  game.players.reduce<WsJoinParams>(
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
