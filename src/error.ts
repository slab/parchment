export default class ParchmentError extends Error {
  public message: string;
  public name: string;
  public stack!: string;

  constructor(message: string) {
    message = '[Parchment] ' + message;
    super(message);
    this.message = message;
    this.name = this.constructor.name;
  }
}
