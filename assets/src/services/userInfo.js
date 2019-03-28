import request from '@/utils/request';
import { filterNullValueObject } from '../utils/utils';

export async function queryUserInfo(params) {
  return request('/api/score/birth', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}

export async function queryConsumptionScore(params) {
  return request('/api/score/consumption', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}
