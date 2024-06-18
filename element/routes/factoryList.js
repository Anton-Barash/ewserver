

const { client } = require("../../db");

const factoryList = async (req, res) => {

    const company_id = req.body.company_id;
    const user_id = req.body.user_id;

    try {
        const result = await client.query(`
            SELECT f.factory_name, f.factory_id
FROM public.tbl_dialog_participants dp
JOIN public.tbl_dialog d ON dp.dialog_id = d.dialog_id
JOIN public.tbl_factory f ON d.factory_id = f.factory_id
WHERE dp.user_id = ${user_id}
AND dp.company_id = ${company_id};

            
            `); // Выполняем запрос к таблице

        console.log(result.rows); // Выводим результат запроса
        res.send(result.rows); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.factoryList = factoryList;
