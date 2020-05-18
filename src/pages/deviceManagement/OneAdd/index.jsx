import {
  Button,
  Card,
  DatePicker,
  Form,
  Icon,
  message,
  Input,
  InputNumber,
  Radio,
  Select,
  Tooltip,
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
      item.children = item.childrens;
      if (item.childrens) {
        combinationData3(item.childrens);
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
    updateData: [],
    isAdd: '',
  };
  getPeople(arrays) {
    let arrs = [];
    let array = Array.from(arrays);
    array.map(item => {
      arrs.push(<Option key={item.id}>{item.name}</Option>);
    });
    return arrs;
  }
  // componentDidMount() {
  //  console.log(this.props)

  // }

  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      const parmes = {
        ...values,
        id: this.props.location.state.data.id,
        code: this.props.location.state.data.code,
        name: this.props.location.state.data.name,
        typeId: this.props.location.state.data.typeId,
        model: this.props.location.state.data.model,
        produceDate: this.props.location.state.data.produceDate,
        scrappedDate: this.props.location.state.data.scrappedDate,
        status: this.props.location.state.data.status,
        producer: this.props.location.state.data.producer,
        responsibleOrganizationId: this.props.location.state.data.responsibleOrganizationId,
        installDate: this.props.location.state.data.installDate,
        remark: this.props.location.state.data.remark,
        installRegionsId: this.props.location.state.quid, //本地区域id
      };
      if (!err) {
        dispatch({
          type: 'equipmentLedger/updateData',
          payload: parmes,
        }).then(r => {
          if (this.props.update === 0) {
            message.success('关联成功');
            this.props.history.push({ pathname: '/devicemanagement' });
          } else {
            message.error('关联失败');
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
    const { updateData } = this.state;
    return (
      <PageHeaderWrapper content="区域关联设备">
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
            <FormItem {...formItemLayout} label="是否生成二维码">
              {getFieldDecorator('generatorQr', {
                rules: [
                  {
                    required: true,
                    message: '请选择是否生成二维码',
                  },
                ],
              })(
                <Radio.Group defaultValue={false}>
                  <Radio value={false}>不生成</Radio>
                  <Radio value={true}>生成</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                绑定设备
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={() => this.props.history.push({ pathname: '/devicemanagement' })}
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
