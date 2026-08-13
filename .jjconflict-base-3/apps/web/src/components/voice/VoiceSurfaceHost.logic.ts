export class VoiceSurfacePortalMount {
  readonly container: HTMLDivElement;
  #target: HTMLDivElement | null = null;

  constructor(container: HTMLDivElement) {
    this.container = container;
  }

  attach(target: HTMLDivElement): void {
    this.#target = target;
    target.append(this.container);
  }

  detach(target: HTMLDivElement): void {
    if (this.#target !== target) return;
    this.#target = null;
    this.container.remove();
  }

  dispose(): void {
    this.#target = null;
    this.container.remove();
  }
}
