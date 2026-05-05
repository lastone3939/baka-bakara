# 負けサビ 1億にするまで帰れません

スマホファーストのバカラ資産チャレンジWebゲームです。明日の1億円支払いを背負い、韓国で負けたあとの負けサビ100万円から1億円を目指します。仮想チップのみで遊びます。

## 遊び方

1. `index.html` をブラウザで開く
2. チップを選ぶ
3. PLAYER / BANKER / TIE / BIG TIGER / SMALL TIGER / P PAIR / B PAIR にベット
4. 必要なら選択中のベット先に「ALL IN」
5. 「ベット確定」を押す
6. カードが順番に配られ、バカラのドロールール通りに必要な3枚目だけが追加される
7. 100,000,000円到達でクリア、0円で泳いで帰国

## 実装済み

- ストーリー付きタイトル画面
- スマホ縦画面メインUI
- 明日の1億支払い / 不足額 / 失敗時のストーリー表示
- オールインボタン
- リアル寄りのカードUIと配牌・めくりアニメーション
- バカラの標準ドロールール
- Big Tiger / Small Tiger / Player Pair / Banker Pair サイドベット
- ビッグロード / ビードプレート / 直近トレンド
- 結果画面
- 30個のミッション実績と解除トースト
- スマホ連打時のズーム抑制
- 履歴・統計・収支グラフ
- 所持金・挑戦回数保存
- 破産・1億達成画面
- 全ボタン操作の効果音 / サウンド / バイブ切り替え
- Netlify Drop公開用 `dist/` とZIP
- Render公開用 `render.yaml`
- Supabaseログ保存用SQL
- PWA用 manifest

## 公開準備

詳しい手順は `DEPLOY.md` にまとめています。最短で公開する場合は、`dist/` フォルダまたは `baccarat-100m-release.zip` をNetlify Dropへ入れます。

### Supabase

1. Supabaseで新規プロジェクトを作成
2. SQL Editorで `supabase/schema.sql` を実行
3. Project Settings > API から Project URL と anon/publishable key を控える

### Render

1. GitHubにこのフォルダをpush
2. RenderでBlueprintとして `render.yaml` を使って作成
3. 環境変数を設定
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
4. Deploy

Supabase未設定でもゲーム自体は動きます。その場合、挑戦回数と履歴はブラウザ内保存です。

## 参照したルール

- Tiger Baccarat: Nevada Gaming Control Board rules of play
  - https://www.gaming.nv.gov/siteassets/content/divisions/enforcement/rules-of-play/Tiger_Baccarat.pdf
- Baccarat drawing rules: Colorado baccarat rules, Regulation 30-2814
  - https://www.law.cornell.edu/regulations/colorado/1-CCR-207-1-28

## メモ

`P PAIR 11:1` はプレイヤー最初の2枚が同ランクの時だけ、`B PAIR 11:1` はバンカー最初の2枚が同ランクの時だけ的中します。Either Pairのような「どちらかで的中」の11:1扱いにはしていません。

完全なリセマラ防止はログインやサーバー側の本人識別なしでは限界があります。今の公開版では、ブラウザ内の挑戦IDとSupabaseの挑戦ログを使って挑戦回数を継続管理します。
