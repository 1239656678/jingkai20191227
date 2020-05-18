import React, { Component } from 'react';
import { Card, Descriptions, Divider, Form, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import style from './style.css';
const { TextArea } = Input;
const FormItem = Form.Item;
import moment from 'moment';

class repairDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.location.state.data,
      detailData: this.props.location.state.row,
    };
  }

  componentDidMount() {
    // console.log('维修记录列表数据=======',this.state.data)
    console.log('维修记录详情数据=======', this.props.location.state.row);
    var date = '2020-04-02T03:15:59.000+0000';
    console.log(this.formateDate(date));
  }
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

  render() {
    const { data, imgsData, detailData } = this.state;
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
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title="" bordered>
            <Descriptions.Item label="设备编号">{detailData.equipmentCode}</Descriptions.Item>
            <Descriptions.Item label="设备名称">{detailData.equipmentName}</Descriptions.Item>
            <Descriptions.Item label="安装区域">{detailData.installArea}</Descriptions.Item>
            <Descriptions.Item label="设备分类">{detailData.equipmentType}</Descriptions.Item>
            <Descriptions.Item label="生产日期">{detailData.produceDate}</Descriptions.Item>
            <Descriptions.Item label="报废日期">{detailData.scrappedDate}</Descriptions.Item>
            <Descriptions.Item label="设备型号">{detailData.equipmentModel}</Descriptions.Item>
            <Descriptions.Item label="责任部门">
              {detailData.responsibleOrganizationName}
            </Descriptions.Item>
            <Descriptions.Item label="责任人">{detailData.responsibleUser}</Descriptions.Item>
            <Descriptions.Item label="备注">{detailData.equipmentRemark}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 16 }} />
          <div className={style.repairNews}>维修信息</div>
          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="报修人">
              {getFieldDecorator('equipmentCode', {
                initialValue: detailData === null ? '' : detailData.reportUser,
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="报修时间">
              {getFieldDecorator('equipmentName', {
                initialValue: detailData === null ? '' : this.formateDate(detailData.reportDate),
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="故障描述">
              {getFieldDecorator('remark', {
                initialValue: detailData === null ? '' : detailData.reportRemark,
              })(<TextArea disabled style={styles} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="故障依据">
              {detailData.reportFiles && detailData.reportFiles.length > 0 ? (
                detailData.reportFiles.map((item, index) => {
                  return (
                    <div className={style.imgFiles}>
                      <img
                        src={'http://106.12.190.252' + item.fileUrl}
                        className={style.imgStyle}
                        alt={item.fileName}
                      />
                    </div>
                  );
                })
              ) : (
                <div className={style.imgFiles}></div>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="维修单位">
              {getFieldDecorator('reportUserName', {
                initialValue: detailData === null ? '' : detailData.faultUserOrganizationName,
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="维修人">
              {getFieldDecorator('reportUserName', {
                initialValue: detailData === null ? '' : detailData.faultUser,
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="维修结果">
              {getFieldDecorator('reportUserName', {
                initialValue: detailData === null ? '' : detailData.faultResult,
              })(<Input disabled style={styles} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="维修依据">
              {detailData.faultFiles && detailData.faultFiles.length > 0 ? (
                detailData.faultFiles.map((item, index) => {
                  return (
                    <div className={style.imgFiles}>
                      <img
                        src={'http://106.12.190.252' + item.fileUrl}
                        className={style.imgStyle}
                        alt={item.fileName}
                      />
                    </div>
                  );
                })
              ) : (
                <div className={style.imgFiles}></div>
              )}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(repairDetail);
