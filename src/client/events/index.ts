import { dialog, ipcMain } from "electron";

ipcMain.handle('test1', async (e) => {
    return 'hello world!';
})