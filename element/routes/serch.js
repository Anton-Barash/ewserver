const { client } = require("../../db");

const serch = async (req, res) => {

    const name_1 = req.body.name_1 || ''; // Получение параметра param1 из запроса
    const name_2 = req.body.name_2 || ''; // Получение параметра param2 из запроса
    const user_id = 2
    const company_id = 1

    console.log(name_1);
    try {
        const result = await client.query(`
            
SELECT dp.user_id, dp.company_id, d.dialog_id, d.dialog_name, d.dialog_name_2 
FROM public.tbl_dialog_participants dp
JOIN public.tbl_dialog d ON dp.dialog_id = d.dialog_id
WHERE (d.dialog_name ILIKE '%${name_1}%' and d.dialog_name_2 ILIKE '%${name_2}%')
AND (dp.user_id = 2 OR dp.company_id = 1);
            
            `); // Выполняем запрос к таблице


        // res.send(name_2)
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.serch = serch;

