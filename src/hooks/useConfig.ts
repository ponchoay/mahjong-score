import useSWR from "swr";
import { apiGet } from "../lib/apiClient.ts";
import type { Config } from "../types/index.ts";

export function useConfig() {
  return useSWR("config", () => apiGet<Config>("getConfig"), {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    keepPreviousData: true,
  });
}
