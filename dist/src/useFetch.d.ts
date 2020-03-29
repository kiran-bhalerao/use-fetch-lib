import { IUseFetchProps, IUseFetchReturn } from "./types";
/**
 * useFetch Guidelines 🎉
 *  - This is a react custom hook, so make sure it written in functional component
 *  - Your api should always return object
 *  otherwise it will try to convert your api response into object(kinda crazy) 🔴
 *
 * useFetch Params 👇
 * @param  {string} url - The request URL
 * @param  {('get' | 'delete' | 'post' | 'put')} method - The request method
 * @param  {object} mockData - This is default data for typescript types and api mocking
 * @param  {() => boolean | boolean} [shouldDispatch] - (optional) The conditions for auto run the service(on `componentDidMount` or `[]` in hooks way), it partially depend on `dependencies` arg
 * @param  {boolean} [cancelable] - (optional) Should cancel previous request..
 * @param  {boolean} [shouldUseAuthToken] - (optional, default true) if it is true it will send your authorizationToken with the request.
 * @param  {Array<any>} [dependencies] - (optional) This is dependencies array, if any of dependency get update them the service will re-call(on componentDidUpdate, or `[dependencies]` hooks way)
 * @param  {() => void} [beforeServiceCall] - (optional) This function will trigger when the api call trigger
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param  {string} [serviceName=unknown] - (optional) You can pass name to your service
 */
export declare const __useFetch: <S extends Record<string, any>, P extends Record<string, any> = any>(props: IUseFetchProps<S>) => IUseFetchReturn<S, P>;
