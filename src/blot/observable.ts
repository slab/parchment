interface Observable {
  observer: MutationObserver;

  observeHandler(mutatations: MutationRecord[]): void;
  onUpdate(): void;
  update(): boolean;
}


export default Observable;
