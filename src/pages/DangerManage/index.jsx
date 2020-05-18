import { Button, Divider, Dropdown, Form, Icon, Menu, message, Avatar, Tag, Tooltip } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import { queryRule } from './service';
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';

class dangerManageIndex extends React.Component {
  state = {
    detail: [],
    data: [],
    selectedRowKeys: [],
  };
  componentDidMount() {}

  handlDelete = (row, action) => {
    this.props
      .dispatch({
        type: 'dangermanage/deleteData',
        payload: {
          id: row.id,
        },
      })
      .then(() => {
        if (this.props.result.code == 0) {
          message.success('删除成功');
          action.reload();
          this.props.history.push({ pathname: '/DangerManage' });
        } else {
          message.success('删除失败');
        }
      });
  };
  handleDetailByKeys(action) {
    if (this.state.selectedRowKeys.length !== 0) {
      this.props
        .dispatch({
          type: 'dangermanage/deleteData',
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
  handlDesigNate(data) {
    if (data.dangerStatus == 0) {
      this.props.history.push({
        pathname: '/DangerManage/designate',
        state: { data: data },
      });
    }
  }
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
      onCell: () => {
        return {
          style: {
            maxWidth: 200,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            cursor: 'pointer',
          },
        };
      },
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            {text}
          </Tooltip>
        );
      },
    },
    {
      title: '隐患设施',
      dataIndex: 'equipmentId',
      hideInSearch: true,
    },
    {
      title: '隐患位置',
      dataIndex: 'dangerAddress',
    },
    {
      title: '隐患级别',
      dataIndex: 'dangerLevelId',
      hideInSearch: true,
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
        },
      },
    },
    {
      title: '隐患来源',
      dataIndex: 'dangerFrom',
      hideInSearch: true,
      valueEnum: {
        0: {
          text: '随手拍',
        },
        1: {
          text: '检查计划',
        },
      },
    },
    {
      title: '隐患状态',
      dataIndex: 'dangerStatus',
      defaultSortOrder: 'descend',
      // hideInSearch: true,
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
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      hideInSearch: true,
      // render:(text) => {
      //   return <Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>
      // }
    },
    {
      title: '提交日期',
      dataIndex: 'createDate',
      valueType: 'dateTime',
      hideInSearch: true,
      // render:(text) => {
      //   return <Tag color='red'>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</Tag>
      // }
    },

    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row, index, action) => (
        <>
          {/* <a onClick={this.handlDesigNate.bind(this, row)}>{row.dangerStatus!=0?(row.dangerStatus!=2?<a style={{color:'#808080'}}>已完成</a>:<a style={{color:'#FFA500'}}>待复查</a>):<a style={{color:'#FF0000'}}>待指派</a>}</a> */}
          <span onClick={this.handlDesigNate.bind(this, row)}>
            {row.dangerStatus == 0 ? (
              <a style={{ color: '#FF0000' }}>待指派</a>
            ) : row.dangerStatus == 1 ? (
              <a style={{ color: '#808080' }}>整改中</a>
            ) : row.dangerStatus == 2 ? (
              <a style={{ color: '#808080' }}>复查中</a>
            ) : (
              <a style={{ color: '#808080' }}>已完成</a>
            )}
          </span>
          <Divider type="vertical" />
          <a onClick={this.handlDetail.bind(this, row)}>详情</a>
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
          headerTitle="隐患信息列表"
          // actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
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
            let par = {
              dangerAddress: parmes.dangerAddress === undefined ? '' : parmes.dangerAddress,
              remark: parmes.remark === undefined ? '' : parmes.remark,
              dangerStatus: parmes.dangerStatus === undefined ? '' : parmes.dangerStatus,
            };
            return queryRule(par);
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

export default connect(({ dangermanage }) => ({
  result: dangermanage.removeResult,
}))(dangerManageIndex);
