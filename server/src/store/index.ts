import type { Game, User } from '@types';
import type { WebSocket } from 'ws';

export const usersMap = new Map<string, User>();

export const socketsMap = new WeakMap<WebSocket, string>();

export const gamesMap = new Map<string, Game>();

export const codesMap = new Map<string, Game>();

export const gameWsMap = new Map<string, WebSocket>();
