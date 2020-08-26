const path = require('path')
const fs = require('fs')
const rewriteDB = require('./rewrite-db')
const dataBaseFilePath = path.join(__dirname, '../users_db.json')

function changeUser(reqOn, end, writeHead) {
    POSTHandlerDecorator(
        reqOn,
        end,
        writeHead,
        (db, data) => {
            const newUserData = JSON.parse(data)
            return {
                ...db,
                usersList: db.usersList.map(user => {
                    return user.id === +newUserData.id ? {...newUserData.user, id: +newUserData.id} : user
                })
            }
        }
    )
}

function putUser(reqOn, end, writeHead) {
    POSTHandlerDecorator(
        reqOn,
        end,
        writeHead,
        (db, data) => ({
            actualIndex: db.actualIndex + 1,
            usersList: [
                ...db.usersList,
                {
                    ...JSON.parse(data),
                    id: db.actualIndex
                }
            ]
        })
    )
}

function POSTHandlerDecorator(reqOn, end, writeHead, callback) {
    const body = []
    let db

    reqOn('data', data => {
        body.push(Buffer.from(data))
    })
    reqOn('end', () => {
        body[0] = body[0].toString()
    })

    fs.readFile(
        dataBaseFilePath,
        'utf-8',
        (err, data) => {
            if (err) {
                writeHead(400)
                end('false')
                throw err
            }

            db = JSON.parse(data)
            db = callback(db, body[0])

            rewriteDB(JSON.stringify(db), end, writeHead)
        }
    )
}

module.exports = {
    changeUser,
    putUser
}