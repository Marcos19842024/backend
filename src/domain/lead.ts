export class Lead {
  readonly message: string;
  readonly phone: string;
  readonly pathtofiles: Array<string>;

  constructor({ message, phone, pathtofiles }: { message: string; phone: string; pathtofiles: Array<string> }) {
    this.message = message;
    this.phone = phone; 
    this.pathtofiles = pathtofiles;
  }
}