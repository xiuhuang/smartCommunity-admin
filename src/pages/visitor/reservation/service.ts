import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/visitor/apt/v1/list/page', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/smart/visitor/apt/v1/delete', {
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

export async function submitCauseTag(params: any) {
  return request('/api/smart/visitor/reason/v1/save', {
    method: 'POST',
    data: params,
  });
}

export async function removeCauseTag(params: any) {
  return request('/api/smart/visitor/reason/v1/remove', {
    method: 'POST',
    data: params,
  });
}

export async function addReservation(params: any) {
  return request('/api/smart/visitor/apt/v1/save', {
    method: 'POST',
    data: params,
  });
}
