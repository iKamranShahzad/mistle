import Header from "@/components/ui/header";
import React from "react";

// This component will handle the loading screen globally
export default function Loading() {
  return (
    <>
      <Header />
      <div className="flex justify-center items-center min-h-screen">
        <img
          src="/logo.svg"
          alt="loading"
          className="w-24 h-24 animate-bounce"
        />
      </div>
    </>
  );
}
