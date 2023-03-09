
declare const window: Window & { 
    ipcRenderer: any,
};

const ipcRenderer = window.ipcRenderer;

export const request = (url: string, method = "GET", data = {}) => {
    return ipcRenderer.invoke('request', [url, method, data])
}

export const loadExcel = (url: string, supplier: string) => {
    return ipcRenderer.invoke('loadExcel', [url, supplier]);
}

// export const query = (sql: string) => window.API.query(sql)
export const query = (sql: string) => {
    return ipcRenderer.invoke('query', [sql]);
}

export const execute = (sql: string) => {
    return ipcRenderer.invoke('execute', [sql]);
}

export const initDatabase = () => {
    return ipcRenderer.invoke('initDatabase');
}

export const sendPassword = (password: string) => ipcRenderer.invoke('sendPassword', [password]);