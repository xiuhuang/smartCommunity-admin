import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/web/repair/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/web/repair/v1/batchDel', {
    method: 'POST',
    data: params.ids,
  });
}

export async function getDetail(params: any) {
  return request(`/api/web/repair/v1/detail/${params.id}`);
}

export async function editReport(params: any) {
  return request('/api/web/repair/v1/updateStatus', {
    method: 'POST',
    data: params,
  });
}

export async function exportData(params: any) {
  return request('/api/web/repair/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
