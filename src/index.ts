import got, { Response } from "got/dist/source";
import { eachLimit, IterableCollection } from "async";
import { logger } from "./logger";
import { parseCookies, stringifyCookies } from "spider-cookies";
export interface SpySettings {
  name?: string;
  concurrency?: number;
  cookies?: string;
  URLIterator?: IterableCollection<string>;
  onRes?: (response: Response<string>) => Promise<void>;
  userAgent?: string;
  onURL?: (url: string) => Promise<Response<string>>;
}
export class Spy {
  name: string;
  concurrency: number;
  finished: boolean;
  URLIterator: IterableCollection<string>;
  onRes: (response: Response<string>) => Promise<void>;
  cookies: string;
  cookiesMap: Map<string, string>;
  userAgent: string;
  constructor(options?: SpySettings) {
    this.finished = false;
    this.name = options?.name ?? "Spy";
    this.concurrency = options?.concurrency ?? 16;
    this.cookiesMap = parseCookies(options?.cookies ?? "");
    this.onRes = options?.onRes ?? (async (_: Response) => {});
    this.URLIterator = options?.URLIterator ?? [];
    this.userAgent = options?.userAgent ?? "spying";
    if (options?.onURL) {
      this.onURL = options.onURL;
    }
  }
  async start() {
    logger.info("Start");
    await eachLimit(
      this.URLIterator,
      this.concurrency,
      async (url, callback) => {
        const res = await this.onURL(url);
        if (res) {
          await this.onRes(res);
        }
        callback();
      }
    );
    this.finished = true;
  }
  async onURL(url: string) {
    try {
      const res = await got.get(url, {
        headers: {
          cookie: stringifyCookies(this.cookiesMap),
        },
      });
      await this.updateCookies(res);
      return res;
    } catch (e) {
      return null;
    }
  }

  private async updateCookies(res: Response<string>) {
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
