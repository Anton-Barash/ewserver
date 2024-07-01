const { test } = require('./routes/test');
const { serch } = require('./routes/serch');
const { login } = require('./routes/login');
const { factoryList } = require('./routes/factoryList');
const { addNewFactory } = require('./routes/addNewFactory');
const { addNewItem } = require('./routes/addNewItem');
const { chatList } = require('./routes/chatList');
const { addMess } = require('./routes/addMess');



function routes(fastify, options, done) {


    fastify.addHook('onRequest', async (request, reply) => {
        console.log('This is a hook before processing requests for /api');
        if (!request.session.user) {
            return reply.status(401).send({ error: 'Unauthorized' });
        }
    });


    // вход
    fastify.post('/login', login);
    // поиск диалога
    fastify.post('/serch', serch);
    //  список всех фабрик для этого пльзовтеля и его компании
    fastify.post('/factoryList', factoryList);
    // добавить новую фабрику
    fastify.post('/addNewFactory', addNewFactory);
    // добавляем изделие
    fastify.post('/addNewItem', addNewItem);
    // получим чат
    fastify.post('/chatList', chatList);
    // добавить запись
    fastify.post('/addMess', addMess);
    //  выход
    fastify.get('/exit', async (request, reply) => {
        request.session.destroy((err) => {
            if (err) {
                console.error('Ошибка при завершении сессии:', err);
            } else {
                console.log('Сессия завершена успешно.');
            }
        })
    })


    done();
}

module.exports = routes;