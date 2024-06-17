const { client } = require("../../db");

const test = async (req, res) => {

    const dialog_id = req.body.dialog_id;
    try {
        const result = await client.query(''); // Выполняем запрос к таблице

        console.log(result.rows); // Выводим результат запроса
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.test = test;

