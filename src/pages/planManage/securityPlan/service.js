import request from '@/utils/request';
import {getCookie} from "@/utils/authority";

//检查计划
export async function queryRule(parmes) {
  return request('/api/construction-safe/smsInspectionPlan/dataList?planType=true&planCode='+parmes.planCode+'&planName='+parmes.planName, {
   
    method: 'GET'
  });
}
//检查计划保存
export async function save(params) {
  return request('/api/construction-safe/smsInspectionPlan/save', {
   
    method: 'POST',
    data : params,
  });
}
//修改
export async function update(data) {
  return request('/api/construction-safe/smsInspectionPlan/update', {
   
    method: 'PUT',
    data :data
  });
}
//检查计划删除
export async function deletePlan(data) {
  return request('/api/construction-safe/smsInspectionPlan/remove?ids='+data, {
    method: 'DELETE'
  });
}

