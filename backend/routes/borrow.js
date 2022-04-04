const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').create('Router:blacklist');
const query = require('../libs/mysqlPool')
const COLLECTION = "library/borrow";

const selectBorrow = async ctx => {
    // SELECT a.id, a.name, a.address, a.date, b.math, b.english, b.chinese FROM tb_demo065_tel AS b, tb_demo065 AS a WHERE a.id = b.id
    const { start, end } = ctx.request.query;
    logV.notice("select borrow", { start, end })
    const result = await query(`select w.id,w.student_code,w.borrow_date,w.return_date,w.book_id,b.book_name,b.writer,u.name from borrow as w,book as b,user as u where w.borrow_date between '${start}' and '${end}' and w.book_id=b.id and u.student_code=w.student_code`)
    ctx.body = result
    logV.notice("select borrow success", ctx.body)
}

const createBorrow = async ctx => {
    const { bookId, studentCode, borrowDate, returnDate } = ctx.request.body;
    logV.notice("create borrow", { bookId, studentCode, borrowDate, returnDate })
    const selectSql = `select current_num from book where id=${bookId}`
    const [RowDataPacket] = await query(selectSql)
    const currentNum = RowDataPacket.current_num
    if (0 == currentNum) {
        return ctx.body = { message: "库存不足" }
    }
    const insertSql = `insert into borrow(book_id, student_code, borrow_date, return_date) values('${bookId}','${studentCode}','${borrowDate}','${returnDate}')`
    const result = await query(insertSql).then(() => query(`update book set current_num = ${currentNum - 1} where id=${bookId}`))
    ctx.body = { code: 200, result }
    logV.notice("create borrow success", ctx.body)
}

const updateBorrow = async ctx => {
    const { id, bookId, studentCode, borrowDate, returnDate } = ctx.request.body;
    logV.notice("update borrow", { bookId, studentCode, borrowDate, returnDate })
    const result = await query(`update borrow set book_id='${bookId}',student_code='${studentCode}', borrow_date='${borrowDate}',return_date='${returnDate}' where id=${id}`)
    ctx.body = { code: 200, result }
    logV.notice("update borrow success", ctx.body)
}

const deleteBorrow = async ctx => {
    const { id } = ctx.request.query;
    logV.notice("delete Borrow", { id })
    const result = await query(`delete from borrow where id=${id}`)
    ctx.body = { code: 200, result }
    logV.notice("delete Borrow success", ctx.body)
}

router.prefix(`/${COLLECTION}`);
router.get('/', selectBorrow);
router.put('/', createBorrow)
router.patch('/', updateBorrow)
router.delete('/', deleteBorrow)

module.exports = router
