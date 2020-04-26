import { AxiosRequestConfig, AxiosResponse } from "axios";
import { ReactNode } from "react";
import Http from "./Http";
declare type Method = "get" | "delete" | "post" | "put";
declare type IStatus = {
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
export interface IUseFetchProps<S> {
    url: string;
    method: Method;
    shouldDispatch?: boolean | (() => boolean);
    cancelable?: boolean;
    cache?: boolean;
    dependencies?: any[];
    mockData?: S;
    shouldUseAuthToken?: boolean;
    beforeServiceCall?: () => void;
    options?: AxiosRequestConfig;
    name?: string;
}
export declare type IUseFetchReturn<S extends Record<string, any>, P extends Record<string, any>> = [{
    data: S | undefined;
}, IStatus, (data?: P) => void, ((cb: (pre: S) => S) => void) | undefined];
export interface IUseFetchContext {
    authorizationToken: string | (() => string);
    HttpService: Http;
    doesProviderAdded: boolean;
    cacheStore: Record<string, any>;
    updateCache: (key: string, cache: Record<string, any>) => void;
}
export interface IUseFetchProvider extends Pick<IUseFetchContext, "authorizationToken"> {
    baseUrl: string;
    children: ReactNode;
}
export declare type ICancelable<T extends any> = (url: string, token: string | null, _data?: any, options?: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
export {};
