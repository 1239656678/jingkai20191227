import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import React, { Component, Suspense } from 'react';
import styles from '../style.less';
import echarts from 'echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { connect } from 'dva';

class SaftCheck extends Component {
  state = {
    dangerCheckArr: [],
  };
  componentDidMount() {
    this.props
      .dispatch({
        type: 'global/fetchDangerCheck',
      })
      .then(() => {
        const data = this.props.dangerDataCheckList.payload.data;
        const dataList = [];
        const dangerNum = []; //隐患量
        const repairNum = []; //整改量
        const reviewNum = []; //复查量
        //x轴数据
        // console.log('data======', data);
        if (data !== []) {
          for (let i in data) {
            for (let j in data[i]) {
              if (j == 'datetime') {
                dataList.push(data[i][j]);
              } else if (j == 'dangerNum') {
                //隐患数量
                dangerNum.push(data[i][j]);
              } else if (j == 'reviewNum') {
                reviewNum.push(data[i][j]);
              } else {
                repairNum.push(data[i][j]);
              }
            }
          }
        } else {
          dangerNum = [1, 2, 2, 3]; //隐患量
          repairNum = [2, 3, 4, 5, 6]; //整改量
          reviewNum = [2, 3, 2, 2, 3, 4];
        }

        // console.log('dangerNum11', dangerNum);
        // console.log('repairNum22', repairNum);
        // console.log('reviewNum33', reviewNum);

        const myChart = echarts.init(document.getElementById('main'));
        // 绘制图表
        myChart.setOption({
          title: {
            text: '隐患检测',
            textStyle: {
              color: '#333333',
              fontWeight: 'bold',
              fontSize: 24,
            },
          },
          tooltip: {
            trigger: 'axis',
            // axisPointer: {
            //     type: 'shadow',
            // },
          },
          color: ['#F7BF6E', '#6A93FF', '#0AC5E1'],
          legend: {
            data: ['隐患量', '复查量', '整改量'],
            right: 10,
            top: 10,
            textStyle: {
              color: '#666666',
              fontSize: 16,
            },
            icon: 'circle',
            itemWidth: 16,
            itemHeight: 16,
            itemGap: 35,
          },
          grid: {
            left: '0.6%',
            right: '4%',
            bottom: '5%',
            top: '15%',
            containLabel: true,
          },
          xAxis: [
            {
              type: 'category',
              // data: ['2020-1','2020-2','2020-3'],
              data:
                dataList.length > 1
                  ? dataList
                  : ['2019-6', '2019-7', '2019-8', '2019-10', '2019-11'],
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#E1E1E1',
                  width: 1,
                  type: 'solid',
                },
              },
              axisTick: {
                show: false,
              },
              axisLabel: {
                show: true,
                textStyle: {
                  color: '#666666',
                  fontSize: 16,
                },
              },
            },
          ],
          yAxis: [
            {
              type: 'value',
              // boundaryGap : [ 0, 6 ],
              nameTextStyle: {
                color: '#666666',
              },
              offset: 0,
              axisLabel: {
                // formatter: '{value} %',
                color: '#666666',
              },
              axisTick: {
                show: false,
              },
              axisLine: {
                show: false,
                lineStyle: {
                  color: '#12fffe',
                  width: 1,
                  type: 'solid',
                },
              },
              splitLine: {
                lineStyle: {
                  color: '#E1E1E1',
                  width: 1,
                  type: 'dashed',
                },
              },
            },
          ],
          series: [
            {
              name: '隐患量',
              type: 'line',
              // data: [2,2],
              data: dangerNum.length > 1 ? dangerNum : [2, 2, 3, 3, 2, 2, 4],
              smooth: true,
              symbolSize: 0,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(137, 189, 27, 0.3)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(137, 189, 27, 0)',
                      },
                    ],
                    false,
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10,
                },
              },
            },
            {
              name: '复查量',
              type: 'line',
              // data: [0,1],
              data: reviewNum.length > 1 ? reviewNum : [2, 2, 3, 3, 4, 4, 5],
              smooth: true,
              symbolSize: 0,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(0, 136, 212, 0.3)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(0, 136, 212, 0)',
                      },
                    ],
                    false,
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10,
                },
              },
            },
            {
              name: '整改量',
              type: 'line',
              // data: [1,2],
              data: repairNum.length > 1 ? repairNum : [1, 1, 2, 3, 3, 4],
              smooth: true,
              symbolSize: 0,
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: 'rgba(247,191,110,1)',
                      },
                      {
                        offset: 0.8,
                        color: 'rgba(255,255,255,1)',
                      },
                    ],
                    false,
                  ),
                  shadowColor: 'rgba(0, 0, 0, 0.1)',
                  shadowBlur: 10,
                },
              },
            },
          ],
        });
      });
  }

  render() {
    return (
      <div>
        <div
          id="main"
          style={{
            width: '100%',
            height: 410,
            background: '#FFFFFF',
            padding: '12px',
            boxShadow: '0px 4px 3px rgba(187,187,187,0.2)',
          }}
        ></div>
      </div>
    );
  }
}

export default connect(({ global }) => ({
  dangerDataCheckList: global.fetchDangerCheckDataList,
}))(SaftCheck);
