# 配送業界 NEWS BOARD

PC・スマートフォン対応の配送・物流ニュースアプリです。GitHub Actionsが1時間ごとにニュースを取得し、GitHub Pagesへ反映します。

## GitHub Pages の設定

1. このフォルダーの中身をGitHubリポジトリへアップロードします。
2. リポジトリの「Settings」→「Pages」を開きます。
3. Sourceを「GitHub Actions」にします。
4. 「Actions」画面で「配送ニュース自動更新・公開」を一度手動実行します。

## 更新頻度

`.github/workflows/update-news.yml` の設定により、おおむね1時間ごとに更新されます。GitHub側の混雑状況により開始時刻が前後する場合があります。

## 注意

各記事の見出し・配信元・リンクを表示します。記事本文の著作権は各配信元に帰属します。
