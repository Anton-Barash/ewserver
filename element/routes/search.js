const { client } = require("../../db");

const search = async (req, res) => {

    const name_1 = req.query.name_1|| ''; // Получение параметра param1 из запроса
    const name_2 = req.query.name_2|| ''; // Получение параметра param2 из запроса

    try {
        const result = await client.query(`SELECT * FROM tbl_dialog WHERE dialog_name ILIKE '%${name_1}%' OR dialog_name_2 ILIKE '%${name_2}%';`); // Выполняем запрос к таблице

       
        // res.send(name_2)
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.search = search;

