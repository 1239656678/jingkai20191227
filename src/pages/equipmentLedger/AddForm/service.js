import request from '@/utils/request';
import {getCookie} from "@/utils/authority";
let username=getCookie("userName");
let token=getCookie(username);


export async function fakeSubmitForm(params) {
  return request('/api/construction-safe/smsEquipment/save', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      'Authorization': "Bearer "+token,
    },
    method: 'POST',
    data: params,
  });
}
