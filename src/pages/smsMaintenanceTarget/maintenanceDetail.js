import React, { Component } from 'react';
import { Card, Descriptions, Divider, Form, Input } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import style from './style.css';
const FormItem = Form.Item;

class maintenanceDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      equipmentInfo: this.props.location.state.data
        ? this.props.location.state.data.equipmentInfo
        : null, //设备详情
      maintenanceInfo: this.props.location.state.data
        ? this.props.location.state.data.maintenanceInfo
        : null, //设备详情
    };
  }

  componentDidMount() {
    console.log('保养记录详情1=======', this.props.location.state.data);
  }

  render() {
    const { equipmentInfo, maintenanceInfo } = this.state;
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

    const styles = {
      color: '#666666',
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title="" bordered>
            <Descriptions.Item label="设备编号">
              {equipmentInfo && equipmentInfo.equipmentCode}
            </Descriptions.Item>
            <Descriptions.Item label="设备名称">
              {equipmentInfo && equipmentInfo.equipmentName}
            </Descriptions.Item>
            <Descriptions.Item label="安装区域">
              {equipmentInfo && equipmentInfo.installArea}
            </Descriptions.Item>
            <Descriptions.Item label="设备分类">
              {equipmentInfo && equipmentInfo.equipmentClass}
            </Descriptions.Item>
            <Descriptions.Item label="生产日期">
              {equipmentInfo && equipmentInfo.produceDate}
            </Descriptions.Item>
            <Descriptions.Item label="报废日期">
              {equipmentInfo && equipmentInfo.scrappedDate}
            </Descriptions.Item>
            <Descriptions.Item label="设备型号">
              {equipmentInfo && equipmentInfo.model}
            </Descriptions.Item>
            <Descriptions.Item label="责任部门">
              {equipmentInfo && equipmentInfo.organizationLiable}
            </Descriptions.Item>
            <Descriptions.Item label="责任人">
              {equipmentInfo && equipmentInfo.personLiable}
            </Descriptions.Item>
            <Descriptions.Item label="备注">
              {equipmentInfo && equipmentInfo.remark}
            </Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 16 }} />
          <div className={style.repairNews}>保养信息</div>

          <Form style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="保养单位">
              {getFieldDecorator('equipmentCode', {
                initialValue:
                  maintenanceInfo === null ? '' : maintenanceInfo.maintenanceOrganization,
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养人">
              {getFieldDecorator('equipmentName', {
                initialValue: maintenanceInfo === null ? '' : maintenanceInfo.maintenanceUser,
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养周期">
              {getFieldDecorator('cycle', {
                initialValue:
                  maintenanceInfo === null
                    ? ''
                    : maintenanceInfo.cycle == '0'
                    ? '周'
                    : maintenanceInfo.cycle == '1'
                    ? '月'
                    : maintenanceInfo.cycle == '2'
                    ? '季'
                    : '年',
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养费用">
              {getFieldDecorator('cost', {
                initialValue: maintenanceInfo === null ? '' : maintenanceInfo.cost,
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="完成时间">
              {getFieldDecorator('finishDate', {
                initialValue: maintenanceInfo === null ? '' : maintenanceInfo.finishDate,
              })(<Input disabled style={styles} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="保养描述">
              {getFieldDecorator('remark', {
                initialValue: maintenanceInfo === null ? '' : maintenanceInfo.remark,
              })(<Input disabled style={styles} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="保养依据">
              {maintenanceInfo && maintenanceInfo.beforeFiles ? (
                maintenanceInfo.beforeFiles.map((item, index) => {
                  // console.log('item====',item)
                  return (
                    <div className={style.imgs}>
                      <img
                        src={'http://106.12.190.252' + item.fileUrl}
                        className={style.imgStyle}
                        alt={item.fileName}
                      />
                    </div>
                  );
                })
              ) : (
                <div className={style.imgs}></div>
              )}
            </FormItem>

            <FormItem {...formItemLayout} label="保养结果">
              {getFieldDecorator('result', {
                initialValue: maintenanceInfo === null ? '' : maintenanceInfo.result,
              })(<Input disabled style={styles} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="保养依据">
              {maintenanceInfo && maintenanceInfo.afterFiles ? (
                maintenanceInfo.afterFiles.map((item, index) => {
                  // console.log('afterFiles====',item)
                  return (
                    <div className={style.imgs}>
                      <img
                        src={'http://106.12.190.252' + item.fileUrl}
                        className={style.imgStyle}
                        alt={item.fileName}
                      />
                    </div>
                  );
                })
              ) : (
                <div className={style.imgs}></div>
              )}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(maintenanceDetail);
