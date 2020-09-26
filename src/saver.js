class SpySaver {
  constructor(saverManager, idx) {
    this.saverManager = saverManager;
    this.index = idx;
    this.free = true;
  }
  async _toSave(item) {
    this.free = false;
    let result = await this.save(await item);
    this.saverManager.alreadyOutputItem += result;
    this.free = true;
    return result;
  }
  async save(item) {
    return 1;
  }
}
module.exports = SpySaver;
