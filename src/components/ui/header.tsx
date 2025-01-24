"use client";
import React from "react";
import { signOut, useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "sonner";
import { Squash as Hamburger } from "hamburger-react";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import HeaderAvatar from "./headerAvatar";
import Contacts from "./contacts";

const Header = () => {
  const { data: session }: any = useSession();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const fallback = session?.user?.name.slice(0, 2).toUpperCase();
  const [name, setName] = React.useState(session?.user?.name || "");
  const [localSession, setLocalSession] = React.useState(session);
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  React.useEffect(() => {
    setLocalSession(session);
  }, [session]);

  const handleSettingsTrigger = () => {
    setName(localSession.user.name || "");
    setPassword("");
    setConfirmPassword("");
  };

  const handleClose = () => {
    setName(localSession.user.name || "");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSettings = async () => {
    // Validate the name
    const usernameRegex = /^[a-zA-Z0-9 _-]*$/;

    // Check if the name is empty
    if (!usernameRegex.test(name)) {
      toast.error(
        "Username can only contain alphanumeric characters, underscores, and hyphens."
      );
      return;
    }

    const UserID = session.user.id;
    const newName = name;
    const newPassword = password;

    // Send the request to the server
    const promise = axios.post("/api/users/changeInfo", {
      UserID,
      newName,
      newPassword,
    });

    toast.promise(promise, {
      loading: "Please wait for changes to apply...",
      success: "Changes Saved Successfully!",
      error: "Error saving changes! Please try again.",
    });

    try {
      await promise;
      setLocalSession((prev: any) => ({
        ...prev,
        user: { ...prev.user, name: newName },
      }));
    } catch (error: any) {
      console.error("Error saving changes:", error.message);
    } finally {
      handleClose();
    }
  };

  function handleSignOut() {
    signOut();
  }

  return (
    <nav className="bg-black lg:bg-purple-900 lg:bg-clip-padding lg:backdrop-blur lg:bg-opacity-5 z-50 py-5 lg:fixed lg:top-0 lg:left-0 lg:right-0">
      <div className="flex items-center font-medium justify-start lg:justify-between pl-6 pr-4">
        <div className="z-30 lg:w-auto w-full flex items-center justify-between">
          <Link href="/mistle" target="_blank">
            <img src="/logotext.svg" alt="logo" className="h-7 filter" />
          </Link>
          <div className="lg:hidden">
            <Hamburger
              toggled={menuOpen}
              toggle={setMenuOpen}
              size={28}
              duration={0.3}
              rounded
            />
          </div>
        </div>
        <ul className="lg:flex uppercase hidden items-center xl:ml-20 ml-18 gap-10">
          <li className="filter">
            <Link href="/" rel="noopener noreferrer">
              Home
            </Link>
          </li>
          <li className="filter">
            <Link href="/tutorials" rel="noopener noreferrer">
              Tutorials
            </Link>
          </li>
          <li>
            <Dialog>
              <DialogTrigger className="outline-none filter uppercase">
                Contact us
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Contact Us</DialogTitle>
                  <DialogDescription>
                    <div className="mb-6 mt-2">
                      You can reach us out via our email address or join our
                      Discord server for more information.
                    </div>
                    <div className="flex flex-column justify-between items-center">
                      <Contacts />
                      <img
                        src="/logotext.svg"
                        alt="logo"
                        className="h-8 mr-3 mt-12 logoshadow"
                      />
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </li>
          <li className="filter">
            <Link href="/about" rel="noopener noreferrer">
              About us
            </Link>
          </li>
        </ul>
        <HeaderAvatar showText={true} openLink="_blank" />

        {/* Mobile View */}

        <ul
          className={`lg:hidden bg-black absolute w-full z-20 text-left h-full bottom-0 py-24 pl-4 duration-500 ${
            menuOpen ? "left-0" : "-left-full"
          }`}
        >
          <li>
            <Link
              href="/"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              HOME
            </Link>
          </li>
          <li>
            <Link
              href="/tutorials"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              TUTORIALS
            </Link>
          </li>
          <li>
            <Link
              href="/about"
              rel="noopener noreferrer"
              className="py-7 px-3 inline-block filter"
            >
              ABOUT US
            </Link>
          </li>
          <li>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="px-3 py-4 inline-block">
                <AccordionTrigger className="filter outline-none">
                  CONTACT US
                </AccordionTrigger>
                <AccordionContent>
                  <Contacts />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
          <div className="flex items-start justify-start mx-3 my-6 gap-4 ">
            {!session ? (
              <>
                <button className=" bg-[#696969] px-3 py-2 rounded-lg text-black font-semibold transform transition-transform hover:scale-105">
                  <Link href="/account/signup" rel="noopener noreferrer">
                    Sign up
                  </Link>
                </button>
                <button className=" bg-main px-3 py-2 rounded-lg  text-black font-semibold transform transition-transform hover:scale-105">
                  <Link href="/account/signin" rel="noopener noreferrer">
                    Sign In
                  </Link>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-start gap-2">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src="https://github.com/shadcn.png\" />
                    <AvatarFallback>{fallback}</AvatarFallback>
                  </Avatar>
                  <span className=" text-white text-xl whitespace-nowrap font-medium ml-2 mr-6 overflow-hidden overflow-ellipsis max-w-[40%] cursor-default">
                    {localSession?.user.name
                      ? localSession?.user.name
                      : localSession?.user.email}
                  </span>
                  <AlertDialog>
                    <AlertDialogTrigger onClick={() => handleSettingsTrigger()}>
                      <IoSettingsOutline
                        size="1.8em"
                        className="mr-4 cursor-pointer"
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent onEscapeKeyDown={() => handleClose()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl pb-2 border-b border-main">
                          Account Settings
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          <div>
                            <label className="text-base font-medium text-gray-300 mr-2">
                              Name
                            </label>
                            <input
                              type="text"
                              placeholder="Minimum 3 characters"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                              className="border mt-4 py-0.5 px-1 ml-[122.5px] mb-4 placeholder:text-neutral-600 bg-neutral-900 text-gray-300 border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="text-base font-medium text-gray-300 mr-2">
                              Password
                            </label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Minimum 5 characters"
                              className="border py-0.5 px-1 ml-[93px] placeholder:text-neutral-600 bg-neutral-900 text-gray-300 border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                          <div className="mb-4">
                            <label className="text-base font-medium text-gray-300 mr-2">
                              Confirm Password
                            </label>
                            <input
                              type="password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              placeholder="Confirm Password"
                              className="border py-0.5 px-1 ml-7 placeholder:text-neutral-600 bg-neutral-900 text-gray-300 border-neutral-700 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => handleClose()}>
                          Close
                        </AlertDialogCancel>
                        <AlertDialogAction
                          disabled={
                            (name === session.user.name &&
                              !password &&
                              !confirmPassword) ||
                            (name.length > 0 && name.length < 3) ||
                            (password.length > 0 && password.length < 5) ||
                            (password.length > 0 &&
                              password !== confirmPassword) ||
                            (!name && !password && !confirmPassword)
                          }
                          onClick={() => handleSettings()}
                          className="bg-indigo-700 md:w-20 hover:bg-indigo-800 disabled:bg-indigo-900"
                        >
                          Save
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <TbLogout
                        size="1.8em"
                        className=" text-red-600 cursor-pointer"
                      />
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will log you out of your current session. You
                          will have to log in again to access your diagrams.
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSignOut}>
                          Sign Out
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Header;
