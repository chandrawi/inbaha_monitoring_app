import { createSignal, createEffect, createRoot, lazy } from "solid-js";

const EXPIRE = 604800;
export const DEFAULT_DASHBOARD = "sparing_demo";
export const DEFAULT_MENU = "overview";
export const DefaultComponent = lazy(() => import("~/routes/dashboard/[name]/overview"));

function deleteCookie(name: string) {
  document.cookie = name + "=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Strict";
}

function createCookie(name: string, value: string | null, seconds: number) {
  if (value === null) {
    deleteCookie(name);
    return;
  }
  let expires = "";
  if (seconds) {
    const date = new Date();
    date.setTime(date.getTime() + (seconds * 1000));
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + value + expires + "; path=/; SameSite=strict";
}

function readCookie(name: string) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export const langs = [
  { name: "ID", icon: "/icon/fi-id.svg" }, 
  { name: "EN", icon: "/icon/fi-gb.svg" }
];

export const [lang, setLang] = createRoot(() => {
  const cookieLang = readCookie("lang");
  const initialLang = cookieLang ? cookieLang : "ID";
  const [lang, setLang] = createSignal(initialLang);
  createEffect(() => {
    createCookie("lang", lang(), EXPIRE);
  });
  return [lang, setLang];
});

export const [darkTheme, setDarkTheme] = createRoot(() => {
  const systemTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const cookieTheme = readCookie("darkTheme");
  const initialTheme = cookieTheme ? cookieTheme === "1": systemTheme;
  const [darkTheme, setDarkTheme] = createSignal(initialTheme);
  createEffect(() => {
    const theme = darkTheme() ? "1" : "0";
    createCookie("darkTheme", theme, EXPIRE);
  });
  return [darkTheme, setDarkTheme];
});

export const [userId, setUserId] = createRoot(() => {
  const cookieUser = readCookie("user_id");
  const [userId, setUserId] = createSignal(cookieUser);
  createEffect(() => {
    if (userId() != null) {
      createCookie("user_id", userId()!, EXPIRE);
    } else {
      deleteCookie("user_id");
    }
  });
  return [userId, setUserId]
});

type AuthServer = { 
  address: string | null; 
  auth_token: string | null;
  get(): { address: string; auth_token: string } | null;
  setAddress(address: string): void;
  setToken(token: string): void;
  unsetToken(): void;
};

export const authServer: AuthServer = {
  address: null,
  auth_token: null,

  get() {
    const address = readCookie("auth_address");
    const token = readCookie("auth_token");
    if (address) this.address = address;
    if (token) this.auth_token = token;
    if (address) {
      return { address: address, auth_token: token ? token : "" };
    }
    return null;
  },

  setAddress(address: string) {
    this.address = address;
    createCookie("auth_address", address, EXPIRE);
  },

  setToken(token: string) {
    this.auth_token = token;
    createCookie("auth_token", token, EXPIRE);
  },

  unsetToken() {
    deleteCookie("auth_token");
  }
};

type ResourceServer = {
  resources: Record<string, { address: string | null, access_token:string | null, refresh_token: string | null }>;
  get(id: string): { address: string, access_token:string, refresh_token: string } | null;
  setAddress(id: string, address: string | null): void;
  setToken(id: string, token: string | null): void;
  setRefreshToken(id: string, refresh_token: string | null): void;
  getApiIds(): string[];
  unsetToken(id: string): void;
};

export const resourceServer: ResourceServer = {
  resources: {},

  get(id: string) {
    if (!(id in this.resources)) {
      this.resources[id] = { address: null, access_token: null, refresh_token: null };
    }
    const address = readCookie("resource_address_" + id);
    const accessToken = readCookie("resource_token_" + id);
    const refreshToken = readCookie("resource_refresh_" + id);

    if (address && !this.resources[id].address) this.resources[id].address = address;
    if (accessToken && !this.resources[id].access_token) this.resources[id].access_token = accessToken;
    if (refreshToken && !this.resources[id].refresh_token) this.resources[id].refresh_token = refreshToken;

    if (this.resources[id].address && this.resources[id].access_token && this.resources[id].refresh_token) {
      return { 
        address: this.resources[id].address,
        access_token: this.resources[id].access_token,
        refresh_token: this.resources[id].refresh_token
       };
    }
    return null;
  },

  setAddress(id: string, address: string | null) {
    if (!(id in this.resources)) {
      this.resources[id] = { address: null, access_token: null, refresh_token: null };
    }
    this.resources[id].address = address;
    createCookie("resource_address_" + id, address, EXPIRE);
  },

  setToken(id: string, token: string | null) {
    if (!(id in this.resources)) {
      this.resources[id] = { address: null, access_token: null, refresh_token: null };
    }
    this.resources[id].access_token = token;
    createCookie("resource_token_" + id, token, EXPIRE);
  },

  setRefreshToken(id: string, refresh_token: string | null) {
    if (!(id in this.resources)) {
      this.resources[id] = { address: null, access_token: null, refresh_token: null };
    }
    this.resources[id].refresh_token = refresh_token;
    createCookie("resource_refresh_" + id, refresh_token, EXPIRE);
  },

  getApiIds(): string[] {
    return Object.keys(this.resources);
  },

  unsetToken(id: string) {
    if (id in this.resources) {
      this.resources[id].access_token = null;
      this.resources[id].refresh_token = null;
    }
    deleteCookie("resource_token_" + id);
    deleteCookie("resource_refresh_" + id);
  }
};
