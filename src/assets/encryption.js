import CryptoJS from 'crypto-js'
import axios from 'axios'
import store from '../store'
const iv = "sinasinasisinaaa";
const apiKey = "123xxxyyzzz";

function Encryption(text) {
    var key = store.state.encryptionKey;
    const cipher = CryptoJS.AES.encrypt(text,key);
    return cipher.toString(); 
}
function Decryption(text){
    var key = store.state.encryptionKey;
    const decipher = CryptoJS.AES.decrypt(text,key).toString(CryptoJS.enc.Utf8);
    return decipher;
}
export {Encryption, Decryption}