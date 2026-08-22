AI が英文を自動生成するサービス。ユーザーが登録した英単語や英文法から Claude API を使用して英文を生成し、日本語訳と共に表示できます。

**技術スタック**: Next.js 16 / TypeScript / Firebase / Claude API / Tailwind CSS

## プロジェクトコマンド一覧

### 開発

```bash
npm run dev
```
開発サーバーを起動します。[http://localhost:3000](http://localhost:3000) でアプリケーションにアクセスできます。

### ビルド

```bash
npm run build
```
本番環境用のビルドを実行します。

### 本番実行

```bash
npm run start
```
ビルド済みのアプリケーションを本番環境で実行します。

### コード検査

```bash
npm run lint
```
ESLint を使用してコードの静的解析を実行します。

## Getting Started

開発サーバーを起動するには：

```bash
npm run dev
```

Functionsへのデプロイ
 firebase deploy --only functions

その後、`app/page.tsx` を編集してページを開発できます。ファイルを保存すると自動的にページが更新されます。

このプロジェクトは TypeScript、Tailwind CSS、Firebase、Claude API を使用しています。