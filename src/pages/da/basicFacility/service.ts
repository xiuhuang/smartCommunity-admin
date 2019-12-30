import request from '@/utils/request';

export async function fetchFacilityList(params: any) {
  return request('/api/smart/communitydeviceinfo/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function fetchTypeBrandTagList(params: any) {
  return request('/api/smart/communitydevicetypeinfo/v1/list', {
    method: 'POST',
    data: params,
  });
}

export async function fetchFacilityTagList(params: any) {
  return request('/api/smart/communitydevicegroupinfo/v1/list', {
    method: 'POST',
    data: params,
  });
}

export async function saveGroupTag(params: any) {
  return request('/api/smart/communitydevicegroupinfo/v1/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function fetchTypeBrandList(params: any) {
  return request('/api/smart/communitydevicebrandinfo/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function removeFacilityTag(params: any) {
  return request('/api/smart/communitydevicegroupinfo/v1/batchDel', {
    method: 'POST',
    data: params,
  });
}

export async function submitTypeBrandTag(params: any) {
  return request('/api/smart/communitydevicetypeinfo/v1/batchSaveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function removeTypeBrandTag(params: any) {
  return request('/api/smart/communitydevicetypeinfo/v1/delete', {
    method: 'POST',
    data: params,
  });
}

export async function saveFacility(params: any) {
  return request('/api/smart/communitydeviceinfo/v1/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function removeFacility(params: any) {
  return request('/api/smart/communitydeviceinfo/v1/batchDel', {
    method: 'POST',
    data: params,
  });
}

export async function saveTypeBrandForm(params: any) {
  return request('/api/smart/communitydevicebrandinfo/v1/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function removeTypeBrand(params: any) {
  return request('/api/smart/communitydevicebrandinfo/v1/batchDel', {
    method: 'POST',
    data: params,
  });
}

export async function fetchMoitoring(params: any) {
  return request('/api/smart/communitymonitorpointinfo/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function saveMoitoringForm(params: any) {
  return request('/api/smart/communitymonitorpointinfo/v1/saveOrUpdate', {
    method: 'POST',
    data: params,
  });
}

export async function removeMoitoring(params: any) {
  return request('/api/smart/communitymonitorpointinfo/v1/batchDel', {
    method: 'POST',
    data: params,
  });
}

export async function getFacilityDetail(params: any) {
  return request(`/api/smart/communitydeviceinfo/v1/detail/${params.id}`);
}

export async function getMoitoringDetail(params: any) {
  return request(`/api/smart/communitymonitorpointinfo/v1/detail/${params.id}`);
}

export async function getTypeBrandDetail(params: any) {
  return request(`/api/smart/communitydevicebrandinfo/v1/detail/${params.id}`);
}

export async function exportData(params: any) {
  return request('/api/smart/communitydeviceinfo/v1/export', {
    method: 'POST',
    data: params,
    responseType: 'blob',
  });
}
