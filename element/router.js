const { test } = require('./routes/test');
const { serch } = require('./routes/serch');
const { login } = require('./routes/login');
const { factoryList } = require('./routes/factoryList');
const { addNewFactory } = require('./routes/addNewFactory');
const { addNewItem } = require('./routes/addNewItem');
const { chatList } = require('./routes/chatList');
const { addMess } = require('./routes/addMess');
const { sendMail } = require('./routes/sendMail');
const multer = require('fastify-multer');
const { generatePresignedUrl, fileUpload } = require('./routes/ksw');

// Настройка Multer для обработки multipart/form-data без сохранения на диске
const upload = multer({
    storage: multer.memoryStorage() // Используем память для хранения загружаемых файлов
});



function routes(fastify, options, done) {

    // fastify.addHook('onSend', (request, reply, payload, next) => {
    //     reply.header('Access-Control-Allow-Origin', '*');
    //     next();
    // });

    fastify.addHook('onRequest', async (request, reply) => {
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
    fastify.post('/addMess', async (req, reply) => {
        await addMess(req, reply, fastify.io);
    });


    // Регистрируем multer как плагин
    fastify.register(multer.contentParser); // Это необходимо для обработки multipart/form-data

    // добавить файл
    // Обработка загрузки файлов
    fastify.post('/fileUpload', { preHandler: upload.single('file') }, async (req, reply) => {
        await fileUpload(req, reply, fastify.io)
    });

    //  поулчить ссылку для загрузки файла
    fastify.post('/generatePresignedUrl', generatePresignedUrl)

    //  скачать файл с изменением имени `${company_id}/${dialog_id}/`
    fastify.post('/download/:company_id/:dialog_id/:mess_id/:newFileName', async (request, reply) => {
        try {
            const { newFileName } = request.params;
            const originalUrl = await generatePresignedUrl(request, reply);
            // reply.header('Access-Control-Allow-Origin', 'http://localhost:5173');
            console.log(originalUrl)
            reply.redirect(302, originalUrl).header('Content-Disposition', `attachment; filename="${newFileName}"`);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Ошибка при получении URL');
        }
    });


    fastify.get('/download/:newFileName', async (request, reply) => {
        try {
            console.log('/download/:newFileName')
            const { newFileName } = request.params;
            // const originalUrl = await generatePresignedUrl(request, reply);

            // Устанавливаем нужный заголовок до редиректа
            reply.header('Access-Control-Allow-Origin', 'http://localhost:5173');

            const originalUrl = 'http://ew-ks3-buket.ks3-sgp.ksyuncs.com/1/48/601?KSSAccessKeyId=AKLT6XM36m9LTh2SVvGIZDDS&Expires=1723473034&Signature=%2BP7pISlgYw%2F%2BFnvOS%2FECHItp3SQ%3D';

            // Выполняем редирект после установки заголовков
            reply.redirect(originalUrl, 302).header('Content-Disposition', `attachment; filename="${newFileName}"`);
        } catch (error) {
            console.error(error);
            reply.status(500).send('Ошибка при получении URL');
        }
    })



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


    // отправка письма

    fastify.post('/sendMail', sendMail)

    done();
}

module.exports = routes;