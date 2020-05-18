import { Button, Divider, Dropdown, Form, Icon, Menu, message,Avatar,Tag } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import {queryRule} from './service'
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';


class dangerManageIndex extends React.Component {
  state = {
    detail:[]
  };
  componentDidMount() {

  }
  
  handlAssignForm(data){
    this.props.history.push({ pathname: '/dangerManage/repairList/assignform',state:{data:data}})
  }
  handlDelete = data => {
    this.props.dispatch({
      type: 'repairList/deleteData',
      payload :{
        id : data.id
      }
    })
    .then(()=>{
      if(this.props.result.code==0){
        setTimeout(() => {
          message.success("删除成功")
            this.props.history.push({ pathname: '/dangerManage/repairList'})
        }, 1000);
      }else{
        message.success("删除失败")
      }
    })
  };
 //隐患详情
 handlDetail(data) {
  this.props.history.push({
    pathname: '/DangerManage/detail',
    state: { data: data },
  });
}
  columns = [
    {
      title: '隐患描述',
      dataIndex: 'remark',
      // render:(text,value)=>{
      //   return (<a onClick={this.handleDetail.bind(this,value)}>{text}</a>)
      // }
    },
    {
      title: '隐患设施',
      dataIndex: 'equipmentId',
      // render:(text,value)=>{
      //   return (<a onClick={this.handleEquipmentDetail.bind(this,value)}>{text}</a>)
      // }
    },
    {
      title: '隐患位置',
      dataIndex: 'dangerAddress',
    },
    {
      title: '隐患级别',
      dataIndex: 'dangerLevelId',
      valueEnum: {
        0: {
          text: '一般',
          status: 'Warning',
          
        },
        1: {
          text: '较大',
          status: 'Warning',
        },
        2: {
          text: '重大',
          status: 'Error',
        }
      }
    },
    {
      title: '隐患来源',
      dataIndex: 'dangerFrom',
      valueEnum: {
        0: {
          text: '随手拍',
        },
        1: {
          text: '检查计划'
        }
      }
    },
    {
      title: '隐患状态',
      dataIndex: 'dangerStatus',
      defaultSortOrder: 'descend',
      valueEnum: {
        0: {
          text: '待指派',
          status: 'Error',
        },
        1: {
          text: '待整改',
          status: 'Warning',
        },
        2: {
          text: '待复查',
          status: 'Warning',
        },
        3: {
          text: '已完成',
          status: 'Success',
        },
      }
    },
    {
      title: '提交日期',
      dataIndex: 'createDate',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.createDate - b.createDate,
      // render:(text) => {
      //   return <Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>
      // }
    },
   
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          {/* <a onClick={this.handlDesigNate.bind(this, record)}>指派</a> */}
          {/* <Divider type="vertical" /> */}
          <a onClick={this.handlDetail.bind(this, record)}>详情</a>
          <Divider type="vertical" />
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
          headerTitle="查询表格"
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
          tableAlertRender={(selectedRowKeys, selectedRows) => (
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowKeys.length}
              </a>{' '}
              项&nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          )}
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

export default connect(({ repairList }) => ({
  result : repairList.removeResult
}))(dangerManageIndex);
