import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/activity/activityinfo/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function audit(params: any) {
  return request('/api/activity/activityinfo/v1/audit', {
    method: 'POST',
    data: params,
  });
}

export async function getDetail(params: any) {
  return request(`/api/activity/activityinfo/v1/info/${params.activityId}`);
}
