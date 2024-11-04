// import { UploadResponse } from '@/types/UploadResponse';

import axios from "axios";

export type UploadDTO = {
  file: File;
};

export type UploadResponse = {
  url: string;
};

export const uploadImage = (data: UploadDTO): Promise<UploadResponse> => {
  console.log(data);

  const formData = new FormData();
  formData.append("file", data.file);
  return axios.post("/api/upload/uploadImage", formData);
};
