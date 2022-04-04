import request from '@/util/request';

export function register(data: any) {
    return request({
        url: '/register',
        method: 'put',
        data
    })
}

