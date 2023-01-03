const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').getLogger("Router:validate")
const query = require('../lib/mysqlPool')
const COLLECTION = "library/statistics";

const selectStatistics = async ctx => {
    // let sql = `select * from book where lend_sum>0 order by lend_sum desc limit 10`
    let sql = `select * from Sheet1`
    const result = await query(sql)
    ctx.body = result
    logV.trace("select borrow success", ctx.body)
}
router.prefix(`/${COLLECTION}`);
router.get('/', selectStatistics);

module.exports = router
