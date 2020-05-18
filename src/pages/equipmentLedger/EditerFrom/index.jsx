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

class EditerFrom extends Component {
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'equipmentLedgerAndEditerFrom/submitRegularForm',
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
    return (
      <PageHeaderWrapper content="equipmentledgerandediterfrom.basic.description">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="equipmentledgerandediterfrom.title.label">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: 'equipmentledgerandediterfrom.title.required',
                  },
                ],
              })(<Input placeholder="equipmentledgerandediterfrom.title.placeholder" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="equipmentledgerandediterfrom.date.label">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: 'equipmentledgerandediterfrom.date.required',
                  },
                ],
              })(
                <RangePicker
                  style={{
                    width: '100%',
                  }}
                  placeholder={[
                    'equipmentledgerandediterfrom.placeholder.start',
                    'equipmentledgerandediterfrom.placeholder.end',
                  ]}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="equipmentledgerandediterfrom.goal.label">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: 'equipmentledgerandediterfrom.goal.required',
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder="equipmentledgerandediterfrom.goal.placeholder"
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="equipmentledgerandediterfrom.standard.label">
              {getFieldDecorator('standard', {
                rules: [
                  {
                    required: true,
                    message: 'equipmentledgerandediterfrom.standard.required',
                  },
                ],
              })(
                <TextArea
                  style={{
                    minHeight: 32,
                  }}
                  placeholder="equipmentledgerandediterfrom.standard.placeholder"
                  rows={4}
                />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  equipmentledgerandediterfrom.client.label
                  <em className={styles.optional}>
                    equipmentledgerandediterfrom.form.optional
                    <Tooltip title="equipmentledgerandediterfrom.label.tooltip">
                      <Icon
                        type="info-circle-o"
                        style={{
                          marginRight: 4,
                        }}
                      />
                    </Tooltip>
                  </em>
                </span>
              }
            >
              {getFieldDecorator('client')(
                <Input placeholder="equipmentledgerandediterfrom.client.placeholder" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  equipmentledgerandediterfrom.invites.label
                  <em className={styles.optional}>equipmentledgerandediterfrom.form.optional</em>
                </span>
              }
            >
              {getFieldDecorator('invites')(
                <Input placeholder="equipmentledgerandediterfrom.invites.placeholder" />,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label={
                <span>
                  equipmentledgerandediterfrom.weight.label
                  <em className={styles.optional}>equipmentledgerandediterfrom.form.optional</em>
                </span>
              }
            >
              {getFieldDecorator('weight')(
                <InputNumber
                  placeholder="equipmentledgerandediterfrom.weight.placeholder"
                  min={0}
                  max={100}
                />,
              )}
              <span className="ant-form-text">%</span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="equipmentledgerandediterfrom.public.label"
              help="equipmentledgerandediterfrom.label.help"
            >
              <div>
                {getFieldDecorator('public', {
                  initialValue: '1',
                })(
                  <Radio.Group>
                    <Radio value="1">equipmentledgerandediterfrom.radio.public</Radio>
                    <Radio value="2">equipmentledgerandediterfrom.radio.partially-public</Radio>
                    <Radio value="3">equipmentledgerandediterfrom.radio.private</Radio>
                  </Radio.Group>,
                )}
                <FormItem
                  style={{
                    marginBottom: 0,
                  }}
                >
                  {getFieldDecorator('publicUsers')(
                    <Select
                      mode="multiple"
                      placeholder="equipmentledgerandediterfrom.publicUsers.placeholder"
                      style={{
                        margin: '8px 0',
                        display: getFieldValue('public') === '2' ? 'block' : 'none',
                      }}
                    >
                      <Option value="1">equipmentledgerandediterfrom.option.A</Option>
                      <Option value="2">equipmentledgerandediterfrom.option.B</Option>
                      <Option value="3">equipmentledgerandediterfrom.option.C</Option>
                    </Select>,
                  )}
                </FormItem>
              </div>
            </FormItem>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                equipmentledgerandediterfrom.form.submit
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
              >
                equipmentledgerandediterfrom.form.save
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
    submitting: loading.effects['equipmentLedgerAndEditerFrom/submitRegularForm'],
  }))(EditerFrom),
);
