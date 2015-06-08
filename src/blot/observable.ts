interface Observable {
  observer: MutationObserver;

  observeHandler(mutatations: MutationRecord[]): void;
  update(): void;
}


export default Observable;
