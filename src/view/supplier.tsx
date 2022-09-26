import { Progress, Table, Button, Modal, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { downloadExcel, getSuppliers } from './request';

const openNotificationWithIcon = () => {
  notification.error({
    message: '错误信息',
    description:
      '供应商列表为空，无法获取',
  });
};

const App: React.FC = () => {

  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [fetchStatus, setFetchStatus] = useState(false);
  const [percent, setPercent] = useState(0);

  useMemo(() => {
    if (fetchStatus) {
      if(suppliers.length == 0) {
        openNotificationWithIcon();
        setFetchStatus(false);
        return;
      }
      downloadExcel(suppliers, (percent: number) => {
        setPercent(percent);
      })
    }
  }, [fetchStatus])

  if (fetchStatus) {
    return <>
      <Progress type="circle" percent={percent} width={300} style={{
        width: '100%',
        textAlign: 'center',
        margin: '4em 0'
      }} />
      <div style={{
        textAlign: 'center'
      }}>
        {
          percent == 100 ?
          <Button type="primary" onClick={() => {
            location.href = location.pathname + "#/";
          }}>跳转到主页</Button>
          :<>
          <h1>正在抓取中</h1>
          <h1>抓取进度</h1>
          </>
        }
      </div>
    </>
  }


  const columns: ColumnsType = [
    {
      title: '供应商名称',
      dataIndex: 'supplier_name',
      key: 'supplier_name',
    },
    {
      title: '供应商编号',
      dataIndex: 'co_id1',
      key: 'co_id1',
    },
    {
      title: '我方备注',
      dataIndex: 'remark1',
      key: 'remark1',
    },
    {
      title: '对方备注',
      dataIndex: 'remark2',
      key: 'remark2',
    },
    {
      title: '状态',
      dataIndex: 'statusText',
      key: 'statusText',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record: any) => {
        return <a onClick={(e) => {
          setSuppliers(suppliers.filter((value => value['co_id1'] != record['co_id1'])))
        }}>删除</a>
      }
    }
  ];

  return <>
    <Modal
      title="提示"
      open={open}
      onOk={() => {
        setConfirmLoading(true);
        getSuppliers().then(value => {
          setSuppliers(value.datas);
        }).then(() => {
          setOpen(false);
          setConfirmLoading(false);
        });
      }}
      confirmLoading={confirmLoading}
      onCancel={() => setOpen(false)}
      okText={"确定"}
      cancelText={"取消"}
    >
      <p>是否要同步供应商列表</p>
    </Modal>
    <div style={{
      marginBottom: '1em',
      display: 'flex'
    }}>
      <Button style={{ marginRight: '1em' }} onClick={() => {
        setOpen(true)
      }} type="primary">获取供应商列表</Button>
      <Button onClick={() => {
        setFetchStatus(true);
      }} type="primary">抓取供应商货品</Button>
      <div style={{ flex: 1 }}></div>
      <div style={{ fontSize: '1.2em' }}>TIP: 在获取任务前请手动登录并刷新代理商列表</div>
    </div>
    <Table
      columns={columns}
      dataSource={suppliers}
      rowKey={"rn__"}
    />
  </>
};

export default App;