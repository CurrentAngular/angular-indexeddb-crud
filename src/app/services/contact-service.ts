import { inject, Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  readonly #snackBar = inject(MatSnackBar);

  /** Add contact */
  addContact(db: IDBDatabase, contact: Contact, cb: (contact: Contact) => void): void {
    const request = db.transaction(['contacts'], 'readwrite').objectStore('contacts').add(contact);

    request.onsuccess = () => {
      cb(contact);
    };

    request.onerror = () => {
      console.error('IndexedDB error', request.error);
    };
  }

  /** Get contacts */
  getContacts(db: IDBDatabase, cb: (contacts: Contact[]) => void): void {
    const request = db.transaction(['contacts'], 'readonly').objectStore('contacts').getAll();

    request.onsuccess = () => {
      cb(request.result);
    };

    request.onerror = () => {
      console.error('IndexedDB error', request.error);
    };
  }

  /** Delete contact */
  deleteContact(db: IDBDatabase, name: string, cb: (contact: Contact) => void): void {
    // Получаем все контакты для поиска нужного по имени
    const getAllRequest = db.transaction(['contacts'], 'readonly').objectStore('contacts').getAll();

    // Получение контактов закончилось успешно
    getAllRequest.onsuccess = () => {
      // Забираем контакты
      const contacts = getAllRequest.result as Contact[];

      // Ищем нужный контакт
      const contactToDelete = contacts.find((c) => c.name === name);

      // Удаляем контакт - если он найден
      if (contactToDelete && contactToDelete.id) {
        const deleteRequest = db
          .transaction(['contacts'], 'readwrite')
          .objectStore('contacts')
          .delete(contactToDelete.id);

        // Удаление контакта закончилось успешно
        deleteRequest.onsuccess = () => {
          cb(contactToDelete);
        };

        // Удаление контакта закончилось с ошибкой
        deleteRequest.onerror = () => {
          this.#snackBar.open(
            `Удаление контакта закончилось с ошибкой ${deleteRequest.error}!`,
            'Close',
            {
              duration: 3000,
            },
          );
        };
      } else {
        // Контакт не найден
        this.#snackBar.open(`User with name ${name} not found!`, 'Close', { duration: 3000 });
      }
    };

    // Получение контактов закончилось с ошибкой
    getAllRequest.onerror = () => {
      this.#snackBar.open(
        `Получение контактов закончилось с ошибкой ${getAllRequest.error}!`,
        'Close',
        { duration: 3000 },
      );
    };
  }
}
