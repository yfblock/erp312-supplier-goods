import { Button, Col, Form, Input, InputNumber, Row } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import React, { useEffect, useState } from "react";
import { initDatabase, query } from "./ipc";

const columns: ColumnsType = [
    {
      title: '商品编码',
      dataIndex: 'code',
      sorter: (a: any, b: any) => {
        return a.code > b.code ? 1 : -1;
      },
    },
    {
        title: '商品名称',
        dataIndex: 'name',
        sorter: (a: any, b: any) => {
            return a.name > b.name ? 1 : -1;
        },
    },
    // {
    //     title: '商品类型',
    //     dataIndex: 'type',
    // },
    {
        title: '分销价格',
        dataIndex: 's_price',
        sorter: (a: any, b: any) => {
            return a.s_price > b.s_price ? 1 : -1;
        },
    },
    // {
    //     title: '基本价格',
    //     dataIndex: 'base_price',
    //     sorter: (a: any, b: any) => {
    //         return a.base_price > b.base_price ? 1 : -1;
    //     },
    // },
    {
        title: '成本',
        dataIndex: 'franking',
        sorter: (a: any, b: any) => {
            return a.franking > b.franking ? 1 : -1;
        },
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
        query('select supplier.*, (supplier.s_price + coalesce(franking.franking, 0)) as franking from supplier left join franking on supplier.supplier = franking.name limit 10').then((value: any) => {
            setData(value)
        })
        query(`select count(*) as num from supplier`).then((value: any) => {
            setPagination({
                ...pagination,
                total: value[0]['num']
            })
        })
    }, [])


    const updateTable = async (condition: any, pagination: any) => {
        const {
            name,
            code,
            number
        } = condition;

        let whereCondition = ``;

        let nameArr = name.split('%').filter((v: any) => v.trim() != "");
        if(nameArr.length > 0) {
            whereCondition += '(';

            whereCondition += 
                nameArr.map((value: any) => `supplier.name like '%${value}%'`).join('and ');
            whereCondition += ') and ';
        }

        whereCondition += `code like '%${code}%' and number >  ${number}`;

        let data = await query(`select supplier.*, (supplier.s_price + coalesce(franking.franking, 0)) as franking from supplier left join franking on supplier.supplier = franking.name where ${whereCondition} order by code, base_price asc limit ${(pagination.current - 1) * pagination.pageSize}, ${pagination.pageSize}`);
        setData(data);
        let value = await query(`select count(*) as num from supplier where ${whereCondition}`)
        setPagination({
            ...pagination,
            total: value[0]['num']
        })
    }

    return <div>
        <Form
            form={form}
            onFinish={(value) => {
                let name = value['name'] ?? '';
                let code = value['code'] ?? '';
                let number = value['number'] ?? 0;
                name = name.replaceAll(' ', '%');
                const condition = {
                    name,
                    code,
                    number
                };
                setCondition(condition);
                updateTable(condition, {
                    ...pagination,
                    current: 1
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
                <Col>
                    <Button type="primary" htmlType="submit">
                        搜索
                    </Button>
                </Col>
                <Col>
                    <Button danger onClick={() => initDatabase().then(() => setData([]))}>
                        清空数据
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
                pageSizeOptions: [10, 20, 50, 200, 500]
            }}
            onChange = {((paginationConfig) => {
                setLoading(true);
                updateTable(condition, {
                    ...pagination,
                    ...paginationConfig
                }).then(()=>setLoading(false))
            })}
            loading={loading}
        />
    </div>;
}