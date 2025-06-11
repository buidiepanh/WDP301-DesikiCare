export const DatabaseConfig = () => ({
    mongoDbConfig: {
        CONNECTION_STRING: process.env.MONGODB_CONNECTION_STRING_REPLICA_SET || 'mongodb://localhost:27017/desiki',
    }
  });
  