import { CHAIN } from '../chain';

class RestClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(path: string, options?: { cache?: RequestCache; revalidate?: number }): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const fetchOptions: RequestInit = {};

    if (options?.cache) {
      fetchOptions.cache = options.cache;
    } else if (options?.revalidate !== undefined) {
      fetchOptions.next = { revalidate: options.revalidate };
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) {
      throw new RestError(res.status, `${res.status} ${res.statusText} for ${path}`);
    }

    return res.json();
  }
}

export class RestError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'RestError';
  }
}

export const rest = new RestClient(CHAIN.rest);
