import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/payment/v1/deposit/list/page', {
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

export async function saveOrEdit(params: any) {
  return request('/api/smart/payment/v1/deposit/save', {
    method: 'POST',
    data: params,
  });
}

// 暂无
export async function backPay(params: any) {
  return request('/api/smart/payment/v1/deposit/save', {
    method: 'POST',
    data: params,
  });
}

export async function depositDetail(params: any) {
  return request(`/api/smart/payment/v1/deposit/info/${params.depositId}`);
}

export async function refund(params: any) {
  return request(`/api/smart/payment/v1/deposit/refund/${params.depositId}`);
}

export async function exportData(params: any) {
  return request('/api/smart/payment/v1/deposit/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
