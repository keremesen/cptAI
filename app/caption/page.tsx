"use client";
import { useState } from "react";

import Layout from "@/components/Layout";
import ResizablePanel from "@/components/ResizablePanel";

import { Uploader } from "uploader";
import { UploadDropzone } from "react-uploader";

import { AnimatePresence, motion } from "framer-motion";

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

  const UploadDropZone = () => (
    <UploadDropzone
      uploader={uploader}
      options={options}
      onUpdate={(file) => {
        if (file.length !== 0) {
         // setOriginalPhoto(file[0].fileUrl.replace("raw", "thumbnail"));
          // generateCaption(file[0].fileUrl.replace("raw", "thumbnail"));
        }
      }}
      width="670px"
      height="250px"
    />
  );

  return (
    <Layout>
      <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 mt-4 sm:mb-0 mb-8">
        <h1 className="mx-auto max-w-4xl font-display text-4xl font-bold tracking-normal  sm:text-6xl mb-5 text-white">
          Generate your caption
        </h1>
        <ResizablePanel>
          <AnimatePresence>
            <motion.div className="flex justify-between items-center w-full flex-col mt-4">
              {<UploadDropZone />}
            </motion.div>
          </AnimatePresence>
        </ResizablePanel>
      </main>
    </Layout>
  );
};

export default Caption;
