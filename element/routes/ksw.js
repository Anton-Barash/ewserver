var KS3 = require('ks3');

const { Readable } = require('stream');
const { PassThrough } = require('stream'); // Импортируем PassThrough для создания потока
const { dbClient } = require("../../db");

var client = new KS3('AKLT6XM36m9LTh2SVvGIZDDS', 'OMeJvTyvVoNT3niEJxvneotJGKKyK2CJO1gw3XSH', 'ew-ks3-buket', 'SINGAPORE');

const generatePresignedUrl = async (req, res) => {
  try {
    const data1 = await new Promise((resolve, reject) => {
      client.object.generatePresignedUrl({
        Bucket: 'ew-ks3-buket',
        Key: 'WhatsApp Image 2024-06-19 at 11.50.21.jpeg'
      }, function (rerr, data, response, body) {
        if (data) {
          console.log(data);
          resolve(data);
        } else {
          reject('Файл не найден.');
        }
      });
    });


    res.send(data1);
  } catch (error) {
    console.error(error);
    res.status(404).send('Файл не найден.');
  }

}

const fileUpload = async (req, res, fastify) => {
  const data = await new Promise((resolve, reject) => {
    const file = req.file; // Получаем буфер из файла
    const user_id = req.session.user.user_id;
    const { dialog_id, company_id } = req.body;

    const stream = new PassThrough();
    stream.end(file.buffer); // Передаем буфер файла в поток

    client.object.put({
      Key: ` ${company_id}/${dialog_id}/` + file.originalname, // Замените на уникальный ключ объекта
      Body: stream, // Передаем stream файла,
      headers: { 'Content-Length': `${file.size}` },
    }, async function (rerr, data, response, body) {
      console.log(response.statusCode)

      if (response.statusCode === 200) {

        try {
          const result = await dbClient.query(`
WITH new_message AS (
INSERT INTO public.tbl_message (dialog_id, user_id, message_text, created_at, mime_type)
VALUES (${dialog_id}, ${user_id}, '${file.originalname}', CURRENT_TIMESTAMP, '${file.mimetype}')
RETURNING *
)
SELECT nm.*, u.first_name, u.last_name
FROM new_message nm
JOIN public.tbl_user u ON nm.user_id = u.user_id;
        
        `); // Выполняем запрос к таблице


          // io.emit(dialog_id, 'сообщение для' + dialog_id)
          console.log("addMess" + dialog_id)
          fastify.emit("addMess" + dialog_id, result.rows)
          res.send(result.rows); // Отправляем данные клиенту
        } catch (error) {
          console.error('Ошибка при получении данных из таблицы:', error);
          res.status(500).send('Ошибка при получении данных из таблицы');
        }

      }

      else resolve(response.statusCode)
    });
  });
  res.send(data)
}


exports.generatePresignedUrl = generatePresignedUrl
exports.fileUpload = fileUpload