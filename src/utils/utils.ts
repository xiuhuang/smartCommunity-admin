import { parse } from 'querystring';

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export function getUrlQuery(url: any) {
  return parse(url.split('?')[1]);
}

export function getUrlPath(url: any) {
  return url.split('?')[0];
}

export function exportFile(url: any) {
  try {
    const elemIF = document.createElement('iframe');
    elemIF.src = url;
    elemIF.style.display = 'none';
    document.body.appendChild(elemIF);
  } catch (e) {
    throw new Error('下载失败拉');
  }
}

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * post方式下载文件
 * @param  {[string]} url  接口
 * @param  {[json]} data 数据
 * @return
 */
export function downloadExcelForPost(data: any, fileName: any) {
  const blob = new Blob([data], { type: 'application/vnd.ms-excel' });
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href); // 释放URL 对象
  document.body.removeChild(elink);
}
// 登录公钥
export const pubkey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCLRpYnbsZrtih/ceTFzON8IlbjHkvPKinJAEXa5XxntFb6eKBr0QoFuIvXyBb3ee2IxtrmX3HyxA7WH0LZxDCH8YhySCc0ieXAafasxtCt7kRHOYCC4uJpEFEmw0sbluwvon+beYeWNdJVXS6JC9iTS6LaJMTJoNybZzvssHC0eQIDAQAB';

export function removeHtml(content: string) {
  const temp: any = content.replace(/<\/?.+?>/g, '');
  const result: any = temp.replace(/ /g, ''); // result为得到后的内容
  return result;
}
