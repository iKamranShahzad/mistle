import Header from "@/components/ui/header";
import React from "react";

export default function Loading() {
  // Loading component
  return (
    <>
      <div className="flex bg-gradient-to-bl from-[#0d0d0d] to-[#1a1a1a] justify-center items-center min-h-screen">
        <img
          src="/logo.svg"
          alt="loading"
          className="w-24 h-24 animate-bounce"
        />
      </div>
    </>
  );
}
