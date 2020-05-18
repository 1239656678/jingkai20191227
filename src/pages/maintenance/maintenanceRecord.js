import React, { Component } from 'react';
import { Button, Form, Input, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.css';
import { fetchRepairList } from './service';
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
        dataIndex: 'reportUser',
        key: 'reportUser',
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
        title: '维修单位',
        dataIndex: 'faultUserOrganizationName',
        key: 'faultUserOrganizationName',
      },
      {
        title: '维修人',
        dataIndex: 'faultUser',
        key: 'faultUser',
      },
      {
        title: '完成时间',
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
        render: (text, row, index, action) => (
          <a onClick={this.repairDetail.bind(this, row)}>详情</a>
        ),
      },
    ];
  }

  componentDidMount() {
    fetchRepairList().then(res => {
      const arr = [];
      for (let i in res.data) {
        // let obj = Object.assign (res.data[i].equipmentFaultRecordStatistice,{createDate : res.data[i].createDate})
        let obj = {
          ...res.data[i].equipmentFaultRecordStatistice,
          createDate: res.data[i].createDate,
          id: res.data[i].id,
          remark: res.data[i].remark,
        };
        arr.push(obj);
      }
      // console.log('arrsss===',arr)
      this.setState({
        dataSource: arr,
        data: res.data,
      });
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

  repairDetail(row) {
    console.log('维修记录222=========', row);
    console.log('datasource========', this.state.data);
    this.props.history.push({
      pathname: '/maintenance/maintenanceRecord/repairDetail',
      state: { data: this.state.data, row: row },
    });
    // for (let i in this.state.data) {
    //     if (this.state.data[i].id == row.id) {
    //         console.log('equipmentInfo====',this.state.data[i].equipmentInfo)
    //         let params = this.state.data[i].equipmentInfo
    //         this.props.history.push ({
    //             pathname : '/maintenance/maintenanceRecord/repairDetail',
    //             state : { data : this.state.data, row : params }
    //         })
    //     }
    // }
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
              {form.getFieldDecorator('installArea')(<Input placeholder="请输入安装区域" />)}
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
