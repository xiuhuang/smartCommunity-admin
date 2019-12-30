import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/user/property/user/v1/queryPageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/user/property/user/v1/remove', {
    method: 'POST',
    data: params,
  });
}

export async function getUserInfo(params: any) {
  return request(`/api/user/property/user/v1/queryUserInfo/${params.id}`);
}

export async function saveDetail(params: any) {
  return request('/api/user/property/user/v1/addOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function exportData(params: any) {
  return request('/api/user/property/user/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
