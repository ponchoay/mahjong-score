# 麻雀スコア管理アプリ - アーキテクチャドキュメント

## 概要

家族4人（固定メンバー）の麻雀スコアを管理するWebアプリ。日付と4人の素点を記録し、年間の集計・ランキングを表示する。

---

## 1. システム構成

```
[Cloudflare Pages]                    [Google Cloud]
  React SPA (Vite build)    POST       GAS Web App
  - ログインページ         -------->   - doPost() のみ（全API統一）
  - スコアページ           <--------
                            JSON
  @react-oauth/google                  Google Spreadsheet
  - ID token取得                       - scores / scores_dev シート
                                       - config シート
        |                              - sessions シート
        v                                     |
  Google OAuth 2.0                            v
  consent screen                     Google tokeninfo API
                                     ID token検証（ログイン時のみ）
```

- フロントエンドは Cloudflare Pages で静的ホスティング
- バックエンドは Google Apps Script (GAS) Web App
- データは Google スプレッドシートに保存
- **セキュリティ上の理由で、全APIをPOSTに統一**（GETだとトークンがURLに露出するため）

---

## 2. 技術スタック

### フロントエンド

| 技術 | バージョン | 用途 |
|------|-----------|------|
| React | 19.0.0 | UIフレームワーク |
| TypeScript | ~5.7.0 | 型安全 |
| Vite | 6.2.0 | ビルドツール |
| React Router | 7.2.0 | ルーティング（`/login`, `/`） |
| Tailwind CSS | 4.0.0 | スタイリング |
| SWR | 2.3.2 | データフェッチング（stale-while-revalidate） |
| @react-oauth/google | 0.12.1 | Google OAuth認証 |
| FontAwesome | 7.2.0 | アイコン |
| Biome | 1.9.4 | リンター＆フォーマッター |
| Bun | - | パッケージマネージャー＆ランタイム |

### バックエンド

| 技術 | 用途 |
|------|------|
| Google Apps Script (GAS) | APIサーバー |
| clasp + TypeScript | GASのローカル開発・デプロイ |
| Google Spreadsheet | データストア |

---

## 3. 認証フロー

### セッション管理方式
- **有効期限**: 3ヶ月（月1回の利用頻度を想定）
- **保存先**: localStorage（GASが別ドメインのためCookieは使えない）

### 初回ログイン
1. アプリを開く → localStorageにセッショントークンがない → `/login` へ
2. 「Googleでログイン」→ Google OAuth同意画面
3. Google ID token を取得
4. GASの `login` APIに送信 → GASが tokeninfo API で検証 + 許可メールリストと照合
5. 認証OK → カスタムセッショントークン（UUID）を生成、`sessions`シートに保存
6. トークンをフロントに返却 → localStorageに保存 → `/` へリダイレクト

### 2回目以降（3ヶ月以内）
1. API呼び出し時にlocalStorageのトークンを自動付与
2. GASが `sessions` シートで照合 + 有効期限チェック
3. 期限切れ → `UNAUTHORIZED` エラー → ログインページへリダイレクト

---

## 4. データモデル

### `scores` シート（`scores_dev` は開発用）

| カラム | 型 | 説明 |
|--------|-----|------|
| `id` | string | UUID v4 |
| `date` | string | 試合日（`YYYY-MM-DD`） |
| `player1Score` | number | プレイヤー1の素点 |
| `player2Score` | number | プレイヤー2の素点 |
| `player3Score` | number | プレイヤー3の素点 |
| `player4Score` | number | プレイヤー4の素点 |
| `createdAt` | string | 作成日時（ISO 8601） |
| `updatedAt` | string | 更新日時（ISO 8601） |

### `config` シート

| キー | 説明 |
|------|------|
| `player1Name` ~ `player4Name` | プレイヤー表示名 |
| `allowedEmails` | 許可メールアドレス（カンマ区切り） |

### `sessions` シート

| カラム | 型 | 説明 |
|--------|-----|------|
| `token` | string | セッショントークン（UUID v4） |
| `email` | string | メールアドレス |
| `name` | string | 表示名 |
| `createdAt` | string | 作成日時（ISO 8601） |
| `expiresAt` | string | 有効期限（作成から3ヶ月後） |

---

## 5. API設計

全APIは `doPost` で処理。`action` フィールドで分岐する。

### リクエスト形式
- Method: `POST`
- Content-Type: `text/plain;charset=utf-8`（プリフライトリクエスト回避）
- Body: JSON文字列（`action`, `token`, `env` + アクション固有パラメータ）

### レスポンス形式
GAS Web Appは HTTPステータスコードをカスタマイズできないため、ボディ内のJSONでエラーを表現する。

```jsonc
// 成功時
{ "success": true, "data": { ... } }

// エラー時
{ "success": false, "error": "UNAUTHORIZED" }
{ "success": false, "error": "VALIDATION_ERROR", "message": "..." }
```

### APIアクション一覧

| アクション | 認証 | 説明 |
|-----------|------|------|
| `login` | Google ID token | ログイン → セッショントークン発行 |
| `getConfig` | セッショントークン | プレイヤー名などの設定取得 |
| `getYears` | セッショントークン | データ存在年の一覧 |
| `getScores` | セッショントークン | 指定年のスコア一覧（`year` パラメータ） |
| `getInitialData` | セッショントークン | config + years + 全年スコアを一括取得 |
| `addScore` | セッショントークン | 試合追加（素点合計100,000チェック付き） |
| `updateScore` | セッショントークン | 試合編集 |
| `deleteScore` | セッショントークン | 試合削除 |
| `logout` | セッショントークン | セッション削除 |

---

## 6. ディレクトリ構成

```
mahjong-score/
├── gas/                            # GASバックエンド
│   ├── src/
│   │   ├── main.ts                 # doGet/doPost エントリーポイント
│   │   ├── auth.ts                 # 認証（ID token検証、セッション管理）
│   │   ├── scores.ts               # スコアCRUD
│   │   ├── config.ts               # 設定読み込み・シート管理・環境分岐
│   │   ├── types.ts                # GAS用型定義
│   │   └── appsscript.json         # GASマニフェスト
│   ├── .clasp.json                 # clasp設定（scriptId, rootDir: "src"）
│   └── tsconfig.json               # GAS用TypeScript設定
├── src/                            # フロントエンド
│   ├── main.tsx                    # エントリーポイント
│   ├── app.tsx                     # ルーティング定義
│   ├── index.css                   # Tailwind CSS
│   ├── types/
│   │   └── index.ts                # 型定義
│   ├── pages/
│   │   ├── loginPage.tsx           # ログインページ
│   │   └── scorePage.tsx           # スコア管理ページ
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx          # 汎用ボタン
│   │   │   └── card.tsx            # 汎用カード
│   │   ├── auth/
│   │   │   └── googleLoginButton.tsx
│   │   ├── layout/
│   │   │   ├── layout.tsx          # レイアウト
│   │   │   └── header.tsx          # ヘッダー
│   │   └── scores/
│   │       ├── scoreTable.tsx      # スコア一覧
│   │       ├── scoreRow.tsx        # スコア行
│   │       ├── scoreForm.tsx       # スコア入力フォーム
│   │       ├── scoreModal.tsx      # 追加/編集モーダル（HTML Dialog API）
│   │       ├── summaryCard.tsx     # 年間サマリー・ランキング
│   │       ├── deleteDialog.tsx    # 削除確認ダイアログ
│   │       └── yearSelector.tsx    # 年選択
│   ├── contexts/
│   │   └── authContext.tsx         # 認証状態管理
│   ├── hooks/
│   │   ├── useAuth.ts              # 認証フック
│   │   ├── useScores.ts            # スコア取得（SWR）
│   │   ├── useConfig.ts            # 設定取得（SWR）
│   │   ├── useSummary.ts           # サマリー計算（基準点25,000からの差分）
│   │   └── useInitialData.ts       # 初期データ一括取得 + SWRキャッシュ投入
│   └── lib/
│       ├── apiClient.ts            # GAS API通信の一元管理
│       └── constants.ts            # 定数（GAS_URL, GOOGLE_CLIENT_IDなど）
├── public/
│   ├── _headers                    # Cloudflare Pages COOP設定
│   └── _redirects                  # SPA用リダイレクト
├── biome.json
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 7. 実装上の注意点

### GAS関連
- **コールドスタート**: 数秒かかることがある → SWRの `keepPreviousData` でUX改善
- **デプロイ更新**: コード変更時は既存デプロイの「バージョン更新」で同一URLを維持。「新しいデプロイ」を作るとURLが変わるので注意
- **環境分岐**: `env` パラメータで `scores` / `scores_dev` シートを切り替え
- **ファイル間参照**: GASは全ファイルが1つのグローバルスコープ。`import`/`export` は使わない
- **ログ**: `console.log` ではなく `Logger.log` を使用

### フロントエンド関連
- **素点合計チェック**: フロント（フォーム入力時）とGAS（保存時）の両方で100,000点チェック
- **スコア計算**: 各プレイヤーのスコアから基準点25,000を差し引いて通算成績を算出
- **モーダル**: ネイティブの HTML `<dialog>` API（`showModal()` / `close()`）を使用
- **初期データ**: `getInitialData` で config・years・全年スコアを一括取得し、個別のSWRキャッシュに投入

---

## 8. セットアップ手順

### 前提条件
- Bun がインストール済み
- Google アカウント

### ローカル開発環境

#### 1. Google Cloud Console
1. プロジェクトを新規作成
2. OAuth 同意画面を設定（外部 + テストモード）
3. テストユーザーに家族のメールアドレスを追加
4. OAuth 2.0 クライアント ID を作成（ウェブアプリケーション）
5. JavaScript 生成元に `http://localhost:5173` を追加
6. クライアント ID をメモ

#### 2. Google スプレッドシート
1. スプレッドシートを新規作成
2. `scores` シートを作成（ヘッダー: `id` / `date` / `player1Score` ~ `player4Score` / `createdAt` / `updatedAt`）
3. `config` シートを作成（`player1Name` ~ `player4Name` / `allowedEmails`）
4. `sessions` シートを作成（ヘッダー: `token` / `email` / `name` / `createdAt` / `expiresAt`）

#### 3. GAS プロジェクト
1. スプレッドシートから「拡張機能 → Apps Script」でGASプロジェクトを開く
2. スクリプト ID をメモ
3. `clasp login` で認証
4. `gas/.clasp.json` にスクリプト ID と `"rootDir": "src"` を設定
5. `bun run gas:deploy` を実行
6. GASエディタから Web App としてデプロイ（実行: 自分、アクセス: 全員）
7. デプロイ URL をメモ

#### 4. 環境変数
`.env.example` をコピーして `.env` を作成し、以下を設定:
```
VITE_GAS_URL=<デプロイURL>
VITE_GOOGLE_CLIENT_ID=<クライアントID>
```

#### 5. 起動
```bash
bun install
bun run dev
```

### 本番デプロイ（Cloudflare Pages）

1. Cloudflare Pages でプロジェクトを作成し、GitHub リポジトリと連携
2. ビルド設定: コマンド `bun run build`、出力ディレクトリ `dist`
3. 環境変数に `VITE_GOOGLE_CLIENT_ID` と `VITE_GAS_URL` を設定
4. Google Cloud Console の OAuth クライアント ID に本番URLを追加

### npmスクリプト

| コマンド | 説明 |
|---------|------|
| `bun run dev` | 開発サーバー起動 |
| `bun run build` | 本番ビルド |
| `bun run check` | Biome リント＆フォーマット |
| `bun run gas:typecheck` | GAS TypeScript 型チェック |
| `bun run gas:push` | GAS コードをpush |
| `bun run gas:deploy` | 型チェック → push |
