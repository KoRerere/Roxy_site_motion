import { BaseApi, LimitApi, HttpClient } from "@roxy/backend-api";
import { lang } from "@/store";

const map = {
  zh: "zh-CN",
  en: "en",
  ru: "ru",
};

export const httpClient = new HttpClient({
  baseURL: import.meta.env.VITE_API_URL as string,
});

httpClient.instance.interceptors.request.use(async (config) => {
  if (import.meta.client) {
    config.headers.token = localStorage.getItem("token");
    config.headers.language = map[lang.value];
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

export const API = {
  base: new BaseApi(httpClient),
  limit: new LimitApi(httpClient),
};

function $myFetch(url: string, options: any) {
  return $fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      language: lang.value,
    },
  });
}

export const ghost = {
  posts: {
    browse: async (params?: any, headers?: any) => {
      return await $myFetch("/api/posts", {
        method: "GET",
        params,
        headers,
      });
    },
    read: async (slug: string) => {
      return await $myFetch(`/api/posts/slug/${slug}`, { method: "GET" });
    },
  },
  tags: {
    browse: async (params?: any, headers?: any) => {
      return await $myFetch("/api/tags", { method: "GET", params, headers });
    },
  },
  search: async (params?: any, headers?: any) => {
    return await $myFetch("/api/search", { method: "GET", params, headers });
  },
};
