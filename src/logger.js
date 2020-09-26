const winston = require("winston");
class SpyLogger {
  constructor(interval = 1000) {
    this.interval = interval;
    this.currentLog = "";
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf((info) => {
          return `[${info.timestamp}] ${info.level} : ${info.message}`;
        })
      ),
      transports: [
        new winston.transports.Console({
          level: "info",
        }),
      ],
    });
  }
  setFetcherManager(fm) {
    this.fetcherManager = fm;
  }
  setSaverManager(s) {
    this.saverManager = s;
  }
  start(settings) {
    if (this._timer == undefined) {
      this.startLogging(settings);
      this._timer = setInterval(() => this.printLog(), this.interval);
    }
  }
  startLogging(settings) {
    this.logger.info(`=============`);
    this.logger.info(`Start Spying!`);
    this.logger.info(`=============`);
    this.logger.info(`logger interval: ${settings.logger.interval}ms`);
    this.logger.info(
      `Fetcher concurrency: ${settings.fetcherManager.concurrency}`
    );
    this.logger.info(`Saver concurrency: ${settings.saverManager.concurrency}`);
    this.logger.info(`=============`);
  }
  printLog() {
    this.logger.info(
      `Crawled: ${this.fetcherManager.alreadyCrawlUrl}, Items: ${this.saverManager.alreadyOutputItem}`
    );
  }
  printEnd() {
    this.printLog();
    this.logger.info(`=============`);
    this.logger.info("Finished!");
    this.logger.info(`=============`);
  }
  stop() {
    clearInterval(this._timer);
  }
}

module.exports = SpyLogger;
