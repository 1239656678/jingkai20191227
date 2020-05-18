import request from '@/utils/request';
import { getCookie } from '@/utils/authority';

// 查询区域绑定设备
export async function queryListByregionsId(parmes) {
  return request(
    '/api/construction-safe/smsEquipment/dataList?regionsId=' +
      parmes.id +
      '&code=' +
      parmes.code +
      '&name=' +
      parmes.name +
      '&status=' +
      parmes.status,
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'GET',
    },
  );
}

//绑定区域
export async function bindRegions(data) {
  return request(
    `/api/construction-safe/smsEquipment/bindRegions/${data.regionsId}?equipmentId=${data.equipmentId}`,
    {
      method: 'PUT',
    },
  );
}

//获取未绑定的设备
export async function noBindEquipment(params) {
  return request(
    '/api/construction-safe/smsEquipment/findEquipmentByRegionsIsNull?code=' +
      params.code +
      '&name=' +
      params.name,
    {
      headers: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: 'GET',
    },
  );
}
// 查询区域树
export async function treeData() {
  return request('/api/construction-safe/smsRegions/treeData', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
// 查询所有区域
export async function dataList(parmes) {
  return request('/api/construction-safe/smsRegions/dataList', {
    method: 'GET',
  });
}

//区域修改
export async function update(data) {
  return request('/api/construction-safe/smsRegions/update', {
    method: 'PUT',
    data: data,
  });
}

//关联生成二维码
export async function editList(data) {
  return request('/api/construction-safe/smsEquipment/save', {
    method: 'POST',
    data: data,
  });
}
//区域详情
export async function findRegionsById(params) {
  return request('/api/construction-safe/smsRegions/dataInfo?smsRegionsId=' + params, {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
//添加区域
export async function fakeSubmitForm(params) {
  return request('/api/construction-safe/smsRegions/save', {
    method: 'POST',
    data: params,
  });
}
//删除区域
export async function RemovesmsRegions(data) {
  return request('/api/construction-safe/smsRegions/remove?ids=' + data, {
    method: 'DELETE',
  });
}
