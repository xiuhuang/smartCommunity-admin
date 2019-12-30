import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/basecompanyinfo/pagelist', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/smart/basecompanyinfo/delete', {
    method: 'POST',
    data: params.ids,
  });
}

export async function addOrEdit(params: any) {
  return request('/api/smart/basecompanyinfo/save', {
    method: 'POST',
    data: params,
  });
}

// 获取详情
export async function getEditDetail(params: any) {
  return request(`/api/smart/basecompanyinfo/detail/${params.companyId}`);
}

export async function baseComMemberList(params: any) {
  return request('/api/smart/baseComMemberinfo/pagelist', {
    method: 'POST',
    data: params,
  });
}

export async function addOrEditMember(params: any) {
  return request('/api/smart/baseComMemberinfo/save', {
    method: 'POST',
    data: params,
  });
}

export async function removeMember(params: any) {
  return request('/api/smart/baseComMemberinfo/delete', {
    method: 'POST',
    data: params.ids,
  });
}

export async function queryCarList(params: any) {
  return request('/api/smart/basecompanyinfo/car/pagelist', {
    method: 'POST',
    data: params,
  });
}

// 新增车辆
export async function addOrEditCar(params: any) {
  return request('/api/smart/basecompanyinfo/saveOrUpdateCar', {
    method: 'POST',
    data: params,
  });
}
// 新增车辆详情

export async function getCarInfo(params: any) {
  return request(`/api/smart/basecarinfo/info/${params.carId}`);
}

export async function getResidentInfo(params: any) {
  return request('/api/smart/baseresidentinfo/detailForUpdate', {
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

export async function getCarTags(params: any) {
  return request('/api/smart/basetaginfo/list', {
    method: 'POST',
    data: params,
  });
}

export async function exportFile(params: any) {
  return request('/api/smart/basecompanyinfo/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
