import { MESSAGE_TYPE } from '@const';
import type { Game } from '@types';
import { sendWsMessage, sendWsResults } from '@utils';
import type { WebSocket } from 'ws';

export const sendWsQuestions = (hostWs: WebSocket, game: Game): void => {
  const questionData = {
    questionNumber: game.currentQuestion + 1,
    totalQuestions: game.questions.length,
    text: game.questions[game.currentQuestion].text,
    options: game.questions[game.currentQuestion].options,
    timeLimitSec: game.questions[game.currentQuestion].timeLimitSec,
  };

  sendWsMessage(hostWs, MESSAGE_TYPE.QUESTION, questionData);

  for (const { ws } of game.players) {
    if (ws) {
      sendWsMessage(ws, MESSAGE_TYPE.QUESTION, questionData);
    }
  }

  game.questionStartTime = Date.now();
  game.questionTimer = setTimeout(() => {
    sendWsResults(
      hostWs,
      game,
      game.currentQuestion,
      game.questions[game.currentQuestion].correctIndex,
    );
  }, questionData.timeLimitSec * 1000);
};
