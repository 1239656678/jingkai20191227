import { Button, Divider, Dropdown, Form, Icon, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import { queryRule, queryWeekPlan } from './service';
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';

class PatroPlan extends React.Component {
  state = {
    detail: [],
    list: [],
    selectedRowKeys: [],
  };
  componentDidMount() {}
  handlUpdate(data) {
    this.props.history.push({ pathname: '/patrolPlan/AddForm', state: { isAdd: 0, data: data } });
  }
  //设备录入
  handleDetail(data) {
    console.log('data222===', data);
    let search = {
      planId: data.id === undefined ? '' : data.id,
    };
    console.log('search===', search);
    queryWeekPlan(search).then(res => {
      console.log('res2222222===', res);
      this.props.history.push({
        pathname: '/patrolPlan/detail',
        state: { detail: data, list: res.data },
      });
    });
  }
  handlDelete = (row, action) => {
    this.props
      .dispatch({
        type: 'patrolPlan/RemoveCheckItem',
        payload: {
          id: row.id,
        },
      })
      .then(() => {
        if (this.props.deleteCode.code == 0) {
          action.reload();
          message.success('删除成功');
        } else {
          message.error('删除操作失败');
        }
      });
  };
  handleDetailByKeys(action) {
    if (this.state.selectedRowKeys.length !== 0) {
      this.props
        .dispatch({
          type: 'patrolPlan/RemoveCheckItem',
          payload: {
            id: this.state.selectedRowKeys,
          },
        })
        .then(() => {
          if (this.props.deleteCode.code == 0) {
            message.success('删除成功');
            action.reload();
            this.setState({
              selectedRowKeys: [],
            });
          } else {
            message.error('删除操作失败');
          }
        });
    } else {
      message.error('没有选中项');
    }
  }
  columns = [
    {
      title: '计划编号',
      dataIndex: 'planCode',
      render: (text, value) => {
        return <a onClick={this.handleDetail.bind(this, value)}>{text}</a>;
      },
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
    },
    {
      title: '计划类型',
      dataIndex: 'planType',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '日检查',
        },
        1: {
          text: '周检查',
        },
        2: {
          text: '月检查',
        },
        3: {
          text: '季度检查',
        },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '责任人',
      dataIndex: 'personLiableName',
      hideInSearch: true,
    },
    {
      title: '责任部门',
      dataIndex: 'organizationName',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row, index, action) => (
        <>
          <a onClick={this.handlUpdate.bind(this, row)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handlDelete.bind(this, row, action)}>删除</a>
        </>
      ),
    },
  ];

  render() {
    return (
      <PageHeaderWrapper>
        <ProTable
          style={{ paddingLeft: '20' }}
          headerTitle="检查计划列表"
          // actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push({
                  pathname: '/patrolPlan/AddForm',
                  state: { isAdd: 1, data: null },
                });
              }}
            >
              新增
            </Button>,
            <Button
              type="danger"
              onClick={() => {
                this.handleDetailByKeys(action);
              }}
            >
              批量删除
            </Button>,
          ]}
          request={parmes => {
            console.log('parmes===', parmes);
            let search = {
              planCode: parmes.planCode === undefined ? '' : parmes.planCode,
              planName: parmes.planName === undefined ? '' : parmes.planName,
            };
            return queryRule(search);
          }}
          columns={this.columns}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                selectedRowKeys: selectedRowKeys,
              });
            },
          }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ equipmentLedger, patrolPlan }) => ({
  dataList: equipmentLedger.dataList,
  list: equipmentLedger.list,
  count: equipmentLedger.count,
  deleteCode: patrolPlan.removeResult,
}))(PatroPlan);
