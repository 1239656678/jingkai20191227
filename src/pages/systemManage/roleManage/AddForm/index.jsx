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
  data:[],
  buttonTitle:'添加角色'
  };
  componentDidMount() {
    console.log("this.props",this.props)
    if(this.props.location.state.isAdd==0){
      this.setState({
        data:this.props.location.state.data,
        buttonTitle:'修改角色'
      })
    }
  }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(this.props.location.state.isAdd==0){
          let parames={
            ...values,
            id:this.state.data.id
          }
          dispatch({
            type: 'rolemanage/updateData',
            payload: parames,
          }).then(r => {
            if (this.props.updata.payload.code === 0) {
              message.success(this.props.updata.payload.msg)
              this.props.history.push({ pathname: '/rolemanage' });
            }else{
              message.error(this.props.updata.payload.msg)
            }
          });
        }else{
          dispatch({
            type: 'rolemanage/saveData',
            payload: values,
          }).then(r => {
            if (this.props.save.payload.code === 0) {
              message.success(this.props.save.payload.msg)
              this.props.history.push({ pathname: '/rolemanage' });
            }else{
              message.error(this.props.save.payload.msg)
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
    const {data}=this.state
    return (
      <PageHeaderWrapper content={this.state.buttonTitle}>
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="角色编号">
              {getFieldDecorator('code', {
                rules: [
                  {
                    required: true,
                    message: '角色编号不能为空',
                  },
                ],
                initialValue:data === [] ? '':data.code
              })(<Input placeholder="角色编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="角色名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '角色名称不能为空',
                  },
                ],
                initialValue:data === [] ? '':data.name
              })(<Input placeholder="角色名称" />)}
            </FormItem>

            
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
              {this.state.buttonTitle}
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
    save: rolemanage.saveCode,
    updata:rolemanage.updateCode
  }))(AddForm),
);
