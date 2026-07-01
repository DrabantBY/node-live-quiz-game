export const MESSAGE_TYPE = {
  REG_USER: 'reg',
  CREATE_GAME: 'create_game',
  GAME_CREATED: 'game_created',
  JOIN_GAME: 'join_game',
  GAME_JOINED: 'game_joined',
  PLAYER_JOINED: 'player_joined',
  UPDATE_PLAYER: 'update_players',
  START_GAME: 'start_game',
  QUESTION: 'question',
  ANSWER: 'answer',
  ANSWER_ACCEPT: 'answer_accepted',
  RESULT: 'question_result',
} as const;
