# 無料公開手順

一番簡単に公開するなら、Netlify DropでOKです。SupabaseやRenderは、後からログ保存や本格運用をしたくなった時だけで大丈夫です。

## 1. Netlify Dropで公開

1. `npm run build` を実行して `dist/` を作る
2. https://app.netlify.com/drop を開く
3. `dist/` フォルダ、または `baccarat-100m-release.zip` をドラッグ&ドロップ
4. 出てきたURLをスマホで開いて確認

## 同じURLでアップデートする方法

同じURLを育てたい場合は、Netlifyにログインしてサイトを自分のアカウントに紐づけます。

1. Netlifyにログイン
2. 公開済みサイトを開く
3. Deploys画面へ行く
4. 新しい `dist/` または `baccarat-100m-release.zip` をアップロード

ログインせずにDropだけで作ったURLは、あとで同じURLに更新できない場合があります。公開前にログインしておくのが一番安全です。

## 公開後チェック

- スマホでURLを開く
- タイトル画面が出る
- 連打しても画面がズームしない
- ベットしてカードが配られる
- 結果画面が出る
- ミッション実績画面に30個表示される
- 履歴・ロードが増える

## 追加で本格運用したい場合

Supabaseを使うと挑戦ログを保存できます。未設定でもゲーム自体は動き、挑戦回数と履歴はブラウザ内に保存されます。

### Supabase

1. Supabaseで新規プロジェクトを作る
2. SQL Editorで `supabase/schema.sql` を実行
3. Project Settings > API でProject URLとanon / publishable keyを控える

### Render

1. GitHubにこのフォルダをpush
2. RenderでNew > Blueprint
3. `render.yaml` が読まれた状態で作成
4. 環境変数を入れる
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
5. Deploy

## 無料で動かすコツ

- Netlify Dropだけならクレカなしで始めやすいです
- 画像はPNGのみ公開されるように `dist/` に絞っています
- Supabase未設定でもゲームは動きます
- 本番では公開してよいanon / publishable keyだけを使います
