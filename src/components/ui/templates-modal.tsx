import React from "react";
import { cards } from "@/app/data/diagrams";

const Templates = () => {
  return (
    <div
      className=" flex h-screen pb-28 flex-wrap items-start justify-center gap-10"
      style={{ scrollbarWidth: "none", overflowY: "scroll" }}
    >
      {cards.map((diagram, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center gap-1.5"
        >
          <div
            key={index}
            onClick={() => window.open(diagram.link, "_self")}
            className="bg-center bg-cover rounded-2xl bg-no-repeat h-36 w-60 md:h-48 md:w-80 cursor-pointer overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 "
            style={{
              backgroundImage: `url('${diagram.source}')`,
            }}
          ></div>
          <h1 className="text-white text-xs md:text-sm text-center w-full">
            {diagram.alt}
          </h1>
        </div>
      ))}
    </div>
  );
};

export default Templates;
