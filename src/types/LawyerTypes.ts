export type LawyerType = {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    __v: boolean;
  };
  
  export type LawyerTypesApiResponse = {
    data: LawyerType[];
    page?: number;
    currentPage: number;
    totalEntries: number;
  };