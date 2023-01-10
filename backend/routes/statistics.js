const router = require('koa-router')()
const logV = require('../Log').getLogger("Router:statistics")
const query = require('../lib/mysqlPool')
const COLLECTION = "library/statistics";

const selectStatistics = async ctx => {
    const sql = `select * from book where lend_sum>0 order by lend_sum desc limit 10`
    ctx.body = await query(sql)
    logV.trace("select borrow success", ctx.body)
}
router.prefix(`/${COLLECTION}`);
router.get('/', selectStatistics);

module.exports = router
