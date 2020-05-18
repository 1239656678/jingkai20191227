import { Badge, Card, Descriptions, Divider, Table, Form, Input, Button, Modal, Tag } from 'antd';
import React, { Component } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import { queryRule, queryByIdGetDetail } from './service';

class Detail extends Component {
  state = {
    data: this.props.location.state.detail,
    planType: '', //检查周期
    visible: false,
    detailList: [],
    list: this.props.location.state.list,
  };

  componentDidMount() {
    // console.log('list4444========',this.state.list)
    // console.log('data========',this.state.data)
    if (this.props.location.state.detail.planType == 0) {
      this.setState({
        planType: '日检查',
      });
    }
    if (this.props.location.state.detail.planType == 1) {
      this.setState({
        planType: '周检查',
      });
    }
    if (this.props.location.state.detail.planType == 2) {
      this.setState({
        planType: '月检查',
      });
    }
    if (this.props.location.state.detail.planType == 3) {
      this.setState({
        planType: '季度检查',
      });
    }
    if (this.props.location.state.detail.planType == 4) {
      this.setState({
        planType: '专项检查',
      });
    }
  }

  //详情页表格
  detailColumn = [
    {
      title: '设备编号',
      dataIndex: 'equipmentCode',
      key: 'equipmentCode',
    },
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      key: 'equipmentName',
    },
    {
      title: '设备分类',
      dataIndex: 'equipmentClass',
      key: 'equipmentClass',
    },
    {
      title: '安装位置',
      dataIndex: 'installArea',
      key: 'installArea',
    },
    {
      title: '巡检状态',
      dataIndex: 'inspectionStatus',
      key: 'inspectionStatus',
      render: text => {
        if (text == '0') {
          return (
            <Tag
              color="blue"
              style={{
                width: '57px',
                height: '30px',
                textAlign: 'center',
                lineHeight: '30px',
                fontSize: '14px',
              }}
            >
              待巡检
            </Tag>
          );
        }
        if (text == '2') {
          return (
            <Tag
              style={{
                width: '57px',
                height: '30px',
                textAlign: 'center',
                lineHeight: '30px',
                fontSize: '14px',
              }}
            >
              已完成
            </Tag>
          );
        }

        if (text == '3') {
          return (
            <Tag
              color="red"
              style={{
                width: '48px',
                height: '30px',
                textAlign: 'center',
                lineHeight: '30px',
                fontSize: '14px',
              }}
            >
              逾期
            </Tag>
          );
        }
      },
    },
  ];

  progressColumns = [
    {
      title: '计划周期',
      dataIndex: 'cycle',
      key: 'cycle',
    },
    {
      title: '计划名称',
      dataIndex: 'planName',
      key: 'planName',
      render: text => {
        return this.state.data.planName;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => {
        if (text == 0) {
          return (
            <Tag
              color="blue"
              style={{ width: '57px', height: '30px', textAlign: 'center', lineHeight: '30px' }}
            >
              待巡检
            </Tag>
          );
        }
        if (text == 2) {
          return (
            <Tag
              style={{
                width: '57px',
                height: '30px',
                textAlign: 'center',
                lineHeight: '30px',
                fontSize: '14px',
              }}
            >
              已完成
            </Tag>
          );
        }
        return (
          <Tag
            color="red"
            style={{
              width: '48px',
              height: '30px',
              textAlign: 'center',
              lineHeight: '30px',
              fontSize: '14px',
            }}
          >
            逾期
          </Tag>
        );
      },
    },
    {
      title: '责任人',
      dataIndex: 'personLiableName',
    },
    {
      title: '责任部门',
      dataIndex: 'organizationName',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <div>
          <a onClick={this.showDetail.bind(this, record)}>详情</a>
        </div>
      ),
    },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => (
    //     <>
    //       <a
    //         onClick={() => {
    //           handleUpdateModalVisible(true);
    //           // setStepFormValues(record);
    //         }}
    //       >
    //         编辑
    //       </a>
    //       <Divider type="vertical" />
    //       <a>详情</a>
    //     </>
    //   ),
    // },
  ];

  showDetail(record) {
    // console.log('aaaaaaa===',record)
    this.setState({
      visible: true,
    });
    let search = {
      id: record.id === undefined ? '' : record.id,
    };
    // console.log('search====',search)
    queryByIdGetDetail(search).then(res => {
      console.log('res333aaa======', res);
      for (let i in res.data) {
        if (res.data[i] === null) {
          res.data[i] = {};
        }
      }
      this.setState({
        detailList: res.data,
      });
    });
  }
  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { planManageAndpatrolPlanAndDetail, loading, form } = this.props;
    const { basicGoods, basicProgress } = planManageAndpatrolPlanAndDetail;
    // console.log('xxxxxx22====',this.state.data)
    let goodsData = [];

    if (basicGoods.length) {
      let num = 0;
      let amount = 0;
      basicGoods.forEach(item => {
        num += Number(item.num);
        amount += Number(item.amount);
      });
      goodsData = basicGoods.concat({
        id: '总计',
        num,
        amount,
      });
    }

    const renderContent = (value, row, index) => {
      const obj = {
        children: value,
        props: {},
      };

      if (index === basicGoods.length) {
        obj.props.colSpan = 0;
      }

      return obj;
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title="" bordered>
            <Descriptions.Item label="计划编号">{this.state.data.planCode}</Descriptions.Item>
            <Descriptions.Item label="计划名称">{this.state.data.planName}</Descriptions.Item>
            <Descriptions.Item label="检查周期">{this.state.planType}</Descriptions.Item>
            <Descriptions.Item label="开始时间">{this.state.data.beginDate}</Descriptions.Item>
            <Descriptions.Item label="结束时间" span={2}>
              {this.state.data.endDate}
            </Descriptions.Item>
            <Descriptions.Item label="责任部门">
              {this.state.data.organizationName}
            </Descriptions.Item>
            <Descriptions.Item label="责任人" span={2}>
              {this.state.data.personLiableName}
            </Descriptions.Item>
            <Descriptions.Item label="备注">{this.state.data.remark}</Descriptions.Item>
          </Descriptions>
          <Divider style={{ marginBottom: 16 }} />
          <Form layout="inline">
            {/* <Form.Item>
                    {form.getFieldDecorator('planName')(<Input placeholder="请选择检查状态" />)}
                </Form.Item>
                <Form.Item>
                    <Button type="primary"  onClick={() => {
                          form.validateFields(['planName'],(err,values) => {
                              if (!err) {
                                  console.log('values===',values)
                                  let search = {
                                    planCode: values.planCode === undefined ? '' : values.planCode,
                                    planName: values.planName === undefined ? '' : values.planName,
                                };
                                queryRule(search).then((res)=>{
                                    console.log('res=====',res)
                                    var obj = res.data.length > 0 ? res.data[0] : {}
                                    this.setState({
                                        data: obj
                                    })
                                });
                              }
                          })
                      }}
                        style={{
                            width:62,
                            height:30,
                            // background:'#4188F2',
                            color:'#fff',
                            borderRadius:6,
                            fontSize:14
                        }}>
                        查询
                    </Button>
                </Form.Item> */}
          </Form>
          <Table
            style={{
              marginBottom: 16,
              marginTop: 16,
            }}
            pagination={true}
            loading={loading}
            pagination={{ pageSize: 10 }}
            dataSource={this.state.list}
            // dataSource={this.state.data.smsUserInspectionPlanList}
            columns={this.progressColumns}
          />

          {/* 检查计划详情 */}
          <Modal
            title="设备详情"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={[]}
            width="60%"
            maskClosable={false}
            // centered={true}
          >
            {/* <Form layout="inline">
                      <Form.Item>
                          <Input type="text" placeholder="请选择巡检状态"/>
                      </Form.Item>
                      <Form.Item>
                          <Button type="primary" 
                              style={{
                                  width:62,
                                  height:30,
                                  // background:'#4188F2',
                                  color:'#fff',
                                  borderRadius:6,
                                  fontSize:14
                              }}>
                              查询
                          </Button>
                      </Form.Item>
                  </Form> */}

            <Table
              style={{
                marginBottom: 16,
                marginTop: 16,
              }}
              pagination={true}
              loading={loading}
              pagination={{ pageSize: 10 }}
              dataSource={this.state.detailList}
              columns={this.detailColumn}
            />
          </Modal>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ planManageAndpatrolPlanAndDetail, loading }) => ({
    planManageAndpatrolPlanAndDetail,
    loading: loading.effects['planManageAndpatrolPlanAndDetail/fetchBasic'],
  }))(Detail),
);
