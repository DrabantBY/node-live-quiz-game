import type { IncomingMessage } from 'node:http';
import { MESSAGE_TYPE } from '@const';
import { createGameService, joinGameService, loginService } from '@services';

import type { WebSocket } from 'ws';

export const dispatch = (ws: WebSocket, req: IncomingMessage) => {
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
    }
  });
};
