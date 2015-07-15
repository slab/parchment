import Blot from './blot';

interface Mergeable {
  merge(target?:Blot): boolean;
}

export default Mergeable;
