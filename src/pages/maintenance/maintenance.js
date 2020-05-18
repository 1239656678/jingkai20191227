import { Table, Form, Input, Button, Divider, Modal, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { getTableList, deleteTableList } from './service';
const { confirm } = Modal;
import styles from './style.css';
class maintenance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
    this.columns = [
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
        title: '安装区域',
        dataIndex: 'installArea',
        key: 'installArea',
      },
      {
        title: '报修人',
        dataIndex: 'reportUserName',
        key: 'reportUserName',
      },
      {
        title: '报修时间',
        dataIndex: 'reportDate',
        key: 'reportDate',
        render: text => {
          return this.formateDate(text);
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, row, index) => (
          <div className="operate">
            <a onClick={this.assignment.bind(this, row)}>{row.assign == false ? '指派' : ''}</a>
            {row.assign == false ? <Divider type="vertical" /> : ''}
            <a onClick={this.deleteList.bind(this, row)}>删除</a>
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    getTableList().then(res => {
      if (res.code == '0') {
        this.setState({
          dataSource: res.data,
        });
      }
    });
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
  //指派
  assignment(row) {
    console.log('指派===', row);
    this.setState({
      data: row,
    });
    this.props.history.push({
      pathname: '/maintenance/maintain/assignment',
      state: { data: row },
    });
  }

  //删除
  deleteList(row) {
    console.log('record====', row.id);
    let data = row.id;
    confirm({
      title: '确定要删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        deleteTableList(data).then(res => {
          if (res.code == '0') {
            message.success('删除成功');
            getTableList().then(res => {
              if (res.code == '0') {
                this.setState({
                  dataSource: res.data,
                });
              }
            });
          }
        });
      },
    });
  }

  render() {
    const { form, loading } = this.props;
    const { dataSource } = this.state;

    return (
      <PageHeaderWrapper>
        <div className={styles.formInput} style={{ padding: '0 10px 20px' }}>
          {/* <Form.Item>
                <Button className={styles.btn}>新增</Button>
              </Form.Item> */}
          <Form layout="inline">
            <Form.Item>
              {form.getFieldDecorator('equipmentName')(<Input placeholder="请输入设备名称" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('installArea')(<Input placeholder="请选择安装区域" />)}
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

export default Form.create()(maintenance);
