var KS3 = require('ks3');

const { Readable } = require('stream');
const { PassThrough } = require('stream'); // Импортируем PassThrough для создания потока


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
  const data = await new Promise((resolve, reject) => {
    const file = req.file; // Получаем буфер из файла
    const stream = new PassThrough();
    stream.end(file.buffer); // Передаем буфер файла в поток

    client.object.put({
      // Bucket: 'ew-ks3-buket',

      Key: 'img2/' + file.originalname, // Замените на уникальный ключ объекта
      Body: stream, // Передаем stream файла,
      headers: { 'Content-Length': `${file.size}` },
    }, function (rerr, data, response, body) {
      console.log(response.statusCode)
      resolve(response.statusCode)
    });
  });
  res.send(data)




}






exports.generatePresignedUrl = generatePresignedUrl
exports.fileUpload = fileUpload