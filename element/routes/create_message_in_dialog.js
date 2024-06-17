

const { client } = require("../../db");

const create_message_in_dialog = async (req, res) => {
    console.log(req.body)
    const dialog_id = req.body.dialog_id;
    const user_id = req.body.user_id;
    const message_text = req.body.message_text;

    try {
        const result = await client.query(`
            INSERT INTO tbl_message (dialog_id, user_id, message_text, created_at)
VALUES (${dialog_id}, ${user_id}, '${message_text}', CURRENT_TIMESTAMP);            
            `); // Выполняем запрос к таблице


        // res.send(name_2)
        res.send(result); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.create_message_in_dialog = create_message_in_dialog;

