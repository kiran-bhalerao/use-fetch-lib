"use strict";
function e(e) {
  return e && "object" == typeof e && "default" in e ? e.default : e;
}
Object.defineProperty(exports, "__esModule", { value: !0 });
var t = require("react"),
  s = e(t),
  a = e(require("axios"));
class i {
  constructor(e) {
    (this.baseUrl = e),
      (this.get = (e, t, s, a) => this.fetch(e, t, a)),
      (this.post = (e, t, s, a) => this.fetchWithBody("POST", e, t, s, a)),
      (this.delete = (e, t, s, a) => this.fetchWithBody("DELETE", e, t, s, a)),
      (this.put = (e, t, s, a) => this.fetchWithBody("PUT", e, t, s, a)),
      (this.absUrl = (e) => this.baseUrl + e),
      (this.getHeaders = (e) =>
        e ? { Authorization: e, "Access-Control-Allow-Origin": "*" } : {}),
      (this.fetch = (e, t, s = {}) =>
        a
          .get(
            this.absUrl(e),
            Object.assign(Object.assign({}, s), {
              headers: Object.assign(
                Object.assign({}, this.getHeaders(t)),
                "object" == typeof s.headers ? s.headers : {}
              ),
            })
          )
          .then((e) => e)
          .catch((e) => {
            throw e;
          })),
      (this.fetchWithBody = (e, t, s, i = {}, r = {}) =>
        a(
          Object.assign(
            Object.assign({ method: e, url: this.absUrl(t), data: i }, r),
            {
              headers: Object.assign(
                Object.assign({}, this.getHeaders(s)),
                "object" == typeof r.headers ? r.headers : {}
              ),
            }
          )
        )
          .then((e) => e)
          .catch((e) => {
            throw e;
          }));
  }
}
i.Cancelable = (function () {
  let e;
  return (t) => {
    const s = t;
    return function () {
      const t = [...arguments];
      if (t.length > 4)
        throw new Error("Wrong Number of arguments, Check Api class");
      e && e.cancel(), (e = a.CancelToken.source());
      let i = { cancelToken: e.token };
      return (
        4 === t.length && (i = Object.assign(Object.assign({}, t[3]), i)),
        (t[3] = i),
        s.apply(this, [...t])
      );
    };
  };
})();
const r = t.createContext({
    authorizationToken: "",
    HttpService: new i(""),
    isProviderAdded: !1,
    cacheStore: {},
    updateCache: () => {},
  }),
  c = (e) => {
    try {
      return (
        (e.response && e.response.data && e.response.data.message) || e.message
      );
    } catch (t) {
      return e;
    }
  };
(exports.UseFetchProvider = (e) => {
  const { children: a, baseUrl: c, authorizationToken: n } = e,
    o = new i(c),
    [d, h] = t.useState({});
  return s.createElement(
    r.Provider,
    {
      value: {
        authorizationToken: n,
        HttpService: o,
        isProviderAdded: !0,
        cacheStore: d,
        updateCache: (e, t) =>
          h((s) => Object.assign(Object.assign({}, s), { [e]: t })),
      },
    },
    a
  );
}),
  (exports.useFetch = (e) => {
    const {
        url: s,
        method: a = "get",
        mockData: n,
        shouldDispatch: o,
        cancelable: d = !1,
        cache: h = !1,
        shouldUseAuthToken: u = !0,
        dependencies: l,
        beforeServiceCall: f,
        options: g = {},
      } = "string" == typeof e ? { url: e } : e,
      {
        authorizationToken: b,
        HttpService: p,
        isProviderAdded: j,
        cacheStore: O,
        updateCache: v,
      } = t.useContext(r),
      C = d ? i.Cancelable(p[a]) : p[a];
    if (!j)
      throw new Error(
        "You must wrap your higher level(parent) component with UseFetchProvider, before using useFetch 😬"
      );
    let k = ((e) => {
      let t = "";
      return (t = "function" == typeof e ? e() : e), t;
    })(b);
    const y = l || [],
      P = !!n,
      w = u ? k : null,
      F = "get" === a && h,
      m = {
        data: n,
        status: {
          isPending: !1,
          isRejected: !1,
          isFulfilled: !1,
          isCached: !1,
          isMocked: P,
          err: "",
        },
      },
      [S, T] = t.useState(m),
      U = (e) => {
        var t;
        if (
          (((e) => {
            if ("function" == typeof e) return e();
            void 0 !== e &&
              console.warn(
                "useFetch arg `beforeServiceCall` must be a function"
              );
          })(f),
          T({
            data: S.data ? S.data : void 0,
            status: {
              isFulfilled: !1,
              isPending: !0,
              isRejected: !1,
              isCached: !1,
              isMocked: P,
              err: "",
            },
          }),
          F)
        ) {
          const e = O[s];
          if (e)
            return T(
              Object.assign(Object.assign({}, e), {
                status: Object.assign(Object.assign({}, e.status), {
                  isMocked: !1,
                  isFulfilled: !0,
                  isCached: !0,
                }),
              })
            );
        }
        null === (t = C) ||
          void 0 === t ||
          t(s, w, e, g)
            .then(({ data: e }) => {
              const t = {
                data: e,
                status: {
                  isFulfilled: !0,
                  isPending: !1,
                  isRejected: !1,
                  isMocked: !1,
                  isCached: !1,
                  err: "",
                },
              };
              T(Object.assign({}, t)), F && v(s, t);
            })
            .catch((e) => {
              T({
                data: S.data,
                status: {
                  isFulfilled: !1,
                  isPending: !1,
                  isCached: !1,
                  isRejected: !0,
                  isMocked: P,
                  err: c(e),
                },
              });
            });
      };
    return (
      t.useEffect(() => {
        o
          ? (("function" == typeof o && o()) || ("boolean" == typeof o && o)) &&
            U()
          : void 0 === o && void 0 !== l && U();
      }, [...y]),
      [
        S,
        U,
        (e) => {
          if (S.data) {
            const t = e(S.data);
            ((e) => {
              F &&
                v(s, {
                  data: e,
                  status: Object.assign(Object.assign({}, m.status), {
                    isCached: !0,
                    isMocked: !1,
                    isFulfilled: !0,
                  }),
                });
            })(t),
              T({
                data: t,
                status: {
                  isFulfilled: !0,
                  isPending: !1,
                  isRejected: !1,
                  isMocked: !1,
                  isCached: !1,
                  err: "",
                },
              });
          }
        },
      ]
    );
  });
