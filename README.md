# ラスワンの負けサビ1億円になるまで帰れません

スマホファーストの逆転チャレンジWebゲームです。明日の1億円支払いを背負い、韓国に残した負けサビ100万円から1億円を目指します。仮想チップのみで遊びます。

## 遊び方

1. `index.html` をブラウザで開く
2. 初回は30秒のストーリーを見る
3. バカラで始め、途中から競馬・競艇・競輪へ切り替える
4. チップを選び、バカラまたは単勝レースにベット
5. 必要なら「ALL IN」
6. 100,000,000円到達でクリア、0円でゲームオーバー
7. ログインなしでも、この端末内に公式10回の挑戦回数が保存されます
8. Supabase + Google認証を設定すると、Google IDごとの達成証明がより強くなります

## 実装済み

- タイトル「ラスワンの負けサビ1億円になるまで帰れません」
- ログイン画面からゲームスタートする入口
- 30秒スキップ不可のRPG風オープニングストーリー
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
- 競馬 8/12頭ランダム・単勝
- 競艇 6艇固定・単勝
- 競輪 9車固定・単勝
- レース系は控除率25%想定、最大20倍までのオッズ生成
- レースの表示オッズは内部勝率から逆算し、穴馬・穴艇・穴車は実際に来づらい
- 競馬・競艇・競輪のSVGアイコン演出
- レースの抜きつ抜かれつ15秒演出
- ログインなし端末保存の公式10回チャレンジ
- Googleログイン設定時の公式達成証明
- 10回終了後のリベンジプレイ継続
- お客さん向けUIではSupabaseなどの管理用語を非表示
- クリア後のX投稿導線
- 全ボタン操作の効果音 / サウンド / バイブ切り替え
- 競馬110種類、競艇100種類、競輪107種類のランダム出場名
- レース実況165パターン超のシュール演出テキスト
- ラスワン4表情をタイトル/実況/結果で使い分け
- Netlify Drop公開用 `dist/` とZIP
- Render公開用 `render.yaml`
- Supabaseログ保存用SQL
- PWA用 manifest

### 開発者向け

- OSS版 Browser Harness (`browser-use`) のローカル操作環境
- 100パターン超のレース実況テキスト

## 公開準備

詳しい手順は `DEPLOY.md` にまとめています。最短で公開する場合は、`dist/` フォルダまたは `baccarat-100m-release.zip` をNetlify Dropへ入れます。

### Supabase

1. Supabaseで新規プロジェクトを作成
2. Authentication > ProvidersでGoogleを有効化
3. SQL Editorで `supabase/schema.sql` を実行
4. Project Settings > API から Project URL と anon/publishable key を控える

### Render

1. GitHubにこのフォルダをpush
2. RenderでBlueprintとして `render.yaml` を使って作成
3. 環境変数を設定
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`
4. Deploy

Supabase未設定でもデモモードでゲーム自体は動きます。その場合、Google ID証明は無効で、挑戦回数と履歴はブラウザ内保存です。

## Browser Harness

OSS版 `browser-use` は `uv` + Python 3.12で導入済みです。

```bash
python3 -m uv run browser-use doctor
```

使い方は `BROWSER_HARNESS.md` を参照してください。

## 参照したルール

- Tiger Baccarat: Nevada Gaming Control Board rules of play
  - https://www.gaming.nv.gov/siteassets/content/divisions/enforcement/rules-of-play/Tiger_Baccarat.pdf
- Baccarat drawing rules: Colorado baccarat rules, Regulation 30-2814
  - https://www.law.cornell.edu/regulations/colorado/1-CCR-207-1-28

## メモ

`P PAIR 11:1` はプレイヤー最初の2枚が同ランクの時だけ、`B PAIR 11:1` はバンカー最初の2枚が同ランクの時だけ的中します。Either Pairのような「どちらかで的中」の11:1扱いにはしていません。

完全なリセマラ防止はログインやサーバー側の本人識別なしでは限界があります。今の公開版では、ブラウザ内の挑戦IDで公式10回を継続管理し、10回後もリベンジプレイとして遊べます。より強い証明が必要な場合だけ、Supabase + Google認証を使います。
