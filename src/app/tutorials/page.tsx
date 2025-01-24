"use client";
import Header from "@/components/ui/header";
import React from "react";
import TutorialContent from "./tutorial-content";
import { IoClose } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

// This component will display the tutorials page
const Tutorials = () => {
  const [selectedTutorial, setSelectedTutorial] = React.useState("");
  const [showBar, setShowBar] = React.useState(false);

  React.useEffect(() => {
    document.title = "Mistle Tutorials";
  }, []);

  // This function will handle the tutorial selection
  const handleSelection = (tutorial: string) => {
    setShowBar(false);
    const tutorialUrl = tutorial.toLowerCase().replace(/\s+/g, "-");
    updateUrlParameter("tutorial", tutorialUrl);
    setSelectedTutorial(tutorial);
  };

  // This function will update the URL parameter on selecting a tutorial
  const updateUrlParameter = (key: any, value: any) => {
    const url = new URL(window.location.href);
    url.searchParams.set(key, value);
    window.history.pushState({}, "", url);
  };

  // List of diagrams and tutorials
  const diagrams = [
    {
      name: "Use Case Diagram",
      tutorials: ["E-commerce Website", "Bank Management System"],
    },
    {
      name: "Activity Diagram",
      tutorials: ["Online Shopping Store", "Software Development Life Cycle"],
    },
    {
      name: "Sequence Diagram",
      tutorials: ["Ticket Booking System", "Messaging Application"],
    },
    {
      name: "State Machine Diagram",
      tutorials: ["Traffic Light System", "E-commerce Website Order"],
    },
    {
      name: "Component Diagram",
      tutorials: ["Simple Web Application", "Simlpe Software System"],
    },
    {
      name: "Deployment Diagram",
      tutorials: ["Webapp Physical Deployment", "Mirco-service Deployment"],
    },
    {
      name: "Flowchart Diagram",
      tutorials: ["Troubleshooting Guide", "Simple Game Rules"],
    },
    {
      name: "Entity-Relationship Diagram",
      tutorials: ["University Management System", "Online Marketplace"],
    },
  ];

  return (
    <>
      <Header />

      {/* Mobile Menu */}

      <div className="lg:hidden">
        {!showBar && (
          <div
            onClick={() => setShowBar(!showBar)}
            className="fixed z-10 bg-main text-black p-1 rounded-full bottom-6 right-6"
          >
            <BsThreeDots size="2.4em" />
          </div>
        )}
        {showBar && (
          <div
            className="absolute z-10 left-[2%] h-[85%] mt-3 border border-main rounded-xl bg-[#020202] sm:w[40%] md:w-[35%] "
            style={{ scrollbarWidth: "none", overflowY: "scroll" }}
          >
            <ul>
              <li className=" text-main text-xl md:text-2xl font-semibold ml-4 py-3 md:pt-3 md:pb-4">
                <div
                  className="cursor-pointer"
                  onClick={() => handleSelection("tutorials-homepage")}
                >
                  Diagram Tutorials
                </div>
                <IoClose
                  size="1.6em"
                  onClick={() => setShowBar(!showBar)}
                  className="text-white absolute top-2 right-2 "
                />
              </li>
              {diagrams.map((diagram, index) => (
                <li key={index}>
                  {typeof diagram === "string" ? (
                    diagram
                  ) : (
                    <>
                      <div className=" bg-neutral-950">
                        <div className="ml-4 py-1 text-lg font-medium cursor-default">
                          {diagram.name}
                        </div>
                      </div>
                      <ul className=" ml-7 mr-1 my-2">
                        {diagram.tutorials.map((tutorial, tutIndex) => (
                          <li
                            key={tutIndex}
                            onClick={() => handleSelection(tutorial)}
                            className={`text-neutral-400 hover:text-neutral-200 relative cursor-pointer ${
                              selectedTutorial === tutorial
                                ? " text-orange-600 hover:text-orange-600 font-semibold"
                                : ""
                            }`}
                          >
                            {selectedTutorial === tutorial && (
                              <div className="h-[7px] w-[7px] absolute left-[-5%] bottom-[9px] rounded-full bg-orange-600"></div>
                            )}
                            {tutorial}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Web Menu */}

      <div
        className="hidden lg:block z-10 fixed left-[1%] h-[85%] mt-24 border border-main rounded-xl bg-[#020202] w-[22%]"
        style={{ scrollbarWidth: "none", overflowY: "scroll" }}
      >
        <ul>
          <li className=" text-main text-2xl font-semibold text-center py-3 pb-4">
            <div
              className="cursor-pointer"
              onClick={() => handleSelection("tutorials-homepage")}
            >
              Diagram Tutorials
            </div>
          </li>
          {diagrams.map((diagram, index) => (
            <li key={index}>
              {typeof diagram === "string" ? (
                diagram
              ) : (
                <>
                  <div className=" bg-neutral-950">
                    <div className="ml-4 py-1 text-lg font-medium cursor-default">
                      {diagram.name}
                    </div>
                  </div>
                  <ul className=" ml-7 mr-1 my-2">
                    {diagram.tutorials.map((tutorial, tutIndex) => (
                      <li
                        key={tutIndex}
                        onClick={() => handleSelection(tutorial)}
                        className={`text-neutral-400 hover:text-neutral-200 relative cursor-pointer ${
                          selectedTutorial === tutorial
                            ? " text-orange-600 hover:text-orange-600 font-semibold"
                            : ""
                        }`}
                      >
                        {selectedTutorial === tutorial && (
                          <div className="h-2 w-2 absolute left-[-4%] bottom-[9px] rounded-full bg-orange-600"></div>
                        )}
                        {tutorial}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div
        className="fixed lg:right-[1%] h-full lg:h-[85%] lg:mt-24 lg:border border-main rounded-xl bg-[#020202] w-full lg:w-[75%]"
        style={{ scrollbarWidth: "none", overflowY: "scroll" }}
      >
        <TutorialContent linkChange={selectedTutorial} />
      </div>
    </>
  );
};

export default Tutorials;
