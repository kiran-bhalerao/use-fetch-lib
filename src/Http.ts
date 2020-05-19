import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
  Method,
} from "axios";
import { ICancelable } from "./types";

export default class Http {
  static Cancelable: <T extends any>(func: Function) => ICancelable<T>;
  constructor(private baseUrl: string) {}

  public get = (
    url: string,
    token: string | null,
    _data?: any,
    options?: any
  ) => this.fetch(url, token, options);

  public post = (
    url: string,
    token: string | null,
    data: any,
    options?: AxiosRequestConfig
  ) => this.fetchWithBody("POST", url, token, data, options);

  public delete = (
    url: string,
    token: string | null,
    data: any,
    options?: AxiosRequestConfig
  ) => this.fetchWithBody("DELETE", url, token, data, options);

  public put = (
    url: string,
    token: string | null,
    data: any,
    options?: AxiosRequestConfig
  ) => this.fetchWithBody("PUT", url, token, data, options);

  private absUrl = (relativePath: string): string =>
    this.baseUrl + relativePath;

  private getHeaders = (token: string | undefined | null) => {
    if (token)
      return {
        Authorization: token,
        "Access-Control-Allow-Origin": "*",
      };

    return {};
  };

  private handleCancel = () => {
    console.log("Request canceled, @use-fetch-lib 🎉");
    return (null as unknown) as Promise<AxiosResponse<any>>;
  };

  private fetch = (
    url: string,
    token: string | undefined | null,
    options: any = {}
  ) => {
    return axios
      .get(this.absUrl(url), {
        ...options,
        headers: {
          ...this.getHeaders(token),
          ...(typeof options.headers === "object" ? options.headers : {}),
        },
      })
      .then((res: AxiosResponse) => res)
      .catch((err: AxiosError) => {
        if (axios.isCancel(err)) {
          return this.handleCancel();
        } else {
          throw err;
        }
      });
  };

  private fetchWithBody = (
    method: Method,
    url: string,
    token: any,
    data: { [key: string]: any } = {},
    options: AxiosRequestConfig = {}
  ) => {
    return axios({
      method,
      url: this.absUrl(url),
      data,
      ...options,
      headers: {
        ...this.getHeaders(token),
        ...(typeof options.headers === "object" ? options.headers : {}),
      },
    })
      .then((res: AxiosResponse) => res)
      .catch((err: AxiosError) => {
        if (axios.isCancel(err)) {
          return this.handleCancel();
        } else {
          throw err;
        }
      });
  };
}

Http.Cancelable = (function () {
  let tokenSource: CancelTokenSource;

  return <T extends any>(func: Function): ICancelable<T> => {
    const originalFunc = func;

    return function () {
      const _args = [...arguments];
      if (_args.length > 4) {
        throw new Error("Wrong Number of arguments, Check Api class");
      }

      if (tokenSource) {
        tokenSource.cancel();
      }
      tokenSource = axios.CancelToken.source();

      let extra = { cancelToken: tokenSource.token };

      if (_args.length === 4) {
        extra = { ..._args[3], ...extra };
      }

      _args[3] = extra;

      //@ts-ignore
      return originalFunc.apply(this, [..._args]);
    };
  };
})();
