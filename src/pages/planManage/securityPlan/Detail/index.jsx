import { Badge, Card, Descriptions, Divider, Table } from 'antd';
import React, { Component } from 'react';
import ProTable from '@ant-design/pro-table';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';



class DetailSerPlan extends Component {
  state = {
    data: this.props.location.state.detail,
    planType:'',//检查周期
  };

  componentDidMount() {
   if(this.props.location.state.detail.planType==0){
    this.setState({
      planType:'日检查'
    })
   }
   if(this.props.location.state.detail.planType==1){
    this.setState({
      planType:'周检查'
    })
   }
   if(this.props.location.state.detail.planType==2){
    this.setState({
      planType:'月检查'
    })
   }
   if(this.props.location.state.detail.planType==3){
    this.setState({
      planType:'季度检查'
    })
   }
   if(this.props.location.state.detail.planType==4){
    this.setState({
      planType:'专项检查'
    })
   }
    
  }
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
      // filters: [{ text: '待巡检' , value: '待巡检' }, { text: '已完成' , value: '已完成' },{ text: '逾期', value: '逾期' }],
      render: text => {
        if (text === 0) {
          return <Badge status="processing" text="待巡检" />;
        }
        if (text === 2) {
          return <Badge status="success" text="已完成" />;
        }
        return <Badge status="error" text="逾期" />;
      },
    },
    {
      title: '责任人',
      dataIndex: 'personLiableId',
      render: text => {
        return this.state.data.personLiableId;
      },
    },
    {
      title: '责任部门',
      dataIndex: 'organizationId',
      render: text => {
        return this.state.data.organizationId;
      },
    },
    // {
    //   title: '操作',
    //   dataIndex: 'option',
    //   valueType: 'option',
    //   render: (_, record) => (
    //     <>
    //       {/* <a
    //         onClick={() => {
    //           handleUpdateModalVisible(true);
    //           // setStepFormValues(record);
    //         }}
    //       >
    //         编辑
    //       </a>
    //       <Divider type="vertical" /> */}
    //       <a>详情</a>
    //     </>
    //   ),
    // },
  ];
  render() {
    const { planManageAndpatrolPlanAndDetail, loading } = this.props;
    const { basicGoods, basicProgress } = planManageAndpatrolPlanAndDetail;
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
        <Descriptions title="检查计划" bordered>
          <Descriptions.Item label="计划编号">{this.state.data.planCode}</Descriptions.Item>
          <Descriptions.Item label="计划名称">{this.state.data.planName}</Descriptions.Item>
          <Descriptions.Item label="检查周期">{this.state.planType}</Descriptions.Item>
          <Descriptions.Item label="开始时间">{this.state.data.beginDate}</Descriptions.Item>
          <Descriptions.Item label="结束时间">{this.state.data.endDate}</Descriptions.Item>
          <Descriptions.Item label="责任部门">{this.state.data.organizationId}</Descriptions.Item>
          <Descriptions.Item label="责任人">{this.state.data.personLiableId}</Descriptions.Item>
          <Descriptions.Item label="备注">{this.state.data.remark}</Descriptions.Item>
          </Descriptions>
          <Divider
            style={{
              marginBottom: 32,
            }}
          />
          <Table
            style={{
              marginBottom: 16,
            }}
            pagination={false}
            loading={loading}
            pagination={{ pageSize: 10 }} 
            dataSource={this.state.data.smsUserInspectionPlanList}
            columns={this.progressColumns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default connect(({ planManageAndpatrolPlanAndDetail, loading }) => ({
  planManageAndpatrolPlanAndDetail,
  loading: loading.effects['planManageAndpatrolPlanAndDetail/fetchBasic'],
}))(DetailSerPlan);
