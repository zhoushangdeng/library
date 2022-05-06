const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').getLogger("Router:validate")
const query = require('../libs/mysqlPool')
const COLLECTION = "library/register";

const register = async ctx => {
    const { name, password, major, className, sex, email, studentCode, roleId } = ctx.request.body;
    const now = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
    logV.trace("create user", { name, password, name, password, major, className, sex, email, studentCode, now })
    const result = await query(`insert into user (name,password,createTime,major,class_name,sex,email,student_code,role_id) values('${name}','${password}','${now}','${major}','${className}','${sex}','${email}','${studentCode}','${roleId}')`)
    ctx.body = { code: 200, result }
    logV.trace("create user success", ctx.body)
}

router.prefix(`/${COLLECTION}`);
router.put('/', register)

module.exports = router
