const query = require('../lib/mysqlPool')
const router = require('koa-router')()
const jwt = require('jwt-simple');
const { isEmpty } = require('lodash');
const logV = require('../Log').getLogger("Router:login")
const { TOKEEN_EXPRIES,NM_PUBLIC_KEY } = process.env;
const COLLECTION = 'library/login'
/* 登录 */
const userLogin = async ctx => {
    const { username, password, studentCode } = ctx.request.body;
    logV.trace("user login", { username, password, studentCode })
    const sql = `select * from user where name='${username}' and password='${password}'`;
    const data = await query(sql).then(res => isEmpty(res)
        ? query(`select * from user where student_code='${studentCode}' and password='${password}'`)
        : res)
    if (!isEmpty(data)) {
        const payload = { exp: Date.now() + parseInt(TOKEEN_EXPRIES), UserID: data[0].id }
        const token = 'Bearer ' + jwt.encode(payload, NM_PUBLIC_KEY)
        const userID = data[0].id;
        const roleId = data[0].role_id
        const name = data[0].name
        ctx.body = { code: 200, data: { id: userID, token: token, roleId, name }, msg: 'success' }
        logV.trace("login success", ctx.body)
    } else {
        ctx.status = 401
        ctx.body = '登陆失败，用户名或密码无效!'
    }
}

router.prefix(`/${COLLECTION}`);
router.post('/', userLogin)

module.exports = router
