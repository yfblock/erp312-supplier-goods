import { machineIdSync } from "node-machine-id";
import { readFileSync, writeFileSync } from "original-fs";

// 检查管理员密码是否正确
export function checkAuth(password: string): boolean {
    if(password == "7792tnjkl77") {
        writeFileSync('id', machineIdSync());
        return true;
    }
    return false;
}

// 检查是否进行了身份认证
export function checkIdentity(): boolean {
    let id = machineIdSync();
    try {
        let fileContent = readFileSync('id');
        if(fileContent.toString('utf8') == id) {
            return true;
        }
        return false;
    } catch(e) {
        return false;
    }
}