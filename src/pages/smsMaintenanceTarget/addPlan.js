import React, { Component } from 'react';
import { Button, Card, Radio, Form, Input, Select, DatePicker, message, TreeSelect } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import style from './style.css';
import {
  addPlanSave,
  fetchEquipment,
  searchOrganization,
  fetchUserById,
  updatePlanSave,
  fetchClassName,
} from './service';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const { TreeNode } = TreeSelect;

// treeData处理数据
function depDataTree(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.className;
      item.value = item.className;
      item.key = item.id;
      if (item.children) {
        depDataTree(item.children);
      }
    });
    return array;
  }
}
class addPlan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      data: this.props.location.state.data,
      classNameList: this.props.location.state.className,
      beginTime: null,
      endTime: null,
      organizations: [], //维保单位
      repairUser: [], //维修人
      nameList: [],
      DeptreeData: '',
      equipmentNameList: [],
      equipmentId: '',
      maintenanceUser: '',
      show: false,
    };
  }
  componentDidMount() {
    const { data } = this.state;
    let arr = [];
    searchOrganization().then(res => {
      for (let i in res.data) {
        arr.push({ organizationNames: res.data[i].name });
      }
      this.setState(
        {
          organizations: arr,
          nameList: res.data,
        },
        () => {
          if (data) {
            //   console.log ('data====',data)
            this.equipmentType(data.className);
            this.select(data.maintenanceOrganization);
          }
        },
      );
    });
    //查询设备类型
    let tree = depDataTree(this.state.classNameList);
    this.setState({
      DeptreeData: tree,
    });
  }

  //根据单位查询维修人
  select = value => {
    const { nameList } = this.state;
    nameList &&
      nameList.map((item, index) => {
        if (item.name == value) {
          if (item.id) {
            fetchUserById(item.id).then(res => {
              if (res.code == '0') {
                this.setState({
                  repairUser: res.data,
                });
              }
            });
          }
        } else {
          this.setState({
            repairUser: [],
          });
        }
      });
  };
  formateDate(date) {
    var date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    var h = date.getHours();
    var mi = date.getMinutes();
    m = m > 9 ? m : '0' + m;
    return y + '-' + m + '-' + d + ' ' + h + ':' + mi;
  }
  //提交
  submitForm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { beginTime, endTime, equipmentId, data, maintenanceUser } = this.state;
        if (data) {
          //修改
          let query = {
            endDate: endTime,
            beginDate: beginTime,
            cycle: values.type,
            maintenanceUser: maintenanceUser,
            remark: values.remark,
            equipmentId: equipmentId,
            id: data.id,
          };
          updatePlanSave(query).then(res => {
            console.log('编辑保存====', res);
            if (res.code == '1') {
              message.success('修改成功');
              this.props.history.push({
                pathname: '/smsMaintenanceTarget/maintenancePlan',
              });
            }
          });
        } else {
          //新增
          let params = {
            endDate: endTime,
            beginDate: beginTime,
            cycle: values.type,
            maintenanceUser: maintenanceUser,
            remark: values.remark,
            equipmentId: equipmentId,
          };
          console.log('params====', params);
          addPlanSave(params).then(res => {
            console.log('res', res);
            if (res.code == '0') {
              message.success('提交成功');
              this.props.history.push({
                pathname: '/smsMaintenanceTarget/maintenancePlan',
              });
            }
          });
        }
      }
    });
  };

  //设备分类
  equipmentType = (value, title, id) => {
    this.setState({ value });
    if (id) {
      // console.log('key.triggerNode.props.id====',id)
      let classId = id.triggerNode.props.id;
      if (classId) {
        //根据设备类型查设备
        fetchEquipment(classId).then(res => {
          // console.log('设备名称22===',res)
          if (res.code == '0') {
            if (res.data == '') {
              message.info('该设备类型下没有设备');
              this.setState({
                show: true,
              });
            } else {
              this.setState({
                show: false,
              });
            }
            this.setState({
              equipmentNameList: res.data,
            });
          }
        });
      }
    }
    // let classId;
    // const { classNameList } = this.state;
    // classNameList && classNameList.map(item => {
    //     if (item.className == value) {
    //         console.log('classId===111',item.id)
    //         classId = item.id;
    //         return classId;
    //     }else{
    //         if (item.children && item.children.length != 0) {
    //             item.children.map(ite => {
    //                 if (ite.className == value) {
    //                 console.log('classId===222',ite.id)
    //                 classId = ite.id;
    //                     return classId;
    //                 }
    //             });
    //         }
    //     }
    // });
  };

  //开始时间
  selectBeginTime = (date, dateString) => {
    // console.log('beginTime====',dateString)
    this.setState({
      beginTime: dateString,
    });
  };

  //结束时间
  selectEndDate = (date, dateString) => {
    // console.log('endTime====',dateString);
    this.setState({
      endTime: dateString,
    });
  };
  //选择设备
  selectEquipment = value => {
    console.log('valsss=====', value);
  };
  //设备id
  equipmentId(id) {
    // console.log('equipmentId===',id)
    this.setState({
      equipmentId: id,
    });
  }
  //维修人id
  maintenanceUser(id) {
    // console.log('maintenanceUserid==',id)
    this.setState({
      maintenanceUser: id,
    });
  }
  render() {
    const { submitting, data, organizations, repairUser, equipmentNameList, show } = this.state;
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
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Form style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label="设备分类">
                {getFieldDecorator('className', {
                  rules: [{ required: true, message: '请选择设备分类' }],
                  initialValue: data === '' ? undefined : data.className,
                })(
                  <TreeSelect
                    style={{ width: '100%' }}
                    // value={value}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择设备分类"
                    treeData={this.state.DeptreeData}
                    treeDefaultExpandAll
                    onChange={this.equipmentType}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="设备名称">
                {getFieldDecorator('equipmentName', {
                  rules: [{ required: true, message: '请选择设备名称' }],
                  initialValue:
                    data === '' ? undefined : `${data.equipmentCode} ${data.equipmentName}`,
                })(
                  <Select onChange={this.selectEquipment} placeholder="请选择设备名称">
                    {equipmentNameList &&
                      equipmentNameList.map((item, index) => {
                        return (
                          <Option key={item.id} onClick={this.equipmentId.bind(this, item.id)}>
                            {`${item.code}  ${item.name}`}
                          </Option>
                        );
                      })}
                  </Select>,
                )}
              </FormItem>
              <FormItem
                key="type"
                {...formItemLayout}
                label="保养周期"
                style={{ margin: '0 0 10px' }}
              >
                {getFieldDecorator('type', {
                  rules: [{ required: true, message: '请选择保养周期' }],
                  initialValue: data === '' ? 0 : data.cycle,
                })(
                  <Radio.Group>
                    <Radio value={0}>每周</Radio>
                    <Radio value={1}>每月</Radio>
                    <Radio value={2}>每季</Radio>
                    <Radio value={3}>每年</Radio>
                  </Radio.Group>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="开始时间">
                {getFieldDecorator('startDate', {
                  rules: [{ required: true, message: '请选择开始时间' }],
                  initialValue: data === '' ? undefined : moment(data.beginDate),
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.selectBeginTime}
                    allowClear={false}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="结束时间">
                {getFieldDecorator('endDate', {
                  rules: [{ required: true, message: '请选择结束时间' }],
                  initialValue: data === '' ? undefined : moment(data.endDate),
                })(
                  <DatePicker
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    onChange={this.selectEndDate}
                    allowClear={false}
                  />,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="保养部门">
                {getFieldDecorator('maintenanceOrganization', {
                  rules: [
                    {
                      required: true,
                      message: '保养部门不能为空',
                    },
                  ],
                  initialValue: data === '' ? undefined : data.maintenanceOrganization,
                })(
                  <Select onChange={this.select} placeholder="请选择责任部门">
                    {organizations &&
                      organizations.map((item, index) => {
                        return (
                          <Option key={item.organizationNames}>{item.organizationNames}</Option>
                        );
                      })}
                  </Select>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="保养人">
                {getFieldDecorator('maintenanceUser', {
                  rules: [
                    {
                      required: true,
                      message: '保养人不能为空',
                    },
                  ],
                  initialValue: data === '' ? undefined : data.maintenanceUser,
                })(
                  <Select placeholder="请选择责任人">
                    {repairUser &&
                      repairUser.map((item, index) => {
                        return (
                          <Option key={item.id} onClick={this.maintenanceUser.bind(this, item.id)}>
                            {item.name}
                          </Option>
                        );
                      })}
                  </Select>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="备注 （选填）">
                {getFieldDecorator('remark', {
                  initialValue: data === '' ? '' : data.remark,
                })(<TextArea />)}
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
                  disabled={show}
                >
                  提交
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.props.history.push({ pathname: '/smsMaintenanceTarget/maintenancePlan' });
                  }}
                >
                  取消
                </Button>
              </FormItem>
            </Form>
          </Card>
        </PageHeaderWrapper>
      </div>
    );
  }
}

export default Form.create()(addPlan);
