import request from '@/utils/request';
import { getCookie } from '@/utils/authority';

let username = getCookie('userName');
let token = getCookie(username);

export async function queryRule(params) {
  return request('/api/construction-safe/smsEquipment/findEquipmentByRegionsIsNull', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: 'Bearer ' + token,
    },
    method: 'GET',
  });
}
export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}
