import { LoggerOptions, transports, createLogger, format } from 'winston';
const { combine, timestamp, prettyPrint } = format;
import winstonDaily from 'winston-daily-rotate-file';

const options: LoggerOptions = {
  level: 'info',
  transports: [
    new winstonDaily({
      datePattern: 'YYYYMMDD',
      dirname: `${__dirname}/../../logs/all`,
      filename: 'all-requests-%DATE%.log',
      maxSize: '1024k',
      maxFiles: 10,
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYYMMDD',
      dirname: `${__dirname}/../../logs/error`,
      filename: 'error-requests-%DATE%.log',
      maxSize: '1024k',
      maxFiles: 10,
    }),
  ],
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    prettyPrint(),
  ),
};

const logger = createLogger(options);

const stream = {
  write: function (message: string) {
    const statusCode = message.split(' ')[8];
    if (statusCode[0] === '4' || statusCode[0] === '5') {
      logger.error(message);
    } else {
      logger.info(message);
    }
  },
};

if (process.env.NODE_ENV !== 'prod') {
  logger.debug('Logging initialized at debug level');
}

export { logger, stream };
