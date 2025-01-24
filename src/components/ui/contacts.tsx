import { SiGithub } from "react-icons/si";
import { FaDiscord } from "react-icons/fa";
import { CgMail } from "react-icons/cg";

const Contacts = () => {
  return (
    <div className=" space-y-4">
      <div className="flex items-center justify-start gap-2">
        <CgMail color="#eb493b" size="2em" className="logoshadow" />
        <a
          href="mailto:mistlediagrams@gmail.com"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:underline font-medium ml-1"
        >
          E-mail Address
        </a>
      </div>
      <div className="flex items-center justify-start gap-2 mt-3">
        <SiGithub size="1.5em" className=" ml-[3px] logoshadow" />
        <a
          href="https://github.com/Mistle-Diagrams/Mistle"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:underline font-medium ml-[7px]"
        >
          Github Repository
        </a>
      </div>
      <div className="flex items-center justify-start gap-2 mt-3">
        <FaDiscord
          color="#5d6af2"
          size="1.5em"
          className=" ml-[2px] logoshadow"
        />
        <a
          href="https://discord.gg/hXkwdH5Uvr"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-300 hover:underline font-medium ml-[7.5px]"
        >
          Discord Server
        </a>
      </div>
    </div>
  );
};

export default Contacts;
