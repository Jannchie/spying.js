export interface SpySettings {
  name?: string;
  concurrency?: number;
  URLIterator?: Generator<string, void, unknown>;
}
export class Spy {
  name: string;
  concurrency: number;
  finished: boolean;
  URLIterator: Generator<string, void, unknown>;
  constructor(options?: SpySettings) {
    this.finished = false;
    this.URLIterator =
      options?.URLIterator ??
      (function* () {
        for (let index = 0; index < 100; index++) {
          yield index.toString();
        }
      })();
    this.name = options?.name ?? "Spy";
    this.concurrency = options?.concurrency ?? 16;
  }
  async start() {
    for (const name of this.URLIterator) {
      console.log(name);
    }
    this.finished = true;
  }
}

new Spy().start();
