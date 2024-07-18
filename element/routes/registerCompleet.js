const CryptoJS = require("crypto-js");
const { client } = require("../../db");

// Функция для расшифровки объекта
function decryptObject(encryptedObject, secret) {
    const decrypted = CryptoJS.AES.decrypt(encryptedObject, secret).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
}

const registerCompleet = async (req, res) => {
    const { code } = req.body;

    const obj = decryptObject(code, 'secretPassword');
    console.log(obj);
    const { mail, user, password, expires } = obj;
    const validation = expires - Date.now();
    console.log(validation);

    if (validation < 0) {
        res.send('срок действия прошел');
    } else {
        const sql = `INSERT INTO public.tbl_user (first_name, username, "password", email, created_at)
        VALUES ('${user}', '${user}', '${password}', '${mail}', CURRENT_TIMESTAMP);`;

        try {
            const result = await client.query(sql);
            res.status(201).send(result);
        } catch (error) {
            if (error.code === '23505') {
                console.log(error);
                res.status(400).send({ error: "—Пользователь с такой почтой уже зарегистрирован. Значит я могу войти используя свой логин и пароль. Помню ли я его? Ладно, пароль можно восстановить.  В любом случае я могу использовать другую почту для регистрации.  " });
            } else {
                // Другие обработчики ошибок
                console.log(error);
                res.status(500).send({ error: "Произошла ошибка. Пожалуйста, попробуйте снова." });
            }
        }
        res.send('хорошо');
    }
}

exports.registerCompleet = registerCompleet;
