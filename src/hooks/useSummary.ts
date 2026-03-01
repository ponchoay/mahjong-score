import { useMemo } from "react";
import type { Config, PlayerSummary, ScoreRecord } from "../types/index.ts";

export function useSummary(
  scores: ScoreRecord[] | undefined,
  config: Config | undefined,
): PlayerSummary[] {
  return useMemo(() => {
    if (!scores || !config) return [];

    const players = [
      { name: config.player1Name, key: "player1Score" as const },
      { name: config.player2Name, key: "player2Score" as const },
      { name: config.player3Name, key: "player3Score" as const },
      { name: config.player4Name, key: "player4Score" as const },
    ];

    const summaries = players.map(({ name, key }) => ({
      name,
      totalScore: scores.reduce((sum, s) => sum + s[key] - 25000, 0),
      rank: 0,
    }));

    summaries.sort((a, b) => b.totalScore - a.totalScore);
    for (let i = 0; i < summaries.length; i++) {
      summaries[i].rank = i + 1;
    }

    return summaries;
  }, [scores, config]);
}
