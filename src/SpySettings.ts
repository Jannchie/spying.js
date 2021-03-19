import { Response } from "got/dist/source";

export interface SpySettings {
  name?: string;
  concurrency?: number;
  cookies?: string;
  URLGener?: AsyncGenerator<string, void, unknown> | string[];
  intervalMS?: number;
  onRes?: (response: Response<string>) => Promise<void>;
  userAgent?: string;
  onURL?: (url: string) => Promise<Response<string>>;
}
