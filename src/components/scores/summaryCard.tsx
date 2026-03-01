import {
  faCrown,
  faRankingStar,
  faTrophy,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { PlayerSummary } from "../../types/index.ts";
import { Card } from "../ui/card.tsx";

interface SummaryCardProps {
  summaries: PlayerSummary[];
  gameCount: number;
}

function formatScore(score: number): string {
  const sign = score >= 0 ? "+" : "";
  return `${sign}${score.toLocaleString()}`;
}

const rankColors = [
  "text-yellow-600",
  "text-gray-500",
  "text-amber-700",
  "text-gray-400",
];

export function SummaryCard({ summaries, gameCount }: SummaryCardProps) {
  if (summaries.length === 0) return null;

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-600">
          <FontAwesomeIcon icon={faRankingStar} className="mr-1" />
          年間サマリー
        </h2>
        <span className="text-xs text-gray-500">試合数: {gameCount}</span>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {summaries.map((s) => (
          <div key={s.name} className="text-center">
            <span
              className={`text-xs font-bold ${rankColors[s.rank - 1] ?? ""}`}
            >
              {s.rank === 1 && (
                <FontAwesomeIcon icon={faCrown} className="mr-1" />
              )}
              {s.rank === 2 && (
                <FontAwesomeIcon icon={faTrophy} className="mr-1" />
              )}
              {s.rank}位
            </span>
            <p className="text-sm font-medium text-gray-800">{s.name}</p>
            <p
              className={`text-sm font-semibold ${s.totalScore >= 0 ? "text-brand-700" : "text-danger-600"}`}
            >
              {formatScore(s.totalScore)}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
