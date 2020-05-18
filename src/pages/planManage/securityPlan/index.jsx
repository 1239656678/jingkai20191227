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

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async fields => {
  const hide = message.loading('正在添加');

  try {
    await addRule({
      desc: fields.desc,
    });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async fields => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      name: fields.name,
      desc: fields.desc,
      key: fields.key,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async selectedRows => {
  const hide = message.loading('正在删除');
  if (!selectedRows) return true;

  try {
    await removeRule({
      key: selectedRows.map(row => row.key),
    });
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
    return false;
  }
};

// const {dataList,dispatch,history,list} =props
// const [createModalVisible, handleModalVisible] = useState(false);
// const [updateModalVisible, handleUpdateModalVisible] = useState(false);
// const [stepFormValues, setStepFormValues] = useState({});
// const actionRef = useRef();

class SearchPlan extends React.Component {
  state = {
    detail: [],
    selectedRowKeys: [],
  };
  componentDidMount() {}

  //设备录入
  handleDetail(data) {
    console.log(data);
    this.props.history.push({ pathname: '/securityplan/detail', state: { detail: data } });
  }
  handlUpdate(data) {
    this.props.history.push({ pathname: '/securityplan/AddForm', state: { isAdd: 0, data: data } });
  }
  handlDelete = (row, action) => {
    // this.props.history.push({ pathname: '/deviceManagement?' + this.state.id });
    this.props
      .dispatch({
        type: 'patrolPlan/RemoveCheckItem',
        payload: {
          id: row.id,
        },
      })
      .then(() => {
        if (this.props.deleteCode.code == 0) {
          message.success('删除成功');
          action.reload();
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
      title: '检查周期',
      // filterDropdownVisible: false,

      dataIndex: 'planType',
      filtered: true,
      hideInSearch: true,
      valueEnum: {
        4: {
          text: '专项检查',
        },
      },
    },
    {
      title: '开始时间',
      dataIndex: 'beginDate',
      // sorter: true,
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '结束时间',
      dataIndex: 'endDate',
      // sorter: true,
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
          {/* <a
            onClick={() => {
              handleUpdateModalVisible(true);
              // setStepFormValues(record);
            }}
          >
            编辑
          </a>
          <Divider type="vertical" /> */}
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
          headerTitle="专项检查列表"
          // actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.history.push({
                  pathname: '/securityplan/AddForm',
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
              planCode: parmes.planCode === undefined ? '' : parmes.planCode,
              planName: parmes.planName === undefined ? '' : parmes.planName,
            };
            return queryRule(search);
          }}
          // dataSource={this.props.list}
          // onLoad={()=>{
          //
          // }}
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
}))(SearchPlan);
