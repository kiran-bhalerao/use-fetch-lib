import { IUseFetchContext, IUseFetchProvider } from './types';
export declare const __useFetchContext: () => IUseFetchContext;
/**
 * Getting started with useFetch, you probably need this one `UseFetchProvider` 🎉
 *  - UseFetchProvider is just a React component that help the `useFetch` to configure it properly.
 *  - There are only two required params as given below
 *
 * UseFetchProvider Params 👇
 * @param  {string} baseUrl - your api host name Ex. https://your-api.com without the last Forward slash
 * @param  {() => string|string} authorizationToken - your client JWT token Ex. `bearer eyJ0eX...`
 *
 * Thats it .. 🔥
 */
export declare const __UseFetchProvider: (props: IUseFetchProvider) => JSX.Element;
