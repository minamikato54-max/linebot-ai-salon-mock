import { createHash } from "crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";

function expectedSessionValue(): string {
  const password = process.env.ADMIN_PASSWORD ?? "";
  return createHash("sha256").update(password).digest("hex");
}

export function checkAdminPassword(inputPassword: string): boolean {
  const password = process.env.ADMIN_PASSWORD ?? "";
  // ADMIN_PASSWORD未設定の場合は常に不許可（空パスワードでのログインを防ぐ）
  return password.length > 0 && inputPassword === password;
}

export function createSessionValue(): string {
  return expectedSessionValue();
}

export function isValidSessionValue(value: string | undefined): boolean {
  if (!value) return false;
  return value === expectedSessionValue();
}
