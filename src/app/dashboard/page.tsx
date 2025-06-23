"use client";
import AddBirthdayForm from "@/features/birthdays/AddBirthdayForm";

export default function DashboardPage() {
  return (
    <main className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="opacity-70 text-sm">Thêm sinh nhật mới để countdown tự động cập nhật.</p>
      <AddBirthdayForm />
    </main>
  );
}
