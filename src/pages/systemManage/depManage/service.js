import request from '@/utils/request';
import {getCookie} from "@/utils/authority";



export async function queryRule(params) {
  return request('/api/dico-base/organization/findTreeList?name='+params.name, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
/**
 * 查询部门列表
 * @param data
 * @returns {Promise<*>}
 */
export function queryCompanyList(data) {
  return request('/api/dico-base/organization/dataPage?name='+data.name+'&pageNum=' + data.pageNum, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
//保存部门
export function saveDep(data) {
  return request('/api/dico-base/organization/save', {
    method: 'POST',
    data : data
  });
}
//逻辑删除
export async function removeDep(data) {
  return request('/api/dico-base/organization/remove?ids='+data, {
    method: 'DELETE'
  });
}

/**
 * 根据单位ID查询组织机构
 * @param data
 * @returns {Promise<*>}
 */
export function getOrganizationsById(data) {
  return request('/api/dico-base/organization/findTreeList?companyId='+data.id, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

export async function treeListDate() {
  return request('/api/dico-base/organization/findTreeList', {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}


export async function findUserByOrganizationId(data) {
  return request('/api/dico-base/organization/findUserByOrganizationId?organizationId='+data, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}
//修改部门数据/organization/update
export async function updateDept(data) {
  return request('/api/dico-base/organization/update', {
    method: 'PUT',
    data: data,
  });
}



//绑定部门负责人
export async function bindOrganizationUser(params) {
  return request('/api/dico-base/organization/bindOrganizationUser?organizationId='+params.organizationId+'&userIds='+params.userIds, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'POST',
    body:params
  });
}

//解除部门的负责人    
export async function removeOrganizationUser(params) {
  return request('/api/dico-base/organization/removeOrganizationUser?organizationId='+params.organizationId+'&userIds='+params.userIds, {
    method: 'POST',
    params:params
  });
}

//获取部门领导人     /organization/findOrganizationUser?organizationId=1
export function findOrganizationUser(data) {
  return request('/api/dico-base/organization/findOrganizationUser?organizationId='+data, {
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
    method: 'GET',
  });
}

