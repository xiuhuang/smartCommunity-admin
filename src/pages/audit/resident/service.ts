import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/audit/resident/v1/list/page', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/smart/audit/resident/v1/remove', {
    method: 'POST',
    data: params,
  });
}

export async function getDetail(params: any) {
  return request(`/api/smart/audit/resident/v1/result/${params.auditId}`);
}

export async function audit(params: any) {
  return request('/api/smart/audit/resident/v1/audit', {
    method: 'POST',
    data: params,
  });
}

export async function exportResult(params: any) {
  return request('/api/smart/audit/resident/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
