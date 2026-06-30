import { randomUUID } from 'node:crypto';
import { users, websockets } from '@store';
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

  let isUserExists: boolean = false;
  let userIndex: string | null = null;

  for (const user of users.values()) {
    if (user.name === name) {
      isUserExists = !isUserExists;
      userIndex = user.index;
      break;
    }
  }

  if (!isUserExists) {
    const index = randomUUID();
    users.set(index, { index, name, password });
    websockets.set(ws, index);
    sendWsMessage(ws, type, { name, index, error: false, errorText: '' });
    return;
  }

  const user = users.get(userIndex ?? '');

  if (user?.password !== password) {
    sendWsRegError(ws, name, 'Invalid password. Try again.');
    return;
  }

  websockets.set(ws, user.index);

  sendWsMessage(ws, type, {
    name: user.name,
    index: user.index,
    error: false,
    errorText: '',
  });
  return;
};
