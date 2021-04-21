import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class LocalService {
    constructor(private storageService: StorageService) { }
    // Set the json data to local storage
    setLocalStorage(key: string, value: any) {
        this.storageService.secureStorage.setItem(key, value);
    }
    // Get the json value from local storage
    getLocalStorage(key: string) {
        return this.storageService.secureStorage.getItem(key);
    }
    // Set the json data to session storage
    setSessionStorage(key: string, value: any) {
        this.storageService.secureSessionStorage.setItem(key, value);
    }
    // Get the json value from session storage
    getSessionStorage(key: string) {
        return this.storageService.secureSessionStorage.getItem(key);
    }
    // Clear the local storage
    clearToken() {
        this.storageService.secureSessionStorage.clear();
        return this.storageService.secureStorage.clear();
    }
}
