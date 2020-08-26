const path = require('path')
const fs = require('fs')

function rewriteDB(newData, end, writeHead) {
    fs.writeFile(
        path.join(__dirname, '../users_db.json'),
        newData,
        err => {
            if(err) {
                writeHead(500)
                end('Data base error')
                throw err
            }
            writeHead(200)
            end('OK')
        }
    )
}

module.exports = rewriteDB