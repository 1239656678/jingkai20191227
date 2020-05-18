import request from '@/utils/request';
import {getCookie} from "@/utils/authority";

let username=getCookie("userName");
let token=getCookie(username);

export async function queryRule(params) {
  return request('/api/construction-safe/smsEquipment/findEquipmentByRegionsIsNull?code='+params.code+'&name='+params.name, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      'Authorization': "Bearer "+token,
    },
    method: 'GET',
  });
}
