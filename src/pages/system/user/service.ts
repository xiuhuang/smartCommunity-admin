import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/user/property/user/v1/queryPageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/user/property/user/v1/SysUser/remove', {
    method: 'POST',
    data: params,
  });
}

export async function getRoles(params: any) {
  return request('/api/user/sysRole/v1/list', {
    method: 'POST',
    data: params,
  });
}

export async function saveDetail(params: any) {
  return request('/api/user/property/user/v1/SysUser/addOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function getUserInfo(params: any) {
  return request(`/api/user/property/user/v1/queryUserInfo/${params.id}`);
}

export async function changeStatus(params: any) {
  return request(
    `/api/user/property/user/v1/changeStatus/${params.userId}?status=${params.status}`,
    {
      method: 'POST',
    },
  );
}
