'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var axios = _interopDefault(require('axios'));

class Http {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.get = (url, token, data, options) => this.fetch(url, token, options);
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
                .get(this.absUrl(url), Object.assign(Object.assign({}, options), { headers: this.getHeaders(token) }))
                .then((res) => res)
                .catch((err) => {
                throw err;
            });
        };
        this.fetchWithBody = (method, url, token, data = {}, options = {}) => {
            return axios(Object.assign(Object.assign({ method, url: this.absUrl(url), data }, options), { headers: this.getHeaders(token) }))
                .then((res) => res)
                .catch((err) => {
                throw err;
            });
        };
    }
}

const FetchContext = React.createContext({
    authorizationToken: '',
    useHttpService: new Http(''),
    withProviderAdded: false
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
    const useHttpService = new Http(baseUrl);
    const withProviderAdded = true;
    return (React__default.createElement(FetchContext.Provider, { value: { authorizationToken, useHttpService, withProviderAdded } }, children));
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
 * @param  {('get' | 'delete' | 'post' | 'put')} method - The request method
 * @param  {object} mockData - This is default data for typescript types and api mocking
 * @param  {() => boolean | boolean} [shouldDispatch] - (optional) The conditions for auto run the service(on `componentDidMount` or `[]` in hooks way), it partially depend on `dependencies` arg
 * @param  {boolean} [shouldUseAuthToken] - (optional, default true) if it is true it will send your authorizationToken with the request.
 * @param  {Array<any>} [dependencies] - (optional) This is dependencies array, if any of dependency get update them the service will re-call(on componentDidUpdate, or `[dependencies]` hooks way)
 * @param  {() => void} [beforeServiceCall] - (optional) This function will trigger when the api call trigger
 * @param  {object} [options={}] - (optional) The config options of Axios.js (https://goo.gl/UPLqaK)
 * @param  {string} [serviceName=unknown] - (optional) You can pass name to your service
 */
const __useFetch = (props) => {
    const { url, method, mockData, shouldDispatch, shouldUseAuthToken = true, dependencies, beforeServiceCall, options, name } = props;
    // get access token from UseFetch Context
    const { authorizationToken, useHttpService, withProviderAdded } = __useFetchContext();
    // check if UseFetchProvider is added before use of useFetch
    if (!withProviderAdded)
        throw new Error("You must wrap your higher level(parent) component with UseFetchProvider, before using useFetch 😬");
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
    const [state, setState] = React.useState(initialState);
    // actual service
    const service = (data) => {
        beforeService(beforeServiceCall);
        // pending state
        setState({
            data: state.data ? Object.assign({}, state.data) : undefined,
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
            .then(({ data }) => {
            setState({
                data: Object.assign(Object.assign({}, state.data), data),
                status: {
                    isFulfilled: true,
                    isPending: false,
                    isRejected: false,
                    isMocked: false,
                    err: ""
                }
            });
        })
            .catch((err) => {
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
    return [state.data, state.status, service, serviceName];
};

exports.UseFetchProvider = __UseFetchProvider;
exports.useFetch = __useFetch;
