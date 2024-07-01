const { client } = require("../../db");

const addMess = async (req, res) => {

    const dialog_id = req.body.dialog_id;
    const user_id = req.session.user.user_id;
    const message_text = req.body.message_text;
    const created_at = Date.now()
    console.log(created_at);
    console.log(req.body);
    try {
        const result = await client.query(`
            
INSERT INTO public.tbl_message (dialog_id, user_id, message_text, created_at)
VALUES (${dialog_id}, ${user_id}, '${message_text}', CURRENT_DATE);

            
            `); // Выполняем запрос к таблице

        console.log(result.rows); // Выводим результат запроса
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.addMess = addMess;

