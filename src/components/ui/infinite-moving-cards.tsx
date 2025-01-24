"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const InfiniteMovingCards = ({
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}: {
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);

  useEffect(() => {
    addAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [start, setStart] = useState(false);
  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }
  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "forwards"
        );
      } else {
        containerRef.current.style.setProperty(
          "--animation-direction",
          "reverse"
        );
      }
    }
  };
  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  const techstack = [
    { source: "/techstack/next.svg", alt: "NextJS" },
    { source: "/techstack/gojs.svg", alt: "GoJS" },
    { source: "/techstack/react.svg", alt: "ReactJS" },
    { source: "/techstack/tcss.svg", alt: "Tailwind CSS" },
    { source: "/techstack/shadcn.svg", alt: "ShadCN" },
    { source: "/techstack/mongodb.svg", alt: "MongoDB" },
    { source: "/techstack/github.svg", alt: "Github" },
  ];
  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 sm:max-w-lg md:max-w-2xl lg:max-w-5xl xl:max-w-7xl overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          " flex items-center min-w-full shrink-0 py-4 w-max flex-nowrap",
          start && "animate-scroll ",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {techstack.map((tech, index) => (
          <li
            key={index}
            className="w-[350px] max-w-full flex items-center justify-center relative flex-shrink-0 p-6 lg:w-[450px]"
          >
            <img src={tech.source} alt={tech.alt} className="h-16" />
          </li>
        ))}
      </ul>
    </div>
  );
};
