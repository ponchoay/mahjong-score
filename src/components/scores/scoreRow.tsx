import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { Config, ScoreRecord } from "../../types/index.ts";
import { Card } from "../ui/card.tsx";

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}/${m}/${day}`;
}

interface ScoreRowProps {
  score: ScoreRecord;
  config: Config;
  index: number;
  onEdit: (score: ScoreRecord) => void;
  onDelete: (score: ScoreRecord) => void;
}

export function ScoreRow({
  score,
  config,
  index,
  onEdit,
  onDelete,
}: ScoreRowProps) {
  const playerNames = [
    config.player1Name,
    config.player2Name,
    config.player3Name,
    config.player4Name,
  ];
  const playerScores = [
    score.player1Score,
    score.player2Score,
    score.player3Score,
    score.player4Score,
  ];

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm">#{index + 1}</span>
          <span className="text-sm font-medium">{formatDate(score.date)}</span>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(score)}
            className="text-xs text-brand-700 hover:text-brand-800 transition-colors"
          >
            <FontAwesomeIcon icon={faPenToSquare} className="mr-1" />
            編集
          </button>
          <button
            type="button"
            onClick={() => onDelete(score)}
            className="text-xs text-gray-600 hover:text-danger-600 transition-colors"
          >
            <FontAwesomeIcon icon={faTrashCan} className="mr-1" />
            削除
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {playerNames.map((name, i) => (
          <div key={name} className="flex items-center gap-2 text-sm">
            <span>{name}</span>
            <span className="font-medium">
              {playerScores[i].toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
