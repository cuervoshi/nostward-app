"use client";
import React from "react";
import { LaWalletConfig } from "@lawallet/react";
import { config } from "@/config";
import AuthWrapper from "./AuthWrapper";
import { AppContext } from "@/context/AppContext";

const AppWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LaWalletConfig config={config}>
      <AuthWrapper>
        <AppContext>{children}</AppContext>
      </AuthWrapper>
    </LaWalletConfig>
  );
};

export default AppWrapper;
