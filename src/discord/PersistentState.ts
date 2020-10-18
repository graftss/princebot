import fs from 'fs';

export type PersistentStateConfig<T> = Partial<{
  defaultState: T;
  writePretty: boolean;
}>;

export class PersistentState<T> {
  private path: string;
  private config: PersistentStateConfig<T>;
  private state: T;

  constructor(path: string, config: PersistentStateConfig<T> = {}) {
    this.path = path;
    this.config = config;

    if (config.defaultState !== undefined) {
      this.state = config.defaultState;
    }

    this.load();
  }

  get(): T {
    return this.state;
  }

  set(state: T): void {
    this.state = state;
    this.save();
  }

  private load(): void {
    if (fs.existsSync(this.path)) {
      try {
        this.state = JSON.parse(fs.readFileSync(this.path).toString());
      } catch (e) {
        console.warn(
          `PersistentState load error: unable to parse state at ${this.path}`,
        );
      }
    }
  }

  private save(): void {
    const serializedState: string = this.config.writePretty
      ? JSON.stringify(this.state, null, 2)
      : JSON.stringify(this.state);

    fs.writeFileSync(this.path, serializedState);
  }
}
