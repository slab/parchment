export interface Formattable {
  format(name: string, value: any): void;
  formats(): { [index: string]: any };
}
