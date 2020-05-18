import request from '@/utils/request';
import { getCookie } from '@/utils/authority';

//树形结构
export async function queryRule(parmes) {
  return request('/api/construction-safe/smsEquipmentClass/findTreeList', {
    method: 'GET',
  });
}
//所有数据
export async function indexList(parmes) {
  return request(
    '/api/construction-safe/smsEquipmentClass/findTreeList?className=' + parmes.className,
    {
      method: 'GET',
    },
  );
}
//树形结构
export async function getDataList() {
  return request('/api/construction-safe/smsEquipmentClass/dataList', {
    method: 'GET',
  });
}

//保存
export async function save(data) {
  return request('/api/construction-safe/smsEquipmentClass/save', {
    method: 'POST',
    data: data,
  });
}
//修改
export async function update(data) {
  return request('/api/construction-safe/smsEquipmentClass/update', {
    method: 'PUT',
    data: data,
  });
}

//逻辑删除
export async function remove(data) {
  return request('/api/construction-safe/smsEquipmentClass/remove?ids=' + data, {
    method: 'DELETE',
  });
}

export async function equipmentList(data) {
  return request('/api/construction-safe/smsEquipment/removeByClassId?classId=' + data, {
    method: 'DELETE',
  });
}
