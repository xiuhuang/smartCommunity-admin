import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/user/sysRole/v1/pagelist', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/user/sysRole/v1/remove', {
    method: 'POST',
    data: params,
  });
}

export async function addRole(params: any) {
  return request('/api/user/sysRole/v1/add', {
    method: 'POST',
    data: params,
  });
}

export async function editRole(params: any) {
  return request('/api/user/sysRole/v1/edit', {
    method: 'POST',
    data: params,
  });
}

export async function getAllMenu(params: any) {
  return request(`/api/user/sysMenu/v1/queryAllMenuByRoleId?roleId=${params.roleId}`);
}

export async function savePremission(params: any) {
  return request('/api/user/sysRole/v1/batchInsetRoleMenu', {
    method: 'POST',
    data: params,
  });
}
