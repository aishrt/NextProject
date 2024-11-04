"use client";
// import { uploadImage } from '@/api/upload/uploadImage';
// // import { getVideoCover } from '@/utils/getVideoCover';
// import React, { useState } from 'react';

// type Image = {
//   url: string;
//   name: string;
// };

// type Video = {
//   url: string;
//   name: string;
// };

// export const useMultipleSelect = () => {
//   const [images, setImages] = useState<string[]>([]);
//   const [uploaded, setUploaded] = useState<Image[]>([]);
//   const [videoUpload, setVideoUpload] = useState<Video[]>([]);

//   const [load, setload] = useState<boolean>(false);
//   const [text, setText] = useState<string[]>([]);
//   const [about, setAbout] = useState<string[]>([]);
//   const [file, setFile] = useState<File | null>(null);

//   // const [cover, setCover] = useState<string>();
//   // const [pdfName, setpdfName] = useState<string>();

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const previews = [];
//     const texts = text;
//     const abouts = about;
//     const uploads = uploaded;
//     const files = e?.target?.files ?? [];

//     for (const file of files) {
//       if (file) {
//         setload(true);
//         const preview = URL.createObjectURL(file);

//         previews.push(preview);
//         texts.push('');
//         abouts.push('');
//         const res = await uploadImage({ file });
//         uploads.push({ url: res.url, name: file.name });
//         setload(false);
//         // if (isVideo(file.name)) {
//         //   const cov = await getVideoCover(file, 1.5);
//         //   setCover(cov);
//         // }
//         // if (isPdf(file.name)) {
//         //   const pdfName = file.name;
//         //   setpdfName(pdfName);
//         // }
//       }
//     }
//     setUploaded(uploads);
//     setload(load);
//     setText(texts);
//     setImages(images.concat(previews));
//   };

//   const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const previews = [];
//     const videos = videoUpload;
//     const files = e?.target?.files ?? [];

//     for (const file of files) {
//       if (file) {
//         setload(true);
//         const preview = URL.createObjectURL(file);

//         previews.push(preview);

//         const res = await uploadImage({ file });
//         videos.push({ url: res.url, name: file.name });

//         setload(false);
//       }
//     }
//     setVideoUpload(videos);
//     setload(load);
//   };

//   const deleteImage = (val: number) => {
//     const filteredItems = images.filter((_i, index) => index !== val);
//     const uploadsItems = uploaded.filter((_i, index) => index !== val);
//     const filteredNames = text.filter((_i, index) => index !== val);
//     const filteredAbouts = about.filter((_i, index) => index !== val);
//     setText(filteredNames);
//     setAbout(filteredAbouts);
//     setImages(filteredItems);
//     setUploaded(uploadsItems);
//   };

//   const deleteVideo = (val: number) => {
//     const uploadsVideo = videoUpload.filter((_i, index) => index !== val);
//     setVideoUpload(uploadsVideo);
//   };

//   return {
//     file,
//     images,
//     load,
//     handleImageChange,
//     handleVideoChange,
//     setImages,
//     setFile,
//     uploaded,
//     videoUpload,
//     deleteImage,
//     deleteVideo,
//     text,
//     about,
//     setAbout,
//     setText,
//   };
// };

// export function getExtension(filename: string) {
//   const parts = filename.split('.');
//   return parts[parts.length - 1];
// }

// export function isImage(filename: string) {
//   const ext = getExtension(filename);
//   switch (ext.toLowerCase()) {
//     case 'jpg':
//     case 'gif':
//     case 'bmp':
//     case 'png':
//       //etc
//       return true;
//   }
//   return false;
// }

// export function isVideo(filename: string) {
//   const ext = getExtension(filename);
//   switch (ext.toLowerCase()) {
//     case 'm4v':
//     case 'avi':
//     case 'mpg':
//     case 'mp4':
//       // etc
//       return true;
//   }
//   return false;
// }

// export function isPdf(filename: string) {
//   const ext = getExtension(filename);
//   switch (ext.toLowerCase()) {
//     case 'pdf':
//       //etc
//       return true;
//   }
//   return false;
// }

import { writeFile } from "fs/promises";
import path from "path";

export const uploadFiles = async (files: FileList) => {
  const uploadPromises = [];

  // Iterate through each file in the FileList
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = Date.now() + file.name.replaceAll(" ", "_");

    // Push each writeFile promise to the array
    uploadPromises.push(
      writeFile(path.join(process.cwd(), "public/uploads/" + filename), buffer)
    );
  }

  try {
    // Wait for all writeFile promises to resolve
    await Promise.all(uploadPromises);

    // Create an array of uploaded file paths
    const uploadedPaths = uploadPromises.map((_, index) => {
      const filename = Date.now() + files[index].name.replaceAll(" ", "_");
      return `/uploads/${filename}`;
    });

    return uploadedPaths;
    // return NextResponse.json({ Message: "Success", status: 201 });
  } catch (error) {
    console.log("Error occurred ", error);
    // return NextResponse.json({ Message: "Failed", status: 500 });
    throw error; // Rethrow the error to handle it further up the call stack if needed
  }
};
