/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, message } from 'antd';
import { getAccessToken, getLoginName, getCommunityId, getUserId } from '@/utils/token';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
// var window: Window & typeof globalThis;
/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

// request
request.interceptors.request.use((url: string, options: any) => {
  const token = getAccessToken();
  const loginName = getLoginName();
  const userId = getUserId();
  const communityId = getCommunityId();
  if (token) {
    options.headers['x-auth-token'] = token;
  }
  if (loginName) {
    options.headers.loginName = loginName;
  }
  if (userId) {
    options.headers.userId = userId;
  }
  if (communityId) {
    options.headers.communityId = communityId;
  }
  options.headers.osType = '1';
  return {
    url,
    options: { ...options, interceptors: true },
  };
});
// response
request.interceptors.response.use(async (response, options) => {
  if (options.responseType === 'blob') {
    return response;
  }
  const data = await response.clone().json();
  if (data.code === '200') {
    // 成功
    return response;
  }
  if (data.code === '4010100002') {
    // refreshToken 失效
    if (getAccessToken()) {
      notification.error({
        message: '未登录或登录已过期，请重新登录。',
      });
    }
  }
  if (data.code === '4010100001' || data.code === '0010100001' || data.code === '4010100002') {
    // @HACK
    /* eslint no-underscore-dangle: ["error", { "allow": ["_store", "g_app"] }] */
    if (window.g_app) {
      window.g_app._store.dispatch({
        type: 'login/logout',
      });
      return response;
    }
  }
  // 其他失败统一处理
  if (response.status === 200) {
    message.error(data.message);
  }
  return response;
});

export default request;
