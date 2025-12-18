import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api-service';
import { ContactService } from '../../services/contact-service';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'idb-delete-contact',
  imports: [MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './delete-contact.html',
  styleUrl: './delete-contact.scss',
})
export class DeleteContact {
  readonly #fb = inject(FormBuilder);
  readonly #api = inject(ApiService);
  readonly #contacts = inject(ContactService);

  // TODO: Replace by signal form
  readonly form = this.#fb.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
  });

  /** Delete contact */
  deleteContact(): void {
    if (this.form.valid) {
      const { name } = this.form.value;

      if (name) {
        this.#api.openDB((db) => {
          this.#contacts.deleteContact(db, name, (contact) => {
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
