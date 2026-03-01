function jsonResponse(body: ApiResponse): GoogleAppsScript.Content.TextOutput {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

// GETリクエストはセキュリティ上の理由で無効化
// トークンがURLクエリパラメータに含まれるとログやRefererヘッダで漏洩するため、全APIをPOSTに統一
function doGet(
  _e: GoogleAppsScript.Events.DoGet,
): GoogleAppsScript.Content.TextOutput {
  return jsonResponse({
    success: false,
    error: "METHOD_NOT_ALLOWED",
    message: "GETリクエストは無効です。POSTを使用してください。",
  });
}

function doPost(
  e: GoogleAppsScript.Events.DoPost,
): GoogleAppsScript.Content.TextOutput {
  let body: Record<string, unknown>;
  try {
    body = JSON.parse(e.postData?.contents ?? "{}");
  } catch {
    return jsonResponse({
      success: false,
      error: "INVALID_REQUEST",
      message: "リクエストの形式が不正です",
    });
  }
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
    case "getScores": {
      const year = Number(body.year);
      const scores = getScoresByYear(year);
      return jsonResponse({ success: true, data: scores });
    }
    case "getConfig": {
      const config = getPublicConfig();
      return jsonResponse({ success: true, data: config });
    }
    case "getInitialData": {
      const data = getInitialData();
      return jsonResponse({ success: true, data });
    }
    case "addScore":
      return jsonResponse(
        addScore(
          body.date as string,
          Number(body.player1Score),
          Number(body.player2Score),
          Number(body.player3Score),
          Number(body.player4Score),
        ),
      );
    case "updateScore":
      return jsonResponse(
        updateScore(
          body.id as string,
          body.date as string,
          Number(body.player1Score),
          Number(body.player2Score),
          Number(body.player3Score),
          Number(body.player4Score),
        ),
      );
    case "deleteScore":
      return jsonResponse(deleteScore(body.id as string));
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
