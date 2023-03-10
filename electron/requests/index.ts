import axios from "axios"
import xlsx from "node-xlsx";
import { exportExcelToDb } from '../db';

export const downloadFile = async (url: string, supplier: string) => {
    console.log(`Downloading ${url}`);
    let { data } = await axios.get(url, {
        responseType: 'arraybuffer'
    });
    // await promises.writeFile('origin.xlsx', data, 'binary');  

    // const workSheetsFromFile = xlsx.parse(`origin.xlsx`);
    console.log(data);
    const workSheetsFromFile = xlsx.parse(data);
    return await exportExcelToDb(workSheetsFromFile[0].data, supplier)
}