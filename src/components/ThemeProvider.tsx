"use client";

import React from "react";
import useSeasonTheme from "@/features/theme/useSeasonTheme";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Apply season-based body class
  useSeasonTheme();
  return <>{children}</>;
}
