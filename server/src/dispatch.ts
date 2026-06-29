import type { IncomingMessage } from 'node:http';
import { RAW_DATA_TYPE } from '@const';
import { gameService, loginService } from '@services';

import type { WebSocket } from 'ws';

export const dispatch = (ws: WebSocket, req: IncomingMessage) => {
  // const key = req.headers['sec-websocket-key'];
  // if (!key) return;
  //  wsMap[key] = ws;

  ws.on('message', (rawData) => {
    const message = JSON.parse(`${rawData}`);

    switch (message.type) {
      case RAW_DATA_TYPE.REG_USER:
        loginService(ws, message);
        break;

      case RAW_DATA_TYPE.CREATE_GAME:
        gameService(ws, message);
        break;
    }
  });
};
