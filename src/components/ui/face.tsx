import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Face = (props: any) => {
  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  return (
    <>
      <div className="flex flex-col justify-center items-center px-2">
        <img
          data-aos="zoom-in"
          src={`/avatars/${props.name}.png`}
          alt="avatar"
          className=" w-28 rounded-full"
        />
        <h1 className=" text-2xl mt-4">{props.title}</h1>
        <p className=" text-md text-neutral-400 text-center">{props.info}</p>
      </div>
    </>
  );
};

export default Face;
