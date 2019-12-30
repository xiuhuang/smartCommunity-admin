import request from '@/utils/request';
// import { stringify } from 'qs';

// 用户向应用服务器请求上传Policy和回调。
export async function querySendRequest(params: any) {
  return request(`/api/web/oss/v1/configs?category=${params}`);
}

export async function fetchLevel(params: any) {
  return request(
    `/api/smart/community/v1/child/level?levelId=${params.levelId}&level=${params.level}`,
  );
}

export async function getDepartMent() {
  return request('/api/user/sysDept/v1/treeData', {
    method: 'POST',
  });
}

// 用户向应用服务器请求上传Policy和回调。
export async function getOssConfig(params: any) {
  return request(`/api/web/oss/v1/configs?category=${params.category}`);
}
