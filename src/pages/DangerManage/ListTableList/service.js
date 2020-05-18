import request from '@/utils/request';
import {getCookie} from "@/utils/authority";
let username=getCookie("userName");
let token=getCookie(username);


export async function queryRule(params) {
  return request('/api/construction-safe/smsDangerInfo/dataList?dangerStatus=1', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      'Authorization': "Bearer "+token,
    },
    method: 'GET'
  });
}
//逻辑删除
export async function Remove(data) {
  return request('/api/construction-safe/smsDangerRepair/remove?ids=' + data, {
    headers: {
      'Authorization': 'Bearer ' + token,
    },
    method: 'DELETE',
  });
}
