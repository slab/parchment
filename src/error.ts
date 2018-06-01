export default class ParchmentError extends Error {
  message: string;
  name: string;
  stack!: string;

  constructor(message: string) {
    message = '[Parchment] ' + message;
    super(message);
    this.message = message;
    this.name = (<any>this.constructor).name;
  }
}
