import request from '@/utils/request';

//*****************维修上报模块*****************

//获取数据列表
export async function getTableList(parmes) {
  return request('/api/construction-safe/smsEquipmentFaultInfo/dataList', {
    method: 'GET',
  });
}

//删除列表
export async function deleteTableList(data) {
  return request('/api/construction-safe/smsEquipmentFaultInfo/remove?ids=' + data, {
    method: 'DELETE',
  });
}

//故障指派
export async function dispatchForm(data) {
  return request('/api/construction-safe/smsEquipmentFaultInfo/faultAssign', {
    method: 'POST',
    data: data,
  });
}
//查询维保单位
export async function searchOrganization() {
  return request('/api/dico-base/organization/findWbdw', {
    method: 'GET',
  });
}
//根据id查询维保人
export async function fetchUserById(data) {
  return request('/api/dico-base/organization/findUserByOrganizationId?organizationId=' + data, {
    method: 'GET',
  });
}

//保存提交
export async function saveSubmit(data) {
  return request('/api/construction-safe/smsEquipmentFaultInfo/save', {
    method: 'POST',
    data: data,
  });
}

//*****************维修记录模块*****************

//故障维修记录
export async function fetchRepairList(parmes) {
  return request('/api/construction-safe/smsEquipmentFaultRecord/dataList', {
    method: 'GET',
  });
}
//获取数据详情
export async function fetchRepairDetail(data) {
  return request(
    '/api/construction-safe/smsEquipmentFaultRecord/dataInfo?smsEquipmentFaultRecordId=' + data,
    {
      method: 'GET',
    },
  );
}
