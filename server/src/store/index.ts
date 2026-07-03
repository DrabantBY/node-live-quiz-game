import type { Game, User } from '@types';
import type { WebSocket } from 'ws';

export const userMap = new Map<string, User>();

export const loginMap = new Map<string, string>();

export const websocketMap = new WeakMap<WebSocket, string>();

export const connectionMap = new Map<string, WebSocket>();

export const gameMap = new Map<string, Game>();

export const playerMap = new Map<string, string>();

export const codeMap = new Map<string, string>();

export const hostMap = new Map<string, WebSocket>();
