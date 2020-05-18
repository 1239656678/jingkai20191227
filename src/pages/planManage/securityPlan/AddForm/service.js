import request from '@/utils/request';
import {getCookie} from "@/utils/authority";

let username=getCookie("userName");
let token=getCookie(username);
//检查计划
export async function queryRule() {
  return request('/api/construction-safe/smsInspectionPlan/dataList', {
    headers: {
      'Authorization': "Bearer "+token,
    },
    method: 'GET'
  });
}
//检查计划保存
export async function save(params) {
  return request('/api/construction-safe/smsInspectionPlan/save', {
    headers: {
      'Authorization': "Bearer "+token,
    },
    method: 'POST',
    data : params,
  });
}
//检查计划删除
export async function deletePlan(data) {
  return request('/api/construction-safe/smsInspectionPlan/remove?ids='+data, {
    headers: {
      'Authorization': "Bearer "+token,
    },
    method: 'DELETE'
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
