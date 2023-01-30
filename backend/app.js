const Koa = require('koa')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const koaJwt = require('koa-jwt');
const cors = require('@koa/cors');

const logger = require('koa-logger')
const login = require('./routes/login')
const user = require('./routes/users')
const book = require('./routes/books')
const borrow = require('./routes/borrow')
const menus = require('./routes/menus')
const role = require('./routes/role')
const register = require('./routes/register')
const index = require('./routes/index')
const statistics = require('./routes/statistics')
const log = require('./Log').getLogger("error");
const app = new Koa()
const jwtSecret = 'jwtSecret'
// app.use(koaJwt({ secret: jwtSecret }).unless({ path: [/\/library\/login/, /\/library\/_sms_login/, /\/library\/register/] }))
app.use(cors({ 'origin': "*" }));
onerror(app)
app.use(logger())
app.use(bodyparser({ enableTypes: ['json', 'form', 'text'] }))
app.use(json())
app.use(index.routes(), index.allowedMethods())
app.use(login.routes(), login.allowedMethods())
app.use(user.routes(), user.allowedMethods())
app.use(book.routes(), book.allowedMethods())
app.use(borrow.routes(), borrow.allowedMethods())
app.use(menus.routes(), menus.allowedMethods())
app.use(role.routes(), role.allowedMethods())
app.use(register.routes(), register.allowedMethods())
app.use(statistics.routes(), statistics.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
  log.error("app err", err)
});

module.exports = app
