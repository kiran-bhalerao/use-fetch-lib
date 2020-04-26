'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var axios = _interopDefault(require('axios'));

class Http {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.get = (url, token, _data, options) => this.fetch(url, token, options);
        this.post = (url, token, data, options) => this.fetchWithBody("POST", url, token, data, options);
        this.delete = (url, token, data, options) => this.fetchWithBody("DELETE", url, token, data, options);
        this.put = (url, token, data, options) => this.fetchWithBody("PUT", url, token, data, options);
        this.absUrl = (relativePath) => this.baseUrl + relativePath;
        this.getHeaders = (token) => {
            if (token)
                return {
                    Authorization: token,
                    "Access-Control-Allow-Origin": "*"
                };
            return {};
        };
        this.fetch = (url, token, options = {}) => {
            return axios
                .get(this.absUrl(url), Object.assign(Object.assign({}, options), { headers: Object.assign(Object.assign({}, this.getHeaders(token)), (typeof options.headers === "object" ? options.headers : {})) }))
                .then((res) => res)
                .catch((err) => {
                throw err;
            });
        };
        this.fetchWithBody = (method, url, token, data = {}, options = {}) => {
            return axios(Object.assign(Object.assign({ method, url: this.absUrl(url), data }, options), { headers: Object.assign(Object.assign({}, this.getHeaders(token)), (typeof options.headers === "object" ? options.headers : {})) }))
                .then((res) => res)
                .catch((err) => {
                throw err;
            });
        };
    }
}
Http.Cancelable = (function () {
    let tokenSource;
    return (func) => {
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
                extra = Object.assign(Object.assign({}, _args[3]), extra);
            }
            _args[3] = extra;
            //@ts-ignore
            return originalFunc.apply(this, [..._args]);
        };
    };
})();

const FetchContext = React.createContext({
    authorizationToken: "",
    HttpService: new Http(""),
    doesProviderAdded: false,
    cacheStore: {},
    updateCache: () => { }
});
const __useFetchContext = () => React.useContext(FetchContext);
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
const __UseFetchProvider = (props) => {
    const { children, baseUrl, authorizationToken } = props;
    const HttpService = new Http(baseUrl);
    const doesProviderAdded = true;
    // cache store
    const [cacheStore, _updateCache] = React.useState({});
    // cache updater
    const updateCache = (key, cache) => _updateCache(pre => (Object.assign(Object.assign({}, pre), { [key]: cache })));
    return (React__default.createElement(FetchContext.Provider, { value: {
            authorizationToken,
            HttpService,
            doesProviderAdded,
            cacheStore,
            updateCache
        } }, children));
};

const errorMessage = (e) => {
    try {
        if (e.response && e.response.data) {
            return e.response.data.message || e.message;
        }
        return e.message;
    }
    catch (_a) {
        return e;
    }
};
const beforeService = (beforeServiceCall) => {
    if (typeof beforeServiceCall === 'function') {
        return beforeServiceCall();
    }
    if (typeof beforeServiceCall !== 'undefined')
        console.warn('useFetch arg `beforeServiceCall` must be a function');
};
const getAccessToken = (authorizationToken) => {
    let access_token = '';
    if (typeof authorizationToken === 'function') {
        access_token = authorizationToken();
    }
    else {
        access_token = authorizationToken;
    }
    return access_token;
};

/**
 * useFetch Guidelines 🎉
 *  - This is a react custom hook, so make sure it written in functional component
 *  - Your api should always return object
 *  otherwise it will try to convert your api response into object(kinda crazy) 🔴
 *
 * useFetch Params 👇
 * @param  {string} url - The request URL
 * @param  {('get' | 'delete' | 'post' | 'put')} method - (optional, default 'get') The request method
 * @param  {object} mockData - This is default data for typescript types and api mocking
 * @param  {() => boolean | boolean} [shouldDispatch] - (optional) The conditions for auto run the service(on `componentDidMount` or `[]` in hooks way), it partially depend on `dependencies` arg
 * @param  {boolean} [cancelable] - (optional) should cancel previous request..
 * @param  {boolean} [cache] - (optional) should cache your `GET` request or should reuse the cached version of your pre. request. it uses `In Memory Caching`, it does not use any kinda web storage
 * @param  {boolean} [shouldUseAuthToken] - (optional, default true) if it is true it will send your authorizationToken with the request.
 * @param  {Array<any>} [dependencies] - (optional) This is dependencies array, if any of dependency get update them the service will re-call(on componentDidUpdate, or `[dependencies]` hooks way)
 * @param  {() => void} [beforeServiceCall] - (optional) This function will trigger when the api call trigger
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param @deprecated {string} [serviceName=unknown] - (optional) You can pass name to your service
 */
const __useFetch = (props) => {
    const { url, method = "get", mockData = undefined, shouldDispatch = undefined, cancelable = false, cache = false, shouldUseAuthToken = true, dependencies = undefined, beforeServiceCall = undefined, options = {}, } = typeof props === "string" ? { url: props } : props;
    // get access token from UseFetch Context
    const { authorizationToken, HttpService, doesProviderAdded, cacheStore, updateCache, } = __useFetchContext();
    // create http instance
    const httpService = cancelable
        ? Http.Cancelable(HttpService[method])
        : HttpService[method];
    // check if UseFetchProvider is added before use of useFetch
    if (!doesProviderAdded)
        throw new Error("You must wrap your higher level(parent) component with UseFetchProvider, before using useFetch 😬");
    let access_token = getAccessToken(authorizationToken);
    // handle undefined params
    const depends = dependencies || [];
    const isMocked = !!mockData;
    const requireAccessToken = shouldUseAuthToken ? access_token : null;
    const cacheable = method === "get" && cache;
    // initiate state
    const initialState = {
        data: mockData,
        status: {
            isPending: false,
            isRejected: false,
            isFulfilled: false,
            isCached: false,
            isMocked,
            err: "",
        },
    };
    // create store
    const [state, setState] = React.useState(initialState);
    // cache mutation
    const _updateCache = (cb) => {
        var _a;
        const preCache = (_a = cacheStore[url]) === null || _a === void 0 ? void 0 : _a["data"];
        if (preCache) {
            const updatedData = cb(preCache);
            updateCache(url, {
                data: updatedData,
                status: Object.assign(Object.assign({}, initialState.status), { isCached: true, isMocked: false, isFulfilled: true }),
            });
        }
    };
    // actual service
    const service = (data) => {
        var _a;
        beforeService(beforeServiceCall);
        // pending state
        setState({
            data: state.data ? state.data : undefined,
            status: {
                isFulfilled: false,
                isPending: true,
                isRejected: false,
                isCached: false,
                isMocked,
                err: "",
            },
        });
        // get cache
        if (cacheable) {
            const CachedState = cacheStore[url];
            if (CachedState) {
                return setState(Object.assign(Object.assign({}, CachedState), { status: Object.assign(Object.assign({}, CachedState.status), { isMocked: false, isFulfilled: true, isCached: true }) }));
            }
        }
        // call service
        (_a = httpService) === null || _a === void 0 ? void 0 : _a(url, requireAccessToken, data, options).then(({ data }) => {
            // Fulfilled state
            const FulfilledState = {
                data,
                status: {
                    isFulfilled: true,
                    isPending: false,
                    isRejected: false,
                    isMocked: false,
                    isCached: false,
                    err: "",
                },
            };
            setState(Object.assign({}, FulfilledState));
            // set cache
            if (cacheable) {
                updateCache(url, FulfilledState);
            }
        }).catch((err) => {
            // Rejected state
            setState({
                data: state.data,
                status: {
                    isFulfilled: false,
                    isPending: false,
                    isCached: false,
                    isRejected: true,
                    isMocked,
                    err: errorMessage(err),
                },
            });
        });
    };
    // service manager
    React.useEffect(() => {
        if (shouldDispatch) {
            if (typeof shouldDispatch === "function" && shouldDispatch()) {
                service(); // if `shouldDispatch` is a function and it return true
            }
            else if (typeof shouldDispatch === "boolean" && shouldDispatch) {
                service(); // if `shouldDispatch` is a boolean and it's value is true
            }
        }
        else if (typeof shouldDispatch === "undefined") {
            if (typeof dependencies !== "undefined") {
                service(); // if `shouldDispatch` is a not given but dependencies has at least one value || not undefiled
            }
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
    }, [...depends]);
    return [state, service, cacheable ? _updateCache : undefined];
};

exports.UseFetchProvider = __UseFetchProvider;
exports.useFetch = __useFetch;
