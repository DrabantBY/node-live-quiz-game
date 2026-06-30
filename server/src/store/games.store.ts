import type { Game } from '@types';
import type { WebSocket } from 'ws';

export const gamesMap = new Map<string, Game>();
export const codesMap = new Map<string, Game>();
export const gameWsMap = new Map<string, WebSocket>();
