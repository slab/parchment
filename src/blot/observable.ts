interface Observable {
  observer: MutationObserver;

  observeHandler(mutatations: MutationRecord[]): void;
  update(): boolean;
}


export default Observable;
