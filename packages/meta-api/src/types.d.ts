declare module "facebook-nodejs-business-sdk" {
  export class FacebookAdsApi {
    static init(accessToken: string): FacebookAdsApi;
    setDebug(debug: boolean): void;
  }

  export class AdAccount {
    constructor(id: string);
    getInsights(
      fields: string[],
      params: Record<string, unknown>
    ): Promise<Cursor>;
  }

  export interface Cursor {
    length: number;
    hasNext(): boolean;
    next(): Promise<Cursor>;
    [Symbol.iterator](): Iterator<{ _data: Record<string, unknown> }>;
  }
}
