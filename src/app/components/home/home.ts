import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { ContactService } from '../../services/contact-service';
import { Contact } from '../../interfaces/contact';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'idb-home',
  imports: [MatListModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  readonly #apiService = inject(ApiService);
  readonly #contactsService = inject(ContactService);

  readonly #contacts = signal<Contact[]>([]);
  readonly contacts = this.#contacts.asReadonly();

  ngOnInit(): void {
    this.#apiService.openDB((db) => {
      this.#contactsService.getContacts(db, (contacts) => this.#renderContacts(contacts));
      return db;
    });
  }

  /** Render contacts */
  #renderContacts(contacts: Contact[]): void {
    contacts.map((contact) => {
      if (contact.id) {
        const { id, ...rest } = contact;
        this.#contacts.update((contacts) => [...contacts, rest]);
      }
    });
  }
}
