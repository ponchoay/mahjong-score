function verifyGoogleIdToken(
  idToken: string,
): { email: string; name: string } | null {
  const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`;
  try {
    const response = UrlFetchApp.fetch(url, { muteHttpExceptions: true });
    const code = response.getResponseCode();
    if (code !== 200) return null;

    const payload = JSON.parse(response.getContentText());
    return {
      email: payload.email as string,
      name: (payload.name as string) || payload.email,
    };
  } catch {
    return null;
  }
}

function createSession(email: string, name: string): string {
  const sheet = getSessionsSheet();
  const token = Utilities.getUuid();
  const now = new Date();
  const expiresAt = new Date(now.getTime());
  expiresAt.setMonth(expiresAt.getMonth() + 3);

  sheet.appendRow([
    token,
    email,
    name,
    now.toISOString(),
    expiresAt.toISOString(),
  ]);

  return token;
}

function validateSession(token: string): boolean {
  if (!token) return false;

  const sheet = getSessionsSheet();
  const data = sheet.getDataRange().getValues();
  const now = new Date();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][0]) === token) {
      const expiresAt = new Date(String(data[i][4]));
      return now < expiresAt;
    }
  }

  return false;
}

function deleteSession(token: string): void {
  if (!token) return;

  const sheet = getSessionsSheet();
  const data = sheet.getDataRange().getValues();

  for (let i = data.length - 1; i >= 1; i--) {
    if (String(data[i][0]) === token) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function handleLogin(googleIdToken: string): ApiResponse {
  const user = verifyGoogleIdToken(googleIdToken);
  if (!user) {
    return { success: false, error: "INVALID_TOKEN", message: "無効なトークンです" };
  }

  if (!isEmailAllowed(user.email)) {
    return {
      success: false,
      error: "UNAUTHORIZED",
      message: "このアカウントはアクセスを許可されていません",
    };
  }

  const token = createSession(user.email, user.name);
  return {
    success: true,
    data: { token, name: user.name, email: user.email },
  };
}
