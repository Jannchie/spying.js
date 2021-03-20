import got, { Response } from "got/dist/source";
import { parseCookies, stringifyCookies } from "spider-cookies";
import { SpySettings } from "./SpySettings";
import { Semaphore } from "jsemaphore";
import { logger } from "./Logger";
import tunnel from "tunnel";
import { Proxy } from "./Proxy";

export class Spy {
  gotOptions: any;
  sleep(msec: number) {
    return new Promise((resolve) => setTimeout(resolve, msec));
  }
  name: string;
  concurrency: number;
  intervalMS: number;
  finished: boolean;
  URLGener: AsyncGenerator<string, void, unknown> | string[];
  onRes: (response: Response<string>) => Promise<void>;
  cookies: string;
  cookiesMap: Map<string, string>;
  userAgent: string;
  sem: Semaphore;
  proxy: Proxy;
  constructor(options?: SpySettings) {
    this.finished = false;
    this.name = options?.name ?? "Spy";
    this.intervalMS = options?.intervalMS ?? 0;
    this.concurrency = options?.concurrency ?? 16;
    this.cookiesMap = parseCookies(options?.cookies ?? "");
    this.onRes = options?.onRes ?? (async (_: Response) => {});
    this.URLGener = options?.URLGener ?? [];
    this.userAgent = options?.userAgent ?? "spying";
    if (options?.onURL) {
      this.onURL = options.onURL;
    }
    this.sem = new Semaphore(this.concurrency);

    this.gotOptions = {
      headers: {
        cookie: stringifyCookies(this.cookiesMap),
        "user-agent": this.userAgent,
      },
    };
    if (options?.proxy) {
      this.gotOptions.agent = {
        http: tunnel.httpOverHttp({
          proxy: options.proxy,
        }),
        https: tunnel.httpOverHttps({
          proxy: options.proxy,
        }),
      };
    }
  }
  async start() {
    logger.info("Start");
    logger.info(`Name: ${this.name}`);
    logger.info(`User Agent: ${this.userAgent}`);
    if (this.intervalMS) {
      logger.info(`Interval ms: ${this.intervalMS}`);
    } else {
      logger.info(`concurrency: ${this.concurrency}`);
    }
    if (this.URLGener instanceof Array) {
      for (const url of this.URLGener) {
        this.sem.acquire();
        this.crawlURL(url, this.sem);
      }
    } else {
      for await (const url of this.URLGener) {
        this.sem.acquire();
        this.crawlURL(url, this.sem);
      }
    }
    while (!this.sem.empty) {
      await this.sleep(1000);
    }
    this.finished = true;
  }
  private async crawlURL(url: string, sem: Semaphore) {
    try {
      await this.sleep(this.intervalMS);
      const res = await this.onURL(url);
      if (res) {
        await this.onRes(res);
      }
    } catch (e) {
      logger.error(e);
    } finally {
      sem.release();
    }
  }

  async onURL(url: string) {
    try {
      const res = await got.get(url, this.gotOptions);
      await this.updateCookies(res);
      return res;
    } catch (e) {
      logger.error(e);
      return;
    }
  }

  async updateCookies(res: Response<string>) {
    const sc = res.headers["set-cookie"];
    if (!sc) return;
    for (const c of sc) {
      const map = parseCookies(c);
      for (const kv of map.entries()) {
        const [k, v] = kv;
        this.cookiesMap.set(k, v);
      }
    }
  }
}
