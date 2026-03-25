import mongoose from 'mongoose';
import { Draw } from './src/models/Draw';
import { env } from './src/config/env';
import { getRedis } from './src/config/redis';

async function resetDraw() {
  await mongoose.connect(env.MONGO_URI);
  console.log('Connected to DB');

  const month = new Date().toISOString().slice(0, 7);
  const result = await Draw.deleteOne({ month });
  console.log(`Deleted draw for ${month}:`, result.deletedCount);

  const redis = getRedis();
  await redis.del('draw:latest');
  console.log('Cleared Redis cache: draw:latest');

  await mongoose.disconnect();
  process.exit(0);
}

resetDraw().catch(console.error);
