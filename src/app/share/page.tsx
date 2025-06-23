import SocialShare from "@/features/social-share/SocialShare";

export const metadata = {
  title: "Share | Happy Birthday",
  description: "Chia sẻ website chúc mừng sinh nhật tới bạn bè & người thân",
};

export const dynamic = "force-dynamic";

export default function SharePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <SocialShare />
    </main>
  );
}
