export const errorMessage = (e: any) => {
  try {
    if (e.response && e.response.data) {
      return e.response.data.message || e.message
    }
    return e.message
  } catch {
    return e
  }
}

export const beforeService = (beforeServiceCall: (() => void) | undefined) => {
  if (typeof beforeServiceCall === 'function') {
    return beforeServiceCall()
  }

  if (typeof beforeServiceCall !== 'undefined')
    console.warn('useFetch arg `beforeServiceCall` must be a function')
}

export const getAccessToken = (authorizationToken: string | (() => string)) => {
  let access_token = ''
  if (typeof authorizationToken === 'function') {
    access_token = authorizationToken()
  } else {
    access_token = authorizationToken
  }

  return access_token
}
