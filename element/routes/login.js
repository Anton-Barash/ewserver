const { client } = require("../../db");

const login = async (req, res) => {


    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    try {
        const result = await client.query(`
            SELECT c.company_name, uc.company_id, u.first_name, u.last_name, u.user_id
FROM tbl_user u
JOIN user_company uc ON u.user_id = uc.user_id
JOIN tbl_company c ON uc.company_id = c.company_id
WHERE u.username = '${username}' AND u.password = '${password}';
            
            `); // Выполняем запрос к таблице

        console.log(result.rows); // Выводим результат запроса
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        // console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.login = login;

