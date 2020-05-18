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
  Descriptions,
  Badge,
  Tabs,
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
const { TabPane } = Tabs;

class AddForm extends Component {
  state = {
    dangerLevelId: '',
    dangerStatus: '',
    data: this.props.location.state.data,
    RepairByDangerIdResultData: {
      repairOrganizationId: '',
      repairUserId: '',
      repairLimit: '',
      repairOpinion: '',
      dangerRemark: '',
      Imges: '',
    },
    ReviewByDangerIdResultData: {
      reviewOrganizationId: '',
      reviewUserId: '',
      reviewLimit: '',
      reviewStatus: '',
      reviewResult: '',
      ReviewImges: '',
    },
    Imges: [],
    ReviewImges: [],
    detailImages: [],
  };
  componentDidMount() {
    if (this.props.location.state.data.files !== []) {
      let arrs = [];
      let datafiles = this.props.location.state.data.files;
      datafiles.map(item => {
        arrs.push(
          <img
            src={'http://106.12.190.252' + item.fileUrl}
            style={{ maxHeight: 200, maxWidth: 100 }}
          />,
        );
      });
      this.setState({
        detailImages: arrs,
      });
    }
    if (this.props.location.state.data.dangerStatus == 0) {
      this.setState({
        dangerStatus: '待指派',
      });
    } else if (this.props.location.state.data.dangerStatus == 1) {
      this.setState({
        dangerStatus: '待整改',
      });
    } else if (this.props.location.state.data.dangerStatus == 2) {
      this.setState({
        dangerStatus: '待复查',
      });
    } else if (this.props.location.state.data.dangerStatus == 3) {
      this.setState({
        dangerStatus: '已完成',
      });
    }

    if (this.props.location.state.data.dangerLevelId == 0) {
      this.setState({
        dangerLevelId: '一般隐患',
      });
    } else if (this.props.location.state.data.dangerLevelId == 1) {
      this.setState({
        dangerLevelId: '较大隐患',
      });
    } else if (this.props.location.state.data.dangerLevelId == 2) {
      this.setState({
        dangerLevelId: '重大隐患',
      });
    }

    this.props
      .dispatch({
        type: 'dangermanage/getRepairByDangerIdModel',
        payload: {
          id: this.props.location.state.data.id,
        },
      })
      .then(r => {
        if (this.props.RepairByDangerIdResultData.code == 0) {
          this.setState({
            RepairByDangerIdResultData: this.props.RepairByDangerIdResultData.data,
          });
          if (this.props.RepairByDangerIdResultData.data.files !== []) {
            let arrs = [];
            this.props.RepairByDangerIdResultData.data.files.map(item => {
              arrs.push(
                <img
                  src={'http://106.12.190.252' + item.fileUrl}
                  style={{ maxHeight: 300, maxWidth: 400 }}
                />,
              );
            });
            this.setState({
              Imges: arrs,
            });
          }
        }
      });
    this.props
      .dispatch({
        type: 'dangermanage/getReviewByDangerIdModel',
        payload: {
          id: this.props.location.state.data.id,
        },
      })
      .then(r => {
        if (this.props.ReviewByDangerIdResultData.code == 0) {
          this.setState({
            ReviewByDangerIdResultData: this.props.ReviewByDangerIdResultData.data,
          });
          let arr = [];
          if (this.props.ReviewByDangerIdResultData.data.file !== []) {
            this.props.ReviewByDangerIdResultData.data.files.map(item => {
              arr.push(
                <img
                  src={'http://106.12.190.252' + item.fileUrl}
                  style={{ maxHeight: 300, maxWidth: 400 }}
                />,
              );
            });
            this.setState({
              ReviewImges: arr,
            });
          }
        }
      });
    console.log(this.props);
  }

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
      <PageHeaderWrapper content="隐患详情">
        <Descriptions title="隐患详情" bordered>
          <Descriptions.Item label="隐患位置">{this.state.data.dangerAddress}</Descriptions.Item>
          <Descriptions.Item label="设备编号">{this.state.data.equipmentId}</Descriptions.Item>
          {/* <Descriptions.Item label="责任部门">{this.state.data.installRegionsId}</Descriptions.Item> */}
          <Descriptions.Item label="隐患来源">
            {this.state.data.dangerFrom == 0 ? '随手拍' : '检查计划'}
          </Descriptions.Item>
          {/* <Descriptions.Item label="设备名称">{this.state.data.produceDate}</Descriptions.Item> */}
          <Descriptions.Item label="隐患状态">{this.state.dangerStatus}</Descriptions.Item>
          <Descriptions.Item label="隐患级别">{this.state.dangerLevelId}</Descriptions.Item>
          {/* <Descriptions.Item label="完成时间">{this.state.data.typeId}</Descriptions.Item> */}
          <Descriptions.Item label="隐患描述">{this.state.data.remark}</Descriptions.Item> 
          <Descriptions.Item label="隐患图片">{this.state.detailImages}</Descriptions.Item>
        </Descriptions>
        <Tabs defaultActiveKey="1">
          {/* <TabPane tab="隐患上报" key="1">
              <Descriptions  bordered>
                <Descriptions.Item label="隐患位置">{this.state.data.name}</Descriptions.Item>
                <Descriptions.Item label="隐患来源">{this.state.data.model}</Descriptions.Item>
                <Descriptions.Item label="设备编号">{this.state.data.installRegionsId}</Descriptions.Item>
                <Descriptions.Item label="设备名称">{this.state.data.responsibleUserId}</Descriptions.Item>
                <Descriptions.Item label="隐患级别">{this.state.data.produceDate}</Descriptions.Item>
                <Descriptions.Item label="隐患说明">{this.state.data.installDate}</Descriptions.Item>
                <Descriptions.Item label="隐患依据">{this.state.data.scrappedDate}</Descriptions.Item>
              
              </Descriptions>
              </TabPane> */}
          <TabPane tab="隐患整改" key="1">
            <Descriptions bordered>
              <Descriptions.Item label="整改部门">
                {this.state.RepairByDangerIdResultData.repairOrganizationId}
              </Descriptions.Item>
              <Descriptions.Item label="整改人">
                {this.state.RepairByDangerIdResultData.repairUserId}
              </Descriptions.Item>
              <Descriptions.Item label="整改期限">
                {this.state.RepairByDangerIdResultData.repairLimit}
              </Descriptions.Item>
              <Descriptions.Item label="整改要求">
                {this.state.RepairByDangerIdResultData.repairOpinion}
              </Descriptions.Item>
              <Descriptions.Item label="整改说明">
                {this.state.RepairByDangerIdResultData.dangerRemark}
              </Descriptions.Item>
              <Descriptions.Item label="整改依据">{this.state.Imges}</Descriptions.Item>
            </Descriptions>
          </TabPane>
          <TabPane tab="隐患复查" key="2">
            <Descriptions bordered>
              <Descriptions.Item label="复查部门">
                {this.state.ReviewByDangerIdResultData.reviewOrganizationId}
              </Descriptions.Item>
              <Descriptions.Item label="复查人">
                {this.state.ReviewByDangerIdResultData.reviewUserId}
              </Descriptions.Item>
              <Descriptions.Item label="复查期限">
                {this.state.ReviewByDangerIdResultData.reviewLimit}
              </Descriptions.Item>
              <Descriptions.Item label="复查状态">
                {this.state.ReviewByDangerIdResultData.reviewStatus}
              </Descriptions.Item>
              <Descriptions.Item label="复查结果">
                {this.state.ReviewByDangerIdResultData.reviewResult}
              </Descriptions.Item>
              <Descriptions.Item label="复查依据">{this.state.ReviewImges}</Descriptions.Item>
            </Descriptions>
          </TabPane>
        </Tabs>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ dangermanage }) => ({
    RepairByDangerIdResultData: dangermanage.RepairByDangerIdResult,
    ReviewByDangerIdResultData: dangermanage.ReviewByDangerIdResult,
  }))(AddForm),
);
