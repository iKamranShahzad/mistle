import React from "react";
import { TbLogin2 } from "react-icons/tb";
import { FaPen } from "react-icons/fa";
import Link from "next/link";

const HeaderButton = (props: any) => {
  return (
    <Link
      href={`/account/${props.type}`}
      rel="noopener noreferrer"
      target={props.open}
      className={`headbutton ${props.color}`}
    >
      {props.type === "signin" ? (
        <>
          <div className="svg-wrapper">
            <TbLogin2 size="1.4em" className="headsvg" />
          </div>
          <span>{props.name}</span>
        </>
      ) : (
        <>
          <div className="svg-wrapper">
            <FaPen className="headsvg ml-1" />
          </div>
          <span>{props.name}</span>
        </>
      )}
    </Link>
  );
};

export default HeaderButton;
