import React, { Component } from 'react';
import { Button, Form, Input, Table, Tag } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.css';
import { fetchRecordDetail, fetchRecord } from './service';
class maintenanceRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      data: null,
    };
    this.columns = [
      {
        title: '设备编号',
        dataIndex: 'requipmentCode',
        key: 'requipmentCode',
      },
      {
        title: '设备名称',
        dataIndex: 'requipmentName',
        key: 'requipmentName',
      },
      {
        title: '设备分类',
        dataIndex: 'className',
        key: 'className',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: text => {
          if (text == 1) {
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
          if (text == 2) {
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
      {
        title: '保养单位',
        dataIndex: 'maintenanceOrganization',
        key: 'maintenanceOrganization',
      },
      {
        title: '保养人',
        dataIndex: 'maintenanceUser',
        key: 'maintenanceUser',
      },
      {
        title: '保养周期',
        dataIndex: 'cycle',
        key: 'cycle',
        render: text => {
          if (text == '0') {
            return <div>周</div>;
          } else if (text == '1') {
            return <div>月</div>;
          } else if (text == '2') {
            return <div>季</div>;
          } else if (text == '3') {
            return <div>年</div>;
          }
        },
      },
      {
        title: '保养费用 (元)',
        dataIndex: 'cost',
        key: 'cost',
      },
      {
        title: '完成时间',
        dataIndex: 'finishDate',
        key: 'finishDate',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, row, index, action) => (
          <a onClick={this.maintenanceDetail.bind(this, row)}>详情</a>
        ),
      },
    ];
  }

  componentDidMount() {
    fetchRecord().then(res => {
      if (res.code == '0') {
        this.setState({
          dataSource: res.data,
        });
      }
    });
  }

  //保养记录详情
  maintenanceDetail(row) {
    // console.log('保养记录===',row)
    let params = row.id;
    fetchRecordDetail(params).then(res => {
      if (res.code == '0') {
        console.log('详情====', res.data);
        this.props.history.push({
          pathname: './maintenanceRecord/maintenanceDetail',
          state: { data: res.data },
        });
      } else {
        this.props.history.push({
          pathname: './maintenanceRecord/maintenanceDetail',
          state: { data: null },
        });
      }
    });
  }

  render() {
    const { form, loading } = this.props;
    const { dataSource } = this.state;
    return (
      <PageHeaderWrapper>
        <div className={styles.formInput} style={{ padding: '0 10px 20px' }}>
          <Form layout="inline">
            <Form.Item>
              {form.getFieldDecorator('equipmentName')(<Input placeholder="请输入设备名称" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('installArea')(<Input placeholder="请输入保养人" />)}
            </Form.Item>
            <Form.Item>
              <Button className={styles.search}>查询</Button>
            </Form.Item>
          </Form>
        </div>
        <Table
          style={{
            marginBottom: 16,
            background: '#fff',
          }}
          rowKey="id"
          dataSource={dataSource}
          columns={this.columns}
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(maintenanceRecord);
