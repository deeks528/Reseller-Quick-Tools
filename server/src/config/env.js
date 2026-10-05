import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/reseller_tools',
  JWT_SECRET: process.env.JWT_SECRET || 'reseller_tools_dev_secret_key_8f92LmQ492k1!',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PUBLIC_APP_URL: (process.env.PUBLIC_APP_URL || 'http://localhost:5173').replace(/\/+$/, ''),
  CLIENT_ORIGIN: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').replace(/\/+$/, '')
};
