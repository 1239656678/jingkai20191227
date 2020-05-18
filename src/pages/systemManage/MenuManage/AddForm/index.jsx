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
      item.children = item.childrens;
      if (item.childrens) {
        combinationData3(item.childrens);
      }
    });
    return array;
  }
}

class AddForm extends Component {
  state = {
    listDataMenu: [],
    size: 'default',
  };
  componentDidMount() {
    this.props
      .dispatch({
        type: 'menumanage/sysgetMenuList',
      })
      .then(r => {
        let child = [];
        this.props.listDataMenu.payload.data.map(item => {
          //  console.log('item===',item)
          child.push(<Option key={item.id.toString()}>{item.name.toString()}</Option>);
        });
        this.setState({
          listDataMenu: child,
        });
      });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'menumanage/saveData',
          payload: values,
        }).then(r => {
          console.log(this.props);
          if (this.props.save.payload.code === 0) {
            message.success('保存成功');
            this.props.history.push({ pathname: '/menumanage' });
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
      <PageHeaderWrapper content="添加菜单">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="菜单名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '菜单名称不能为空',
                  },
                ],
              })(<Input placeholder="菜单名称长度1~10" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="地址">
              {getFieldDecorator('address', {
                rules: [
                  {
                    required: true,
                    message: '地址不能为空',
                  },
                ],
              })(<Input placeholder="地址" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="图标">
              {getFieldDecorator('icon', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
              })(<Input placeholder="图标" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="菜单等级">
              {getFieldDecorator('level', {
                rules: [
                  {
                    required: true,
                    message: '菜单等级不能为空',
                  },
                ],
              })(<Input placeholder="角色编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="父菜单">
              {getFieldDecorator('parent', {
                rules: [
                  {
                    required: false,
                    message: '父菜单不能为空',
                  },
                ],
              })(
                <Select
                  size={this.state.size}
                  // defaultValue="a1"
                  // onChange={handleChange}
                  style={{ width: 200 }}
                >
                  {this.state.listDataMenu}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="排序">
              {getFieldDecorator('sort', {
                rules: [
                  {
                    required: false,
                    message: '排序不能为空',
                  },
                ],
              })(<Input placeholder="排序" />)}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                添加菜单
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={() => {
                  this.props.history.push({ pathname: '/menumanage' });
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
  connect(({ loading, menumanage }) => ({
    listDataMenu: menumanage.Menulist,
    save: menumanage.saveCode,
  }))(AddForm),
);
