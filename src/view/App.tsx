import React from 'react';
import { createRoot } from 'react-dom/client';
import { request } from './ipc/index';
import './index.css';
import {
    HashRouter,
    Routes,
    Route
} from 'react-router-dom';
import { dbQuery, getSuppliers } from './request';
import Supplier from './supplier';
import Goods from './goods';
import SupplierFranking from './SupplierFranking';
import Input from './input';


declare const window: Window & { 
    ipcRenderer: any,
};

export {};

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript

const TestPage = () => {
    return <>
        <button onClick={async (e) => {
            let value = await request('https://www.erp321.com');
            console.log(value);
        }}>测试</button>
        <button onClick={async (e) => {
            let value = await getSuppliers();
            console.log(value);
        }}>测试同步</button>
        <button onClick={async (e) => {
            // let value = await downloadExcel();
            // console.log(value);
        }}>下载excel</button>
        <button onClick={async (e) => {
            // let value = await downloadExcel();
            // console.log(value);
            let value = await dbQuery('select * from supplier limit 1050, 50');
            console.log(value);
        }}>测试sql</button>
        <button onClick={async (e) => {
            location.href = location.pathname + "#/supplier";
        }}>跳转到供应商界面</button>
        <button onClick={async (e) => {
            console.log(window.ipcRenderer);
        }}>测试 ipc</button>
    </>
}

root.render(<div>
    <HashRouter>
        <Routes>
            <Route path='/' element={<Goods />} />
            <Route path='/supplier' element={<Supplier />} />
            <Route path='/franking' element={<SupplierFranking />} />
            <Route path='/input' element={<Input />} />
            {/* <Route path='/test' element={<TestPage />} /> */}
        </Routes>
    </HashRouter>
</div>);