const { client } = require("../../db");

const addMess = async (req, res, fastify) => {

    const dialog_id = req.body.dialog_id;
    const user_id = req.session.user.user_id;
    const message_text = req.body.message_text;
   
    try {
        const result = await client.query(`
WITH new_message AS (
    INSERT INTO public.tbl_message (dialog_id, user_id, message_text, created_at)
    VALUES (${dialog_id}, ${user_id}, '${message_text}', CURRENT_DATE)
    RETURNING *
)
SELECT nm.*, u.first_name, u.last_name
FROM new_message nm
JOIN public.tbl_user u ON nm.user_id = u.user_id;
            
            `); // Выполняем запрос к таблице

        console.log(result.rows); // Выводим результат запроса
        // io.emit(dialog_id, 'сообщение для' + dialog_id)
        fastify.emit("addMess" + dialog_id, result.rows)
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.addMess = addMess;

