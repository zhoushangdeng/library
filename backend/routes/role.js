const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').getLogger("Router:validate")
const query = require('../lib/mysqlPool')
const COLLECTION = "library/role";

const getRole = async ctx => {
    const result = await query(`select * from role`);
    ctx.body = result
}

router.prefix(`/${COLLECTION}`);
router.get('/', getRole);

module.exports = router