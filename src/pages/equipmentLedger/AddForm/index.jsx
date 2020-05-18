import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  Input,
  InputNumber,
  Radio,
  message,
  Select,
  Tooltip,
} from 'antd';
import moment from 'moment';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import TreeSelect from 'antd/es/tree-select';

const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

function handleChange(value) {
  console.log(`selected ${value}`);
}

// treeData处理数据
function combinationData(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
      if (item.children) {
        combinationData(item.children);
      }
    });
    return array;
  }
}
// 设备分类treeData处理数据
function combinationData2(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.className;
      item.value = item.id;
      item.key = item.id;
      if (item.children) {
        combinationData2(item.children);
      }
    });
    return array;
  }
}
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
    classificationList: [],
    treeList: [],
    people: [],
    size: 'default',
    button: '设备台账提交',
    path: '/equipmentledger',
    display: 'none',
  };
  getPeople(arrays) {
    let arrs = [];
    let array = Array.from(arrays);
    array.map(item => {
      arrs.push(<Option key={item.id}>{item.name}</Option>);
    });
    return arrs;
  }
  componentDidMount() {
    if (this.props.location.state.black === 1) {
      this.setState({
        path: '/deviceManagement',
      });
    }
    if (this.props.location.state.isAdd === 0) {
      this.setState({
        button: '修改设备台账',
      });
      //调用查询方法
      this.props
        .dispatch({
          type: 'depMange/findUserByOrganizationId',
          payload: {
            id: this.props.location.state.data.responsibleOrganizationId,
          },
        })
        .then(() => {
          let child = [];
          if (this.props.getUserListByOrganizationId !== null) {
            this.props.getUserListByOrganizationId.map(item => {
              child.push(<Option key={item.id.toString()}>{item.name.toString()}</Option>);
            });
            this.setState({
              getUserListByOrganizationId: child,
            });
          }
        });
    }
    this.props
      .dispatch({
        type: 'classification/classificationList',
      })
      .then(r => {
        console.log(this.props.classificationList.data);
        this.setState({
          classificationList: combinationData2(this.props.classificationList.data),
        });
      });
    this.props
      .dispatch({
        type: 'depMange/treeListDate',
      })
      .then(r => {
        let treeDate = combinationData(this.props.responsibleOrganization.data);
        this.setState({
          treeData: treeDate,
        });
      });
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

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if (this.props.location.state.isAdd === 1) {
          if (values.installRegionsId == '') {
            let noinstallRegionsId = {
              code: values.code,
              name: values.name,
              typeId: values.typeId,
              model: values.model,
              status: values.status,
              responsibleOrganizationId: values.responsibleOrganizationId,
              responsibleUserId: values.responsibleUserId,
              producer: values.producer,
              generatorQr: values.generatorQr,
              remark: values.remark,
              produceDate: moment(values.produceDate).format('YYYY-MM-DD HH:mm:ss'),
              scrappedDate: moment(values.scrappedDate).format('YYYY-MM-DD HH:mm:ss'),
              installDate:
                values.installDate == ''
                  ? ''
                  : moment(values.installDate).format('YYYY-MM-DD HH:mm:ss'),
            };
            dispatch({
              type: 'equipmentLedger/AddSmsEquipmentBaseInfo',
              payload: noinstallRegionsId,
            }).then(r => {
              if (this.props.save.code === 0) {
                message.success('保存成功');
                this.props.history.push({ pathname: this.state.path });
              } else {
                message.error('保存失败');
              }
            });
          } else {
            let add = {
              ...values,
              produceDate: moment(values.produceDate).format('YYYY-MM-DD HH:mm:ss'),
              scrappedDate: moment(values.scrappedDate).format('YYYY-MM-DD HH:mm:ss'),
              installDate:
                values.installDate == ''
                  ? ''
                  : moment(values.installDate).format('YYYY-MM-DD HH:mm:ss'),
            };
            dispatch({
              type: 'equipmentLedger/AddSmsEquipmentBaseInfo',
              payload: add,
            }).then(r => {
              if (this.props.save.code === 0) {
                message.success('保存成功');
                this.props.history.push({ pathname: this.state.path });
              } else {
                message.error('保存失败');
              }
            });
          }
        } else {
          let parmes = {
            ...values,
            produceDate: moment(values.produceDate).format('YYYY-MM-DD HH:mm:ss'),
            scrappedDate: moment(values.scrappedDate).format('YYYY-MM-DD HH:mm:ss'),
            installDate:
              values.installDate == ''
                ? ''
                : moment(values.installDate).format('YYYY-MM-DD HH:mm:ss'),
            id: this.props.location.state.data.id,
          };
          dispatch({
            type: 'equipmentLedger/updateData',
            payload: parmes,
          }).then(r => {
            if (this.props.update === 0) {
              message.success('修改成功');
              this.props.history.push({ pathname: this.state.path });
            } else {
              message.error('修改失败');
            }
          });
        }
      }
    });
  };
  onChange = value => {
    this.setState({ value });
  };
  onSelectRegions = value => {
    this.setState({
      display: 'block',
    });
  };
  onSelectList = value => {
    //调用查询方法
    this.props
      .dispatch({
        type: 'depMange/findUserByOrganizationId',
        payload: {
          id: value,
        },
      })
      .then(() => {
        let child = [];
        this.props.getUserListByOrganizationId.map(item => {
          child.push(<Option key={item.id.toString()}>{item.name.toString()}</Option>);
        });
        this.setState({
          getUserListByOrganizationId: child,
        });
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
      <PageHeaderWrapper content="设备台账添加">
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
                rules: [
                  {
                    required: true,
                    message: '设备编号不能为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.code,
              })(<Input placeholder="设备编号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="设备名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '设备名称不能为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.name,
              })(<Input placeholder="设备名称" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="设备分类">
              {getFieldDecorator('typeId', {
                rules: [
                  {
                    required: true,
                    message: '设备分类不能为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.typeId,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  // value={this.state.value}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.classificationList}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  // onSelect={this.onSelectList}
                  onChange={this.onChange}
                />,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="设备型号">
              {getFieldDecorator('model', {
                rules: [
                  {
                    required: true,
                    message: '设备型号不能为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.model,
              })(<Input placeholder="设备型号" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="生产日期">
              {getFieldDecorator('produceDate', {
                rules: [
                  {
                    required: true,
                    message: '请选择生产日期',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : moment(this.props.location.state.data.produceDate),
              })(
                <DatePicker
                  showTime
                  placeholder="选择时间"
                  initialValue={moment('0000-00-00 00:00:00')}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="报废日期">
              {getFieldDecorator('scrappedDate', {
                rules: [
                  {
                    required: true,
                    message: '请选择报废日期',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : moment(this.props.location.state.data.scrappedDate),
              })(<DatePicker showTime placeholder="选择时间" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="设备状态">
              {getFieldDecorator('status', {
                rules: [
                  {
                    required: true,
                    message: '请选择设备状态',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.status,
              })(
                <Radio.Group initialValue={1}>
                  <Radio value={1}>正常</Radio>
                  <Radio value={2}>故障</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="责任部门">
              {getFieldDecorator('responsibleOrganizationId', {
                rules: [
                  {
                    required: true,
                    message: '责任部门不允许为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.responsibleOrganizationId,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.treeData}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onSelect={this.onSelectList}
                  onChange={this.onChange}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="责任人">
              {getFieldDecorator('responsibleUserId', {
                rules: [
                  {
                    required: true,
                    message: '责任人不允许为空',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.responsibleUserId,
              })(
                <Select
                  size={this.state.size}
                  initialValue="a1"
                  onChange={handleChange}
                  style={{ width: 200 }}
                >
                  {this.state.getUserListByOrganizationId}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="生产厂家（选填）">
              {getFieldDecorator('producer', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.producer,
              })(<Input placeholder="" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="安装区域（选填）">
              {getFieldDecorator('installRegionsId', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.installRegionsId,
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.treeList}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onSelect={this.onSelectRegions}
                  onChange={this.onChange}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="安装日期（选填）">
              {getFieldDecorator('installDate', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : moment(this.props.location.state.data.installDate),
              })(<DatePicker showTime placeholder="选择时间" />)}
            </FormItem>

            <FormItem
              {...formItemLayout}
              style={{ display: this.state.display }}
              label="是否生成二维码"
            >
              {getFieldDecorator('generatorQr', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.generatorQr,
              })(
                <Radio.Group initialValue={false}>
                  <Radio value={false}>不生成</Radio>
                  <Radio value={true}>生成</Radio>
                </Radio.Group>,
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="备注（选填）">
              {getFieldDecorator('remark', {
                rules: [
                  {
                    required: false,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.remark,
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
                // onClick={() => this.props.history.push({ pathname: this.state.path })}
                onClick={() => {
                  history.back(-1);
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
  connect(({ loading, depMange, equipmentLedger, classification, deviceManagement, global }) => ({
    submitting: loading.effects['equipmentLedgerAndAddForm/submitRegularForm'],
    responsibleOrganization: depMange.getList,
    getUserListByOrganizationId: depMange.getUserListByOrganizationId,
    save: equipmentLedger.save,
    classificationList: classification.list,
    treeData: deviceManagement.treeData,
    update: equipmentLedger.updateCode,
  }))(AddForm),
);
