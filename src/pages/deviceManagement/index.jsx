import {
  Button,
  Divider,
  Dropdown,
  Icon,
  Menu,
  message,
  Tabs,
  Tag,
  Form,
  Table,
  Drawer,
  Radio,
  Descriptions,
  Input,
  Card,
} from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, ProTableProps } from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import { noBindEquipment, treeData } from './service';
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';
import TreeLine from './TreeLine';
import styles from './style.css';
const RadioGroup = Radio.Group;
const { TabPane } = Tabs;
const FormItem = Form.Item;
const { confirm } = Modal;
class deviceManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSourceArray: [],
      ModalText: '数据删除提示',
      visible: false,
      visibleModel: false, //区域绑定设备
      BindId: '',
      savemodel: false,
      confirmLoading: false,
      delid: '',
      id: '',
      act: '',
      placement: 'top',
      oneDataDetail: '',
      isLoading: false,
      QuYuId: '',
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    this.fetchAreaList();
  }

  //查询列表
  fetchAreaList = () => {
    let params = this.props.form.getFieldsValue();
    this.setState({
      isLoading: true,
    });
    this.props
      .dispatch({
        type: 'deviceManagement/queryListByregionsId',
        payload: {
          id: this.props.location.state.areaId,
          code: params.code ? params.code : '',
          name: params.name ? params.name : '',
          status: '',
        },
      })
      .then(r => {
        this.setState({
          // dataSourceArray: this.props.dataSourceArray,
          isLoading: false,
        });
      });
  };

  //点击管理
  showSaveModal = () => {
    this.props.history.push({
      pathname: '/devicemanagement/area/areamanager',
      state: {
        isAdd: 1,
      },
    });
  };

  showModal = row => {
    confirm({
      title: '确定要删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.props
          .dispatch({
            type: 'equipmentLedger/RemoveSmsEquipmentBaseInfo',
            payload: {
              id: row.id,
            },
          })
          .then(() => {
            if (this.props.equipmentLedgerRemove.code == 0) {
              message.success('删除成功');
              this.setState({
                isLoading: true,
              });
              this.props
                .dispatch({
                  type: 'deviceManagement/queryListByregionsId',
                  payload: {
                    id: this.props.location.state.areaId,
                    code: '',
                    name: '',
                    status: '',
                  },
                })
                .then(r => {
                  if (this.props.equipmentLedgerRemove.code == 0) {
                    this.setState({
                      dataSourceArray: this.props.equipmentLedgerRemove.data,
                      isLoading: false,
                    });
                  }
                });
            }
          });
      },
    });
  };

  handleUpdate = data => {
    this.props.history.push({
      pathname: '/equipmentledger/addform',
      state: {
        isAdd: 0,
        data: data,
        quyu: 1,
        black: 1,
      },
    });
  };
  //关联设备
  handleDetails(data) {
    this.props.history.push({
      pathname: '/devicemanagement/OneAdd',
      state: { isAdd: 0, data: data, quid: this.state.BindId },
    });
  }

  //设备关联
  equipmentLink() {
    this.setState({
      isLoading: true,
    });
    this.props.history.push({
      pathname: '/devicemanagement/area/equipmentLink',
      state: { regionsId: this.props.location.state.areaId },
    });
  }
  render() {
    const { form, loading } = this.props;
    const { isLoading, dataSource, dataSourceArray } = this.state;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    };
    return (
      <PageHeaderWrapper>
        <Button className={styles.btn} onClick={this.showSaveModal}>
          管理
        </Button>
        <Card bordered={false}>
          <div className={styles.formInput}>
            <Form layout="inline">
              <Form.Item>
                <Button className={styles.equipment} onClick={() => this.equipmentLink()}>
                  设备关联
                </Button>
              </Form.Item>
            </Form>
            <Form layout="inline">
              <Form.Item>
                {form.getFieldDecorator('code')(<Input placeholder="请输入设备编号" />)}
              </Form.Item>
              <Form.Item>
                {form.getFieldDecorator('name')(<Input placeholder="请输入设备名称" />)}
              </Form.Item>
              {/* <Form.Item>
                                {form.getFieldDecorator('installArea')(<Input placeholder="请输入区域名称" />)}
                            </Form.Item> */}
              <Form.Item>
                <Button className={styles.search} onClick={this.fetchAreaList}>
                  查询
                </Button>
              </Form.Item>
            </Form>
          </div>

          <Table
            rowKey="id"
            style={{
              width: '100%',
              backgroundColor: '#ffffff',
            }}
            loading={isLoading}
            columns={[
              {
                title: '设备编号',
                dataIndex: 'code',
                render: (text, value) => {
                  return <a>{text}</a>;
                },
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
                title: '所在区域',
                dataIndex: 'installRegionsName',
                hideInSearch: true,
              },
              {
                title: '设备状态',
                dataIndex: 'status',
                render: (text, value) => {
                  return text == 1 ? <Tag color="green">正常</Tag> : <Tag color="red">故障</Tag>;
                },
              },
              {
                title: '操作',
                dataIndex: 'option',
                valueType: 'option',
                render: (text, row, index, action) => (
                  <>
                    <a onClick={this.handleUpdate.bind(this, row)}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={this.showModal.bind(this, row, action)}>删除</a>
                  </>
                ),
              },
            ]}
            dataSource={this.props.dataSourceArray}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ deviceManagement, equipmentLedger }) => ({
    dataSourceArray: deviceManagement.list,
    tree: deviceManagement.treeData,
    remove: deviceManagement.remove,
    equipmentLedgerRemove: equipmentLedger.remove,
    dataSource: deviceManagement.findAllList,
  }))(deviceManagement),
);
