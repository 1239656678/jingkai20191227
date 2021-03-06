import { Button, Divider, Dropdown, Form, Icon, Menu, message } from 'antd';
import React, { useState, useRef } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { queryRule, updateRule, addRule, removeRule } from './service';

function test(action) {
  let ref = useRef();
  console.log(ref);
}
const TableList = () => {
  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const columns = [
    {
      title: '规则名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '服务调用次数',
      dataIndex: 'callNo',
      sorter: true,
      renderText: val => `${val} 万`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: {
          text: '关闭',
          status: 'Default',
        },
        1: {
          text: '运行中',
          status: 'Processing',
        },
        2: {
          text: '已上线',
          status: 'Success',
        },
        3: {
          text: '异常',
          status: 'Error',
        },
      },
    },
    {
      title: '上次调度时间',
      dataIndex: 'updatedAt',
      sorter: true,
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (text, row, index, action) => [
        <a
          onClick={() => {
            window.alert('确认删除？');
            action.reload();
          }}
        >
          delete
        </a>,
        <a
          onClick={() => {
            window.alert('确认刷新？');
            console.log(action);
            action.reload();
          }}
        >
          reload
        </a>,
      ],
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProTable
        headerTitle="查询表格"
        // actionRef={actionRef}
        rowKey="key"
        toolBarRender={(action, { selectedRows }) => [
          <Button icon="plus" type="primary" onClick={() => handleModalVisible(true)}>
            新建
          </Button>,
          <Button icon="plus" type="primary" onClick={() => test()}>
            test
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async e => {
                    if (e.key === 'remove') {
                      await handleRemove(selectedRows);
                      action.reload();
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                  <Menu.Item key="approval">批量审批</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <Icon type="down" />
              </Button>
            </Dropdown>
          ),
        ]}
        // tableAlertRender={(selectedRowKeys, selectedRows) => (
        //   <div>
        //     已选择{' '}
        //     <a
        //       style={{
        //         fontWeight: 600,
        //       }}
        //     >
        //       {selectedRowKeys.length}
        //     </a>{' '}
        //     项&nbsp;&nbsp;
        //     <span>
        //       服务调用次数总计 {selectedRows.reduce((pre, item) => pre + item.callNo, 0)} 万
        //     </span>
        //   </div>
        // )}
        request={params => queryRule(params)}
        columns={columns}
        rowSelection={{}}
      />
      {/* <CreateForm
        onSubmit={async value => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      /> */}
      {/* {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async value => {
            const success = await handleUpdate(value);

            if (success) {
              handleModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null} */}
    </PageHeaderWrapper>
  );
};

export default Form.create()(TableList);
