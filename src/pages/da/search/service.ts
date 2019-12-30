import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/smart/es/search', {
    method: 'POST',
    data: params,
  });
}

export async function getFacilityDetail(params: any) {
  return request(`/api/smart/communitydeviceinfo/v1/detail/${params.id}`);
}

// export async function queryHistoryList(params: any) {
//   return request('/mock/29/list/v1/queryPageList', {
//     method: 'POST',
//     data: params,
//   });
// }
