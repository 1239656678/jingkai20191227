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
function depDataTree(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.name;
      item.key = item.id;
    });
    return array;
  }
}
class AddForm extends Component {
  state = {
    size: 'default',
    DeptreeData:"",
    buttonTitle:'添加数据字典',
    data:[]
  };
  componentDidMount() {
    console.log('this.props',this.props)
    if(this.props.location.state.isAdd==0){
      this.setState({
        data:this.props.location.state.data,
        buttonTitle:'修改数据字典'
      })
    }
    this.props
    .dispatch({
      type: 'dataTypeListManage/getDataList',
    })
    .then(r => {
      let tree = depDataTree(this.props.dataTypeList.payload.data);
      this.setState({
        DeptreeData: tree,
      });
    });
 }

  handleSubmit = e => {
    //updateData
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
            type: 'depMange/updateData',
            payload: parames,
          }).then(r => {
            if (this.props.updata.payload.code === 0) {
              message.success(this.props.updata.payload.msg)
              this.props.history.push({ pathname: '/depManage' });
            }else{
              message.error(this.props.updata.payload.msg)
            }
          });
        }else{
        dispatch({
          type: 'depMange/saveData',
          payload: values,
        }).then(r => {
          if (this.props.save.payload.code === 0) {
            message.success(this.props.save.payload.msg)
            this.props.history.push({ pathname: '/depManage' });
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
            <FormItem {...formItemLayout} label="数据名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '数据名称不能为空',
                  },
                ],
                initialValue:data === [] ? '':data.name
              })(<Input placeholder="数据名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="数据类型">
              {getFieldDecorator('typeId', {
                rules: [
                  {
                    required: false,
                    message: '数据类型不能为空',
                  },
                ],
                initialValue:data === [] ? '':data.typeId
              })(<TreeSelect
                style={{ width: '100%' }}
                // value={this.state.value}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={this.state.DeptreeData}
                placeholder="请选择"
                treeDefaultExpandAll
                // onChange={this.onOrganizationChange}
              />)}
            </FormItem>
            <FormItem {...formItemLayout} label="数值">
              {getFieldDecorator('value', {
                rules: [
                  {
                    required: true,
                    message: '数值不能为空',
                  },
                ],
                initialValue:data === [] ? '':data.value
              })(<Input placeholder="数值" />)}
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
  connect(({ loading, depMange,dataTypeListManage }) => ({
    dataTypeList: dataTypeListManage.dataTypelist,
    save : depMange.saveCode,
    updata:depMange.updateCode
  }))(AddForm),
);
