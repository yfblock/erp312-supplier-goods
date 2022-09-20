import { app, Menu } from "electron"
import { Global } from "./global"

export function initMenu() {
    // set the menu of main window
  const menu = Menu.buildFromTemplate([
    {
      label: '设置',
      submenu: [
        {
          click: () => Global.mainWindow.loadURL('https://www.erp321.com/login.aspx'),
          label: '登录',
        },
        {
          click: () => app.quit(),
          label: '退出',
        }
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
}