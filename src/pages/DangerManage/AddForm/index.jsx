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
  message,
  Tooltip,
  Upload
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

class AddForm extends Component {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'dangerManageAndAddForm/submitRegularForm',
          payload: values,
        });
      }
    });
  };

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
    const fileup = {
      name: 'file',
      action: 'http://106.12.190.252:8085/upload/file',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <PageHeaderWrapper
        content="指派"
      >
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem
              {...formItemLayout}
              label="隐患位置"
            >
              {getFieldDecorator('dangerAddress', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
              })(
                <Input
                  placeholder=""
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="隐患类型(选填)"
            >
              {getFieldDecorator('dangerTypeId', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
              })(
                <Input
                  placeholder=""
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="设备编号(选填)"
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
              })(
                <Input
                  placeholder=""
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="设备名称(选填)"
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
              })(
                <Input
                  placeholder=""
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="隐患级别(选填)"
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
              })(
                <Input
                  placeholder=""
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="隐患说明"
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
              })(
                <Input
                  placeholder=""
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="隐患依据"
            >
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
              })(
                <Upload {...fileup}>
                  <Button>
                    <Icon type="upload" /> 上传依据
                  </Button>
                </Upload>
              )}
            </FormItem>




            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                <FormattedMessage id="dangermanageandaddform.form.submit" />
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
              >
                <FormattedMessage id="dangermanageandaddform.form.save" />
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
    submitting: loading.effects['dangerManageAndAddForm/submitRegularForm'],
  }))(AddForm),
);
