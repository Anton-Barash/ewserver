const { client } = require("../../db");

const addMess = async (req, res, fastify) => {

    const { dialog_id, message_text, company } = req.body;
    const { user_id } = req.session.user;

    // console.log(dialog_id, message_text, user_id)
    try {
        const result = await client.query(`
WITH new_message AS (
    INSERT INTO public.tbl_message (dialog_id, user_id, message_text, created_at)
    VALUES (${dialog_id}, ${user_id}, '${message_text}', CURRENT_TIMESTAMP)
    RETURNING *
)
SELECT nm.*, u.first_name, u.last_name
FROM new_message nm
JOIN public.tbl_user u ON nm.user_id = u.user_id;
            
            `); // Выполняем запрос к таблице

        // console.log(result.rows); // Выводим результат запроса
        // io.emit(dialog_id, 'сообщение для' + dialog_id)
        console.log(req.body);
        fastify.emit(`${company.company_name}${company.company_id}`, { dialog_id, newMessage: result.rows })
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы addMess:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.addMess = addMess;

