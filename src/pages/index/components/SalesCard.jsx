import { Card, Col, DatePicker, Row, Tabs } from 'antd';
import React, { Component, Suspense } from 'react';
import styles from '../style.less';
import echarts from 'echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { connect } from 'dva';

// const equipmentPercent= [
//   {value:335, legendname:'种类01',name:"种类01  335",itemStyle:{color:"#8d7fec"}},
//   {value:310, legendname:'种类02',name:"种类02  310",itemStyle:{color:"#5085f2"}},
// ]
class SalesCard extends Component {
  componentDidMount() {
    //柱状图数据
    this.props
      .dispatch({
        type: 'global/fetchBarDataResult',
      })
      .then(() => {
        // console.log('柱状图数据======', this.props.fetchBarDataList.payload.data);
        const dateTime = [];
        const dangerNum = []; //隐患量
        const repairNum = []; //整改量
        const data = this.props.fetchBarDataList.payload.data;
        //x轴数据
        for (let i in data) {
          for (let j in data[i]) {
            if (j == 'datetime') {
              dateTime.push(data[i][j]);
            } else if (j == 'dangerNum') {
              //隐患数量
              dangerNum.push(data[i][j]);
            } else {
              repairNum.push(data[i][j]);
            }
          }
        }

        const barChart = echarts.init(document.getElementById('bar'));
        var barOption = {
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: '', // 默认为直线，可选为：'line' | 'shadow'
            },
          },
          title: {
            text: '整改优化',
            textStyle: {
              color: '#333333',
              fontWeight: 'bold',
              fontSize: 24,
            },
            left: '2%',
          },
          grid: {
            left: '2%',
            right: '4%',
            bottom: '14%',
            top: '16%',
            containLabel: true,
          },
          legend: {
            data: ['当前隐患', '当前整改'],
            right: 10,
            top: 12,
            textStyle: {
              color: '#666666',
              fontSize: 16,
            },
            icon: 'circle',
            itemWidth: 12,
            itemHeight: 10,
            // itemGap: 35
          },
          xAxis: {
            type: 'category',
            data: dateTime[0] ? dateTime : ['2020-1', '2020-2', '2020-3'],
            axisLine: {
              lineStyle: {
                color: '#BBBBBB',
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              textStyle: {
                fontFamily: 'Microsoft YaHei',
              },
            },
          },

          yAxis: {
            type: 'value',
            // max: dangerNum[0]?'30',
            // splitNumbwe:6,
            axisLine: {
              show: false,
              lineStyle: {
                color: '#BBBBBB',
              },
            },
            axisTick: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#E1E1E1',
                width: 1,
                type: 'dashed',
              },
            },
            axisLabel: {},
          },
          dataZoom: [
            {
              show: false, //是否显示下方滚动条
              height: 12,
              xAxisIndex: [0],
              bottom: '8%',
              start: 10,
              end: 90,
              handleIcon:
                'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
              handleSize: '110%',
              handleStyle: {
                color: '#d3dee5',
              },
              textStyle: {
                color: '#666666',
              },
              borderColor: '#90979c',
            },
            {
              type: 'inside',
              show: true,
              height: 15,
              start: 1,
              end: 35,
            },
          ],
          series: [
            {
              name: '当前隐患',
              type: 'bar',
              barWidth: '10px',
              itemStyle: {
                normal: {
                  color: '#F3C077',
                  barBorderRadius: 6,
                },
              },
              data: dangerNum[0] ? dangerNum : [1, 2, 3],
            },
            {
              name: '当前整改',
              type: 'bar',
              barWidth: '10px',
              itemStyle: {
                normal: {
                  color: '#6A93FF',
                  barBorderRadius: 6,
                },
              },
              data: repairNum[0] ? repairNum : [2, 4, 1, 2, 2],
            },
          ],
        };

        barChart.setOption(barOption);
      });

    //饼状图的数据
    this.props
      .dispatch({
        type: 'global/findIndexData',
      })
      .then(() => {
        // console.log('饼状图的数据==========',this.props.getPieData.payload.data)
        const arr = this.props.getPieData.payload.data;
        let totalNum = 0;
        for (let i in arr) {
          totalNum = totalNum + arr[i].num;
        }
        const convertKey = (arr, key) => {
          let newArr = [];
          arr.forEach((item, index) => {
            let newObj = {};
            for (var i = 0; i < key.length; i++) {
              newObj[key[i]] = item[Object.keys(item)[i]];
            }
            newArr.push(newObj);
          });
          return newArr;
        };
        let equipmentPercent = convertKey(arr, ['name', 'value', 'statistice']);
        const myChart = echarts.init(document.getElementById('pie'));
        var option = {
          //设置
          title: [
            {
              text: '设备占比',
              textStyle: {
                fontSize: 24,
                color: '#333333',
                fontWeight: 'bold',
              },
            },
            {
              text: totalNum + '台',
              subtext: '设备数量',
              textStyle: {
                fontSize: 32,
                color: '#333333',
              },
              subtextStyle: {
                fontSize: 14,
                color: '#666666',
              },
              textAlign: 'center',
              x: '34.5%',
              y: '44%',
            },
          ],
          //提示框占比
          tooltip: {
            trigger: 'item',
            formatter: function(parms) {
              var str =
                parms.seriesName +
                '</br>' +
                parms.marker +
                '' +
                parms.data.name +
                '</br>' +
                '数量：' +
                parms.data.value +
                '</br>' +
                '占比：' +
                parms.percent +
                '%';
              return str;
            },
          },
          //对图例组件的不同系列进行标记说明
          legend: {
            type: 'scroll',
            orient: 'vertical',
            left: '70%',
            align: 'left',
            top: 'middle',
            textStyle: {
              color: '#8C8C8C',
            },
            height: 250,
          },
          //系列列表
          series: [
            //系列1
            {
              name: '标题',
              type: 'pie',
              center: ['35%', '50%'],
              radius: ['40%', '65%'],
              clockwise: false, //饼图的扇区是否是顺时针排布
              avoidLabelOverlap: false,
              label: {
                normal: {
                  show: false,
                  position: 'outter',
                  formatter: function(parms) {
                    return parms.data.legendname;
                  },
                },
              },
              labelLine: {
                normal: {
                  length: 5,
                  length2: 3,
                  smooth: true,
                },
              },
              data: equipmentPercent,
            },
          ],
        };
        myChart.setOption(option);
      });
  }

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div
          id="pie"
          style={{
            width: '50%',
            height: '340px',
            background: '#FFFFFF',
            margin: '12px 0px 12px 0',
            padding: '12px',
          }}
        ></div>
        <div
          id="bar"
          style={{
            width: '50%',
            height: '340px',
            background: '#FFFFFF',
            margin: '12px 0px 12px 24px',
            padding: '12px',
          }}
        ></div>
      </div>
    );
  }
}
export default connect(({ global }) => ({
  getPieData: global.fetchPieList, //饼状图
  fetchBarDataList: global.fetchBarData, //柱状图
}))(SalesCard);
