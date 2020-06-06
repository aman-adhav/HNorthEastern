import * as pino from 'pino';

const logger = pino({
  prettyPrint: process.env.NODE_ENV !== 'production',
  level: process.env.NODE_ENV === 'production' ? 'error' : 'trace',
});

export default logger;
