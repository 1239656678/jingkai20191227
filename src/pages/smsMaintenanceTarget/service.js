import request from '@/utils/request';
import { getCookie } from '@/utils/authority';

//获取数据列表
export async function getTableList(data) {
  return request('/api/construction-safe/smsMaintenanceTarget/dataList', {
    method: 'GET',
    data: data,
  });
}
//新增提交
export async function submitList(data) {
  return request('/api/construction-safe/smsMaintenanceTarget/save', {
    method: 'POST',
    data: data,
  });
}
//编辑
export async function updateList(data) {
  return request('/api/construction-safe/smsMaintenanceTarget/update', {
    method: 'PUT',
    data: data,
  });
}
//保养标准删除
export async function deleteList(data) {
  return request('/api/construction-safe/smsMaintenanceTarget/remove?ids=' + data, {
    method: 'DELETE',
  });
}

//保养计划模块
export async function getMaintenance(data) {
  return request('/api/construction-safe/smsMaintenancePlan/dataList', {
    method: 'GET',
    data: data,
  });
}

//新增保存
export async function addPlanSave(data) {
  return request('/api/construction-safe/smsMaintenancePlan/save', {
    method: 'POST',
    data: data,
  });
}
//修改保存
export async function updatePlanSave(data) {
  return request('/api/construction-safe/smsMaintenancePlan/update', {
    method: 'PUT',
    data: data,
  });
}
//删除列表
export async function deletePlanList(data) {
  return request('/api/construction-safe/smsMaintenancePlan/remove?ids=' + data, {
    method: 'DELETE',
  });
}
//查询设备类型
export async function fetchClassName(data) {
  return request('/api/construction-safe/smsEquipmentClass/findTreeList', {
    method: 'GET',
    data: data,
  });
}
//根据设备类型查设备
export async function fetchEquipment(data) {
  return request('/api/construction-safe/smsEquipment/findByClassId?classId=' + data, {
    method: 'GET',
  });
}

//保养记录模块
export async function fetchRecord(data) {
  return request('/api/construction-safe/smsUserMaintenancePlan/dataList', {
    method: 'GET',
  });
}
//保养记录详情
export async function fetchRecordDetail(data) {
  return request(
    '/api/construction-safe/smsUserMaintenancePlan/dataInfo?smsUserMaintenancePlanId=' + data,
    {
      method: 'GET',
    },
  );
}

//查询维保单位
export async function searchOrganization(data) {
  return request('/api/dico-base/organization/findWbdw', {
    method: 'GET',
  });
}
//根据维保单位查询维保人
export async function fetchUserById(data) {
  return request('/api/dico-base/organization/findUserByOrganizationId?organizationId=' + data, {
    method: 'GET',
  });
}
//根据设备分类ID查询设备
export async function fetchTypeById(data) {
  return request('/api/dico-base/organization/smsEquipment/findByClassId?classId=' + data, {
    method: 'GET',
  });
}
