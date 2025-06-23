import ECardGenerator from "@/features/e-card/ECardGenerator";

export const metadata = {
  title: "E-Card | Happy Birthday",
  description: "Tạo thiệp chúc mừng sinh nhật cá nhân hoá",
};

export const dynamic = "force-dynamic";

export default function ECardPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <ECardGenerator />
    </main>
  );
}
