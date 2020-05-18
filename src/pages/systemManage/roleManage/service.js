import request from '@/utils/request';
import {getCookie} from "@/utils/authority";


export async function queryRule(data) {
  return request('/api/dico-base/role/dataList?code='+data.code+'&name='+data.name, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      
    },
    method: 'GET',
  });
}
//获取所有菜单
export async function getAllMenuList() {
  return request('/api/dico-base/menu/dataList', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
//获取角色绑定的菜单
export async function getBindMenus(params) {
  return request('/api/dico-base/role/getBindMenus?roleId='+params, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

export async function saveRole(params) {
  return request('/api/dico-base/role/save', {
    
    method: 'POST',
    data : params,
  });
}

export async function setbindMenus(params) {
  return request('/api/dico-base/role/bindMenus?'+params, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'POST',
    body:params
  });
}
//修改角色
export async function updateRole(data) {
  return request('/api/dico-base/role/update', {
    method: 'PUT',
    data: data,
  });
}

//逻辑删除
export async function deleteRole(data) {
  return request('/api/dico-base/role/remove?ids='+data, {
    method: 'DELETE'
  });
}

