import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/user/monitor/operlog/queryPageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/mock/29/list/v1/remove', {
    method: 'POST',
    data: params,
  });
}
