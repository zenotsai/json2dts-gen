import npmlog from 'npmlog'
import PkgJson from '../package.json';

const envs = ['verbose', 'info', 'error', 'warn'];
type a = typeof envs;

const envLogLevel = process.env.LOG_LEVEL as string
const logLevel =
  envs.indexOf(envLogLevel) !== -1 ? envLogLevel : 'info';

npmlog.level = logLevel;

const prefix = PkgJson.name;

type LogFn = (message: string) => void;
const logUtils: {
  verbose: LogFn
  info: LogFn
  error: LogFn
  warn: LogFn
} = envs.reduce((pre, current) => {
  if (npmlog[current]) {
    return {
      ...pre,
      [current]: (message: string) => npmlog[current](prefix, message)
    }
  }
  return pre;
}, Object.create(null))
export default logUtils