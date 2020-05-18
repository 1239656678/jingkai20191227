import { Button, Divider, Dropdown, Form, Icon, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import {
  queryRule,
  updateRule,
  addRule,
  removeRule,
  querySmsEquipmentBaseInfoListData,
} from './service';
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';

class Rele extends React.Component {
  state = {
    count: this.props.count,
    dataList: this.props.dataList,
    ModalText: '数据删除提示',
    visible: false,
    confirmLoading: false,
    delid: '',
    status: true,
  };
  componentDidMount() {
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        pageSize: 10,
        pageNum: 0,
      },
    });
    // this.changeSize(0)
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoListData',
    });
  }
  selectChange(e) {
    console.log(e);
  }
  //编辑
  handleEditorpage(data) {
    this.props.history.push({
      pathname: '/equipmentledger/addform',
      state: { isAdd: 0, data: data },
    });
  }
  //设备详情
  handleDetails(data) {
    this.props.history.push({
      pathname: '/equipmentledger/details',
      state: { isAdd: 0, data: data },
    });
  }
  //保修编辑和查看
  handleRemoveData(data) {
    this.showModal(data);
  }
  //设备录入
  handleModalAdd() {
    this.props.history.push({ pathname: '/equipmentledger/addform' });
  }
  changeSize(value) {
    let page = value - 1;
    this.props.dispatch({
      type: 'equipmentLedger/querySmsEquipmentBaseInfoList',
      payload: {
        pageSize: 10,
        pageNum: page,
      },
    });
  }
  showModal = data => {
    this.setState({
      visible: true,
      delid: data.id,
    });
  };

  handleOk = action => {
    this.setState({
      ModalText: '是否确定删除数据',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.props.dispatch({
        type: 'equipmentLedger/RemoveSmsEquipmentBaseInfo',
        payload: {
          id: this.state.delid,
        },
      });
      //  .then(()=>{
      //  this.props.history.push({ pathname: '/equipmentledger'})
      //  })
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <PageHeaderWrapper>
        <ProTable
          style={{ paddingLeft: '20' }}
          headerTitle="设备台账列表"
          rowKey="key"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.history.push({
                  pathname: '/equipmentledger/addform',
                  state: { isAdd: 1, data: null },
                });
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
          request={() => {
            if (this.state.status) {
              return querySmsEquipmentBaseInfoListData();
            } else {
              return querySmsEquipmentBaseInfoListData();
            }
          }}
          // dataSource={this.props.list}
          // onLoad={()=>{
          //
          // }}
          columns={[
            {
              title: '设备编号',
              dataIndex: 'code',
            },
            {
              title: '设备名称',
              dataIndex: 'name',
            },
            {
              title: '设备分类',
              dataIndex: 'typeName',
            },
            {
              title: '设备状态',
              dataIndex: 'status',
              valueEnum: {
                2: {
                  text: '故障',
                  status: 'Error',
                },
                1: {
                  text: '正常',
                  status: 'Success',
                },
              },
            },
            {
              title: '责任人',
              dataIndex: 'responsibleUserName',
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              render: (_, record) => (
                <>
                  <a onClick={this.handleDetails.bind(this, record)}>详情</a>
                  <Divider type="vertical" />
                  {/* <a>维修</a>
                  <Divider type="vertical" /> */}
                  <a onClick={this.handleEditorpage.bind(this, record)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={this.showModal.bind(this, record)}>删除</a>
                </>
              ),
            },
          ]}
          rowSelection={{}}
        />
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ equipmentLedger }) => ({
  dataList: equipmentLedger.dataList,
  list: equipmentLedger.list,
  count: equipmentLedger.count,
}))(Rele);
