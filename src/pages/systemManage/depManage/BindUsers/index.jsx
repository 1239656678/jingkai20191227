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
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import TreeSelect from 'antd/es/tree-select';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

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

class BindUsers extends Component {
  state = {
    data: [],
    mockData: [],
    targetKeys: [],
    getMenu: [],
  };
  componentDidMount() {
    this.setState({
      data: this.props.location.state.data,
    });
    this.props
      .dispatch({
        type: 'userManage/getUserList',
      })
      .then(r => {
        this.setState({
          mockData: combinationData3(this.props.getUserList),
        });
        console.log('props',this.props)
      });
    this.props
      .dispatch({
        type: 'depMange/getOrganizationUserById',
        payload: this.props.location.state.data.id
      })
      .then(r => {
        let getfindmenuList = combinationData3(this.props.getOrganizationUser.data);
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

  filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

  handleChange = targetKeys => {
    this.setState({ targetKeys });
  };

  handleSearch = (dir, value) => {
    console.log('search:', dir, value);
  };

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      let userIdss = Array.from(values.userIds);
      let ids = '';
      for (let i = 0; i < userIdss.length; i++) {
        if (i == userIdss.length - 1) {
          ids += userIdss[i];
        } else {
          ids += userIdss[i] + ',';
        }
      }
      const value = {
        organizationId: this.props.location.state.data.id,
        userIds: ids,
      }
      if (!err) {
        dispatch({
          type: 'depMange/bindOrganizationUser',
          payload: value,
        }).then(r => {
          if(this.props.BindOrganizationUserList.code==0){
            message.success('绑定成功');
            this.props.history.push({ pathname: '/depManage' });
          }else{
               message.error(this.props.BindOrganizationUserList.msg);
          }
        });
      }
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
    return (
      <PageHeaderWrapper content=''>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="部门名称">
              {this.state.data.name}
            </FormItem>
            <FormItem {...formItemLayout} label="人员列表">
              {getFieldDecorator('userIds', {
                rules: [
                  {
                    required: true,
                    message: '人员列表不能为空',
                  },
                ],
              })(
                <Transfer
                  dataSource={this.state.mockData}
                  showSearch
                  titles={['人员列表', '已绑定人员']}
                  listStyle={{
                    width: 200,
                    height: 350,
                  }}
                  // filterOption={this.filterOption}
                  targetKeys={this.state.targetKeys}
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
                marginLeft:30
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                绑定领导人
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={() => {
                  this.props.history.push({ pathname: '/depManage' });
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
  connect(({ loading, userManage,depMange }) => ({
    getUserList:userManage.userList,
    BindOrganizationUserList:depMange.setBindOrganizationUserResult,
    getOrganizationUser:depMange.OrganizationUserResult
  }))(BindUsers),
);
