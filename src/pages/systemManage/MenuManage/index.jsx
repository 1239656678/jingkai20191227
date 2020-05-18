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

class menuManage extends React.Component {
  state = {
    detail: [],
  };
  componentDidMount() {}

  handlDelete = data => {
    this.props
      .dispatch({
        type: 'menumanage/deleteMenuData',
        payload: {
          id: data.id,
        },
      })
      .then(() => {
        if (this.props.result.code == 0) {
          setTimeout(() => {
            message.success('删除成功');
            this.props.history.push({ pathname: '/menumanage' });
          }, 1000);
        } else {
          message.success('删除失败');
        }
      });
  };

  columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
    },
    {
      title: '路径',
      dataIndex: 'address',
    },
    {
      title: '创建时间',
      dataIndex: 'createDate',
      valueType: 'dateTime',
    },
    {
      title: '修改时间',
      dataIndex: 'updateDate',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {/* <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" /> */}
          <a onClick={this.handlDelete.bind(this, record)}>删除</a>
        </>
      ),
    },
  ];

  render() {
    return (
      <PageHeaderWrapper>
        <ProTable
          style={{ paddingLeft: '20' }}
          headerTitle="菜单列表"
          // actionRef={actionRef}
          rowKey="key"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.history.push({ pathname: '/menumanage/addform' });
              }}
            >
              添加
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
          request={() => queryRule()}
          // dataSource={this.props.list}
          // onLoad={()=>{
          //
          // }}
          columns={this.columns}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ menumanage }) => ({
  result: menumanage.removeResult,
}))(menuManage);
