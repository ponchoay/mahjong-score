interface ScoreRecord {
  id: string;
  date: string;
  player1Score: number;
  player2Score: number;
  player3Score: number;
  player4Score: number;
  createdAt: string;
  updatedAt: string;
}

interface ConfigData {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  allowedEmails: string;
}

interface InitialData {
  config: ConfigData;
  years: number[];
  scoresByYear: Record<number, ScoreRecord[]>;
}

interface ApiResponse {
  success: boolean;
  data?: unknown;
  error?: string;
  message?: string;
}
