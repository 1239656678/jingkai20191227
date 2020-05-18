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
    button:'添加检查项'
  };
  
 
  componentDidMount() {
    if(this.props.location.state.isAdd===0){
      this.setState({
        button: '修改检查项',
      });
    }
 }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(this.props.location.state.isAdd===1){
          dispatch({
            type: 'checkItem/saveData',
            payload: values,
          }).then(r => {
            if (this.props.save.payload.code === 0) {
              message.success("保存成功")
              this.props.history.push({ pathname: '/checkItem' });
            }
          });
        }else{
          let parmes={
            ...values,
            id: this.props.location.state.data.id
          }
          dispatch({
            type: 'checkItem/updateData',
            payload: parmes,
          }).then(r => {
            if (this.props.update === 0) {
              message.success("修改成功")
              this.props.history.push({ pathname: '/checkItem' });
            }else{
              message.error("修改失败")
            }
          });
        }
        
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
      <PageHeaderWrapper content="添加角色">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="标准编号">
              {getFieldDecorator('targetCode', {
                rules: [
                  {
                    required: true,
                    message: '标准编号不能为空',
                  },
                ],
                initialValue:this.props.location.state.data === null ? "":this.props.location.state.data.targetCode
              })(<Input placeholder="标准编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="检查项">
              {getFieldDecorator('targetName', {
                rules: [
                  {
                    required: true,
                    message: '检查项不能为空',
                  },
                ],
                initialValue:this.props.location.state.data === null ? "":this.props.location.state.data.targetName
              })(<Input placeholder="检查项" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="备注">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '备注不能为空',
                  },
                ],
                initialValue:this.props.location.state.data === null ? "":this.props.location.state.data.remark
              })(<TextArea placeholder="备注" />)}
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
                onClick={() => {
                  this.props.history.push({ pathname: '/checkItem' });
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
  connect(({ loading, checkItem }) => ({
    save: checkItem.saveCode,
    update : checkItem.updateCode
  }))(AddForm),
);
