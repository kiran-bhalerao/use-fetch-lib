import React, { createContext, useContext } from 'react'
import Http from './Http'
import { IUseFetchContext, IUseFetchProvider } from './types'

const FetchContext = createContext<IUseFetchContext>({
  authorizationToken: '',
  useHttpService: new Http(''),
  withProviderAdded: false
})

export const __useFetchContext = () => useContext(FetchContext)

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
export const __UseFetchProvider = (props: IUseFetchProvider) => {
  const { children, baseUrl, authorizationToken } = props
  const useHttpService = new Http(baseUrl)
  const withProviderAdded = true

  return (
    <FetchContext.Provider
      value={{ authorizationToken, useHttpService, withProviderAdded }}
    >
      {children}
    </FetchContext.Provider>
  )
}
