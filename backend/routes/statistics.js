const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').create('Router:blacklist');
const query = require('../libs/mysqlPool')
const COLLECTION = "library/statistics";

const selectStatistics = async ctx => {
    const result = await query(`select * from book where lend_sum>0 order by lend_sum desc limit 10`)
    ctx.body = result
    logV.notice("select borrow success", ctx.body)
}
router.prefix(`/${COLLECTION}`);
router.get('/', selectStatistics);

module.exports = router