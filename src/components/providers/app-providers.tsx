"use client"

import { ReactNode } from "react";
import { AuthProvider } from "@/components/providers/auth-provider"

export const AppProviders = ({ children }: { children: ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};