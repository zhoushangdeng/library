import request from '@/util/request';

export function getNavList(data: any) {
    return request({
        url: '/user/getNavList',
        method: 'get',
        params: data
    })
}

export function getUser(data: any) {
    return request({
        url: '/user',
        method: 'get',
        params: data
    })
}

export function insertUser(data: any) {
    return request({
        url: '/user',
        method: 'put',
        data
    })
}

export function delUser(data: any) {
    return request({
        url: '/user',
        method: 'delete',
        params: data
    })
}

export function updateUser(data: any) {
    return request({
        url: '/user',
        method: 'patch',
        data
    })
}




