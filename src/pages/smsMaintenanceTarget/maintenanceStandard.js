import { Table, Form, Input, Button, Divider, message, Modal, Spin } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.css';
import { getTableList, deleteList } from './service';
const { confirm } = Modal;
class maintenanceStandard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      loading: true,
    };
    this.timer = '';
    this.columns = [
      {
        title: '标准标号',
        dataIndex: 'targetCode',
        key: 'targetCode',
      },
      {
        title: '保养项',
        dataIndex: 'targetName',
        key: 'targetName',
      },
      {
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, row, index, action) => (
          <div className="operate">
            <a onClick={this.edit.bind(this, row)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={this.deleteTableList.bind(this, row)}>删除</a>
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    getTableList().then(res => {
      if (res.code == '0') {
        let that = this;
        this.timer = setTimeout(function() {
          that.setState({
            dataSource: res.data,
            loading: false,
          });
        }, 200);
      }
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  //删除
  deleteTableList(row) {
    confirm({
      title: '确定要删除吗?',
      onOk: () => {
        let data = row.id;
        deleteList(data).then(res => {
          // console.log('aa===',res)
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

  //编辑
  edit(row) {
    console.log('edit===', row);
    this.props.history.push({
      pathname: './maintenanceStandard/addForm',
      state: { data: row },
    });
  }

  //新增
  add = () => {
    const row = '';
    this.props.history.push({
      pathname: './maintenanceStandard/addForm',
      state: { data: row },
    });
  };

  //查询列表
  searchList() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { dataSource } = this.state;
        let params = {
          targetCode: values.targetCode === undefined ? '' : values.targetCode,
          targetName: values.targetName === undefined ? '' : values.targetName,
        };
        // console.log('params====',params)
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
              <Button className={styles.btn} onClick={this.add}>
                新增
              </Button>
            </Form.Item>
          </Form>
          <Form layout="inline">
            <Form.Item>
              {form.getFieldDecorator('targetCode')(<Input placeholder="请输入标准编号" />)}
            </Form.Item>
            <Form.Item>
              {form.getFieldDecorator('targetName')(<Input placeholder="请输入保养项名称" />)}
            </Form.Item>
            <Form.Item>
              <Button className={styles.search} onClick={() => this.searchList()}>
                查询
              </Button>
            </Form.Item>
          </Form>
        </div>
        <Spin spinning={this.state.loading} size="large">
          <Table
            style={{
              marginBottom: 16,
              background: '#fff',
            }}
            rowKey="id"
            dataSource={dataSource}
            columns={this.columns}
            pagination={{ pageSize: 10 }}
          />
        </Spin>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(maintenanceStandard);
