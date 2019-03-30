const GoogleSpreadsheet = require('google-spreadsheet')
const { promisify } = require('util')

const credentials = require(`./chatbotkey.json`)

const SPREADSHEET_ID = `1qziEGhuzr-74Nsh4YAYD9mTzl51YyVnHga6No473GCA`;

const parseRow = (row, keys) => {
    if (typeof row === "object") {
        const result = {};
        keys.map(key => {
            result[key] = row[key];
        });
        return result;
    } else {
        return {};
    }
}
async function accessSpreadsheet(product_code) {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID)
    await promisify(doc.useServiceAccountAuth)(credentials)
    const info = await promisify(doc.getInfo)()
    const sheet = info.worksheets[0]
    const rows = await promisify(sheet.getRows)();
    let result = {};
    rows.filter(row => {
        if(row && row["mãhàng"] === product_code) {
            result = parseRow(row, ['nhómhàng', 'mãhàng', 'tênhàng', 'sizecolor', 'giávốn', 'giábán', 'nhập', 'xuất', 'hiệntồn', 'tổngnhập', 'tổngxuất', 'tổngtồn']);
        }
    });
    return result;
}

// For test:
// accessSpreadsheet("AO0001")
//     .then(res => {
//         console.log(res);
//     });

module.exports = accessSpreadsheet;
