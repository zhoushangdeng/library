
const query = require('../lib/mysqlPool')
const router = require('koa-router')()
const COLLECTION = 'library/menu'
const logV = require('../Log').getLogger("Router:menus")
const getMenusTree = async ctx => {
    const { roleId } = ctx.request.query;
    const sql = roleId == '2001' ? `select * from menus` : `select * from menus where role_id=${roleId}`
    const data = await query(sql)
    ctx.body = arrayToTree(data)
    logV.trace("getMenus", ctx.body)
}

const arrayToTree = (items) => {
    const result = [];   // 存放结果集
    const itemMap = {};  // 

    for (const item of items) {// 先转成map存储
        itemMap[item.id] = { ...item, children: [] }
    }
    for (const item of items) {
        const id = item.id;
        const pid = item.parentID;
        const treeItem = itemMap[id];
        if (pid === 0) {
            result.push(treeItem);
        } else {
            if (!itemMap[pid]) {
                itemMap[pid] = {
                    children: [],
                }
            }
            itemMap[pid].children.push(treeItem)
        }
    }
    return result;
}

// const getChildren = (data, result, pid) => {
//     for (const item of data) {
//         if (item.parentID === pid) {
//             const newItem = { ...item, children: [] };
//             result.push(newItem);
//             getChildren(data, newItem.children, item.id);
//         }
//     }
// }

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
