"use client";
import { useState } from "react";
import { useT } from "@/providers/I18nProvider";
import { useBulletins } from "./useBulletins";

export default function BulletinBoard() {
  const t = useT();
  const { posts, loading, error, createPost, deletePost, likePost } = useBulletins();
  const [content, setContent] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    createPost(content.trim());
    setContent("");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-semibold text-center">{t("bulletin_title")}</h2>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder={t("bulletin_placeholder")}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {t("send")}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-sm text-center">{error.message}</p>
      )}

      {loading ? (
        <p className="text-center text-neutral-500">{t("loading")}</p>
      ) : (
        <ul className="space-y-4">
          {posts.map((p) => (
            <li key={p.id} className="border rounded p-3 relative">
              <p className="whitespace-pre-wrap break-words">{p.content}</p>
              <div className="flex items-center justify-between mt-2 text-sm text-neutral-500">
                <span>{new Date(p.created_at).toLocaleString("vi-VN")}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => likePost(p.id, p.like_count)}
                    className="hover:text-pink-600"
                    aria-label={t("like")}
                  >
                    ❤️ {p.like_count}
                  </button>
                  <button
                    onClick={() => deletePost(p.id)}
                    className="hover:text-red-600"
                    aria-label={t("delete")}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
