import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Navigate } from "react-router";
import { useSWRConfig } from "swr";
import { Layout } from "../components/layout/layout.tsx";
import { DeleteDialog } from "../components/scores/deleteDialog.tsx";
import { ScoreModal } from "../components/scores/scoreModal.tsx";
import { ScoreTable } from "../components/scores/scoreTable.tsx";
import { SummaryCard } from "../components/scores/summaryCard.tsx";
import { YearSelector } from "../components/scores/yearSelector.tsx";
import { Button } from "../components/ui/button.tsx";
import { Card } from "../components/ui/card.tsx";
import { useAuth } from "../hooks/useAuth.ts";
import { useConfig } from "../hooks/useConfig.ts";
import { useInitialData } from "../hooks/useInitialData.ts";
import { useScores, useYears } from "../hooks/useScores.ts";
import { useSummary } from "../hooks/useSummary.ts";
import { apiPost } from "../lib/apiClient.ts";
import type { ScoreFormData, ScoreRecord } from "../types/index.ts";

export function ScorePage() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <AuthenticatedScorePage />;
}

function AuthenticatedScorePage() {
  useInitialData();
  const { mutate: globalMutate } = useSWRConfig();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ScoreRecord | undefined>();
  const [deleteTarget, setDeleteTarget] = useState<ScoreRecord | undefined>();

  const { data: config } = useConfig();
  const { data: years } = useYears();
  const { data: scores, mutate: mutateScores } = useScores(selectedYear);
  const summaries = useSummary(scores, config);

  const availableYears = years
    ? [...new Set([...years, currentYear])].sort((a, b) => b - a)
    : [currentYear];

  const handleAdd = () => {
    setEditTarget(undefined);
    setModalOpen(true);
  };

  const handleEdit = (score: ScoreRecord) => {
    setEditTarget(score);
    setModalOpen(true);
  };

  const handleDelete = (score: ScoreRecord) => {
    setDeleteTarget(score);
  };

  const handleSubmit = async (data: ScoreFormData) => {
    if (editTarget) {
      await apiPost("updateScore", {
        id: editTarget.id,
        date: data.date,
        player1Score: data.player1Score,
        player2Score: data.player2Score,
        player3Score: data.player3Score,
        player4Score: data.player4Score,
      });
    } else {
      await apiPost("addScore", {
        date: data.date,
        player1Score: data.player1Score,
        player2Score: data.player2Score,
        player3Score: data.player3Score,
        player4Score: data.player4Score,
      });
    }
    setModalOpen(false);
    setEditTarget(undefined);
    await mutateScores();
    await globalMutate("years");
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    await apiPost("deleteScore", { id: deleteTarget.id });
    setDeleteTarget(undefined);
    await mutateScores();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <YearSelector
          years={availableYears}
          selectedYear={selectedYear}
          onSelect={setSelectedYear}
        />

        <SummaryCard summaries={summaries} gameCount={scores?.length ?? 0} />

        <div>
          <Button type="button" variant="primary" fullWidth onClick={handleAdd}>
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            試合を追加
          </Button>
        </div>

        <Card>
          {config && scores ? (
            <ScoreTable
              scores={scores}
              config={config}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <p className="py-8 text-center text-sm text-gray-400">
              読み込み中...
            </p>
          )}
        </Card>
      </div>

      {config && (
        <ScoreModal
          isOpen={modalOpen}
          config={config}
          editTarget={editTarget}
          onSubmit={handleSubmit}
          onClose={() => {
            setModalOpen(false);
            setEditTarget(undefined);
          }}
        />
      )}

      <DeleteDialog
        isOpen={!!deleteTarget}
        date={deleteTarget?.date ?? ""}
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteTarget(undefined)}
      />
    </Layout>
  );
}
