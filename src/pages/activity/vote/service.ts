import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/activity/vote/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/activity/vote/v1/delete', {
    method: 'POST',
    data: params,
  });
}

export async function getTableDetail(params: any) {
  return request(`/api/activity/vote/v1/info/${params.voteId}`);
}

export async function publish(params: any) {
  return request('/api/activity/vote/v1/publish', {
    method: 'POST',
    data: params,
  });
}

export async function addActivity(params: any) {
  return request('/api/activity/vote/v1/save', {
    method: 'POST',
    data: params,
  });
}

// 居民活动审核
export async function auditPageList(params: any) {
  return request('/api/activity/activityinfo/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function canEdit(params: any) {
  return request(`/api/activity/vote/v1/canEdit/${params.voteId}`);
}
