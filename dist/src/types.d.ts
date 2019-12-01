import { AxiosRequestConfig } from 'axios';
import { ReactNode } from 'react';
import Http from './Http';
declare type Method = 'get' | 'delete' | 'post' | 'put';
declare type IStatus = {
    isPending: boolean;
    isRejected: boolean;
    isFulfilled: boolean;
    isMocked: boolean;
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
    dependencies?: any[];
    mockData?: S;
    shouldUseAuthToken?: boolean;
    beforeServiceCall?: () => void;
    options?: AxiosRequestConfig;
    name?: string;
}
export declare type IUseFetchReturn<S extends Record<string, any>, P extends Record<string, any>> = [S | undefined, IStatus, (data?: P) => Promise<void>, string];
export interface IUseFetchContext {
    authorizationToken: string | (() => string);
    useHttpService: Http;
    withProviderAdded: boolean;
}
export interface IUseFetchProvider extends Omit<Omit<IUseFetchContext, 'useHttpService'>, 'withProviderAdded'> {
    baseUrl: string;
    children: ReactNode;
}
export {};
