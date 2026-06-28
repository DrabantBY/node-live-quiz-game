import type { IncomingMessage } from 'node:http';
import { RAW_DATA_TYPE } from '@const';
import { loginService } from '@services';
import { parseRawData } from '@utils';

import type { WebSocket } from 'ws';






export const dispatch = (ws: WebSocket, req: IncomingMessage) => {
	// const key = req.headers['sec-websocket-key'];
	// if (!key) return;
 //  wsMap[key] = ws;


  ws.on('message', (rawData) => {
   const message = parseRawData(rawData);

    switch (message.type) {
      case RAW_DATA_TYPE.REG_USER:
        loginService(ws, message);
        break;
    }

  });

};
