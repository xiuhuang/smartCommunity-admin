import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/mock/29/list/v1/queryPageList', {
    method: 'POST',
    data: params,
  });
}

export async function removeCar(params: any) {
  return request('/api/smart/basecarinfo/delete', {
    method: 'POST',
    data: params.ids,
  });
}

export async function queryResidentList(params: any) {
  return request('/api/smart/baseresidentinfo/list', {
    method: 'POST',
    data: params,
  });
}

export async function removeResident(params: any) {
  return request('/api/smart/baseresidentinfo/delete', {
    method: 'POST',
    data: params,
  });
}

export async function queryCarList(params: any) {
  return request('/api/smart/basecarinfo/pagelist', {
    method: 'POST',
    data: params,
  });
}

export async function queryResidentTag(params: any) {
  return request('/api/smart/basetaginfo/list', {
    method: 'POST',
    data: params,
  });
}

export async function saveTag(params: any) {
  return request('/api/smart/basetaginfo/save', {
    method: 'POST',
    data: params,
  });
}

export async function queryDetail(params: any) {
  return request('/api/smart/baseresidentinfo/detail', {
    method: 'POST',
    data: params,
  });
}

export async function addResident(params: any) {
  return request('/api/smart/baseresidentinfo/save', {
    method: 'POST',
    data: params,
  });
}

export async function getCarInfoById(params: any) {
  return request(`/api/smart/basecarinfo/info/${params.carId}`);
}

export async function getResidentInfoById(params: any) {
  return request('/api/smart/baseresidentinfo/detailForUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function getResidentInfo(params: any) {
  return request('/api/smart/baseresidentinfo/detailForUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function getCarInfoByResidentId(params: any) {
  return request(`/api/smart/basecarinfo/list/${params.residentId}`, {
    method: 'POST',
    data: params,
  });
}

export async function saveCarInfo(params: any) {
  return request(`/api/smart/basecarinfo/save/${params.residentId}`, {
    method: 'POST',
    data: params.data,
  });
}

export async function getCommunityTree() {
  return request('/api/smart/community/v1/tree/list');
}

export async function exportResidentData(params: any) {
  return request('/api/smart/baseresidentinfo/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}

export async function exportCarData(params: any) {
  return request('/api/smart/basecarinfo/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
