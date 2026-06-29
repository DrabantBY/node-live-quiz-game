import { randomUUID } from 'node:crypto';
import { users } from '@store';
import type { WSMessage } from '@types';
import { sendWsMessage } from '@utils';
import { regDataValidator } from '@validators';
import type { WebSocket } from 'ws';

export const loginService = (
  ws: WebSocket,
  { data, ...rest }: WSMessage,
): void => {
  if (!regDataValidator(data)) {
    sendWsMessage(ws, {
      data: { name: '', index: -1, error: true, errorText: 'Invalid data' },
      ...rest,
    });
    return;
  }

  const { name, password } = data;

  const user = users.get(name);

  if (!user) {
    const index = randomUUID();
    users.set(name, { index, name, password });
    sendWsMessage(ws, {
      data: { name, index, error: false, errorText: '' },
      ...rest,
    });
    return;
  }

  if (user.password !== password) {
    sendWsMessage(ws, {
      data: {
        name,
        index: -1,
        error: true,
        errorText: 'Invalid password. Try again.',
      },
      ...rest,
    });
    return;
  }

  sendWsMessage(ws, {
    data: { name: user.name, index: user.index, error: false, errorText: '' },
    ...rest,
  });
  return;
};
