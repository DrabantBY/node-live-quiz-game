import type { IncomingMessage } from 'node:http';
import { RAW_DATA_TYPE } from '@const';
import { wsMap } from '@db';
import { parseRawData } from '@utils';
import type { WebSocket } from 'ws';




export const dispatch = (ws: WebSocket, req: IncomingMessage) => {
	const key = req.headers['sec-websocket-key'];
	if (!key) return;
  wsMap[key] = ws;


  ws.on('message', (rawData) => {
   const {type, data, id} = parseRawData(rawData);

    switch (type) {

      case RAW_DATA_TYPE.REG_USER:

        break;
    }

  });

};
