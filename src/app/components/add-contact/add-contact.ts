import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api-service';
import { ContactService } from '../../services/contact-service';
import {
  apply,
  email,
  Field,
  form,
  minLength,
  required,
  schema,
  submit,
} from '@angular/forms/signals';
import { ContactModel } from '../../models/contact-model';

export interface AddContactInterface {
  readonly name: string;
  readonly email: string;
}

export const nameSchema = schema<string>((control) => {
  required(control, { message: 'The field is required' });
  minLength(control, 3, { message: 'This field must have 3 symbols length' });
});

export const emailSchema = schema<string>((control) => {
  required(control, { message: 'The field is required' });
  email(control, { message: 'This field must be email pattern' });
});

@Component({
  selector: 'idb-add-contact',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, Field],
  templateUrl: './add-contact.html',
  styleUrl: './add-contact.scss',
})
export class AddContact {
  readonly #api = inject(ApiService);
  readonly #contacts = inject(ContactService);

  readonly #formModel = signal<AddContactInterface>({
    name: '',
    email: '',
  });

  readonly form = form(this.#formModel, (fieldPath) => {
    apply(fieldPath.name, nameSchema);
    apply(fieldPath.email, emailSchema);
  });

  /** Add contact */
  onAddContact(event: Event): void {
    submit(this.form, async (form) => {
      try {
        const { name, email } = this.form().value();
        const contact = new ContactModel(name, email);

        this.#api.openDB((db) => {
          this.#contacts.addContact(db, contact, (contact) => {
            console.log('New contact :: ', contact);

            // Clear interaction state (touched, dirty)
            form().reset();

            // Clear values
            this.#formModel.set({ name: '', email: '' });
          });

          return db;
        });

        return undefined;
      } catch (e) {
        return [
          {
            kind: 'custom error kind',
            message: 'Something is going wrong',
          },
        ];
      }
    });

    event.preventDefault();
  }
}
