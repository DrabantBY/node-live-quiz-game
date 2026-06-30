import { WebSocket } from 'ws';

export const sendWsMessage = (
  ws: WebSocket,
  type: string,
  data: unknown,
  id: number | string = 0,
): void => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, data, id }));
  }
};
