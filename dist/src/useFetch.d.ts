import { IUseFetchProps, IUseFetchReturn } from "./types";
/**
 * useFetch Guidelines 🎉
 *  - This is a react custom hook, so make sure it written in functional component
 *
 * useFetch Params 👇
 * @param  {string} url - The request URL
 * @param  {('get' | 'delete' | 'post' | 'put')} method - (optional, default 'get') The request method
 * @param  {object} mockData - This is default data for typescript types and api mocking
 * @param  {() => boolean | boolean} [shouldDispatch] - (optional) The conditions for auto run the service(on `componentDidMount` or `[]` in hooks way), it partially depend on `dependencies` arg
 * @param  {boolean} [cancelable] - (optional) should cancel request on component unmount..
 * @param  {boolean} [cache] - (optional) should cache your `GET` request or should reuse the cached version of your pre. request. it uses `In Memory Caching`, it does not use any kinda web storage
 * @param  {boolean} [shouldUseAuthToken] - (optional, default true) if it is true it will send your authorizationToken with the request.
 * @param  {Array<any>} [dependencies] - (optional) This is dependencies array, if any of dependency get update them the service will re-call(on componentDidUpdate, or `[dependencies]` hooks way)
 * @param  {() => void} [before] - (optional) This function will trigger when the api call trigger
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param @deprecated {string} [serviceName=unknown] - (optional) You can pass name to your service
 */
export declare const __useFetch: <S extends Record<string, any>, P extends Record<string, any> = any, E extends Record<string, any> = S>(props: string | IUseFetchProps<S, E>) => IUseFetchReturn<E, P>;
