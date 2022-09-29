import sqlite3 from "sqlite3";

const db = new sqlite3.Database('data.sqlite');

export async function deleteDatabase() {
    return new Promise((resolve, reject) => {
        db.all(`DROP TABLE 'supplier'`, (v) => resolve(v));
    })
}

export async function initDatabase() {
    await deleteDatabase();
    return new Promise((resolve, reject) => {
        db.all(`CREATE TABLE IF NOT EXISTS 'supplier' (
            'id' INTEGER PRIMARY KEY AUTOINCREMENT,
            'name' TEXT,
            'code' TEXT,
            'type' TEXT,
            's_price' NUMBER,
            'base_price' NUMBER,
            'number' NUMBER,
            'supplier' TEXT
        )`, (v) => resolve(v));
    })
}

export async function query(sql: string) {
    console.log(sql)
    return new Promise((resolve, reject) => {
        db.all(sql, (e: any, rows) => e ? reject(e) : resolve(rows))
    })
}

export async function execute(sql: string) {
    return new Promise((resolve, reject) => {
        db.exec(sql, (value: any) => resolve(value))
    })
}

export async function exportExcelToDb(data: any[], supplier: string) {
    let inserted = false;
    let basicPriceIndex = -1;
    for(let i = 0; i < data[0].length; i++) {
        if(data[0][i] == '基本售价') {
            basicPriceIndex = i;
        }
    }
    let sql = `insert into 'supplier' ('code', 'name', 'type', 's_price', 'base_price', 'number', 'supplier') VALUES `;
    for(let i = 1; i < data.length; i++) {
        let row = data[i];
        if(!row[5] || row[5] == '无货') continue;
        if(inserted) sql += ',';

        if(basicPriceIndex == -1) {
            sql +=`('${row[1]}', '${row[3]}', '${row[2] ?? ''}', '${row[4]}', 0, '${row[5]}', '${supplier}')`;
        } else {
            if(supplier == "郑州盈晨文化传播有限公司") {
                sql +=`('${row[1]}', "${row[3]}",'${row[2] ?? ''}', '${row[4]}', ${row[8] ?? '""'}, '${row[5]}', '${supplier}')`;
            } else {
                sql +=`('${row[1]}', '${row[3]}','${row[2] ?? ''}', '${row[4]}', ${row[8] ?? '""'}, '${row[5]}', '${supplier}')`;
            }
        }

        inserted = true;
    }
    return await execute(sql).then((value) => {
        console.log(value);
        return value;
    })
}