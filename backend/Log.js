const log4js = require('log4js');
const { ACG_HOST, ACG_PORT, ACG_TOKEN, LOG_COLLECTION, LOG_EXCEPTION, ACG_SSL } = process.env;
const jsonLayout = require('log4js-json-layout');
log4js.addLayout('json', jsonLayout)

if (process.env.NODE_ENV == 'production') {
    const configure = {
        appenders: {
            traceLog: { type: 'file', layout: { type: 'json' }, filename: './logs/logs.log', keepFileExt: true, maxLogSize: 10485760, backups: 100000 },
            traceLogs: { type: "logLevelFilter", level: "trace", maxLevel: "warn", appender: 'traceLog' },
            errorLog: { type: 'file', layout: { type: 'json' }, filename: './logs/exceptions.log' },
            errorLogs: { type: "logLevelFilter", level: "error", maxLevel: "fatal", appender: 'errorLog' },
        },
        categories: {
            default: { appenders: ['traceLogs', 'errorLogs'], level: 'trace' }
        }
    }
    log4js.configure(configure);
} else {
    const configure = {
        appenders: {
            out: { type: 'console' },
        },
        categories: {
            default: { appenders: ['out'], level: 'trace', maxLevel: "fatal" },
        }
    }
    log4js.configure(configure);
}

const getLogger = function (name) {
    return log4js.getLogger(name || 'default')
}

module.exports = { getLogger };
