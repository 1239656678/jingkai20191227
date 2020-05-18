import request from '@/utils/request';

//获取数据列表
export async function fetchSecurityReportList(data) {
  return request(
    `/api/construction-safe/wordInfo/dataList?type=${
      data.type != undefined ? data.type : ''
    }&name=${data.name ? data.name : ''}`,
    {
      method: 'GET',
    },
  );
}

//新增保存
export async function addSaveReport(data) {
  return request(
    `/api/construction-safe/wordInfo/generatorWord?isYear=${data.isYear}&year=${data.year}`,
    {
      method: 'GET',
    },
  );
}
//提交
export async function submitReport(data) {
  return request(
    `/api/construction-safe/wordInfo/generatorWord?isYear=${data.isYear}&year=${data.year}&quarter=${data.quarter}`,
    {
      method: 'GET',
    },
  );
}
