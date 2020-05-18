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

class roleManage extends React.Component {
  state = {
    detail: [],
    selectedRowKeys: [],
  };
  componentDidMount() {}
  handleDetail(data) {
    this.props.history.push({ pathname: '/securityplan/detail', state: { detail: data } });
  }
  handleBindMenu(data) {
    this.props.history.push({ pathname: '/rolemanage/bindmenu', state: { detail: data } });
  }
  handleUpdata(data){
    this.props.history.push({ pathname: '/rolemanage/addform' , state: { data: data,isAdd:0 }})
  }
  handleDeleteByKeys(action){
    if (this.state.selectedRowKeys.length !== 0) {
      this.props
        .dispatch({
          type: 'rolemanage/RemoveRole',
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
  handlDelete = (data,action) => {
    this.props
      .dispatch({
        type: 'rolemanage/RemoveRole',
        payload: {
          id: data.id,
        },
      })
      .then(() => {
        if (this.props.result.code == 0) {
            message.success(this.props.result.msg);
            action.reload();
        } else {
          message.success(this.props.result.msg);
          action.reload();
        }
      });
  };

  columns = [
    {
      title: '代码',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    // {
    //   title: '创建人',
    //   dataIndex: 'createUser',
    // },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row, index, action) => (
        <>  
           <a onClick={this.handleUpdata.bind(this, row)}>编辑</a>
           <Divider type="vertical" />
          <a onClick={this.handleBindMenu.bind(this, row)}>权限</a>
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
          headerTitle="角色管理"
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             
              onClick={() => {
                this.props.history.push({ pathname: '/rolemanage/addform',state:{isAdd:1} });
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
          request={parmes =>{
            let search = {
              code: parmes.code === undefined ? '' : parmes.code,
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

export default connect(({ rolemanage }) => ({
  result: rolemanage.removeResult,
}))(roleManage);
