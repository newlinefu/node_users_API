const fs = require('fs')
const path = require('path')
const rewriteDB = require('./rewrite-db')

const dataBaseFilePath = path.join(__dirname, '../users_db.json')
const indexPageFilePath = path.join(__dirname, '../', 'pages', 'index.html')

function getUsers(end, writeHead) {
    readFile(
        dataBaseFilePath,
        'text/json',
        writeHead,
        end,
        data => JSON.stringify(JSON.parse(data).usersList)
    )
}

function deleteUser(url, writeHead, end) {

    //Извлечение массива параметров из URL
    const params = url.split('?')[1].split('&')

    //Извлечение значения первого параметра из URL
    const id = params[0].split('=')[1]
    let db = null

    fs.readFile(
        dataBaseFilePath,
        'utf-8',
        (err, data) => {
            if(err) {
                writeHead(500)
                end('Data base input error')
                throw err
            }

            // Получение всех записей из файла базы и фильтрация пользователей

            db = JSON.parse(data)
            db.usersList = db.usersList.filter(user => user.id != id)
            db.actualIndex--

            //Обратная запись всех записей в файл базы
            rewriteDB(JSON.stringify(db), end, writeHead)
        }
    )
}

function goToIndexPage(end, writeHead) {
    readFile(
        indexPageFilePath,
        'text/html',
        writeHead,
        end
    )
}

function readFile(filePath, contentType, writeHead, end, dataHandler = (data) => data) {
    fs.readFile(
        filePath,
        'utf-8',
        (err, data) => {
            if(err) {
                writeHead(400)
                end('Not found')
                throw err
            }

            writeHead(200, {
                'Content-Type': contentType
            })
            end(dataHandler(data))
        }
    )
}

module.exports = {
    getUsers,
    deleteUser,
    goToIndexPage
}