import request from '@/util/request';

export function getRole(params: any) {
    return request({
        url: '/role',
        method: 'get',
        params
    })
}