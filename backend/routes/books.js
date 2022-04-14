const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').create('Router:blacklist');
const query = require('../libs/mysqlPool')
const COLLECTION = "library/book";

const selectBooks = async ctx => {
    const { keyword, currentPage, total } = ctx.request.query;
    logV.notice("select Books", { keyword, currentPage, total })
    const data = await query(`select * from book where book_name like '%${keyword}%' order by id limit ${currentPage},${total}`)
    const totals = await query(`SELECT FOUND_ROWS() as totals`)
    ctx.body = { data, total: totals[0].totals }
    logV.notice("select Books success", ctx.body)
}

const createBooks = async ctx => {
    const { bookName, writer, sortName, price, pubCompany, pubDate, totalNum, currentNum, buyDate, brief } = ctx.request.body;
    logV.notice("create Books", { bookName, writer, sortName, price, pubCompany, pubDate, totalNum, currentNum, buyDate, brief })
    const sql = `insert into 
    book(book_name,writer,sort_name,price,pub_company,pub_date,total_num,current_num,buy_date,brief) 
    values('${bookName}','${writer}','${sortName}',${price},'${pubCompany}','${pubDate}',${totalNum},${currentNum},'${buyDate}','${brief}')`
    const result = await query(sql)
    ctx.body = { code: 200, result }
    logV.notice("create Books success", ctx.body)
}

const updateBooks = async ctx => {
    const { id, bookName, writer, sortName, price, pubCompany, pubDate, totalNum, currentNum, buyDate, brief } = ctx.request.body;
    logV.notice("update Books", { bookName, writer, sortName, price, pubCompany, pubDate, totalNum, currentNum, buyDate, brief })
    const result = await query(`update book set
     book_name='${bookName}',writer='${writer}',
     price='${price}',pub_company='${pubCompany}',
     pub_date='${moment(pubDate).format('YYYY-MM-DD HH:mm:ss')}',total_num=${totalNum},
     current_num=${currentNum},buy_date='${moment(buyDate).format('YYYY-MM-DD HH:mm:ss')}',
     sort_name='${sortName}',brief='${brief}' 
     where id=${id}`)
    ctx.body = { code: 200, result }
    logV.notice("update Books success", ctx.body)
}

const deleteBooks = async ctx => {
    const { id } = ctx.request.query;
    logV.notice("delete Books", { id })
    const result = await query(`delete from book where id=${id}`)
    ctx.body = result
    logV.notice("delete Books success", ctx.body)
}

router.prefix(`/${COLLECTION}`);
router.get('/', selectBooks);
router.put('/', createBooks)
router.patch('/', updateBooks)
router.delete('/', deleteBooks)

module.exports = router
