import express from 'express';
import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379;
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const app = express();

async function startServer() {
  // Create Redis client
  const redis_client = createClient({
    socket: {
      host: REDIS_HOST,
      port: REDIS_PORT,
    },
  });

  redis_client.on('error', (err) => console.error('Redis Client Error:', err));

  await redis_client.connect();

  // Root endpoint
  app.get('/', async (req, res) => {
    const now = new Date().toISOString();
    try {
      await redis_client.set('timestamp', now);
      res.send(`Hello, World!  ${now}`);
      console.log('Request from IPs:', req.ips);
    } catch (err) {
      console.error('Error setting timestamp in Redis:', err);
      res.status(500).send('Internal Server Error');
    }
  });

  // Fetch last timestamp on startup
  try {
    const lastTimestamp = await redis_client.get('timestamp');
    console.log('Last timestamp from Redis:', lastTimestamp);
  } catch (err) {
    console.error('Error fetching timestamp from Redis:', err);
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

// Start everything
startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
