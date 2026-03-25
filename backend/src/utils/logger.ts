import { env } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: unknown;
}

const formatLog = (entry: LogEntry): string => JSON.stringify(entry);

const log = (level: LogLevel) => (message: string, data?: unknown) => {
  if (env.NODE_ENV === 'test') return;

  const entry: LogEntry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...(data !== undefined && { data }),
  };

  const formatted = formatLog(entry);

  if (level === 'error') {
    console.error(formatted);
  } else if (level === 'warn') {
    console.warn(formatted);
  } else {
    console.log(formatted);
  }
};

export const logger = {
  info: log('info'),
  warn: log('warn'),
  error: log('error'),
  debug: log('debug'),
};
