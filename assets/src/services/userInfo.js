import request from '@/utils/request';
import { filterNullValueObject, handleQueryMoment } from '../utils/utils';

export async function queryId() {
  return request('/api/userInfo/getId', {
    method: 'GET',
  });
}

export async function queryUserInfo(params) {
  return request('/api/userInfo/info', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}

export async function queryAddUserInfo(params) {
  let newParams = filterNullValueObject(params); // 筛选非空参数
  newParams = handleQueryMoment(newParams, 'YYYY-MM-DD HH:mm:ss'); // 表示日期的参数格式化
  return request('/api/userInfo/add', {
    body: newParams,
    method: 'POST',
  });
}

export async function queryMobileVerify(params) {
  return request('/api/userInfo/mobileVerify', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}

export async function queryUserNameVerify(params) {
  return request('/api/userInfo/userNameVerify', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}
