import request from '@/utils/request';
import { filterNullValueObject } from '../utils/utils';

export async function queryBirthScore(params) {
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

export async function queryScoreConsumption(params) {
  return request('/api/score/score', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}

export async function queryGiftInfo(params) {
  return request('/api/score/gift', {
    body: filterNullValueObject(params),
    method: 'POST',
  });
}
