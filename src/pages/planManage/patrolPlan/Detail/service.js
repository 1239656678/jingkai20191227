import request from '@/utils/request';

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

//检查计划
export async function queryRule(parmes) {
  return request(
    '/api/construction-safe/smsInspectionPlan/dataList?planType=false&planCode=' +
      parmes.planCode +
      '&planName=' +
      parmes.planName,
    {
      method: 'GET',
    },
  );
}

//检查计划详情页

export async function queryByIdGetDetail(parmes) {
  return request(
    '/api/construction-safe/smsInspectionStatus/findInspectionInfoByUserPlanId?id=' + parmes.id,
    {
      method: 'GET',
    },
  );
}
