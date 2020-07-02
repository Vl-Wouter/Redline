import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });

export const constantsConfig = {
  db: {
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: parseInt(process.env.DB_PORT, 10),
    dbName: process.env.DB_NAME,
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
    },
  },
};
