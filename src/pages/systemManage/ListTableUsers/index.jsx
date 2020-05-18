import { Button, Divider, Dropdown, Form, Transfer, Tag, message, Avatar, Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'dva';
import { queryRule } from './service';
import map from '@/pages/user/login/components/Login/map';
import Modal from 'antd/es/modal';

const FormItem = Form.Item;

// treeData处理数据
function formatData(arrays) {
  if (arrays != null) {
    let array = Array.from(arrays);
    array.map(item => {
      item.title = item.name;
      item.value = item.id;
      item.key = item.id;
    });
    return array;
  }
}

class ListTableUsers extends React.Component {
  state = {
    detail: [],
    visible: false, 
    placement: 'right',
    targetKeys: [],
    selectedKeys: [],
    userName:[],
    userId:[],
    mockData:[],
    disabled: false,
    selectedRowKeys: [],
  };
  componentDidMount() {
    this.props
      .dispatch({
        type: 'rolemanage/getPatroPlanList',
        payload:{
          code:'',
          name:''
        }
      })
    .then(() => {
        this.setState({
          mockData: formatData(this.props.rolelist.data),
        });
    });
  }

  handleDetail(data) {
    this.props.history.push({ pathname: '/securityplan/detail', state: { detail: data } });
  }
  // handlDelete = data => {
  //   // this.props.history.push({ pathname: '/deviceManagement?' + this.state.id });
  //   this.props
  //     .dispatch({
  //       type: 'patroPlanModel/RemovePatroPlan',
  //       payload: {
  //         id: data.id,
  //       },
  //     })
  //     .then(() => {
  //       setTimeout(() => {
  //         message.success('删除成功');
  //         this.props.history.push({ pathname: '/securityplan' });
  //       }, 1000);
  //     });
  // };
  handleDelete(data,action) {
    this.props
      .dispatch({
        type: 'userManage/deleteUser',
        payload: data.id,
      })
      .then(() => {
        if (this.props.initState.code === 0) {
          message.success('删除成功！');
          action.reload();
        } else {
          message.error(this.props.initState.msg);
          action.reload();
        }
      });
  }
  handleDeleteByKeys(action){
    if (this.state.selectedRowKeys.length !== 0) {
      // let arrays=this.state.selectedRowKeys;
      // let ids = '';
      // for (let i = 0; i < arrays.length; i++) {
      //   if (i == arrays.length - 1) {
      //     ids += arrays[i];
      //   } else {
      //     ids += arrays[i] + ',';
      //   }
      // }
      this.props
        .dispatch({
          type: 'userManage/deleteUser',
          payload: this.state.selectedRowKeys
        })
        .then(() => {
          if (this.props.initState.code === 0) {
            message.success('删除成功！');
            action.reload();
          } else {
            message.error(this.props.initState.msg);
            action.reload();
          }
        });
    } else {
      message.error('没有选中项');
    }
  }
  showDrawer = (data) => {
    let name=data.name+'绑定角色'
    this.props.dispatch({
      type: 'userManage/getBindRoles',
      payload: data.id,
    })
  .then(() => {
       let getfindmenuList = formatData(this.props.getRoles.payload);
        if (getfindmenuList != null) {
          let keys = [];
          let arrData = Array.from(getfindmenuList);
          arrData.map(item => {
            keys.push(item.key);
          });
          this.setState({
            targetKeys: keys,
          });
        }
  });
    this.setState({
      visible: true,
      userId: data.id,
      userName: name
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
      userId: '',
      userName: '',
      targetKeys: [],
      selectedKeys: [],
    });
  };

  onChange = e => {
    this.setState({
      placement: e.target.value,
    });
  };

  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({ targetKeys: nextTargetKeys });
    // console.log('targetKeys: ', nextTargetKeys);
    // console.log('direction: ', direction);
    // console.log('moveKeys: ', moveKeys);
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
    // console.log('sourceSelectedKeys: ', sourceSelectedKeys);
    // console.log('targetSelectedKeys: ', targetSelectedKeys);
  };

  handleScroll = (direction, e) => {
    // console.log('direction:', direction);
    // console.log('target:', e.target);
  };

  handleDisable = disabled => {
    this.setState({ disabled });
  };
  handlUpdateData=data=>{
    this.props.history.push({ pathname: '/ListTableUsers/addform' , state: { data: data,isAdd:0 }})
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      this.props
        .dispatch({
          type: 'userManage/getBindRoles',
          payload: this.state.userId,
        })
        .then(r => {
          let getfindmenuList = formatData(this.props.getRoles.payload);
          if (getfindmenuList != null) {
            let keys = [];
            let arrData = Array.from(getfindmenuList);
            arrData.map(item => {
              keys.push(item.key);
            });
            //遍历删除
            for(let i=0;i<keys.length;i++){
              let roleId=keys[i];
              this.props
              .dispatch({
                type: 'userManage/removeBindRoles',
                payload: {
                  userId: this.state.userId,
                  roleId: roleId,
                },
              })
            }
                let roleIds = Array.from(values.roleIds);
                let ids = '';
                for (let i = 0; i < roleIds.length; i++) {
                  if (i == roleIds.length - 1) {
                    ids += roleIds[i];
                  } else {
                    ids += roleIds[i] + ',';
                  }
                }
                const value = {
                  userId: this.state.userId,
                  roleIds: ids,
                };
                const parme = 'userId=' + value.userId + '&roleIds=' + value.roleIds;
                if (!err) {
                  this.props.dispatch({
                    type: 'userManage/bindRoles',
                    payload: parme,
                  }).then(r => {
                    this.setState({ targetKeys: [] });
                    if (this.props.bindCode.payload.code === 0) {
                      message.success(this.props.bindCode.payload.msg);
                      this.setState({
                        visible: false,
                        userId: '',
                        userName: '',
                        targetKeys: [],
                        selectedKeys: [],
                      });
                    }else{
                      message.success(this.props.bindCode.payload.msg);
                    }
                  });
                }
          }
        });
    });
  };
  columns = [
    {
      title: '头像',
      dataIndex: 'imgHref',
      hideInSearch: true,
      render: text => {
        // const url = 'http://http://106.12.190.252' + text;
        const url=''
        return <Avatar src={url} shape="square" size={48} />;
      },
    },
    {
      title: '姓名',
      dataIndex: 'name',
      // render: (text, record) => (
      //   <a onClick={this.handleDetails.bind(this,record)}>{text}</a>

      // ),
    },
    {
      title: '职位',
      dataIndex: 'position',
      hideInSearch: true,
    },
    {
      title: '岗位',
      dataIndex: 'post',
      hideInSearch: true,
    },
    {
      title: '所在部门',
      dataIndex: 'organizationName',
      hideInSearch: true,
    },
    {
      title: '联系电话',
      dataIndex: 'phoneNum',
      hideInSearch: true,
    },
    {
      title: '状态',
      dataIndex: 'enable',
      hideInSearch: true,
      // render:(text) => {
      //   return text === true ? ( <Tag color="green">已启用</Tag>):(<Tag color="red">已禁用</Tag>)
      // }
    },
    {
      title: '操作',
      dataIndex: 'txt',
      hideInSearch: true,
      render: (text, row, index, action) => (
        <span>
           <a
            onClick={this.handlUpdateData.bind(this, row)}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a onClick={this.showDrawer.bind(this, row)}>绑定角色</a>
          <Divider type="vertical" />
          <a onClick={this.handleDelete.bind(this, row, action)}>删除</a>
        </span>
      ),
    },
  ];

  render() {
    const { submitting } = this.props;
    const { targetKeys, selectedKeys, disabled,mockData } = this.state;
    const {
      form: { getFieldDecorator, getFieldValue },
    } = this.props;
    return (
      <PageHeaderWrapper>
         <Drawer
          title='用户绑定角色'
          placement={this.state.placement}
          closable={false}
          onClose={this.onClose}
          width='600px'
          visible={this.state.visible}
        >
           <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{
              marginTop: 8,
            }}
          >
             <FormItem  label={this.state.userName} >
             {getFieldDecorator('roleIds', {
                rules: [
                  {
                    required: true,
                    message: '角色不能为空',
                  },
                ],
              })( <Transfer
                dataSource={this.state.mockData}
                titles={['角色列表', '已绑定角色']}
                listStyle={{
                  width: 200,
                  height: 350,
                }}
                targetKeys={this.state.targetKeys}
                selectedKeys={selectedKeys}
                onChange={this.handleChange}
                onSelectChange={this.handleSelectChange}
                onScroll={this.handleScroll}
                render={item => item.title}
              />)}
               
              </FormItem>
              <FormItem
              style={{
                marginTop: 32,
                marginLeft: '25%'
              }}
            >
              <Button type="primary" htmlType="submit" loading={submitting}>
                绑定角色
              </Button>
              <Button
                style={{
                  marginLeft: 8,
                }}
                onClick={() => {
                  this.setState({
                    visible: false,
                    userId: '',
                    userName: '',
                    targetKeys: [],
                    selectedKeys: [],
                  });
                }}
              >
               关闭并取消
              </Button>
            </FormItem>
        
        </Form>
        </Drawer>
        
        <ProTable
          style={{ paddingLeft: '20' }}
          headerTitle="用户列表"
          // actionRef={actionRef}
          rowKey="id"
          toolBarRender={(action, { selectedRows }) => [
            <Button
              icon="plus"
              type="primary"
              onClick={() => {
                this.props.history.push({ pathname: '/ListTableUsers/addform' , state: { isAdd:1 } });
              }}
            >
              添加
            </Button>,
             <Button
             type="danger"
             onClick={() => {this.handleDeleteByKeys(action);
                }}
              >
                批量删除
              </Button>,
          ]}
          request={(parmes) =>{
            let search = {
              name: parmes.name === undefined ? '' : parmes.name
            };
            return queryRule(search)
          }}
          columns={this.columns}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              this.setState({
                selectedRowKeys: selectedRowKeys,
              });
            },
          }}
        />
        
      </PageHeaderWrapper>
      
    );
  }
}
const RoleListFrom = Form.create()(ListTableUsers);
export default connect(({ equipmentLedger, userManage,rolemanage }) => ({
  dataList: equipmentLedger.dataList,
  list: equipmentLedger.list,
  count: equipmentLedger.count,
  initState: userManage.initState,
  rolelist:rolemanage.list,
  bindCode:userManage.bindResultCode,
  getRoles:userManage.getRolesList
  
}))(RoleListFrom);
