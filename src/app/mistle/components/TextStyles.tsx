import React from "react";
import { FaUnderline } from "react-icons/fa";

// TextStyles component
const TextStyles = ({ textStyles, changeText, diagramRef }: any) => {
  const [underline, setUnderline] = React.useState(false);

  // Function to toggle underline
  const toggleUnderline = () => {
    setUnderline((prevUnderline) => !prevUnderline);
    changeText(diagramRef.current?.getDiagram(), underline, "setUnderline");
  };

  // List of fonts
  const fonts = [
    { font: "Arial", fontFamily: "sans-serif" },
    { font: "Verdana", fontFamily: "sans-serif" },
    { font: "Trebuchet MS", fontFamily: "sans-serif" },
    { font: "Times New Roman", fontFamily: "serif" },
    { font: "Lucida Console", fontFamily: "monospace" },
    { font: "Comic Sans", fontFamily: "cursive" },
    { font: "Impact", fontFamily: "fantasy" },
  ];

  return (
    <div
      className={`${
        textStyles
          ? "opacity-100 left-[66px] z-10"
          : "opacity-0 left-[46px] -z-10"
      } fixed top-[28%] p-2 w-48  rounded-2xl border-2 border-purple-400 bg-neutral-800 transition-all duration-300 ease-in-out`}
    >
      <div className="flex items-center justify-center gap-4 pt-4 pb-6">
        <FaUnderline
          onClick={() => toggleUnderline()}
          className="h-4 w-4 cursor-pointer active:scale-95"
        />
      </div>
      <ul>
        {fonts.map((font, index) => (
          <li
            key={index}
            className="border-b-[1px] border-neutral-900 mb-2 px-1 cursor-pointer hover:bg-neutral-900 hover:text-white transition-all duration-200 ease-in-out"
            onClick={() =>
              changeText(
                diagramRef.current?.getDiagram(),
                `19px ${font.font}, ${font.fontFamily}`,
                "fontType"
              )
            }
          >
            <p>{font.font}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TextStyles;
