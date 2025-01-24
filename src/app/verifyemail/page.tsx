"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  // Get the token from the URL
  useEffect(() => {
    const urlToken = window.location.search.split("token=")[1];
    setToken(urlToken || "");
    document.title = "Verify Your Email";
  }, []);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        await axios.post("/api/users/verifyemail", { token });
        setVerified(true);
      } catch (error: any) {
        setError(error.response.data.error);
      }
    };

    if (token) {
      verifyUserEmail();
    }
  }, [token]);

  // If the token is not present
  if (!token) {
    return (
      <div className=" flex min-h-screen items-center justify-center gap-6 lg:gap-12">
        <img src="/logo.svg" alt="Logo" className="size-16"></img>
        <div className="border-r-2 h-12"></div>
        <p className="text-xl">Invalid Verify Email Link</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      {verified && (
        <div className="flex flex-col min-h-screen items-center justify-center gap-8">
          <a href="/">
            <img src="/logotext.svg" alt="Logo Text" className=" w-60"></img>
          </a>
          <h1 className="text-2xl font-semibold text-center">
            Your Email is Verified Successfully
          </h1>
          <Link
            className="ml-1 text-center font-semibold text-main hover:underline mt-2"
            href="../account/signin"
          >
            Go to Sign In
          </Link>
        </div>
      )}
      {error && (
        <div className="flex flex-col min-h-screen items-center justify-center gap-8">
          <a href="/">
            <img src="/logotext.svg" alt="Logo Text" className=" w-60"></img>
          </a>
          <hr className="w-80 h-[1px] mx-auto bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
          <h2 className="text-2xl font-semibold text-center text-red-600">
            {error}
          </h2>
        </div>
      )}
    </div>
  );
}
