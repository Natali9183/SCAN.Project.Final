const BASE_URL = "https://gateway.scan-interfax.ru";

export async function apiRequest(path, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(options.headers || {}),
  };

  const expire = localStorage.getItem("tokenExpire");

  if (expire) {
    const expireTime = new Date(expire).getTime();

    if (Number.isNaN(expireTime) || expireTime <= Date.now()) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("tokenExpire");
      throw new Error("Срок действия авторизации истёк. Войдите снова.");
    }
  }

  const token = localStorage.getItem("accessToken");
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  const text = await response.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    const message =
      data?.message || data?.errorMessage || `Ошибка ${response.status}`;
    throw new Error(message);
  }
  return data;
}
