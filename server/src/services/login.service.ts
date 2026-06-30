import { randomUUID } from 'node:crypto';
import { socketsMap, usersMap } from '@store';
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

  for (const user of usersMap.values()) {
    if (user.name === name) {
      isUserExists = !isUserExists;
      userIndex = user.index;
      break;
    }
  }

  if (!isUserExists) {
    const index = randomUUID();
    usersMap.set(index, { index, name, password });
    socketsMap.set(ws, index);
    sendWsMessage(ws, type, { name, index, error: false, errorText: '' });
    return;
  }

  const user = usersMap.get(userIndex ?? '');

  if (user?.password !== password) {
    sendWsRegError(ws, name, 'Invalid password. Try again.');
    return;
  }

  socketsMap.set(ws, user.index);

  sendWsMessage(ws, type, {
    name: user.name,
    index: user.index,
    error: false,
    errorText: '',
  });
  return;
};
