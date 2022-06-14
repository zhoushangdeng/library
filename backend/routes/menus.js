
const query = require('../lib/mysqlPool')
const router = require('koa-router')()
const COLLECTION = 'library/menu'
const logV = require('../Log').getLogger("Router:validate")
const getMenusTree = async ctx => {
    const { roleId } = ctx.request.query;
    const sql = roleId == '2001' ? `select * from menus` : `select * from menus where role_id=${roleId}`
    const data = await query(sql)
    const menus = []
    data.map(item => {
        if (item.parentID === 0) {
            menus.push({ ...item, children: [] });
        }
    })
    const filters = (menusArr) => {
        menusArr.map(item => {
            data.map(item2 => {
                if (item2.parentID === item.id) {
                    item.children.push({ ...item2, children: [] });
                }
            })
            if (item.children.length > 0) {
                filters(item.children)
            }
        })
    }
    filters(menus)
    ctx.body = menus

}

const getMenus = async ctx => {
    const { roleId } = ctx.request.query;
    const sql = roleId == '2001' ? `select * from menus` : `select * from menus where role_id=${roleId};`
    const data = await query(sql)
    ctx.body = data;
}

const insertMenus = async ctx => {
    try {
        const { title, menusName, path, icon, parentID, type } = ctx.request.body;
        const selectSql = `select * from menus where menusName = '${menusName}' or path = '${path}'`;
        const val = await query(selectSql);
        if (val.length > 0) {
            ctx.body = { code: 200, data: [], msg: '菜单路径重复或者菜单唯一名称标识符menusName重复！' };
            return
        }
        const insertSql = `insert into menus (title,menusName,path,icon,parentID,type) values('${title}','${menusName}','${path}','${icon}',${parentID},${type})`
        const data = await query(insertSql)
        if (data.affectedRows === 1) {
            ctx.body = { code: 200, data: '新增成功', msg: 'success' };
        } else {
            ctx.body = data;
        }
        res.end();
    } catch (error) {
        ctx.body = { code: 500, data: '更新失败', msg: error };
        return;
    }
}

const delMenus = async ctx => {
    const { id } = ctx.request.body;
    let sql = `delete from menus where id=${id}`
    const data = await query(sql)
    ctx.body = data.affectedRows == 1
        ? { code: 200, data: '删除成功', msg: 'success' }
        : { code: 201, data: data, msg: '删除失败，数据不存在或者数据库错误' }
}

const updateMenus = async ctx => {
    const { id, title, menusName, path, icon, parentID, type } = ctx.request.body;
    let sql = `update menus set title='${title}',menusName='${menusName}',path='${path}',icon='${icon}',parentID=${parentID},type=${type} where id=${id}`
    const data = await query(sql)
    ctx.body = data.affectedRows == 1
        ? { code: 200, data: '修改成功', msg: 'success' }
        : { code: 201, data: '修改失败', msg: data }
}

router.prefix(`/${COLLECTION}`);
router.get('/', getMenus);
router.get('/tree', getMenusTree);
router.put('/', insertMenus)
router.patch('/', updateMenus)
router.delete('/', delMenus)

module.exports = router
