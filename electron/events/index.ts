import axios from "axios";
import { ipcMain } from "electron";
import { initDatabase, query, execute } from "../db";
import qs from "qs";
import { Global } from "../global";
import { downloadFile } from '../requests';
import { checkAuth } from '../auth';

axios.interceptors.request.use(config => {
    config.headers['authorization'] = Global.cookie;
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    // config.data = qs.stringify(config.data);
    return config;
})


/**
 * Send a request
 * @param args First param is url
 */
ipcMain.handle('request', async (e, args) => {
    if(args[1] == 'GET') {
        let value = await axios.get(args[0]);
        return value.data;
    } else {
        let value = await axios.post(args[0], args[2]);
        return value.data;
    }
})

ipcMain.handle('loadExcel', async (e, args) => {
    return await downloadFile(args[0], args[1])
})

ipcMain.handle('query', async (e, args) => {
    console.log('query')
    return await query(args[0]);
})

ipcMain.handle('execute', async (e, args) => {
    return await execute(args[0]);
});

ipcMain.handle('initDatabase', async (e, args) => {
    return await initDatabase();
})

ipcMain.handle('sendPassword', async (e, args) => {
    return checkAuth(args[0]);
})