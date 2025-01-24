import React from "react";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import HeaderButton from "./headerButton";
import MyDiagrams from "./my-diagrams";
import { LuUser, LuShapes } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

// Diagram interface
interface Diagram {
  _id: string;
  name: string;
  data: any;
}

const HeaderAvatar = ({
  showText,
  openLink,
}: {
  showText: boolean;
  openLink: string;
}) => {
  const { data: session }: any = useSession();
  const [dialog, setDialog] = React.useState("logout");
  const [name, setName] = React.useState(session?.user?.name || "");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [localSession, setLocalSession] = React.useState(session);
  const fallback = session?.user?.name.slice(0, 2).toUpperCase();
  const [diagrams, setDiagrams] = React.useState<Diagram[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Fetch diagrams from the database
  const fetchDiagrams = async () => {
    const userID = session?.user.id;
    try {
      const response = await fetch(
        `/api/diagrams/fetchDiagrams?userID=${userID}`
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      return data.diagrams;
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  // Get diagrams
  const getDiagrams = async () => {
    setLoading(true);
    try {
      const fetchedDiagrams = await fetchDiagrams();
      setDiagrams(fetchedDiagrams);
    } catch (err: any) {
      console.error(err.message);
    }
    setLoading(false);
  };

  React.useEffect(() => {
    setLocalSession(session);
  }, [session]);

  const handleSettingsTrigger = () => {
    setDialog("settings");
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
    // Validate name
    const usernameRegex = /^[a-zA-Z0-9 _-]*$/;
    if (!usernameRegex.test(name)) {
      toast.error(
        "Username can only contain alphanumeric characters, underscores, and hyphens."
      );
      return;
    }

    const UserID = session.user.id;
    const newName = name;
    const newPassword = password;

    // Send request to change user info
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

  const sendVerifEmail = async () => {
    const email = session.user.email;

    // Send request to send verification email
    const promise = axios.post("/api/users/sendVerifEmail", { email });

    toast.promise(promise, {
      loading: "Sending Verification Email...",
      success: "Verification email sent successfully!",
      error: "Error sending verification email",
    });

    try {
      await promise;
    } catch (error: any) {
      console.error("Error sending verification email:", error.message);
    }
  };

  async function handleSignOut() {
    await signOut();
    const currentUrl = window.location.href;
    if (currentUrl.includes("dID")) {
      window.location.href = "/mistle";
    }
  }

  return (
    <div
      className={`${
        showText ? `lg:flex hidden` : "flex"
      } items-center justify-center gap-4 px-2`}
    >
      {!session ? (
        <>
          {showText && (
            <>
              <HeaderButton
                type="signup"
                name="Sign up"
                open="_self"
                color="gray"
              />
              <HeaderButton
                type="signin"
                name="Sign In"
                open="_self"
                color="indigo"
              />
            </>
          )}
        </>
      ) : (
        <>
          <div
            className={`${showText ? "min-w-[200px]" : ""}
            flex items-center justify-end gap-4`}
          >
            {showText && (
              <span className=" text-white font-medium whitespace-nowrap px-2 overflow-hidden overflow-ellipsis max-w-[160px] cursor-default">
                {localSession?.user.name
                  ? localSession?.user.name
                  : localSession?.user.email}
              </span>
            )}
            <AlertDialog>
              <Sheet>
                <DropdownMenu>
                  <DropdownMenuTrigger className="outline-none">
                    <Avatar className="hover:scale-110 active:scale-110 transition-transform ease-in-out">
                      <AvatarImage src="https://github.com/shadcn.png\" />
                      <AvatarFallback>{fallback}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setDialog("account")}>
                      <AlertDialogTrigger className="flex flex-row">
                        <LuUser size="1.2em" className="mr-2" />
                        My Account
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => getDiagrams()}>
                      <SheetTrigger className="flex flex-row">
                        <LuShapes size="1.2em" className=" mr-2" />
                        My Diagrams
                      </SheetTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => handleSettingsTrigger()}>
                      <AlertDialogTrigger className="flex flex-row">
                        <IoSettingsOutline size="1.2em" className=" mr-2" />
                        Settings
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setDialog("logout")}>
                      <AlertDialogTrigger className="flex flex-row gap-[6px]">
                        <TbLogout size="1.3em" className=" text-red-600" />
                        Sign Out
                      </AlertDialogTrigger>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="flex flex-row items-center justify-start">
                      <LuShapes size="1.8em" className=" mr-3" />
                      <span className="text-xl">My Diagrams</span>
                    </SheetTitle>
                  </SheetHeader>
                  <SheetDescription className="mt-8 pt-8 border-t">
                    <MyDiagrams
                      diagrams={diagrams}
                      loading={loading}
                      openLink={openLink}
                      getDiagrams={getDiagrams}
                    />
                  </SheetDescription>
                </SheetContent>
                {dialog === "account" && (
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogDescription className="flex flex-col items-center justify-center">
                        <Avatar className="size-24 mb-2">
                          <AvatarImage src="https://github.com/shadcn.png\" />
                          <AvatarFallback className="text-3xl">
                            {fallback}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-2xl mb-6">
                          {localSession.user.name}
                        </span>
                        <div className="flex flex-col items-start justify-start">
                          <div className="flex items-center justify-start gap-2 mt-2 text-lg">
                            <span className="text-neutral-200">Email: </span>
                            <span className="max-w-96 overflow-x-hidden">
                              {session.user.email}
                            </span>
                          </div>
                          <div className="flex items-center justify-start gap-2 mt-2 text-lg">
                            <span className="text-neutral-200">
                              Account Status:{" "}
                            </span>
                            {session.user.isVerified ? (
                              <span className="font-bold text-green-700">
                                Verified
                              </span>
                            ) : (
                              <span className="font-bold text-red-700">
                                Not Verified
                              </span>
                            )}
                          </div>
                        </div>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      {!session.user.isVerified && (
                        <AlertDialogAction
                          onClick={() => sendVerifEmail()}
                          className="bg-indigo-700 md:w-20 hover:bg-indigo-800"
                        >
                          Verify
                        </AlertDialogAction>
                      )}
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
                {dialog === "settings" && (
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
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                )}
                {dialog === "logout" && (
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will log you out of your current session. You will
                        have to log in again to access your diagrams. servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleSignOut}>
                        Sign Out
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </Sheet>
            </AlertDialog>
          </div>
        </>
      )}
    </div>
  );
};

export default HeaderAvatar;
