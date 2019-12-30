import request from '@/utils/request';

export async function getTreeList() {
  return request('/api/user/sysDept/v1/treeData', {
    method: 'POST',
  });
}

export async function queryPageList(params: any) {
  return request('/mock/29/list/v1/queryPageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request(`/api/user/sysDept/v1/remove/${params.deptId}`, {
    method: 'POST',
  });
}

export async function add(params: any) {
  return request('/api/user/sysDept/v1/add', {
    method: 'POST',
    data: params,
  });
}

export async function edit(params: any) {
  return request('/api/user/sysDept/v1/edit', {
    method: 'POST',
    data: params,
  });
}

export async function deptDetail(params: any) {
  return request(`/api/user/sysDept/v1/detail/${params.deptId}`, {
    method: 'POST',
  });
}
