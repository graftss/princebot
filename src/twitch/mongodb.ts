import mongoose from 'mongoose';
import { auth } from '../auth';

export const mongodbConnect = (): Promise<typeof mongoose> => {
  const connect = (): Promise<typeof mongoose> =>
    mongoose.connect(auth.mongodb.connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

  mongoose.connection.on('disconnected', connect);

  return connect();
};
