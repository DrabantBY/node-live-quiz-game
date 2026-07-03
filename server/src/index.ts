import { WebSocketServer } from 'ws';
import { dispatch } from './dispatch';

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const wss = new WebSocketServer({ port: PORT });

wss.on('connection', dispatch);

wss.on('listening', () => {
  console.log(`Start web socket server on the ${PORT} port!`);
});

wss.on('error', (err) => {
  console.error('WebSocketServer error:', err);
});
