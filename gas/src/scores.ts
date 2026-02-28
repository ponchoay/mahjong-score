const TOTAL_SCORE = 100000;

function validateScoreTotal(
  p1: number,
  p2: number,
  p3: number,
  p4: number,
): boolean {
  return p1 + p2 + p3 + p4 === TOTAL_SCORE;
}

function getAllScores(): ScoreRecord[] {
  const sheet = getScoresSheet();
  const data = sheet.getDataRange().getValues();
  const records: ScoreRecord[] = [];

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    records.push({
      id: String(row[0]),
      date: String(row[1]),
      player1Score: Number(row[2]),
      player2Score: Number(row[3]),
      player3Score: Number(row[4]),
      player4Score: Number(row[5]),
      createdAt: String(row[6]),
      updatedAt: String(row[7]),
    });
  }

  return records;
}

function getScoresByYear(year: number): ScoreRecord[] {
  return getAllScores().filter(
    (s) => new Date(s.date).getFullYear() === year,
  );
}

function getAvailableYears(): number[] {
  const scores = getAllScores();
  const years = new Set<number>();

  for (const s of scores) {
    years.add(new Date(s.date).getFullYear());
  }

  return Array.from(years).sort((a, b) => a - b);
}

function getInitialData(): InitialData {
  const config = getConfig();
  const allScores = getAllScores();

  const scoresByYear: Record<number, ScoreRecord[]> = {};
  const yearsSet = new Set<number>();

  for (const score of allScores) {
    const year = new Date(score.date).getFullYear();
    yearsSet.add(year);
    if (!scoresByYear[year]) {
      scoresByYear[year] = [];
    }
    scoresByYear[year].push(score);
  }

  const years = Array.from(yearsSet).sort((a, b) => a - b);
  return { config, years, scoresByYear };
}

function addScore(
  date: string,
  p1: number,
  p2: number,
  p3: number,
  p4: number,
): ApiResponse {
  if (!validateScoreTotal(p1, p2, p3, p4)) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      message: `素点の合計が${TOTAL_SCORE.toLocaleString()}ではありません`,
    };
  }

  const sheet = getScoresSheet();
  const id = Utilities.getUuid();
  const now = new Date().toISOString();

  sheet.appendRow([id, date, p1, p2, p3, p4, now, now]);

  return { success: true, data: { id } };
}

function updateScore(
  id: string,
  date: string,
  p1: number,
  p2: number,
  p3: number,
  p4: number,
): ApiResponse {
  if (!validateScoreTotal(p1, p2, p3, p4)) {
    return {
      success: false,
      error: "VALIDATION_ERROR",
      message: `素点の合計が${TOTAL_SCORE.toLocaleString()}ではありません`,
    };
  }

  const sheet = getScoresSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === id) {
      const row = i + 1;
      const now = new Date().toISOString();
      sheet.getRange(row, 2, 1, 6).setValues([[date, p1, p2, p3, p4, data[i][6]]]);
      sheet.getRange(row, 8).setValue(now);
      return { success: true, data: { id } };
    }
  }

  return { success: false, error: "NOT_FOUND", message: "スコアが見つかりません" };
}

function deleteScore(id: string): ApiResponse {
  const sheet = getScoresSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }

  return { success: false, error: "NOT_FOUND", message: "スコアが見つかりません" };
}
