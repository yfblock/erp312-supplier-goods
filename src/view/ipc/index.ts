
declare const window: Window & { 
    API: any,
};

export const request = (url: string, method = "GET", data = {}) => window.API.request(url, method, data)

export const loadExcel = (url: string, supplier: string) => window.API.loadExcel(url, supplier)

export const query = (sql: string) => window.API.query(sql)

export const initDatabase = () => window.API.initDatabase();