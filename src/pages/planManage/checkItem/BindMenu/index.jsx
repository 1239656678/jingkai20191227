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
} from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import TreeSelect from 'antd/es/tree-select';
import Tree from 'antd/es/tree';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

function handleChange(value) {
  console.log(`selected ${value}`);
}

// 部门treeData处理数据
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
  array.map(item => {
    if (item.children) {
      mockData.push({
        key: item.id,
        value: item.id,
        title: item.className,
        children: combinationClassData(item.children),
      });
    } else {
      mockData.push({
        key: item.id,
        value: item.id,
        title: item.className,
      });
    }
  });
  return mockData;
}
class AddForm extends Component {
  state = {
    treeData: [],
    getUserListByOrganizationId: [],
    children: [],
    classificationList: [],
    people: [],
    size: 'default',
    findAllViewList: [],
    targetKeys: [],
    button: '绑定设备类型',
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
    console.log('props:', this.props);

    this.props
      .dispatch({
        type: 'classification/classificationList',
      })
      .then(r => {
        console.log(this.props.classificationList.data);
        this.setState({
          classificationList: combinationClassData(this.props.classificationList.data),
        });
      });
    this.props
      .dispatch({
        type: 'checkItem/getBindTargetsById',
        payload: this.props.location.state.data.id,
      })
      .then(r => {
        this.setState({
          targetKeys:
            this.props.targetIds.payload.data == null ? [] : this.props.targetIds.payload.data,
        });
      });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let menuids = Array.from(values.targetIds);
      let ids = '';
      for (let i = 0; i < menuids.length; i++) {
        if (i == menuids.length - 1) {
          ids += menuids[i];
        } else {
          ids += menuids[i] + ',';
        }
      }

      const value = {
        equipmentClassId: this.props.location.state.data.id,
        targetIds: ids,
      };
      // const parme='equipmentClassId='+value.equipmentClassId+'&targetIds='+value.targetIds;
      if (!err) {
        dispatch({
          type: 'checkItem/postBindTargets',
          payload: value,
        }).then(r => {
          if (this.props.save.payload.code === 0) {
            message.success('绑定成功');
            this.props.history.push({ pathname: '/checkitem' });
          } else {
            message.success('绑定失败');
          }
        });
      }
    });
  };
  onChange = targetKeys => {
    console.log('Target Keys:', targetKeys);
    this.setState({ targetKeys });
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
    const { TreeNode } = Tree;

    // Customize Table Transfer
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
          showSelectAll={false}
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
    const { targetKeys } = this.state;
    return (
      <PageHeaderWrapper content="绑定设备分类">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="计划编号">
              {this.props.location.state.data.targetName}
            </FormItem>

            <FormItem {...formItemLayout} label="设备分类" wrapperCol={{ span: 12, offset: 6 }}>
              {getFieldDecorator('targetIds', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
              })(
                <TreeTransfer
                  wrapperCol={{ span: 12, offset: 6 }}
                  dataSource={this.state.classificationList}
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
                onClick={() => this.props.history.push({ pathname: '/checkitem' })}
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
  connect(({ checkItem, classification, global }) => ({
    save: checkItem.bindResultCode,
    classificationList: classification.list,
    targetIds: checkItem.bindResultGetCode,
  }))(AddForm),
);
