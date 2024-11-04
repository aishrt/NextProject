/* eslint-disable import/no-unresolved */
import React, { useState } from 'react';

export const useSelectFile = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPicturePreview] = useState<string>();

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPicturePreview(URL.createObjectURL(file));
      setFile(e.target.files[0]);
    }
  };

  return { file, preview, handleChange, setPicturePreview };
};

