import { AxiosRequestConfig } from "axios";
import { ReactNode } from "react";
import Http from "./Http";

type Method = "get" | "delete" | "post" | "put";

type IStatus = {
  isPending: boolean;
  isRejected: boolean;
  isFulfilled: boolean;
  isMocked: boolean;
  isCached: boolean;
  err: string;
};

export interface IUseFetchInitialState<S> {
  data: S | undefined;
  status: IStatus;
}

export interface IUseFetchProps<S, E> {
  url: string;
  /** Default 'GET', you can ignore if you want the default one.*/
  method?: Method;
  shouldDispatch?: boolean | (() => boolean);
  /** Should cancel api on Component Unmount */
  cancelable?: boolean;
  cache?: boolean;
  dependencies?: any[];
  mockData?: E;
  shouldUseAuthToken?: boolean;
  before?: () => void;
  /** This is helpful to show notification or do clean up things after the API call */
  after?: (state: IUseFetchInitialState<E>) => void;
  /**🔴 In order to use `alter` you have to provider the 3rd Generic Interface eg. useFetch<IApiResp, any, IApiData> */
  alter?: (state: S) => E;
  options?: AxiosRequestConfig;
}

export type IUseFetchReturn<
  S extends Record<string, any>,
  P extends Record<string, any>
> = [
  { data: S | undefined; status: IStatus },
  (data?: P) => void,
  (cb: (pre: S) => S) => void
];

export interface IUseFetchContext {
  authorizationToken: string | (() => string);
  HttpService: Http;
  isProviderAdded: boolean;
  cacheStore: Record<string, any>;
  updateCache: (key: string, cache: Record<string, any>) => void;
}

export interface IUseFetchProvider
  extends Pick<IUseFetchContext, "authorizationToken"> {
  baseUrl: string;
  children: ReactNode;
}
