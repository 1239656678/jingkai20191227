import request from '@/utils/request';
export async function query() {
  return request('/api/users');
}
// export async function queryCurrent() {
//   return request('/api/currentUser');
// }
export async function queryNotices() {
  return request('/api/notices');
}
// 获取当前登录人权限菜单
export function findCurrentMenu(token) {
  return request('/api/dico-base/menu/findCurrentMenu', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'Authorization': token,
    },
    method: 'GET',
  });
}
// 获取当前登录人信息
export function queryCurrent(token) {
  return request('/api/dico-base/user/getLoginUser', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'Authorization': token,
    },
    method: 'GET',
  });
}

//首页头部
export function getHeaderData(token) {
  return request('/api/construction-safe/home/statistics', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'Authorization': token,
    },
    method: 'GET',
  });
}

//首页底部隐患检测
export function fetchDangerCheckResult(token) {
  return request('/api/construction-safe/home/dangerStatistics', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'Authorization': token,
    },
    method: 'GET',
  });
}

//首页设备统计饼状图
export function getindexData(token) {
  return request('/api/construction-safe/home/equipmentClassStatistics', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'Authorization': token,
    },
    method: 'GET',
  });
}

// //首页柱状图统计
export function fetchBarList(token) {
  return request('/api/construction-safe/home/repairStatistics', {
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'Authorization': token,
    },
    method: 'GET',
  });
}
