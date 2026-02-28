import useSWR, { useSWRConfig } from "swr";
import { apiGet } from "../lib/apiClient.ts";
import type { InitialData } from "../types/index.ts";

export function useInitialData() {
  const { mutate } = useSWRConfig();

  return useSWR(
    "initialData",
    async () => {
      const data = await apiGet<InitialData>("getInitialData");

      mutate("config", data.config, false);
      mutate("years", data.years, false);

      for (const [year, scores] of Object.entries(data.scoresByYear)) {
        mutate(["scores", Number(year)], scores, false);
      }

      return data;
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );
}
