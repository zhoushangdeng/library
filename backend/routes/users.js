const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').create('Router:blacklist');
const query = require('../libs/mysqlPool')
const COLLECTION = "library/user";

const gettUser = async ctx => {
    const { keyword, currentPage, total } = ctx.request.query;
    logV.notice("select user", { keyword, currentPage, total })
    const result = await query(`select * from user where name like '%${keyword}%' order by id limit ${currentPage},${total}`)
    ctx.body = result
    logV.notice("select user success", ctx.body)
}

const createUser = async ctx => {
    const { name, password, major, className, sex, email, studentCode } = ctx.request.body;
    const now = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
    logV.notice("create user", { name, password, name, password, major, className, sex, email, studentCode, now })
    const result = await query(`insert into user (name,password,createTime,major,class_name,sex,email,student_code) values('${name}','${password}','${now}','${major}','${className}','${sex}','${email}','${studentCode}')`)
    ctx.body = { code: 200, result }
    logV.notice("create user success", ctx.body)
}

const updateUser = async ctx => {
    const { name, password, major, className, sex, email, studentCode, id } = ctx.request.body;
    logV.notice("update user", { name, password, name, password, major, className, sex, email, studentCode })
    const result = await query(`update user set password='${password}',name='${name}',major='${major}',class_name='${className}',email='${email}',sex='${sex}',student_code='${studentCode}' where id=${id}`)
    ctx.body = { code: 200, result }
    logV.notice("update user success", ctx.body)
}

const deleteUser = async ctx => {
    const { id } = ctx.request.query;
    logV.notice("delete user", { id })
    const result = await query(`delete from user where id=${id}`)
    ctx.body = result
    logV.notice("delete user success", ctx.body)
}

/* 首页菜单 */
const getNavList = async ctx => {
    let data = ctx.request.query;
    console.log('data', data)
    let sql = `select * from user where id>${data.id};`
    query(sql, (error, vals) => {
        ctx.bdoy = { data: vals }
    })
}

router.prefix(`/${COLLECTION}`);
router.get('/', gettUser);
router.get('/getNavList', getNavList);
router.put('/', createUser)
router.patch('/', updateUser)
router.delete('/', deleteUser)

module.exports = router
