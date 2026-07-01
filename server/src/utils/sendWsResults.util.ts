import { MESSAGE_TYPE } from '@const';
import type { Game } from '@types';
import { sendWsMessage } from '@utils';
import type { WebSocket } from 'ws';

interface WsResultParams {
  websockets: WebSocket[];
  playerResults: Array<{
    name: string;
    answered: boolean;
    correct: boolean;
    pointsEarned: number;
    totalScore: number;
  }>;
}

export const sendWsResults = (
  hostWs: WebSocket,
  game: Game,
  questionIndex: number,
  correctIndex: number,
) => {
  const { websockets, playerResults } = game.players.reduce<WsResultParams>(
    (
      acc,
      { ws, name, hasAnswered, answeredCorrectly, pointsEarned, score },
    ) => {
      if (ws) {
        acc.websockets.push(ws);
      }

      acc.playerResults.push({
        name,
        answered: hasAnswered ?? false,
        correct: answeredCorrectly ?? false,
        pointsEarned,
        totalScore: score,
      });
      return acc;
    },
    {
      websockets: [hostWs],
      playerResults: [],
    },
  );

  for (const websocket of websockets) {
    sendWsMessage(websocket, MESSAGE_TYPE.RESULT, {
      questionIndex,
      correctIndex,
      playerResults,
    });
  }
};
