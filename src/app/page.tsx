import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <header className="bg-white dark:bg-slate-900 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            英文生成ツール
          </h1>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="space-y-8">
          <section className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              英語学習を効率化しよう
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              登録した英単語や英文法を使用して、AIが自動で英文を生成します。
              生成した英文を見ながら効率的に英語学習を進めることができます。
            </p>
          </section>

          <section className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              サービスの特徴
            </h3>
            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>英単語と英文法を自分のペースで登録</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>登録した内容からAIが自動で英文を生成</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>生成した英文に日本語訳を表示（タップで切り替え）</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                <span>スマートフォンに対応したレスポンシブデザイン</span>
              </li>
            </ul>
          </section>

          <section className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Link
              href="/register"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg text-center transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
            >
              会員登録
            </Link>
            <Link
              href="/login"
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg text-center transition-colors dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-white"
            >
              ログイン
            </Link>
          </section>
        </div>
      </main>

      <footer className="bg-gray-50 dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            © 2026 英文生成ツール. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
