"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInAnonymouslyAndCreateUser } from "@/lib/firebase";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setError("");
    setLoading(true);

    try {
      await signInAnonymouslyAndCreateUser();
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error && "code" in err && err.code === "auth/operation-not-allowed") {
        setError("匿名ログインがFirebaseで有効になっていません");
      } else {
        setError("開始処理中にエラーが発生しました");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400">
            英文生成ツール
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              会員登録
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              メールアドレスの登録は不要です
            </p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
                <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
                type="button"
                onClick={handleStart}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
              >
                {loading ? "準備中..." : "始める"}
              </button>

            <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
              すでにログインしていますか？{" "}
              <Link href="/login" className="font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2026 英文生成ツール. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
