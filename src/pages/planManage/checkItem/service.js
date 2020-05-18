import request from '@/utils/request';
import { getCookie } from '@/utils/authority';

//检查项
export async function queryRule(parmes) {
  return request(
    '/api/construction-safe/smsInspectionTarget/dataList?targetCode=' +
      parmes.targetCode +
      '&targetName=' +
      parmes.targetName,
    {
     
      method: 'GET',
    },
  );
}
//检查项
export async function queryList() {
  return request('/api/construction-safe/smsInspectionTarget/dataList', {
   
    method: 'GET',
  });
}
//绑定检查项
export async function bindTargets(parmes) {
  return request(
    '/api/construction-safe/smsEquipmentClass/bindTargets?equipmentClassId=' +
      parmes.equipmentClassId +
      '&targetIds=' +
      parmes.targetIds,
    {
     
      method: 'POST',
    },
  );
}
//删除检查项removeBindTargets
export async function removeBindTargets(parmes) {
  return request(
    '/api/construction-safe/smsEquipmentClass/removeBindTargets?equipmentClassId=' +
      parmes.equipmentClassId +
      '&targetIds=' +
      parmes.targetIds,
    {
     
      method: 'DELETE',
    },
  );
}
//获取绑定巡检项
export async function getbindTargets(parmes) {
  return request(
    '/api/construction-safe/smsEquipmentClass/findBindTargets?equipmentClassId=' + parmes,
    {
     
      method: 'GET',
    },
  );
}
//检查项修改
export async function update(data) {
  return request('/api/construction-safe/smsInspectionTarget/update', {
   
    method: 'PUT',
    data: data,
  });
}
//检查项保存
export async function save(params) {
  return request('/api/construction-safe/smsInspectionTarget/save', {
    
    method: 'POST',
    data: params,
  });
}
//检查项删除
export async function deletePlan(data) {
  return request('/api/construction-safe/smsInspectionTarget/remove?ids=' + data, {
    method: 'DELETE',
  });
}
