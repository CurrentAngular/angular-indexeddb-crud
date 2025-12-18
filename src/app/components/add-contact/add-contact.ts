import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api-service';
import { ContactService } from '../../services/contact-service';
import { Contact } from '../../interfaces/contact';

@Component({
  selector: 'idb-add-contact',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './add-contact.html',
  styleUrl: './add-contact.scss',
})
export class AddContact {
  readonly #api = inject(ApiService);
  readonly #contacts = inject(ContactService);
  readonly #fb = inject(FormBuilder);

  // TODO: Replace by signal form
  readonly form = this.#fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  /** Add contact */
  addContact(): void {
    if (this.form.valid) {
      const { name, email } = this.form.value;

      if (name && email) {
        const contact: Contact = { name, email };
        this.#api.openDB((db) => {
          this.#contacts.addContact(db, contact, (contact) => {
            console.log(contact);
            this.form.reset();
            this.form.updateValueAndValidity({ onlySelf: true });
          });
          return db;
        });
      }
    }
  }
}
