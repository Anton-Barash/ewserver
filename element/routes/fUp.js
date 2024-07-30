const fs = require('fs');

const fUp = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }

        const fileStream = fs.createReadStream(req.file.path);

        fileStream.on('data', (chunk) => {
            // Обработка данных из потока
            console.log('Received chunk of data:', chunk);
        });

        fileStream.on('end', () => {
            console.log('File data received successfully');
            // Дополнительная обработка файла
            res.send('File uploaded and processed successfully');
        });
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).send('Error processing file');
    }
};

exports.fUp = fUp