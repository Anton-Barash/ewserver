const { client } = require("../../db");

const addNewItem = async (req, res) => {

    const factory_id = req.body.factory_id;
    const item_name = req.body.item.toLowerCase();
    const company_id = req.body.company_id;
    try {
        const result = await client.query(`
INSERT INTO public.tbl_dialog (factory_id, item_name, company_id)
VALUES (${factory_id}, '${item_name}', ${company_id})
ON CONFLICT (factory_id, item_name, company_id)
DO NOTHING
RETURNING dialog_id;

            `);

        res.send(result.rows[0]); // Отправляем нови dialog_id клијенту
    } catch (error) {
        console.error('Грешка при учитавању података из табеле:', error);
        res.status(500).send('Грешка при учитавању података из табеле');
    }
};

exports.addNewItem = addNewItem;
