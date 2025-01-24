import React from "react";
import { toast } from "sonner";
import { PiSpinnerBold } from "react-icons/pi";
import { MdDeleteForever } from "react-icons/md";
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

const MyDiagrams = ({ diagrams, loading, openLink, getDiagrams }: any) => {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const handleDelete = async (diagramID: string) => {
    const promise = fetch(
      `/api/diagrams/deleteDiagram?diagramID=${diagramID}`,
      {
        method: "DELETE",
      }
    );

    toast.promise(promise, {
      loading: "Deleting Diagram...",
      success: "Diagram deleted successfully!",
      error: "Error deleting diagram",
    });

    try {
      const response = await promise;
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      getDiagrams();
    }
  };

  return (
    <>
      {loading && diagrams.length === 0 ? (
        <div className="flex items-center justify-center">
          <PiSpinnerBold size="2em" className="text-main animate-spin" />
        </div>
      ) : diagrams.length > 0 ? (
        <ul
          className="px-2 pb-32 h-screen flex flex-col items-center justify-start"
          style={{
            scrollbarWidth: "none",
            overflowY: "scroll",
          }}
        >
          {diagrams.map((diagram: any) => (
            <li
              onMouseEnter={() => setHoveredId(diagram._id)}
              onMouseLeave={() => setHoveredId(null)}
              key={diagram._id}
              className="relative mt-2 mb-6"
            >
              <div
                className={`bg-center flex flex-col items-center justify-end bg-cover rounded-2xl bg-no-repeat h-40 md:h-48 w-64 md:w-80 overflow-hidden transition-transform duration-300 ease-in-out ${
                  hoveredId === diagram._id ? "scale-105" : ""
                }`}
                style={{
                  backgroundImage: `url("/diagramCards/thumb.svg")`,
                }}
              >
                <h1 className="bg-violet-700 text-white text-based whitespace-nowrap overflow-hidden overflow-ellipsis font-semibold text-center w-full px-4 py-2">
                  {diagram.name}
                </h1>
              </div>
              {hoveredId === diagram._id && (
                <div className="absolute text-md md:text-md font-medium left-[21%] md:left-[26%] top-[30%] md:top-[34%] flex items-center gap-2 justify-center text-neutral-100">
                  <button
                    onClick={() =>
                      window.open(`/mistle?dID=${diagram._id}`, openLink)
                    }
                    className="bg-neutral-300 text-main py-1.5 px-2 rounded-lg flex items-center justify-end gap-1"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      fill="currentColor"
                      height="16"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>
                    </svg>
                    Edit
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger>
                      <div className="bg-neutral-300 text-red-600 py-1.5 px-2 rounded-lg cursor-pointer flex items-center justify-end gap-1">
                        <MdDeleteForever size="1.4em" />
                        Delete
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete your diagram.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(diagram._id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center italic">
          No Saved Diagrams
        </div>
      )}
    </>
  );
};

export default MyDiagrams;
