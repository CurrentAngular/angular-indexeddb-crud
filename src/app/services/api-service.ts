import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  /** Open DB */
  openDB(cb: (db: IDBDatabase) => IDBDatabase): void {
    const request = window.indexedDB.open('contacts');

    request.addEventListener('upgradeneeded', () => {
      const db = request.result;
      db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
    });

    /**  */
    request.addEventListener('success', () => {
      const db = request.result;
      cb(db);
    });

    /** */
    request.addEventListener('error', () => {
      console.error('IndexedDB error', request.error);
    });
  }
}
