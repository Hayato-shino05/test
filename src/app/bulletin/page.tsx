import BulletinBoard from "@/features/bulletin/BulletinBoard";

export const metadata = {
  title: "Bulletin | Happy Birthday",
  description: "Gửi lời chúc mừng sinh nhật tới bảng tin chung",
};

export const dynamic = "force-dynamic";

export default function BulletinPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <BulletinBoard />
    </main>
  );
}
