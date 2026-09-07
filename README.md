# 遠賀川温泉 おんがの赤湯 — クライアント確認用プレビュー

「遠賀川温泉 おんがの赤湯」のリニューアル提案・確認用の静的プレビューです。本番サイトおよびWordPressテーマではありません。

## 公開URL

https://noroshi-studio.github.io/onga-akayu-client-preview/

オープニング演出を再表示する場合：

https://noroshi-studio.github.io/onga-akayu-client-preview/?intro=1

## 公開されるファイル

GitHub Pagesへ公開されるのは `static-preview/` の中だけです。HTML、CSS、JavaScript、SVG、背景画像、ロゴ画像が含まれます。

WordPressテーマ、テーマZIP、制作資料、スクリプト、プロジェクト直下のその他のファイルは `.gitignore` でGitの追跡対象外にしています。また、GitHub Actionsでも `static-preview/` だけをデプロイ対象に指定しています。

## ローカルで確認する方法

このREADMEがあるフォルダでターミナルを開き、次を実行します。

```sh
cd static-preview
python3 -m http.server 8080
```

ブラウザで http://localhost:8080/ を開きます。確認を終えるときは、ターミナルで `Control + C` を押します。

## GitHub Pagesの仕組み

`main` ブランチへ変更をpushすると、`.github/workflows/pages.yml` のGitHub Actionsが自動で動きます。ビルド処理は行わず、`static-preview/` をそのままGitHub Pagesへアップロードします。公開URLは更新後も変わりません。

手動でも、GitHubのリポジトリ画面にある `Actions` → `Deploy static preview to GitHub Pages` → `Run workflow` から実行できます。

## 修正後に公開する方法

1. `static-preview/` 内のファイルを修正します。
2. ローカルサーバーでPC・スマートフォン表示と操作を確認します。
3. ターミナルで差分を確認します。

   ```sh
   git status
   git diff
   ```

4. 問題がなければcommitして `main` へpushします。

   ```sh
   git add static-preview
   git commit -m "Update static preview"
   git push origin main
   ```

5. GitHubの `Actions` タブで緑色のチェックが付いたことを確認します。反映には数分かかる場合があります。

## Codexへ更新を依頼するときの例文

> `static-preview/` の変更内容を確認し、機密情報や不要ファイルが含まれていないことを検査したうえで、`main` にcommit・pushして同じGitHub Pages URLへ反映してください。公開後にPC・スマートフォン表示と主要操作も確認してください。強制pushは使わないでください。

## GitHub Actionsが失敗した場合

リポジトリ上部の `Actions` を開き、失敗した `Deploy static preview to GitHub Pages` を選びます。赤い印が付いた `deploy` ジョブと、その中の失敗ステップを開くとエラー内容を確認できます。

Pagesの公開元は、`Settings` → `Pages` → `Build and deployment` → `Source` が `GitHub Actions` になっている必要があります。

## オープニング演出

通常は同一タブのセッション中に一度だけ表示されます。再確認するときは、公開URLまたはローカルURLの末尾へ `?intro=1` を付けます。

例：`http://localhost:8080/?intro=1`

## noindexについて

プレビュー期間中は `static-preview/index.html` の `<head>` 内に次の設定があります。

```html
<meta name="robots" content="noindex, nofollow">
```

本番として正式公開するときは、この1行を削除してから公開してください。プレビュー期間中はサイトマップ送信やSearch Console登録を行いません。
