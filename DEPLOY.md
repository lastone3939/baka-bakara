# 無料公開手順

一番簡単に公開するなら、Netlify DropでOKです。ログインなしでも公式10回チャレンジは端末内に保存されます。Googleで強い達成証明を残したい場合だけ、あとからSupabaseを設定します。

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
- ログインなしで公式チャレンジを開始できる
- 連打しても画面がズームしない
- ベットしてカードが配られる
- 競馬・競艇・競輪に切り替えて単勝レースが始まる
- 結果画面が出る
- ミッション実績画面に30個表示される
- 履歴・ロードが増える
- クリア画面や破産画面に証明IDが出る

## 追加で本格運用したい場合

Supabaseを使うとGoogleログイン、Google IDごとの公式挑戦10回証明、挑戦ログ保存が有効になります。未設定でもゲーム自体は動き、10回の公式挑戦と履歴はブラウザ内に保存されます。

### 10回チャレンジの考え方

- まずはログインなしで公開してOKです
- 同じスマホ/同じブラウザなら、再読込しても公式回数は続きからになります
- キャッシュを消されると端末保存はリセットできます
- IP制限は誤判定が多く、家族や同じWi-Fiの人まで巻き込むので、このゲームでは必須にしません
- スクショで証明したい時は、クリア画面の「証明ID」と「公式何回目」を一緒に見せます
- より強く証明したい時だけGoogleログインを有効にします

### Supabase

1. Supabaseで新規プロジェクトを作る
2. Authentication > Providers でGoogleを有効化する
3. Google Cloud側でOAuth Clientを作り、SupabaseのCallback URLを登録する
4. SQL Editorで `supabase/schema.sql` を実行
5. Project Settings > API でProject URLとanon / publishable keyを控える
6. Netlify / Render側に `SUPABASE_URL` と `SUPABASE_PUBLISHABLE_KEY` を設定する

`supabase/schema.sql` には、10回制限をクライアント改ざんに寄せないための `consume_official_attempt()` RPCも含めています。

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
- 実際のお金や景品抽選処理はアプリ内に入れていません
