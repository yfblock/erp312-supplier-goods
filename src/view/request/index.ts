import { initDatabase, loadExcel, query, request } from "../ipc";

/**
 * Get a list of suppliers
 * @returns 
 */
export async function getSuppliers() {
    let scm_url = "https://gyl.scm121.com/api/company/mySupplier/queryMySupplier?sort=cdp.APPLY_TIME%20desc%2C%20cdp.DAYS_ORDER_QTY%20desc%2C%20cdp.SHELVES_QTY%20desc&status=2&pageNum=1&pageSize=300";
    const scmHtmlResponse = await request(scm_url);
    return scmHtmlResponse['data'];
}

export async function clearDatabase() {
    await initDatabase();
}

export async function downloadExcel(list: any[], callback: any) {
    console.log('下载excel文件')
    clearDatabase();

    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

    for(let i = 0; i < list.length; i++) {
        let scm_url = "https://gyl.scm121.com/api/goods/buyer/supplier/exportDrpGoodsV2";
        let ret = await request(scm_url, "POST", {
            ascOrDesc: false,
            brandName: "",
            exportType: 0,
            orderByKey: 1,
            skuType: "normal",
            stockEnd: "",
            stockStart: "1",
            supplierCoId: list[i]['coId']
        });

        if(ret['code'] == "0000") {
            let taskId = ret['data']['taskId'];
            let check_url = `https://gyl.scm121.com/api/goods/goods/goDrpGoodsExport/getExportProcess?taskId=${taskId}`;
            
            while(true) {
                let check_ret = await request(check_url);
                console.log(check_ret);
                if(check_ret['data']['isEnd'] == true) {
                    if(check_ret['data']['downloadUrl'] == null) break;
                    // 抓取成功
                    let excelPath = check_ret['data']['downloadUrl'];
        
                    // loadExcel
                    await loadExcel(excelPath, list[i]['coName']);
                    console.log("抓取成功");
        
                    // callback
                    callback(Math.trunc((i + 1) * 100 / list.length))

                    break;
                }
                await sleep(2000);
            }
        }
    }
    console.log('抓取完毕')
}

export async function dbQuery(sql: string) {
    return await query(sql)
}
