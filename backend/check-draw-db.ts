import mongoose from 'mongoose';
import { User } from './src/models/User';
import { Draw } from './src/models/Draw';
import { env } from './src/config/env';

async function checkDb() {
  await mongoose.connect(env.MONGO_URI);
  console.log('Connected to DB');

  const activeUsers = await User.countDocuments({ subscriptionStatus: 'active' });
  console.log('Active Users Count:', activeUsers);

  const totalUsers = await User.countDocuments({});
  console.log('Total Users Count:', totalUsers);

  const month = new Date().toISOString().slice(0, 7);
  const existingDraw = await Draw.findOne({ month });
  console.log(`Draw for ${month}:`, existingDraw ? existingDraw.status : 'Not found');

  const lastDraw = await Draw.findOne({ status: 'completed' }).sort({ createdAt: -1 });
  console.log('Last completed draw:', lastDraw ? lastDraw.month : 'None');

  await mongoose.disconnect();
}

checkDb().catch(console.error);
