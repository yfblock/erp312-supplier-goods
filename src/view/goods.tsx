import { Button, Col, Form, Input, InputNumber, Row } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { query } from "./ipc";

const columns: ColumnsType = [
    {
      title: '商品编码',
      dataIndex: 'code',
    },
    {
        title: '商品名称',
        dataIndex: 'name',
    },
    {
        title: '商品类型',
        dataIndex: 'type',
    },
    {
        title: '分销价格',
        dataIndex: 's_price',
    },
    {
        title: '基本价格',
        dataIndex: 'base_price',
    },
    {
        title: '库存',
        dataIndex: 'number',
    },
    {
        title: '供应商名称',
        dataIndex: 'supplier'
    }
];

export default function () {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [condition, setCondition] = useState({
        name: '',
        code: '',
        number: 0
    });


    let [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    useEffect(() => {
        query('select * from supplier limit 10').then((value: any) => {
            setData(value)
        })
        query(`select count(*) as num from supplier`).then((value: any) => {
            setPagination({
                ...pagination,
                total: value[0]['num']
            })
        })
    }, [])

    return <div>
        <Form
            form={form}
            onFinish={(value) => {
                let name = value['name'] ?? '';
                let code = value['code'] ?? '';
                let number = value['number'] ?? 0;
                name = name.replaceAll(' ', '%');
                setCondition({
                    name,
                    code,
                    number
                })
                query(`select * from supplier where name like '%${name}%' and 
                    code like '%${code}%' and number >  ${number} order by code limit ${(pagination.current - 1) * 10}, 10`).then((value: any) => {
                    setData(value)
                })
                query(`select count(*) as num from supplier where name like '%${name}%' and 
                    code like '%${code}%' and number >  ${number}`).then((value: any) => {
                    setPagination({
                        ...pagination,
                        current: 1,
                        total: value[0]['num']
                    })
                })
            }}
        >
            <Row gutter={24}>
                <Col span={7}>
                    <Form.Item name={`name`} label={'商品名称'}>
                        <Input placeholder="商品名称" />
                    </Form.Item>
                </Col>
                <Col span={7}>
                    <Form.Item name={`code`} label={'编码名称'}>
                        <Input placeholder="商品编码" />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item name={`number`} label={'库存'}>
                        <InputNumber defaultValue={0} min={0} placeholder="库存数量" />
                    </Form.Item>
                </Col>
                <Col span={4}>
                    <Button type="primary" htmlType="submit">
                        搜索
                    </Button>
                </Col>
            </Row>
        </Form>
        <Table
            columns={columns}
            rowKey={'id'}
            dataSource={data}
            pagination={{
                ...pagination,
                showSizeChanger: false
            }}
            onChange = {((paginationConfig) => {
                // 搜索信息
                setPagination({
                    ...pagination,
                    ...paginationConfig
                })
                setLoading(true);
                
                query(`select * from supplier where name like '%${condition.name}%' and 
                    code like '%${condition.code}%' and number >  ${condition.number} order by code limit ${(paginationConfig.current - 1) * 10}, 10`).then((value: any) => {
                    setData(value)
                }).then(()=>setLoading(false))
            })}
            loading={loading}
            // onChange={handleTableChange}
        />
    </div>;
}