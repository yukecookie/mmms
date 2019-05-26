import request from '@/utils/request';
import { filterNullValueObject, handleQueryMoment, handleQueryMulti } from '../utils/utils';

export async function queryAllUsers() {
  return request('/api/users/allUsers');
}

export async function queryTag(params) {
  return request('/api/consumption/queryTag', {
    body: { cardNums: params },
    method: 'POST',
  });
}

export async function queryConsumptionInfo(params) {
  let newParams = filterNullValueObject(params); // 筛选非空参数
  newParams = handleQueryMulti(newParams); // 参数拆分
  newParams = handleQueryMoment(newParams, 'YYYY-MM-DD HH:mm:ss'); // 表示日期的参数格式化
  return request('/api/consumption/info', {
    body: newParams,
    method: 'POST',
  });
}
export async function queryAddConsumptionInfo(params) {
  let newParams = filterNullValueObject(params); // 筛选非空参数
  newParams = handleQueryMoment(newParams, 'YYYY-MM-DD HH:mm:ss'); // 表示日期的参数格式化
  return request('/api/consumption/add', {
    body: newParams,
    method: 'POST',
  });
}

export async function queryDeleteConsumptionInfo(params) {
  return request('/api/consumption/refund', {
    body: params,
    method: 'POST',
  });
}

export async function queryOrderCodeVerify(params) {
  return request('/api/userInfo/oderCodeVerify', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}

export async function queryCardNumVerify(params) {
  return request('/api/userInfo/cardNumVerify', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}
