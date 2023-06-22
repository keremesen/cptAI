"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HiOutlineClipboardDocument } from "react-icons/hi2";

const HeroSection = () => {
    const [buttonText, setButtonText] = useState("Copy");

    const copyToClipboard = (caption: string) => {
      navigator.clipboard.writeText(caption!);
  
      setButtonText("Copied!");
      setTimeout(() => {
        setButtonText("Copy");
      }, 2000);
    };
  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-28 mt-20">
    <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-normal sm:text-7xl text-white">
      Easily add captions to your images
      <span className="relative whitespace-nowrap text-[#757fdf]">
        <span className="relative"> using AI.</span>
      </span>
    </h1>
    <p className="mx-auto mt-4 md:mt-12 max-w-xl text-lg text-stone-400 leading-7 ">
      Take your images to the next level with custom captions.
    </p>
    <Link
      className="bg-[#4b4cb7] rounded-xl text-white font-medium px-4 py-3 sm:mt-10 mt-4 hover:bg-[#4b4cb7]/80"
      href="/caption"
    >
      Create a caption
    </Link>
    <div className="flex flex-row  space-x-8 text-white w-full md:w-2/3 my-12">
      <div className="flex flex-col items-center w-full md:w-1/2">
        <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
        <Image
          alt="Dog and blue building"
          src="/example.jpg"
          className=" h-96 w-96 rounded-2xl"
          width={400}
          height={400}
        />
      </div>
      <div className="flex flex-col items-center  justify-start w-full md:w-1/2">
        <h2 className="mb-1 font-medium text-lg">Generated Caption</h2>
        <textarea
          className="w-full h-32 p-2 text-gray-700 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring"
          placeholder="Enter text here..."
          value="a brown dog standing on top of a blue building"
        />
        <button
          className="px-4 py-2 text-white bg-[#5a5cd1] rounded-md hover:bg-[#3f4194] focus:ring focus:outline-none mt-2"
          onClick={() =>
            copyToClipboard("a brown dog standing on top of a blue building")
          }
        >
          <div className="flex flex-row items-center justify-center">
            <HiOutlineClipboardDocument className="w-5 h-5 mr-1" />
            {buttonText}
          </div>
        </button>
      </div>
    </div>
  </main>
  )
}

export default HeroSection