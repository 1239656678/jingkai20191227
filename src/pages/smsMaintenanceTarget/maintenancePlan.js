import React, { Component, useState, useEffect } from 'react';
import { Button, Form, Input, Table, Divider, message, Modal, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.css';
import { getMaintenance, deletePlanList, fetchClassName } from './service';
const { confirm } = Modal;

class maintenancePlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      data: null,
      loading: true,
    };
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'equipmentCode',
        key: 'equipmentCode',
      },
      {
        title: '设备名称',
        dataIndex: 'equipmentName',
        key: 'equipmentName',
      },
      {
        title: '设备分类',
        dataIndex: 'className',
        key: 'className',
      },
      {
        title: '保养单位',
        dataIndex: 'maintenanceOrganization',
        key: 'maintenanceOrganization',
      },
      {
        title: '保养人',
        dataIndex: 'maintenanceUser',
        key: 'maintenanceUser',
      },
      {
        title: '保养周期',
        dataIndex: 'cycle',
        key: 'cycle',
        render: text => {
          if (text == '0') {
            return <div>周</div>;
          } else if (text == '1') {
            return <div>月</div>;
          } else if (text == '2') {
            return <div>季</div>;
          } else if (text == '3') {
            return <div>年</div>;
          }
        },
      },
      {
        title: '保养期限',
        dataIndex: 'endDate',
        key: 'endDate',
        render: text => {
          return this.formateDate(text);
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, row, index, action) => (
          <div className="operate">
            <a onClick={this.update.bind(this, row)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={this.deletePlan.bind(this, row)}>删除</a>
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    // var map = new BMap.Map("container");
    // var point = new BMap.Point(116.331398,39.897445);
    // map.centerAndZoom(point,12);
    // map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    // function myFun(result){
    //   var cityName = result.name;
    //   map.setCenter(cityName);
    //   alert("当前定位城市:"+cityName);
    // }
    // var myCity = new BMap.LocalCity();
    // myCity.get(myFun);

    getMaintenance().then(res => {
      // console.log('保养计划=====', res);
      if (res.code == '0') {
        let _this = this;
        setTimeout(function() {
          _this.setState({
            dataSource: res.data,
            loading: false,
          });
        }, 200);
      }
    });
  }

  formateDate(date) {
    var date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    m = m > 9 ? m : '0' + m;
    return y + '-' + m + '-' + d + ' ' + h + ':' + mi;
  }
  //编辑
  update(row) {
    // console.log('row111111111=========', row);
    fetchClassName().then(res => {
      if (res.code == '0') {
        const equipmentClassName = res.data;
        this.props.history.push({
          pathname: './maintenancePlan/addPlan',
          state: { data: row, className: equipmentClassName },
        });
      }
    });
  }
  //新增
  addPlan() {
    fetchClassName().then(res => {
      // console.log('设备类型模块数据===', res.data);
      const data = '';
      if (res.code == '0') {
        const equipmentClassName = res.data;
        this.props.history.push({
          pathname: './maintenancePlan/addPlan',
          state: { data: data, className: equipmentClassName },
        });
      }
    });
  }
  //删除
  deletePlan(row) {
    let params = row.id;
    confirm({
      title: '确定要删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.setState({
          loading: true,
        });
        deletePlanList(params).then(res => {
          if (res.code == '0') {
            message.success('删除成功');
            getMaintenance().then(res => {
              if (res.code == '0') {
                this.setState({
                  dataSource: res.data,
                  loading: false,
                });
              }
            });
          }
        });
      },
    });
  }
  render() {
    const { form, loading } = this.props;
    const { dataSource } = this.state;
    return (
      <PageHeaderWrapper>
        <div className={styles.formInput} style={{ padding: '0 10px 20px' }}>
          <Form layout="inline">
            <Form.Item>
              <Button className={styles.btn} onClick={() => this.addPlan()}>
                新增
              </Button>
            </Form.Item>
          </Form>
          <Form layout="inline">
            <Form.Item>
              {form.getFieldDecorator('equipmentName')(<Input placeholder="请输入计划名称" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('equipmentName')(<Input placeholder="请输入检查状态" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('installArea')(<Input placeholder="请输入检查周期" />)}
            </Form.Item>
            <Form.Item>
              <Button className={styles.search}>查询</Button>
            </Form.Item>
          </Form>
        </div>
        <Spin spinning={this.state.loading} size="large">
          <Table
            style={{
              marginBottom: 16,
              background: '#fff',
            }}
            rowKey="id"
            dataSource={dataSource}
            columns={this.columns}
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(maintenancePlan);
