"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AddBirthdayForm() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!name || !dob) {
      setError("Vui lòng nhập tên và ngày sinh");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("birthdays").insert({
      name,
      dob,
      message,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Đã thêm sinh nhật!");
      setName("");
      setDob("");
      setMessage("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      <div>
        <label className="block mb-1 text-sm font-medium">Tên</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Ngày sinh</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block mb-1 text-sm font-medium">Lời chúc (tùy chọn)</label>
        <textarea
          className="w-full p-2 border rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-green-600">{success}</p>}
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        {loading ? "Đang lưu..." : "Thêm"}
      </button>
    </form>
  );
}
