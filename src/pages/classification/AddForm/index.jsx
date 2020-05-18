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
// treeData处理数据
function depDataTree(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.className;
      item.value = item.id;
      item.key = item.id;
      if (item.children) {
        depDataTree(item.children);
      }
    });
    return array;
  }
}
class AddForm extends Component {
  state = {
    size: 'default',
    treeData:"",
    parentClass: undefined,
    button:'添加设备分类'
  };
  componentDidMount() {
    if(this.props.location.state.isAdd===0){
      this.setState({
        button: '修改设备分类',
      });
    }
    this.props
    .dispatch({
      type: 'classification/classificationList',
    })
    .then(r => {
      let tree = depDataTree(this.props.responsibleOrganization.data);
      this.setState({
        treeData: tree,
      });
    });
 }
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(this.props.location.state.isAdd===1){
          dispatch({
            type: 'classification/saveData',
            payload: values,
          }).then(r => {
            if (this.props.save.payload.code === 0) {
              message.success("保存成功")
              this.props.history.push({ pathname: '/classification' });
            }else{
              message.error(this.props.save.payload.msg)
            }
          });
        }else{
          let parmes={
            ...values,
            children:this.props.location.state.data.children,
            id: this.props.location.state.data.id
          }
          dispatch({
            type: 'classification/updateData',
            payload: parmes,
          }).then(r => {
            if (this.props.update === 0) {
              message.success("修改成功")
              this.props.history.push({ pathname: '/classification' });
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
      <PageHeaderWrapper content="设备分类">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="设备分类编号">
              {getFieldDecorator('classCode', {
                rules: [
                  {
                    required: true,
                    message: '设备分类编号不能为空',
                  },
                ],
                initialValue:this.props.location.state.data === null ? "":this.props.location.state.data.classCode
              })(<Input placeholder="设备编号" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备分类名称">
              {getFieldDecorator('className', {
                rules: [
                  {
                    required: true,
                    message: '设备分类名称不能为空',
                  },
                ],
                initialValue:this.props.location.state.data === null ? "":this.props.location.state.data.className
              })(<Input placeholder="设备分类名称" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="上级设备分类">
              {getFieldDecorator('parentClass', {
                rules: [
                  {
                    required: false,
                    message: '上级部门不能为空',
                  },
                ],
                initialValue:this.props.location.state.data === null ? "":this.props.location.state.data.parentClass
              })(<TreeSelect
                style={{ width: '100%' }}
                // value={this.state.parentClass}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeData={this.state.treeData}
                placeholder="请选择"
                // treeDefaultExpandAll
                // onChange={this.onOrganizationChange}
              />)}
            </FormItem>
            <FormItem {...formItemLayout} label="描述">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: true,
                    message: '描述不能为空',
                  },
                ],
                initialValue:this.props.location.state.data === null ? "":this.props.location.state.data.remark
              })(<TextArea placeholder="描述" />)}
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
                  this.props.history.push({ pathname: '/classification' });
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
  connect(({ loading, classification }) => ({
    responsibleOrganization: classification.list,
    save : classification.saveCode,  
    update : classification.updateCode
  }))(AddForm),
);
