import request from '@/util/request';

export function getStatistics(params: any) {
    return request({
        url: '/statistics',
        method: 'get',
        params
    })
}