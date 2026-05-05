# Browser Harness OSS setup

このリポジトリには、無料OSS版の `browser-use` を `uv` で入れています。
Python は `3.12` 固定です。

## 確認

```bash
python3 -m uv run browser-use doctor
```

現状はローカルブラウザ操作に必要な本体は動きます。Cloudflare tunnel と profile-use は任意です。

## ローカルゲームを開く

```bash
python3 -m uv run browser-use --headed open file:///Users/shimizunozomu/Documents/Codex/2026-04-24/x/index.html
python3 -m uv run browser-use state
```

## MCPサーバーとして起動

Codexや他のエージェントから接続したい場合は、別ターミナルで次を起動します。

```bash
python3 -m uv run browser-use --mcp
```

CAPTCHA回避や海外プロキシが必要な用途はCloud版の領域です。このゲームのローカル確認と公開確認はOSS版で十分です。
