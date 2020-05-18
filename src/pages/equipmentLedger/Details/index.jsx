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

class AddForm extends Component {
  state = {
    data: this.props.location.state.data,
    status: '',
    installRegions: '', //安装区域,
    pid: '',
  };
  componentDidMount() {
    if (this.props.location.state.data.status == 1) {
      this.setState({
        status: '正常',
      });
    } else {
      this.setState({
        status: '故障',
      });
    }

    // this.props
    //   .dispatch({
    //     type: 'deviceManagement/findRegionsById',
    //     payload: {
    //       id: this.props.location.state.data.installRegionsId,
    //     },
    //   })
    //   .then(r => {
    //     console.log(this.props);
    //     this.setState({
    //       installRegions: this.props.findRegionsById.name,
    //     });
    //   });
  }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'equipmentLedger/AddSmsEquipmentBaseInfo',
          payload: values,
        }).then(r => {
          console.log(this.props.save);
          if (this.props.save.code === 0) {
            this.props.history.push({ pathname: '/equipmentledger' });
          }
        });
      }
    });
  };
  onChange = value => {
    console.log(value);
    this.setState({ value });
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
        console.log(this.props.getUserListByOrganizationId);
        let child = [];
        // let arr=combinationData2(this.props.getUserListByOrganizationId);
        // console.log(this.props.getUserListByOrganizationId)
        this.props.getUserListByOrganizationId.map(item => {
          child.push(<Option key={item.id.toString()}>{item.name.toString()}</Option>);
        });
        console.log(child);
        this.setState({
          getUserListByOrganizationId: child,
        });
        console.log(this.state.getUserListByOrganizationId);
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
      <PageHeaderWrapper content="设备台账详情">
        <Descriptions title="设备详情" bordered>
          <Descriptions.Item label="设备编号">{this.state.data.code}</Descriptions.Item>
          <Descriptions.Item label="设备名称">{this.state.data.name}</Descriptions.Item>
          <Descriptions.Item label="设备型号">{this.state.data.model}</Descriptions.Item>
          <Descriptions.Item label="安装区域">
            {this.state.data.installRegionsName}
          </Descriptions.Item>
          <Descriptions.Item label="责任人">
            {this.state.data.responsibleUserName}
          </Descriptions.Item>
          <Descriptions.Item label="生产日期">{this.state.data.produceDate}</Descriptions.Item>
          <Descriptions.Item label="安装日期">{this.state.data.installDate}</Descriptions.Item>
          <Descriptions.Item label="报废日期">{this.state.data.scrappedDate}</Descriptions.Item>
          <Descriptions.Item label="设备分类">{this.state.data.typeName}</Descriptions.Item>
          <Descriptions.Item label="设备状态" span={3}>
            {this.state.status}
          </Descriptions.Item>
          <Descriptions.Item label="生产厂家" span={3}>
            {this.state.data.producer}
          </Descriptions.Item>
          <Descriptions.Item label="二维码" span={3}>
            <div style={{ width: 200, height: 185, overflow: 'hide' }}>
              <img
                style={{ width: 200, height: 'auto' }}
                src={'http://106.12.190.252/' + this.state.data.qrCode}
              ></img>
            </div>
          </Descriptions.Item>
        </Descriptions>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ loading, depMange, equipmentLedger, classification, deviceManagement }) => ({
    submitting: loading.effects['equipmentLedgerAndAddForm/submitRegularForm'],
    findRegionsById: deviceManagement.findRegionsById,
  }))(AddForm),
);
