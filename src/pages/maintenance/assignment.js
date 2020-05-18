import React, { Component } from 'react';
import { Button, Card, DatePicker, Form, Input, Select, Tooltip, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import style from './style.css';
import { dispatchForm, searchOrganization, fetchUserById } from './service';
import moment from 'moment';
const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

class assignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.location.state.data,
      organizations: [], //维保单位
      repairUser: [], //维修人
      submitting: false,
      imgsData: this.props.location.state.data.files,
      nameList: [],
    };
  }
  componentDidMount() {
    // console.log('指派=======',this.props.location.state.data)
    // console.log('datagfgdsss=======',this.props.location.state.data.files)//故障依据
    this.setState({
      imgsData: this.props.location.state.data.files,
    });
    let arr = [];
    searchOrganization().then(res => {
      // console.log('维保单位====',res.data)
      for (let i in res.data) {
        arr.push({ organizationNames: res.data[i].name });
      }
      this.setState({
        organizations: arr,
        nameList: res.data,
      });
    });
  }
  //根据单位查询维修人
  select = value => {
    console.log('valuess===', value);
    const { nameList } = this.state;
    nameList &&
      nameList.map((item, index) => {
        if (item.name == value) {
          // console.log('id========',item.id)
          fetchUserById(item.id).then(res => {
            if (res.code == '0') {
              console.log('维修人111====', res);
              this.setState({
                repairUser: res.data,
              });
            }
          });
        }
      });
  };

  //提交保存
  submitForm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { data, nameList, repairUser } = this.state;
        // console.log('values===',values)
        let organizationId = ''; //维修单位Id
        nameList &&
          nameList.map((item, index) => {
            console.log('item====', item);
            if (item.name == values.reportOrganizationName)
              // console.log('itessss====',item.id)
              organizationId = item.id;
          });
        let repairUserId = ''; //维修人Id
        repairUser &&
          repairUser.map(item => {
            if (item.name == values.reportUserName) {
              // console.log('itemdsdd.id====',item.id)
              repairUserId = item.id;
            }
          });

        let params = {
          faultInfoId: data.id, //故障ID
          faultOrganizationId: organizationId, //部门ID
          faultUserId: repairUserId, //维修人ID
        };
        console.log('paramsss111====', params);
        dispatchForm(params).then(res => {
          // console.log('故障指派=====',res)
          if (res.code == '0') {
            message.success('提交成功');
            this.props.history.push({
              pathname: '/maintenance/maintain',
            });
          } else {
            message.error(res.msg);
          }
        });
      }
    });
  };
  render() {
    const { data, repairUser, imgsData, submitting, organizations } = this.state;
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
      <div>
        <PageHeaderWrapper>
          <Card bordered={false}>
            <Form
              style={{
                marginTop: 8,
              }}
            >
              <FormItem {...formItemLayout} label="设备编号">
                {getFieldDecorator('equipmentCode', {
                  initialValue: data === null ? '' : data.equipmentCode,
                })(<Input disabled style={styles} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="设备名称">
                {getFieldDecorator('equipmentName', {
                  initialValue: data === null ? '' : data.equipmentName,
                })(<Input disabled style={styles} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="安装区域">
                {getFieldDecorator('installArea', {
                  initialValue: data === null ? '' : data.installArea,
                })(<Input disabled style={styles} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="报修人">
                {getFieldDecorator('reportUserName', {
                  initialValue: data === null ? '' : data.reportUserName,
                })(<Input disabled style={styles} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="报修时间">
                {getFieldDecorator('reportDate', {
                  initialValue: data === null ? '' : moment(data.reportDate),
                })(<DatePicker disabled showTime format="YYYY-MM-DD HH:mm:ss" />)}
              </FormItem>

              <FormItem {...formItemLayout} label="维修单位">
                {getFieldDecorator('reportOrganizationName', {
                  rules: [
                    {
                      required: true,
                      message: '维修单位不能为空',
                    },
                  ],
                  initialValue: data === null ? '' : data.reportOrganizationName,
                })(
                  <Select onChange={this.select}>
                    {organizations &&
                      organizations.map((item, index) => {
                        return (
                          <Option key={item.organizationNames}>{item.organizationNames}</Option>
                        );
                      })}
                  </Select>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="维修人">
                {getFieldDecorator('reportUserName', {
                  rules: [
                    {
                      required: true,
                      message: '维修人不能为空',
                    },
                  ],
                  initialValue: data === null ? '' : data.reportUserName,
                })(
                  <Select>
                    {repairUser &&
                      repairUser.map((item, index) => {
                        return <Option key={item.name}>{item.name}</Option>;
                      })}
                  </Select>,
                )}
              </FormItem>

              <FormItem {...formItemLayout} label="故障描述">
                {getFieldDecorator('remark', {
                  initialValue: data === null ? '' : data.remark,
                })(<TextArea disabled style={styles} />)}
              </FormItem>
              <FormItem {...formItemLayout} label="故障依据">
                {imgsData.length > 0 ? (
                  imgsData.map((item, index) => {
                    // console.log('item====',item)
                    // if (index == (3(index) + 1)) {
                    //     console.log('index====',index)
                    //     return <img style={{width:'33%',height:66,margin:'0 3px'}} src={'http://106.12.190.252'+item.fileUrl}/>
                    // }
                    return (
                      <div className={style.imgFiles}>
                        <img
                          className={style.imgStyle}
                          src={'http://106.12.190.252' + item.fileUrl}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className={style.imgFiles}></div>
                )}
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
                    this.props.history.push({ pathname: '/maintenance/maintain' });
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

export default Form.create()(assignment);
