import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, message } from 'antd';
import { submitList, updateList } from './service';
const FormItem = Form.Item;
const { TextArea } = Input;

class addForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      data: this.props.location.state.data,
    };
  }
  componentDidMount() {}

  submitForm = () => {
    const { data } = this.state;
    if (data == '') {
      //新增
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            submitting: true,
          });
          submitList(values).then(res => {
            if (res.code == '0') {
              message.success('提交成功');
              this.setState({
                submitting: false,
              });
              this.props.form.resetFields();
              this.props.history.push({
                pathname: '/smsMaintenanceTarget/maintenanceStandard',
              });
            }
          });
        }
      });
    } else {
      //编辑
      this.props.form.validateFields((err, values) => {
        if (!err) {
          this.setState({
            submitting: true,
          });
          let params = {
            id: data.id,
            ...values,
          };
          updateList(params).then(res => {
            if (res.code == '0') {
              message.success('编辑成功');
              this.setState({
                submitting: false,
                data: '',
              });
              this.props.form.resetFields();
              this.props.history.push({
                pathname: '/smsMaintenanceTarget/maintenanceStandard',
              });
            }
          });
        }
      });
    }
  };
  render() {
    const { data, submitting } = this.state;
    const { form, loading } = this.props;
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
    const styles = {
      color: '#666666',
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Form
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="标准编号">
              {getFieldDecorator('targetCode', {
                rules: [
                  {
                    required: true,
                    message: '编号不能为空',
                  },
                ],
                initialValue: data ? data.targetCode : '',
                // initialValue: data === null ? "" : data.targetCode
              })(<Input style={styles} placeholder="请输入标准编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养项">
              {getFieldDecorator('targetName', {
                rules: [
                  {
                    required: true,
                    message: '保养项不能为空',
                  },
                ],
                initialValue: data ? data.targetName : '',
                // initialValue: data === null ? "" : data.targetName
              })(<Input style={styles} placeholder="请输入检查项" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注 （选填）">
              {getFieldDecorator('remark', {
                initialValue: data ? data.remark : '',
                // initialValue : data === null ? "" : data.remark
              })(<TextArea style={styles} />)}
            </FormItem>

            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                onClick={this.submitForm}
              >
                提交
              </Button>
              <Button
                style={{ marginLeft: 8 }}
                onClick={() => {
                  this.props.history.push({
                    pathname: '/smsMaintenanceTarget/maintenanceStandard',
                  });
                }}
              >
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(addForm);
