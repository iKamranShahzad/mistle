import {
  MdGridOff,
  MdGridOn,
  MdOutlineLightMode,
  MdOutlineDarkMode,
  MdOutlineFitScreen,
} from "react-icons/md";
import { AiOutlineFullscreen, AiOutlineFullscreenExit } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { LuAlignStartVertical } from "react-icons/lu";
import { BiHelpCircle } from "react-icons/bi";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import HelpModal from "@/components/ui/shortcuts-modal";
import { cards } from "@/app/data/diagrams";

const Settings = ({
  loading,
  theme,
  guide,
  grid,
  fscreen,
  zoomToFit,
  toggleGuidedDraggingTool,
  handleToggleGuides,
  toggleGrid,
  toggleFullScreen,
  handleThemeChanges,
}: any) => {
  return (
    <div
      className={`${loading ? "show" : "load"}
  fixed z-10 h-10 bottom-4 right-4 bg-transparent rounded-lg flex items-center justify-center gap-1`}
    >
      <Dialog>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <DialogTrigger asChild>
                <BiHelpCircle
                  size="2.4em"
                  className={`${
                    theme ? "text-purple-400" : "text-slate-950"
                  } p-1 active:scale-90`}
                />
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p className="py-0.5">Shortcuts Help</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="z-50 h-screen md:h-3/4">
          <div className=" overflow-y-hidden">
            <DialogHeader>
              <DialogTitle>Shortcuts Guide</DialogTitle>
              <DialogDescription className=" border-t border-purple-400 pt-4">
                <HelpModal />
              </DialogDescription>
            </DialogHeader>
          </div>
        </DialogContent>
      </Dialog>
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger onClick={() => zoomToFit()}>
            <MdOutlineFitScreen
              size="2.6em"
              className={`${
                theme ? "text-purple-400" : "text-slate-950"
              } p-1 active:scale-90`}
            />
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Zoom to Fit</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Popover>
        <PopoverTrigger>
          <IoSettingsOutline
            size="2.4em"
            className={`${
              theme ? "text-purple-400" : "text-slate-950"
            } p-1 cog`}
          />
        </PopoverTrigger>
        <PopoverContent
          onOpenAutoFocus={(event) => {
            event.preventDefault();
          }}
          className="flex bg-slate-950 ml-1 flex-col items-center justify-center gap-3"
        >
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={() => toggleGuidedDraggingTool()}>
                <LuAlignStartVertical
                  onClick={() => handleToggleGuides()}
                  size="2em"
                  className={`${
                    guide ? "text-purple-400" : "text-red-500"
                  } rounded-lg p-1 hover:bg-slate-800 active:bg-slate-900 mt-0.5`}
                />
              </TooltipTrigger>
              <TooltipContent side="left" className="mr-1.5">
                <p>Toggle Guides</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={() => toggleGrid()}>
                {grid ? (
                  <MdGridOn
                    size="2em"
                    className="text-purple-400 rounded-lg p-1 hover:bg-slate-800 active:bg-slate-900"
                  />
                ) : (
                  <MdGridOff
                    size="2em"
                    className="text-purple-400 rounded-lg p-1 hover:bg-slate-800 active:bg-slate-900"
                  />
                )}
              </TooltipTrigger>
              <TooltipContent side="left" className="mr-1.5">
                <p>Toggle Grid</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={() => toggleFullScreen()}>
                {fscreen ? (
                  <AiOutlineFullscreenExit
                    size="2.2em"
                    className="text-purple-400 rounded-lg p-1 hover:bg-slate-800 active:bg-slate-900"
                  />
                ) : (
                  <AiOutlineFullscreen
                    size="2em"
                    className="text-purple-400 rounded-lg p-[2px] hover:bg-slate-800 active:bg-slate-900"
                  />
                )}
              </TooltipTrigger>
              <TooltipContent side="left" className="mr-[5px]">
                <p>Toggle Fullscreen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={() => handleThemeChanges()}>
                {theme ? (
                  <MdOutlineDarkMode
                    size="2em"
                    className=" text-purple-400 rounded-lg p-1 hover:bg-slate-800 active:bg-slate-900 mb-0.5"
                  />
                ) : (
                  <MdOutlineLightMode
                    size="2em"
                    className="text-purple-400 rounded-lg p-1 hover:bg-slate-800 active:bg-slate-900 mb-0.5"
                  />
                )}
              </TooltipTrigger>
              <TooltipContent side="left" className="mr-1.5">
                <p>Change Theme</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default Settings;
