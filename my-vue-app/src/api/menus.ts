import request from '@/util/request';

export function getInfo(params: any) {
    return request({
        url: '/menu',
        method: 'get',
        params
    })
}

export function getMenus(params: any) {
    return request({
        url: '/menu',
        method: 'get',
        params
    })
}

export function getMenusTree(params: any) {
    return request({
        url: '/menu/tree',
        method: 'get',
        params
    })
}

export function insertMenus(data: any) {
    return request({
        url: '/menu',
        method: 'put',
        data
    })
}

export function delMenus(data: any) {
    return request({
        url: '/menu',
        method: 'delete',
        data
    })
}

export function updateMenus(data: any) {
    return request({
        url: '/menu',
        method: 'patch',
        data
    })
}