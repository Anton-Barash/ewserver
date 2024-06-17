const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'password',
    port: 5432,
});

const connectToDatabase = async () => {
    try {
        await client.connect();
        console.log('Подключение к базе данных PostgreSQL установлено');
    } catch (error) {
        console.error('Ошибка подключения к базе данных PostgreSQL:', error);
    }
};

connectToDatabase(); // Устанавливаем соединение с базой данных

exports.client = client