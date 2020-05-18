import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Transfer,
  Input,
  Badge,
  Table,
  Select,
  Divider,
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

//区域转移框
function combinationClassData(array) {
  const mockData = [];
  if (array != null) {
    array.map(item => {
      if (item.children) {
        mockData.push({
          key: item.id,
          value: item.id,
          title: item.id,
          children: combinationClassData(item.children),
        });
      } else {
        mockData.push({
          key: item.id,
          value: item.id,
          title: item.targetName,
        });
      }
    });
    return mockData;
  }
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
    button: '绑定检查项',
    datatable: [],
    defaultValue: [],
    BindIds: '',
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
    this.props
      .dispatch({
        type: 'checkItem/getPatroPlanList',
      })
      .then(r => {
        this.setState({
          classificationList: combinationClassData(this.props.checkItemlist.data),
        });
      });
    this.props
      .dispatch({
        type: 'checkItem/getBindTargetsById',
        payload: this.props.location.state.data.id,
      })
      .then(r => {
        let arr = [];
        if (this.props.targetIds.payload.data != null) {
          this.props.targetIds.payload.data.map(item => {
            arr.push(item.id);
          });
        }
        this.setState({
          BindIds: arr,
          datatable:
            this.props.targetIds.payload.data == null ? [] : this.props.targetIds.payload.data,
          targetKeys: arr,
        });
      });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;

    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      this.props
        .dispatch({
          type: 'checkItem/getBindTargetsById',
          payload: this.props.location.state.data.id,
        })
        .then(r => {
          let arrs = [];
          if (this.props.targetIds.payload.data != null) {
            this.props.targetIds.payload.data.map(item => {
              arrs.push(item.id);
            });
          }
          dispatch({
            type: 'checkItem/RemoveBindTargets',
            payload: {
              equipmentClassId: this.props.location.state.data.id,
              targetIds: arrs,
            },
          });
        });

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
            // this.props.history.push({ pathname: '/classification' });
            this.props
              .dispatch({
                type: 'checkItem/getBindTargetsById',
                payload: this.props.location.state.data.id,
              })
              .then(r => {
                this.setState({
                  datatable:
                    this.props.targetIds.payload.data == null
                      ? []
                      : this.props.targetIds.payload.data,
                });
              });
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
  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
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
        console.log(child);
        this.setState({
          getUserListByOrganizationId: child,
        });
        console.log(this.state.getUserListByOrganizationId);
      });
  };
  progressColumns = [
    {
      title: '设备分类',
      dataIndex: '',
      key: '',
      render: text => {
        return this.props.location.state.data.className;
      },
    },
    {
      title: '检查计划',
      dataIndex: 'targetName',
      key: 'targetName',
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      key: 'createUser',
      // filters: [{ text: '待巡检' , value: '待巡检' }, { text: '已完成' , value: '已完成' },{ text: '逾期', value: '逾期' }],
      // render: text => {
      //   if (text === 0) {
      //     return <Badge status="processing" text="待巡检" />;
      //   }
      //   if (text === 2) {
      //     return <Badge status="success" text="已完成" />;
      //   }
      //   return <Badge status="error" text="逾期" />;
      // },
    },
    {
      title: '绑定日期',
      dataIndex: 'createDate',
      // render: text => {
      //   return this.state.data.organizationId;
      // },
    },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => (
    //     <>
    //       <a
    //         onClick={() => {
    //           handleUpdateModalVisible(true);
    //           // setStepFormValues(record);
    //         }}
    //       >
    //         编辑
    //       </a>
    //       <Divider type="vertical" />
    //       <a>详情</a>
    //     </>
    //   ),
    // },
  ];
  render() {
    const { submitting, responsibleOrganization } = this.props;
    const { planManageAndpatrolPlanAndDetail, loading } = this.props;
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
      <PageHeaderWrapper content="绑定检查项">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="设备类型">
              {this.props.location.state.data.className}
            </FormItem>
            <Divider
              style={{
                marginBottom: 32,
              }}
            />

            <FormItem {...formItemLayout} label="检查项" wrapperCol={{ span: 12, offset: 6 }}>
              {getFieldDecorator('targetIds', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
              })(
                <Transfer
                  dataSource={this.state.classificationList}
                  showSearch
                  listStyle={{
                    width: 250,
                    height: 350,
                  }}
                  // filterOption={this.filterOption}
                  targetKeys={targetKeys}
                  onChange={this.handleChange}
                  onSearch={this.handleSearch}
                  render={item => item.title}
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
                onClick={() => this.props.history.push({ pathname: '/classification' })}
              >
                取消并返回
              </Button>
            </FormItem>
            <Divider
              style={{
                marginBottom: 32,
              }}
            />
            <FormItem {...formItemLayout} label="已绑定检查项" wrapperCol={{ span: 12, offset: 6 }}>
              <Table
                style={{
                  marginBottom: 16,
                }}
                pagination={false}
                loading={loading}
                pagination={{ pageSize: 10 }}
                dataSource={this.state.datatable}
                columns={this.progressColumns}
              />
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
    checkItemlist: checkItem.list,
    removeTarget: checkItem.removeTargetResult,
  }))(AddForm),
);
