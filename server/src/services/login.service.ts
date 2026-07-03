import { randomUUID } from 'node:crypto';
import { connectionMap, loginMap, userMap, websocketMap } from '@store';
import type { WSMessage } from '@types';
import { sendWsMessage, sendWsRegError } from '@utils';
import { regDataValidator } from '@validators';
import type { WebSocket } from 'ws';

export const loginService = (
  ws: WebSocket,
  { data, type }: WSMessage,
): void => {
  if (!regDataValidator(data)) {
    sendWsRegError(ws, '', 'Invalid data');
    return;
  }

  const { name, password } = data;

  const userId = loginMap.get(name);

  if (!userId) {
    const index = randomUUID();
    userMap.set(index, { index, name, password });
    websocketMap.set(ws, index);
    loginMap.set(name, index);
    connectionMap.set(index, ws);
    sendWsMessage(ws, type, { name, index, error: false, errorText: '' });
    return;
  }

  if (connectionMap.has(userId)) {
    sendWsRegError(ws, name, 'User already logged in.');
    return;
  }

  const user = userMap.get(userId);

  if (user?.password !== password) {
    sendWsRegError(ws, name, 'Invalid password. Try again.');
    return;
  }

  websocketMap.set(ws, user.index);
  connectionMap.set(user.index, ws);

  sendWsMessage(ws, type, {
    name: user.name,
    index: user.index,
    error: false,
    errorText: '',
  });
  return;
};
