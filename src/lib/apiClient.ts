import type { ApiResponse } from "../types/index.ts";
import { APP_ENV, GAS_URL, SESSION_TOKEN_KEY } from "./constants.ts";

function getSessionToken(): string | null {
  return localStorage.getItem(SESSION_TOKEN_KEY);
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_TOKEN_KEY);
}

function handleUnauthorized(): never {
  clearSession();
  window.location.href = "/login";
  throw new Error("Unauthorized");
}

export async function apiGet<T>(
  action: string,
  params: Record<string, string> = {},
): Promise<T> {
  return apiPost<T>(action, params);
}

export async function apiPost<T>(
  action: string,
  payload: Record<string, unknown> = {},
): Promise<T> {
  const token = getSessionToken();

  const body = {
    action,
    token,
    env: APP_ENV,
    ...payload,
  };

  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(body),
  });
  const json: ApiResponse<T> = await res.json();

  if (!json.success) {
    if (json.error === "UNAUTHORIZED") handleUnauthorized();
    throw new Error(json.message ?? json.error ?? "API error");
  }

  return json.data as T;
}

export async function login(
  googleIdToken: string,
): Promise<{ token: string; name: string; email: string }> {
  const res = await fetch(GAS_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action: "login", googleIdToken }),
  });
  const json: ApiResponse<{ token: string; name: string; email: string }> =
    await res.json();

  if (!json.success) {
    throw new Error(json.message ?? json.error ?? "Login failed");
  }

  const data = json.data as { token: string; name: string; email: string };
  localStorage.setItem(SESSION_TOKEN_KEY, data.token);
  return data;
}

export async function logout(): Promise<void> {
  const token = getSessionToken();
  if (token) {
    try {
      await apiPost("logout");
    } catch {
      // ignore logout errors
    }
  }
  clearSession();
}
