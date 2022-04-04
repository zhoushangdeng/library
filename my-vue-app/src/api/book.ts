import request from '@/util/request';

export function getBook(params: any) {
    return request({
        url: '/book',
        method: 'get',
        params
    })
}
export function insertBook(data: any) {
    return request({
        url: '/book',
        method: 'put',
        data
    })
}

export function delBook(params: any) {
    return request({
        url: '/book',
        method: 'delete',
        params
    })
}

export function updateBook(data: any) {
    return request({
        url: '/book',
        method: 'patch',
        data
    })
}