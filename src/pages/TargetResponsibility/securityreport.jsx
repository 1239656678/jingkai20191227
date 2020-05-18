import React, { Component } from 'react';
import { Button, Form, Input, Table, Card, DatePicker, Select } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
const { Option } = Select;
class securityreport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      dataSource: [],
      time: '',
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
        title: '填报时间',
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
            {/* <Divider type="vertical" />
                        <a onClick={this.deleteList.bind(this,record)}>删除</a> */}
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
          type: data,
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
    let num = this.props.form.getFieldValue('type');
    let data = num != undefined ? parseInt(num) : '';
    this.getTabList(data);
  };

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

  //新增
  addReport() {
    this.props.history.push({
      pathname: '/targetResponsibility/securityreport/addreport',
    });
  }
  //下载
  download(record) {
    let params = `http://106.12.190.252/word/${record.id}.doc`;
    this.setState({
      href: params,
    });
  }

  selectTime = (date, dateString) => {
    console.log('时间====', dateString);
    this.setState({
      time: dateString,
    });
  };

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
          <PageHeaderWrapper className={styles.header}>
            <div className={styles.formInput}>
              <Form layout="inline">
                <Form.Item>
                  <Button className={styles.btn} onClick={() => this.addReport()}>
                    新增
                  </Button>
                </Form.Item>
              </Form>
              <Form layout="inline">
                <Form.Item>
                  {form.getFieldDecorator('type')(
                    <Select
                      onChange={this.selectEquipment}
                      placeholder="请选择报表周期"
                      allowClear={true}
                      style={{ width: 180 }}
                    >
                      <Option key="0">月度报表</Option>
                      <Option key="1">季度报表</Option>
                      <Option key="2">年度报表</Option>
                    </Select>,
                  )}
                </Form.Item>
                {/* <Form.Item>
                                    {form.getFieldDecorator('selectDate')(
                                        <DatePicker
                                            showTime
                                            format="YYYY-MM-DD HH:mm:ss"
                                            onChange={this.selectTime}
                                            placeholder="请选择填报日期"
                                            allowClear={true}
                                        />,
                                    )}
                                </Form.Item> */}
                <Form.Item>
                  <Button className={styles.search} onClick={this.fetchList}>
                    查询
                  </Button>
                </Form.Item>
              </Form>
            </div>
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
  }))(securityreport),
);
