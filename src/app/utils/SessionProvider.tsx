"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";

// This component will provide the authentication context
const AuthProvider = ({ children }: any) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default AuthProvider;
