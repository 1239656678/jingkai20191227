import React, { Component } from 'react';
import { Table, Modal, Divider, Form, Button, Input, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.css';
const { confirm } = Modal;

class AreaManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      dataSource: [],
    };
    this.columns = [
      {
        title: '区域名称',
        dataIndex: 'name',
        key: 'name',
        render: (text, value) => {
          return <span>{text}</span>;
        },
        width: '80%',
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        valueType: 'option',
        render: (text, row, index) => (
          <>
            <a onClick={this.updateArea.bind(this, row)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={this.handdelete.bind(this, row)}>删除</a>
          </>
        ),
      },
    ];
  }

  componentDidMount() {
    this.setState({
      isLoading: true,
    });
    this.getAreaList();
  }

  //添加区域
  addArea() {
    this.props.history.push({
      pathname: '/devicemanagement/form/addform',
      state: {
        isAdd: 1,
      },
    });
  }

  //修改区域
  updateArea(record) {
    this.props.history.push({
      pathname: '/devicemanagement/form/addform',
      state: {
        record: record,
        isAdd: 0,
      },
    });
  }
  //删除操作
  handdelete(row) {
    confirm({
      title: '确定要删除吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.setState({
          isLoading: true,
        });
        this.props
          .dispatch({
            type: 'deviceManagement/RemovesmsRegions',
            payload: {
              id: row.id,
            },
          })
          .then(() => {
            if (this.props.remove.code == 0) {
              message.success('删除成功');
              this.getAreaList();
            }
          });
      },
    });
  }

  //获取区域数据
  getAreaList() {
    // this.props.dispatch({
    //     type:'deviceManagement/dataListModel'
    // }).then ((res) => {
    //     // console.log ('dataSource====',this.props.dataSource)
    //     this.setState ({
    //         dataSource : this.props.dataSource,
    //         isLoading : false
    //     })
    // })
    this.props
      .dispatch({
        type: 'deviceManagement/treeData',
      })
      .then(r => {
        this.setState({
          dataSource: this.props.treeData,
          isLoading: false,
        });
      });
  }

  render() {
    const { dataSource, isLoading } = this.state;
    const { form } = this.props;
    return (
      <PageHeaderWrapper title="区域管理">
        <div className={styles.formInput}>
          <Form layout="inline">
            <Form.Item>
              <Button className={styles.equipment} onClick={() => this.addArea()}>
                添加区域
              </Button>
            </Form.Item>
          </Form>
          <Form layout="inline">
            {/* <Form.Item>
                            {form.getFieldDecorator('equipmentCode')(<Input placeholder="请输入设备编号" />)}
                        </Form.Item>
                        <Form.Item>
                            {form.getFieldDecorator('equipmentName')(<Input placeholder="请输入设备名称" />)}
                        </Form.Item>
                        <Form.Item>
                            {form.getFieldDecorator('installArea')(<Input placeholder="请输入区域名称" />)}
                        </Form.Item>
                        <Form.Item>
                            <Button className={styles.search}>查询</Button>
                        </Form.Item> */}
          </Form>
        </div>
        <Table
          rowKey="id"
          style={{
            width: '100%',
            backgroundColor: '#ffffff',
          }}
          loading={isLoading}
          columns={this.columns}
          dataSource={dataSource}
        />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(
  connect(({ deviceManagement }) => ({
    treeData: deviceManagement.treeData,
    remove: deviceManagement.remove,
    dataSource: deviceManagement.findAllList,
  }))(AreaManager),
);
