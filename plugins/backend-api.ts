import { BaseApi, LimitApi, HttpClient } from "@roxy/backend-api";
import { lang } from "@/store";
import { backendMap } from "@/constants/langs";

export default defineNuxtPlugin(() => {
  const { public: { apiUrl } } = useRuntimeConfig()

  const httpClient = new HttpClient({
    baseURL: apiUrl as string,
  });
  
  httpClient.instance.interceptors.request.use(async (config) => {
    if (import.meta.client) {
      config.headers.token = localStorage.getItem("token");
      config.headers.language = backendMap[lang.value];
    }
    config.headers.source = "web";
    return config;
  });
  
  httpClient.instance.interceptors.response.use(async (response) => {
    if (response.data.code === 405) {
      // 未登录
      if (import.meta.client) {
        localStorage.removeItem("token");
      }
      return response;
    }
    return response;
  });
  
  const API = {
    base: new BaseApi(httpClient),
    limit: new LimitApi(httpClient),
  };

  return {
    provide: {
      API,
      httpClient
    }
  }
})
