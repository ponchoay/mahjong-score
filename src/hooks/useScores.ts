import useSWR from "swr";
import { apiGet } from "../lib/apiClient.ts";
import type { ScoreRecord } from "../types/index.ts";

export function useScores(year: number) {
  return useSWR(
    ["scores", year],
    () => apiGet<ScoreRecord[]>("getScores", { year: String(year) }),
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
      keepPreviousData: true,
    },
  );
}
