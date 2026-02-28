function getSpreadsheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getConfigSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  return getSpreadsheet().getSheetByName("config")!;
}

let _scoresSheetName = "scores";

function setEnv(env: string): void {
  _scoresSheetName = env === "development" ? "scores_dev" : "scores";
}

function getScoresSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  return getSpreadsheet().getSheetByName(_scoresSheetName)!;
}

function getSessionsSheet(): GoogleAppsScript.Spreadsheet.Sheet {
  return getSpreadsheet().getSheetByName("sessions")!;
}

function getConfig(): ConfigData {
  const sheet = getConfigSheet();
  const data = sheet.getDataRange().getValues();
  const config: Record<string, string> = {};

  for (const row of data) {
    config[String(row[0])] = String(row[1]);
  }

  return {
    player1Name: config["player1Name"] || "Player 1",
    player2Name: config["player2Name"] || "Player 2",
    player3Name: config["player3Name"] || "Player 3",
    player4Name: config["player4Name"] || "Player 4",
    allowedEmails: config["allowedEmails"] || "",
  };
}

function isEmailAllowed(email: string): boolean {
  const config = getConfig();
  const allowed = config.allowedEmails
    .split(",")
    .map((e) => e.trim().toLowerCase());
  return allowed.includes(email.toLowerCase());
}
