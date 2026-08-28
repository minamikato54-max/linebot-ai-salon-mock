import { login } from "./actions";
import { SubmitButton } from "@/components/SubmitButton";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-4">
      <form
        action={login}
        className="w-full max-w-sm rounded-xl bg-white p-6 shadow-sm"
      >
        <h1 className="mb-6 text-center text-lg font-semibold text-stone-800">
          管理画面ログイン
        </h1>

        <label className="mb-2 block text-sm text-stone-800" htmlFor="password">
          パスワード
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          className="mb-4 min-h-11 w-full rounded-lg border border-stone-300 px-3 text-base text-stone-800"
        />

        {error && (
          <p className="mb-4 text-sm text-red-500">
            パスワードが違います。もう一度お試しください。
          </p>
        )}

        <SubmitButton>ログイン</SubmitButton>
      </form>
    </main>
  );
}
