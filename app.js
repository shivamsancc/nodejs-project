import express from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || 6379;
const PORT = process.env.PORT || 3000;

const redis_client = createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT
  }
});

const app = express();
const timestamp = new Date().toISOString();

redis_client.on('error', (err) => console.log('Redis Client Error', err));

await redis_client.connect();

app.get('/', async (req, res) => {
  const now = new Date().toISOString();
  await redis_client.set('timestamp', now);

  res.send(`Hello, World!  ${now}`);

  console.log(req.ips);
});

try {
  const value = await redis_client.get('timestamp');
  console.log('Timestamp from Redis:', value);
} catch (err) {
  console.error('Error fetching timestamp from Redis:', err);
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
