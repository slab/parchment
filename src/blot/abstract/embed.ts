import { Formattable } from './blot';
import LeafBlot from './leaf';


abstract class EmbedBlot extends LeafBlot implements Formattable {
  abstract format(name: string, value: any);
  abstract formats(): { [index: string]: any };

  length(): number {
    return 1;
  }

  value(): boolean {
    return true;
  }
}


export default EmbedBlot;
