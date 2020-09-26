class SpyCreator {
  constructor(gener) {
    this.gener = gener;
    this.urlGener = this.gener();
    this.finished = false;
  }
  getUrl() {
    try {
      return this.urlGener.next();
    } catch (e) {
      this.finished = true;
      console.log(e);
    }
  }
}
module.exports = SpyCreator;
