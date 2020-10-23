import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
const SecureStorage = require('secure-web-storage');
const SECRET_KEY: any = 'secret_key';

@Injectable({ providedIn: 'root' })

export class StorageService {
    constructor() { }

    public secureStorage = new SecureStorage(localStorage, this.setEncrptDecrypt());
    public secureSessionStorage = new SecureStorage(sessionStorage, this.setEncrptDecrypt());

    private setEncrptDecrypt(): any {
        return {
            hash: function hash(key) {
                key = CryptoJS.SHA256(key, SECRET_KEY);
                return key.toString();
            },
            // Encrypt the localstorage/sessionStorage data
            encrypt: function encrypt(data) {
                data = CryptoJS.AES.encrypt(data, SECRET_KEY);
                data = data.toString();
                return data;
            },
            // Decrypt the encrypted data
            decrypt: function decrypt(data) {
                data = CryptoJS.AES.decrypt(data, SECRET_KEY);
                data = data.toString(CryptoJS.enc.Utf8);
                return data;
            }
        };
    }
}
