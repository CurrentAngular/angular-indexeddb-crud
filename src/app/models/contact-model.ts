import { Contact } from '../interfaces/contact';

export class ContactModel implements Contact {
  constructor(public readonly name: string, public readonly email: string) {}
}
