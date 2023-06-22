import Image from "next/image";
import Link from "next/link";
import { AiOutlineGithub } from "react-icons/ai";

const Navbar = () => {
  return (
    <header className="flex justify-between items-center w-full border-b-2 border-stone-400 mt-5 pb-7 sm:px-4 px-2">
      <Link href="/" className="flex space-x-2 items-center">
        <Image
          alt="header text"
          src="/logo.png"
          className="sm:w-14 sm:h-14 w-9 h-9"
          width={36}
          height={36}
        />
        <h1 className="sm:text-5xl text-3xl font-bold ml-2 tracking-tight text-white hover:text-white/50">
          CptAI
        </h1>
      </Link>
      <a
        className="flex flex-row items-center justify-center space-x-3 bg-black bg-gradient-to-b from-neutral-950 to-neutral-800/80 px-5 py-2.5 rounded-full border-[1.6px] border-black"
        href="https://github.com/keremesen/cptAI"
        target="_blank"
        rel="norefferer"
      >
        <AiOutlineGithub color="white" size={25} />
        <span className="text-gray-100">Star on Github</span>
      </a>
    </header>
  );
};

export default Navbar;
