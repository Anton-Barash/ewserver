const nodemailer = require('nodemailer');

const sendMail = async (req, res) => {
    // Создаем транспорт для отправки писем
    let transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 587,
        secure: false, // use false for STARTTLS; true for SSL on port 465
        auth: {
            user: '786258001@smtp-brevo.com',
            pass: 'ah7qd9NG2RxSfwI3'
        }
    });

    // Настройки письма
    let mailOptions = {
        from: 'anton@focusqc.com',
        to: 'anton@focusqc.com',
        subject: 'Тема письма',
        text: 'Текст письма'
    };

    try {
        // Отправляем письмо
        let info = await transporter.sendMail(mailOptions);
        res.send('Email отправлен: ' + info.response);
    } catch (error) {
        console.error('Ошибка при отправке письма:', error);
        res.status(500).send('Ошибка при отправке письма');
    }
}

exports.sendMail = sendMail;
