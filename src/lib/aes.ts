import CryptoJS from "crypto-js";

const AES_KEY = CryptoJS.enc.Utf8.parse(
  process.env.AES_KEY || "1234567890123456"
);
const IV = CryptoJS.enc.Utf8.parse(process.env.AES_IV || "abcdef9876543210");

export function encryptAES(text: string): string {
  const encrypted = CryptoJS.AES.encrypt(text, AES_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
  return encrypted;
}

export function decryptAES(ciphertext: string): string {
  const decrypted = CryptoJS.AES.decrypt(ciphertext, AES_KEY, {
    iv: IV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString(CryptoJS.enc.Utf8);
  return decrypted;
}
