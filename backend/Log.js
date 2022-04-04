const debug = require("debug");
const { merge, fill } = require('lodash');
const util = require('util');

const { DEBUG_COMPACT, DEBUG_BREAK_LENGTH, DEBUG_DEPTH, DEBUG_SHOW_HIDDEN, ACG_HOST, ACG_PORT, ACG_SSL,
    ACG_TOKEN, LOG_COLLECTION, LOG_HTTP_LEVEL, LOG_LOCAL_LEVEL } = process.env;

if (process.env.NODE_ENV === 'production') {
    const winston = require("winston");
    const { format, transports, config } = winston;
    const logger = winston.createLogger({
        levels: config.syslog.levels,
        format: format.combine(format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}), format.json()),
        transports: [
            new transports.File({
                level: LOG_LOCAL_LEVEL || 'debug',
                filename: './logs/logs.log',
                maxsize: 10485760
            }),
            new transports.Http({
                level: LOG_HTTP_LEVEL || 'notice',
                ssl: ACG_SSL || false,
                host: ACG_HOST,
                port: ACG_PORT || 3000,
                auth: { bearer: ACG_TOKEN },
                path: `/${LOG_COLLECTION}`
            }),
        ],
        exceptionHandlers: [
            new transports.File({ filename: './logs/exceptions.log' })
        ],
        rejectionHandlers: [
            new transports.File({ filename: './logs/rejections.log' })
        ],
        exitOnError: false
    });

    debug.formatArgs = () => undefined;
    debug.log = function (level, ...args) {
        const meta = args[args.length - 1];
        const supplement = { namespace: this.namespace, diff: `+${debug.humanize(this.diff)}`};
        if (typeof meta === 'object') {
            fill(args, merge({}, meta, supplement), args.length - 1);
            logger.log(level, ...args)
        } else {
            logger.log(level, ...args, supplement)
        }
    }
} else {
    const formatArgs = debug.formatArgs;
    debug.formatArgs = function (args) {
        const meta = args[args.length - 1];
        if (typeof meta === 'object') {
            args[args.length - 1] = util.inspect(meta, {
                compact: DEBUG_COMPACT === 'true',
                depth: parseInt(DEBUG_DEPTH, 10),
                breakLength: parseInt(DEBUG_BREAK_LENGTH, 10),
                showHidden: DEBUG_SHOW_HIDDEN === 'true'
            });
        }

        args[0] = `<${args[0]}>`;
        return formatArgs.call(this, args);
    }
}

class Log {

    constructor(namespace) {
        this._ = debug(namespace);
    }

    static create(namespace) {
        return new Log(namespace);
    }

    emerg() { this._('emerg', ...arguments); }
    alert() { this._('alert', ...arguments); }
    crit() { this._('crit', ...arguments); }
    error() { this._('error', ...arguments); }
    warning() { this._('warning', ...arguments); }
    notice() { this._('notice', ...arguments); }
    info() { this._('info', ...arguments); }
    debug() { this._('debug', ...arguments); }
    log(level, ...args) { this._(level, ...arguments); }
}

module.exports = Log;
