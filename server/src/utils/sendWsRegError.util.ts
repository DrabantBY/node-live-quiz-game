import { MESSAGE_TYPE } from '@const';
import { sendWsMessage } from '@utils';
import type { WebSocket } from 'ws';

export const sendWsRegError = (
  ws: WebSocket,
  name: string,
  errorText: string,
  type: string = MESSAGE_TYPE.REG_USER,
  id?: string | number,
): void => {
  sendWsMessage(ws, type, { name, index: -1, error: true, errorText }, id);
};
