const SpyLogger = require("./logger");
const SpyCreator = require("./creator");
const SpyFetcherManager = require("./fetcher-manager");
const SpySaverManager = require("./saver-manager");

class Spy {
  constructor(settings) {
    this.settings = settings;
  }
  async run() {
    this.logger = new SpyLogger(this.settings.logger.interval);
    this.creator = new SpyCreator(this.settings.creator.gen);
    this.saverManager = new SpySaverManager(
      this.settings.saverManager.concurrency
    );
    this.fetcherManager = new SpyFetcherManager(
      this.settings.fetcherManager.concurrency
    );
    this.fetcherManager.setCreator(this.creator);
    this.fetcherManager.setSaverManager(this.saverManager);
    this.logger.setFetcherManager(this.fetcherManager);
    this.logger.setSaverManager(this.saverManager);
    this.logger.start(this.settings);
    await this.fetcherManager.fetch();
    this.logger.stop();
    this.logger.printEnd();
  }
}

module.exports = Spy;
