// import { getVideoCover } from '@/utils/getVideoCover';
import React, { useState } from "react";
import { uploadImage } from "@/hooks/uploadImage";
import { uploadFile } from "@/utils/upload";
type Image = {
  url: string;
  name: string;
};

type Video = {
  url: string;
  name: string;
};

export const useMultipleSelect = () => {
  const [images, setImages] = useState<string[]>([]);
  const [uploaded, setUploaded] = useState<Image[]>([]);
  const [videoUpload, setVideoUpload] = useState<Video[]>([]);

  const [load, setload] = useState<boolean>(false);
  const [text, setText] = useState<string[]>([]);
  const [about, setAbout] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  // const [cover, setCover] = useState<string>();
  // const [pdfName, setpdfName] = useState<string>();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const previews = [];
    const texts = text;
    const abouts = about;
    const uploads = uploaded;
    const files: any = e?.target?.files ?? [];

    for (const file of files) {
      if (file) {
        setload(true);
        const preview = URL.createObjectURL(file);

        previews.push(preview);
        texts.push("");
        abouts.push("");
        console.log(file, "44444");

         const res = await uploadImage({ file });
        // console.log(res,"jvnkjng");

        // uploads.push({ url: res.url, name: file.name });
        setload(false);
        // if (isVideo(file.name)) {
        //   const cov = await getVideoCover(file, 1.5);
        //   setCover(cov);
        // }
        // if (isPdf(file.name)) {
        //   const pdfName = file.name;
        //   setpdfName(pdfName);
        // }
      }
    }
    setUploaded(uploads);
    setload(load);
    setText(texts);
    setImages(images.concat(previews));
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const previews = [];
    const videos = videoUpload;
    const files: any = e?.target?.files ?? [];

    for (const file of files) {
      if (file) {
        setload(true);
        const preview = URL.createObjectURL(file);

        previews.push(preview);

        const res = await uploadImage({ file });
        videos.push({ url: res.url, name: file.name });

        setload(false);
      }
    }
    setVideoUpload(videos);
    setload(load);
  };

  const deleteImage = (val: number) => {
    const filteredItems = images.filter((_i, index) => index !== val);
    const uploadsItems = uploaded.filter((_i, index) => index !== val);
    const filteredNames = text.filter((_i, index) => index !== val);
    const filteredAbouts = about.filter((_i, index) => index !== val);
    setText(filteredNames);
    setAbout(filteredAbouts);
    setImages(filteredItems);
    setUploaded(uploadsItems);
  };

  const deleteVideo = (val: number) => {
    const uploadsVideo = videoUpload.filter((_i, index) => index !== val);
    setVideoUpload(uploadsVideo);
  };

  return {
    file,
    images,
    load,
    handleImageChange,
    handleVideoChange,
    setImages,
    setFile,
    uploaded,
    videoUpload,
    deleteImage,
    deleteVideo,
    text,
    about,
    setAbout,
    setText,
  };
};

export function getExtension(filename: string) {
  const parts = filename.split(".");
  return parts[parts.length - 1];
}

export function isImage(filename: string) {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "jpg":
    case "gif":
    case "bmp":
    case "png":
      //etc
      return true;
  }
  return false;
}

export function isVideo(filename: string) {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "m4v":
    case "avi":
    case "mpg":
    case "mp4":
      // etc
      return true;
  }
  return false;
}

export function isPdf(filename: string) {
  const ext = getExtension(filename);
  switch (ext.toLowerCase()) {
    case "pdf":
      //etc
      return true;
  }
  return false;
}
