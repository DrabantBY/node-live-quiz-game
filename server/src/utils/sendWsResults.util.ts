import { GAME_STATUS, MESSAGE_TYPE, RESULT_TIME } from '@const';
import type { Game } from '@types';
import { sendWsMessage, sendWsQuestions } from '@utils';
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

  if (questionIndex === game.questions.length - 1) {
    game.status = GAME_STATUS.FINISHED;

    setTimeout(() => {
      const scoreboard = game.players
        .sort((a, b) => b.score - a.score)
        .map(({ name, score }, rank) => ({
          name,
          score,
          rank: rank + 1,
        }));

      for (const websocket of websockets) {
        sendWsMessage(websocket, MESSAGE_TYPE.GAME_FINISHED, { scoreboard });
      }
    }, RESULT_TIME);

    return;
  }

  for (const player of game.players) {
    player.hasAnswered = false;
    player.answeredCorrectly = false;
    player.pointsEarned = 0;
  }

  game.currentQuestion += 1;

  setTimeout(() => {
    sendWsQuestions(hostWs, game);
  }, RESULT_TIME);
};
