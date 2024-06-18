


const { client } = require("../../db");

const test = async (req, res) => {

    const factory_name = req.body.factory_name;
    const company_id = req.body.company_id;
    const factory_description = req.body.factory_description;

    try {
        const result = await client.query(`
            INSERT INTO public.tbl_factory (factory_name, factory_description, company_id)
VALUES ('${factory_name}', '${factory_description}', '${company_id}');            
            `); // Выполняем запрос к таблице

        console.log(result.rows); // Выводим результат запроса
        res.send(result); // Отправляем данные клиенту
    } catch (error) {
        console.error('Ошибка при получении данных из таблицы:', error);
        res.status(500).send('Ошибка при получении данных из таблицы');
    }
};

exports.test = test;

