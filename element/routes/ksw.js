var KS3 = require('ks3');

const { PassThrough } = require('stream'); // Импортируем PassThrough для создания потока
const { dbClient } = require("../../db");
const contentDisposition = require('content-disposition');

var client = new KS3('AKLT6XM36m9LTh2SVvGIZDDS', 'OMeJvTyvVoNT3niEJxvneotJGKKyK2CJO1gw3XSH', 'ew-ks3-buket', 'SINGAPORE');

const generatePresignedUrl = async (req, res) => {
  const { key } = req.body
  try {
    const data1 = await new Promise((resolve, reject) => {
      client.object.generatePresignedUrl({
        Bucket: 'ew-ks3-buket',
        Key: key
      }, function (rerr, data, response, body) {
        if (data) {
          console.log(data);
          resolve(data);
        } else {
          reject('Файл не найден.');
        }
      });
    });
    // res.setHeader('Content-Disposition', contentDisposition("fileName"));
    res.send(data1);
  } catch (error) {
    console.error(error);
    res.status(404).send('Файл не найден.');
  }

}

const fileUpload = async (req, res, fastify) => {
  try {
    const file = req.file;
    const user_id = req.session.user.user_id;
    const { dialog_id, company_id } = req.body;

    await dbClient.query('BEGIN'); // Начало транзакции

    const newMessageQuery = `
      WITH new_message AS (
        INSERT INTO public.tbl_message (dialog_id, user_id, message_text, created_at, mime_type)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4)
        RETURNING *
      )
      SELECT nm.*, u.first_name, u.last_name
      FROM new_message nm
      JOIN public.tbl_user u ON nm.user_id = u.user_id;
    `;

    const newMessageResult = await dbClient.query(newMessageQuery, [dialog_id, user_id, `${file.originalname}, ${(file.size / 1048576).toFixed(2)}Mb`, file.mimetype]);

    if (newMessageResult.rows.length > 0) {
      const message_id = newMessageResult.rows[0].message_id;

      const stream = new PassThrough();
      stream.end(file.buffer);

      try {
        const uploadResult = await new Promise((resolve, reject) => {
          client.object.put({
            Key: `${company_id}/${dialog_id}/` + message_id,
            Body: stream,
            headers: {
              'Content-Length': `${file.size}`,
              'Content-Disposition': `attachment; filename="${file.originalname}"`
            },
          }, (err, data, response) => {
            if (response && response.statusCode === 200) {
              resolve({ err, data, response });
            } else {
              reject("Ошибка при загрузке файла");
            }
          });
        });

        await dbClient.query('COMMIT'); // Фиксация транзакции
        fastify.emit("addMess" + dialog_id, newMessageResult.rows);
        res.send(uploadResult);
      } catch (uploadError) {
        console.error('Ошибка при загрузке файла:', uploadError);
        await dbClient.query('ROLLBACK'); // Откат транзакции
        res.send("Ошибка при загрузке файла. Транзакция отменена.");
      }
    } else {
      await dbClient.query('ROLLBACK'); // Откат транзакции
      res.send("Ошибка при выполнении SQL запроса. Нет данных для загрузки файла.");
    }
  } catch (error) {
    console.error('Ошибка при выполнении SQL запроса:', error);
    await dbClient.query('ROLLBACK'); // Откат транзакции
    res.send("Ошибка при выполнении SQL запроса. Загрузка файла отменена.");
  }
}



// client.bucket.getBucketCors({
//   Bucket: 'ew-ks3-buket',
// }, function (rerr, data, response, body) {
//   console.log(data)
// })


exports.generatePresignedUrl = generatePresignedUrl
exports.fileUpload = fileUpload