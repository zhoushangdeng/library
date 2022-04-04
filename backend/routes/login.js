const query = require('../libs/mysqlPool')
const router = require('koa-router')()
const jwt = require('jwt-simple');
const logV = require('../Log').create('Router:blacklist');
const { TOKEEN_EXPRIES } = process.env;
const COLLECTION = 'library/login'
/* 登录 */
const userLogin = async ctx => {
    let { username, password } = ctx.request.body;
    logV.notice("user login", { username, password })
    let sql = `select * from user where name='${username}' and password='${password}'`;
    const data = await query(sql);
    let obj = {};
    if (data.length > 0) {
        const jwtSecret = 'jwtSecret'
        const payload = { exp: Date.now() + parseInt(TOKEEN_EXPRIES), UserID: data[0].id }
        let token = 'Bearer ' + jwt.encode(payload, jwtSecret)
        let userID = data[0].id;
        obj = { code: 200, data: { id: userID, token: token }, msg: 'success' }
    } else {
        obj = { code: 401, data: '用户名或密码无效!', msg: data }
    }
    ctx.body = obj;
    logV.notice("login success", ctx.body)

}

router.prefix(`/${COLLECTION}`);
router.post('/', userLogin)

module.exports = router
