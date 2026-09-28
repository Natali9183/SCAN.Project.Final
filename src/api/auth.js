import { apiRequest } from "./api";

export async function login(loginValue, password) {
  const data = await apiRequest("/api/v1/account/login", {
    method: "POST",
    body: JSON.stringify({ login: loginValue, password }),
  });
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("tokenExpire", data.expire);
  return data;
}

export function logout() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("tokenExpire");
}

export const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  const expire = localStorage.getItem("tokenExpire");

  if (!token || !expire) {
    return false;
  }

  const expireTime = new Date(expire).getTime();

  if (Number.isNaN(expireTime) || expireTime <= Date.now()) {
    logout();
    return false;
  }

  return true;
};
