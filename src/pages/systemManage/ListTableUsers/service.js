import request from '@/utils/request';
import { getCookie } from '@/utils/authority';


export async function queryRule(params) {
  return request('/api/dico-base/user/dataList?username='+''+'&name='+params.name+'&organizationId='+'', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'GET',
  });
}
/**
 * 查询用户列表
 * @param data
 * @returns {Promise<*>}
 */
export function getUserList(data) {
  return request('/api/dico-base/user/dataList?username='+''+'&name='+''+'&organizationId='+'', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
/**
 * 新增用户
 * @param data
 * @returns {Promise<*>}
 */
export function saveUser(data) {
  return request('/api/dico-base/user/save', {
    headers: {
      "content-type": "application/json",
    },
    method: 'POST',
    body:JSON.stringify(data)
  });
}

/**
 * 删除用户
 * @param data
 * @returns {Promise<*>}
 */
export function deleteUser(data) {
 
  return request('/api/dico-base/user/remove?ids='+data, {
    method: 'DELETE',
  });
}
//上传头像
export function uploadImage(data) {
  return request('/api/dico-base/upload/image', {
    headers: {
      "Content-Type":"multipart/form-data; boundary=----WebKitFormBoundaryXLzd8RPNSt45cPZa",
    },
    method: 'POST',
    body: data,
  });
}
/**
 * 修改用户
 * @param data
 * @returns {Promise<*>}
 */
export function updateUser(data) {
  return request('/api/dico-base/user/update', {
    headers: {
      "content-type": "application/json",
     
    },
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * 获取用户当前绑定角色
 * @param data
 * @returns {Promise<*>}
 */
export function getBindRoles(data) {
  return request('/api/dico-base/user/getBindRoles?userId=' + data, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      
    },
    method: 'GET',
  });
}

/**
 * 查询全部角色列表
 * @param data
 * @returns {Promise<*>}
 */
export function getRolesList(data) {
  return request('/api/dico-base/role/dataList?code=' + data.code + '&name=' + data.name, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      
    },
    method: 'GET',
  });
}
//逻辑删除
export async function deleteRole(data) {
  return request('/api/dico-base/user/removeUserRole?userId='+data.userId+'&roleId='+data.roleId, {
    method: 'DELETE'
  });
}

/**
 * 用户绑定角色
 * @param data
 * @returns {Promise<*>}
 */
export async function bindRoles(params) {
  return request('/api/dico-base/user/bindRoles?'+params, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'POST',
    body:params
  });
}