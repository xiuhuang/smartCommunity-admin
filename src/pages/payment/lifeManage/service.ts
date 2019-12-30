import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/payment/v1/account/list/page', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/smart/payment/v1/account/delete', {
    method: 'POST',
    data: params.accountIds,
  });
}

export async function addAcount(params: any) {
  return request('/api/smart/payment/v1/account/save', {
    method: 'POST',
    data: params,
  });
}

export async function getDetail(params: any) {
  return request(`/api/smart/payment/v1/account/info/${params.accountId}`);
}
