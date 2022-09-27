import { initDatabase, loadExcel, query, request } from "../ipc";

/**
 * Get a list of suppliers
 * @returns 
 */
export async function getSuppliers() {
    let url = 'https://www.erp321.com/app/drp/partner/SupplierList.aspx';
    const htmlResponse = await request(url);

    let result = (new DOMParser()).parseFromString(htmlResponse, 'text/html');

    let jsonData = result.querySelector('#_jt_data').innerHTML;
    return JSON.parse(jsonData);
}

export async function clearDatabase() {
    await initDatabase();
}

export async function getGoodsOfSupplier() {
    let url = 'https://www.erp321.com/app/drp/itemsku/LookItemSku.aspx?supplier_id=10040113&_t=1664079406194&_h=615px&_float=true';
    const htmlResponse = await request(url);

    let result = (new DOMParser()).parseFromString(htmlResponse, 'text/html');

    let jsonData = result.querySelector('#_jt_data').innerHTML;
    return JSON.parse(jsonData);
}

export async function getSignsOfSupplier() {
    let url = 'https://www.erp321.com/app/drp/itemsku/LookItemSku.aspx?supplier_id=10040113&_t=1664079406194&_h=615px&_float=true';
    const htmlResponse = await request(url);

    let result = (new DOMParser()).parseFromString(htmlResponse, 'text/html');
    let __VIEWSTATEGENERATOR = result.querySelector('#__VIEWSTATEGENERATOR').getAttribute('value');
    let __VIEWSTATE = result.querySelector('#__VIEWSTATE').getAttribute('value');

    return [__VIEWSTATE, __VIEWSTATEGENERATOR];
}

export async function lookItemSku() {
    let [__VIEWSTATE, __VIEWSTATEGENERATOR] = await getSignsOfSupplier();

    let url = `https://www.erp321.com/app/drp/itemsku/LookItemSku.aspx?supplier_id=10937797&_t=1664080269094&_h=600px&_float=true&ts___=1664080967418&am___=LoadDataToJSON`;
    
    const htmlResponse = await request(url, "POST", {
        __VIEWSTATE: '/wEPDwUKLTE1MTQ4NDg2OGRkDA8bl4CLME9rszQagHP9QXQPfrA=',
        __VIEWSTATEGENERATOR: 'D89AFAF8',
        sku_id: '',
        i_id: '',
        sku_code: '',
        name: '',
        properties_value: '',
        brand: '',
        qty1: '',
        qty2: '',
        sku_type: '',
        haslock: '',
        created: '',
        _jt_page_count_enabled: '',
        _jt_page_size: 500,
        _cbb_brand: '',
        __CALLBACKID: 'JTable1',
        __CALLBACKPARAM: '{"Method":"LoadDataToJSON","Args":["1","[]","{}"]}'
    });

    return JSON.parse(htmlResponse.substring(2))
}

export async function downloadExcel(list: any[], callback: any) {
    console.log('下载excel文件')
    clearDatabase();
    for(let i = 0; i < list.length; i++) {
        let id = list[i]['co_id1'];
        let [__VIEWSTATE, __VIEWSTATEGENERATOR] = await getSignsOfSupplier();

        let url = `https://www.erp321.com/app/drp/itemsku/LookItemSku.aspx?supplier_id=${id}&am___=LoadDataToJSON`;
        
        const obj = {
            k: 'sku_type',
            v: 'normal',
            c: '='
        };

        const htmlResponse = await request(url, "POST", {
            __VIEWSTATE: __VIEWSTATE,
            __VIEWSTATEGENERATOR: __VIEWSTATEGENERATOR,
            sku_id: '',
            i_id: '',
            sku_code: '', 
            name: '',
            properties_value: '',
            brand: '',
            qty1: '',
            qty2: '',
            sku_type: 'normal',
            haslock: '',
            created: '',
            _jt_page_count_enabled: '',
            _jt_page_size: 500,
            _cbb_brand: '',
            __CALLBACKID: 'JTable1',
            __CALLBACKPARAM: JSON.stringify({
                "Method": "SetSearchConditionToCache",
                "Args": [`[${JSON.stringify(obj)}]`],
                "CallControl": "{page}"
            })
        });
        let jsonData = JSON.parse(htmlResponse.substring(2));
    
        // window.open(`https://do.erp321.com/app/drp/itemsku/exportsupplieritemsku.aspx?drplevel=2&SupplierId=10937797&s=${jsonData['ReturnValue']}`);
        let excelPath = `https://do.erp321.com/app/drp/itemsku/exportsupplieritemsku.aspx?drplevel=2&SupplierId=${id}&s=${jsonData['ReturnValue']}`;
        await loadExcel(excelPath, list[i]['supplier_name']);
        callback(Math.trunc((i + 1) * 100 / list.length))
    }
    console.log('抓取完毕')
}

export async function dbQuery(sql: string) {
    return await query(sql)
}
