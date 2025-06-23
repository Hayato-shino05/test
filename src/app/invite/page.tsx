import InviteManager from "@/features/invite/InviteManager";

export const metadata = {
  title: "Invite | Happy Birthday",
  description: "Tạo và quản lý link mời tham dự sự kiện sinh nhật",
};

export const dynamic = "force-dynamic";

export default function InvitePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <InviteManager />
    </main>
  );
}
