"use client";
import React from "react";
import { LaWalletProvider } from "@lawallet/react";
import { config } from "@/config";
import AuthWrapper from "./AuthWrapper";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LaWalletProvider config={config}>
      <AuthWrapper>{children}</AuthWrapper>
    </LaWalletProvider>
  );
};

export default AppWrapper;
