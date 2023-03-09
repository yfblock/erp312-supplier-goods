// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron')

// contextBridge.exposeInMainWorld('API', {
//   request: (url: string, method = "GET", data = {}) => {
//     return ipcRenderer.invoke('request', [url, method, data]);
//   },
//   loadExcel: (url: string, supplier: string) => {
//     return ipcRenderer.invoke('loadExcel', [url, supplier]);
//   },
//   query: (sql: string) => {
//     return ipcRenderer.invoke('query', [sql]);
//   },
//   execute: (sql: string) => {
//     return ipcRenderer.invoke('execute', [sql]);
//   },
//   initDatabase: () => {
//     return ipcRenderer.invoke('initDatabase');
//   },
//   ipcRenderer: ipcRenderer
// })

declare const window: Window & { 
  ipcRenderer: any,
};

window.ipcRenderer = ipcRenderer;

export {};
