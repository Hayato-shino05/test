"use client";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useT } from "@/providers/I18nProvider";
import { Locale, locales } from "@/i18n";

export default function LanguageSwitcher() {
  const t = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const toggle = async () => {
    startTransition(() => {
      const next = (document.documentElement.lang as Locale) === "vi" ? "en" : "vi";
      document.cookie = `NEXT_LOCALE=${next}; path=/`;
      // reload route to apply messages
      router.refresh();
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={pending}
      className="px-2 text-sm text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400"
    >
      {t("lang")}: {document.documentElement.lang}
    </button>
  );
}
