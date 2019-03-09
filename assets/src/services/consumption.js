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
