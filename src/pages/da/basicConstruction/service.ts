import request from '@/utils/request';

export async function getTreeList() {
  return request('/api/smart/community/v1/tree/list');
}

// 增加树
export async function addcommunity(params: any) {
  return request('/api/smart/community/v1/save', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/smart/community/v1/delete', {
    method: 'POST',
    data: params,
  });
}

export async function getTableDetail(params: any) {
  return request(`/api/smart/community/v1/info/${params.level}/${params.levelId}`);
}

export async function editTableDetail(params: any) {
  return request('/api/smart/community/v1/update', {
    method: 'POST',
    data: params,
  });
}

// 社区服务建设
export async function addServeData(params: any) {
  return request('/api/web/serviceBuildInfo/v1/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

// 列表
export async function queryPageList(params: any) {
  return request('/api/web/serviceBuildInfo/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

// 删除社区服务建设
export async function removePageItem(params: any) {
  return request('/api/web/serviceBuildInfo/v1/delete', {
    method: 'POST',
    data: params,
  });
}

export async function exportData(params: any) {
  return request('/api/web/serviceBuildInfo/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
