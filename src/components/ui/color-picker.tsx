import React from "react";
import { BlockPicker } from "react-color";
import { Label } from "@/components/ui/label";

const ColorPicker = ({
  setBackgroundColor,
  setShowColorPicker,
  showColorPicker,
  backgroundColor,
  pickerRef,
  blockPickerColor,
  setBlockPickerColor,
}: any) => {
  return (
    <div className="flex flex-col space-y-1.5 py-4">
      <Label>Background Color</Label>
      <div className="pt-1 flex flex-row">
        <button
          className="bg-neutral-800 text-white text-sm h-10 w-[270px] py-1 px-2 rounded-md cursor-pointer flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-105 active:scale-100"
          onClick={() => setBackgroundColor("transparent")}
        >
          Transparent
        </button>
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            style={{
              backgroundColor:
                backgroundColor === "transparent"
                  ? "#FFFFFF"
                  : backgroundColor || "#FFFFFF",
              height: "40px",
              position: "relative",
              left: "16px",
              width: "48px",
              padding: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          ></button>
          {showColorPicker && (
            <div ref={pickerRef} className=" absolute top-14 -left-[45px] z-10">
              <BlockPicker
                color={blockPickerColor}
                onChange={(color) => {
                  setBlockPickerColor(color.hex);
                  setBackgroundColor(color.hex);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
