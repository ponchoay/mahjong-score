function jsonResponse(body: ApiResponse): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doGet(
  e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.Content.TextOutput {
  const action = e.parameter.action;
  const token = e.parameter.token;
  setEnv(e.parameter.env);

  if (!validateSession(token)) {
    return jsonResponse({ success: false, error: "UNAUTHORIZED" });
  }

  switch (action) {
    case "getScores": {
      const year = Number(e.parameter.year);
      const scores = getScoresByYear(year);
      return jsonResponse({ success: true, data: scores });
    }
    case "getConfig": {
      const config = getConfig();
      return jsonResponse({ success: true, data: config });
    }
    case "getYears": {
      const years = getAvailableYears();
      return jsonResponse({ success: true, data: years });
    }
    case "getInitialData": {
      const data = getInitialData();
      return jsonResponse({ success: true, data });
    }
    default:
      return jsonResponse({
        success: false,
        error: "UNKNOWN_ACTION",
        message: `Unknown action: ${action}`,
      });
  }
}

function doPost(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  const body = JSON.parse(e.postData.contents);
  const action = body.action as string;
  setEnv(body.env as string);

  if (action === "login") {
    return jsonResponse(handleLogin(body.googleIdToken as string));
  }

  const token = body.token as string;
  if (!validateSession(token)) {
    return jsonResponse({ success: false, error: "UNAUTHORIZED" });
  }

  switch (action) {
    case "addScore":
      return jsonResponse(
        addScore(
          body.date,
          Number(body.player1Score),
          Number(body.player2Score),
          Number(body.player3Score),
          Number(body.player4Score),
        ),
      );
    case "updateScore":
      return jsonResponse(
        updateScore(
          body.id,
          body.date,
          Number(body.player1Score),
          Number(body.player2Score),
          Number(body.player3Score),
          Number(body.player4Score),
        ),
      );
    case "deleteScore":
      return jsonResponse(deleteScore(body.id));
    case "logout":
      deleteSession(token);
      return jsonResponse({ success: true });
    default:
      return jsonResponse({
        success: false,
        error: "UNKNOWN_ACTION",
        message: `Unknown action: ${action}`,
      });
  }
}
