import request from '@/utils/request';
import {getCookie} from "@/utils/authority";

export async function queryRule(params) {
  return request('/api/dico-base/menu/dataList', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
export async function saveMenu(params) {
  return request('/api/dico-base/menu/save', {
   
    method: 'POST',
    data: params
  });
}
//逻辑删除
export async function deleteMenu(data) {
  return request('/api/dico-base/menu/remove?ids='+data, {
    method: 'DELETE'
  });
}
