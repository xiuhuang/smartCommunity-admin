import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/visitor/record/v1/list/page', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/smart/visitor/record/v1/delete', {
    method: 'POST',
    data: params,
  });
}

export async function fetchCauseTag(params: any) {
  return request('/api/smart/visitor/reason/v1/list/page', {
    method: 'POST',
    data: params,
  });
}

export async function add(params: any) {
  return request('/api/smart/visitor/record/v1/register', {
    method: 'POST',
    data: params,
  });
}

export async function getDetail(params: any) {
  return request(`/api/smart/visitor/record/v1/info/${params.id}`);
}

export async function validCode(params: any) {
  return request('/api/smart/visitor/record/v1/code/valid', {
    method: 'POST',
    data: params,
  });
}

export async function addRecordByCode(params: any) {
  return request('/api/smart/visitor/record/v1/code/register', {
    method: 'POST',
    data: params,
  });
}

export async function exportVisitor(params: any) {
  return request('/api/smart/visitor/record/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
