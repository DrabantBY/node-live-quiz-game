import type { WebSocket } from 'ws';

export const socketsMap = new WeakMap<WebSocket, string>();
