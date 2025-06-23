"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { FileObject } from "@supabase/storage-js";
import dynamic from "next/dynamic";
import { useT } from "@/providers/I18nProvider";

interface MediaItem {
  name: string;
  url: string;
}

export default function AlbumGallery() {
  const t = useT();
  // Dynamically import modal to avoid SSR issues
  const ImageModal = dynamic(() => import("./ImageModal"), { ssr: false });
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  useEffect(() => {
    const fetchMedia = async () => {
      setLoading(true);

      const { data, error } = await supabase.storage.from("media").list("", {
        limit: 100,
        sortBy: { column: "name", order: "desc" },
      });

      if (error) {
        console.error("Lỗi tải media từ bucket:", error.message);
        setItems([]);
        setLoading(false);
        return;
      }

      if (!data) {
        setItems([]);
        setLoading(false);
        return;
      }

      const mapped = (data as FileObject[]).map((file) => {
        const { data: urlData } = supabase.storage.from("media").getPublicUrl(file.name);
        return { name: file.name, url: urlData.publicUrl } as MediaItem;
      });

      setItems(mapped);
      setLoading(false);
    };


    fetchMedia();
  }, []);

  if (loading) {
    return <p className="text-center py-8">{t("album_loading")}</p>;
  }

  if (items.length === 0) {
    return <p className="text-center py-8">{t("album_empty")}</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-4">
        {items.map((item, idx) => (
          <div
            key={item.name}
            className="relative w-full pt-[100%] rounded overflow-hidden cursor-pointer"
            onClick={() => {
              setSelectedIndex(idx);
              setModalOpen(true);
            }}
          >
            <Image
              src={item.url}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 50vw, 25vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      <ImageModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        items={items}
        startIndex={selectedIndex}
      />
    </>
  );
}
