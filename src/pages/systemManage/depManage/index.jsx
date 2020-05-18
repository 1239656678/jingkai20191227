import { Button, Divider, Dropdown, Form, Icon, Menu, message, Avatar, Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import { queryRule } from './service';
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';

class depManage extends React.Component {
  state = {
    detail: [],
    selectedRowKeys: [],
  };
  componentDidMount() {}
  handlUpdateData=data=>{
    this.props.history.push({ pathname: '/depManage/addform' , state: { data: data,isAdd:0 }})
  }
  handlUsers=data=>{
    this.props.history.push({ pathname: '/depManage/bindusers' , state: { data: data }})
  }
  handlDelete = (data,action) => {
    this.props
      .dispatch({
        type: 'depMange/deleteDepData',
        payload: {
          id: data.id,
        },
      })
      .then(() => {
        if (this.props.result.code == 0) {
          setTimeout(() => {
            message.success(this.props.result.msg);
            action.reload();
          }, 1000);
        } else {
          message.error(this.props.result.msg);
          action.reload();
        }
      });
  };
  handleDeleteByKeys(action){
    if (this.state.selectedRowKeys.length !== 0) {
      this.props
        .dispatch({
          type: 'depMange/deleteDepData',
          payload: {
            id: this.state.selectedRowKeys,
          },
        })
        .then(() => {
          if (this.props.result.code == 0) {
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
      title: '部门名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'details',
      hideInSearch: true,
    }, {
      title: '创建人',
      dataIndex: 'createUserName',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row, index, action) => (
        <>
        <a onClick={this.handlUsers.bind(this, row)}>绑定领导人</a>
          <Divider type="vertical" />
          <a onClick={this.handlUpdateData.bind(this, row)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handlDelete.bind(this, row,action)}>删除</a>
        </>
      ),
    },
  ];

  render() {
    return (
      <PageHeaderWrapper>
        <ProTable
          style={{ paddingLeft: '20' }}
          headerTitle="部门管理"
          // actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.history.push({ pathname: '/depManage/addform',state: { isAdd:1 } });
              }}
            >
              添加
            </Button>,
           <Button
           type="danger"
           onClick={() => {this.handleDeleteByKeys(action);
              }}
            >
              批量删除
            </Button>,
          ]}
          request={(parmes) =>{
            let search = {
              name: parmes.name === undefined ? '' : parmes.name
            };
            return queryRule(search)
          } }
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

export default connect(({ depMange }) => ({
  result: depMange.removeResult,
}))(depManage);
