import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
  message,
  Transfer,
  Tree,
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import TreeSelect from 'antd/es/tree-select';
const { TreeNode } = Tree;
// import TreeSelectTransfer from './aaa.js';
const FormItem = Form.Item;

const data = [
  {
    id: 1,
    name: 'test0',
    children: [
      {
        id: 3,
        name: 'test01',
        children: [
          {
            id: 8,
            name: 'test011',
          },
          {
            id: 9,
            name: 'test012',
          },
          {
            id: 10,
            name: 'test013',
            node_order: 2,
          },
        ],
      },
      {
        id: 6,
        name: 'test02',
        children: [
          {
            id: 14,
            name: 'test021',
          },
          {
            id: 15,
            name: 'test022',
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'test1',
    children: [
      {
        id: 5,
        name: 'test11',
        children: [
          {
            id: 11,
            name: 'test111',
          },
          {
            id: 12,
            name: 'test112',
          },
          {
            id: 13,
            name: 'test113',
            node_order: 2,
          },
        ],
      },
      {
        id: 7,
        name: 'test12',
        children: [
          {
            id: 16,
            name: 'test121',
          },
          {
            id: 17,
            name: 'test122',
          },
        ],
      },
    ],
  },
];
// treeData处理数据
function combinationData3(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
    });
    return array;
  }
}

const treeData = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      { key: '0-1-1', title: '0-1-1' },
    ],
  },
  { key: '0-2', title: '0-3' },
];

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
  //   console.log('restProps', restProps);
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
              autoExpandParent={restProps.autoExpandParent}
              blockNode
              checkable
              checkStrictly
              defaultExpandAll={false}
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

class MenuAddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      mockData: [],
      targetKeys: [],
      getMenu: [],
      autoExpandParent: false,
    };
  }

  componentDidMount() {
    this.getMock();
    this.setState({
      data: this.props.location.state.detail,
    });
    this.props
      .dispatch({
        type: 'rolemanage/AllMenu',
      })
      .then(r => {
        this.setState({
          mockData: combinationData3(this.props.AllMenu.payload.data),
        });
      });
    this.props
      .dispatch({
        type: 'rolemanage/getMenu',
        payload: {
          id: this.props.location.state.detail.id,
        },
      })
      .then(r => {
        let getfindmenuList = combinationData3(this.props.getMenu);
        if (getfindmenuList != null) {
          let keys = [];
          let arrData = Array.from(getfindmenuList);
          arrData.map(item => {
            keys.push(item.key);
          });
          this.setState({
            targetKeys: keys,
          });
        }
      });
  }

  handleSearch = (dir, value) => {
    this.setState({
      autoExpandParent: true,
    });
    console.log('eee====', value);
  };

  getMock = () => {
    const targetKeys = [];
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      const data = {
        key: i.toString(),
        title: `content${i + 1}`,
        description: `description of content${i + 1}`,
        chosen: Math.random() * 2 > 1,
      };
      if (data.chosen) {
        targetKeys.push(data.key);
      }
      mockData.push(data);
    }
    this.setState({ mockData, targetKeys });
  };

  // filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let menuids = Array.from(values.menuIds);
      let role = values.roleId;
      let ids = '';
      for (let i = 0; i < menuids.length; i++) {
        if (i == menuids.length - 1) {
          ids += menuids[i];
        } else {
          ids += menuids[i] + ',';
        }
      }
      const value = {
        roleId: this.props.location.state.detail.id,
        menuIds: ids,
      };
      const parme = 'roleId=' + value.roleId + '&menuIds=' + value.menuIds;
      //   console.log('parmes', parme);
      if (!err) {
        dispatch({
          type: 'rolemanage/bindMenuList',
          payload: parme,
        }).then(r => {
          this.props.dispatch({
            type: 'login/findCurrentMenu',
          });
          if (this.props.save.payload.code === 0) {
            message.success(this.props.save.payload.msg);
            this.props.history.push({ pathname: '/rolemanage' });
          } else {
            message.error(this.props.save.payload.msg);
          }
        });
      }
    });
  };

  render() {
    const { submitting, responsibleOrganization } = this.props;
    const { targetKeys } = this.state;
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
      <PageHeaderWrapper content={this.state.data.name}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="角色名称">
              {this.state.data.name}
            </FormItem>
            <FormItem {...formItemLayout} label="菜单列表">
              {getFieldDecorator('menuIds', {
                rules: [
                  {
                    required: false,
                    message: '菜单列表不能为空',
                  },
                ],
              })(
                <TreeTransfer
                  titles={['菜单列表', '已绑定菜单']}
                  listStyle={{
                    width: 200,
                    height: 350,
                    overflow: 'auto',
                  }}
                  onSearch={this.handleSearch}
                  dataSource={this.state.mockData}
                  // dataSource={treeData}
                  autoExpandParent={this.state.autoExpandParent}
                  targetKeys={this.state.targetKeys}
                  onChange={this.handleChange}
                  render={item => item.title}
                />,
                // <TreeSelectTransfer
                //     dataSource={data}
                //     titles={['可升级服务列表', "选中列表"]}
                // />
              )}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                添加菜单权限
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={() => {
                  this.props.history.push({ pathname: '/rolemanage' });
                }}
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
  connect(({ loading, rolemanage }) => ({
    save: rolemanage.bindCode,
    getMenu: rolemanage.menuList,
    AllMenu: rolemanage.getAllMenuDate,
  }))(MenuAddForm),
);
