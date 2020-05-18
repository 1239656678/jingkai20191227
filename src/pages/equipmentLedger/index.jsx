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



class equipmentLedger extends React.Component {
  state = {
    count: this.props.count,
    dataList: this.props.dataList,
    ModalText: '数据删除提示',
    visible: false,
    confirmLoading: false,
    delid: '',
    action: '',
    status: true,
    search: {
      code: '',
      name: '',
    },
    selectedRowKeys: [],
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
  showModal = (row, action) => {
    this.setState({
      visible: true,
      delid: row.id,
      action: action,
    });
  };
  handlBindDelete = (row, action) => {
    this.props
      .dispatch({
        type: 'equipmentLedger/RemoveSmsEquipmentBaseInfo',
        payload: {
          id: row.id,
        },
      })
      .then(() => {
        if (this.props.result.code == 0) {
          message.success('删除成功');
          action.reload();
        } else {
          message.success('删除失败');
        }
      });
  };
  handleDetailByKeys(action) {
    if (this.state.selectedRowKeys.length !== 0) {
      this.props
        .dispatch({
          type: 'equipmentLedger/RemoveSmsEquipmentBaseInfo',
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
          // actionRef={actionRef}
          rowKey="id"
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
              code: parmes.code === undefined ? '' : parmes.code,
              name: parmes.name === undefined ? '' : parmes.name,
              status: parmes.status === undefined ? '' : parmes.status,
            };
            return querySmsEquipmentBaseInfoListData(search);
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
              hideInSearch: true,
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
              hideInSearch: true,
            },
            {
              title: '操作',
              dataIndex: 'option',
              valueType: 'option',
              render: (text, row, index, action) => (
                <>
                  <a onClick={this.handleDetails.bind(this, row)}>详情</a>
                  <Divider type="vertical" />
                  {/* <a>维修</a>
                  <Divider type="vertical" /> */}
                  <a onClick={this.handleEditorpage.bind(this, row)}>编辑</a>
                  <Divider type="vertical" />
                  <a onClick={this.handlBindDelete.bind(this, row, action)}>删除</a>
                </>
              ),
            },
          ]}
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

export default connect(({ equipmentLedger }) => ({
  dataList: equipmentLedger.dataList,
  list: equipmentLedger.list,
  count: equipmentLedger.count,
  result: equipmentLedger.remove,
}))(equipmentLedger);
