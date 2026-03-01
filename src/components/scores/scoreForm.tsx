import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { TOTAL_SCORE } from "../../lib/constants.ts";
import type { Config, ScoreFormData, ScoreRecord } from "../../types/index.ts";
import { Button } from "../ui/button.tsx";

interface ScoreFormProps {
  config: Config;
  initialData?: ScoreRecord;
  onSubmit: (data: ScoreFormData) => Promise<void>;
  onCancel: () => void;
}

export function ScoreForm({
  config,
  initialData,
  onSubmit,
  onCancel,
}: ScoreFormProps) {
  const toDateInput = (s: string) => {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return s;
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const [date, setDate] = useState(
    initialData?.date
      ? toDateInput(initialData.date)
      : new Date().toISOString().slice(0, 10),
  );
  const [scoreInputs, setScoreInputs] = useState([
    String(initialData?.player1Score ?? ""),
    String(initialData?.player2Score ?? ""),
    String(initialData?.player3Score ?? ""),
    String(initialData?.player4Score ?? ""),
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parseScore = (v: string) => {
    if (v === "" || v === "-") return 0;
    const n = Number.parseInt(v, 10);
    return Number.isNaN(n) ? 0 : n;
  };

  const scores = scoreInputs.map(parseScore);
  const total = scores.reduce((sum, s) => sum + s, 0);
  const isValid = total === TOTAL_SCORE && date !== "";

  const playerNames = [
    config.player1Name,
    config.player2Name,
    config.player3Name,
    config.player4Name,
  ];

  const handleScoreChange = (index: number, value: string) => {
    const next = [...scoreInputs];
    next[index] = value;
    setScoreInputs(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        date,
        player1Score: scores[0],
        player2Score: scores[1],
        player3Score: scores[2],
        player4Score: scores[3],
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700"
        >
          日付
        </label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 w-full rounded-input border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-brand-700 focus:ring-1 focus:ring-brand-600 focus:outline-none"
          required
        />
      </div>

      {playerNames.map((name, i) => (
        <div key={name}>
          <label
            htmlFor={`player-${i}`}
            className="block text-sm font-medium text-gray-700"
          >
            {name}
          </label>
          <input
            id={`player-${i}`}
            type="number"
            value={scoreInputs[i]}
            onChange={(e) => handleScoreChange(i, e.target.value)}
            className="mt-1 w-full rounded-input border border-gray-300 px-3 py-2 transition-colors focus:border-brand-700 focus:ring-1 focus:ring-brand-600 focus:outline-none"
            placeholder="0"
          />
        </div>
      ))}

      <div
        className={`text-sm font-semibold ${isValid ? "text-brand-700" : "text-danger-600"}`}
      >
        合計: {total.toLocaleString()}
        {!isValid && total !== 0 && (
          <span className="ml-2 text-xs font-normal">
            ※ 合計が{TOTAL_SCORE.toLocaleString()}になるよう入力してください
          </span>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="flex-1"
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={!isValid}
          isLoading={isSubmitting}
          className="flex-1 disabled:cursor-not-allowed"
        >
          {isSubmitting ? <FontAwesomeIcon icon={faSpinner} spin /> : "保存"}
        </Button>
      </div>
    </form>
  );
}
