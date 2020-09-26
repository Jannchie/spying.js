const SpySaver = require("./saver");
class SpySaverManager {
  constructor(concurrency) {
    this.itemQueue = [];
    this.concurrency = concurrency;
    this._finished = false;
    this.alreadyOutputItem = 0;
  }
  async save(item) {
    return 1;
  }
  async run() {
    let concurrency = this.concurrency;
    let saverList = [];
    let savePromises = [];
    while (concurrency-- > 0) {
      saverList.push(new SpySaver(this, concurrency));
    }

    while (!this._finished || this.itemQueue.length != 0) {
      let nothingToSave = true;
      for (let saver of saverList) {
        if (saver.free == true && this.itemQueue.length != 0) {
          nothingToSave = false;
          let item = this.itemQueue.shift();
          savePromises[saver.index] = saver._toSave(item);
        }
      }
      if (nothingToSave) {
        await new Promise((r) => setTimeout(r, 200));
      }
    }
    await Promise.all(savePromises);
  }
}
module.exports = SpySaverManager;
