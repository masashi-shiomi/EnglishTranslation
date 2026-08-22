 "use client";

 import {
   addDoc,
   collection,
   deleteDoc,
   doc,
   getDocs,
   query,
   serverTimestamp,
   updateDoc,
   where,
 } from "firebase/firestore";
 import { onAuthStateChanged, signOut } from "firebase/auth";
 import { useRouter } from "next/navigation";
 import { FormEvent, useEffect, useState } from "react";
 import { auth, db } from "@/lib/firebase";

 type EnglishWord = {
   id: string;
   englishWord: string;
 };

 export default function Dashboard() {
   const router = useRouter();
   const [word, setWord] = useState("");
   const [words, setWords] = useState<EnglishWord[]>([]);
   const [checkingAuth, setCheckingAuth] = useState(true);
   const [savingWord, setSavingWord] = useState(false);
   const [editingWordId, setEditingWordId] = useState<string | null>(null);
   const [editingWord, setEditingWord] = useState("");
   const [processingWordId, setProcessingWordId] = useState<string | null>(null);
   const [error, setError] = useState("");

   useEffect(() => {
     const unsubscribe = onAuthStateChanged(auth, (user) => {
       if (!user) {
         router.replace("/register");
         return;
       }

       const loadWords = async () => {
         try {
           const wordsQuery = query(
             collection(db, "englishWord"),
             where("uid", "==", user.uid),
           );
           const wordsSnapshot = await getDocs(wordsQuery);
           setWords(
             wordsSnapshot.docs.map((wordDocument) => ({
               id: wordDocument.id,
               englishWord: wordDocument.data().englishWord as string,
             })),
           );
         } catch (err) {
           setError("英単語の読み込みに失敗しました。");
         } finally {
           setCheckingAuth(false);
         }
       };

       void loadWords();
     });

     return unsubscribe;
   }, [router]);

   const handleAddWord = async (event: FormEvent<HTMLFormElement>) => {
     event.preventDefault();
     const normalizedWord = word.trim();

     if (!normalizedWord || savingWord) {
       return;
     }

     const currentUser = auth.currentUser;

     if (!currentUser) {
       router.replace("/");
       return;
     }

    if (words.some((registeredWord) => registeredWord.englishWord === normalizedWord)) {
       setWord("");
       return;
     }

     setError("");
     setSavingWord(true);

     try {
       const wordDocument = await addDoc(collection(db, "englishWord"), {
         englishWord: normalizedWord,
         uid: currentUser.uid,
         created: serverTimestamp(),
       });

       setWords((currentWords) => [
         ...currentWords,
         { id: wordDocument.id, englishWord: normalizedWord },
       ]);
       setWord("");
     } catch (err) {
       setError("英単語の保存に失敗しました。もう一度お試しください。");
     } finally {
       setSavingWord(false);
     }
   };

   const handleEditStart = (englishWord: EnglishWord) => {
     setEditingWordId(englishWord.id);
     setEditingWord(englishWord.englishWord);
     setError("");
   };

   const handleEditCancel = () => {
     setEditingWordId(null);
     setEditingWord("");
   };

   const handleUpdateWord = async (wordId: string) => {
     const normalizedWord = editingWord.trim();

     if (!normalizedWord || processingWordId) {
       return;
     }

     if (
       words.some(
         (registeredWord) =>
           registeredWord.id !== wordId && registeredWord.englishWord === normalizedWord,
       )
     ) {
       setError("同じ英単語は登録できません。");
       return;
     }

     setError("");
     setProcessingWordId(wordId);

     try {
       await updateDoc(doc(db, "englishWord", wordId), {
         englishWord: normalizedWord,
       });
       setWords((currentWords) =>
         currentWords.map((registeredWord) =>
           registeredWord.id === wordId
             ? { ...registeredWord, englishWord: normalizedWord }
             : registeredWord,
         ),
       );
       handleEditCancel();
     } catch (err) {
       setError("英単語の更新に失敗しました。もう一度お試しください。");
     } finally {
       setProcessingWordId(null);
     }
   };

   const handleDeleteWord = async (wordId: string) => {
     if (processingWordId) {
       return;
     }

     setError("");
     setProcessingWordId(wordId);

     try {
       await deleteDoc(doc(db, "englishWord", wordId));
       setWords((currentWords) =>
         currentWords.filter((registeredWord) => registeredWord.id !== wordId),
       );
       if (editingWordId === wordId) {
         handleEditCancel();
       }
     } catch (err) {
       setError("英単語の削除に失敗しました。もう一度お試しください。");
     } finally {
       setProcessingWordId(null);
     }
   };

   const handleLogout = async () => {
     await signOut(auth);
    router.replace("/");
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
               disabled={savingWord}
               className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-700"
             >
               {savingWord ? "保存中..." : "追加する"}
             </button>
           </form>

           {error && (
             <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
               {error}
             </p>
           )}

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
                     key={registeredWord.id}
                     className="rounded-lg bg-blue-50 px-4 py-3 font-medium text-blue-900 dark:bg-blue-900/30 dark:text-blue-100"
                   >
                     {editingWordId === registeredWord.id ? (
                       <div className="space-y-3">
                         <label htmlFor={`edit-word-${registeredWord.id}`} className="sr-only">
                           英単語を編集
                         </label>
                         <input
                           id={`edit-word-${registeredWord.id}`}
                           type="text"
                           value={editingWord}
                           onChange={(event) => setEditingWord(event.target.value)}
                           className="w-full rounded-lg border border-blue-300 bg-white px-3 py-2 text-gray-900 outline-none focus:ring-2 focus:ring-blue-200 dark:border-blue-700 dark:bg-slate-700 dark:text-white"
                         />
                         <div className="flex gap-2">
                           <button
                             type="button"
                             onClick={() => handleUpdateWord(registeredWord.id)}
                             disabled={processingWordId === registeredWord.id}
                             className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                           >
                             {processingWordId === registeredWord.id ? "更新中..." : "更新"}
                           </button>
                           <button
                             type="button"
                             onClick={handleEditCancel}
                             disabled={processingWordId === registeredWord.id}
                             className="rounded-lg bg-gray-200 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-600 dark:text-gray-200 dark:hover:bg-slate-500"
                           >
                             キャンセル
                           </button>
                         </div>
                       </div>
                     ) : (
                       <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                         <span>{registeredWord.englishWord}</span>
                         <div className="flex gap-2">
                           <button
                             type="button"
                             onClick={() => handleEditStart(registeredWord)}
                             disabled={processingWordId !== null}
                             className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-slate-700 dark:text-blue-300 dark:hover:bg-slate-600"
                           >
                             編集
                           </button>
                           <button
                             type="button"
                             onClick={() => handleDeleteWord(registeredWord.id)}
                             disabled={processingWordId !== null}
                             className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                           >
                             削除
                           </button>
                         </div>
                       </div>
                     )}
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

