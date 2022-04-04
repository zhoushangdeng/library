import request from '@/util/request';

export function getBorrow(params: any) {
    return request({
        url: '/borrow',
        method: 'get',
        params
    })
}
export function insertBorrow(data: any) {
    return request({
        url: '/borrow',
        method: 'put',
        data
    })
}

export function delBorrow(params: any) {
    return request({
        url: '/borrow',
        method: 'delete',
        params
    })
}

export function updateBorrow(data: any) {
    return request({
        url: '/borrow',
        method: 'patch',
        data
    })
}