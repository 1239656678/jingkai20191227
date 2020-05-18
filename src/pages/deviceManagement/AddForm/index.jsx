import { Button, Card, DatePicker, Form, Icon, Input, Select, Tooltip, message } from 'antd';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import TreeSelect from 'antd/es/tree-select';
import TableForm from '../components/TableForm.tsx';

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
      item.children = item.children;
      if (item.children) {
        combinationData3(item.children);
      }
    });
    return array;
  }
}

class AddForm extends Component {
  state = {
    treeData: [],
    getUserListByOrganizationId: [],
    children: [],
    type: [],
    treeList: [],
    people: [],
    size: 'default',
    button: '添加区域',
    areaItem: null,
  };
  componentDidMount() {
    if (this.props.location.state.isAdd === 0) {
      this.setState({
        button: '修改区域',
      });
    }
    this.props
      .dispatch({
        type: 'deviceManagement/treeData',
      })
      .then(r => {
        let data = combinationData3(this.props.treeData);
        this.setState({
          treeList: data,
        });
      });
  }

  //提交保存
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let params = { name: '', pid: '' };
        if (this.props.location.state.isAdd === 1) {
          if (values.pid == '') {
            params.pid = null;
            params.name = values.name;
          } else {
            params.pid = values.pid;
            params.name = values.name;
          }
          // console.log('paramsffddf====', params);
          dispatch({
            type: 'deviceManagement/fakeSubmitForm',
            payload: params,
          }).then(r => {
            if (this.props.save.code === 1) {
              message.error(this.props.save.msg);
            } else if (this.props.save.code === 0) {
              message.success('添加成功');
              this.props.history.push({
                pathname: '/devicemanagement/area/areamanager',
              });
            }
          });
        } else {
          let upparmes = { pid: '' };
          // console.log ('修改区域==',values)
          if (values.pid == '') {
            parmupparmeses.pid = null;
          } else {
            upparmes.pid = values.pid;
          }
          let parmes = {
            ...values,
            pid: upparmes.pid ? upparmes.pid : null,
            id: this.props.location.state.record.id,
            childrens: [{}],
          };

          // console.log ('parmes====',parmes)
          dispatch({
            type: 'deviceManagement/updateData',
            payload: parmes,
          }).then(r => {
            if (this.props.update === 0) {
              message.success('修改成功');
              this.props.history.push({
                pathname: '/devicemanagement/area/areamanager',
              });
            } else {
              message.error('修改失败');
            }
          });
        }
      }
    });
  };
  onChange = (value, title, item) => {
    // console.log('onchangessss=====',value,title,item);
    // console.log('row===', item.triggerNode.props);
    this.setState({
      areaItem: item.triggerNode.props,
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
          offset: 10,
        },
        sm: {
          span: 10,
          offset: 9,
        },
      },
    };
    return (
      <PageHeaderWrapper title="添加区域">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="区域名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '区域名称不能为空',
                  },
                ],
                initialValue:
                  this.props.location.state.record == null
                    ? ''
                    : this.props.location.state.record.name,
              })(<Input placeholder="区域名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="上级区域">
              {getFieldDecorator('pid', {
                rules: [
                  {
                    required: false,
                    message: '上级区域不能为空',
                  },
                ],
                // initialValue:this.props.location.state.data == null ? '' : this.props.location.state.data.pid,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  treeData={this.state.treeList}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onChange={this.onChange}
                />,
              )}
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
                  this.props.history.push({
                    pathname: '/devicemanagement/area/areamanager',
                  });
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
  connect(({ loading, deviceManagement }) => ({
    save: deviceManagement.save,
    treeData: deviceManagement.treeData,
    update: deviceManagement.updateCode,
  }))(AddForm),
);
