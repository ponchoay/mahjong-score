export interface ScoreRecord {
  id: string;
  date: string;
  player1Score: number;
  player2Score: number;
  player3Score: number;
  player4Score: number;
  createdAt: string;
  updatedAt: string;
}

export interface Config {
  player1Name: string;
  player2Name: string;
  player3Name: string;
  player4Name: string;
  allowedEmails: string;
}

export interface PlayerSummary {
  name: string;
  totalScore: number;
  rank: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface InitialData {
  config: Config;
  years: number[];
  scoresByYear: Record<number, ScoreRecord[]>;
}

export interface ScoreFormData {
  date: string;
  player1Score: number;
  player2Score: number;
  player3Score: number;
  player4Score: number;
}
