import request from '@/utils/request';
import {getCookie} from "@/utils/authority";


// 查询设备分页列表
export async function querySmsEquipmentBaseInfoList(data) {
  return request('/api/construction-safe/smsEquipment/dataPage?pageSize='+data.pageSize+'&pageNum='+data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: 'GET',
  });
}
// 查询设备列表
export async function querySmsEquipmentBaseInfoListData(parmes) {
  return request('/api/construction-safe/smsEquipment/dataList?code='+parmes.code+'&name='+parmes.name+'&status='+parmes.status, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

//添加设备
export async function AddSmsEquipmentBaseInfo(params) {
  return request('/api/construction-safe/smsEquipment/save', {
    method: 'POST',
    data: params,
  });
}
//修改设备
export async function update(data) {
  return request('/api/construction-safe/smsEquipment/update', {
    method: 'PUT',
    data :data
  });
}
//删除设备
export async function RemoveSmsEquipmentBaseInfo(data) {
  return request('/api/construction-safe/smsEquipment/remove?ids='+data, {
    method: 'DELETE'
  });
}

