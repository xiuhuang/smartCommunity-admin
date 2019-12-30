import request from '../../utils/request';

// export async function getOwnership(params: any) {
//   return request('/mock/29/list/v1/queryPageList', {
//     method: 'POST',
//     data: params,
//   });
// }

// export async function remove(params: any) {
//   return request('/mock/29/list/v1/remove', {
//     method: 'POST',
//     data: params,
//   });
// }

export async function getOwnership() {
  return request('/mock/29/board/v1/getOwnership');
}
// 感知元素数据
export async function getElementData() {
  return request('/mock/29/board/v1/getElement');
}
