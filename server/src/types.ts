import type { GAME_STATUS } from '@const';
import type { WebSocket } from 'ws';

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export interface Player {
  name: string;
  index: string;
  score: number;
  ws?: WebSocket;
  hasAnswered?: boolean;
  answerTime?: number;
  answeredCorrectly?: boolean;
  pointsEarned: number;
}

export interface Question {
  text: string;
  options: string[];
  correctIndex: number;
  timeLimitSec: number;
}

export interface Game {
  id: string;
  code: string;
  hostId: string;
  questions: Question[];
  players: Player[];
  currentQuestion: number;
  status: GameStatus;
  questionStartTime: number;
  questionTimer: NodeJS.Timeout | null;
}

export interface User {
  name: string;
  password: string;
  index: string;
  ws?: WebSocket;
}

export interface WSMessage {
  type: string;
  data: unknown;
  id: number;
}

export interface RegData {
  name: string;
  password: string;
}

export interface CreateGameData {
  questions: Question[];
}

export interface JoinGameData {
  code: string;
}

export interface StartGameData {
  gameId: string;
}

export interface AnswerData {
  gameId: string;
  questionIndex: number;
  answerIndex: number;
}
