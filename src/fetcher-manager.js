const SpyFetcher = require("./fetcher");
class SpyFetcherManager {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this._finished = false;
    this.alreadyCrawlUrl = 0;
  }

  setCreator(creator) {
    this.creator = creator;
  }

  setSaverManager(sm) {
    this.saverManager = sm;
  }

  async fetch() {
    let count = this.concurrency;
    let saverPromise = this.saverManager.run();
    let tasks = [];
    while (count-- > 0) {
      tasks.push(new SpyFetcher(count));
    }
    while (!this._finished) {
      for (let fetcher of tasks) {
        let shouldWaitFlag = true;
        if (fetcher.free) {
          shouldWaitFlag = false;
          let url_info = this.creator.getUrl();
          if (url_info.done) {
            this._finished = true;
            break;
          }
          this.alreadyCrawlUrl++;
          let res = fetcher.fetch(url_info.value);
          this.saverManager.itemQueue.push(res);
        }
        if (shouldWaitFlag) {
          await new Promise((r) => setTimeout(r, 200));
        }
      }
    }
    this.saverManager._finished = true;
    await saverPromise;
  }
}
module.exports = SpyFetcherManager;
