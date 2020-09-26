const Spy = require("../src");
const settings = {
  logger: {
    interval: 5000,
  },
  creator: {
    *gen() {
      let i = 100;
      while (i-- > 0) yield "http://www.baidu.com";
    },
  },
  fetcherManager: { concurrency: 8 },
  saverManager: { concurrency: 8 },
};

const s = new Spy(settings);
s.run();
