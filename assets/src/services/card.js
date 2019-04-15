import request from '@/utils/request';
import { filterNullValueObject, handleQueryMoment } from '../utils/utils';

export async function queryCardLost(params) {
  return request('/api/card/lost', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}

export async function queryCardCharge(params) {
  return request('/api/card/charge', {
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
