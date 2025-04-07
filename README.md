# Anything in Anykeys

ジャズなどのインプロヴィゼーションを行うミュージシャン向けのフレーズ管理・共有サービス「Anything in Anykeys」のリポジトリです。

## 特徴

- ABC notation形式でのフレーズ登録・管理
- 全12キーへの自動移調表示
- タグによるフレーズの分類・検索
- ユーザー定義タグの管理 (追加・削除)
- プリセットタグの提供
- Googleアカウントによる認証

## 技術スタック

- **フレームワーク:** Next.js (App Router)
- **言語:** TypeScript
- **データベース:** PostgreSQL
- **ORM:** Prisma
- **認証:** NextAuth.js (Auth.js v5)
- **UI:** Tailwind CSS
- **楽譜描画:** abcjs
- **コンテナ:** Docker, Docker Compose

## 開発環境セットアップ

### 必要なもの

- Node.js (v20推奨)
- Docker Desktop
- Google Cloud Platformアカウント (OAuth認証情報用)

### 手順

1.  **リポジトリのクローン:**
    ```bash
    git clone https://github.com/dainakai/anythinginanykeys.git
    cd anythinginanykeys
    ```

2.  **環境変数の設定:**
    `.env.example` をコピーして `.env` ファイルを作成します。
    ```bash
    cp .env.example .env
    ```
    `.env` ファイルを開き、以下の項目を設定してください:
    - `POSTGRES_PASSWORD`: 任意のパスワード (デフォルト: `password`)
    - `GOOGLE_CLIENT_ID`: Google Cloud Console で取得したクライアントID
    - `GOOGLE_CLIENT_SECRET`: Google Cloud Console で取得したクライアントシークレット
    - `NEXTAUTH_SECRET`: 任意のランダムな文字列 (例: `openssl rand -hex 32` で生成)
    - `NEXTAUTH_URL`: `http://localhost:3000` (ローカル開発環境の場合)

3.  **Dockerコンテナのビルドと起動:**
    ```bash
    docker-compose up --build -d
    ```
    初回起動時にはデータベースのマイグレーションが自動的に実行されます。

4.  **(初回のみ) プリセットタグの投入:**
    アプリケーションで共通利用するプリセットタグをデータベースに登録します。
    ```bash
    npm run seed
    ```
    (このコマンドは Docker コンテナ内で Seed スクリプトを実行します)

5.  **アクセス:**
    ブラウザで `http://localhost:3000` にアクセスします。

### 便利なコマンド

- **コンテナの停止:** `docker-compose down`
- **データベースのリセット:**
  ```bash
  docker-compose down -v # ボリュームごと削除
  docker-compose up --build -d
  npm run seed # プリセットタグ再投入
  ```
- **Prisma Studio (データベースGUI):**
  `docker-compose.yml` で `web` サービスのポート `5555` が公開されています。
  ```bash
  docker-compose exec web npx prisma studio
  ```
  その後、ブラウザで `http://localhost:5555` にアクセスします。

## 機能概要

- **ダッシュボード (`/dashboard`):**
  - ログインユーザーが登録したフレーズを一覧表示します。
  - フレーズのページネーション、ソート（新着順/古い順）、タグによるフィルタリング（「タグなし」含む）が可能です。
  - 各フレーズカードのタグをクリックしてもフィルタリングできます。
  - 「新しいフレーズを作成」ボタンからフレーズ登録ページへ遷移します。
  - 「タグを管理」ボタンからタグ管理ページへ遷移します。
- **フレーズ詳細 (`/phrases/[id]`):**
  - フレーズの ABC Notation、メタデータ（キー、コメント、タグ等）を表示します。
  - 全12キーに移調された楽譜を表示します。
  - 編集ボタン、削除ボタン（未実装）があります。
- **フレーズ登録 (`/phrases/new`):**
  - ABC Notation、コメント、タグ（カンマ区切り）を入力して新しいフレーズを作成します。
  - ABC Notation のリアルタイムプレビューと構文チェックが行われます。
  - タグ入力時には既存のタグがサジェストされます。
- **フレーズ編集 (`/phrases/[id]/edit`):**
  - 既存のフレーズ情報を編集します。
  - 登録時と同様のプレビュー、バリデーション、タグサジェスト機能があります。
- **タグ管理 (`/dashboard/tags`):**
  - プリセットタグとユーザー定義タグを一覧表示します。
  - 新しいユーザー定義タグを作成できます。
  - ユーザー定義タグを削除できます（関連するフレーズは削除されません）。

## 今後の開発予定

Issue や `docs/tasks.md` を参照してください。
