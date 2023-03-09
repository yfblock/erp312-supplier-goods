import React from "react";
import { execute, query } from "./ipc";

/**
 * 运费设置页面
 */
export default class App extends React.Component {

  /**
   * 构造函数
   */
  constructor(props: any) {
    super(props);
  }

  /**
   * 组件挂载后执行
   * 检测表是否创建 -> 初始化表格数据
   */
  async componentDidMount() {
    // 如果没有 franking 表，就创建
    await execute(`CREATE TABLE IF NOT EXISTS 'franking' (
      'name' TEXT PRIMARY KEY,
      'franking' NUMBER
    )`);

    // 测试插入数据
    // let insert_res = await execute('insert into `franking`(`name`, `franking`) values ("123", 3.3)');
    // console.log(insert_res);
    let res = await query('select * from franking');
    console.log(res);

    // 视图查找 完成第一个版本
    // 速度蛮快的
    let view_res = await query('select supplier.*, (supplier.s_price + coalesce(franking.franking, 0)) as franking, franking.name from supplier LEFT JOIN franking on supplier.supplier = franking.name limit 10');
    console.log(view_res);
    // let res = await query(`select * from supplier limit 10`);
    // console.log(res);
  }

  /**
   * 渲染函数，渲染页面布局
   */
  render(): React.ReactNode {
    return <>

    </>;
  }
}