import { renderHook, waitFor } from "@testing-library/react";
import useChatMessages from "@/hooks/useChatMessages";
import { vi, describe, it, expect } from "vitest";

// Mock Supabase client
vi.mock("@/lib/supabaseClient", () => {
  const stubData = [
    {
      id: "1",
      sender_id: "user1",
      text: "Xin chào!",
      created_at: new Date().toISOString(),
    },
  ];

  return {
    supabase: {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: stubData }),
          }),
        }),
      }),
      channel: vi.fn().mockReturnValue({
        on: vi.fn().mockReturnValue({
          subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
        }),
      }),
    },
  };
});

describe("useChatMessages", () => {
  it("lấy được tin nhắn khởi tạo", async () => {
    const { result } = renderHook(() => useChatMessages());
    await waitFor(() => {
      expect(result.current).toHaveLength(1);
      expect(result.current[0].text).toBe("Xin chào!");
    });
  });
});
