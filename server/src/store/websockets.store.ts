import type { WebSocket } from 'ws';

export const websockets = new WeakMap<WebSocket, string>();
