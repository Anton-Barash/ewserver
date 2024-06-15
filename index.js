const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { Client } = require('pg');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Подключение к базе данных PostgreSQL
const client = new Client({
    user: 'your_username',
    host: 'localhost',
    database: 'your_database_name',
    password: 'your_password',
    port: 5432,
});
client.connect()
    .then(() => console.log('Подключение к базе данных PostgreSQL установлено'))
    .catch(err => console.error('Ошибка подключения к базе данных PostgreSQL:', err));

io.on('connection', (socket) => {
    console.log('Пользователь подключился');

    socket.on('message', (data) => {
        console.log('Получено сообщение: ' + data);
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});

