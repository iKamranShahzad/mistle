"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { PiEye, PiEyeClosed } from "react-icons/pi";
import { passwordStrength } from "../../helpers/passUtils";
import { toast } from "sonner";

export default function SignUpPage() {
  // States for handling form input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passStrength, setPassStrength] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/"); //Redirect to Home if there is signed in User
    }
  }, [sessionStatus, router]);

  useEffect(() => {
    document.title = "Sign up - Mistle";
  }, []);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; //Regular Expression for email validation
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    if (!isValidEmail(email)) {
      toast.error("Email is Invalid!");
      return;
    }

    if (!password || password.length < 5) {
      // Minimum password length is 5 characters
      toast.error("Minimum password length is 5 characters.");
      return;
    }

    setIsLoading(true);

    //API route for signup
    try {
      const res = await fetch("../api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      if (res.status === 400) {
        toast.error("This Email is already registered!");
      }
      if (res.status === 200) {
        await signIn("credentials", {
          email,
          password,
          callbackUrl: "/", // Redirect to home page after successful sign-in
          redirect: false, // Do not redirect automatically, we handle it manually
        });
        router.replace("/");
      }
    } catch (error) {
      toast.error("Error! Try Again");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    // check password strength
    const password = e.target.value;
    setPassword(password);
    setPassStrength(passwordStrength(password));
  };

  // If session is loading, show a loading spinner
  if (sessionStatus === "loading") {
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
      <div className="overflow-hidden">
        <div className="flex justify-center fullscreen border border-gray-500 rounded-3xl mx-4 overflow-hidden p-1 box-border">
          <div className="w-full lg:w-1/2 border-white rounded-3xl m-12 mt-12 md:mt-24 flex flex-col items-center justify-start ">
            <h1 className="text-3xl font-semibold mt-8">Create an account</h1>
            <div className=" text-gray-500 mb-8">
              Already have an account?
              <Link
                className="ml-1 text-center font-semibold text-main hover:underline mt-2"
                href="./signin"
              >
                Sign In
              </Link>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email Address"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
                />
              </div>
              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChange={handleChangePassword}
                  required
                  className="mt-1 pr-11 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
                />
                {passStrength !== "" && (
                  <i
                    className="absolute bottom-3 right-4 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                  >
                    {showPassword ? (
                      <PiEye size={"1.1em"} />
                    ) : (
                      <PiEyeClosed size={"1.1em"} />
                    )}
                  </i>
                )}
              </div>
              {passStrength !== "" && (
                <>
                  <div className="flex gap-1 p-1">
                    <div
                      className={` h-1.5 rounded ${
                        passStrength === "Weak" ||
                        passStrength === "Fair" ||
                        passStrength === "Strong"
                          ? "bg-red-600"
                          : "bg-neutral-800"
                      } w-full`}
                    ></div>

                    <div
                      className={`h-1.5 rounded ${
                        passStrength === "Fair" || passStrength === "Strong"
                          ? "bg-yellow-600"
                          : "bg-neutral-800"
                      } w-full`}
                    ></div>
                    <div
                      className={`h-1.5 rounded ${
                        passStrength === "Strong"
                          ? "bg-green-600"
                          : "bg-neutral-800"
                      } w-full`}
                    ></div>
                  </div>
                  <div className="pl-1 pr-2 text-gray-400 flex justify-between">
                    Password Strength:
                    <span
                      className={` italic ${
                        passStrength === "Strong"
                          ? "text-green-600"
                          : passStrength === "Fair"
                          ? "text-yellow-600"
                          : passStrength === "Weak"
                          ? "text-red-600"
                          : "text-gray-400"
                      }`}
                    >
                      {passStrength}
                    </span>
                  </div>
                </>
              )}
              <button
                type="submit"
                disabled={isLoading}
                className="w-80 py-2.5 px-4 mt-2 border border-transparent rounded-full shadow-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2  focus:ring-indigo-500 disabled:bg-[#8772ff]"
              >
                {isLoading ? "Please wait..." : "Sign Up"}
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
              Sign up with Google
            </a>
            <a
              href="#"
              onClick={() => {
                signIn("github");
              }}
              className="text-sm border border-gray-500 w-80 text-center py-3 px-4 mb-8 rounded-full flex gap-16 hover:border-main"
            >
              <FaGithub size={"1.5em"} />
              Sign up with Github
            </a>
            <a
              href="/"
              className="text-gray-800 text-sm font-medium hover:text-gray-300 flex justify-center items-center gap-1 mt-4"
            >
              <MdOutlineArrowBackIosNew /> Go Back
            </a>
          </div>
          <div className="hidden lg:w-1/2 lg:flex rounded-5xl items-center justify-center bg-[url('/AccountBG.svg')] bg-opacity-50">
            <img
              src="/signup.svg"
              alt="Signup Image"
              className="object-cover lg:h-4/5 teeter"
            />
          </div>
        </div>
      </div>
    )
  );
}
