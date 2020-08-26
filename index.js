const http = require('http')

const handlerGET = require('./lib/scripts/get-handler')
const handlerPOST = require('./lib/scripts/post-handler')

const INDEX_PATH = '/'
const USERS_PATH = '/users'
const USERS_DELETE = '/users/delete'
const USERS_ADD = '/users/put'
const USERS_CHANGE = '/users/change'


const server = http.createServer((req, res) => {

    //Обработка GET запросов

    if (req.method === 'GET') {

        //Удаление пользователя по параметру id
        if (req.url.includes(USERS_DELETE)) {

            handlerGET.deleteUser(req.url, res.writeHead.bind(res), res.end.bind(res))

        //Получение всех пользователей
        } else if (req.url.includes(USERS_PATH)) {

            handlerGET.getUsers(res.end.bind(res), res.writeHead.bind(res))

        // Получение корневой страницы
        } else if (req.url.includes(INDEX_PATH)) {

            handlerGET.goToIndexPage(res.end.bind(res), res.writeHead.bind(res))

        }
    } else if (req.method === 'POST') {

        //Добавление нового пользователя
        if(req.url === USERS_ADD) {

           handlerPOST.putUser(req.on.bind(req), res.end.bind(res), res.writeHead.bind(res))

        //Изменение пользователя
        } else if(req.url === USERS_CHANGE) {

            handlerPOST.changeUser(req.on.bind(req), res.end.bind(res), res.writeHead.bind(res))

        }
    }
})

server.listen(3030)