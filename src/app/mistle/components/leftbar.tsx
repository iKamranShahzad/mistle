import { LuUndo, LuRedo, LuShapes, LuLayoutTemplate } from "react-icons/lu";
import { GiArrowCursor } from "react-icons/gi";
import { FaRegNoteSticky } from "react-icons/fa6";
import { BiText } from "react-icons/bi";
import { RiFileCloseLine } from "react-icons/ri";
import { TbArrowCurveLeft } from "react-icons/tb";
import { BsArrowUpRight } from "react-icons/bs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Templates from "@/components/ui/templates-modal";

const Leftbar = ({
  loading,
  pallete,
  setPallete,
  togglePalette,
  textStyles,
  setTextStyles,
  toggleTextStyles,
  linkType,
  setLinkType,
  diagramRef,
  addNote,
}: any) => {
  const handleClosure = () => {
    setPallete(false);
    setTextStyles(false);
  };

  return (
    <div
      className={`${loading ? "show" : "load"}
fixed z-10 top-[20%] left-4 flex flex-col items-center justify-center gap-4 max-h-screen`}
    >
      <div className="w-10 pt-1 pb-2 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-2">
        <GiArrowCursor
          onClick={() => handleClosure()}
          size="2em"
          className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
        />
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <LuShapes
                onClick={() => togglePalette()}
                size="2em"
                className={`${
                  pallete ? "bg-slate-800" : ""
                } text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1`}
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">Shapes</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger
              onClick={() => setLinkType((prevLinkType: any) => !prevLinkType)}
            >
              {linkType ? (
                <BsArrowUpRight
                  size="2em"
                  className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
                />
              ) : (
                <TbArrowCurveLeft
                  size="2em"
                  className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
                />
              )}
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">Link Type</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <BiText
                onClick={() => toggleTextStyles()}
                size="2em"
                className={`${
                  textStyles ? "bg-slate-800" : ""
                } text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1`}
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">Text Styles</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <FaRegNoteSticky
                onClick={() => {
                  addNote();
                }}
                size="2em"
                className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">Add a Note</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Dialog>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <DialogTrigger asChild>
                  <LuLayoutTemplate
                    size="2em"
                    className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
                  />
                </DialogTrigger>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="py-0.5">Templates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DialogContent className="z-50 h-screen max-w-6xl">
            <DialogHeader>
              <DialogTitle>Templates</DialogTitle>
              <DialogDescription className="border-t border-purple-400 pt-6">
                <Templates />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
      <div className="w-10 h-20 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-2">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <LuUndo
                onClick={() =>
                  diagramRef.current?.getDiagram()?.commandHandler.undo()
                }
                size="2em"
                className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mt-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">
                Undo{" "}
                <span className="bg-neutral-800 py-1 px-1.5 rounded-md">
                  Ctrl + Z
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <LuRedo
                onClick={() =>
                  diagramRef.current?.getDiagram()?.commandHandler.redo()
                }
                size="2em"
                className=" text-purple-400 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1 mb-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5">
                Redo{" "}
                <span className="bg-neutral-800 py-1 px-1.5 rounded-md">
                  Ctrl + Y
                </span>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <div className="w-10 h-10 bg-slate-950 rounded-lg flex flex-col items-center justify-center gap-2">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <RiFileCloseLine
                onClick={() => {
                  if (
                    window.confirm(
                      "This action cannot be undone. Are you sure you want to clear the canvas?"
                    )
                  ) {
                    diagramRef.current?.getDiagram()?.clear();
                  }
                }}
                size="2em"
                className=" text-red-500 hover:bg-slate-800 active:bg-slate-900 rounded-lg p-1"
              />
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="py-0.5 text-red-400">Clear Canvas</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Leftbar;
