import { ipcRenderer } from 'electron';
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
// root.render(<div>
//     <button onClick={async (e) => {
//         let value = ipcRenderer.invoke('test1');
//         console.log(value)
//     }}></button>
// </div>);

declare const window: Window & { 
    API: any
};

root.render(<div>
    <button onClick={async (e) => {
        console.log(window.API)
        let value = await window.API.test1();
        console.log(value);
    }}>测试</button>
</div>);