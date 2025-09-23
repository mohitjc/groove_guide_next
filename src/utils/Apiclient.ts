import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";
import { loaderHtml } from "./shared";
import envirnment from "@/envirnment";
import { setAuthorizationToken } from "./api.utils";



// Types
type HttpMethod = "get" | "post" | "put" | "delete";

interface ErrorResponse {
  error?: {
    code?: number;
    message?: string;
    details?: { issue?: string }[];
  };
  message?: string;
  success?: boolean;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

type ControllerRef = { current: AbortController | null };

const ApiClientB = (controllerRef: ControllerRef = { current: null }) => {
  const user = useSelector((state: any) => state.user.data);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const baseUrl = envirnment.api;

  let controller: AbortController;

  const config = {
    headers: { "Content-Type": "application/json" },
  };

  const buildUrl = (url: string, base = ""): string => {
    if (url.includes("https")) return url;
    return (base || baseUrl) + url;
  };

  const handleError = (errorData: ErrorResponse, hideError?: boolean) => {
    let message = "Server Error";

    if (errorData) {
      if (errorData.error?.code === 401) {
        hideError = true;
        document.getElementById("logoutBtn")?.click();
      }
      message =
        errorData.error?.message || errorData.message || "Server Error";
      if (errorData.error?.details) {
        message = errorData.error.details[0]?.issue || message;
      }
    }

    if (!hideError) toast.error(message);
  };

  const handleRequest = async <T = any>(
    method: HttpMethod,
    url: string,
    data: any = {},
    params: Record<string, any> = {},
    base = "",
    hideError = false,
    isFormData = false
  ): Promise<ApiResponse<T>> => {
    const requestUrl = buildUrl(url, base);
    const auth = params?.Authorization || user?.access_token || "";
    setAuthorizationToken(axios, auth);

    const headers = isFormData
      ? { "Content-Type": "multipart/form-data" }
      : { "Content-Type": "application/json" };

    controller = new AbortController();
    controllerRef.current = controller;

    const requestConfig = {
      ...config,
      headers,
      params,
      signal: controllerRef.current.signal,
    };

    setIsLoading(true);
    try {
      const response: any = await axios[method](
        requestUrl,
        data ? (isFormData ? data : JSON.stringify(data)) : requestConfig,
        requestConfig
      );
      if (response.data?.message !== "Request canceled") {
        setIsLoading(false);
      }
      loaderHtml(false);
      return response.data;
    } catch (error: any) {
      if (axios.isCancel(error)) {
        loaderHtml(false);
        return {
          message: "Request canceled",
          success: false,
        };
      } else {
        setIsLoading(false);
        loaderHtml(false);
        if ((error as AxiosError).response) {
          const errResponse = (error as AxiosError).response
            ?.data as ErrorResponse;
          handleError(errResponse, hideError);
          return { ...errResponse, success: false };
        } else {
          throw error;
        }
      }
    }
  };

  const get = <T = any>(
    url: string,
    params: Record<string, any> = {},
    base = "",
    hideError = false
  ) => handleRequest<T>("get", url, null, params, base, hideError);

  const post = <T = any>(
    url: string,
    payload: Record<string, any> = {},
    params: Record<string, any> = {},
    base = "",
    hideError = false
  ) => handleRequest<T>("post", url, payload, params, base, hideError);

  const put = <T = any>(
    url: string,
    payload: Record<string, any> = {},
    base = "",
    hideError = false
  ) => handleRequest<T>("put", url, payload, {}, base, hideError);

  const deleteApi = <T = any>(
    url: string,
    params: Record<string, any> = {},
    base = "",
    hideError = false
  ) => handleRequest<T>("delete", url, null, params, base, hideError);

  const multiImageUpload = <T = any>(
    url: string,
    files: FileList | File[],
    params: Record<string, any> = {},
    key = "file"
  ) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => formData.append(key, file));
    return handleRequest<T>("post", url, formData, params, "", false, true);
  };

  const postFormData = <T = any>(
    url: string,
    params: Record<string, string | Blob>
  ) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) =>
      formData.append(key, value)
    );
    return handleRequest<T>("post", url, formData, {}, "", false, true);
  };

const postFormFileData = <T = any>(
  url: string,
  params: Record<string, string | Blob | File | null>
) => {
  const formData = new FormData();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null) {
      formData.append(key, value);
    }
  });
  return handleRequest<T>("post", url, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }, "", false, true);
};

  const allApi = <T = any>(
    url: string,
    params: Record<string, any>,
    method: HttpMethod = "get"
  ) => {
    const methods = { get, post, put, delete: deleteApi };
    return methods[method]<T>(url, params);
  };

  return {
    get,
    post,
    put,
    deleteApi,
    allApi,
    multiImageUpload,
    postFormData,
    postFormFileData,
    isLoading,
    controller: controllerRef.current,
  };
};

export default ApiClientB;
