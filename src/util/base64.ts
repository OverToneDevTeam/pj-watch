
export const encodeBase64 = (str): string => {
  return btoa(encodeURIComponent(str))
}

export const decodeBase64 = (str): string => {
  return decodeURIComponent(atob(str))
}

