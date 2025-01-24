import React from "react";

function Footer() {
  return (
    <footer className="flex justify-center items-center bottom-0 w-full border-t-2 border-zinc-800 bg-black p-2 border-opacity-50 bg-opacity-30">
      <p className=" text-zinc-400 mx-2 text-sm">
        MIT License Copyright &copy; 2023-{new Date().getFullYear()} Mistle.
      </p>
    </footer>
  );
}

export default Footer;
