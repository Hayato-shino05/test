"use client";
import { Fragment, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Pagination } from "swiper/modules";
import Image from "next/image";




interface Props {
  open: boolean;
  onClose: () => void;
  items: Array<{ name: string; url: string }>;
  startIndex: number;
}

export default function ImageModal({ open, onClose, items, startIndex }: Props) {
  useEffect(() => {
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-3xl">
              <Swiper
                modules={[Keyboard, Pagination]}
                initialSlide={startIndex}
                spaceBetween={30}
                pagination={{ clickable: true }}
                keyboard={{ enabled: true }}
              >
                {items.map((item) => (
                  <SwiperSlide key={item.name} className="relative w-full pt-[56%]">
                    <Image src={item.url} alt={item.name} fill className="object-contain" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
