import { app, Menu } from "electron"
import { Global } from "./global"

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;

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
          click: () => Global.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY),
          label: '首页'
        },
        {
          click: () => app.quit(),
          label: '退出',
        }
      ]
    },
    {
      label: '页面',
      submenu: [
        {
          click: () => Global.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY),
          label: '主页',
        },
        {
          click: () => Global.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY + '#/supplier'),
          label: '供应商',
        },
        {
          click: () => Global.mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY + '#/test'),
          label: '其他页',
        },
      ]
    }
  ])
  Menu.setApplicationMenu(menu)
}