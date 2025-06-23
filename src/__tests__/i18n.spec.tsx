import { render, screen, waitFor } from "@testing-library/react";
import { I18nProvider } from "@/providers/I18nProvider";
import Navbar from "@/components/Navbar";

function renderNavbarWithCookie(locale: "vi" | "en") {
  // set cookie before render
  document.cookie = `NEXT_LOCALE=${locale}`;
  return render(
    <I18nProvider>
      <Navbar />
    </I18nProvider>
  );
}

describe("I18n Navbar", () => {
  it("shows Vietnamese labels when locale=vi", async () => {
    renderNavbarWithCookie("vi");
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Trang chủ" })).toBeInTheDocument();
    });
  });

  it("switches to English when locale=en", async () => {
    renderNavbarWithCookie("en");
    await waitFor(() => {
      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    });
  });
});
