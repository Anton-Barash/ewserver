const { Client } = require('pg');

const client = new Client({
    user: 'bortyk',
    host: '110.43.34.250',
    database: 'ewdb',
    password: 'afe35&%4tvgsFEvgdsfg',
    port: 17828,
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
exports.dbClient = client