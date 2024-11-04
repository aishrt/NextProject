export type Member = {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  caseId?: string;
  user?: string;
  __v?: boolean;
};

export type MemberApiResponse = {
  data: Member[];
  page: number;
  currentPage: number;
  totalEntries: number;
};
