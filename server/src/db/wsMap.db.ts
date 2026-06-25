import type { WebSocket } from 'ws';

export const wsMap: Record<string, WebSocket> = Object.create(null);
