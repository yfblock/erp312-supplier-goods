import { Progress, Table, Button, Modal, notification, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useMemo, useState } from 'react';
import { execute, query } from './ipc';
import { downloadExcel, getSuppliers } from './request';
import { ExclamationCircleFilled } from '@ant-design/icons';

// 错误信息提示
const openNotificationWithIcon = () => {
  notification.error({
    message: '错误信息',
    description:
      '供应商列表为空，无法获取',
  });
};

// 获取供应商邮费
const getSupplierFranking = (list: any[], supplier: any): number => {
  for(let record of list) {
    if(record.name === supplier) {
      return record['franking'];
    }
  }

  return 0;
}


const App: React.FC = () => {

  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [fetchStatus, setFetchStatus] = useState(false);
  const [percent, setPercent] = useState(0);

  // 供货商邮费列表
  const [frankings, setFrankings] = useState([]);
  const [modelOpen, setModelOpen] = useState(false);
  const [record, setRecord] = useState({coName: ''});
  const [frankingNumber, setFrankingNumber] = useState(0);

  useMemo(() => {
    // 如果是抓取
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
  }, [fetchStatus]);

  // 检测数据库是否创建，查询数据库信息 
  useMemo(() => {
    execute(`CREATE TABLE IF NOT EXISTS 'franking' (
      'name' TEXT PRIMARY KEY,
      'franking' NUMBER
    )`)
    .then(() => query('select * from franking'))
    .then((ret: any) => setFrankings(ret))
    .then(() => console.log(`数据库检测通过`));
  }, []);

  const  changeFranking = async (name: string, franking: number) => {
    // 查询是否存在这个记录
    let res = await query(`select * from franking where name = '${name}'`);
    if(res.length > 0) {
      // 如果有记录，修改
      await execute(`update franking set franking = ${franking} where name = '${name}'`);
    } else {
      // 如果没有记录，插入
      await execute(`insert into franking (name, franking) values ('${name}', '${franking}')`);
    }
  }

  // 如果是抓取状态，显示抓取的 screen
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

  // 表格列表
  const columns: ColumnsType = [
    {
      title: '供应商名称',
      dataIndex: 'coName',
      key: 'coName',
    },
    {
      title: '供应商编号',
      dataIndex: 'coId',
      key: 'coId',
    },
    {
      title: '我方备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '状态',
      dataIndex: 'status',
      // key: 'status',
      render: (value, record) => {
        let status: any = {
          "2": '合作中',
        }
        return status[value];
      }
    },
    {
      title: '邮费',
      dataIndex: '',
      render: (_, record: any, index) => {
        return getSupplierFranking(frankings, record['coName']);
      }
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_, record: any) => {
        return <>
          <a onClick={(e) => {
            setRecord(record);
            setModelOpen(true);
          }}>编辑邮费</a>
          &nbsp;&nbsp;&nbsp;
          <a onClick={(e) => {
            setSuppliers(suppliers.filter((value => value['coId'] != record['coId'])))
          }}>删除</a>
        </>
      }
    }
  ];


  // 供货商 screen
  return <>
    <Modal
      title="提示"
      open={open}
      onOk={() => {
        setConfirmLoading(true);
        getSuppliers().then(value => {
          console.log(value);
          setSuppliers(value);
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
    <Modal title="Basic Drawer" 
      open={modelOpen} 
      onOk={() => {
        changeFranking(record['coName'], frankingNumber)
        .then(() => query('select * from franking'))
        .then(ret => setFrankings(ret))
        .then(() => setModelOpen(false))
      }} 
      onCancel={() => setModelOpen(false)}
    >
      <InputNumber onChange={(value) => setFrankingNumber(value)} value={getSupplierFranking(frankings, record['coName'])} />
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
      rowKey={"coId"}
      pagination={{
        pageSize: 100
      }}
    />
  </>
};

export default App;