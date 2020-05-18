import React, { Component } from 'react';
import { Button, Form, Input, Table, Card, DatePicker, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
const { Option } = Select;
import styles from './style.less';
class monthReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      href: '',
    };
    this.columns = [
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        className: styles.aa,
      },
      {
        title: '报表日期',
        dataIndex: 'createDate',
        key: 'createDate',
        render: text => {
          return this.formateDate(text);
        },
      },
      {
        title: '操作',
        dataIndex: 'operate',
        key: 'operate',
        render: (text, record, index) => (
          <div className="operate">
            <a href={this.state.href} onClick={this.download.bind(this, record)}>
              下载
            </a>
          </div>
        ),
      },
    ];
  }

  componentDidMount() {
    this.getTabList();
  }

  //查询数据列表
  getTabList = data => {
    this.props
      .dispatch({
        type: 'safeReport/safeReportList',
        payload: {
          type: 0,
          name: data,
        },
      })
      .then(() => {
        if (this.props.tableList.code == 0) {
          this.setState({
            dataSource: this.props.tableList.data,
            loading: false,
          });
        }
      });
  };

  //查询列表
  fetchList = () => {
    this.setState({
      loading: true,
    });
    let name = this.props.form.getFieldValue('name');
    let data = name ? name : '';
    this.getTabList(data);
  };

  formateDate(date) {
    var date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    var d = date.getDate();
    return y + '-' + m + '-' + d;
  }

  //下载
  download(record) {
    let params = `http://106.12.190.252/word/${record.id}.doc`;
    this.setState({
      href: params,
    });
  }

  render() {
    const { form } = this.props;
    const { dataSource } = this.state;
    return (
      <div
        style={{
          background: '#fff',
          height: 'calc(100vh - 130px)',
          boxShadow: '0px 4px 3px rgba(187,187,187,0.2)',
        }}
      >
        <Card bordered={false} bodyStyle={{ padding: '24px 24px 0px' }}>
          <PageHeaderWrapper className={styles.nav}>
            <Form layout="inline">
              <Form.Item>
                {form.getFieldDecorator('name')(<Input placeholder="请输入报表名称" allowClear />)}
              </Form.Item>
              <Form.Item>
                <Button className={styles.search} onClick={this.fetchList}>
                  查询
                </Button>
              </Form.Item>
            </Form>
          </PageHeaderWrapper>
        </Card>
        <Table
          style={{
            background: '#fff',
          }}
          rowKey="id"
          loading={this.state.loading}
          dataSource={dataSource}
          columns={this.columns}
          pagination={{ pageSize: 10 }}
          bordered={false}
        />
      </div>
    );
  }
}

export default Form.create()(
  connect(({ safeReport }) => ({
    tableList: safeReport.getData,
  }))(monthReport),
);
