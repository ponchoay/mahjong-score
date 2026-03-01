import type { Config, ScoreRecord } from "../../types/index.ts";
import { ScoreRow } from "./scoreRow.tsx";

interface ScoreTableProps {
  scores: ScoreRecord[];
  config: Config;
  onEdit: (score: ScoreRecord) => void;
  onDelete: (score: ScoreRecord) => void;
}

export function ScoreTable({
  scores,
  config,
  onEdit,
  onDelete,
}: ScoreTableProps) {
  if (scores.length === 0) {
    return <p className="py-8 text-center text-gray-400">データがありません</p>;
  }

  const sorted = [...scores].sort((a, b) => {
    const dateDiff =
      new Date(a.date).getTime() - new Date(b.date).getTime();
    if (dateDiff !== 0) return dateDiff;
    return (
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  });

  return (
    <div className="space-y-3">
      {sorted.map((score, i) => (
        <ScoreRow
          key={score.id}
          score={score}
          config={config}
          index={i}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
