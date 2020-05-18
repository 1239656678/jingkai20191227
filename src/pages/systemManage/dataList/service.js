import request from '@/utils/request';
import { getCookie } from '@/utils/authority';

//数据字典
export async function queryRule(params) {
  return request('/api/dico-base/data/dataList', {
    method: 'GET',
  });
}

//保存
export function saveDataList(data) {
  return request('/api/dico-base/data/save', {
    method: 'POST',
    data : data
  });
}
//修改
export async function updateDataList(data) {
  return request('/api/dico-base/data/update', {
    method: 'PUT',
    data: data,
  });
}

//逻辑删除
export async function removeDataList(data) {
  return request('/api/dico-base/data/remove?ids='+data, {
    method: 'DELETE'
  });
}


//----------------------------数据类型--------------------------------
export async function queryTypeRule(params) {
  return request('/api/dico-base/dataType/dataList', {
    method: 'GET',
  });
}

//保存
export function saveDataTypeList(data) {
  return request('/api/dico-base/dataType/save', {
    method: 'POST',
    data : data
  });
}
//修改
export async function updateDataTypeList(data) {
  return request('/api/dico-base/dataType/update', {
    method: 'PUT',
    data: data,
  });
}

//逻辑删除
export async function removeDataTypeList(data) {
  return request('/api/dico-base/dataType/remove?ids='+data, {
    method: 'DELETE'
  });
}