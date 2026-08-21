 "use client";

 import { onAuthStateChanged, signOut } from "firebase/auth";
 import { useRouter } from "next/navigation";
 import { FormEvent, useEffect, useState } from "react";
 import { auth } from "@/lib/firebase";

 export default function Dashboard() {
   const router = useRouter();
   const [word, setWord] = useState("");
   const [words, setWords] = useState<string[]>([]);
   const [checkingAuth, setCheckingAuth] = useState(true);

   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (!user) {
         router.replace("/register");
         return;
       }

       setCheckingAuth(false);
     });

     return unsubscribe;
   }, [router]);

   const handleAddWord = (event: FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     const normalizedWord = word.trim();

     if (!normalizedWord) {
       return;
     }

     setWords((currentWords) =>
       currentWords.includes(normalizedWord)
         ? currentWords
         : [...currentWords, normalizedWord],
     );
     setWord("");
   };

   const handleLogout = async () => {
     await signOut(auth);
     router.replace("/register");
   };

   if (checkingAuth) {
     return (
       <main className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-slate-900">
         <p className="text-gray-600 dark:text-gray-400">読み込み中...</p>
       </main>
     );
   }

   return (
     <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-slate-900">
       <header className="border-b border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
         <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
           <h1 className="text-xl font-bold text-gray-900 dark:text-white">
             英文生成ツール
           </h1>
           <button
             type="button"
             onClick={handleLogout}
             className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-slate-700 dark:hover:text-white"
           >
             ログアウト
           </button>
         </div>
       </header>

       <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
         <div className="mb-8">
           <p className="mb-2 text-sm font-semibold text-blue-600 dark:text-blue-400">
             MY WORDS
           </p>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
             英単語を登録しましょう
           </h2>
           <p className="mt-3 text-gray-600 dark:text-gray-400">
             生成したい英文に使う英単語を入力してください。
           </p>
         </div>

         <section className="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-800 sm:p-8">
           <form onSubmit={handleAddWord} className="flex flex-col gap-3 sm:flex-row">
             <label htmlFor="word" className="sr-only">
               英単語
             </label>
             <input
               id="word"
               type="text"
               value={word}
               onChange={(event) => setWord(event.target.value)}
               placeholder="例: journey"
               className="min-w-0 flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-900"
             />
             <button
               type="submit"
               className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
             >
               追加する
             </button>
           </form>

           <div className="mt-8 border-t border-gray-200 pt-6 dark:border-slate-700">
             <div className="mb-4 flex items-center justify-between">
               <h3 className="font-semibold text-gray-900 dark:text-white">
                 登録した単語
               </h3>
               <span className="text-sm text-gray-500 dark:text-gray-400">
                 {words.length}語
               </span>
             </div>

             {words.length === 0 ? (
               <p className="rounded-lg border border-dashed border-gray-300 px-4 py-8 text-center text-sm text-gray-500 dark:border-slate-600 dark:text-gray-400">
                 まだ単語が登録されていません
               </p>
             ) : (
               <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                 {words.map((registeredWord) => (
                   <li
                     key={registeredWord}
                     className="rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                   >
                     {registeredWord}
                   </li>
                 ))}
               </ul>
             )}
           </div>
         </section>
       </main>
     </div>
   );
 }

