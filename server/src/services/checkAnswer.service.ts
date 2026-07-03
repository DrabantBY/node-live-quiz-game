import { BASE_POINTS, GAME_STATUS, MESSAGE_TYPE } from '@const';
import { gameMap, hostMap } from '@store';
import type { WSMessage } from '@types';
import { sendWsError, sendWsMessage, sendWsResults } from '@utils';
import { answerDataValidator } from '@validators';
import type { WebSocket } from 'ws';

export const checkAnswerService = (
  ws: WebSocket,
  { data }: WSMessage,
): void => {
  if (!answerDataValidator(data)) {
    sendWsError(ws, 'Invalid answer data');
    return;
  }
  const { gameId, questionIndex, answerIndex } = data;

  const game = gameMap.get(gameId);

  if (!game) {
    sendWsError(ws, 'Game not found');
    return;
  }

  if (game.status !== GAME_STATUS.PROGRESS) {
    sendWsError(ws, 'Game must be in progress');
    return;
  }

  const player = game.players.find((p) => p.ws === ws);

  if (!player) {
    sendWsError(ws, 'Player not found');
    return;
  }

  sendWsMessage(ws, MESSAGE_TYPE.ANSWER_ACCEPT, { questionIndex });

  const { timeLimitSec, correctIndex } = game.questions[questionIndex];

  player.answerTime = Date.now() - game.questionStartTime;
  player.answeredCorrectly = answerIndex === correctIndex;
  player.hasAnswered = true;
  player.pointsEarned = player.answeredCorrectly
    ? Math.round(BASE_POINTS * (1 - player.answerTime / (timeLimitSec * 1000)))
    : 0;

  player.score += player.pointsEarned;

  if (game.players.every(({ hasAnswered }) => hasAnswered)) {
    if (game.questionTimer) {
      clearTimeout(game.questionTimer);
      game.questionTimer = null;
    }

    const hostWs = hostMap.get(game.hostId);

    if (!hostWs) {
      sendWsError(ws, 'Host connection not found. Start new game.');
      return;
    }

    sendWsResults(hostWs, game, questionIndex, correctIndex);
  }
};
