const got = require("got");
class SpyFetcher {
  constructor(number) {
    this.no = number;
    this.free = true;
  }
  async get(url) {
    let res = await got(url, { timeout: 5000 });
    return res;
  }
  async fetch(url) {
    this.free = false;
    let res = await this.get(url);
    this.free = true;
    return res;
  }
}
module.exports = SpyFetcher;
