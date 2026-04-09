import express from 'express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log('received:', message.toString());
  });
  ws.send(JSON.stringify({ type: 'connected' }));
});

server.listen(PORT, () => {
  console.log(`soroban-event-indexer running on port ${PORT}`);
});

export default app;