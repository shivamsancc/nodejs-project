import express from 'express';
import { createClient } from 'redis';

const redis_client = createClient();
const app = express();
const PORT = process.env.PORT || 3000;  
const timestamp= new Date().toISOString();
redis_client.on('error', err => console.log('Redis Client Error', err));

await redis_client.connect();



app.get('/', (req, res) => {
  
  redis_client.set('timestamp',new  Date().toISOString());
  res.send('Hello, World!' + '  ' + new  Date().toISOString());

console.log(req.ips);

//   console.log(req.path+ 'Server-request Came' + timestamp + ' ==== ' + res.statusCode);

});
 redis_client.get('timestamp').then(value => {
  console.log('Timestamp from Redis:', value);
}).catch(err => {
  console.error('Error fetching timestamp from Redis:', err);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});