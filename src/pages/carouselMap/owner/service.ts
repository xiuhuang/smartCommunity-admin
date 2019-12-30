import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/banner/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function editCarousel(params: any) {
  return request('/api/smart/banner/save', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/smart/banner/delete', {
    method: 'POST',
    data: params,
  });
}

export async function publishOrOffline(params: any) {
  return request('/api/smart/banner/publish', {
    method: 'POST',
    data: params,
  });
}

export async function getDetail(params: any) {
  return request(`/api/smart/banner/info/${params.bannerId}`);
}
