import Link from "next/link";
import React from "react";

const TutorialContent = ({ linkChange }: { linkChange: string }) => {
  const [content, setContent] = React.useState<any>(null);
  const [hovered, setHovered] = React.useState(false);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const loadContent = async () => {
      try {
        setContent(null);
        const queryParams = new URLSearchParams(window.location.search);
        const tutorialID = queryParams.get("tutorial");
        if (typeof tutorialID === "string") {
          const loadedContent = await import(
            `./tutorialContent/${tutorialID}.json`
          );
          setContent(loadedContent.default);
        } else {
          const loadContent = await import(
            `./tutorialContent/tutorials-homepage.json`
          );
          setContent(loadContent.default);
        }
      } catch (error) {
        console.error("Error loading tutorial content:", error);
      }
    };

    loadContent();
  }, [linkChange]);

  React.useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [content]);

  if (!content) {
    return (
      <div className="flex justify-center items-center min-h-full">
        <img
          src="/logo.svg"
          alt="loading"
          className="w-24 h-24 animate-bounce"
        />
      </div>
    );
  }

  if (content.title === "Diagram Tutorials") {
    return (
      <div className="p-4">
        <h1 className="text-3xl md:text-4xl font-semibold text-white p-4">
          {content.title}
        </h1>
        <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
          {content.diagram1}
        </p>
        <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
          {content.diagram2}
        </p>
        <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
          {content.diagram3}
        </p>
        <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
          {content.diagram4}
        </p>
        <hr className="w-3/4 h-[1px] mx-auto mb-32 lg:mb-2 mt-8 lg:mt-16 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
      </div>
    );
  }
  return (
    <div ref={contentRef} className="p-4">
      <h1 className="text-3xl md:text-4xl font-semibold text-white p-4">
        {content.title}
      </h1>
      <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
        {content.diagram1}
      </p>
      <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
        {content.diagram2}
      </p>
      <hr className="w-3/4 h-[1px] mx-auto my-6 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
      <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
        {content.content1}
      </p>
      <p className="text-lg lg:text-xl p-4 md:text-justify text-neutral-400">
        {content.content2}
      </p>
      <ol className="mt-3 px-8 text-lg text-neutral-400 md:text-justify">
        <li className="font-semibold text-white text-xl">{content.h1}</li>
        <li>{content.li1}</li>
        <li className="font-semibold text-white text-xl mt-4">{content.h2}</li>
        <li>{content.li2}</li>
        <li className="font-semibold text-white text-xl mt-4">{content.h3}</li>
        <li>{content.li3}</li>
        <li className="font-semibold text-white text-xl mt-4">{content.h4}</li>
        <li>{content.li4}</li>
        <li className="font-semibold text-white text-xl mt-4">{content.h5}</li>
        <li>{content.li5}</li>
      </ol>
      <hr className="w-3/4 h-[1px] mx-auto my-12 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
      <div className="flex items-center justify-center relative">
        <img
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          src={content.tag}
          className={`border border-white rounded-xl w-3/4 mb-24 lg:mb-8 transition-all duration-300 ease-in-out ${
            hovered && "scale-[102%] blur-[2px]"
          }`}
          alt={content.title}
        />
        {hovered && (
          <Link
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            href={`/mistle?diagram=${content.link}`}
            target="_blank"
            className="absolute text-md md:text-lg font-medium top-[26%] md:top-[37%] lg:top-[42%] flex items-center gap-2 justify-center bg-main py-2 px-5 rounded-xl"
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
            Edit in Mistle
          </Link>
        )}
      </div>
    </div>
  );
};

export default TutorialContent;
