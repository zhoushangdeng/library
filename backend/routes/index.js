const router = require('koa-router')()
const createError = require("http-errors");
const { isEmpty } = require('lodash');
const logV = require('../Log').getLogger("Router:validate")
const jwt = require('jwt-simple');
const { TOKEEN_EXPRIES } = process.env;
const query = require('../libs/mysqlPool')

const login = async ctx => {
  const { username, password } = ctx.request.body;
  logV.trace("user login", { username, password })
  const result = await query(`select id from user where name = '${username}' and password = '${password}'`)
  logV.trace("select mysql", { result })
  if (isEmpty(result)) { return Promise.reject(createError(401, "usernamePasswordError")); }
  const payload = { exp: Date.now() + parseInt(TOKEEN_EXPRIES), UserID: result[0].id }
  const jwtSecret = 'jwtSecret'
  let token = 'Bearer ' + jwt.encode(payload, jwtSecret)
  ctx.body = { token }
  logV.trace("login success", ctx.body)
}
router.prefix(`/library`);
router.post('/login', login);

module.exports = router
