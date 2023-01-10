const log4js = require('log4js');
const jsonLayout = require('log4js-json-layout');
const { SMTP_HOST, SMTP_PORT, MAILBOX, MAILBOX_PASS } = process.env;
log4js.addLayout('json', jsonLayout)

if (process.env.NODE_ENV == 'production') {
    const configure = {
        appenders: {
            traceLog: { type: 'file', layout: { type: 'json' }, filename: `./logs/log.log`, pattern: "yyyy-MM-dd", keepFileExt: true, alwaysIncludePattern: true, maxLogSize: 10485760 },
            traceLogs: { type: "logLevelFilter", level: "trace", maxLevel: "warn", appender: 'traceLog' },
            errorLog: { type: 'file', layout: { type: 'json' }, filename: `./logs/exceptions.log`, pattern: "yyyy-MM-dd", keepFileExt: true, alwaysIncludePattern: true, maxLogSize: 10485760, },
            errorLogs: { type: "logLevelFilter", level: "error", maxLevel: "fatal", appender: 'errorLog' },
            email: {
                type: '@log4js-node/smtp',
                sender: MAILBOX, //发送邮件的邮箱
                subject: 'Library Error log', //标题
                SMTP: {
                    host: SMTP_HOST,
                    port: SMTP_PORT,
                    // secure: true, secureConnection: true,
                    auth: { user: MAILBOX, pass: MAILBOX_PASS, }
                },
                recipients: MAILBOX, //接收邮件的邮箱
            },
        },
        categories: {
            default: { appenders: ['traceLogs',], level: 'trace' },
            error: { appenders: ['errorLogs', 'email'], level: 'error' }
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
