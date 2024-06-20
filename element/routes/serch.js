const { client } = require("../../db");

const serch = async (req, res) => {

    const factory_name = req.body.factory_name.toLowerCase() || ''; // Получение параметра param1 из запроса
    const item_name = req.body.item_name.toLowerCase() || ''; // Получение параметра param2 из запроса
    const user_id = req.body.user_id
    const company_id = req.body.company_id

    console.log(factory_name);
    try {
        const result = await client.query(`
            
SELECT *
FROM public.tbl_dialog AS d
JOIN public.tbl_factory AS f ON d.factory_id = f.factory_id
WHERE d.company_id =${company_id}
AND d.item_name LIKE '%${item_name}%'
AND f.factory_name LIKE '%${factory_name}%';

            
            `); // Выполняем запрос к таблице


        // res.send(name_2)
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.serch = serch;

