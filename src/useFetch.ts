import { useEffect, useState } from "react";
import { __useFetchContext } from "./Provider";
import {
  IUseFetchInitialState,
  IUseFetchProps,
  IUseFetchReturn
} from "./types";
import { beforeService, errorMessage, getAccessToken } from "./utilities";

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
 * @param  {boolean} [shouldUseAuthToken] - (optional, default true) if it is true it will send your authorizationToken with the request.
 * @param  {Array<any>} [dependencies] - (optional) This is dependencies array, if any of dependency get update them the service will re-call(on componentDidUpdate, or `[dependencies]` hooks way)
 * @param  {() => void} [beforeServiceCall] - (optional) This function will trigger when the api call trigger
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param  {string} [serviceName=unknown] - (optional) You could pass name to your service
 */
export const __useFetch = <
  S extends Record<string, any>,
  P extends Record<string, any> = any
>(
  props: IUseFetchProps<S>
): IUseFetchReturn<S, P> => {
  const {
    url,
    method,
    mockData,
    shouldDispatch,
    shouldUseAuthToken = true,
    dependencies,
    beforeServiceCall,
    options,
    name
  } = props;

  // get access token from UseFetch Context
  const {
    authorizationToken,
    useHttpService,
    withProviderAdded
  } = __useFetchContext();

  // check if UseFetchProvider is added before use of useFetch
  if (!withProviderAdded)
    throw new Error(
      "You must wrap your higher level(parent) component with UseFetchProvider, before using useFetch 😬"
    );

  let access_token = getAccessToken(authorizationToken);

  // handle undefined params
  const serviceName = name || "unknown";
  const depends = dependencies || [];
  const isMocked = !!mockData;
  const requireAccessToken = shouldUseAuthToken ? access_token : null;

  // initiate state
  const initialState = {
    data: mockData,
    status: {
      isPending: false,
      isRejected: false,
      isFulfilled: false,
      isMocked: false,
      err: ""
    }
  };

  // create store
  const [state, setState] = useState<IUseFetchInitialState<S>>(initialState);

  // actual service
  const service = (data?: P) => {
    beforeService(beforeServiceCall);
    // pending state
    setState({
      data: state.data ? { ...state.data } : undefined,
      status: {
        isFulfilled: false,
        isPending: true,
        isRejected: false,
        isMocked,
        err: ""
      }
    });

    // call service
    useHttpService[method](url, requireAccessToken, data, options)
      .then(({ data }: any) => {
        setState({
          data: { ...state.data, ...data },
          status: {
            isFulfilled: true,
            isPending: false,
            isRejected: false,
            isMocked: false,
            err: ""
          }
        });
      })
      .catch((err: any) => {
        setState({
          data: state.data,
          status: {
            isFulfilled: false,
            isPending: false,
            isRejected: true,
            isMocked,
            err: errorMessage(err)
          }
        });
      });
  };

  // service manager
  useEffect(() => {
    if (shouldDispatch) {
      if (typeof shouldDispatch === "function" && shouldDispatch()) {
        service(); // if `shouldDispatch` is a function and it return true
      } else if (typeof shouldDispatch === "boolean" && shouldDispatch) {
        service(); // if `shouldDispatch` is a boolean and it's value is true
      }
    } else if (typeof shouldDispatch === "undefined") {
      if (typeof dependencies !== "undefined") {
        service(); // if `shouldDispatch` is a not given but dependencies has at least one value || not undefiled
      }
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...depends]);

  return [state.data, state.status, service, serviceName];
};
