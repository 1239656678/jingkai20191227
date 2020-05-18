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
  message,
  Tooltip,
  Upload
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import TreeSelect from 'antd/es/tree-select';

const FormItem = Form.Item;
const { Meta } = Card;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
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
class DesigNate extends Component {
  state={
    treeData: [],
    getUserListByOrganizationId: [],
    DangerByIdResultcode:[],
    Imges:[]
  }
  // {
  //   "dangerId": "string",
  //   "files": {},
  //   "id": "string",
  //   "reviewLimit": "2020-03-18T03:27:07.566Z",
  //   "reviewOrganizationId": "string",
  //   "reviewResult": "string",
  //   "reviewStatus": false,
  //   "reviewUserId": "string"
  // }
  // dangerId (string): 隐患ID ,
  // files (object, optional),
  // id (string, optional): 主键 ,
  // reviewLimit (string): 复查期限 ,
  // reviewOrganizationId (string): 复查组织机构 ,
  // reviewResult (string): 复查结果 ,
  // reviewStatus (boolean): 复查状态 ,
  // reviewUserId (string): 复查人ID
  handleSubmit = e => {
    const { dispatch, form } = this.props;
    e.preventDefault();
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let parmes={
          ...values,
          id: this.state.DangerByIdResultcode.id,
          dangerId: this.props.location.state.data.id,
          files: this.state.DangerByIdResultcode.files,
        }
        dispatch({
          type: 'dangermanage/saveAssignReview',
          payload: parmes,
        }).then(r => {
          console.log(this.props.AssignReviewResult)
          if (this.props.AssignReviewResult.payload.code === 0) {
            message.success("复查操作执行成功")
            this.props.history.push({ pathname: '/DangerManage' }); 
          }else{
            message.error("复查操作执行异常")
          }
        });
      }
    });
  };
  componentDidMount() {
   
    this.props
      .dispatch({
        type: 'dangermanage/getDangerListModel',
        payload:{
          id:this.props.location.state.data.id
        }
      })
      .then(r => {
        let arrs = [];
        this.props.DangerByIdResultcode.data.files.map(item => {
          arrs.push(
                 <Card
                    hoverable
                    style={{  maxWidth:200,float:'left',display:'block',marginLeft:5,height:'auto' }}
                    cover={<img  src={'http://106.12.190.252'+item.fileUrl} />}
                  >
                  </Card>
            );
        });
        this.setState({
          DangerByIdResultcode: this.props.DangerByIdResultcode.data,
          Imges:arrs
        });
        
      })
    this.props
      .dispatch({
        type: 'depMange/treeListDate',
      })
      .then(r => {
        let treeDate = combinationData(this.props.responsibleOrganization.data);
        this.setState({
          treeData: treeDate,
        });
      })
  }
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
    const { submitting } = this.props;
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
    const fileup = {
      name: 'file',
      action: 'http://106.12.190.252:8085/upload/file',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };
    return (
      <PageHeaderWrapper
        content="指定复查"
      >
        <Card bordered={false}>
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
           <FormItem {...formItemLayout} label="复查部门">
              {getFieldDecorator('reviewOrganizationId', {
                rules: [
                  {
                    required: true,
                    message: '复查部门不允许为空',
                  },
                ],
              })(
                <TreeSelect
                  style={{ width: '100%' }}
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  treeData={this.state.treeData}
                  placeholder="请选择"
                  treeDefaultExpandAll
                  onSelect={this.onSelectList}
                  onChange={this.onChange}
                />,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="复查人">
              {getFieldDecorator('reviewUserId', {
                rules: [
                  {
                    required: true,
                    message: '复查人不允许为空',
                  },
                ],
              })(
                <Select
                  size={this.state.size}
                  defaultValue="a1"
                  // onChange={handleChange}
                  style={{ width: 200 }}
                >
                  {this.state.getUserListByOrganizationId}
                </Select>,
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="复查状态">
              {getFieldDecorator('reviewStatus', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
                initialValue:
                  this.props.location.state.data === null
                    ? ''
                    : this.props.location.state.data.planType,
              })(
                <Radio.Group defaultValue={0}>
                  <Radio value={true}>通过</Radio>
                  <Radio value={false}>未通过</Radio>
                </Radio.Group>,
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="复查期限"
            >
              {getFieldDecorator('reviewLimit', {
                rules: [
                  {
                    required: true,
                    message: '复查期限不能为空'
                  },
                ],
              })(
                <DatePicker showTime placeholder="选择时间" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="复查结果"
            >
              {getFieldDecorator('reviewResult', {
                rules: [
                  {
                    required: true,
                    message: '复查结果不能为空'
                  },
                ],
              })(
                <TextArea placeholder="复查结果" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="隐患说明(不可编辑)"
            >
              {getFieldDecorator('dangerRemark', {
                rules: [
                  {
                    required: true,
                    message: ''
                  },
                ],
                initialValue:this.state.DangerByIdResultcode.dangerRemark
              })(
                <TextArea placeholder="隐患说明" readonly="readonly" />
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="隐患依据"
            >
               <div>
                 {this.state.Imges}
               </div>
             
            </FormItem>




            <FormItem
              {...submitFormLayout}
              style={{
                marginTop: 32,
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交指派
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={() => {
                  this.props.history.push({ pathname: '/DangerManage' });
                }}
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
  connect(({ loading,depMange,dangermanage }) => ({
    submitting: loading.effects['dangerManageAndAddForm/submitRegularForm'],
    responsibleOrganization: depMange.getList,
    getUserListByOrganizationId: depMange.getUserListByOrganizationId,
    DangerByIdResultcode : dangermanage.getDangerByIdResultcode,
    AssignReviewResult:dangermanage.AssignReviewData,
  }))(DesigNate),
);
