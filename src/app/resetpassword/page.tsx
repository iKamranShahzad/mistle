"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { passwordStrength } from "../helpers/passUtils";
import { PiEye, PiEyeClosed } from "react-icons/pi";

// This component will handle the reset password page
export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passStrength, setPassStrength] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // This will run when the component mounts
  useEffect(() => {
    const urlToken = window.location.search.split("token=")[1];
    setToken(urlToken || "");
    document.title = "Reset Password";
  }, []);

  // This function will handle the form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      setIsLoading(false);
      return;
    }
    if (!password || password.length < 5) {
      toast.error("Minimum password length is 5 characters.");
      setIsLoading(false);
      return;
    }
    try {
      await axios.post("../api/users/resetpassword", {
        token: token,
        newPassword: password,
      });
      toast.success("Password Reset Successfully!");
      setTimeout(() => {
        window.location.href = "/account/signin"; // Redirect to the login page
      }, 4000);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }

    setIsLoading(false);
  };

  // This function will handle the password change
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
    setPassStrength(passwordStrength(password));
  };

  // If the token is not present, show an error message
  if (!token) {
    return (
      <div className=" flex min-h-screen items-center justify-center gap-6 lg:gap-12">
        <img src="/logo.svg" alt="Logo" className="size-16"></img>
        <div className="border-r-2 h-12"></div>
        <p className="text-xl">Invalid Reset Password Link</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen items-center justify-center gap-8">
      <img src="/logotext.svg" alt="Logo Text" className=" w-60"></img>
      <div className="border-2 border-white py-12 px-6 rounded-3xl">
        <h1 className="text-3xl font-semibold mt-4 mb-8 text-center">
          Reset Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="relative mb-2">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
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
          <div className="relative mt-5    mb-4">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="mt-1 pr-11 text-sm bg-transparent p-2.5 block w-80 rounded-md border placeholder:font-extralight border-neutral-700 focus:outline-none focus:ring-main focus:border-main"
            />
            {passStrength !== "" && (
              <i
                className="absolute bottom-3 right-4 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle password visibility
              >
                {showConfirmPassword ? (
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
            className="w-80 py-2.5 px-4 mt-3 mb-6 border border-transparent rounded-full shadow-sm text-white font-semibold bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2  focus:ring-indigo-500 disabled:bg-[#8772ff]"
          >
            {isLoading ? "Please wait..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
