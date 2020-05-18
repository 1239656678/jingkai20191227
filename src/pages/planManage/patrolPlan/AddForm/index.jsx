import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Transfer,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  message,
  Tree,
} from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import TreeSelect from 'antd/es/tree-select';
const { TreeNode } = Tree;

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

function handleChange(value) {
  console.log(`selected ${value}`);
}

// treeData处理数据
function combinationData(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
      if (item.children) {
        combinationData(item.children);
      }
    });
    return array;
  }
}

//区域转移框
function combinationClassData(array) {
  const mockData = [];
  if (array != null) {
    array.map(item => {
      if (item.children) {
        mockData.push({
          key: item.id,
          value: item.id,
          title: item.name,
          children: combinationClassData(item.children),
        });
      } else {
        mockData.push({
          key: item.id,
          value: item.id,
          title: item.name,
        });
      }
    });
    return mockData;
  }
}

//树结构
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

const generateTree = (treeNodes = [], checkedKeys = []) => {
  return treeNodes.map(({ children, ...props }) => (
    <TreeNode {...props} disabled={checkedKeys.includes(props.key)} key={props.key}>
      {generateTree(children, checkedKeys)}
    </TreeNode>
  ));
};

const TreeTransfer = ({ dataSource, targetKeys, ...restProps }) => {
  const transferDataSource = [];
  function flatten(list = []) {
    list.forEach(item => {
      transferDataSource.push(item);
      flatten(item.children);
    });
  }
  flatten(dataSource);

  return (
    <Transfer
      {...restProps}
      targetKeys={targetKeys}
      dataSource={transferDataSource}
      className="tree-transfer"
      render={item => item.title}
      showSelectAll={true}
    >
      {({ direction, onItemSelect, selectedKeys }) => {
        if (direction === 'left') {
          const checkedKeys = [...selectedKeys, ...targetKeys];
          return (
            <Tree
              blockNode
              checkable
              checkStrictly
              defaultExpandAll
              checkedKeys={checkedKeys}
              onCheck={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
              onSelect={(
                _,
                {
                  node: {
                    props: { eventKey },
                  },
                },
              ) => {
                onItemSelect(eventKey, !isChecked(checkedKeys, eventKey));
              }}
            >
              {generateTree(dataSource, targetKeys)}
            </Tree>
          );
        }
      }}
    </Transfer>
  );
};

class AddForm extends Component {
  state = {
    treeData: [],
    getUserListByOrganizationId: [],
    children: [],
    classificationList: [],
    treeList: [],
    people: [],
    size: 'default',
    findAllViewList: [],
    targetKeys: [],
    button: '检查计划提交',
  };

  getPeople(arrays) {
    let arrs = [];
    let array = Array.from(arrays);
    array.map(item => {
      arrs.push(<Option key={item.id}>{item.name}</Option>);
    });
    return arrs;
  }
  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };
  componentDidMount() {
    if (this.props.location.state.isAdd === 0) {
      this.setState({
        button: '修改检查计划',
        targetKeys:
          this.props.location.state.data.itemIds == null
            ? []
            : this.props.location.state.data.itemIds,
      });
      //调用查询方法
      this.props
        .dispatch({
          type: 'depMange/findUserByOrganizationId',
          payload: {
            id: this.props.location.state.data.organizationId,
          },
        })
        .then(() => {
          let child = [];
          this.props.getUserListByOrganizationId.map(item => {
            child.push(<Option key={item.id.toString()}>{item.name.toString()}</Option>);
          });
          this.setState({
            getUserListByOrganizationId: child,
          });
        });
    }
    this.props
      .dispatch({
        type: 'depMange/treeListDate',
      })
      .then(r => {
        let treeDate = combinationData(this.props.responsibleOrganization.data);
        this.setState({
          treeData: treeDate,
        });
      });
    this.props
      .dispatch({
        type: 'deviceManagement/treeData',
      })
      .then(r => {
        // console.log('请求成功1111111======',this.props)
        let data = combinationClassData(this.props.treeList);
        console.log('data111======', data);
        // treeData处理数据
        this.setState({
          treeList: data,
        });
      });
  }

  handleSubmit = e => {
    console.log('success');
    console.log(this.props);
    const { form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.location.state.isAdd === 1) {
          this.props
            .dispatch({
              type: 'patrolPlan/saveData',
              payload: values,
            })
            .then(r => {
              if (this.props.save.payload.code === 0) {
                message.success('保存成功');
                this.props.history.push({ pathname: '/patrolPlan' });
              }
            });
        } else {
          let parmes = {
            ...values,
            beginDate: moment(values.beginDate).format('YYYY-MM-DD HH:mm:ss'),
            endDate: moment(values.endDate).format('YYYY-MM-DD HH:mm:ss'),
            id: this.props.location.state.data.id,
            itemIds: this.state.targetKeys,
          };
          this.props
            .dispatch({
              type: 'patrolPlan/updateData',
              payload: parmes,
            })
            .then(r => {
              if (this.props.update === 0) {
                message.success('修改成功');
                this.props.history.push({ pathname: '/patrolPlan' });
              } else {
                message.error('修改失败');
              }
            });
        }
      }
    });
  };
  onChange = targetKeys => {
    console.log('Target Keys:', targetKeys);
    this.setState({ targetKeys: targetKeys });
  };
  onSelectList = value => {
    //调用查询方法
    this.props
      .dispatch({
        type: 'depMange/findUserByOrganizationId',
        payload: {
          id: value,
        },
      })
      .then(() => {
        console.log(this.props.getUserListByOrganizationId);
        let child = [];
        // let arr=combinationData2(this.props.getUserListByOrganizationId);
        // console.log(this.props.getUserListByOrganizationId)
        this.props.getUserListByOrganizationId.map(item => {
          child.push(<Option key={item.id.toString()}>{item.name.toString()}</Option>);
        });
        this.setState({
          getUserListByOrganizationId: child,
        });
      });
  };

  render() {
    const { submitting, responsibleOrganization } = this.props;
    const { targetKeys, treeList } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 7,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 12,
        },
        md: {
          span: 10,
        },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 10,
          offset: 7,
        },
      },
    };

    return (
      <PageHeaderWrapper content="添加检查计划">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="计划编号">
              {getFieldDecorator('planCode', {
                rules: [
                  {
                    required: true,
                    message: '设备编号不能为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.planCode,
              })(<Input placeholder="设备编号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="计划名称">
              {getFieldDecorator('planName', {
                rules: [
                  {
                    required: true,
                    message: '设备名称不能为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.planName,
              })(<Input placeholder="设备名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="开始时间">
              {getFieldDecorator('beginDate', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : moment(this.props.location.state.data.beginDate),
              })(<DatePicker showTime placeholder="选择时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="结束时间">
              {getFieldDecorator('endDate', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : moment(this.props.location.state.data.endDate),
              })(<DatePicker showTime placeholder="选择时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="检查周期">
              {getFieldDecorator('planType', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.planType,
              })(
                <Radio.Group initialValue={0}>
                  <Radio value={0}>日检查</Radio>
                  <Radio value={1}>周检查</Radio>
                  <Radio value={2}>月检查</Radio>
                  <Radio value={3}>季度检查</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="责任部门">
              {getFieldDecorator('organizationId', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.organizationId,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  // value={this.state.value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.treeData}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onSelect={this.onSelectList}
                  // onChange={this.onChange}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="责任人">
              {getFieldDecorator('personLiableId', {
                rules: [
                  {
                    required: true,
                    message: '责任人不允许为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.personLiableId,
              })(
                <Select
                  size={this.state.size}
                  initialValue="a1"
                  onChange={handleChange}
                  style={{ width: 200 }}
                >
                  {this.state.getUserListByOrganizationId}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="备注（选填）">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.remark,
              })(<TextArea placeholder="备注" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="添加区域">
              {getFieldDecorator('itemIds', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
              })(
                <TreeTransfer
                  dataSource={treeList}
                  targetKeys={targetKeys}
                  onChange={this.onChange}
                />,
              )}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                {this.state.button}
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={() => this.props.history.push({ pathname: '/patrolPlan' })}
              >
                取消并返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ depMange, patrolPlan, classification, deviceManagement, global }) => ({
    responsibleOrganization: depMange.getList,
    getUserListByOrganizationId: depMange.getUserListByOrganizationId,
    save: patrolPlan.saveCode,
    treeList: deviceManagement.treeData,
    update: patrolPlan.updateCode,
  }))(AddForm),
);
