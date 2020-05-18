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

class EqLed extends React.Component {
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
    console.log(this.props);
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
  //关联设备
  handleDetails(data) {
    this.props.history.push({
      pathname: '/devicemanagement/OneAdd',
      state: { isAdd: 0, data: data, quid: this.props.location.state.id },
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
          // actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
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
            let ser = {
              name: parmes.name == undefined ? '' : parmes.name,
              code: parmes.code == undefined ? '' : parmes.code,
            };
            return queryRule(ser);
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
              hideInSearch: true,
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
              render: (_, record) => (
                <>
                  <a onClick={this.handleDetails.bind(this, record)}>关联</a>
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
}))(EqLed);
