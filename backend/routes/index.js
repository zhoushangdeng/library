const router = require('koa-router')()
const createError = require("http-errors");
const { isEmpty } = require('lodash');
const log = require('../Log').getLogger("Router:index")
const logError = require('../Log').getLogger("error")
const jwt = require('jwt-simple');
const { TOKEEN_EXPRIES, SMTP_HOST, SMTP_PORT, MAILBOX, MAILBOX_PASS } = process.env;
const query = require('../lib/mysqlPool')
const { customAlphabet } = require('nanoid')
const nodemailer = require('nodemailer')
const LRU = require("lru-cache");
const cache = new LRU({ max: 1000, ttl: 60 * 60 * 1000 });
const Ajv = require('ajv');
const ajv = new Ajv({ allErrors: true })

require('ajv-errors')(ajv)
require('ajv-keywords')(ajv)
require("ajv-formats")(ajv)

const nanoid = customAlphabet('1234567890', 6);
const smsLoginValidate = (email) => {
  const validate = ajv.compile({
    type: "object",
    properties: {
      email: { type: "string", minLength: 6, maxLength: 30, format: 'email' }
    },
    required: ['email']
  })
  if (!validate({ email })) {
    return validate.errors
  }
  return
}

const verifyCodeValidate = (data) => {
  const validate = ajv.compile({
    type: "object",
    properties: {
      email: { type: "string", minLength: 6, maxLength: 30, format: 'email' },
      code: { type: "string", minLength: 6, maxLength: 6, }
    },
    required: ['email', 'code']
  })
  if (!validate(data)) {
    return validate.errors
  }
  return
}

const login = async ctx => {
  const { email } = ctx.request.body
  const validateResult = await smsLoginValidate(email)
  if (!isEmpty(validateResult)) {
    log.trace("校验不通过", validateResult[0]);
    ctx.status = 412;
    ctx.body = validateResult[0];
    return
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: { user: MAILBOX, pass: MAILBOX_PASS }
  });
  const code = nanoid()
  const mailOptions = {
    from: '灯若银河 <1912504939@qq.com>',
    to: email,
    subject: `您的验证码为:${code}`,
    text: '',
    html: `<h1>你正在登录的shangdeng.link验证码为:${code},有效期为三分钟,感谢您的使用!祝您生活愉快!</h1>`,
  }

  ctx.body = await new Promise((resole) => {
    return transporter.sendMail(mailOptions, function (err, info) {
      if (err) {
        logError.error('邮件发送失败', { err, info })
        return Promise.reject(createError(400, "邮件发送失败"));
      }
      cache.set(`email:${email}`, code)
      resole(true)
    })
  })
  log.trace('邮件发送成功', { email, code })
}

const verifyCode = async ctx => {
  const { email, code } = ctx.request.body
  const validateResult = await smsLoginValidate({ email, code })
  if (!isEmpty(validateResult)) {
    log.trace("校验不通过", validateResult[0]);
    ctx.status = 412;
    ctx.body = validateResult[0];
    return
  }
  const cachedResult = cache.get(`email:${email}`);
  if (code !== cachedResult) {
    ctx.status = 401;
    ctx.body = "验证码错误！"
    return
  }
  ctx.body = await query(`select * from user email=${email}`)
    .then(profile => isEmpty(profile) ? query(`insert into user (email) values('${email}')`) : profile)
    .then(profile => {
      const token = getToken()
      const userID = profile[0].id;
      const roleId = profile[0].role_id
      const name = profile[0].name
      return { code: 200, data: { id: userID, token: token, roleId, name }, msg: 'success' }
    })
  logV.trace("login success", ctx.body)
}

const getToken = (profile) => {
  const payload = { exp: Date.now() + parseInt(TOKEEN_EXPRIES), UserID: profile[0].id }
  const token = 'Bearer ' + jwt.encode(payload, NM_PUBLIC_KEY)
  return token
}

router.prefix(`/library`);
router.post('/_sms_login', login);
router.post('/_verify_code', verifyCode)

module.exports = router
