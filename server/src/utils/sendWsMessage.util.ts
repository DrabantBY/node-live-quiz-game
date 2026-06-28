import type { WSMessage } from '@types';
import  { WebSocket } from 'ws';

export const sendWsMessage = (ws: WebSocket, message: WSMessage) => {
	if (ws.readyState === WebSocket.OPEN) {
		ws.send(JSON.stringify(message));
	}
}
