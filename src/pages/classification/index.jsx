import { Button, Divider, Dropdown, Form, Icon, Menu, message, Avatar, Tag, Modal } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import { indexList, queryRule, equipmentList, remove } from './service';
import map from '@/pages/user/login/components/Login/map';
// import Modal from 'antd/es/modal';

class classification extends React.Component {
  state = {
    detail: [],
    selectedRowKeys: [],
  };
  componentDidMount() {}
  handlUpdate(data) {
    this.props.history.push({
      pathname: '/classification/addform',
      state: { isAdd: 0, data: data },
    });
  }
  handleBind(data) {
    this.props.history.push({ pathname: '/classification/bind', state: { data: data } });
  }
  handleDetailByKeys(action) {
    if (this.state.selectedRowKeys.length !== 0) {
      this.props
        .dispatch({
          type: 'classification/deleteData',
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
            message.error(this.props.result.msg);
          }
        });
    } else {
      message.error('没有选中项');
    }
  }
  handlDelete = (row, action) => {
    Modal.confirm({
      title: '该操作会删除设备类型下的所有设备,是否继续?',
      // content: '是否继续?',
      okText: '是',
      cancelText: '否',
      width: '23%',
      onOk: () => {
        console.log('row====', row);
        console.log('action====', action);
        let params = row.id;
        equipmentList(params).then(res => {
          console.log('resss=====', res);
          if (res.code == '0') {
            action.reload();
            remove(params).then(res => {
              console.log('successs=====', res);
              if (res.code == '0') {
                let search = {
                  className: '',
                };
                indexList(search);
                message.success('删除成功');
              } else {
                message.error(res.msg);
              }
            });
          } else {
            message.error(res.msg);
          }
        });
      },
    });
  };

  columns = [
    {
      title: '分类编号',
      dataIndex: 'classCode',
      hideInSearch: true,
    },
    {
      title: '分类名称',
      dataIndex: 'className',
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row, index, action) => (
        <>
          <a onClick={this.handleBind.bind(this, row)}>绑定检查项</a>
          <Divider type="vertical" />
          <a onClick={this.handlUpdate.bind(this, row)}>编辑</a>
          <Divider type="vertical" />
          <a onClick={this.handlDelete.bind(this, row, action)}>删除</a>
        </>
      ),
    },
  ];

  render() {
    // const ref=useRef()
    return (
      <PageHeaderWrapper>
        <ProTable
          style={{ paddingLeft: '20' }}
          headerTitle="设备分类列表"
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.history.push({
                  pathname: '/classification/addform',
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
            let search = {
              // classCode : parmes.classCode===undefined?'':parmes.classCode,
              className: parmes.className === undefined ? '' : parmes.className,
            };
            return indexList(search);
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

export default connect(({ classification }) => ({
  result: classification.removeResult,
}))(classification);
