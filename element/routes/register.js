const AES = require("crypto-js/aes");


function encryptObject(obj, secret, expirationTime) {
    obj.expires = Date.now() + expirationTime; // Добавление времени действия

    const encrypted = AES.encrypt(JSON.stringify(obj), secret).toString();
    return encrypted;
}

const register = async (req, res) => {
    console.log(req.body);
    const { mail, user, password } = req.body;

    // Шифрование объекта с временем действия
    const obj = { mail, user, password };
    const secret = "secretPassword"; // Пароль для шифрования
    const expirationTime = 3600000; // Время действия в миллисекундах (например, 1 час)
    const encryptedObject = encryptObject(obj, secret, expirationTime);

    console.log("Зашифрованный объект:", encryptedObject);
    console.log(mail);
    req.body.text = encryptedObject;
}

exports.register = register;
