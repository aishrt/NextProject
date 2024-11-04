export type CerQestionsType = {
  _id: string;
  question: string;
  limit: Number;

  createdAt: string;
  updatedAt: string;
  __v: boolean;
  serial: any;
  actions: any;
};

export type CerQestionsApiResponse = {
  data: CerQestionsType[];
  page?: number;
  currentPage: number;
  totalEntries: number;
};
