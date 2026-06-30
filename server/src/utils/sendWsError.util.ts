import { sendWsMessage } from '@utils';
import type { WebSocket } from 'ws';

export const sendWsError = (
  ws: WebSocket,
  message: string,
  id?: number | string,
): void => {
  sendWsMessage(ws, 'error', { message }, id);
};
