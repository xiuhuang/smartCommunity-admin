import request from '@/utils/request';

export async function resetPwd(params: any) {
  return request('/api/user/property/user/v1/resetPwd', {
    method: 'POST',
    data: params,
  });
}
