// Authorization header setup
export const setAuthorizationToken = (axiosInstance: any, token?: any) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};