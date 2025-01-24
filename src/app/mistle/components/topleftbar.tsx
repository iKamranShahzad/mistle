import { LuFileJson2 } from "react-icons/lu";
import { BsFiletypeSvg, BsFiletypePng } from "react-icons/bs";
import { FaUpload, FaDownload } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import React from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import HeaderButton from "@/components/ui/headerButton";
import ColorPicker from "@/components/ui/color-picker";

const Topleftbar = ({
  loading,
  diagramName,
  handleNameChange,
  handleKeyPress,
  handleFileChange,
  handleSave,
  setDiagramName,
  format,
  setFormat,
  cloudJSON,
  backgroundColor,
  setBackgroundColor,
}: any) => {
  const { data: session }: any = useSession();
  const [blockPickerColor, setBlockPickerColor] = React.useState("#37d67a");
  const [showColorPicker, setShowColorPicker] = React.useState(false);
  const [verifLoading, setVerifLoading] = React.useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);

  // Function to handle click outside of color picker
  const handleClickOutside = (event: any) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      setShowColorPicker(false);
    }
  };

  // Function to send verification email
  const sendVerifEmail = async () => {
    setVerifLoading(true);

    const email = session.user.email;
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
    } finally {
      setVerifLoading(false);
    }
  };

  // Function to save diagram to cloud
  const saveToCloud = async () => {
    const diagramNameRegex = /^[a-zA-Z0-9 _-]*$/;

    if (!diagramNameRegex.test(diagramName)) {
      toast.error(
        "Diagram name can only contain alphanumeric characters, underscores, and hyphens."
      );
      return;
    }
    const userID = session.user.id;
    const diagName = diagramName;
    const diagData = cloudJSON();
    const promise = axios.post("/api/diagrams/createDiagram", {
      userID,
      diagName,
      diagData,
    });

    toast.promise(promise, {
      loading: "Saving Diagram...",
      success: "Diagram saved successfully!",
      error: "Error saving diagram",
    });

    try {
      const response = await promise;
      const diagramID = response.data.diagramID;
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.delete("diagram"); // Remove any existing 'diagram' parameter
      currentUrl.searchParams.set("dID", diagramID); // Set or update the 'dID' parameter
      window.history.pushState({}, "", currentUrl); // Update the URL without reloading the page
    } catch (error: any) {
      console.error("Error saving diagram:", error.message);
    }
  };

  React.useEffect(() => {
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  return (
    <div
      className={`${loading ? "show" : "load"}
      fixed z-10 top-6 left-4 flex items-center justify-center gap-4`}
    >
      <Link href="/" target="_blank">
        <img
          src="/logo.svg"
          alt="logo"
          className="h-10 hover:scale-110 transition-transform ease-in-out cursor-pointer"
        />
      </Link>
      <input
        type="text"
        placeholder="Untitled Diagram"
        value={diagramName}
        onChange={handleNameChange}
        onKeyDown={handleKeyPress}
        className="bg-[#1a1a1a] border border-neutral-600 rounded-md pl-2 pb-[2px] hidden md:block"
      />
      <input
        type="file"
        onChange={(e) => handleFileChange(e)}
        accept=".json"
        className="hidden"
        id="file-input"
      />
      <label
        htmlFor="file-input"
        className="bg-[#1a1a1a] border border-neutral-600 text-white text-sm py-1 px-2 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:text-cyan-500 active:scale-95"
      >
        <FaUpload />
        Load
      </label>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="bg-[#1a1a1a] border border-neutral-600 text-white text-sm py-1 px-2 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 hover:text-emerald-500 active:scale-95">
            <FaDownload />
            Save
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="sm:max-w-[385px]">
          <Tabs defaultValue="local" className="">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="local">Local</TabsTrigger>
              <TabsTrigger value="cloud">Cloud</TabsTrigger>
            </TabsList>
            <TabsContent value="local">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-2xl pt-3 pb-2 text-main">
                  Save Diagram
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Choose Name and Format to save your Diagram.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid w-full items-center mt-1 gap-4">
                <div className="flex flex-col space-y-1.5 my-2 ">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    autoComplete="off"
                    className="py-4 focus:outline-none focus:border-neutral-400"
                    placeholder="Name of your diagram"
                    value={diagramName}
                    onChange={(e) => setDiagramName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="filetype">Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger id="filetype">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <SelectItem value="JSON">
                        <div className="flex items-center justify-start gap-2">
                          <LuFileJson2 size="1.6em" />
                          <span>JSON</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="SVG">
                        <div className="flex items-center justify-start gap-2">
                          <BsFiletypeSvg size="1.6em" />
                          <span>SVG</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PNG">
                        <div className="flex items-center justify-start gap-2">
                          <BsFiletypePng size="1.6em" />
                          <span>PNG</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {(format === "PNG" || format === "SVG") && (
                    <ColorPicker
                      setBackgroundColor={setBackgroundColor}
                      backgroundColor={backgroundColor}
                      showColorPicker={showColorPicker}
                      setShowColorPicker={setShowColorPicker}
                      pickerRef={pickerRef}
                      blockPickerColor={blockPickerColor}
                      setBlockPickerColor={setBlockPickerColor}
                    />
                  )}
                </div>
              </div>
              <AlertDialogFooter className="mt-10">
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleSave(format)}
                  disabled={!format}
                  className="px-6 disabled:bg-neutral-800 bg-main text-neutral-50 hover:bg-main hover:ring-1 ring-violet-300 font-semibold"
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </TabsContent>
            <TabsContent value="cloud">
              {session && session.user.isVerified ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl pt-3 pb-2 text-main">
                      Save Diagram to Cloud
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Choose Name to save your Diagram.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex flex-col space-y-1.5 my-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      autoComplete="off"
                      className="py-4 focus:outline-none focus:border-neutral-400"
                      placeholder="Name of your diagram"
                      value={diagramName}
                      onChange={(e) => setDiagramName(e.target.value)}
                    />
                  </div>
                  <AlertDialogFooter className="mt-10">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => saveToCloud()}
                      disabled={!diagramName}
                      className="px-6 disabled:bg-neutral-800 bg-main text-neutral-50 hover:bg-main hover:ring-1 ring-violet-300 font-semibold"
                    >
                      Save
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </>
              ) : session && !session.user.isVerified ? (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl pt-3 pb-2 text-main">
                      Save Diagram to Cloud
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      You are not verified. Please verify your account to save
                      diagrams to the cloud.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex justify-center items-center gap-4 pt-16 pb-8">
                    <button
                      disabled={verifLoading}
                      onClick={() => sendVerifEmail()}
                      className="flex items-center justify-center gap-2 bg-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-800 transition-all ease-in disabled:bg-indigo-950 disabled:text-neutral-400"
                    >
                      <MdEmail size="1.2em" />
                      <span>Send Verification Email</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-2xl pt-3 pb-2 text-main">
                      Save Diagram to Cloud
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Sign in to save your Diagram to cloud.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="flex justify-center items-center gap-4 pt-20 pb-8 ">
                    <HeaderButton
                      type="signup"
                      name="Sign up"
                      open="_blank"
                      color="gray"
                    />
                    <HeaderButton
                      type="signin"
                      name="Sign In"
                      open="_blank"
                      color="indigo"
                    />
                  </div>
                </>
              )}
            </TabsContent>
          </Tabs>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Topleftbar;
