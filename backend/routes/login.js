const query = require('../lib/mysqlPool')
const router = require('koa-router')()
const jwt = require('jwt-simple');
const { isEmpty } = require('lodash');
const logV = require('../Log').getLogger("Router:validate")
const { TOKEEN_EXPRIES } = process.env;
const COLLECTION = 'library/login'
/* 登录 */
const userLogin = async ctx => {
    let { username, password, studentCode } = ctx.request.body;
    logV.trace("user login", { username, password, studentCode })
    let sql = `select * from user where name='${username}' and password='${password}'`;
    const data = await query(sql).then(res => isEmpty(res)
        ? query(`select * from user where student_code='${studentCode}' and password='${password}'`)
        : res)
    if (!isEmpty(data)) {
        const jwtSecret = 'jwtSecret'
        const payload = { exp: Date.now() + parseInt(TOKEEN_EXPRIES), UserID: data[0].id }
        let token = 'Bearer ' + jwt.encode(payload, jwtSecret)
        let userID = data[0].id;
        const roleId = data[0].role_id
        const name = data[0].name
        ctx.body = { code: 200, data: { id: userID, token: token, roleId, name }, msg: 'success' }
    } else {
        ctx.body = { code: 401, data: '用户名或密码无效!', msg: data }
    }
    logV.trace("login success", ctx.body)
}

router.prefix(`/${COLLECTION}`);
router.post('/', userLogin)

module.exports = router
