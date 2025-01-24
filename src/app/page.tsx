"use client";

import { useEffect } from "react";
import Header from "@/components/ui/header";
import Footer from "@/components/ui/footer";
import AOS from "aos";
import "aos/dist/aos.css";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { RiShareBoxLine } from "react-icons/ri";
import Lottie from "lottie-react";
import head from "./../../public/head.json";
import Link from "next/link";
import { cards } from "@/app/data/cards";

export default function Home() {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
    document.title = "Mistle Home";
  }, []);

  return (
    <div>
      <Header />
      <main className="flex flex-col items-center justify-center overflow-x-hidden">
        <div className="text-center bgdiv lg:h-screen w-full flex flex-col items-center justify-center">
          <div className="h-[44%] w-fit flex justify-center items-end lg:mt-36 mb-4">
            <Lottie
              animationData={head}
              className="hidden md:block md:w-full"
            />
            <img
              src="/logo.svg"
              alt="logo"
              className="w-3/5 md:hidden mt-8 mb-16"
            />
          </div>
          <h1 className=" text-2xl md:text-3xl lg:text-4xl font-bold md:w-3/4 px-8 mb-8 lg:mb-16 transition-all duration-300 ease-in-out">
            Free Online Diagrams Design Tool for all your documentation needs
          </h1>
          <div className="relative flex flex-col items-center justify-start mb-48">
            <Link href="./mistle/" target="_blank" rel="noopener noreferrer">
              <button className="getStarted">
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>
                </svg>
                Get Started
              </button>
            </Link>
            <svg
              viewBox="0 0 37.9 43.9"
              className="absolute top-20 w-[50%] hidden md:block"
            >
              <path
                className="arrow"
                d="M36.9,42c0,0-12.3,3.9-18.8-4.7c-2-2.6-3.1-5.8-2.3-9.1c0.7-3,2.9-6.3,6.1-7.1c1.1-0.2,2.3-0.2,3.1,0.5
	c0.7,0.5,1.1,1.2,1.5,2c0.8,1.8,0.6,3.9,0,5.7c-0.5,1.4-1.3,2.6-2.4,3.6c-1.2,0.9-2.7,1.5-4.2,1.6c-6.6,0.8-11.7-4.1-14.1-9.8
	c-2.8-6.9-1.8-15,1.7-21.5C7.7,2.6,8.1,2,8.3,1.4c1.6,2.7,3,5.6,4.7,8.2c-0.9-1.8-1.9-3.3-2.9-5.1C9.6,3.6,9.1,2.7,8.6,1.8
	c-0.4-0.7-0.4-1-1-0.6C5.2,2.6,2.9,4.3,1,6.3"
                fill="none"
                stroke="#f2f2f2"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center max-w-full">
          <h1 className=" text-2xl text-center md:text-3xl lg:text-4xl md:w-3/4 px-4 font-bold mb-12 lg:mb-32">
            Why Choose Mistle for creating Diagrams?
          </h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-24 lg:gap-32 mb-12 md:mb-30 lg:mb-40">
            <img
              src="/infos/info1.svg"
              className="w-2/3 block md:hidden"
              data-aos="fade-left"
              alt="Ease of Use"
            />
            <div className="w-2/3 md:w-1/3" data-aos="fade-right">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Ease of Use
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                Our app offers an intuitive user interface, making it easy for
                users of all levels to create diagrams without a steep learning
                curve and hassle of mandatory sign-ups.
              </p>
            </div>
            <img
              src="/infos/info1.svg"
              className="w-1/3 hidden md:block"
              data-aos="fade-left"
              alt="Ease of Use"
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-10 lg:mb-40">
            <img
              src="/infos/info2.svg"
              className="w-2/3 md:w-2/4 lg:w-1/3"
              data-aos="zoom-in"
              alt="Collaboration"
            />
            <div className="w-2/3 lg:w-1/3" data-aos="fade-left">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Diagram Versatility
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                With support for a wide range of diagram types, including
                flowcharts, UML diagrams, entity-relationship diagrams, and
                more, our app caters to the diverse documentation needs of users
                across different disciplines.
              </p>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32 mb-20 lg:mb-40">
            <div className="w-2/3 lg:w-1/3" data-aos="fade-right">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Export Options
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                Our app offers a variety of export options such as SVG, PNG, and
                JSON. Users can also save their diagrams directly to their free
                registered account for easy access.
              </p>
            </div>
            <img
              src="/infos/info3.svg"
              className="w-2/3 md:w-2/4 lg:w-1/3"
              data-aos="fade-left"
              alt="Export Options"
            />
          </div>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 mb-16 lg:mb-24">
            <img
              src="/infos/info4.svg"
              className="w-1/3 hidden lg:block"
              data-aos="fade-right"
              alt="Easy to Get Help"
            />
            <div className="w-2/3 lg:w-1/3" data-aos="fade-left">
              <h1 className="text-3xl lg:text-4xl font-medium mb-2">
                Easy to Get Help
              </h1>
              <p className="text-xl lg:text-2xl text-neutral-500 text-justify">
                We value your input! If you have any questions or suggestions,
                reach out to us. Mistle support is in-house and free!
              </p>
            </div>
            <img
              src="/infos/info4.svg"
              className="w-2/3 md:w-2/4 block lg:hidden"
              data-aos="fade-right"
              alt="Easy to Get Help"
            />
          </div>
          <div className="border border-white rounded-3xl flex flex-col items-center justify-center py-10 px-2 md:px-12 mx-16 mb-6 md:mb-16 lg:mb-24">
            <Link
              href="/tutorials/"
              rel="noopener noreferrer"
              target="_blank"
              className="text-2xl lg:text-4xl text-neutral-300 hover:text-white font-medium mb-4 flex items-center gap-[6px] "
            >
              Diagrams Resources <RiShareBoxLine size="0.6em" />
            </Link>
            <p className="text-lg lg:text-2xl mx-4 text-center text-neutral-500">
              Tutorials and guides, helping users learn diagram design
              principles and best practices!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 px-8 pt-8">
              {cards.map((diagram, index) => (
                <div
                  key={index}
                  onClick={() => window.open(diagram.link, "_blank")}
                  className="bg-center flex flex-col items-center justify-end bg-cover rounded-2xl cursor-pointer bg-no-repeat h-48 md:h-52 w-72 md:w-80 overflow-hidden 
               transition-transform duration-300 ease-in-out
               hover:scale-105 "
                  style={{ backgroundImage: `url('${diagram.source}')` }}
                >
                  <h1 className="bg-violet-500 text-center font-mono w-full py-1 bg-opacity-20">
                    {diagram.alt}
                  </h1>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:flex flex-col items-center justify-start">
            <h1 className="text-4xl mx-10 text-center font-medium mb-8">
              <span className="text-violet-600 font-bold"> MISTLE</span> is
              crafted using a diverse range of technologies!
            </h1>
            <InfiniteMovingCards
              direction="left"
              speed="slow"
              pauseOnHover={false}
              className="py-2"
            />
          </div>
          <div className="flex items-center flex-wrap justify-center gap-12 py-16">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium ">
              Try Mistle App now for free!
            </h1>
            <Link href="./mistle/" target="_blank" rel="noopener noreferrer">
              <button className="getStarted">
                <svg
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  height="16"
                  width="16"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"></path>
                </svg>
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
