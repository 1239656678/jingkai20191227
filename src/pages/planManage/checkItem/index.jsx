import { Button, Divider, Dropdown, Form, Icon, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import { queryRule } from './service';
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';


class checkItem extends React.Component {
  state = {
    detail: [],
    selectedRowKeys: [],
  };
  componentDidMount() {}
  handlUpdate(data) {
    this.props.history.push({ pathname: '/checkitem/addFrom', state: { isAdd: 0, data: data } });
  }
  //设备录入
  handleDetail(data) {
    this.props.history.push({ pathname: '/patrolPlan/detail', state: { detail: data } });
  }
  handleDetailByKeys(action) {
    if (this.state.selectedRowKeys.length !== 0) {
      this.props
        .dispatch({
          type: 'checkItem/RemoveCheckItem',
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
  handlDelete = (row, action) => {
    this.props
      .dispatch({
        type: 'checkItem/RemoveCheckItem',
        payload: {
          id: row.id,
        },
      })
      .then(() => {
        setTimeout(() => {
          message.success('删除成功');
          action.reload();
          this.props.history.push({ pathname: '/checkitem' });
        }, 1000);
      });
  };

  columns = [
    {
      title: '检查编号',
      dataIndex: 'targetCode',
      key: 'targetCode',
      // render:(text,value)=>{
      //   return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      // }
    },
    {
      title: '检查项',
      key: 'targetName',
      dataIndex: 'targetName',
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
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
          headerTitle="检查项列表"
          // actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.history.push({
                  pathname: '/checkitem/addFrom',
                  state: { isAdd: 1, data: null },
                });
              }}
            >
              添加
            </Button>,
            <Button
              type="danger"
              onClick={() => {
                this.handleDetailByKeys(action);
              }}
            >
              批量删除
            </Button>,
            <Modal
              title="消息提示"
              visible={this.state.visible}
              onOk={this.handleOk}
              confirmLoading={this.state.confirmLoading}
              onCancel={this.handleCancel}
            >
              <p>{this.state.ModalText}</p>
            </Modal>,
          ]}
          request={parmes => {
            let serch = {
              targetCode: parmes.targetCode === undefined ? '' : parmes.targetCode,
              targetName: parmes.targetName === undefined ? '' : parmes.targetName,
            };
            return queryRule(serch);
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

export default connect(({ equipmentLedger, checkItem }) => ({
  dataList: equipmentLedger.dataList,
  list: equipmentLedger.list,
  count: equipmentLedger.count,
  deleteCode: checkItem.removeResult,
}))(checkItem);
