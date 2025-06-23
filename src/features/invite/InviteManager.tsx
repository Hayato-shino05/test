"use client";
import { useState } from "react";
import confetti from "canvas-confetti";
import { useInvites } from "./useInvites";
import { useT } from "@/providers/I18nProvider";

export default function InviteManager() {
  const t = useT();
  const { invites, loading, error, createInvite } = useInvites();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = async () => {
    const inv = await createInvite();
    if (inv) {
      confetti({ particleCount: 120, spread: 60 });
    }
  };

  const handleCopy = async (code: string, id: string) => {
    const link = `${window.location.origin}/?invite=${code}`;
    await navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">{t("invites_title")}</h2>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white whitespace-nowrap"
        >
          {t("create_invite")}
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error.message}</p>}

      {loading ? (
        <p className="text-neutral-500 text-sm">{t("loading")}</p>
      ) : invites.length === 0 ? (
        <p className="text-neutral-500 text-sm">{t("invites_empty")}</p>
      ) : (
        <ul className="space-y-3">
          {invites.map((inv) => (
            <li
              key={inv.id}
              className="border rounded p-3 flex items-center justify-between"
            >
              <div className="flex flex-col">
                <span className="font-mono text-sm">
                  {window.location.origin}/?invite={inv.code}
                </span>
                <span className="text-xs text-neutral-500">
                  {inv.accepted ? t("accepted") : t("pending")}
                </span>
              </div>
              <button
                onClick={() => handleCopy(inv.code, inv.id)}
                className="text-sm px-3 py-1 rounded border hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {copiedId === inv.id ? t("copied") : t("copy")}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
