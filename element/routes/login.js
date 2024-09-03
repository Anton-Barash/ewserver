const { client } = require("../../db");

const login = async (req, res, fastify) => {


    const { username, password } = req.body;

    try {
        const result = await client.query(`
SELECT c.company_name, uc.company_id, u.first_name, u.last_name, u.user_id
FROM tbl_user u
LEFT JOIN tbl_user_company uc ON u.user_id = uc.user_id
left JOIN tbl_company c ON uc.company_id = c.company_id
WHERE u.username = '${username}' AND u.password = '${password}';
            
            `); // Выполняем запрос к таблице
        if (result.rows.length > 0) {
            const companys = result.rows.map(
                (company) => {
                    return ({ company_name: company.company_name, company_id: company.company_id })
                }
            )
            req.session.user = { user_id: result.rows[0].user_id, username, ...companys };

            // req.socket.io.emit('hello', 'hello')
            // console.log(fastify.emit('hello', 'жопа'))
            res.send(companys) // Отправляем данные клиенту
        }
        else {

            res.status(500).send({ message: 'Неверные учетные данные' });
        }


    } catch (error) {
        // console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.login = login;

