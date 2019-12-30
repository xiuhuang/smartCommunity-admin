import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/activity/informationManagement/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function columnPageList(params: any) {
  return request('/api/activity/columnclassification/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/activity/informationManagement/v1/batchDel', {
    method: 'POST',
    data: params,
  });
}

export async function addInfo(params: any) {
  return request('/api/activity/informationManagement/v1/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function publishOrOffline(params: any) {
  return request('/api/activity/informationManagement/v1/publishOrOffline', {
    method: 'POST',
    data: params,
  });
}

export async function infoDetail(params: any) {
  return request(`/api/activity/informationManagement/v1/detail/${params.id}`);
}
