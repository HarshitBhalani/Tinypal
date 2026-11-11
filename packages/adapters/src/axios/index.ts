import { createApiTracker } from "../api-tracker";
import type { ApiOutcome } from "../api-tracker";
import type { MascotEmitter } from "../shared";

/* eslint-disable @typescript-eslint/no-explicit-any -- structural match for any Axios version */
/** The small slice of an Axios instance we use (no axios dependency). */
export interface AxiosLike {
  interceptors: {
    request: { use(onFulfilled: (config: any) => any): number; eject(id: number): void };
    response: {
      use(onFulfilled: (response: any) => any, onRejected: (error: any) => any): number;
      eject(id: number): void;
    };
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface Config {
  [END]?: (o: ApiOutcome) => void;
  [key: string]: unknown;
}
interface ResponseLike {
  status: number;
  config?: Config;
}
interface ErrorLike {
  config?: Config;
  response?: ResponseLike;
  code?: string;
  name?: string;
  __CANCEL__?: boolean;
}

const END = Symbol("tinypal.end");

export interface AxiosAdapterOptions {
  /**
   * Decide whether an HTTP status is a failure. Default: status >= 400.
   * Responses Axios rejects but this returns false for count as success.
   */
  isError?: (status: number) => boolean;
  /** Return false to skip a request. Receives the Axios request config. */
  filter?: (config: Record<string, unknown>) => boolean;
}

/**
 * Attach request/response interceptors to an Axios instance. Returns a
 * function that removes them.
 */
export function attachAxios(
  axios: AxiosLike,
  mascot: MascotEmitter,
  options: AxiosAdapterOptions = {},
): () => void {
  const tracker = createApiTracker(mascot);
  const isError = options.isError ?? ((s: number) => s >= 400);

  const req = axios.interceptors.request.use((config: Config) => {
    if (!options.filter || options.filter(config)) config[END] = tracker.begin();
    return config;
  });

  const res = axios.interceptors.response.use(
    (response: ResponseLike) => {
      response.config?.[END]?.(isError(response.status) ? "error" : "success");
      return response;
    },
    (error: ErrorLike) => {
      const end = error.config?.[END];
      if (end) {
        if (error.__CANCEL__ || error.code === "ERR_CANCELED" || error.name === "CanceledError") {
          end("cancelled");
        } else if (!error.response) {
          end("network-error");
        } else {
          end(isError(error.response.status) ? "error" : "success");
        }
      }
      return Promise.reject(error);
    },
  );

  return () => {
    axios.interceptors.request.eject(req);
    axios.interceptors.response.eject(res);
  };
}
