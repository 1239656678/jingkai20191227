import React, { Component } from 'react';
import { Table, Modal, Form, Button, Input, message, Tag, Radio } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.css';
import { noBindEquipment, bindRegions, editList } from './service';
const { confirm } = Modal;
const FormItem = Form.Item;

class equipmentLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
      isCode: false,
    };
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'code',
      },
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '设备分类',
        dataIndex: 'typeName',
        hideInSearch: true,
      },
      {
        title: '设备状态',
        dataIndex: 'status',
        hideInSearch: true,
        render: (text, value) => {
          return text == 1 ? <Tag color="green">正常</Tag> : <Tag color="red">故障</Tag>;
        },
      },

      {
        title: '责任人',
        dataIndex: 'responsibleUserName',
        hideInSearch: true,
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => (
          <>
            <a onClick={this.handleLink.bind(this, record)}>关联</a>
          </>
        ),
      },
    ];
  }

  componentDidMount() {
    // console.log ('接收区域id====',this.props.location.state.regionsId)
    this.setState({
      isLoading: true,
    });
    this.fetchNoBindList();
  }

  //查询未绑定设备列表
  fetchNoBindList = () => {
    this.setState({
      isLoading: true,
    });
    let data = this.props.form.getFieldsValue();
    let params = {
      code: data.equipmentCode ? data.equipmentCode : '',
      name: data.equipmentName ? data.equipmentName : '',
    };
    noBindEquipment(params).then(res => {
      if (res.code == 0) {
        this.setState({
          isLoading: false,
          dataSource: res.data,
        });
      }
    });
  };

  onChange = e => {
    // console.log('radio checked', e.target.value);
    this.setState({
      isCode: e.target.value,
    });
  };

  //关联
  handleLink(record) {
    confirm({
      title: '是否要关联设备?',
      width: '30%',
      content: (
        <div>
          <span>是否生成二维码</span>
          <Radio.Group style={{ marginLeft: 10 }} onChange={this.onChange} defaultValue={false}>
            <Radio value={false}>不生成</Radio>
            <Radio value={true}>生成</Radio>
          </Radio.Group>
        </div>
      ),
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        delete record['generatorQr'];
        record.installRegionsId = this.props.location.state.regionsId;
        let params = {
          generatorQr: this.state.isCode,
          ...record,
        };
        // console.log ('params11======',params)
        editList(params).then(res => {
          console.log('resss====', res);
          if (res.code == 0) {
            message.success('关联成功');
            history.go(-1);
          }
        });
      },
    });
  }

  render() {
    const { dataSource, isLoading } = this.state;

    const { form } = this.props;
    return (
      <PageHeaderWrapper title="未绑定区域设备列表">
        <Form layout="inline">
          <Form.Item>
            {form.getFieldDecorator('equipmentCode')(<Input placeholder="请输入设备编号" />)}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator('equipmentName')(<Input placeholder="请输入设备名称" />)}
          </Form.Item>
          <Form.Item>
            <Button className={styles.search} onClick={this.fetchNoBindList}>
              查询
            </Button>
          </Form.Item>
        </Form>
        <Table
          rowKey="id"
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
            marginTop: '20px',
          }}
          loading={isLoading}
          columns={this.columns}
          dataSource={dataSource}
        />
      </PageHeaderWrapper>
    );
  }
}

// export default Form.create()(equipmentLink)

export default Form.create()(connect(({ equipmentLedger }) => ({}))(equipmentLink));
