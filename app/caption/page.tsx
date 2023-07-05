"use client";
import { useState } from "react";
import Image from "next/image";

import Layout from "@/components/Layout";
import ResizablePanel from "@/components/ResizablePanel";
import LoadingDots from "@/components/LoadingDots";

import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";

import { AnimatePresence, motion } from "framer-motion";
import { HiOutlineClipboardDocument } from "react-icons/hi2";

const uploader = Uploader({
  apiKey: !!process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    ? process.env.NEXT_PUBLIC_UPLOAD_API_KEY
    : "free",
});
const options = {
  maxFileCount: 1,
  mimeTypes: ["image/jpeg", "image/png", "image/jpg"],
  editor: { images: { crop: false } },
  styles: {
    colors: {
      primary: "#5a5cd1", // Primary buttons & links
      error: "#d23f4d", // Error messages
      shade100: "#fff", // Standard text
      shade200: "#fffe", // Secondary button text
      shade300: "#fffd", // Secondary button text (hover)
      shade400: "#fffc", // Welcome text
      shade500: "#fff9", // Modal close button
      shade600: "#fff7", // Border
      shade700: "#fff2", // Progress indicator background
      shade800: "#fff1", // File item background
      shade900: "#ffff", // Various (draggable crop buttons, etc.)
    },
  },
};

const Caption = () => {
  const [originalPhoto, setOriginalPhoto] = useState<string | null>(null);
  const [caption, setCaption] = useState<string | null>(null);
  const [buttonText, setButtonText] = useState("Copy");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(caption!);

    setButtonText("Copied!");
    setTimeout(() => {
      setButtonText("Copy");
    }, 2000);
  };

  async function generateCaption(fileUrl: string) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(true);
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      body: JSON.stringify({ imageUrl: fileUrl }),
      headers: {
        "Content-Type": "application/json",
        Accept: 'application/json',
      },
    });
    if (res.status !== 200) {
      const errorResponse = await res.text();
      setError(errorResponse);
    } else {
      try {
        const captionResponse = await res.text();
        setCaption(captionResponse);
      } catch (error) {
        console.log(error);
        setError("Invalid JSON response");
      }
    }
    setLoading(false);
  }

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
          setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
          generateCaption(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  //const caption2 = await generateCaption()
  return (
    <Layout>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal  sm:text-6xl mb-5 text-white">
          Generate your caption
        </h1>
        <ResizablePanel>
          <AnimatePresence>
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              {!originalPhoto && <UploadDropZone />}
              {originalPhoto && !caption && (
                <Image
                  alt="original photo"
                  src={originalPhoto}
                  className="rounded-2xl"
                  width={475}
                  height={475}
                />
              )}
              {caption && originalPhoto && (
                <div className="flex sm:space-x-10 sm:flex-row flex-col text-white">
                  <div className="w-full md:w-1/2">
                    <h2 className="mb-1 font-medium text-lg">Original Photo</h2>
                    <Image
                      alt="original photo"
                      src={originalPhoto}
                      className="rounded-2xl relative"
                      width={475}
                      height={475}
                    />
                  </div>
                  <div className="w-full md:w-1/2 sm:mt-0 mt-8">
                    <h2 className="mb-1 font-medium text-lg ">
                      Generated Caption
                    </h2>
                    <textarea
                      className="w-full h-32 p-2 text-gray-700 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring"
                      placeholder="Enter text here..."
                      value={caption.replace("Caption: ", "")}
                    />
                    <button
                      className="px-4 py-2 text-white bg-[#5a5cd1] rounded-md hover:bg-[#3f4194]  focus:outline-none focus:ring"
                      onClick={copyToClipboard}
                    >
                      <div className="flex flex-row items-center justify-center">
                        <HiOutlineClipboardDocument className="w-5 h-5 mr-1" />
                        {buttonText}
                      </div>
                    </button>
                  </div>
                </div>
              )}
              {loading && (
                <button
                  disabled
                  className="bg-white rounded-full text-white font-medium px-4 pt-2 pb-3 mt-8 hover:bg-white/80 w-40"
                >
                  <span className="pt-4">
                    <LoadingDots color="black" style="large" />
                  </span>
                </button>
              )}
              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mt-8"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}
              <div className="flex space-x-2 justify-center">
                {originalPhoto && !loading && (
                  <button
                    onClick={() => {
                      setOriginalPhoto(null);
                      setCaption(null);
                      setError(null);
                    }}
                    className="bg-white rounded-full text-black font-medium px-4 py-2 mt-8 hover:bg-white/80 transition"
                  >
                    Upload New Photo
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
    </Layout>
  );
};

export default Caption;
