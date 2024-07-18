var KS3 = require('ks3');

var client = new KS3('AKLT6XM36m9LTh2SVvGIZDDS', 'OMeJvTyvVoNT3niEJxvneotJGKKyK2CJO1gw3XSH', 'ew-ks3-buket', 'SINGAPORE');

const ksw = async (req, res) => {
  try {
    const data1 = await new Promise((resolve, reject) => {
      client.object.generatePresignedUrl({
        Bucket: 'ew-ks3-buket',
        Key: 'WhatsApp Image 2024-06-19 at 11.50.21.jpeg'
      }, function (rerr, data, response, body) {
        if (data) {
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

exports.ksw = ksw;