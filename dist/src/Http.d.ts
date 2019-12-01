import { AxiosRequestConfig, AxiosResponse } from "axios";
export default class Http {
    private baseUrl;
    constructor(baseUrl: string);
    get: (url: string, token: string | null, data?: any, options?: any) => Promise<AxiosResponse<any>>;
    post: (url: string, token: string | null, data: any, options?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    delete: (url: string, token: string | null, data: any, options?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    put: (url: string, token: string | null, data: any, options?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    private absUrl;
    private getHeaders;
    private fetch;
    private fetchWithBody;
}
