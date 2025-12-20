import { Component, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api-service';
import { ContactService } from '../../services/contact-service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Field, form, validateStandardSchema } from '@angular/forms/signals';
import * as z from 'zod';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface DeleteContactInterface {
  readonly name: string;
}

const nameSchema = z.object({
  name: z.string().min(3),
});

@Component({
  selector: 'idb-delete-contact',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, Field],
  templateUrl: './delete-contact.html',
  styleUrl: './delete-contact.scss',
})
export class DeleteContact {
  readonly #api = inject(ApiService);
  readonly #contacts = inject(ContactService);
  readonly #snackBar = inject(MatSnackBar);

  readonly #formModel = signal<DeleteContactInterface>({
    name: '',
  });

  readonly form = form(this.#formModel, (path) => {
    validateStandardSchema(path, nameSchema);
  });

  /** Delete contact */
  deleteContact(event: Event): void {
    if (this.form().valid()) {
      const { name } = this.form().value();

      if (name) {
        this.#api.openDB((db) => {
          this.#contacts.deleteContact(db, name, (contact) => {
            console.log('Removed contact ::', contact);
            this.#snackBar.open(`User with name ${name} removed!`, 'Close', { duration: 3000 });
          });

          return db;
        });
      }

      // Clear interaction state (touched, dirty)
      this.form().reset();

      // Clear values
      this.#formModel.set({ name: '' });

      event.preventDefault();
    }
  }
}
