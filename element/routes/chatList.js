

const { client } = require("../../db");

const chatList = async (req, res) => {

    const dialog_id = req.body.dialog_id;
    try {
        const result = await client.query(`
            
SELECT tm.message_id, tm.dialog_id, tm.user_id, tm.message_text, tm.created_at, tm.updated_at, tm.is_read, tu.first_name ,tu.last_name 
FROM public.tbl_message tm
JOIN public.tbl_dialog td ON tm.dialog_id = td.dialog_id
JOIN public.tbl_user tu ON tm.user_id = tu.user_id
WHERE tm.dialog_id = ${dialog_id}
ORDER BY tm.message_id;


            `); // Выполняем запрос к таблице


        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.chatList = chatList;

