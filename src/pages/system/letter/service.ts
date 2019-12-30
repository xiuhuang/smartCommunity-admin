import request from '@/utils/request';

export async function queryPageList(params: any) {
  return request('/api/message/v1/pageList', {
    method: 'POST',
    data: params,
  });
}

export async function remove(params: any) {
  return request('/api/message/v1/batchDel', {
    method: 'POST',
    data: params,
  });
}

export async function messageDetail(params: any) {
  return request(`/api/message/v1/detail/${params.messageId}`);
}

export async function isRead(params: any) {
  return request('/api/message/v1/batchRead', {
    method: 'POST',
    data: params,
  });
}
