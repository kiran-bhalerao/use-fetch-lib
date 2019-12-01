import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  Method
} from 'axios'

export default class Http {
  constructor(private baseUrl: string) {}

  public get = (url: string, token: string | null, data?: any, options?: any) =>
    this.fetch(url, token, options)

  public post = (
    url: string,
    token: string | null,
    data: any,
    options?: AxiosRequestConfig
  ) => this.fetchWithBody('POST', url, token, data, options)

  public delete = (
    url: string,
    token: string | null,
    data: any,
    options?: AxiosRequestConfig
  ) => this.fetchWithBody('DELETE', url, token, data, options)

  public put = (
    url: string,
    token: string | null,
    data: any,
    options?: AxiosRequestConfig
  ) => this.fetchWithBody('PUT', url, token, data, options)

  private absUrl = (relativePath: string): string => this.baseUrl + relativePath

  private getHeaders = (token: string | undefined | null) => {
    if (token)
      return {
        Authorization: `Bearer ${token}`,
        'Access-Control-Allow-Origin': '*'
      }

    return {}
  }

  private fetch = (
    url: string,
    token: string | undefined | null,
    options: any = {}
  ) => {
    return axios
      .get(this.absUrl(url), {
        ...options,
        headers: this.getHeaders(token)
      })
      .then((res: AxiosResponse) => res)
      .catch((err: AxiosError) => {
        throw err
      })
  }

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
      headers: this.getHeaders(token)
    })
      .then((res: AxiosResponse) => res)
      .catch((err: AxiosError) => {
        throw err
      })
  }
}
