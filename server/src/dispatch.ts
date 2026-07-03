import { MESSAGE_TYPE } from '@const';
import {
  checkAnswerService,
  createGameService,
  disconnectWsService,
  joinGameService,
  loginService,
  startGameService,
} from '@services';

import type { WebSocket } from 'ws';

export const dispatch = (ws: WebSocket) => {
  ws.on('message', (rawData) => {
    const message = JSON.parse(`${rawData}`);

    switch (message.type) {
      case MESSAGE_TYPE.REG_USER:
        loginService(ws, message);
        break;

      case MESSAGE_TYPE.CREATE_GAME:
        createGameService(ws, message);
        break;

      case MESSAGE_TYPE.JOIN_GAME:
        joinGameService(ws, message);
        break;

      case MESSAGE_TYPE.START_GAME:
        startGameService(ws, message);
        break;

      case MESSAGE_TYPE.ANSWER:
        checkAnswerService(ws, message);
        break;
    }
  });

  ws.on('close', () => {
    console.log('WebSocket closed');
    disconnectWsService(ws);
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
    disconnectWsService(ws)
  });
};
