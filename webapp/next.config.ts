import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ngrok経由でのアクセス時、開発サーバーが未知のオリジンからのリクエスト
  // （JSチャンク取得・HMR用WebSocket等）を403でブロックしてしまい、
  // クライアント側の動作がおかしくなる（ボタンが反応しない等）ことがあるため許可する
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
};

export default nextConfig;
