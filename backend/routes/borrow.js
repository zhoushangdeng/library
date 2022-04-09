const router = require('koa-router')()
const moment = require('moment')
const logV = require('../Log').create('Router:blacklist');
const query = require('../libs/mysqlPool')
const COLLECTION = "library/borrow";

const selectBorrow = async ctx => {
    const { start, end, userId } = ctx.request.query;
    logV.notice("select borrow", { start, end, userId })
    const sql = userId
        ? `select w.id,w.student_code,w.borrow_date,w.return_date,w.book_id,w.state,b.book_name,b.writer,u.name from borrow as w,book as b,user as u where w.borrow_date between '${start}' and '${end}' and w.book_id=b.id and u.student_code=w.student_code and u.id=${userId}`
        : `select w.id,w.student_code,w.borrow_date,w.return_date,w.book_id,w.state,b.book_name,b.writer,u.name from borrow as w,book as b,user as u where w.borrow_date between '${start}' and '${end}' and w.book_id=b.id and u.student_code=w.student_code`
    const result = await query(sql)
    ctx.body = result
    logV.notice("select borrow success", ctx.body)
}

const createBorrow = async ctx => {
    const { bookId, studentCode, borrowDate, returnDate, state } = ctx.request.body;
    logV.notice("create borrow", { bookId, studentCode, borrowDate, returnDate, state })
    const selectSql = `select current_num,lend_sum from book where id=${bookId}`
    const [RowDataPacket] = await query(selectSql)
    const currentNum = RowDataPacket.current_num
    const lendSum = RowDataPacket.lend_sum
    if (0 == currentNum) {
        return ctx.body = { message: "库存不足" }
    }
    const insertSql = `insert into borrow(book_id, student_code, borrow_date, return_date,state) values('${bookId}','${studentCode}','${borrowDate}','${returnDate}','${state}')`
    const result = await query(insertSql).then(() => query(`update book set current_num = ${currentNum - 1},lend_sum = ${lendSum + 1} where id=${bookId}`))
    ctx.body = { code: 200, result }
    logV.notice("create borrow success", ctx.body)
}

const updateBorrow = async ctx => {
    const { id, bookId, studentCode, borrowDate, returnDate, state } = ctx.request.body;
    logV.notice("update borrow", { bookId, studentCode, borrowDate, returnDate })
    const selectSql = `select current_num from book where id=${bookId}`
    const result = await query(selectSql)
        .then(([resRowDataPacket]) => {
            return query(`select * from borrow where id=${id}`).then(res => {
                return query(`update borrow set book_id='${bookId}',student_code='${studentCode}', borrow_date='${borrowDate}',return_date='${returnDate}',state='${state}' where id=${id}`)
                    .then(() => {
                        if (res[0].state == state) { return '' }
                        const currentNum = state == 'Notyet' ? resRowDataPacket.current_num - 1 : resRowDataPacket.current_num + 1
                        return query(`update book set current_num = '${currentNum}'`)
                    })
            })

        })
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
