var AES = require("crypto-js/aes");
var CryptoJS = require("crypto-js");

// Пример объекта для шифрования
const originalObject = { key1: 'value1', key2: 'value2' };
console.log('Исходный объект:');
console.log(originalObject);

// Преобразование объекта в JSON строку
const jsonString = JSON.stringify(originalObject);

// Шифрование JSON строки
const key = CryptoJS.enc.Utf8.parse('ключ');
const iv = CryptoJS.enc.Utf8.parse('вектор инициализации');
let encrypted = CryptoJS.AES.encrypt(jsonString, key, { iv: iv }).toString();
console.log('Зашифрованная строка:');
console.log(encrypted); 

code = 'U2FsdGVkX19zvNSmT7hWCCFSY1Yjq+PaqzXn49HdM9lQLdlSgF0ZMj9daXjVpCcVZvVivKeacumE7tVE4qagHbkCDL5lZHUQqp3UTK5PVddVGl7cHgsrFeewdgR/EJrRUhVRO+wdMqA9TiBkooHF53UPhYk5KFqP/wzxnkwRTiw='

// Дешифрование и преобразование обратно в объект
function decryptObject(encryptedObject, secret) { 
    const decrypted = CryptoJS.AES.decrypt(encryptedObject, secret).toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted);
}

const obj = decryptObject(code, 'secretPassword');
    console.log(obj);