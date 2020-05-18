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
} from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class FormBasicForm extends Component {
  state={
    weixiu : this.props.location.state.data
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'equipmentLedgerAndFormBasicForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  componentDidMount(){
    console.log(this.props)
  }

  render() {
    const { submitting } = this.props;
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
      <PageHeaderWrapper content="设备保养">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="设备编号">
              {getFieldDecorator('code', {
              })(<Input placeholder={this.props.location.state.data.code} disabled="disabled" value={this.props.location.state.data.code} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="设备名称">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入设备名称',
                }],
              })(<Input placeholder={this.props.location.state.data.name} disabled="disabled" value={this.props.location.state.data.name}  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备分类">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入设备分类',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备型号">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入设备型号',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="责任部门">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入责任部门',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="责任人">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入责任人',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养时间">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入责任人',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="审核人">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请选择审核人',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="申请金额">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请选择申请金额',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养说明">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请输入保养说明',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养依据">
              {getFieldDecorator('name', {
                rules: [{
                  required: true,
                  message: '请提交保养依据',
                }],
              })(<Input placeholder={this.props.location.state.data.typeId} value={this.props.location.state.data.typeId} disabled="disabled"  />)}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                保养提交
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
              >
                取消返回
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading }) => ({
    submitting: loading.effects['equipmentLedgerAndFormBasicForm/submitRegularForm'],
  }))(FormBasicForm),
);
