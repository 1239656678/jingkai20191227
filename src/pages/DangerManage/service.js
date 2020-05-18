import request from '@/utils/request';
import { getCookie } from '@/utils/authority';

export async function queryRule(params) {
  return request(
    '/api/construction-safe/smsDangerInfo/dataList?dangerStatus=' +
      params.dangerStatus +
      '&remark=' +
      params.remark +
      '&dangerAddress=' +
      params.dangerAddress,
    {
      method: 'GET',
    },
  );
}
//获取隐患详情信息GET
export async function getRepairInfo(params) {
  return request('/api/construction-safe/smsDangerInfo/getRepairInfo?dangerId=' + params, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
//指派整改保存/smsDangerInfo/assignRepair
export async function assignRepair(params) {
  return request('/api/construction-safe/smsDangerInfo/assignRepair', {
    method: 'POST',
    data: params,
  });
}
//指派复查
export async function assignReview(params) {
  return request('/api/construction-safe/smsDangerInfo/assignReview', {
    method: 'POST',
    data: params,
  });
}
//根据隐患id获取整改信息/smsDangerRepair/getRepairByDangerId?smsDangerId=
export async function getRepairByDangerId(params) {
  return request(
    '/api/construction-safe/smsDangerRepair/getRepairByDangerId?smsDangerId=' + params,
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
    },
  );
}
//根据隐患id获取复查信息/smsDangerReview/getReviewByDangerId?smsDangerId=
export async function getReviewByDangerId(params) {
  return request(
    '/api/construction-safe/smsDangerReview/getReviewByDangerId?smsDangerId=' + params,
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'GET',
    },
  );
}
//逻辑删除
export async function RemovesmsDanger(data) {
  return request('/api/construction-safe/smsDangerInfo/remove?ids=' + data, {
    method: 'DELETE',
  });
}
