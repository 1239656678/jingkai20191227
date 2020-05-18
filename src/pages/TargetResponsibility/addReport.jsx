import React, { Component } from 'react';
import {
  Button,
  Form,
  Input,
  Upload,
  message,
  Modal,
  Radio,
  Card,
  DatePicker,
  Select,
  Row,
  Col,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { UploadOutlined } from '@ant-design/icons';
import styles from './style.less';
import imgUPload from '../../../public/upload.png';
import imgDownload from '../../../public/download.png';
import { addSaveReport, submitReport } from './service';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
class addReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isdisable: false,
      years: [],
      defaultYear: new Date().getFullYear(),
    };
  }

  componentDidMount() {
    this.getDate();
  }
  onChange = value => {
    // console.log('选择季度', value);
  };

  getDate() {
    var myDate = new Date();
    var thisYear = myDate.getFullYear(); // 获取当年年份
    // console.log('thisYear==',thisYear + '年')
    var Section = thisYear - 1700; // 声明一个变量 获得当前年份至想获取年份差 eg.2008
    var arrYear = []; // 声明一个空数组 把遍历出的年份添加到数组里
    for (var i = 0; i <= Section; i++) {
      arrYear.push(thisYear-- + '年');
    }
    this.setState({
      years: arrYear,
    });
  }
  //提交保存
  submitForm = () => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (values.isYear === true) {
          let params = {
            isYear: values.isYear,
            year: parseInt(values.year),
          };
          addSaveReport(params).then(res => {
            if (res.code == '0') {
              message.success('提交成功');
              this.props.history.push({
                pathname: '/targetResponsibility/securityreport',
              });
            }
          });
        } else {
          let data = {
            isYear: false,
            year: parseInt(values.year),
            quarter: values.quarter,
          };
          submitReport(data).then(response => {
            if (response.code == '0') {
              message.success('提交成功');
              this.props.history.push({
                pathname: '/targetResponsibility/securityreport',
              });
            }
          });
        }
      }
    });
  };

  selectReport = () => {
    this.setState(
      {
        isdisable: true,
      },
      () => {
        this.props.form.validateFields(['seson']);
      },
    );
  };
  render() {
    const { years, organizations, isdisable, defaultYear } = this.state;
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
      <div style={{ background: '#fff', boxShadow: '0px 4px 3px rgba(187,187,187,0.2)' }}>
        <Card bordered={false} bodyStyle={{ padding: '24px 24px 0px' }}>
          <PageHeaderWrapper className={styles.header}>
            <Form style={{ marginTop: 8 }} hideRequiredMark>
              {/* <FormItem {...formItemLayout} label="单位部门">
                                {
                                    getFieldDecorator('organization', {
                                        rules: [{ required: true, message: '请选择单位部门' }],
                                    })(
                                        <Select onChange={this.selectEquipment} placeholder="请选择单位部门">
                                            {equipmentNameList && equipmentNameList.map((item, index) => {
                                                return (
                                                    <Option
                                                        key={item.id}
                                                        onClick={this.equipmentId.bind(this, item.id)}
                                                    >
                                                        {`${item.code}  ${item.name}`}
                                                    </Option>
                                                );
                                            })}
                                        </Select>,
                                    )
                                }
                            </FormItem> */}
              {/* <FormItem {...formItemLayout} label="报表名称">
                                {
                                    getFieldDecorator('reportName', {
                                        rules: [{ required: true, message: '请输入报表名称' }],
                                    })(<Input placeholder="请输入报表名称" />)
                                }
                            </FormItem> */}
              <FormItem
                key="isYear"
                {...formItemLayout}
                label="报表周期"
                style={{ margin: '16px 0' }}
              >
                {getFieldDecorator('isYear', {
                  rules: [{ required: true, message: '请选择报表周期' }],
                })(
                  <Radio.Group>
                    <Radio value={true} onClick={this.selectReport}>
                      年度报表
                    </Radio>
                    <Radio
                      value={1}
                      onClick={() => {
                        this.setState({ isdisable: false });
                      }}
                    >
                      季度报表
                    </Radio>
                  </Radio.Group>,
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="报表名称" style={{ margin: 0 }}>
                <Row gutter={24}>
                  <Col span={6}>
                    <FormItem>
                      {getFieldDecorator('year', {
                        rules: [{ required: true, message: '请选择报表日期' }],
                        initialValue: defaultYear,
                      })(
                        <Select placeholder="请选择年份">
                          {years &&
                            years.map((v, i) => {
                              return <Option key={v}>{v}</Option>;
                            })}
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem>
                      {getFieldDecorator('quarter', {
                        rules:
                          isdisable == true
                            ? [{ required: false }]
                            : [{ required: true, message: '请选择季度' }],
                      })(
                        <Select
                          disabled={isdisable}
                          placeholder="请选择季度"
                          onChange={this.onChange}
                        >
                          <Option key="0">一季度</Option>
                          <Option key="1">二季度</Option>
                          <Option key="2">三季度</Option>
                          <Option key="3">四季度</Option>
                        </Select>,
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </FormItem>
              {/* <FormItem {...formItemLayout} label="报表模板">
                                <div style={{display:'flex',flex:1,alignItems:'center'}}>
                                    {
                                        getFieldDecorator('template', {
                                            // rules: [{ required: true, message: '请选择报表模板' }],
                                        })(
                                            <Select placeholder='请选择报表模板' style={{width:200}}>
                                                <Option key='年度报表模板'>年度报表模板</Option>
                                            </Select>
                                        )
                                    }
                                    <Upload openFileDialogOnClick={false} >
                                        <Button style={{margin:'0 20px',color:'#ACACAC'}}><img src={imgDownload} className={styles.downloadIcon}/> 下载模板</Button>
                                    </Upload>
                                    <Upload openFileDialogOnClick={false}>
                                        <Button style={{color:'#ACACAC'}}><img src={imgUPload} className={styles.uploadIcon}/> 上传模板</Button>
                                    </Upload>
                                </div>
                            </FormItem> */}
              <FormItem
                {...submitFormLayout}
                style={{
                  margin: '20px 0 calc(100vh - 400px)',
                }}
              >
                <Button type="primary" htmlType="submit" onClick={this.submitForm}>
                  提交
                </Button>
                <Button
                  style={{ marginLeft: 8 }}
                  onClick={() => {
                    this.props.history.push({ pathname: '/targetResponsibility/securityreport' });
                  }}
                >
                  取消
                </Button>
              </FormItem>
            </Form>
          </PageHeaderWrapper>
        </Card>
      </div>
    );
  }
}

export default Form.create()(addReport);
