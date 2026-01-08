import Redis from "ioredis"
import dotenv from 'dotenv';

dotenv.config();

 const myredis = new Redis(process.env.UPSTASH_REDIS_URL);

export default myredis;

