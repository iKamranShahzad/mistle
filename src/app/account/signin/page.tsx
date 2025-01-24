"use client";

import React from "react";
import Link from "next/link";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { toast } from "sonner";

export default function SignInPage() {
  // States for handling form input
  const [email, setEmail] = React.useState("");
  const [loginEmail, setLoginEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showPage, setShowPage] = React.useState(true);
  const router = useRouter(); //For navigation
  const { data: session, status: sessionStatus } = useSession();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/"); //If user is already logged in, redirect to home page
    }
  }, [sessionStatus, router]);

  React.useEffect(() => {
    document.title = "Sign in - Mistle";
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; //Regular Expression for email validation
    return emailRegex.test(email);
  };

  const handleLoginSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      toast.error("Email is Invalid!");
      return;
    }

    setIsLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.error) {
      toast.error("Incorrect email or password");
    } else if (res?.url) {
      router.replace(res.url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await axios.post("../api/users/forgetpassword", { email }); //Send email to the server
      toast.success("Reset Password Link Sent!");
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
    setIsLoading(false);
  };

  if (sessionStatus === "loading") {
    //If session is loading, show a loading spinner
    return (
      <div className="flex justify-center items-center min-h-screen">
        <img
          src="/logo.svg"
          alt="loading"
          className="w-24 h-24 animate-bounce"
        />
      </div>
    );
  }

  return (
    sessionStatus !== "authenticated" && ( //If user is not logged in, show the login page
      <div className=" overflow-hidden">
        <div className="flex justify-center border fullscreen border-gray-500 rounded-3xl my-5 mx-4 overflow-hidden p-1 box-border">
          <div className="hidden lg:w-1/2 lg:flex rounded-5xl items-center justify-center bg-[url('/AccountBG.svg')]">
            <img
              src="/login.svg"
              alt="Login Image"
              className="object-cover lg:h-4/5 teeter"
            />
          </div>
          {showPage ? (
            <div className="w-full lg:w-1/2 border-white rounded-3xl m-12 mt-8 md:mt-16 flex flex-col items-center justify-start ">
              <h1 className="text-3xl font-semibold mt-8">Welcome to Mistle</h1>
              <div className=" text-gray-500 mb-8">
                Don&apos;t have an account?
                <Link
                  className="ml-1 text-center font-semibold text-main hover:underline mt-2"
                  href="./signup"
                >
                  Sign Up
                </Link>
              </div>
              <form onSubmit={handleLoginSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Username or Email"
                    id="email"
                    name="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    className="mt-1 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
                  />
                </div>
                <div className="relative mb-4">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="mt-1 pr-11 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
                  />
                  {password !== "" && (
                    <i
                      className="absolute bottom-3 right-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <PiEye size={"1.1em"} />
                      ) : (
                        <PiEyeClosed size={"1.1em"} />
                      )}
                    </i>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-80 py-2.5 px-4 border border-transparent rounded-full shadow-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-[#836BF0]"
                >
                  {isLoading ? "Please wait..." : "Sign In"}
                </button>
              </form>
              <hr className="w-80 h-[1px] mx-auto my-8 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
              <a
                href="#"
                onClick={() => {
                  signIn("google");
                }}
                className="text-sm border border-gray-500 w-80 text-center py-3 px-4 mb-4 rounded-full flex gap-16 hover:border-main"
              >
                <FcGoogle size={"1.5em"} />
                Sign in with Google
              </a>
              <a
                href="#"
                onClick={() => {
                  signIn("github");
                }}
                className="text-sm border border-gray-500 w-80 text-center py-3 px-4 mb-8 rounded-full flex gap-16 hover:border-main"
              >
                <FaGithub size={"1.5em"} />
                Sign in with Github
              </a>
              <button
                onClick={() => setShowPage(false)}
                className="text-gray-500 text-sm font-medium hover:text-main mb-8"
              >
                Forgot Password?
              </button>
              <a
                href="/"
                className="text-gray-800 text-sm font-medium hover:text-gray-300 flex justify-center items-center gap-1"
              >
                <MdOutlineArrowBackIosNew /> Go Back
              </a>
            </div>
          ) : (
            <div className="w-full lg:w-1/2 border-white rounded-3xl m-12 flex flex-col items-center justify-center">
              <h1 className="text-3xl font-semibold">Forgot Your Password</h1>
              <div className="text-gray-500 mb-8">
                Remember your password?
                <button
                  className="ml-1 text-center font-semibold text-main hover:underline"
                  onClick={() => setShowPage(true)}
                >
                  Sign In
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Username or Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="mt-1 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-80 py-2.5 px-4 border border-transparent rounded-full shadow-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-[#836BF0]"
                >
                  {isLoading ? "Please wait..." : "Send Reset Link"}
                </button>
              </form>
              <hr className="w-80 h-[1px] mx-auto my-8 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
              <button
                onClick={() => setShowPage(true)}
                className="text-gray-800 text-sm font-medium hover:text-gray-300 flex justify-center items-center gap-1"
              >
                <MdOutlineArrowBackIosNew /> Go Back
              </button>
            </div>
          )}
        </div>
      </div>
    )
  );
}
