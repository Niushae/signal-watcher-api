import { Redis } from 'ioredis';

const client = new Redis({
  port: 6379,
  host: "localhost", 
});

client.on('error', (err) => console.error('Redis Client Error', err));

export default client;
