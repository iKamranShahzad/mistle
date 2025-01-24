"use client";

import Face from "@/components/ui/face";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import AOS from "aos"; //Animate on Scroll library
import "aos/dist/aos.css";
import { useEffect } from "react";

export default function AboutUs() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
    document.title = "Mistle - About us";
  }, []);

  return (
    <>
      <Header />
      <div className=" mt-16 lg:mt-32 flex flex-col items-center justify-center">
        <div className="flex flex-col lg:flex-row items-center justify-center w-3/4 mb-8 lg:mb-12 gap-16">
          <h1 className="text-3xl text-center lg:text-left lg:text-4xl xl:text-6xl ">
            Our mission is to revolutionize project documentation.
          </h1>
          <img
            src="/piechart.svg"
            alt="piechart"
            className="w-3/4 lg:w-2/5 teeter z-0"
          />
        </div>
        <hr className="w-3/4 h-[1px] mx-auto my-12 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
        <h1 className="text-3xl lg:text-4xl">How do we do it?</h1>
        <p className="text-md text-center text-neutral-400 px-8 lg:text-xl mt-2">
          We do this with flexible and open software that is simple to adapt to
          and is a delight to use.
        </p>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-12 lg:gap-28 text-justify my-12">
          <img
            data-aos="zoom-in-right"
            src="/techstack.svg"
            alt="techstack"
            className="h-48 lg:h-56"
          />
          <p className=" text-xl italic text-neutral-400 w-[16em]">
            We leverage <span className=" text-white"> Next.js</span> and
            <span className=" text-cyan-500"> React.js</span> in conjunction
            with the diagram library
            <span className=" text-sky-700"> GoJS</span> to deliver our diagram
            creation services. This powerful combination ensures a seamless user
            experience and robust functionality for crafting various types of{" "}
            <span className=" text-main"> diagrams.</span>
          </p>
        </div>
        <hr className="w-3/4 h-[1px] mx-auto my-12 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
        <h1 className="text-3xl lg:text-4xl">Meet our Team!</h1>
        <p className=" text-lg px-4 lg:px-0 lg:w-2/4 italic text-neutral-400 text-center mt-2">
          Experience, skill and diversity all come together to form our team -
          one that is innovative, visionary, and inclusive.
        </p>
        <div className="flex justify-center items-center gap-16 lg:gap-24 xl:gap-32 pt-12 py-4 flex-wrap">
          <Face
            name="aibi"
            title="Muhammad Abdullah"
            info="Frontend & UI/UX Designer"
          />
          <Face
            name="inam"
            title="Inam Ul Huq"
            info="Database and Server Administrator"
          />
          <Face
            name="drake"
            title="Kamran Shahzad"
            info="Backend and System Developer"
          />
        </div>
        <br />
        <hr className="w-3/4 h-[1px] mx-auto my-8 bg-gradient-to-r from-transparent via-gray-100 to-transparent border-0 rounded" />
        <h1 className="text-3xl lg:text-4xl mt-8">Join us Today!</h1>
        <p className=" text-lg px-4 lg:px-0 lg:w-2/4 italic text-center text-neutral-400 mt-4">
          Our web application is free and open-source, welcoming contributions
          from anyone interested in enhancing its features and functionality.
        </p>
        <img
          src="/teamwork.svg"
          alt="joinus"
          className="w-3/5 lg:w-1/3 teeter my-12"
        />
      </div>
      <br />
      <Footer />
    </>
  );
}
