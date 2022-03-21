import * as dotenv from 'dotenv';
dotenv.config();

const NODE_ENV: string = process.env.NODE_ENV || 'development';

// author
const AUTHOR: string = process.env.AUTHOR || 'Anhho';
const DOMAIN: string = process.env.DOMAIN || 'localhost';
const PORT: number = +process.env.PORT || 3001;
const FE_URL: string = process.env.FE_URL || 'http://localhost:3000';

// mongo
const MLAB_USER = process.env.MLAB_USER || 'root';
const MLAB_PASS = process.env.MLAB_PASS || 'root';
const MLAB_HOST = process.env.MLAB_HOST || '192.168.0.105';
const MLAB_PORT = +process.env.MLAB_PORT || 27017;
const MLAB_DATABASE = process.env.MLAB_DATABASE || 'test';
const MLAB_URL =
  process.env.MLAB_URL ||
  `mongodb://${MLAB_USER}:${MLAB_PASS}@${MLAB_HOST}:${MLAB_PORT}/?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`;

const enviroment = {
  development: {
    url: MLAB_URL,
  },
  testing: {
    url: MLAB_URL,
  },
  staging: {
    url: MLAB_URL,
    // host: 'localhost',
    // port: MONGO_PORT!,
    // username: '',
    // password: '',
    // database: MONGO_DB!,
  },
  production: {
    url: MLAB_URL,
  },
};
const TYPEORM = enviroment[NODE_ENV];

// bcrypt
const SALT_OR_ROUNDS = process.env.MLAB_USER || 10;

export {
  NODE_ENV,
  AUTHOR,
  DOMAIN,
  PORT,
  FE_URL,
  TYPEORM,
  MLAB_USER,
  MLAB_PASS,
  MLAB_HOST,
  MLAB_PORT,
  MLAB_DATABASE,
  MLAB_URL,
  SALT_OR_ROUNDS,
};
