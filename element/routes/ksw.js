var KS3 = require('ks3');

const { Readable } = require('stream');
const multer = require('multer');

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

const fileUpload = async (req, res) => {
  console.log(req.file);
  try {
    const fileBuffer = req.file.buffer; // Получаем буфер из файла

    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    const data = await new Promise((resolve, reject) => {
      // const contentLength = fileBuffer.length; // Получаем длину буфера

      client.object.put({
        Bucket: 'ew-ks3-buket',
        Key: 'uniqueObjectKey', // Замените на уникальный ключ объекта
        Body: fileStream, // Передаем stream файла
        ContentLength: '8787878787' // Устанавливаем Content-Length
      }, function (rerr, data, response, body) {
        if (data) {
          console.log(data);
          resolve(data);
        } else {
          reject(rerr);
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Ошибка загрузки файла.');
  }
}






exports.generatePresignedUrl = generatePresignedUrl
exports.fileUpload = fileUpload